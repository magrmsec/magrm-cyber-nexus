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
import { useCmsCourses, useCmsVideos, useCmsVulns } from "@/lib/cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magrm Cyber Security | المرونة السيبرانية تبدأ من هنا" },
      {
        name: "description",
        content:
          "منصة Magrm للأمن السيبراني: 1000 دورة، 700 فيديو، 1000 ثغرة CVE، 20 مختبر اختراق عملي، و50+ أداة احترافية.",
      },
      { property: "og:title", content: "Magrm Cyber Security" },
      {
        property: "og:description",
        content: "تعلّم الاختراق الأخلاقي والأمن السيبراني بالعربي مع مختبرات عملية وأدوات احترافية.",
      },
    ],
  }),
  component: Index,
});

const PARTNERS = ["CrowdStrike", "Fortinet", "Palo Alto", "Cisco", "IBM Security", "Splunk", "Microsoft", "AWS"];

const AWARDS = [
  { title: "أفضل منصة تدريب سيبراني عربية", year: "2024", icon: Award },
  { title: "جائزة التميّز في المحتوى التقني", year: "2023", icon: Sparkles },
  { title: "اعتماد مسارات Red Team", year: "2023", icon: ShieldCheck },
  { title: "أفضل مختبرات عملية", year: "2022", icon: Terminal },
];

const SECTIONS = [
  { to: "/courses", label: "الدورات المدفوعة", desc: "1000 دورة في كل تخصصات الأمن السيبراني", icon: BookOpen },
  { to: "/ports", label: "البورتات العملية", desc: "20 تحدي اختراق واقعي بشهادة إنجاز", icon: ServerCog },
  { to: "/videos", label: "مكتبة الفيديو", desc: "فيديوهات شرح عملية مجانية", icon: PlayCircle },
  { to: "/vulnerabilities", label: "قاعدة الثغرات", desc: "1000 ثغرة CVE مع التفاصيل والحلول", icon: Bug },
  { to: "/tools", label: "الأدوات", desc: "60+ أداة اختراق وتحليل مع روابط التحميل", icon: Cpu },
  { to: "/certificates", label: "الشهادات", desc: "شهادات Magrm المهنية والاعتمادات", icon: Award },
] as const;

function Index() {
  const { items: courses } = useCmsCourses();
  const { items: videos } = useCmsVideos();
  const { items: vulns } = useCmsVulns();
  const featured = courses.slice(0, 6);
  const latestVulns = [...vulns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const students = courses.reduce((sum, c) => sum + c.students, 0);
  const nf = (n: number) => n.toLocaleString("en-US");
  const STATS = [
    { value: `${nf(courses.length)}+`, label: "دورة تدريبية" },
    { value: `${nf(videos.length)}+`, label: "فيديو شرح" },
    { value: `${nf(vulns.length)}+`, label: "ثغرة موثّقة" },
    { value: students > 1000 ? `${Math.round(students / 1000)}K+` : `${nf(students)}+`, label: "متدرّب" },
  ];

  return (
    <>
      <section className="hero-bg relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="size-3.5" /> منصة Magrm للأمن السيبراني
          </span>
          <h1 className="animate-rise mt-6 max-w-4xl text-4xl font-black leading-[1.15] md:text-6xl">
            <span className="text-gradient">المرونة السيبرانية يبدأ من هنا</span>
          </h1>
          <p className="animate-rise mt-6 max-w-2xl text-base leading-9 text-muted-foreground md:text-lg">
            ابنِ مهاراتك الهجومية والدفاعية عبر مسارات عملية بالكامل: مختبرات اختراق حيّة، تحليل ثغرات حقيقية، أدوات
            الصناعة، وتقارير بمعايير احترافية — كل ذلك بالعربي.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="glow px-7 text-base font-bold">
              <Link to="/courses">مكتبة الدورات</Link>
            </Button>
            <Link
              to="/videos"
              className="text-sm font-bold text-foreground underline-offset-8 transition-colors hover:text-primary hover:underline"
            >
              ابدأ التعلم مجاناً ←
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card-surface p-5 text-center">
                <div className="text-2xl font-black text-primary md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
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
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
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
          استكشف <span className="text-gradient">المنصة</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className="card-surface group block p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.label}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.desc}</p>
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
              دورات <span className="text-gradient">مميزة</span>
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
            أحدث <span className="text-gradient">الثغرات</span>
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
            جوائز <span className="text-gradient">الأمن السيبراني</span>
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map((a) => (
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
