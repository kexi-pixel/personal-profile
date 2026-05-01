"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FloatingCard } from "@/components/FloatingCard";
import { HeroEnergyCore } from "@/components/HeroEnergyCore";

const cards = [
  {
    id: "overview-bytedance",
    title: "ByteDance｜抖音电商双十一节盟计划",
    subtitle: "Platform Growth",
    detail: "参与节盟全流程运营，连接站外曝光、抖音搜索与站内转化链路。",
    metric: "Big Tech Marketing Experience",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.06, y: 0.08 },
  },
  {
    id: "overview-pg",
    title: "P&G｜618 全域营销与奥运直播专场",
    subtitle: "Brand Marketing",
    detail: "围绕 618 节点与奥运场景，参与全平台营销分析与直播玩法设计。",
    metric: "Growth Operations Strategy",
    accent: "blue" as const,
    desktopOnly: false,
    targetId: "experience-pg",
    initialPosition: { x: 0.77, y: 0.11 },
  },
  {
    id: "overview-merchant",
    title: "800+｜合作商家资源对接",
    subtitle: "Merchant Ops",
    detail: "支持节盟资源配置与商家落地，帮助快消品类高效匹配渠道与权益。",
    metric: "Merchant Coordination",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.08, y: 0.68 },
  },
  {
    id: "overview-content",
    title: "50+｜多平台内容产出",
    subtitle: "Content System",
    detail: "覆盖小红书、微博、B 站等内容适配与投放素材支持。",
    metric: "Content Marketing",
    accent: "silver" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.75, y: 0.67 },
  },
  {
    id: "overview-impact",
    title: "25%｜个护品类销售额提升",
    subtitle: "Business Impact",
    detail: "结合直播策划、产品卖点与营销策略优化，助力节点生意增长。",
    metric: "Business Results",
    accent: "blue" as const,
    desktopOnly: true,
    targetId: "experience-pg",
    initialPosition: { x: 0.19, y: 0.2 },
  },
  {
    id: "overview-data",
    title: "Data & AI Workflow｜SQL / SPSS / R / Codex / Claude Code",
    subtitle: "Analysis Layer",
    detail: "将数据分析与 AI 辅助工作流融入内容、分析与表达环节，提高执行效率。",
    metric: "Data-Driven Decision Making",
    accent: "cyan" as const,
    desktopOnly: true,
    targetId: "experience",
    initialPosition: { x: 0.64, y: 0.74 },
  },
];

type SceneLayout = {
  width: number;
  height: number;
  safeZone: { x: number; y: number; width: number; height: number } | null;
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
  const contentRef = useRef<HTMLDivElement>(null);
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
    const content = contentRef.current;
    if (!panel || !content) return;

    const updateLayout = () => {
      const panelRect = panel.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const isCompact = window.innerWidth < 1024;
      const paddingX = isCompact ? 24 : 54;
      const paddingY = isCompact ? 22 : 42;

      setLayout({
        width: panel.clientWidth,
        height: panel.clientHeight,
        safeZone: {
          x: contentRect.left - panelRect.left - paddingX,
          y: contentRect.top - panelRect.top - paddingY,
          width: contentRect.width + paddingX * 2,
          height: contentRect.height + paddingY * 2,
        },
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(panel);
    resizeObserver.observe(content);
    window.addEventListener("resize", updateLayout);
    const activeTimeouts = disturbanceTimeoutsRef.current;

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      activeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  const triggerDisturbance = (x: number, y: number, strength = 0.35) => {
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
    }, 880);
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
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-glow hero-glow-three" />

      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-start pt-6 lg:items-center lg:pt-0">
        <div
          ref={panelRef}
          className="glass-panel relative w-full overflow-hidden rounded-[40px] border border-white/60 px-6 py-14 shadow-[0_30px_120px_rgba(148,163,184,0.18)] sm:px-10 lg:px-16 lg:py-20 xl:px-24"
        >
          <div className="hero-fluid-stage absolute inset-0">
            <div className="hero-fluid-layer hero-fluid-layer-one" />
            <div className="hero-fluid-layer hero-fluid-layer-two" />
            <div className="hero-fluid-layer hero-fluid-layer-three" />
            <div className="hero-fluid-ribbon hero-fluid-ribbon-one" />
            <div className="hero-fluid-ribbon hero-fluid-ribbon-two" />
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
                className="pointer-events-none absolute z-[1] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.3),rgba(191,219,254,0.16)_38%,rgba(255,255,255,0)_72%)] blur-2xl"
                style={{
                  left: disturbance.x - 80,
                  top: disturbance.y - 80,
                  width: 160,
                  height: 160,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: disturbance.strength, scale: 1.08 }}
                exit={{ opacity: 0, scale: 1.16 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
            ref={contentRef}
            className="relative z-10 mx-auto flex max-w-3xl flex-col items-center py-24 text-center sm:py-28 lg:py-32"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {["大厂市场经历", "增长运营策略", "数据驱动决策"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/65 bg-white/56 px-4 py-2 text-xs text-slate-700 shadow-[0_12px_32px_rgba(255,255,255,0.26)] backdrop-blur-xl sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  "Big Tech Marketing Experience",
                  "Growth Operations Strategy",
                  "Data-Driven Decision Making",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/65 bg-white/56 px-4 py-2 text-xs text-slate-600 shadow-[0_12px_32px_rgba(255,255,255,0.26)] backdrop-blur-xl sm:text-sm"
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
                连接市场、运营与产品的复合型候选人
              </p>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-slate-500 sm:text-base">
                Marketing Growth &amp; Operations Strategy Candidate
              </p>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 [text-wrap:balance]">
              具备字节跳动与宝洁市场实习经历，关注增长运营、用户洞察与数据驱动决策，
              能够连接市场、运营与产品相关业务场景。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
