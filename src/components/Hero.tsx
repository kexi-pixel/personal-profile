"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FloatingCard } from "@/components/FloatingCard";
import { HeroEnergyCore } from "@/components/HeroEnergyCore";

const cards = [
  {
    id: "overview-didi-partnership",
    title: "滴滴｜全国异业增长",
    subtitle: "Partnership Growth",
    detail: "从 0 搭建低成本 BD 模型，主导花小猪 × 德克士全国合作。",
    metric: "1.34 亿曝光｜CPM 2.5",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-didi",
    initialPosition: { x: 0.06, y: 0.12 },
  },
  {
    id: "overview-bytedance",
    title: "字节跳动｜电商 GTM",
    subtitle: "E-commerce GTM",
    detail: "支持双十一节盟计划商家、营销物料与渠道资源上线协同。",
    metric: "800+ 商家｜使用率 90%",
    accent: "blue" as const,
    desktopOnly: false,
    targetId: "experience-bytedance",
    initialPosition: { x: 0.77, y: 0.13 },
  },
  {
    id: "overview-dalian",
    title: "大连｜城市增长",
    subtitle: "City Growth",
    detail: "以用户洞察与资源评估搭建曝光、到访、呼叫及完单增长链路。",
    metric: "完单份额 10.85% → 15.12%",
    accent: "cyan" as const,
    desktopOnly: false,
    targetId: "experience-didi",
    initialPosition: { x: 0.09, y: 0.64 },
  },
  {
    id: "overview-pg",
    title: "宝洁｜品牌经营",
    subtitle: "Brand Marketing",
    detail: "结合市场与竞品洞察，参与全渠道经营及奥运 IP 直播策划。",
    metric: "品类销售额 +25%",
    accent: "silver" as const,
    desktopOnly: false,
    targetId: "experience-pg",
    initialPosition: { x: 0.74, y: 0.65 },
  },
  {
    id: "overview-wenzhou",
    title: "温州｜场景增长",
    subtitle: "Lifecycle Operations",
    detail: "按人群与出行场景拆解策略，联动本地内容、KOL / KOC 与文化 IP。",
    metric: "呼叫份额 +2.97 个百分点",
    accent: "blue" as const,
    desktopOnly: true,
    targetId: "experience-didi",
    initialPosition: { x: 0.17, y: 0.33 },
  },
  {
    id: "overview-data",
    title: "Data & AI｜分析与提效",
    subtitle: "Data & AI Enablement",
    detail: "使用 SQL、SPSS、Office 数据透视表、Codex 与 Claude Code 支持业务分析和工具搭建。",
    metric: "GTM & AI Workflow",
    accent: "cyan" as const,
    desktopOnly: true,
    targetId: "capabilities",
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
                {["GTM 全链路", "城市与异业增长", "市场与用户洞察"].map((tag) => (
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
                  "Goal Decomposition",
                  "Channel & Partnership Growth",
                  "Cross-functional Launch",
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
                GTM 全链路增长与品牌市场候选人
              </p>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-slate-500 sm:text-base">
                GTM &amp; Integrated Growth Marketing Candidate
              </p>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 [text-wrap:balance]">
              具备滴滴、字节跳动与宝洁市场实习经历，能够从市场与用户洞察、经营目标拆解出发，
              推进渠道与异业增长、跨部门上线协同，并以数据和 AI 完成执行提效与效果复盘。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
