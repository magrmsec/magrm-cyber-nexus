import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Flag, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LevelBadge, PageHero, EmptyState } from "@/components/ui-bits";
import { useCmsPorts } from "@/lib/cms";

export const Route = createFileRoute("/ports/")({
  head: () => ({
    meta: [
      { title: "البورتات العملية | Magrm Cyber Security" },
      { name: "description", content: "240+ تحدي اختراق عملي (Ports): شبكات، خوادم، أجهزة، سحابة، تطبيقات ومنصات اجتماعية داخل مختبرات معزولة." },
      { property: "og:title", content: "البورتات العملية | Magrm" },
      { property: "og:description", content: "مختبرات اختراق واقعية مدفوعة مع أعلام وتقارير احترافية." },
    ],
  }),
  component: PortsPage,
});

function PortsPage() {
  const { items: ports, isLoading } = useCmsPorts();
  const [q, setQ] = useState("");

  const filtered = ports.filter(
    (p) => !q.trim() || p.name.includes(q.trim()) || p.description.includes(q.trim()),
  );

  return (
    <>
      <PageHero
        eyebrow={`${ports.length} بورت`}
        title="البورتات — تحديات اختراق عملية"
        description="بيئات معزولة واقعية تحاكي الشبكات والخوادم والأجهزة والسحابة وتطبيقات ومنصات التواصل. اختبر، التقط الأعلام، واكتب تقريرك الاحترافي ضمن نطاق مصرح به."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="البحث في البورتات"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن بورت… مثال: WiFi، Active Directory"
              className="h-12 pr-10 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState text={isLoading ? "جاري تحميل البورتات…" : "لا توجد بورتات مطابقة."} />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/ports/$portId"
                params={{ portId: String(p.id) }}
                className="card-surface animate-rise flex flex-col p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-cyan">PORT #{String(p.id).padStart(2, "0")}</span>
                  <LevelBadge level={p.level} />
                </div>
                <h2 className="mt-4 text-base font-bold leading-7">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flag className="size-3.5" /> {p.flags} أعلام
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench className="size-3.5" /> {p.tools.length} أدوات
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-lg font-black text-primary">${p.price}</span>
                  <span className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                    اشترِ الآن
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
