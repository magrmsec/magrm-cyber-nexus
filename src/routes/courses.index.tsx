import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allCourses, COURSE_CATEGORIES, LEVELS } from "@/lib/data";
import { LevelBadge, PageHero, EmptyState } from "@/components/ui-bits";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "الدورات المدفوعة | Magrm Cyber Security" },
      { name: "description", content: "أكثر من 1000 دورة مدفوعة في الاختراق الأخلاقي والأمن السيبراني بالعربي." },
      { property: "og:title", content: "مكتبة الدورات | Magrm Cyber Security" },
      { property: "og:description", content: "1000 دورة في اختبار الاختراق، أمن الشبكات، Bug Bounty وأكثر." },
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

function CoursesPage() {
  const courses = useMemo(() => allCourses(), []);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [level, setLevel] = useState("الكل");
  const [price, setPrice] = useState(0);
  const [shown, setShown] = useState(12);

  const filtered = useMemo(() => {
    const p = PRICES[price]!;
    const term = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (cat === "الكل" || c.category === cat) &&
        (level === "الكل" || c.level === level) &&
        c.price >= p.min &&
        c.price <= p.max &&
        (!term || c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)),
    );
  }, [courses, q, cat, level, price]);

  const reset = (fn: () => void) => {
    fn();
    setShown(12);
  };

  return (
    <>
      <PageHero
        eyebrow="1000 دورة"
        title="مكتبة الدورات المدفوعة"
        description="مسارات تدريبية عملية بالكامل في الاختراق الأخلاقي والأمن السيبراني، من المستوى المبتدئ حتى الاحتراف."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => reset(() => setQ(e.target.value))}
              placeholder="ابحث عن دورة… مثال: Metasploit، XSS، Cloud"
              className="h-12 pr-10 text-sm"
            />
          </div>

          <div className="mt-5 space-y-4">
            <FilterRow
              label="التصنيف"
              options={["الكل", ...COURSE_CATEGORIES]}
              value={cat}
              onChange={(v) => reset(() => setCat(v))}
            />
            <FilterRow
              label="المستوى"
              options={["الكل", ...LEVELS]}
              value={level}
              onChange={(v) => reset(() => setLevel(v))}
            />
            <FilterRow
              label="السعر"
              options={PRICES.map((p) => p.label)}
              value={PRICES[price]!.label}
              onChange={(v) => reset(() => setPrice(PRICES.findIndex((p) => p.label === v)))}
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          عدد النتائج: <span className="font-bold text-primary">{filtered.length.toLocaleString("en-US")}</span> دورة
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState text="لا توجد دورات مطابقة لبحثك. جرّب تعديل الفلاتر." />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, shown).map((c) => (
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

            {shown < filtered.length ? (
              <div className="mt-10 text-center">
                <Button size="lg" variant="outline" onClick={() => setShown((s) => s + 12)}>
                  عرض المزيد ({(filtered.length - shown).toLocaleString("en-US")} متبقية)
                </Button>
              </div>
            ) : null}
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
