import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Bug,
  Cpu,
  PlayCircle,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LevelBadge, SeverityBadge } from "@/components/ui-bits";
import { rowToCourse, rowToVuln, useCmsCount, useCmsPreview } from "@/lib/cms";
import { sl, sv, useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magrm Cyber Security | المرونة السيبرانية تبدأ من هنا" },
      {
        name: "description",
        content:
          "منصة Magrm للأمن السيبراني: 12 قسماً رئيسياً وأكثر من 12000 دورة، 700 فيديو، 1000 ثغرة CVE، 20 مختبر اختراق عملي، و60+ أداة احترافية.",
      },
      { property: "og:title", content: "Magrm Cyber Security" },
      {
        property: "og:description",
        content: "تعلّم الاختراق الأخلاقي والأمن السيبراني بالعربي مع مختبرات عملية وأدوات احترافية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const AWARD_ICONS = [Award, Sparkles, ShieldCheck, Terminal];

const SECTION_LINKS = [
  { to: "/courses", label: "الدورات المدفوعة", desc: "12 قسماً رئيسياً وأكثر من 1000 دورة في كل قسم", icon: BookOpen },
  { to: "/ports", label: "البورتات العملية", desc: "تحديات اختراق واقعية بشهادة إنجاز", icon: ServerCog },
  { to: "/videos", label: "مكتبة الفيديو", desc: "فيديوهات شرح عملية مجانية", icon: PlayCircle },
  { to: "/vulnerabilities", label: "قاعدة الثغرات", desc: "ثغرات CVE مع التفاصيل والحلول", icon: Bug },
  { to: "/tools", label: "الأدوات", desc: "أدوات اختراق وتحليل مع روابط التحميل", icon: Cpu },
  { to: "/certificates", label: "الشهادات", desc: "شهادات Magrm المهنية والاعتمادات", icon: Award },
] as const;

function Index() {
  const { s } = useSiteSettings();
  const { rows: courseRows } = useCmsPreview("course", 6);
  const { rows: vulnRows } = useCmsPreview("vuln", 40);
  const { data: coursesCount } = useCmsCount("course");
  const { data: videosCount } = useCmsCount("video");
  const { data: vulnsCount } = useCmsCount("vuln");

  const featured = courseRows.map(rowToCourse);
  const latestVulns = vulnRows
    .map(rowToVuln)
    .filter((v) => v.cvss >= 8 || v.severity === "حرج")
    .sort((a, b) => b.date.localeCompare(a.date) || b.cvss - a.cvss)
    .slice(0, 5);
  const awards = AWARD_ICONS.map((icon, index) => ({
    icon,
    title: sv(s, `award${index + 1}Title`),
    year: sv(s, `award${index + 1}Year`),
  })).filter((award) => award.title || award.year);

  const nf = (n: number) => n.toLocaleString("en-US");
  const partners = sl(s, "partners");
  const STATS = [
    { value: sv(s, "stat1Value") || `${nf(coursesCount ?? 0)}+`, label: sv(s, "stat1Label") },
    { value: sv(s, "stat2Value") || `${nf(videosCount ?? 0)}+`, label: sv(s, "stat2Label") },
    { value: sv(s, "stat3Value") || `${nf(vulnsCount ?? 0)}+`, label: sv(s, "stat3Label") },
    { value: sv(s, "stat4Value") || "45,000+", label: sv(s, "stat4Label") },
  ];

  return (
    <>
      <section className="hero-bg relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="size-3.5" /> {sv(s, "heroBadge")}
          </span>
          <h1 className="animate-rise mt-6 max-w-4xl text-4xl font-black leading-[1.15] md:text-6xl">
            <span className="text-gradient">{sv(s, "heroTitle")}</span>
          </h1>
          <p className="animate-rise mt-6 max-w-2xl text-base leading-9 text-muted-foreground md:text-lg">
            {sv(s, "heroDescription")}
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="glow px-7 text-base font-bold">
              <Link to="/courses">{sv(s, "heroPrimaryCta")}</Link>
            </Button>
            <Link
              to="/videos"
              className="text-sm font-bold text-foreground underline-offset-8 transition-colors hover:text-primary hover:underline"
            >
              {sv(s, "heroSecondaryCta")}
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((st) => (
              <div key={st.label} className="card-surface p-5 text-center">
                <div className="text-2xl font-black text-primary md:text-3xl">{st.value}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-border bg-card/30 py-10">
        <p className="text-center text-xs font-bold tracking-widest text-muted-foreground">
          تقنيات وشركاء نعتمد عليهم في مناهجنا
        </p>
        <div className="mt-6 overflow-hidden">
          <div className="animate-marquee flex w-max gap-4">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-bold text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            {sv(s, "homeExploreTitle") || "استكشف المنصة"}
          </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_LINKS.map((sec) => (
            <Link key={sec.to} to={sec.to} className="card-surface group block p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <sec.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{sec.label}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{sec.desc}</p>
              <span className="mt-4 inline-block text-sm font-bold text-primary">اكتشف الآن ←</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="min-w-0 text-2xl font-extrabold md:text-3xl">
              {sv(s, "homeFeaturedTitle") || "دورات مميزة"}
            </h2>
            <Link to="/courses" className="shrink-0 text-sm font-bold text-primary">
              عرض الكل ←
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c.id}
                to="/courses/$courseId"
                params={{ courseId: String(c.id) }}
                className="card-surface flex flex-col p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    {c.category}
                  </span>
                  <LevelBadge level={c.level} />
                </div>
                <h3 className="mt-4 text-base font-bold leading-7">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{c.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 fill-warning text-warning" /> {c.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> {c.students.toLocaleString("en-US")}
                  </span>
                  <span>{c.hours} ساعة</span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-lg font-black text-primary">${c.price}</span>
                  <span className="text-sm font-bold">التفاصيل ←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest vulns */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="min-w-0 text-2xl font-extrabold md:text-3xl">
            {sv(s, "homeLatestTitle") || "أحدث الثغرات"}
          </h2>
          <Link to="/vulnerabilities" className="shrink-0 text-sm font-bold text-primary">
            كل الثغرات ←
          </Link>
        </div>
        <div className="mt-8 grid gap-3">
          {latestVulns.map((v) => (
            <Link
              key={v.id}
              to="/vulnerabilities/$vulnId"
              params={{ vulnId: String(v.id) }}
              className="card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs text-cyan">{v.cve}</div>
                <div className="mt-1 truncate font-bold">{v.name}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">CVSS {v.cvss}</span>
                <SeverityBadge severity={v.severity} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            {sv(s, "awardsTitle") || "جوائز الأمن السيبراني"}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a) => (
              <div key={a.title} className="card-surface p-6 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <a.icon className="size-6" />
                </span>
                <h3 className="mt-4 text-sm font-bold leading-7">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
