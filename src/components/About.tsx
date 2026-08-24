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
              我关注品牌如何通过清晰的 GTM 路径，把目标人群、触点选择、内容表达与转化承接连接成可复盘的增长闭环。
            </p>
            <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg [text-wrap:balance]">
              在字节跳动、宝洁与国家电网的经历覆盖整合营销、品牌增长、内容分层、直播场域和数据分析，让我形成了从业务目标出发、以用户触点和数据变量推进策略落地的方法。
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
