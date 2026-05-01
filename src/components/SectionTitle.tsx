type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-500">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
