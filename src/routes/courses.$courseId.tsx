import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Clock, GraduationCap, Star, Users, Award, PlayCircle, MessageCircle } from "lucide-react";
import { fetchCmsRowBySeq, rowToCourse } from "@/lib/cms";
import { LevelBadge } from "@/components/ui-bits";
import { useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/courses/$courseId")({
  loader: async ({ params }) => {
    const id = Number(params.courseId);
    if (Number.isNaN(id) || id < 1) throw notFound();
    const row = await fetchCmsRowBySeq("course", id);
    if (!row || !row.published) throw notFound();
    return { course: rowToCourse(row) };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const { settings: s } = useSiteSettings();

  const message = `السلام عليكم، أريد شراء/الاشتراك في التالي:\nالاسم: ${course.title}\nالسعر: ${course.price}$`;
  const whatsappUrl = `${s("whatsappUrl")}?text=${encodeURIComponent(message)}`;

  return (
    <section className="hero-bg border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <Link to="/courses" className="text-sm font-bold text-primary">
          ← العودة لمكتبة الدورات
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{course.category}</span>
              <LevelBadge level={course.level} />
            </div>
            <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-4xl">
              <span className="text-gradient">{course.title}</span>
            </h1>
            <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{course.description}</p>

            <div className="mt-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"
              >
                <MessageCircle className="size-6" />
                اشترك الآن عبر الواتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
