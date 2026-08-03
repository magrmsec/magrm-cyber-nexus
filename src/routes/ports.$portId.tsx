import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Flag, Target, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allPorts } from "@/lib/data";
import { LevelBadge } from "@/components/ui-bits";

export const Route = createFileRoute("/ports/$portId")({
  loader: ({ params }) => {
    const port = allPorts().find((p) => p.id === Number(params.portId));
    if (!port) throw notFound();
    return { port };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "البورت غير متوفر | Magrm" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.port;
    return {
      meta: [
        { title: `${p.name} | بورتات Magrm` },
        { name: "description", content: p.description },
        { property: "og:title", content: p.name },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: PortDetail,
});

function PortDetail() {
  const { port: p } = Route.useLoaderData();

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/ports" className="text-sm font-bold text-primary">
            → العودة للبورتات
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-cyan">PORT #{String(p.id).padStart(2, "0")}</span>
                <LevelBadge level={p.level} />
              </div>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-4xl">
                <span className="text-gradient">{p.name}</span>
              </h1>
              <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{p.description}</p>

              <div className="card-surface mt-8 p-6">
                <h2 className="flex items-center gap-2 font-bold">
                  <Target className="size-4 text-primary" /> الهدف
                </h2>
                <p className="mt-3 text-sm leading-8 text-muted-foreground">{p.objective}</p>
              </div>

              <div className="card-surface mt-5 p-6">
                <h2 className="flex items-center gap-2 font-bold">
                  <Wrench className="size-4 text-primary" /> الأدوات المستخدمة
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-surface mt-5 p-6">
                <h2 className="flex items-center gap-2 font-bold">
                  <Flag className="size-4 text-primary" /> مسار الحل
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    "الاستطلاع وجمع المعلومات عن الهدف",
                    "تحديد نقاط الضعف والخدمات المكشوفة",
                    "استغلال الثغرة والحصول على موطئ قدم",
                    "تصعيد الصلاحيات والتقاط الأعلام",
                    "كتابة التقرير النهائي مع التوصيات",
                  ].map((s, i) => (
                    <li key={s} className="flex items-start gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/15 text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
              <div className="text-3xl font-black text-primary">${p.price}</div>
              <p className="mt-1 text-xs text-muted-foreground">وصول للبيئة 30 يوماً + الحل الرسمي</p>
              <Button
                className="glow mt-5 w-full text-base font-bold"
                size="lg"
                onClick={() => toast.success("تم تسجيل طلب الشراء", { description: `${p.name} — $${p.price}` })}
              >
                اشترِ الآن
              </Button>
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>عدد الأعلام</span>
                  <span className="font-bold text-foreground">{p.flags}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المستوى</span>
                  <span className="font-bold text-foreground">{p.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>نوع البيئة</span>
                  <span className="font-bold text-foreground">معزولة (Lab)</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
