"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FloatingCard } from "@/components/FloatingCard";
import { HeroEnergyCore } from "@/components/HeroEnergyCore";

const cards = [
  {
    id: "overview-bytedance",
    title: "ByteDance｜站外整合营销策略",
    subtitle: "Integrated Marketing",
    detail: "围绕地标、交通线、梯媒与内容平台，搭建曝光触达至转化复盘链路。",
    metric: "GTM Touchpoint Strategy",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.06, y: 0.12 },
  },
  {
    id: "overview-pg",
    title: "P&G｜品牌增长与直播场域设计",
    subtitle: "Brand Growth",
    detail: "复盘 618 跨平台表现，并围绕奥运节点设计内容、互动与转化路径。",
    metric: "Brand Growth & Conversion",
    accent: "blue" as const,
    desktopOnly: false,
    targetId: "experience-pg",
    initialPosition: { x: 0.77, y: 0.13 },
  },
  {
    id: "overview-merchant",
    title: "800+｜合作商家资源对接",
    subtitle: "Resource Strategy",
    detail: "梳理站外资源特征、渠道系数与兑换逻辑，支持商家选型及投放配置。",
    metric: "Go-to-Market Operations",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.09, y: 0.64 },
  },
  {
    id: "overview-content",
    title: "50+｜标准化引流话术",
    subtitle: "Content SOP",
    detail: "覆盖 30+ 商家投放，统一多平台表达并提升方案复用与复盘效率。",
    metric: "Cross-platform Content",
    accent: "silver" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.74, y: 0.65 },
  },
  {
    id: "overview-impact",
    title: "53%｜直播转化率提升",
    subtitle: "Conversion Impact",
    detail: "设计预热节奏、互动机制、货盘组合与卖点包装，单场 GMV 创同期新高。",
    metric: "Live Commerce Growth",
    accent: "blue" as const,
    desktopOnly: true,
    targetId: "experience-pg",
    initialPosition: { x: 0.17, y: 0.33 },
  },
  {
    id: "overview-data",
    title: "Data & AI｜SQL / SPSS / Python / R / LLMs",
    subtitle: "Analysis Layer",
    detail: "用数据分析与 AI 工具支持信息整合、研究分析、内容撰写与任务协同。",
    metric: "Data & AI Workflow",
    accent: "cyan" as const,
    desktopOnly: true,
    targetId: "experience",
    initialPosition: { x: 0.67, y: 0.76 },
  },
];

type SceneLayout = {
  width: number;
  height: number;
  safeZone: null;
};

type Disturbance = {
  id: number;
  x: number;
  y: number;
  strength: number;
};

