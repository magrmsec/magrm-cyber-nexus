import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, PlayCircle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allVideos, VIDEO_CATEGORIES, LEVELS, type Video } from "@/lib/data";
import { LevelBadge, PageHero, EmptyState } from "@/components/ui-bits";
import { FilterRow } from "./courses.index";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "مكتبة الفيديوهات | Magrm Cyber Security" },
      { name: "description", content: "700 فيديو شرح مجاني في الاختراق والأمن السيبراني: أدوات، شبكات، CTF وثغرات." },
      { property: "og:title", content: "مكتبة الفيديوهات | Magrm" },
      { property: "og:description", content: "شروحات عملية بالفيديو في الأمن السيبراني بالعربي." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const videos = useMemo(() => allVideos(), []);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [level, setLevel] = useState("الكل");
  const [shown, setShown] = useState(12);
  const [active, setActive] = useState<Video | null>(null);

  const filtered = videos.filter(
    (v) =>
      (cat === "الكل" || v.category === cat) &&
      (level === "الكل" || v.level === level) &&
      (!q.trim() || v.title.includes(q.trim()) || v.description.includes(q.trim())),
  );

  const set = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setShown(12);
  };

  return (
    <>
      <PageHero
        eyebrow="700 فيديو"
        title="مكتبة الفيديوهات"
        description="شروحات عملية مجانية بالفيديو: أدوات الاختراق، ثغرات الويب، الشبكات، وتحديات CTF."
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card-surface p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => set<string>(setQ)(e.target.value)}
              placeholder="ابحث في الفيديوهات… مثال: Nmap، CTF"
              className="h-12 pr-10 text-sm"
            />
          </div>
          <div className="mt-5 space-y-4">
            <FilterRow label="التصنيف" options={["الكل", ...VIDEO_CATEGORIES]} value={cat} onChange={set(setCat)} />
            <FilterRow label="المستوى" options={["الكل", ...LEVELS]} value={level} onChange={set(setLevel)} />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          عدد النتائج: <span className="font-bold text-primary">{filtered.length.toLocaleString("en-US")}</span> فيديو
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState text="لا توجد فيديوهات مطابقة." />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, shown).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActive(v)}
                  className="card-surface animate-rise flex flex-col p-0 text-right"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-surface-2">
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt={v.title}
                      loading="lazy"
                      className="size-full object-cover opacity-80 transition-opacity hover:opacity-100"
                    />
                    <span className="absolute inset-0 grid place-items-center">
                      <PlayCircle className="size-12 text-primary drop-shadow" />
                    </span>
                    <span className="absolute bottom-2 left-2 rounded bg-background/85 px-2 py-0.5 text-[11px] font-bold">
                      {v.minutes} د
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                        {v.category}
                      </span>
                      <LevelBadge level={v.level} />
                    </div>
                    <h2 className="mt-3 text-sm font-bold leading-7">{v.title}</h2>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-muted-foreground">{v.description}</p>
                    <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> {v.minutes} دقيقة
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {shown < filtered.length ? (
              <div className="mt-10 text-center">
                <Button size="lg" variant="outline" onClick={() => setShown((s) => s + 12)}>
                  عرض المزيد ({(filtered.length - shown).toLocaleString("en-US")} متبقية)
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>

      {active ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <div
            className="animate-rise w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
              <h3 className="min-w-0 truncate text-sm font-bold">{active.title}</h3>
              <button
                onClick={() => setActive(null)}
                aria-label="إغلاق"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                key={active.id}
                src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
            <div className="p-5">
              <p className="text-sm leading-7 text-muted-foreground">{active.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-sm font-bold text-primary"
              >
                فتح على يوتيوب ←
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
