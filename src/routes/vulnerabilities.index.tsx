import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEVERITIES } from "@/lib/data";
import { SeverityBadge, PageHero, EmptyState } from "@/components/ui-bits";
import { FilterRow } from "./courses.index";
import { useCmsVulns } from "@/lib/cms";

export const Route = createFileRoute("/vulnerabilities/")({
  head: () => ({
    meta: [
      { title: "قاعدة الثغرات CVE | Magrm Cyber Security" },
      { name: "description", content: "1000 ثغرة أمنية CVE مع الوصف ومستوى الخطورة والأنظمة المتأثرة والحلول." },
      { property: "og:title", content: "قاعدة الثغرات | Magrm" },
      { property: "og:description", content: "استعرض ثغرات CVE مصنفة حسب الخطورة والنوع." },
    ],
  }),
  component: VulnsPage,
});

function VulnsPage() {
  const { items: vulns, isLoading } = useCmsVulns();
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("الكل");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = vulns.filter(
    (v) =>
      (sev === "الكل" || v.severity === sev) &&
      (!q.trim() ||
        v.cve.toLowerCase().includes(q.trim().toLowerCase()) ||
        v.name.includes(q.trim()) ||
        v.type.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * perPage, current * perPage);

  return (
    <>
      <PageHero
        eyebrow={`${vulns.length.toLocaleString("en-US")} ثغرة`}
        title="قاعدة الثغرات الأمنية"
        description="أرشيف ثغرات CVE مصنّف حسب الخطورة والنوع، مع الأنظمة المتأثرة وتاريخ الاكتشاف وطرق الحماية."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث برقم CVE أو نوع الثغرة… مثال: RCE، Apache"
              className="h-12 pr-10 text-sm"
            />
          </div>
          <div className="mt-5">
            <FilterRow
              label="مستوى الخطورة"
              options={["الكل", ...SEVERITIES]}
              value={sev}
              onChange={(v) => {
                setSev(v);
                setPage(1);
              }}
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          عدد النتائج: <span className="font-bold text-primary">{filtered.length.toLocaleString("en-US")}</span> ثغرة
        </p>

        {rows.length === 0 ? (
          <div className="mt-6">
            <EmptyState text={isLoading ? "جاري تحميل الثغرات…" : "لا توجد ثغرات مطابقة."} />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3">
              {rows.map((v) => (
                <Link
                  key={v.id}
                  to="/vulnerabilities/$vulnId"
                  params={{ vulnId: String(v.id) }}
                  className="card-surface animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-cyan">{v.cve}</span>
                      <span className="text-[11px] text-muted-foreground">{v.date}</span>
                    </div>
                    <h2 className="mt-1.5 truncate font-bold">{v.name}</h2>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{v.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <SeverityBadge severity={v.severity} />
                    <span className="text-xs text-muted-foreground">CVSS {v.cvss}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" disabled={current === 1} onClick={() => setPage(current - 1)}>
                السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة <span className="font-bold text-primary">{current}</span> من {pages}
              </span>
              <Button variant="outline" disabled={current === pages} onClick={() => setPage(current + 1)}>
                التالي
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
