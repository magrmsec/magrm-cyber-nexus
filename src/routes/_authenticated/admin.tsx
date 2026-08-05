import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Plus, Trash2, Eye, EyeOff, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS, useMyPermissions } from "@/lib/roles";
import {
  CMS_KINDS,
  FIELDS,
  KIND_LABELS,
  fetchCmsRows,
  type CmsData,
  type CmsKind,
  type CmsRow,
  type FieldDef,
} from "@/lib/cms";


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة إدارة المحتوى | Magrm Cyber Security" },
      { name: "description", content: "لوحة تحكم Magrm لإضافة وتعديل الدورات والبورتات والفيديوهات والثغرات والأدوات." },
      { property: "og:title", content: "لوحة إدارة المحتوى | Magrm" },
      { property: "og:description", content: "إدارة كامل محتوى الموقع بدون تعديل الكود." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const emptyFor = (kind: CmsKind): CmsData => Object.fromEntries(FIELDS[kind].map((f) => [f.key, f.type === "number" ? 0 : ""]));

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<CmsKind>("course");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<CmsRow | null>(null);
  const [form, setForm] = useState<CmsData>(() => emptyFor("course"));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setIsAdmin(false);
        return;
      }
      const { data: rows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin");
      setIsAdmin((rows?.length ?? 0) > 0);
    });
  }, []);

  const { data: rows, isLoading } = useQuery({
    queryKey: ["cms", kind],
    queryFn: () => fetchCmsRows(kind),
  });

  const fields = useMemo(() => FIELDS[kind], [kind]);

  const switchKind = (k: CmsKind) => {
    setKind(k);
    setEditing(null);
    setForm(emptyFor(k));
  };

  const startEdit = (row: CmsRow) => {
    setEditing(row);
    setForm({ ...emptyFor(row.kind), ...row.data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["cms", kind] });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !String(form[f.key] ?? "").trim());
    if (missing.length) {
      toast.error("أكمل الحقول المطلوبة", { description: missing.map((f) => f.label).join("، ") });
      return;
    }
    setSaving(true);
    try {
      const payload: CmsData = {};
      for (const f of fields) {
        const raw = form[f.key];
        if (f.type === "number") payload[f.key] = Number(raw) || 0;
        else if (f.type === "list")
          payload[f.key] = String(raw ?? "")
            .split(/[,،]/)
            .map((s) => s.trim())
            .filter(Boolean);
        else payload[f.key] = String(raw ?? "");
      }
      if (editing) {
        const { error } = await supabase.from("cms_items").update({ data: payload as never }).eq("id", editing.id);
        if (error) throw error;
        toast.success("تم حفظ التعديلات");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("cms_items")
          .insert({ kind, data: payload as never, created_by: userData.user?.id ?? null });
        if (error) throw error;
        toast.success("تمت الإضافة بنجاح");
      }
      setEditing(null);
      setForm(emptyFor(kind));
      refresh();
    } catch (err) {
      toast.error("تعذّر الحفظ", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (row: CmsRow) => {
    const { error } = await supabase.from("cms_items").update({ published: !row.published }).eq("id", row.id);
    if (error) {
      toast.error("تعذّر تغيير حالة النشر");
      return;
    }
    toast.success(row.published ? "تم إخفاء العنصر" : "تم نشر العنصر");
    refresh();
  };

  const remove = async (row: CmsRow) => {
    if (!window.confirm("هل تريد حذف هذا العنصر نهائياً؟")) return;
    const { error } = await supabase.from("cms_items").delete().eq("id", row.id);
    if (error) {
      toast.error("تعذّر الحذف");
      return;
    }
    toast.success("تم الحذف");
    if (editing?.id === row.id) {
      setEditing(null);
      setForm(emptyFor(kind));
    }
    refresh();
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === false) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-2xl font-black">لا تملك صلاحية الإدارة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          هذا الحساب ليس مديراً للموقع. سجّل الدخول بحساب المدير للوصول إلى لوحة التحكم.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>
          تسجيل الخروج
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10">
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">لوحة الإدارة</span>
            <h1 className="mt-3 text-2xl font-black md:text-3xl">
              <span className="text-gradient">إدارة محتوى الموقع</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              أضف وعدّل الدورات والبورتات والفيديوهات والثغرات والأدوات مباشرة بدون تعديل الكود.
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="size-4" /> خروج
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {CMS_KINDS.map((k) => (
            <button
              key={k}
              onClick={() => switchKind(k)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                kind === k
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form onSubmit={save} className="card-surface h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold">
              {editing ? `تعديل عنصر في ${KIND_LABELS[kind]}` : `إضافة إلى ${KIND_LABELS[kind]}`}
            </h2>
            <div className="mt-5 space-y-4">
              {fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={form[f.key]}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit" className="glow flex-1 font-bold" disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                {editing ? "حفظ التعديلات" : "إضافة"}
              </Button>
              {editing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyFor(kind));
                  }}
                >
                  إلغاء
                </Button>
              ) : null}
            </div>
          </form>

          <div>
            <h2 className="text-lg font-extrabold">
              العناصر المضافة{" "}
              <span className="text-sm font-bold text-muted-foreground">({rows?.length ?? 0})</span>
            </h2>
            {isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> جاري التحميل…
              </div>
            ) : (rows?.length ?? 0) === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                لا توجد عناصر مضافة في هذا القسم بعد.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {rows!.map((row) => (
                  <div key={row.id} className="card-surface flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">
                        {String(row.data["title"] ?? row.data["name"] ?? row.data["cve"] ?? "بدون عنوان")}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {String(row.data["description"] ?? "")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        row.published ? "bg-primary/10 text-primary" : "bg-surface-2 text-muted-foreground"
                      }`}
                    >
                      {row.published ? "منشور" : "مخفي"}
                    </span>
                    <div className="flex gap-1.5">
                      <Button size="icon" variant="outline" aria-label="تعديل" onClick={() => startEdit(row)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="نشر أو إخفاء"
                        onClick={() => togglePublish(row)}
                      >
                        {row.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button size="icon" variant="outline" aria-label="حذف" onClick={() => remove(row)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: string | number) => void;
}) {
  const shown = Array.isArray(value) ? value.join("، ") : String(value ?? "");

  return (
    <div>
      <label className="text-xs font-bold text-muted-foreground" htmlFor={field.key}>
        {field.label} {field.required ? <span className="text-primary">*</span> : null}
      </label>
      {field.type === "textarea" ? (
        <Textarea
          id={field.key}
          value={shown}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-2"
        />
      ) : field.type === "select" ? (
        <select
          id={field.key}
          value={shown}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">— اختر —</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={field.key}
          type={field.type === "number" ? "number" : "text"}
          step="any"
          value={shown}
          onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
          className="mt-2 h-11"
        />
      )}
    </div>
  );
}
