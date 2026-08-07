import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, GraduationCap, ShieldCheck, Users, Target, Terminal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui-bits";
import { sl, sv, useSiteSettings } from "@/lib/settings";

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

const STAT_ICONS = [ShieldCheck, GraduationCap, Users, Bug];

function AboutPage() {
  const { s } = useSiteSettings();
  const stats = STAT_ICONS.map((icon, i) => ({
    icon,
    value: sv(s, `aboutStat${i + 1}Value`),
    label: sv(s, `aboutStat${i + 1}Label`),
  })).filter((x) => x.value || x.label);
  const skills = sl(s, "aboutSkills");
  const certs = sl(s, "aboutCertificates");

  return (
    <>
      <PageHero
        eyebrow={sv(s, "aboutEyebrow")}
        title={sv(s, "aboutName")}
        description={sv(s, "aboutIntro")}
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((st) => (
            <div key={st.label} className="card-surface animate-rise p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <st.icon className="size-6" />
              </span>
              <div className="mt-4 text-2xl font-black text-primary">{st.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="card-surface p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <Target className="size-5 text-primary" /> الرسالة
            </h2>
            <p className="mt-4 text-sm leading-9 text-muted-foreground">{sv(s, "aboutMission")}</p>
            <p className="mt-4 text-sm leading-9 text-muted-foreground">{sv(s, "aboutExperience")}</p>
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
              {skills.map((sk) => (
                <li key={sk} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" /> {sk}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
              <Award className="size-4" /> {certs.join(" · ")}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
