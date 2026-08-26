import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from "react";
import { Download, Search, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCmsApps } from "@/lib/cms";
import { EmptyState, PageHero } from "@/components/ui-bits";
import { sv, useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "برامج وتطبيقات الأمن السيبراني | Magrm" },
      {
        name: "description",
        content: "كتالوج واسع من برامج وتطبيقات الأمن السيبراني مصنف حسب المجال والمنصة مع روابط رسمية.",
      },
      { property: "og:title", content: "برامج وتطبيقات الأمن السيبراني | Magrm" },
      { property: "og:description", content: "استكشف أكثر من 500 برنامج وتطبيق أمن سيبراني في مكان واحد." },
    ],
  }),
  component: AppsPage,
});

const PAGE_SIZE = 24;
const ALL = "الكل";

function AppsPage() {
  const { s } = useSiteSettings();
  const { items: apps, isLoading } = useCmsApps();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [platform, setPlatform] = useState(ALL);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(apps.map((app) => app.category ?? "أمن سيبراني عام"))).sort((a, b) => a.localeCompare(b, "ar"))],
    [apps],
  );
  const platforms = [ALL, "Windows", "Linux", "macOS", "Android", "iOS", "متعدد المنصات"];

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return apps.filter((app) => {
      const searchable = `${app.name} ${app.description} ${app.category ?? ""} ${app.platform}`.toLocaleLowerCase();
      const matchesQuery = !term || searchable.includes(term);
      const matchesCategory = category === ALL || (app.category ?? "أمن سيبراني عام") === category;
      const matchesPlatform = platform === ALL || app.platform.toLocaleLowerCase().includes(platform.toLocaleLowerCase());
      return matchesQuery && matchesCategory && matchesPlatform;
    });
  }, [apps, category, platform, query]);

  useEffect(() => {
    setPage(1);
  }, [category, platform, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleApps = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <PageHero
        eyebrow={`${apps.length.toLocaleString("en-US")} برنامج وتطبيق`}
        title={sv(s, "appsPageTitle") || "برامج وتطبيقات الأمن السيبراني"}
        description={sv(s, "appsPageDescription") || "قسم واحد يضم كتالوجًا واسعًا من الأدوات والتطبيقات، مرتبًا حسب المجال والمنصة مع روابط المواقع الرسمية. استخدم البحث والتصنيفات للوصول بسرعة إلى ما تحتاجه."}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
            <div>
              <label htmlFor="apps-search" className="text-xs font-bold text-muted-foreground">
                ابحث داخل البرامج والتطبيقات
              </label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="apps-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ابحث بالاسم أو الوصف أو التصنيف…"
                  className="h-11 pr-10"
                />
              </div>
            </div>
            <FilterSelect label="القسم الفرعي" value={category} options={categories} onChange={setCategory} />
            <FilterSelect label="المنصة" value={platform} options={platforms} onChange={setPlatform} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
            <p className="text-muted-foreground">
              عرض <strong className="text-foreground">{filtered.length.toLocaleString("en-US")}</strong> نتيجة فريدة
            </p>
            <p className="text-xs text-muted-foreground">
              القسم {currentPage} من {pageCount}
            </p>
          </div>
        </div>

        {isLoading && apps.length === 0 ? <EmptyState text="جاري تحميل التطبيقات…" /> : null}
        {!isLoading && filtered.length === 0 ? <EmptyState text="لا توجد نتائج مطابقة للبحث الحالي." /> : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleApps.map((app) => (
            <article key={`${app.name}-${app.url}`} className="card-surface animate-rise flex flex-col p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <Smartphone className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="line-clamp-2 font-bold">{app.name}</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">{app.platform}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                  {app.category ?? "أمن سيبراني عام"}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{app.description}</p>
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="size-4" /> الموقع الرسمي / التحميل
              </a>
            </article>
          ))}
        </div>

        {pageCount > 1 ? (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="صفحات البرامج">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              السابق
            </button>
            {Array.from({ length: Math.min(pageCount, 7) }, (_, index) => {
              const start =
                pageCount <= 7 ? 1 : currentPage <= 4 ? 1 : currentPage >= pageCount - 3 ? pageCount - 6 : currentPage - 3;
              const pageNumber = start + index;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`grid size-10 place-items-center rounded-lg border text-sm font-bold transition-colors ${
                    currentPage === pageNumber
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              disabled={currentPage === pageCount}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              التالي
            </button>
          </nav>
        ) : null}
      </section>
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-44 text-xs font-bold text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
