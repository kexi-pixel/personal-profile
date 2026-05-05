"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { featuredExperiences } from "@/lib/content";
import { useEffect, useState } from "react";

const themeMap = {
  bytedance: {
    shell:
      "experience-shell border-white/38 bg-[radial-gradient(circle_at_18%_16%,rgba(191,219,254,0.28),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(196,181,253,0.16),transparent_32%),linear-gradient(140deg,rgba(92,116,144,0.82),rgba(74,97,126,0.76),rgba(52,72,96,0.8))] text-slate-50",
    panel:
      "experience-panel border-white/34 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.1))] shadow-[0_24px_60px_rgba(35,65,95,0.14),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[18px]",
    muted: "text-slate-200/92",
    eyebrow: "text-slate-200/78",
    chip:
      "experience-chip border-white/34 bg-[linear-gradient(180deg,rgba(248,251,255,0.18),rgba(229,238,248,0.1))] font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-50 shadow-[0_10px_24px_rgba(35,65,95,0.12)]",
    result:
      "experience-metric-card border-white/40 bg-[linear-gradient(180deg,rgba(245,250,255,0.22),rgba(223,235,247,0.14))] shadow-[0_16px_36px_rgba(35,65,95,0.12),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[16px]",
  },
  pg: {
    shell:
      "experience-shell border-white/62 bg-[radial-gradient(circle_at_16%_14%,rgba(186,230,253,0.28),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(216,180,254,0.12),transparent_30%),linear-gradient(145deg,rgba(229,236,242,0.96),rgba(201,214,226,0.92),rgba(184,202,219,0.9))] text-slate-900",
    panel:
      "experience-panel border-white/56 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(245,249,253,0.22))] shadow-[0_24px_60px_rgba(73,96,124,0.1),inset_0_1px_0_rgba(255,255,255,0.32)] backdrop-blur-[18px]",
    muted: "text-slate-700/92",
    eyebrow: "text-slate-500/88",
    chip:
      "experience-chip border-white/58 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(240,246,251,0.34))] font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 shadow-[0_10px_24px_rgba(73,96,124,0.08)]",
    result:
      "experience-metric-card border-white/62 bg-[linear-gradient(180deg,rgba(248,252,255,0.46),rgba(234,242,248,0.3))] shadow-[0_16px_36px_rgba(73,96,124,0.08),inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-[16px]",
  },
};

export function Experience() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    let timeout: number | undefined;

    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<{ targetId?: string }>).detail;
      if (!detail?.targetId?.startsWith("experience-")) return;

      setHighlightedId(detail.targetId);
      timeout = window.setTimeout(() => setHighlightedId(null), 1600);
    };

    window.addEventListener("overview-card-focus", handleFocus);
    return () => {
      window.removeEventListener("overview-card-focus", handleFocus);
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="experience" className="experience-section px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
          Experience
        </p>

        <div className="space-y-8">
          {featuredExperiences.map((experience, index) => {
            const theme = themeMap[experience.theme];
            const anchorId =
              experience.theme === "bytedance" ? "experience-bytedance" : "experience-pg";

            return (
              <SectionReveal
                key={experience.company}
                className={`experience-card overflow-hidden rounded-[36px] border p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color,background-color] duration-500 hover:shadow-[0_32px_90px_rgba(72,98,128,0.16)] sm:p-8 lg:p-10 ${
                  highlightedId === anchorId
                    ? "ring-1 ring-white/45 shadow-[0_0_0_1px_rgba(226,236,248,0.72),0_28px_100px_rgba(148,163,184,0.16)]"
                    : ""
                } ${theme.shell}`}
                delay={index * 0.08}
                id={anchorId}
              >
                <div className="grid gap-8 lg:grid-cols-[1.02fr_1.18fr]">
                  <div className="space-y-8 lg:pr-4">
                    <div className="space-y-5">
                      <p
                        className={`experience-eyebrow font-mono text-[11px] uppercase tracking-[0.3em] ${theme.eyebrow}`}
                      >
                        {experience.companyEn}
                      </p>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-semibold tracking-[-0.05em]">
                          {experience.company}
                        </h3>
                        <p className={`text-lg ${theme.muted}`}>
                          {experience.role} · {experience.period}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`experience-panel rounded-[28px] border p-6 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/50 hover:bg-white/20 ${theme.panel}`}
                    >
                      <p
                        className={`experience-eyebrow font-mono text-[11px] uppercase tracking-[0.28em] ${theme.eyebrow}`}
                      >
                        Project
                      </p>
                      <h4 className="mt-4 text-[2rem] font-semibold tracking-[-0.04em]">
                        {experience.project}
                      </h4>
                      <p className={`mt-5 text-base leading-8 ${theme.muted}`}>
                        {experience.background}
                      </p>
                    </div>

                    <div
                      className={`experience-panel rounded-[28px] border p-6 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/50 hover:bg-white/20 ${theme.panel}`}
                    >
                      <p
                        className={`experience-eyebrow font-mono text-[11px] uppercase tracking-[0.28em] ${theme.eyebrow}`}
                      >
                        My Role
                      </p>
                      <p className={`mt-4 text-base leading-8 ${theme.muted}`}>
                        {experience.roleSummary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      className={`experience-panel rounded-[28px] border p-6 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/50 hover:bg-white/20 ${theme.panel}`}
                    >
                      <p
                        className={`experience-eyebrow font-mono text-[11px] uppercase tracking-[0.28em] ${theme.eyebrow}`}
                      >
                        Key Actions
                      </p>
                      <ul className={`mt-5 space-y-4 text-base leading-8 ${theme.muted}`}>
                        {experience.actions.map((action) => (
                          <li key={action} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {experience.results.map((result) => (
                        <div
                          key={result}
                          className={`experience-metric-card rounded-[24px] border p-5 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/68 hover:shadow-[0_20px_44px_rgba(73,96,124,0.14)] ${theme.result}`}
                        >
                          <p className={`text-base leading-8 ${theme.muted}`}>{result}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {experience.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className={`rounded-full border px-3.5 py-2 ${theme.chip}`}
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </SectionReveal>
    </section>
  );
}
