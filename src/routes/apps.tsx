import { createFileRoute } from "@tanstack/react-router";
import { Download, Smartphone } from "lucide-react";
import { APPS } from "@/lib/data";
import { PageHero } from "@/components/ui-bits";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "تطبيقات الأمن السيبراني للجوال | Magrm" },
      { name: "description", content: "أفضل تطبيقات الأمن السيبراني والاختراق للأندرويد و iOS مع روابط التحميل." },
      { property: "og:title", content: "تطبيقات الأمن السيبراني | Magrm" },
      { property: "og:description", content: "Termux، NetHunter، Fing وغيرها — أدوات الأمن في جيبك." },
    ],
  }),
  component: AppsPage,
});

function AppsPage() {
  return (
    <>
      <PageHero
        eyebrow={`${APPS.length} تطبيق`}
        title="تطبيقات الجوال"
        description="أدوات الأمن السيبراني التي تعمل مباشرة من هاتفك: طرفيات، ماسحات شبكات، خصوصية وتشفير."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((a) => (
            <div key={a.name} className="card-surface animate-rise flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <Smartphone className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-bold">{a.name}</h2>
                  <span className="text-[11px] text-muted-foreground">{a.platform}</span>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{a.description}</p>
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="size-4" /> تحميل التطبيق
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
