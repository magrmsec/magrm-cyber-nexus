import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, GraduationCap, ShieldCheck, Users, Target, Terminal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui-bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "نبذة عن Magrm | باحث أمن سيبراني" },
      { name: "description", content: "Magrm باحث أمن سيبراني وخبير اختبار اختراق — الخبرة، الإحصائيات، والتخصصات." },
      { property: "og:title", content: "نبذة عن Magrm" },
      { property: "og:description", content: "باحث أمن سيبراني ومدرّب متخصص في الاختراق الأخلاقي." },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { icon: ShieldCheck, value: "+12", label: "سنة خبرة" },
  { icon: GraduationCap, value: "+1000", label: "دورة تدريبية" },
  { icon: Users, value: "+45,000", label: "طالب" },
  { icon: Bug, value: "+320", label: "ثغرة مكتشفة" },
];

const SKILLS = [
  "اختبار اختراق الشبكات والأنظمة",
  "أمن تطبيقات الويب و API",
  "عمليات الفريق الأحمر (Red Teaming)",
  "الهندسة العكسية وتحليل البرمجيات الخبيثة",
  "التحقيق الجنائي الرقمي والاستجابة للحوادث",
  "أمن السحابة والحاويات",
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="من أنا"
        title="Magrm — باحث أمن سيبراني"
        description="أعمل منذ أكثر من عقد في مجال الأمن الهجومي والدفاعي: اختبار اختراق للمؤسسات، أبحاث ثغرات، وبناء برامج تدريب عربية بمعايير عالمية."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="card-surface animate-rise p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <s.icon className="size-6" />
              </span>
              <div className="mt-4 text-2xl font-black text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="card-surface p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <Target className="size-5 text-primary" /> الرسالة
            </h2>
            <p className="mt-4 text-sm leading-9 text-muted-foreground">
              هدفي بناء جيل عربي قادر على الدفاع عن بنيته الرقمية. أؤمن بأن التعلم الحقيقي يحدث داخل المختبر لا في
              الشرائح النظرية، لذلك بُنيت كل مادة في هذه المنصة حول التطبيق العملي: بيئات حقيقية، أدوات حقيقية، وثغرات
              حقيقية موثّقة بمعرّفات CVE.
            </p>
            <p className="mt-4 text-sm leading-9 text-muted-foreground">
              عملت مع فرق أمنية في قطاعات المصارف والاتصالات والحكومة، وشاركت في برامج مكافآت اكتشاف الثغرات مع شركات
              عالمية، إضافة إلى تدريب فرق SOC والفرق الحمراء داخل المؤسسات.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/courses">تصفح دوراتي</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">تواصل معي</Link>
              </Button>
            </div>
          </div>

          <div className="card-surface p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <Terminal className="size-5 text-primary" /> التخصصات
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {SKILLS.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" /> {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
              <Award className="size-4" /> OSCP · OSCE · CEH · CISSP
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
