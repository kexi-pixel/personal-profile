"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  hue: string;
};

const palette = [
  "rgba(125, 211, 252, 0.42)",
  "rgba(191, 219, 254, 0.36)",
  "rgba(255, 255, 255, 0.42)",
];

export function HeroParticles() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const emit = (x: number, y: number, burst = false) => {
      const now = performance.now();
      if (!burst && now - lastEmitRef.current < 14) return;
      lastEmitRef.current = now;

      const count = burst ? 4 : 1;
      for (let index = 0; index < count; index += 1) {
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.9;
        const speed = burst ? 0.5 + Math.random() * 0.8 : 0.25 + Math.random() * 0.35;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.22,
          vy: Math.sin(angle) * speed - Math.random() * 0.12,
          life: 0,
          ttl: burst ? 34 + Math.random() * 12 : 22 + Math.random() * 10,
          size: burst ? 1.8 + Math.random() * 2.4 : 1 + Math.random() * 1.6,
          hue: palette[Math.floor(Math.random() * palette.length)],
        });
      }

      particlesRef.current = particlesRef.current.slice(-60);
    };

    const animate = () => {
      const rect = host.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current = particlesRef.current.filter((particle) => particle.life < particle.ttl);

      for (const particle of particlesRef.current) {
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.995;
        particle.vy = particle.vy * 0.992 - 0.002;

        const alpha = 1 - particle.life / particle.ttl;
        const radius = particle.size * (0.8 + (particle.life / particle.ttl) * 0.9);

        ctx.beginPath();
        ctx.fillStyle = particle.hue.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.shadowColor = particle.hue.replace(/[\d.]+\)$/, `${alpha * 0.9})`);
        ctx.shadowBlur = 10;
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const getPoint = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handleMove = (event: PointerEvent) => {
      const point = getPoint(event);
      emit(point.x, point.y, false);
    };

    const handleDown = (event: PointerEvent) => {
      const point = getPoint(event);
      emit(point.x, point.y, true);
    };

    resize();
    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", handleMove, { passive: true });
    host.addEventListener("pointerdown", handleDown, { passive: true });

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerdown", handleDown);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
