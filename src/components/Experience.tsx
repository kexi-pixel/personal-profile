"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { featuredExperiences } from "@/lib/content";
import { useEffect, useState } from "react";

const themeMap = {
  bytedance: {
    shell:
      "border-sky-300/18 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.16),transparent_28%),linear-gradient(135deg,rgba(20,43,74,0.98),rgba(33,58,99,0.94),rgba(20,28,48,0.92))] text-white",
    panel: "border-white/12 bg-white/6",
    muted: "text-slate-300",
    chip: "border-cyan-300/24 bg-white/8 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-100",
    result: "border-cyan-300/18 bg-white/8",
  },
  pg: {
    shell:
      "border-sky-200/80 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.24),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.26),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(239,246,255,0.94))] text-slate-950",
    panel: "border-sky-100 bg-white/76",
    muted: "text-slate-600",
    chip: "border-sky-200 bg-white/86 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700",
    result: "border-sky-100 bg-white/76",
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
    <section id="experience" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
                className={`overflow-hidden rounded-[36px] border p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color] duration-500 sm:p-8 lg:p-10 ${
                  highlightedId === anchorId
                    ? "ring-1 ring-sky-200 shadow-[0_0_0_1px_rgba(186,230,253,0.6),0_28px_100px_rgba(125,211,252,0.14)]"
                    : ""
                } ${theme.shell}`}
                delay={index * 0.08}
                id={anchorId}
              >
                <div className="grid gap-8 lg:grid-cols-[1.02fr_1.18fr]">
                  <div className="space-y-8 lg:pr-4">
                    <div className="space-y-5">
                      <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${theme.muted}`}>
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

                    <div className={`rounded-[28px] border p-6 ${theme.panel}`}>
                      <p className={`font-mono text-[11px] uppercase tracking-[0.28em] ${theme.muted}`}>
                        Project
                      </p>
                      <h4 className="mt-4 text-[2rem] font-semibold tracking-[-0.04em]">
                        {experience.project}
                      </h4>
                      <p className={`mt-5 text-base leading-8 ${theme.muted}`}>
                        {experience.background}
                      </p>
                    </div>

                    <div className={`rounded-[28px] border p-6 ${theme.panel}`}>
                      <p className={`font-mono text-[11px] uppercase tracking-[0.28em] ${theme.muted}`}>
                        My Role
                      </p>
                      <p className={`mt-4 text-base leading-8 ${theme.muted}`}>
                        {experience.roleSummary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={`rounded-[28px] border p-6 ${theme.panel}`}>
                      <p className={`font-mono text-[11px] uppercase tracking-[0.28em] ${theme.muted}`}>
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
                          className={`rounded-[24px] border p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${theme.result}`}
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
