import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { BadgeCheck, Clock, GraduationCap, Star, Users, Award, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCmsRowBySeq, rowToCourse } from "@/lib/cms";
import { LevelBadge } from "@/components/ui-bits";

export const Route = createFileRoute("/courses/$courseId")({
  loader: async ({ params }) => {
    const id = Number(params.courseId);
    if (!Number.isInteger(id) || id < 1) throw notFound();
    const row = await fetchCmsRowBySeq("course", id);
    if (!row || !row.published) throw notFound();
    return { course: rowToCourse(row) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "الدورة غير متوفرة | Magrm" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.course;
    return {
      meta: [
        { title: `${c.title} | Magrm Cyber Security` },
        { name: "description", content: c.description.slice(0, 150) },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.description.slice(0, 150) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: c.title,
            description: c.description,
            inLanguage: "ar",
            provider: {
              "@type": "Organization",
              name: "Magrm Cyber Security",
              url: "https://magrm-cyber-nexus.lovable.app",
            },
          }),
        },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { course: c } = Route.useLoaderData();

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/courses" className="text-sm font-bold text-primary">
            → العودة لمكتبة الدورات
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{c.category}</span>
                <LevelBadge level={c.level} />
              </div>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-4xl">
                <span className="text-gradient">{c.title}</span>
              </h1>
              <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{c.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-warning text-warning" /> {c.rating} تقييم
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" /> {c.students.toLocaleString("en-US")} طالب
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {c.hours} ساعة
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="size-4" /> {c.lessons} درس
                </span>
              </div>
            </div>

            <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
              <div className="text-3xl font-black text-primary">${c.price}</div>
              <p className="mt-1 text-xs text-muted-foreground">وصول مدى الحياة + شهادة إتمام</p>
              <Button
                className="glow mt-5 w-full text-base font-bold"
                size="lg"
                onClick={() => toast.success("تم تسجيل طلب الاشتراك", { description: `${c.title} — $${c.price}` })}
              >
                اشترك الآن
              </Button>
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => toast("أضيفت الدورة إلى قائمة الرغبات")}
              >
                أضف للمفضلة
              </Button>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {["مختبرات عملية مباشرة", "ملفات ومصادر قابلة للتحميل", "دعم فني من المدرب", "تحديثات دورية مجانية"].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2">
                      <BadgeCheck className="size-4 shrink-0 text-primary" /> {f}
                    </li>
                  ),
                )}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold md:text-2xl">منهج الدورة</h2>
            <div className="mt-6 space-y-4">
              {c.curriculum.map((m: { title: string; items: string[] }, i: number) => (
                <div key={m.title} className="card-surface p-5">
                  <h3 className="font-bold text-primary">{m.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {m.items.map((it: string, j: number) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-2 text-[11px] font-bold text-foreground">
                          {i + 1}.{j + 1}
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-xl font-extrabold md:text-2xl">ماذا ستتعلم</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                `إتقان أساسيات ${c.category}`,
                "استخدام أدوات الصناعة باحتراف",
                "تنفيذ سيناريوهات هجوم كاملة",
                "كتابة تقارير أمنية معتمدة",
                "بناء مختبر شخصي آمن",
                "الاستعداد للشهادات الاحترافية",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 rounded-xl border border-border bg-surface p-4 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" /> {t}
                </div>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="text-xl font-extrabold">المدرب</h2>
            <div className="card-surface mt-5 p-6 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <GraduationCap className="size-8" />
              </span>
              <h3 className="mt-4 font-bold">{c.instructor}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                باحث أمن سيبراني وخبير اختبار اختراق بخبرة تتجاوز 10 سنوات في الفرق الحمراء والزرقاء، ومدرّب لآلاف
                الطلاب في العالم العربي.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary">
                <Award className="size-4" /> OSCP · CEH · CISSP
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
