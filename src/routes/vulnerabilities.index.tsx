import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEVERITIES } from "@/lib/data";
import { SeverityBadge, PageHero, EmptyState } from "@/components/ui-bits";
import { FilterRow } from "./courses.index";
import { rowToVuln, useCmsCount, useCmsInfinite, type CmsFilter } from "@/lib/cms";

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

const BATCH = 25;

function VulnsPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("الكل");

  const filter = useMemo<CmsFilter>(
    () => ({ search: q.trim(), severity: sev, searchKeys: ["cve", "name", "type"] }),
    [q, sev],
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCmsInfinite("vuln", filter, BATCH);
  const { data: total } = useCmsCount("vuln", filter);
  const { data: grandTotal } = useCmsCount("vuln");
  const rows = (data?.pages.flat() ?? []).map(rowToVuln);

  return (
    <>
      <PageHero
        eyebrow={`${(grandTotal ?? 0).toLocaleString("en-US")} ثغرة`}
        title="قاعدة الثغرات الأمنية"
        description="أرشيف ثغرات CVE مصنّف حسب الخطورة والنوع، مع الأنظمة المتأثرة وتاريخ الاكتشاف وطرق الحماية."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="البحث في الثغرات"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث برقم CVE أو نوع الثغرة… مثال: RCE، Apache"
              className="h-12 pr-10 text-sm"
            />
          </div>
          <div className="mt-5">
            <FilterRow label="مستوى الخطورة" options={["الكل", ...SEVERITIES]} value={sev} onChange={setSev} />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          عدد النتائج: <span className="font-bold text-primary">{(total ?? 0).toLocaleString("en-US")}</span> ثغرة
        </p>

        {isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> جاري تحميل الثغرات…
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6">
            <EmptyState text="لا توجد ثغرات مطابقة." />
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

            {hasNextPage ? (
              <div className="mt-10 text-center">
                <Button size="lg" variant="outline" disabled={isFetchingNextPage} onClick={() => void fetchNextPage()}>
                  {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null} تحميل المزيد
                </Button>
              </div>
            ) : (
              <p className="mt-10 text-center text-xs text-muted-foreground">وصلت إلى نهاية النتائج.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}
