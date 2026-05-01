import { SectionReveal } from "@/components/SectionReveal";
import { projects } from "@/lib/content";

export function Projects() {
  return (
    <section id="projects" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
          Projects
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <SectionReveal
              key={project.title}
              className={`overflow-hidden rounded-[34px] border p-7 shadow-[0_20px_70px_rgba(148,163,184,0.12)] sm:p-8 ${
                index === 0
                  ? "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.92))]"
                  : "border-emerald-100 bg-[linear-gradient(180deg,rgba(240,253,250,0.96),rgba(236,253,245,0.9))]"
              }`}
              delay={index * 0.08}
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    {project.label}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-700">
                        {project.role} · {project.period}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-slate-600">
                  {project.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
