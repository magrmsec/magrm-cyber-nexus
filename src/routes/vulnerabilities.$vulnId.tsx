import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Download, Layers, MessageCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { fetchCmsRowBySeq, rowToVuln } from "@/lib/cms";
import { SeverityBadge } from "@/components/ui-bits";
import { useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/vulnerabilities/$vulnId")({
  loader: async ({ params }) => {
    const id = Number(params.vulnId);
    if (!Number.isInteger(id) || id < 1) throw notFound();
    const row = await fetchCmsRowBySeq("vuln", id);
    if (!row || !row.published) throw notFound();
    return { vuln: rowToVuln(row) };
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
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: `${v.cve} — ${v.name}`,
            description: v.description,
            articleBody: v.description,
            inLanguage: "ar",
            about: v.cve,
            publisher: {
              "@type": "Organization",
              name: "Magrm Cyber Security",
              url: "https://magrm.blacksec.workers.dev",
            },
          }),
        },
      ],
    };
  },
  component: VulnDetail,
});

function VulnDetail() {
  const { vuln: v } = Route.useLoaderData();
  const { settings: s } = useSiteSettings();
  const isPaid = Boolean(v.price && v.price > 0);
  const downloadUrl = `/vulnerabilities/${v.id}/download`;
  const whatsappMessage = `السلام عليكم، أريد طلب الخدمة المرتبطة بالثغرة التالية:\nرقم الثغرة: ${v.cve}\nالاسم: ${v.name}\nالخطورة: ${v.severity}\nدرجة CVSS: ${v.cvss}\nالسعر: $${v.price}`;
  const whatsappUrl = `${s("whatsapp")}?text=${encodeURIComponent(whatsappMessage)}`;

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
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold">CVSS {v.cvss}</span>
          </div>
          <h1 className="animate-rise mt-4 text-2xl font-black leading-tight md:text-4xl">
            <span className="text-gradient">{v.name}</span>
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{v.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="card-surface p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <ShieldAlert className="size-4 text-primary" /> ماذا تفعل هذه الثغرة؟
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            هذه الثغرة هي حالة ضعف موثقة في مكوّن برمجي. قد تسمح آثارها بالوصول غير المصرح به أو كشف المعلومات أو التأثير في الخدمة بحسب المنتج المتأثر، وإعداداته، وصلاحيات المهاجم. يوضح الوصف أعلاه طبيعة المشكلة، بينما تساعد درجة CVSS على تقدير مستوى الخطر وترتيب أولوية المعالجة.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Layers className="size-4 text-primary" /> الأنظمة المتأثرة
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {v.affected.map((a: string) => (
                <li key={a} className="rounded-lg border border-border bg-surface-2 px-3 py-2">{a}</li>
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
              <CalendarDays className="size-4 text-primary" /> الوصول إلى ملف الثغرة
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            {isPaid
              ? "هذه الثغرة ضمن الثغرات عالية الخطورة. للحصول على الخدمة والتفاصيل التجارية، تواصل معنا مباشرة عبر واتساب."
              : "مختبر أمني حقيقي للتدريب على الثغرات متاح مجانًا، وسيتم تنزيله مباشرة من موقع Magrm دون الانتقال إلى موقع آخر. شغّله محليًا ومعزولًا فقط."}
          </p>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">السعر</p>
              <div className={`mt-1 text-3xl font-black ${isPaid ? "text-primary" : "text-emerald-500"}`}>
                {isPaid ? `$${v.price}` : "مجاني"}
              </div>
            </div>
            {isPaid ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700"
              >
                <MessageCircle className="size-5" /> تواصل معنا عبر الواتساب
              </a>
            ) : (
              <a
                href={downloadUrl}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
              >
                <Download className="size-5" /> تحميل المختبر الحقيقي
              </a>
            )}
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
