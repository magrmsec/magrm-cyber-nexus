import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/data";
import { PageHero, EmptyState } from "@/components/ui-bits";
import { FilterRow } from "./courses.index";

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

function ToolsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");

  const filtered = TOOLS.filter(
    (t) =>
      (cat === "الكل" || t.category === cat) &&
      (!q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase()) || t.description.includes(q.trim())),
  );

  return (
    <>
      <PageHero
        eyebrow={`${TOOLS.length} أداة`}
        title="الأدوات والبرامج"
        description="ترسانة الأدوات التي يعتمد عليها محترفو الأمن السيبراني حول العالم — مع روابط التحميل الرسمية."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن أداة… مثال: Burp، Hashcat"
              className="h-12 pr-10 text-sm"
            />
          </div>
          <div className="mt-5">
            <FilterRow label="التصنيف" options={["الكل", ...TOOL_CATEGORIES]} value={cat} onChange={setCat} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState text="لا توجد أدوات مطابقة." />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <div key={t.name} className="card-surface animate-rise flex flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="min-w-0 truncate text-base font-bold">{t.name}</h2>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    {t.category}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{t.description}</p>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" /> تحميل الأداة
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