export function Hero() {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const disturbanceIdRef = useRef(0);
  const disturbanceTimeoutsRef = useRef<number[]>([]);
  const [layout, setLayout] = useState<SceneLayout>({
    width: 0,
    height: 0,
    safeZone: null,
  });
  const [disturbances, setDisturbances] = useState<Disturbance[]>([]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const updateLayout = () => {
      setLayout({
        width: panel.clientWidth,
        height: panel.clientHeight,
        safeZone: null,
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(panel);
    window.addEventListener("resize", updateLayout);
    const activeTimeouts = disturbanceTimeoutsRef.current;

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      activeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  const triggerDisturbance = (x: number, y: number, strength = 0.28) => {
    if (reducedMotion) return;

    const disturbance = {
      id: disturbanceIdRef.current++,
      x,
      y,
      strength,
    };

    setDisturbances((current) => [...current.slice(-2), disturbance]);
    const timeout = window.setTimeout(() => {
      setDisturbances((current) => current.filter((item) => item.id !== disturbance.id));
    }, 760);
    disturbanceTimeoutsRef.current.push(timeout);
  };

  const navigateToTarget = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    const timeout = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("overview-card-focus", {
          detail: { targetId },
        }),
      );
    }, 700);
    disturbanceTimeoutsRef.current.push(timeout);
  };

  return (
    <section
      id="overview"
      className="relative isolate min-h-screen overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="hero-atmosphere hero-atmosphere-left" />
      <div className="hero-atmosphere hero-atmosphere-right" />

      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-start pt-6 lg:items-center lg:pt-0">
        <div
          ref={panelRef}
          className="overview-interactive-shell overview-no-select glass-panel hero-shell relative w-full overflow-hidden rounded-[40px] border border-white/70 px-6 py-14 shadow-[0_40px_120px_rgba(37,99,235,0.12)] sm:px-10 lg:px-16 lg:py-20 xl:px-24"
        >
          <div className="hero-fluid-stage absolute inset-0">
            <div className="hero-plasma-field hero-plasma-field-main" />
            <div className="hero-plasma-field hero-plasma-field-secondary" />
            <div className="hero-plasma-stream hero-plasma-stream-one" />
            <div className="hero-plasma-stream hero-plasma-stream-two" />
            <div className="hero-plasma-ring hero-plasma-ring-one" />
            <div className="hero-plasma-ring hero-plasma-ring-two" />
            <div className="hero-flame-edge hero-flame-edge-left" />
            <div className="hero-flame-edge hero-flame-edge-right" />
            <div className="hero-fluid-contour" />
            <div className="hero-fluid-glow hero-fluid-glow-one" />
            <div className="hero-fluid-glow hero-fluid-glow-two" />
            <div className="hero-fluid-grain" />
          </div>
          <HeroEnergyCore />
          <AnimatePresence>
            {disturbances.map((disturbance) => (
              <motion.div
                key={disturbance.id}
                className="pointer-events-none absolute z-[2] rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.36),rgba(147,197,253,0.16)_42%,rgba(255,255,255,0)_76%)] blur-2xl"
                style={{
                  left: disturbance.x - 54,
                  top: disturbance.y - 54,
                  width: 108,
                  height: 108,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: disturbance.strength, scale: 1.12 }}
                exit={{ opacity: 0, scale: 1.22 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </AnimatePresence>

          {cards.map((card) => (
            <FloatingCard
              key={card.id}
              id={card.id}
              title={card.title}
              subtitle={card.subtitle}
              detail={card.detail}
              metric={card.metric}
              accent={card.accent}
              desktopOnly={card.desktopOnly}
              scene={layout}
              initialPosition={card.initialPosition}
              onNavigate={() => navigateToTarget(card.targetId)}
              onDisturbance={triggerDisturbance}
            />
          ))}

          <motion.div
            className="pointer-events-none relative z-20 mx-auto flex max-w-3xl flex-col items-center py-24 text-center sm:py-28 lg:py-32"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {["整合营销策略", "品牌增长运营", "数据驱动复盘"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/75 bg-white/64 px-4 py-2 text-xs text-slate-700 shadow-[0_14px_36px_rgba(255,255,255,0.2)] backdrop-blur-md sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  "GTM Touchpoint Strategy",
                  "Brand Growth & Conversion",
                  "Data & AI Workflow",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/72 bg-white/58 px-4 py-2 text-xs text-slate-600 shadow-[0_12px_28px_rgba(191,219,254,0.16)] backdrop-blur-md sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-6xl lg:text-7xl">
              陈京岳
              <span className="mt-3 block font-mono text-lg font-medium uppercase tracking-[0.28em] text-slate-500 sm:text-xl">
                Jingyue Chen
              </span>
            </h1>

            <div className="mt-10 space-y-4">
              <p className="text-2xl font-medium tracking-[-0.05em] text-slate-900 sm:text-3xl [text-wrap:balance]">
                GTM、整合营销策略与品牌增长候选人
              </p>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-slate-500 sm:text-base">
                GTM, Integrated Marketing &amp; Brand Growth Candidate
              </p>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 [text-wrap:balance]">
              具备字节跳动整合营销策略运营、宝洁品牌增长与国家电网市场营销实习经历，
              能够围绕用户触点、内容策略和转化链路完成分析、执行与复盘。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
