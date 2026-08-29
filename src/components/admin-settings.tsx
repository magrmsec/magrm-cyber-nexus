import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { SETTINGS_GROUPS, useSiteSettings, type SiteSettings } from "@/lib/settings";

/** محرر كل نصوص وألوان الموقع (جدول site_settings). */
const SETTINGS_SECTIONS = [
  { id: "home", title: "الرئيسية", description: "الواجهة الرئيسية والهوية والإحصائيات والجوائز" },
  { id: "courses", title: "الدورات", description: "عنوان صفحة الدورات ووصفها" },
  { id: "videos", title: "الفيديوهات", description: "نصوص مكتبة الفيديوهات وخلفيتها" },
  { id: "certificates", title: "الشهادات", description: "نصوص قسم الشهادات والاعتمادات" },
  { id: "tools", title: "الأدوات", description: "نصوص صفحة الأدوات" },
  { id: "apps", title: "التطبيقات", description: "نصوص صفحة التطبيقات" },
  { id: "vulns", title: "الثغرات", description: "نصوص صفحة الثغرات" },
  { id: "ports", title: "البورتات", description: "نصوص صفحة البورتات" },
  { id: "contact", title: "التواصل", description: "نصوص وروابط منصات التواصل" },
  { id: "about", title: "عني", description: "النبذة والرسالة والتخصصات" },
  { id: "footer", title: "الفوتر", description: "نصوص أسفل الموقع" },
  { id: "general", title: "إعدادات الموقع", description: "التشغيل والألوان والدفع والنصوص المشتركة" },
] as const;

type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]["id"];

function fieldBelongsTo(key: string, section: SettingsSectionId) {
  if (section === "home") return /^(brand|siteTagline|hero|home|partners|stat|award)/.test(key);
  if (section === "courses") return /^(coursesPage|course)/.test(key);
  if (section === "videos") return /^(videosPage|video)/.test(key);
  if (section === "certificates") return /^(certificatesPage|certificate)/.test(key);
  if (section === "tools") return /^(toolsPage|tool)/.test(key);
  if (section === "apps") return /^(appsPage|app)/.test(key);
  if (section === "vulns") return /^(vulnsPage|vuln)/.test(key);
  if (section === "ports") return /^(portsPage|port)/.test(key);
  if (section === "contact") return /^contact|^(whatsapp|telegram|instagram|youtube|twitter|github)/.test(key);
  if (section === "about") return /^about/.test(key);
  if (section === "footer") return /^footer/.test(key);
  return /^(detail|ui|maintenance|payment|color|supportEmail)/.test(key);
}

export function SettingsPanel({ canEdit }: { canEdit: boolean }) {
  const { s, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("home");

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const g of SETTINGS_GROUPS)
      for (const f of g.fields) {
        const v = s[f.key];
        next[f.key] = Array.isArray(v) ? v.join("، ") : ((v as string) ?? "");
      }
    setDraft(next);
  }, [s]);

  const save = async () => {
    setSaving(true);
    try {
      const data: SiteSettings = {};
      for (const g of SETTINGS_GROUPS)
        for (const f of g.fields) {
          const raw = draft[f.key] ?? "";
          data[f.key] =
            f.type === "list"
              ? raw
                  .split(/[,،]/)
                  .map((x) => x.trim())
                  .filter(Boolean)
              : raw;
        }
      const { error } = await supabase
        .from("site_settings")
        .upsert({ id: "main", data: data as never });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("تم حفظ إعدادات الموقع");
    } catch (err) {
      toast.error("تعذّر الحفظ", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> جاري تحميل الإعدادات…
      </div>
    );
  }

  const activeSectionInfo = SETTINGS_SECTIONS.find((section) => section.id === activeSection) ?? SETTINGS_SECTIONS[0];
  const visibleGroups = useMemo(
    () => SETTINGS_GROUPS.map((group) => ({ ...group, fields: group.fields.filter((field) => fieldBelongsTo(field.key, activeSection)) })).filter((group) => group.fields.length),
    [activeSection],
  );

  return (
    <div className="space-y-6">
      <div className="card-surface p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-xl border px-4 py-3 text-right transition-colors ${activeSection === section.id ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(255,45,120,0.18)]" : "border-border bg-surface-2 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              <strong className="block text-sm font-black">{section.title}</strong>
              <span className="mt-1 block text-[11px] leading-5 opacity-80">{section.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">قسم مستقل</p>
        <h3 className="mt-2 text-xl font-black">{activeSectionInfo.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{activeSectionInfo.description} — عدّل الحقول ثم اضغط حفظ.</p>
      </div>
      {visibleGroups.map((g) => (
        <div key={g.id} className="card-surface p-6">
          <h3 className="text-base font-extrabold text-primary">{g.title}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {g.fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" || f.type === "list" || f.type === "toggle" ? "md:col-span-2" : ""}>
                <label className="mb-2 block text-xs font-bold text-muted-foreground">{f.label}</label>
                {f.type === "toggle" ? (
                  <button
                    type="button"
                    disabled={!canEdit}
                    aria-pressed={draft[f.key] === "true"}
                    onClick={() => setDraft({ ...draft, [f.key]: draft[f.key] === "true" ? "false" : "true" })}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition-colors ${
                      draft[f.key] === "true"
                        ? "border-amber-400/40 bg-amber-400/10"
                        : "border-emerald-400/30 bg-emerald-400/10"
                    }`}
                  >
                    <span>
                      <strong className="block text-sm font-black">
                        {draft[f.key] === "true" ? "وضع الصيانة مفعّل" : "الموقع يعمل مباشرة"}
                      </strong>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {draft[f.key] === "true" ? "الزوار يرون صفحة الصيانة" : "المحتوى ظاهر للزوار"}
                      </span>
                    </span>
                    <span className={`relative h-6 w-11 rounded-full p-1 transition-colors ${draft[f.key] === "true" ? "bg-amber-500" : "bg-emerald-500"}`}>
                      <span className={`block size-4 rounded-full bg-white transition-transform ${draft[f.key] === "true" ? "translate-x-5" : "translate-x-0"}`} />
                    </span>
                  </button>
                ) : f.type === "textarea" ? (
                  <Textarea
                    rows={3}
                    disabled={!canEdit}
                    value={draft[f.key] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  />
                ) : (
                  <Input
                    className="h-11"
                    dir={f.type === "color" ? "ltr" : undefined}
                    placeholder={f.type === "color" ? "#ff2d78" : (f.hint ?? "")}
                    disabled={!canEdit}
                    value={draft[f.key] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  />
                )}
                {f.hint ? <p className="mt-1 text-[11px] text-muted-foreground">{f.hint}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button size="lg" className="glow font-bold" disabled={!canEdit || saving} onClick={() => void save()}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ إعدادات الموقع
      </Button>
    </div>
  );
}
