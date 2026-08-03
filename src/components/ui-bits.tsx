import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-bg border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        {eyebrow ? (
          <span className="animate-rise inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="animate-rise mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {description ? (
          <p className="animate-rise mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    مبتدئ: "border-success/40 bg-success/10 text-success",
    متوسط: "border-warning/40 bg-warning/10 text-warning",
    متقدم: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${map[level] ?? "border-border"}`}>
      {level}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    حرج: "border-destructive/50 bg-destructive/15 text-destructive",
    عالي: "border-warning/50 bg-warning/15 text-warning",
    متوسط: "border-cyan/50 bg-cyan/10 text-cyan",
    منخفض: "border-success/40 bg-success/10 text-success",
  };
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${map[severity] ?? "border-border"}`}>
      {severity}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
