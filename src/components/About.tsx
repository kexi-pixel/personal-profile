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
              我关注如何通过完整的 GTM 路径，把市场与用户洞察、经营目标、渠道资源、上线执行与结果复盘连接成增长闭环。
            </p>
            <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg [text-wrap:balance]">
              在滴滴、字节跳动与宝洁的经历覆盖城市增长、异业合作、电商 GTM、全渠道经营和品牌营销，让我形成了从目标拆解到跨部门落地、再以数据和 AI 提效复盘的方法。
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
