"use client";

import { useEffect, useRef, useState } from "react";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SceneLayout = {
  width: number;
  height: number;
  safeZone: Rect | null;
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
  red: "from-white/78 via-white/60 to-sky-50/58 border-white/70 shadow-[0_18px_50px_rgba(125,211,252,0.12)]",
  cyan: "from-white/80 via-cyan-50/54 to-white/58 border-cyan-100/80 shadow-[0_18px_50px_rgba(125,211,252,0.14)]",
  blue: "from-white/82 via-sky-50/52 to-white/58 border-sky-100/80 shadow-[0_18px_50px_rgba(191,219,254,0.14)]",
  silver:
    "from-white/78 via-slate-50/46 to-white/54 border-white/75 shadow-[0_18px_50px_rgba(226,232,240,0.18)]",
} as const;

const OUTER_MARGIN = 18;
const CLICK_THRESHOLD = 7;

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

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

function computeFocusIntensity(rect: Rect, safeZone: Rect | null) {
  if (!safeZone) return 0;

  const fadeRadius = 170;
  const dx = Math.max(safeZone.x - (rect.x + rect.width), rect.x - (safeZone.x + safeZone.width), 0);
  const dy = Math.max(safeZone.y - (rect.y + rect.height), rect.y - (safeZone.y + safeZone.height), 0);
  const distance = Math.hypot(dx, dy);

  let intensity = Math.max(0, 1 - distance / fadeRadius);
  if (overlaps(rect, safeZone)) {
    intensity = 1;
  }

  return intensity;
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
  const visualStateRef = useRef({ current: 0, target: 0 });
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
    const { rect } = clampRect(proposed, scene);
    stateRef.current.x = rect.x;
    stateRef.current.y = rect.y;
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;
    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
    }
    visualStateRef.current.current = computeFocusIntensity(rect, scene.safeZone);
    visualStateRef.current.target = visualStateRef.current.current;
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
        const result = clampRect(nextRect, scene);
        state.x = result.rect.x;
        state.y = result.rect.y;

        if (result.axis === "x" && time - collisionCooldownRef.current > 120) {
          collisionCooldownRef.current = time;
          state.vx *= -0.28;
          state.vy *= 0.9;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.18);
        } else if (result.axis === "y" && time - collisionCooldownRef.current > 120) {
          collisionCooldownRef.current = time;
          state.vy *= -0.28;
          state.vx *= 0.9;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.18);
        } else if (before.x !== result.rect.x || before.y !== result.rect.y) {
          state.vx *= 0.82;
          state.vy *= 0.82;
        }
      }

      const visualRect = {
        x: stateRef.current.x,
        y: stateRef.current.y,
        width: cardSizeRef.current.width,
        height: cardSizeRef.current.height,
      };
      visualStateRef.current.target = computeFocusIntensity(visualRect, scene.safeZone);
      visualStateRef.current.current +=
        (visualStateRef.current.target - visualStateRef.current.current) * 0.12;

      const focusIntensity = visualStateRef.current.current;
      const focusScale = 1 - focusIntensity * 0.028;
      const focusOpacity = 1 - focusIntensity * 0.46;
      const blur = focusIntensity * 7.5;
      const saturate = 1 - focusIntensity * 0.22;
      const contrast = 1 - focusIntensity * 0.12;
      const brightness = 1 + focusIntensity * 0.04;

      element.style.transform = `translate3d(${stateRef.current.x}px, ${stateRef.current.y}px, 0) scale(${focusScale})`;
      element.style.opacity = `${focusOpacity}`;
      element.style.filter = `blur(${blur}px) saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`;
      element.style.zIndex = focusIntensity > 0.08 ? "1" : "2";

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
        "floating-card absolute left-0 top-0 z-[2] w-[232px] rounded-[28px] border bg-gradient-to-br px-5 py-4 text-left backdrop-blur-2xl transition-[opacity,box-shadow,transform,background-color] duration-300 will-change-transform xl:w-[248px]",
        accentMap[accent],
        desktopOnly ? "hidden xl:block" : "block",
        isDragging ? "opacity-100 shadow-[0_22px_60px_rgba(125,211,252,0.16)]" : "",
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

        const resolved = clampRect(nextRect, scene);
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

        if (cardRef.current) {
          const focusIntensity = computeFocusIntensity(
            {
              x: state.x,
              y: state.y,
              width: cardSizeRef.current.width,
              height: cardSizeRef.current.height,
            },
            scene.safeZone,
          );
          visualStateRef.current.target = focusIntensity;
        }

        onDisturbance(
          state.x + cardSizeRef.current.width / 2,
          state.y + cardSizeRef.current.height / 2,
          0.1,
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
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500/90">
            {subtitle}
          </p>
          <h3 className="text-sm font-semibold leading-6 text-slate-900">{title}</h3>
        </div>

        <p className="text-xs leading-5 text-slate-600">{detail}</p>

        <div className="inline-flex rounded-full border border-white/70 bg-white/48 px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
}
