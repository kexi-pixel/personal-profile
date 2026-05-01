import { SectionReveal } from "@/components/SectionReveal";

export function Contact() {
  return (
    <section id="contact" className="px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <SectionReveal className="mx-auto max-w-5xl rounded-[38px] border border-slate-200/80 bg-white/88 px-6 py-12 text-center shadow-[0_24px_90px_rgba(148,163,184,0.12)] sm:px-10 lg:px-16">
        <div className="space-y-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-slate-500">
            Contact
          </p>
          <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.15] tracking-[-0.06em] text-slate-950 sm:text-5xl [text-wrap:balance]">
            我希望在市场、运营与产品相关岗位中，持续把用户洞察、增长策略与数据分析能力结合起来，参与更有业务价值的项目。
          </h2>
          <p className="text-base text-slate-500 sm:text-lg">
            chenjingyue202509@163.com
          </p>
        </div>
      </SectionReveal>
    </section>
  );
}
