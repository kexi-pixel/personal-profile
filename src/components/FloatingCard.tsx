"use client";

import { useEffect, useRef, useState } from "react";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SafeZoneEllipse = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  padding: number;
};

type SceneLayout = {
  width: number;
  height: number;
  safeZone: SafeZoneEllipse | null;
};

type FloatingCardProps = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  metric: string;
  accent: "red" | "cyan" | "blue" | "silver";
  desktopOnly?: boolean;
  scene: SceneLayout;
  initialPosition: { x: number; y: number };
  onNavigate: () => void;
  onDisturbance: (x: number, y: number, strength?: number) => void;
};

const accentMap = {
  red: "from-white/84 via-sky-50/76 to-white/74 border-white/80 shadow-[0_18px_46px_rgba(59,130,246,0.12)]",
  cyan: "from-white/84 via-cyan-50/74 to-white/72 border-cyan-100/85 shadow-[0_18px_46px_rgba(56,189,248,0.14)]",
  blue: "from-white/86 via-sky-50/74 to-white/72 border-sky-100/85 shadow-[0_18px_46px_rgba(96,165,250,0.14)]",
  silver:
    "from-white/82 via-slate-50/70 to-white/72 border-white/80 shadow-[0_18px_46px_rgba(148,163,184,0.16)]",
} as const;

const OUTER_MARGIN = 18;
const CLICK_THRESHOLD = 7;

function clampRect(rect: Rect, scene: SceneLayout) {
  const maxX = Math.max(OUTER_MARGIN, scene.width - rect.width - OUTER_MARGIN);
  const maxY = Math.max(OUTER_MARGIN, scene.height - rect.height - OUTER_MARGIN);

  const originalX = rect.x;
  const originalY = rect.y;

  const clamped = {
    ...rect,
    x: Math.min(Math.max(rect.x, OUTER_MARGIN), maxX),
    y: Math.min(Math.max(rect.y, OUTER_MARGIN), maxY),
  };

  const axis =
    clamped.x !== originalX ? ("x" as const) : clamped.y !== originalY ? ("y" as const) : null;

  return { rect: clamped, axis };
}

function resolveSafeZoneCollision(rect: Rect, safeZone: SafeZoneEllipse | null) {
  if (!safeZone) {
    return {
      rect,
      collided: false,
      normalX: 0,
      normalY: 0,
      penetration: 0,
    };
  }

  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const expandedRadiusX = safeZone.radiusX + rect.width / 2 + safeZone.padding;
  const expandedRadiusY = safeZone.radiusY + rect.height / 2 + safeZone.padding;

  let dx = centerX - safeZone.centerX;
  let dy = centerY - safeZone.centerY;
  let nx = dx / expandedRadiusX;
  let ny = dy / expandedRadiusY;
  let distance = Math.hypot(nx, ny);

  if (distance >= 1) {
    return {
      rect,
      collided: false,
      normalX: 0,
      normalY: 0,
      penetration: 0,
    };
  }

  if (distance < 0.0001) {
    dx = 0;
    dy = -1;
    nx = 0;
    ny = -1;
    distance = 0;
  }

  const unitX = nx / Math.max(distance, 0.0001);
  const unitY = ny / Math.max(distance, 0.0001);
  const boundaryCenterX = safeZone.centerX + unitX * expandedRadiusX;
  const boundaryCenterY = safeZone.centerY + unitY * expandedRadiusY;

  return {
    rect: {
      ...rect,
      x: boundaryCenterX - rect.width / 2,
      y: boundaryCenterY - rect.height / 2,
    },
    collided: true,
    normalX: unitX,
    normalY: unitY,
    penetration: 1 - distance,
  };
}

