import { SectionReveal } from "@/components/SectionReveal";

export function Contact() {
  const resumePath = "/陈京岳-中文简历-影石.pdf";

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
          <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-center">
            <a
              href={resumePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-w-[196px] items-center justify-center rounded-full border border-sky-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(244,250,255,0.44))] px-6 py-3 text-sm font-medium text-slate-800 shadow-[0_16px_36px_rgba(90,135,180,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 hover:border-sky-200/90 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(244,250,255,0.56))] hover:shadow-[0_20px_40px_rgba(90,135,180,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]"
            >
              View Resume
            </a>
            <a
              href={resumePath}
              download="Jingyue-Chen-CV.pdf"
              className="inline-flex min-w-[196px] items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(246,250,255,0.34))] px-6 py-3 text-sm font-medium text-slate-700 shadow-[0_14px_30px_rgba(148,163,184,0.12),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 hover:border-sky-100/85 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(246,250,255,0.44))] hover:shadow-[0_18px_36px_rgba(148,163,184,0.14),inset_0_1px_0_rgba(255,255,255,0.76)]"
            >
              Download CV
            </a>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
