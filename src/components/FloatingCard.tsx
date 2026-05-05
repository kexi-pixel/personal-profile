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
  safeZone: null;
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
const CLICK_THRESHOLD = 6;
const VELOCITY_SAMPLE_WINDOW_MS = 72;
const MAX_VELOCITY_SAMPLES = 4;
const MAX_RELEASE_VELOCITY = 0.22;
const FRICTION_BASE = 0.82;
const VELOCITY_STOP_THRESHOLD = 0.003;
const BOUNCE_DAMPING = 0.16;
const TANGENTIAL_DAMPING = 0.82;
const DISTURBANCE_INTERVAL_MS = 64;
const DISTURBANCE_DISTANCE_PX = 24;

type VelocitySample = {
  vx: number;
  vy: number;
  time: number;
};

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
  const suppressClickRef = useRef(false);
  const cardSizeRef = useRef({ width: desktopOnly ? 250 : 232, height: 0 });
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const pointerLastRef = useRef({ x: 0, y: 0, time: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const totalDragDistanceRef = useRef(0);
  const disturbanceSampleRef = useRef({ x: 0, y: 0, time: 0 });
  const velocitySamplesRef = useRef<VelocitySample[]>([]);
  const reducedInteractionRef = useRef(false);
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isReducedInteraction, setIsReducedInteraction] = useState(false);

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
    const mediaQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");

    const syncReducedInteraction = () => {
      reducedInteractionRef.current = mediaQuery.matches;
      setIsReducedInteraction(mediaQuery.matches);

      if (mediaQuery.matches) {
        draggingRef.current = false;
        pointerIdRef.current = null;
        velocitySamplesRef.current = [];
        stateRef.current.vx = 0;
        stateRef.current.vy = 0;
      }
    };

    syncReducedInteraction();
    mediaQuery.addEventListener("change", syncReducedInteraction);

    return () => {
      mediaQuery.removeEventListener("change", syncReducedInteraction);
    };
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

    stateRef.current.x = clamped.rect.x;
    stateRef.current.y = clamped.rect.y;
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;

    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${clamped.rect.x}px, ${clamped.rect.y}px, 0)`;
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
        const friction = Math.pow(FRICTION_BASE, dt);
        state.vx *= friction;
        state.vy *= friction;

        if (Math.abs(state.vx) < VELOCITY_STOP_THRESHOLD) state.vx = 0;
        if (Math.abs(state.vy) < VELOCITY_STOP_THRESHOLD) state.vy = 0;

        const nextRect = {
          x: state.x + state.vx * 16 * dt,
          y: state.y + state.vy * 16 * dt,
          width: cardSizeRef.current.width,
          height: cardSizeRef.current.height,
        };

        const clamped = clampRect(nextRect, scene);

        state.x = clamped.rect.x;
        state.y = clamped.rect.y;

        if (clamped.axis === "x") {
          state.vx = -state.vx * BOUNCE_DAMPING;
          state.vy *= TANGENTIAL_DAMPING;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.1);
        } else if (clamped.axis === "y") {
          state.vy = -state.vy * BOUNCE_DAMPING;
          state.vx *= TANGENTIAL_DAMPING;
          onDisturbance(state.x + nextRect.width / 2, state.y + nextRect.height / 2, 0.1);
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
        !isReducedInteraction && isDragging ? "cursor-grabbing" : !isReducedInteraction ? "cursor-grab" : "",
        isDragging ? "shadow-[0_24px_58px_rgba(59,130,246,0.18)]" : "",
        scene.width ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onPointerDown={(event) => {
        const element = cardRef.current;
        if (!element || !event.isPrimary || event.button !== 0 || reducedInteractionRef.current) return;

        event.preventDefault();

        pointerIdRef.current = event.pointerId;
        draggingRef.current = true;
        dragMovedRef.current = false;
        suppressClickRef.current = false;
        setIsDragging(true);

        const rect = element.getBoundingClientRect();
        pointerOffsetRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
        pointerLastRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: performance.now(),
        };
        disturbanceSampleRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: performance.now(),
        };
        velocitySamplesRef.current = [];
        totalDragDistanceRef.current = 0;
        element.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return;

        const element = cardRef.current;
        const host = element?.parentElement;
        if (!element || !host) return;

        const hostRect = host.getBoundingClientRect();
        const nextRect = {
          x: event.clientX - hostRect.left - pointerOffsetRef.current.x,
          y: event.clientY - hostRect.top - pointerOffsetRef.current.y,
          width: cardSizeRef.current.width,
          height: cardSizeRef.current.height,
        };

        const clamped = clampRect(nextRect, scene);
        const state = stateRef.current;

        const now = performance.now();
        const deltaTime = Math.max(now - pointerLastRef.current.time, 8);
        const pointerDeltaX = event.clientX - pointerLastRef.current.x;
        const pointerDeltaY = event.clientY - pointerLastRef.current.y;
        const distanceFromStart = Math.hypot(
          event.clientX - pointerStartRef.current.x,
          event.clientY - pointerStartRef.current.y,
        );
        totalDragDistanceRef.current += Math.hypot(pointerDeltaX, pointerDeltaY);

        if (
          distanceFromStart > CLICK_THRESHOLD ||
          totalDragDistanceRef.current > CLICK_THRESHOLD
        ) {
          dragMovedRef.current = true;
          suppressClickRef.current = true;
        }

        state.vx = (clamped.rect.x - state.x) / deltaTime;
        state.vy = (clamped.rect.y - state.y) / deltaTime;
        state.x = clamped.rect.x;
        state.y = clamped.rect.y;
        velocitySamplesRef.current = [
          ...velocitySamplesRef.current.filter((sample) => now - sample.time <= VELOCITY_SAMPLE_WINDOW_MS),
          { vx: state.vx, vy: state.vy, time: now },
        ].slice(-MAX_VELOCITY_SAMPLES);
        element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
        element.style.zIndex = "9";
        pointerLastRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: now,
        };

        const disturbanceDelta = Math.hypot(
          event.clientX - disturbanceSampleRef.current.x,
          event.clientY - disturbanceSampleRef.current.y,
        );
        if (
          now - disturbanceSampleRef.current.time > DISTURBANCE_INTERVAL_MS ||
          disturbanceDelta > DISTURBANCE_DISTANCE_PX
        ) {
          disturbanceSampleRef.current = {
            x: event.clientX,
            y: event.clientY,
            time: now,
          };
          onDisturbance(
            state.x + cardSizeRef.current.width / 2,
            state.y + cardSizeRef.current.height / 2,
            0.07,
          );
        }
      }}
      onPointerUp={(event) => {
        if (pointerIdRef.current !== event.pointerId) return;

        event.preventDefault();
        draggingRef.current = false;
        pointerIdRef.current = null;
        setIsDragging(false);
        cardRef.current?.releasePointerCapture(event.pointerId);

        const recentSamples = velocitySamplesRef.current.filter(
          (sample) => event.timeStamp - sample.time <= VELOCITY_SAMPLE_WINDOW_MS,
        );

        if (recentSamples.length > 0) {
          let totalWeight = 0;
          let weightedVx = 0;
          let weightedVy = 0;

          for (let index = 0; index < recentSamples.length; index += 1) {
            const weight = index + 1;
            totalWeight += weight;
            weightedVx += recentSamples[index].vx * weight;
            weightedVy += recentSamples[index].vy * weight;
          }

          stateRef.current.vx = weightedVx / totalWeight;
          stateRef.current.vy = weightedVy / totalWeight;
        } else {
          stateRef.current.vx = 0;
          stateRef.current.vy = 0;
        }

        stateRef.current.vx = Math.max(
          Math.min(stateRef.current.vx, MAX_RELEASE_VELOCITY),
          -MAX_RELEASE_VELOCITY,
        );
        stateRef.current.vy = Math.max(
          Math.min(stateRef.current.vy, MAX_RELEASE_VELOCITY),
          -MAX_RELEASE_VELOCITY,
        );
        velocitySamplesRef.current = [];

        if (!suppressClickRef.current && !dragMovedRef.current) {
          onNavigate();
        }
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        pointerIdRef.current = null;
        dragMovedRef.current = false;
        suppressClickRef.current = false;
        velocitySamplesRef.current = [];
        setIsDragging(false);
      }}
      onLostPointerCapture={() => {
        draggingRef.current = false;
        pointerIdRef.current = null;
        velocitySamplesRef.current = [];
        setIsDragging(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate();
        }
      }}
    >
      <div className="pointer-events-none space-y-3">
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
