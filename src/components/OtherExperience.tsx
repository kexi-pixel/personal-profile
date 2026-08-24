import { SectionReveal } from "@/components/SectionReveal";
import { otherExperiences } from "@/lib/content";

export function OtherExperience() {
  if (!otherExperiences.length) return null;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <SectionReveal className="mx-auto max-w-7xl rounded-[34px] border border-slate-200/80 bg-white/82 p-6 shadow-[0_18px_70px_rgba(148,163,184,0.12)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
            Other Experience
          </p>

          <div className="space-y-6">
            {otherExperiences.map((item) => (
              <div
                key={item.company}
                className="grid gap-4 border-t border-slate-200/80 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[240px_1fr]"
              >
                <div className="space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    {item.companyEn}
                  </p>
                  <h4 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {item.company}
                  </h4>
                  <p className="text-sm text-slate-700">{item.role}</p>
                  <p className="font-mono text-sm text-slate-500">{item.period}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm leading-7 text-slate-600">{item.summary}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {item.results.map((result) => (
                      <div
                        key={result}
                        className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
