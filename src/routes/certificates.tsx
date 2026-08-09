import { createFileRoute } from "@tanstack/react-router";
import { Award, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui-bits";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "الشهادات المهنية | Magrm Cyber Security" },
      { name: "description", content: "شهادات Magrm المهنية والاعتمادات في مجال الأمن السيبراني." },
      { property: "og:title", content: "الشهادات المهنية | Magrm" },
      { property: "og:description", content: "معرض شهادات Magrm المهنية في الأمن السيبراني." },
    ],
  }),
  component: CertificatesPage,
});

interface Cert {
  id: string;
  title: string;
  image: string;
}
const KEY = "magrm-certificates";

function CertificatesPage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCerts(JSON.parse(raw) as Cert[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Cert[]) => {
    setCerts(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = () => {
    if (!title.trim()) {
      toast.error("اكتب عنوان الشهادة أولاً");
      return;
    }
    persist([...certs, { id: String(Date.now()), title: title.trim(), image: image.trim() }]);
    setTitle("");
    setImage("");
    toast.success("تمت إضافة الشهادة");
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <PageHero
        eyebrow="Magrm"
        title="الشهادات المهنية"
        description="هذه المساحة مخصصة لعرض شهادات Magrm المهنية. أضف صورة الشهادة وعنوانها ليظهرا هنا مباشرة."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="card-surface p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <ImagePlus className="size-4 text-primary" /> إضافة شهادة جديدة
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Input
              id="cert-title"
              aria-label="عنوان الشهادة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الشهادة… مثال: OSCP - Offensive Security"
              maxLength={120}
              className="h-11"
            />
            <Input
              id="cert-file"
              aria-label="صورة الشهادة"
              type="file"
              accept="image/*"
              className="h-11 cursor-pointer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            <Button onClick={add} className="h-11 font-bold">
              <Plus className="size-4" /> إضافة
            </Button>
          </div>
          {image ? (
            <img src={image} alt="معاينة الشهادة" className="mt-4 h-40 rounded-xl border border-border object-contain" />
          ) : null}
        </div>

        {certs.length === 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-border bg-surface/40 text-center text-sm text-muted-foreground"
              >
                <div>
                  <Award className="mx-auto size-8 text-primary/60" />
                  <p className="mt-3">مكان مخصص لشهادة</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <div key={c.id} className="card-surface animate-rise overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-surface-2">
                    <Award className="size-10 text-primary/60" />
                  </div>
                )}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
                  <h3 className="min-w-0 truncate font-bold">{c.title}</h3>
                  <button
                    aria-label="حذف"
                    onClick={() => persist(certs.filter((x) => x.id !== c.id))}
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