export function FloatingCard({
  id,
  title,
  subtitle,
  detail,
  metric,
  accent,
  desktopOnly = false,
  scene,
  initialPosition,
  onNavigate,
  onDisturbance,
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const cardSizeRef = useRef({ width: desktopOnly ? 250 : 232, height: 0 });
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const pointerLastRef = useRef({ x: 0, y: 0, time: 0 });
  const totalDragDistanceRef = useRef(0);
  const collisionCooldownRef = useRef(0);
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const updateSize = () => {
      cardSizeRef.current = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scene.width || !scene.height) return;

    const width = cardSizeRef.current.width || 232;
    const height = cardSizeRef.current.height || 0;
    const proposed = {
      x: scene.width * initialPosition.x,
      y: scene.height * initialPosition.y,
      width,
      height,
    };
    const clamped = clampRect(proposed, scene);
    const resolved = resolveSafeZoneCollision(clamped.rect, scene.safeZone);

    stateRef.current.x = resolved.rect.x;
    stateRef.current.y = resolved.rect.y;
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;

    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${resolved.rect.x}px, ${resolved.rect.y}px, 0)`;
    }
  }, [scene, initialPosition]);

  useEffect(() => {
    if (!scene.width || !scene.height) return;

    let lastTime = performance.now();

    const tick = (time: number) => {
      const element = cardRef.current;
      if (!element) return;

      const dt = Math.min((time - lastTime) / 16.667, 1.6);
      lastTime = time;

      if (!draggingRef.current) {
        const state = stateRef.current;
        state.vx *= 0.94;
        state.vy *= 0.94;

        if (Math.abs(state.vx) < 0.006) state.vx = 0;
        if (Math.abs(state.vy) < 0.006) state.vy = 0;

        const nextRect = {
          x: state.x + state.vx * 16 * dt,
          y: state.y + state.vy * 16 * dt,
          width: cardSizeRef.current.width,
          height: cardSizeRef.current.height,
        };

        const before = { x: nextRect.x, y: nextRect.y };
        const clamped = clampRect(nextRect, scene);
        const resolved = resolveSafeZoneCollision(clamped.rect, scene.safeZone);

        state.x = resolved.rect.x;
        state.y = resolved.rect.y;

        if (resolved.collided && time - collisionCooldownRef.current > 120) {
          collisionCooldownRef.current = time;
          const speed = state.vx * resolved.normalX + state.vy * resolved.normalY;

          if (speed < 0) {
            state.vx -= speed * resolved.normalX * 1.28;
            state.vy -= speed * resolved.normalY * 1.28;
          }

          state.vx += resolved.normalX * Math.min(0.22, 0.08 + resolved.penetration * 0.26);
          state.vy += resolved.normalY * Math.min(0.22, 0.08 + resolved.penetration * 0.26);
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.12);
        } else if (clamped.axis === "x" && time - collisionCooldownRef.current > 120) {
          collisionCooldownRef.current = time;
          state.vx *= -0.28;
          state.vy *= 0.9;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.16);
        } else if (clamped.axis === "y" && time - collisionCooldownRef.current > 120) {
          collisionCooldownRef.current = time;
          state.vy *= -0.28;
          state.vx *= 0.9;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.16);
        } else if (before.x !== resolved.rect.x || before.y !== resolved.rect.y) {
          state.vx *= 0.82;
          state.vy *= 0.82;
        }
      }

      element.style.transform = `translate3d(${stateRef.current.x}px, ${stateRef.current.y}px, 0)`;
      element.style.zIndex = draggingRef.current ? "9" : "6";

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [scene, onDisturbance]);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      data-card-id={id}
      className={[
        "floating-card absolute left-0 top-0 z-[6] w-[232px] rounded-[28px] border bg-gradient-to-br px-5 py-4 text-left backdrop-blur-md transition-[box-shadow,transform,background-color,border-color] duration-300 will-change-transform xl:w-[248px]",
        accentMap[accent],
        desktopOnly ? "hidden xl:block" : "block",
        isDragging ? "shadow-[0_24px_58px_rgba(59,130,246,0.18)]" : "",
        scene.width ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onPointerDown={(event) => {
        const element = cardRef.current;
        if (!element) return;

        pointerIdRef.current = event.pointerId;
        draggingRef.current = true;
        dragMovedRef.current = false;
        setIsDragging(true);

        const rect = element.getBoundingClientRect();
        pointerOffsetRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        pointerLastRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: performance.now(),
        };
        totalDragDistanceRef.current = 0;
        element.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return;

        const host = cardRef.current?.parentElement;
        if (!host) return;

        const hostRect = host.getBoundingClientRect();
        const nextRect = {
          x: event.clientX - hostRect.left - pointerOffsetRef.current.x,
          y: event.clientY - hostRect.top - pointerOffsetRef.current.y,
          width: cardSizeRef.current.width,
          height: cardSizeRef.current.height,
        };

        const clamped = clampRect(nextRect, scene);
        const resolved = resolveSafeZoneCollision(clamped.rect, scene.safeZone);
        const state = stateRef.current;

        const now = performance.now();
        const deltaTime = Math.max(now - pointerLastRef.current.time, 8);
        const pointerDeltaX = event.clientX - pointerLastRef.current.x;
        const pointerDeltaY = event.clientY - pointerLastRef.current.y;
        totalDragDistanceRef.current += Math.hypot(pointerDeltaX, pointerDeltaY);

        if (totalDragDistanceRef.current > CLICK_THRESHOLD) {
          dragMovedRef.current = true;
        }

        state.vx = (resolved.rect.x - state.x) / deltaTime;
        state.vy = (resolved.rect.y - state.y) / deltaTime;
        state.x = resolved.rect.x;
        state.y = resolved.rect.y;
        pointerLastRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: now,
        };

        onDisturbance(
          state.x + cardSizeRef.current.width / 2,
          state.y + cardSizeRef.current.height / 2,
          0.08,
        );
      }}
      onPointerUp={(event) => {
        if (pointerIdRef.current !== event.pointerId) return;

        draggingRef.current = false;
        pointerIdRef.current = null;
        setIsDragging(false);
        cardRef.current?.releasePointerCapture(event.pointerId);

        stateRef.current.vx *= 11;
        stateRef.current.vy *= 11;
        stateRef.current.vx = Math.max(Math.min(stateRef.current.vx, 1.2), -1.2);
        stateRef.current.vy = Math.max(Math.min(stateRef.current.vy, 1.2), -1.2);

        if (!dragMovedRef.current) {
          onNavigate();
        }
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        pointerIdRef.current = null;
        setIsDragging(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate();
        }
      }}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
            {subtitle}
          </p>
          <h3 className="text-sm font-semibold leading-6 text-slate-900">{title}</h3>
        </div>

        <p className="text-xs leading-5 text-slate-600/95">{detail}</p>

        <div className="inline-flex rounded-full border border-white/75 bg-white/58 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500/95">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
}
