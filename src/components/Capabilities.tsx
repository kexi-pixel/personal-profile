import { SectionReveal } from "@/components/SectionReveal";
import {
  businessCapabilities,
  workflowHighlights,
  workflowTools,
} from "@/lib/content";

export function Capabilities() {
  return (
    <section id="capabilities" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
            Capabilities
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl lg:text-[2.7rem]">
            能力结构：GTM 全链路 × 市场增长 × 数据与 AI
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
          <div className="rounded-[34px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_70px_rgba(148,163,184,0.1)] sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Business Capability Matrix
            </p>
            <div className="mt-6 space-y-4">
              {businessCapabilities.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.en}</p>
                    </div>
                    <span className="font-mono text-sm text-slate-400">{item.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#38bdf8)]"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[34px] border border-slate-900/8 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.96))] p-6 shadow-[0_18px_70px_rgba(148,163,184,0.12)] sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                数据分析与 AI 辅助工作流
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Data &amp; AI-Enhanced Workflow
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                使用 SQL、SPSS 与 Office 数据透视表支持市场分析、经营复盘和洞察提炼；同时使用
                Claude Code、Codex 搭建效率工具并协同信息处理，提升 GTM 策略与执行效率。
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {workflowHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/70 bg-white/80 p-5"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_70px_rgba(148,163,184,0.1)] sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Tools &amp; Languages
              </p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {workflowTools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm text-slate-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
