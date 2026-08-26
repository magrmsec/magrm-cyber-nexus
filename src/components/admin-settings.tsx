import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { SETTINGS_GROUPS, useSiteSettings, type SiteSettings } from "@/lib/settings";

/** محرر كل نصوص وألوان الموقع (جدول site_settings). */
export function SettingsPanel({ canEdit }: { canEdit: boolean }) {
  const { s, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="space-y-6">
      {SETTINGS_GROUPS.map((g) => (
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
