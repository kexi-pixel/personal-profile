"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function HeroEnergyCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.tx = nx;
      pointer.ty = ny;
    };

    const drawLoop = (
      cx: number,
      cy: number,
      radius: number,
      time: number,
      wobble: number,
      rotation: number,
      lineWidth: number,
      colorStops: string[],
      alpha: number,
    ) => {
      const points = reducedMotion ? 88 : 120;
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);
      context.beginPath();

      for (let index = 0; index <= points; index += 1) {
        const t = (index / points) * Math.PI * 2;
        const harmonicA = Math.sin(t * 2.3 + time * 0.7) * wobble;
        const harmonicB = Math.cos(t * 5.1 - time * 0.45) * wobble * 0.48;
        const harmonicC = Math.sin(t * 9.2 + time * 0.28) * wobble * 0.14;
        const r = radius + harmonicA + harmonicB + harmonicC;
        const x = Math.cos(t) * r;
        const y = Math.sin(t) * r;

        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      const gradient = context.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, colorStops[0]);
      gradient.addColorStop(0.5, colorStops[1]);
      gradient.addColorStop(1, colorStops[2]);

      context.strokeStyle = gradient;
      context.globalAlpha = alpha;
      context.lineWidth = lineWidth;
      context.shadowBlur = 18;
      context.shadowColor = "rgba(191,219,254,0.22)";
      context.stroke();
      context.restore();
    };

    let frame = 0;
    let rafId = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      frame += reducedMotion ? 0.0035 : 0.008;

      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;

      context.clearRect(0, 0, width, height);

      const centerX = width * 0.56 + pointer.x * 16;
      const centerY = height * 0.5 + pointer.y * 10;
      const baseRadius = Math.min(width, height) * (width < 768 ? 0.14 : 0.17);
      const breath = 1 + Math.sin(frame * 1.8) * 0.028;

      const aura = context.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.24,
        centerX,
        centerY,
        baseRadius * 1.46,
      );
      aura.addColorStop(0, "rgba(255,255,255,0.14)");
      aura.addColorStop(0.35, "rgba(224,242,254,0.12)");
      aura.addColorStop(0.72, "rgba(191,219,254,0.08)");
      aura.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = aura;
      context.beginPath();
      context.arc(centerX, centerY, baseRadius * 1.46, 0, Math.PI * 2);
      context.fill();

      const innerGlow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 0.9,
      );
      innerGlow.addColorStop(0, "rgba(255,255,255,0.16)");
      innerGlow.addColorStop(0.4, "rgba(219,234,254,0.1)");
      innerGlow.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = innerGlow;
      context.beginPath();
      context.arc(centerX, centerY, baseRadius * 0.9, 0, Math.PI * 2);
      context.fill();

      drawLoop(
        centerX,
        centerY,
        baseRadius * breath,
        frame,
        baseRadius * 0.085,
        frame * 0.08,
        1.35,
        ["rgba(255,255,255,0.14)", "rgba(224,242,254,0.52)", "rgba(191,219,254,0.16)"],
        0.72,
      );

      drawLoop(
        centerX,
        centerY,
        baseRadius * 0.78 * (1 + Math.sin(frame * 1.2 + 1.8) * 0.02),
        frame + 1.4,
        baseRadius * 0.06,
        -frame * 0.06,
        0.95,
        ["rgba(255,255,255,0.08)", "rgba(186,230,253,0.38)", "rgba(255,255,255,0.1)"],
        0.56,
      );

      drawLoop(
        centerX,
        centerY,
        baseRadius * 1.12 * (1 + Math.cos(frame * 0.9 + 0.8) * 0.018),
        frame + 3.1,
        baseRadius * 0.042,
        frame * 0.035,
        0.8,
        ["rgba(255,255,255,0.04)", "rgba(219,234,254,0.22)", "rgba(255,255,255,0.03)"],
        0.44,
      );

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    resize();
    render();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", handleMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-energy-core pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
