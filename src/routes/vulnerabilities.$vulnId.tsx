import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Layers, ShieldAlert, ShieldCheck } from "lucide-react";
import { makeVuln, VULNS_COUNT } from "@/lib/data";
import { CMS_ID_OFFSET, fetchCmsRowBySeq, rowToVuln } from "@/lib/cms";
import { SeverityBadge } from "@/components/ui-bits";

export const Route = createFileRoute("/vulnerabilities/$vulnId")({
  loader: async ({ params }) => {
    const id = Number(params.vulnId);
    if (!Number.isInteger(id) || id < 1) throw notFound();
    if (id >= CMS_ID_OFFSET) {
      const row = await fetchCmsRowBySeq("vuln", id - CMS_ID_OFFSET);
      if (!row || !row.published) throw notFound();
      return { vuln: rowToVuln(row) };
    }
    if (id > VULNS_COUNT) throw notFound();
    return { vuln: makeVuln(id) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "الثغرة غير متوفرة | Magrm" }, { name: "robots", content: "noindex" }] };
    const v = loaderData.vuln;
    return {
      meta: [
        { title: `${v.cve} — ${v.name} | Magrm` },
        { name: "description", content: v.description.slice(0, 150) },
        { property: "og:title", content: `${v.cve} — ${v.name}` },
        { property: "og:description", content: v.description.slice(0, 150) },
      ],
    };
  },
  component: VulnDetail,
});

function VulnDetail() {
  const { vuln: v } = Route.useLoaderData();

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <Link to="/vulnerabilities" className="text-sm font-bold text-primary">
            → العودة لقاعدة الثغرات
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-cyan">{v.cve}</span>
            <SeverityBadge severity={v.severity} />
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold">
              CVSS {v.cvss}
            </span>
          </div>
          <h1 className="animate-rise mt-4 text-2xl font-black leading-tight md:text-4xl">
            <span className="text-gradient">{v.name}</span>
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{v.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Layers className="size-4 text-primary" /> الأنظمة المتأثرة
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {v.affected.map((a: string) => (
                <li key={a} className="rounded-lg border border-border bg-surface-2 px-3 py-2">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <ShieldAlert className="size-4 text-primary" /> بيانات الثغرة
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="النوع" value={v.type} />
              <Row label="مستوى الخطورة" value={v.severity} />
              <Row label="درجة CVSS" value={String(v.cvss)} />
              <Row label="تاريخ الاكتشاف" value={v.date} />
            </dl>
          </div>
        </div>

        <div className="card-surface mt-5 p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <ShieldCheck className="size-4 text-primary" /> الحماية والتوصيات
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">{v.mitigation}</p>
        </div>

        <div className="card-surface mt-5 p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <CalendarDays className="size-4 text-primary" /> مراجع خارجية
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://nvd.nist.gov/vuln/detail/${v.cve}`}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold transition-colors hover:border-primary/60 hover:text-primary"
            >
              NVD Database
            </a>
            <a
              href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v.cve}`}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold transition-colors hover:border-primary/60 hover:text-primary"
            >
              MITRE CVE
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
