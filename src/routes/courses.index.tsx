import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Users, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/lib/data";
import { LevelBadge, PageHero, EmptyState } from "@/components/ui-bits";
import { SECTIONS, rowToCourse, useCmsCount, useCmsInfinite, type CmsFilter } from "@/lib/cms";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "الدورات المدفوعة | Magrm Cyber Security" },
      { name: "description", content: "أكثر من 12000 دورة في 12 قسماً رئيسياً بالاختراق الأخلاقي والأمن السيبراني بالعربي." },
      { property: "og:title", content: "مكتبة الدورات | Magrm Cyber Security" },
      { property: "og:description", content: "12 قسماً رئيسياً وأكثر من 1000 دورة في كل قسم." },
    ],
  }),
  component: CoursesPage,
});

const PRICES = [
  { label: "كل الأسعار", min: 0, max: Infinity },
  { label: "أقل من $100", min: 0, max: 99 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "أكثر من $200", min: 201, max: Infinity },
];

const BATCH = 24;

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [level, setLevel] = useState("الكل");
  const [price, setPrice] = useState(0);

  const filter = useMemo<CmsFilter>(() => {
    const p = PRICES[price]!;
    return {
      search: q.trim(),
      category: cat,
      level,
      minPrice: p.min,
      ...(Number.isFinite(p.max) ? { maxPrice: p.max } : {}),
      searchKeys: ["title", "description"],
    };
  }, [q, cat, level, price]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCmsInfinite("course", filter, BATCH);
  const { data: total } = useCmsCount("course", filter);
  const { data: grandTotal } = useCmsCount("course");

  const courses = (data?.pages.flat() ?? []).map(rowToCourse);

  return (
    <>
      <PageHero
        eyebrow={`${(grandTotal ?? 0).toLocaleString("en-US")} دورة في 12 قسماً`}
        title="مكتبة الدورات المدفوعة"
        description="مسارات تدريبية عملية بالكامل في الاختراق الأخلاقي والأمن السيبراني، من المستوى المبتدئ حتى الاحتراف."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="البحث في الدورات"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن دورة… مثال: التشفير، أمن السحابة"
              className="h-12 pr-10 text-sm"
            />
          </div>

          <div className="mt-5 space-y-4">
            <FilterRow label="القسم" options={["الكل", ...SECTIONS]} value={cat} onChange={setCat} />
            <FilterRow label="المستوى" options={["الكل", ...LEVELS]} value={level} onChange={setLevel} />
            <FilterRow
              label="السعر"
              options={PRICES.map((p) => p.label)}
              value={PRICES[price]!.label}
              onChange={(v) => setPrice(PRICES.findIndex((p) => p.label === v))}
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          عدد النتائج: <span className="font-bold text-primary">{(total ?? 0).toLocaleString("en-US")}</span> دورة
        </p>

        {isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> جاري تحميل الدورات…
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-6">
            <EmptyState text="لا توجد دورات مطابقة لبحثك. جرّب تعديل الفلاتر." />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <Link
                  key={c.id}
                  to="/courses/$courseId"
                  params={{ courseId: String(c.id) }}
                  className="card-surface animate-rise flex flex-col p-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                      {c.category}
                    </span>
                    <LevelBadge level={c.level} />
                  </div>
                  <h2 className="mt-4 text-base font-bold leading-7">{c.title}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">{c.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-warning text-warning" /> {c.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" /> {c.students.toLocaleString("en-US")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {c.hours} ساعة
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-lg font-black text-primary">${c.price}</span>
                    <span className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                      اشترك الآن
                    </span>
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

export function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              value === o
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
