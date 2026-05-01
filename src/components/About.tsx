import { SectionReveal } from "@/components/SectionReveal";

export function About() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <SectionReveal className="mx-auto max-w-5xl rounded-[32px] border border-white/70 bg-white/72 px-6 py-8 shadow-[0_20px_80px_rgba(148,163,184,0.12)] backdrop-blur-xl sm:px-10 sm:py-10">
        <div className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
            About Me
          </p>
          <div className="space-y-5 text-slate-700">
            <p className="max-w-4xl bg-[linear-gradient(180deg,#0f172a_0%,#334155_78%,#64748b_100%)] bg-clip-text text-2xl font-medium leading-[1.5] tracking-[-0.05em] text-transparent sm:text-3xl [text-wrap:balance]">
              我关注市场增长、运营策略与用户洞察之间真正发生作用的连接方式，也更在意策略如何落到业务结果上。
            </p>
            <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg [text-wrap:balance]">
              过去的经历覆盖电商营销、全域传播、内容投放、数据复盘与项目协作，让我逐步形成了以业务目标为起点、以数据判断和执行落地为支撑的工作方法。
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
