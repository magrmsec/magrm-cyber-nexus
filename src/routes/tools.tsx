import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { PageHero, EmptyState } from "@/components/ui-bits";
import { FilterRow } from "./courses.index";
import { useCmsTools } from "@/lib/cms";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "أدوات الأمن السيبراني | Magrm Cyber Security" },
      { name: "description", content: "أكثر من 60 أداة اختراق وتحليل: Kali، Burp Suite، Metasploit، Nmap وروابط تحميل." },
      { property: "og:title", content: "أدوات الأمن السيبراني | Magrm" },
      { property: "og:description", content: "مكتبة أدوات الاختراق الأخلاقي مع الوصف وروابط التحميل الرسمية." },
    ],
  }),
  component: ToolsPage,
});

const PAGE_SIZE = 30;

function ToolsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [page, setPage] = useState(1);
  const { items: tools, isLoading } = useCmsTools();

  const filtered = tools.filter(
    (t) =>
      (cat === "الكل" || t.category === cat) &&
      (!q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase()) || t.description.includes(q.trim())),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTools = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [q, cat]);

  return (
    <>
      <PageHero
        eyebrow={`${tools.length} أداة`}
        title="الأدوات والبرامج"
        description="ترسانة الأدوات التي يعتمد عليها محترفو الأمن السيبراني حول العالم — مع روابط التحميل الرسمية."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="البحث في الأدوات"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن أداة… مثال: Burp، Hashcat"
              className="h-12 pr-10 text-sm"
            />
          </div>
          <div className="mt-5">
            <FilterRow
              label="التصنيف"
              options={["الكل", ...new Set(tools.map((t) => t.category))]}
              value={cat}
              onChange={setCat}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState text={isLoading ? "جاري تحميل الأدوات…" : "لا توجد أدوات مطابقة."} />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTools.map((t) => (
                <div key={t.id ?? t.name} className="card-surface animate-rise flex flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="min-w-0 truncate text-base font-bold">{t.name}</h2>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{t.description}</p>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">سعر الخدمة</span>
                    <strong className="text-primary">${t.price ?? 100}</strong>
                  </div>
                  <a
                    href={`https://wa.me/967733570889?text=${encodeURIComponent(`أريد شراء الأداة: ${t.name} — السعر: $${t.price ?? 100}`)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Download className="size-4" /> شراء الأداة
                  </a>
                </div>
              ))}
            </div>
            {pageCount > 1 ? (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="صفحات الأدوات">
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
          </>
        )}
      </section>
    </>
  );
}
