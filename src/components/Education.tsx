import { SectionReveal } from "@/components/SectionReveal";
import { educationList } from "@/lib/content";

function splitIntoBalancedRows(items: readonly string[]) {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

export function Education() {
  return (
    <section id="education" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
          Education
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {educationList.map((item) => {
            const courseRows = splitIntoBalancedRows(item.courses);

            return (
            <article
              key={item.school}
              className="rounded-[30px] border border-slate-200/80 bg-white/86 p-7 shadow-[0_18px_60px_rgba(148,163,184,0.1)]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                      {item.schoolEn}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                      {item.school}
                    </h3>
                    <p className="mt-2 text-base text-slate-700">{item.degree}</p>
                  </div>
                  <p className="font-mono text-sm text-slate-500">{item.period}</p>
                </div>

                {item.highlights.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-900">核心课程</p>
                  <div className="space-y-2.5">
                    {courseRows.map((row, rowIndex) => (
                      <div key={`${item.school}-${rowIndex}`} className="flex flex-wrap gap-2">
                        {row.map((course) => (
                          <span
                            key={course}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </SectionReveal>
    </section>
  );
}
