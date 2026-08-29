import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  Sparkles,
  Trash2,
  Users,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS, useMyPermissions } from "@/lib/roles";
import { sv, useSiteSettings } from "@/lib/settings";
import { SettingsPanel } from "@/components/admin-settings";
import {
  CMS_KINDS,
  FIELDS,
  KIND_LABELS,
  fetchAdminSlice,
  countAdmin,
  type CmsData,
  type CmsRow,
  type CmsKind,
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

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  values.push(value.trim());
  return values;
}

function parseVideoImport(text: string, fileName: string): CmsData[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("ملف JSON يجب أن يحتوي على مصفوفة فيديوهات");
    return parsed.map((item) => (item && typeof item === "object" ? (item as CmsData) : {}));
  }
  const lines = text.split(/\\r?\\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error("ملف CSV فارغ أو بلا صفوف");
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<CmsKind>("course");
  const [activeView, setActiveView] = useState<"overview" | "content" | "settings">("overview");
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<"all" | "published" | "draft">("all");
  const { permissions, isLoading: loadingPerms } = useMyPermissions();
  const { s } = useSiteSettings();
  const [editing, setEditing] = useState<CmsRow | null>(null);
  const [form, setForm] = useState<CmsData>(() => emptyFor("course"));
  const [saving, setSaving] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [migratingCertificates, setMigratingCertificates] = useState(false);

  useEffect(() => {
    if (!permissions.canEdit && editing) setEditing(null);
  }, [permissions.canEdit, editing]);

  useEffect(() => {
    if (kind !== "certificate" || !permissions.canEdit || migratingCertificates) return;
    let cancelled = false;
    const migrate = async () => {
      setMigratingCertificates(true);
      try {
        const { data: existing, error: existingError } = await supabase.from("cms_items").select("data").eq("kind", "certificate");
        if (existingError) throw existingError;
        const existingKeys = new Set((existing ?? []).map((row) => `${String((row.data as CmsData)?.title ?? "")}::${String((row.data as CmsData)?.image ?? "")}`));
        const legacy = await import("@/lib/certificate-catalog");
        const missing = legacy.FEATURED_CERTIFICATES.filter((certificate) => !existingKeys.has(`${certificate.title}::${certificate.image}`));
        if (missing.length) {
          const { data: userData } = await supabase.auth.getUser();
          const { error } = await supabase.from("cms_items").insert(
            missing.map((certificate) => ({
              kind: "certificate" as const,
              data: { title: certificate.title, issuer: certificate.issuer, focus: certificate.focus, image: certificate.image, legacyId: certificate.id } as never,
              published: permissions.canPublish,
              created_by: userData.user?.id ?? null,
            })),
          );
          if (error) throw error;
          if (!cancelled) toast.success(`تم ترحيل ${missing.length} شهادة إلى CMS`);
          if (!cancelled) refresh();
        }
      } catch (err) {
        if (!cancelled) toast.error("تعذّر ترحيل الشهادات القديمة", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
      } finally {
        if (!cancelled) setMigratingCertificates(false);
      }
    };
    void migrate();
    return () => {
      cancelled = true;
    };
  }, [kind, permissions.canEdit, permissions.canPublish]);


  const PAGE_SIZE = 200;
  const {
    data: adminPages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["cms-admin", kind],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchAdminSlice(kind, pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => (lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE),
    enabled: permissions.isStaff,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const rows = useMemo(() => adminPages?.pages.flat() ?? [], [adminPages]);

  const { data: overviewCounts = [] } = useQuery({
    queryKey: ["admin-overview-counts"],
    queryFn: async () =>
      Promise.all(
        CMS_KINDS.map(async (k) => ({
          kind: k,
          count: await countAdmin(k),
        })),
      ),
    enabled: permissions.isStaff,
    staleTime: 30_000,
  });

  const fields = useMemo(() => FIELDS[kind], [kind]);
  const visibleRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return (rows ?? []).filter((row) => {
      const matchesVisibility =
        visibility === "all" || (visibility === "published" ? row.published : !row.published);
      if (!matchesVisibility) return false;
      if (!term) return true;
      return Object.values(row.data).some((value) => String(value ?? "").toLocaleLowerCase().includes(term));
    });
  }, [rows, search, visibility]);

  const switchKind = (k: CmsKind) => {
    setKind(k);
    setActiveView("content");
    setEditing(null);
    setForm(emptyFor(k));
    setSearch("");
    setVisibility("all");
  };

  const startEdit = (row: CmsRow) => {
    setEditing(row);
    setForm({ ...emptyFor(row.kind), ...row.data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["cms-admin", kind] });
    void queryClient.invalidateQueries({ queryKey: ["admin-overview-counts"] });
    void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  };

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

  const importVideos = async (file: File) => {
    if (!permissions.canEdit) {
      toast.error("لا تملك صلاحية استيراد الفيديوهات");
      return;
    }
    setImporting(true);
    try {
      const imported = parseVideoImport(await file.text(), file.name);
      const valid = imported.filter((item) => /^[A-Za-z0-9_-]{11}$/.test(String(item.youtubeId ?? "")));
      if (!valid.length) throw new Error("لم يتم العثور على معرفات فيديو صالحة");
      const { data: existingRows, error: existingError } = await supabase
        .from("cms_items")
        .select("data")
        .eq("kind", "video");
      if (existingError) throw existingError;
      const existingIds = new Set((existingRows ?? []).map((row) => String((row.data as CmsData)?.youtubeId ?? "")));
      const unique = valid.filter((item, index, list) => {
        const id = String(item.youtubeId);
        return !existingIds.has(id) && list.findIndex((candidate) => String(candidate.youtubeId) === id) === index;
      });
      if (!unique.length) throw new Error("كل فيديوهات الملف موجودة مسبقًا أو مكررة");
      const { data: userData } = await supabase.auth.getUser();
      for (let start = 0; start < unique.length; start += 100) {
        const batch = unique.slice(start, start + 100).map((item) => ({
          kind: "video" as const,
          data: {
            title: String(item.title ?? "فيديو أمن سيبراني"),
            description: String(item.description ?? "شرح تعليمي رسمي في الأمن السيبراني ضمن نطاق قانوني ومصرح به."),
            youtubeId: String(item.youtubeId),
            category: String(item.category ?? "شروحات أدوات"),
            level: String(item.level ?? "متوسط"),
            minutes: Number(item.minutes) || 30,
          } as never,
          published: permissions.canPublish,
          created_by: userData.user?.id ?? null,
        }));
        const { error } = await supabase.from("cms_items").insert(batch);
        if (error) throw error;
      }
      toast.success(`تم استيراد ${unique.length} فيديو`, { description: `تم تجاهل ${imported.length - unique.length} سجل مكرر أو غير صالح.` });
      refresh();
    } catch (err) {
      toast.error("تعذّر استيراد الملف", { description: err instanceof Error ? err.message : "تحقق من صيغة CSV أو JSON" });
    } finally {
      setImporting(false);
    }
  };

  const togglePublish = async (row: CmsRow) => {
    if (!permissions.canPublish) {
      toast.error("النشر متاح للمدير فقط");
      return;
    }
    const { error } = await supabase.from("cms_items").update({ published: !row.published }).eq("id", row.id);
    if (error) {
      toast.error("تعذّر تغيير حالة النشر");
      return;
    }
    toast.success(row.published ? "تم إخفاء العنصر" : "تم نشر العنصر");
    refresh();
  };

  const remove = async (row: CmsRow) => {
    if (!permissions.canDelete) {
      toast.error("الحذف متاح للمدير فقط");
      return;
    }
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

  const copyCatalogToEditor = async (row: CmsRow) => {
    if (!permissions.canEdit) return;
    setCopyingId(row.id);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("cms_items").insert({
        kind: row.kind,
        data: row.data as never,
        published: permissions.canPublish,
        created_by: userData.user?.id ?? null,
      });
      if (error) throw error;
      toast.success("تم نسخ العنصر إلى المحرر", { description: "يمكنك الآن تعديله من نموذج التحرير." });
      refresh();
    } catch (err) {
      toast.error("تعذّر نسخ العنصر", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
    } finally {
      setCopyingId(null);
    }
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loadingPerms) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> جاري التحميل…
      </div>
    );
  }

  if (!permissions.isStaff) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-2xl font-black">لا تملك صلاحية الدخول للوحة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          هذا الحساب بدون صلاحيات. اطلب من مدير الموقع منحك صلاحية محرر أو مشاهد.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>
          تسجيل الخروج
        </Button>
      </section>
    );
  }

  const myRole = permissions.isAdmin ? "admin" : permissions.isEditor ? "editor" : "viewer";

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
              صلاحيتك الحالية: <strong className="text-primary">{ROLE_LABELS[myRole]}</strong> —{" "}
              {permissions.canPublish
                ? "تضيف وتعدّل وتنشر وتحذف."
                : permissions.canEdit
                  ? "تضيف وتعدّل، والنشر والحذف للمدير."
                  : "عرض فقط بدون تعديل."}
            </p>
          </div>
          <div className="flex gap-2">
            {permissions.canManageRoles ? (
              <Button asChild variant="outline">
                <Link to="/roles">
                  <Users className="size-4" /> الصلاحيات
                </Link>
              </Button>
            ) : null}
            <Button variant="outline" onClick={signOut}>
              <LogOut className="size-4" /> خروج
            </Button>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="card-surface h-fit p-3 lg:sticky lg:top-24">
            <div className="px-3 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">مركز التحكم</p>
              <p className="mt-1 text-xs text-muted-foreground">إدارة Magrm من مكان واحد</p>
            </div>
            <div className="space-y-1">
              <AdminNavButton active={activeView === "overview"} icon={LayoutDashboard} onClick={() => setActiveView("overview")}>
                نظرة عامة
              </AdminNavButton>
              <p className="px-3 pb-1 pt-4 text-[11px] font-bold text-muted-foreground">إدارة المحتوى</p>
              {CMS_KINDS.map((k) => (
                <AdminNavButton
                  key={k}
                  active={activeView === "content" && kind === k}
                  icon={BarChart3}
                  onClick={() => switchKind(k)}
                >
                  {KIND_LABELS[k]}
                </AdminNavButton>
              ))}
              <p className="px-3 pb-1 pt-4 text-[11px] font-bold text-muted-foreground">إعدادات المنصة</p>
              <AdminNavButton active={activeView === "settings"} icon={Settings2} onClick={() => setActiveView("settings")}>
                إعدادات الموقع
              </AdminNavButton>
              {permissions.canManageRoles ? (
                <Button asChild variant="ghost" className="mt-1 w-full justify-start gap-3 px-3 text-sm font-bold text-muted-foreground hover:text-primary">
                  <Link to="/roles">
                    <Users className="size-4" /> الصلاحيات والفريق
                  </Link>
                </Button>
              ) : null}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-surface-2 p-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={`size-2 rounded-full ${sv(s, "maintenanceMode") === "true" ? "bg-amber-400" : "bg-emerald-400"}`} />
                {sv(s, "maintenanceMode") === "true" ? "الموقع في وضع الصيانة" : "الموقع يعمل مباشرة"}
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">يمكن تغيير الحالة من إعدادات الموقع.</p>
            </div>
          </aside>

          <div className="min-w-0">
            {activeView === "overview" ? (
              <AdminOverview
                counts={overviewCounts}
                myRole={ROLE_LABELS[myRole] ?? myRole}
                maintenanceMode={sv(s, "maintenanceMode") === "true"}
                onOpenSettings={() => setActiveView("settings")}
                onSelectKind={switchKind}
              />
            ) : null}
            {activeView === "settings" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">إعدادات المنصة</p>
                  <h2 className="mt-2 text-2xl font-black">تحكم كامل في الهوية والتشغيل</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">عدّل النصوص والألوان وروابط التواصل، أو فعّل وضع الصيانة عند الحاجة.</p>
                </div>
                <SettingsPanel canEdit={permissions.canPublish} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section hidden={activeView !== "content"} className="mx-auto max-w-7xl px-4 pb-10">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">إدارة {KIND_LABELS[kind]}</p>
            <h2 className="mt-1 text-xl font-black">المحتوى الحالي</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الوصف…"
                className="h-10 w-full pr-9 sm:w-64"
              />
            </div>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as typeof visibility)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              aria-label="تصفية حالة النشر"
            >
              <option value="all">كل الحالات</option>
              <option value="published">المنشور فقط</option>
              <option value="draft">المخفي فقط</option>
            </select>
            <Button type="button" variant="outline" size="icon" aria-label="تحديث القائمة" onClick={refresh}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>

        <div className={`grid gap-8 ${permissions.canEdit ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : ""}`}>
          {permissions.canEdit ? (
            <form onSubmit={save} className="card-surface h-fit p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-extrabold">
                {editing ? `تعديل عنصر في ${KIND_LABELS[kind]}` : `إضافة إلى ${KIND_LABELS[kind]}`}
              </h2>
              {kind === "video" && !editing ? (
                <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-bold">إضافة جماعية للفيديوهات</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">ارفع ملف CSV أو JSON لإضافة عدة فيديوهات دفعة واحدة، مع تجاهل المكرر تلقائيًا.</p>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/50 px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10">
                    {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    {importing ? "جاري الاستيراد…" : "اختيار ملف الاستيراد"}
                    <input
                      type="file"
                      accept=".csv,.json,application/json,text/csv"
                      className="sr-only"
                      disabled={importing}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.currentTarget.value = "";
                        if (file) void importVideos(file);
                      }}
                    />
                  </label>
                </div>
              ) : null}
              {!permissions.canPublish ? (
                <p className="mt-2 rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
                  كمحرر، العناصر التي تضيفها تبقى مخفية حتى يعتمدها المدير وينشرها.
                </p>
              ) : null}
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
          ) : null}


          <div>
            <h2 className="text-lg font-extrabold">
              العناصر الظاهرة في اللوحة{" "}
              <span className="text-sm font-bold text-muted-foreground">({rows?.length ?? 0})</span>
            </h2>
            {isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> جاري التحميل…
              </div>
            ) : visibleRows.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                لا توجد نتائج مطابقة لهذا البحث أو الفلتر.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {visibleRows.map((row) => {
                  const isCatalog = row.source === "catalog";
                  return (
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
                          isCatalog
                            ? "bg-sky-500/10 text-sky-300"
                            : row.published
                              ? "bg-primary/10 text-primary"
                              : "bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        {isCatalog ? "كتالوج" : row.published ? "منشور" : "مخفي"}
                      </span>
                      <div className="flex gap-1.5">
                        {isCatalog && permissions.canEdit ? (
                          <Button
                            size="sm"
                            variant="outline"
                            aria-label="نسخ للتعديل"
                            disabled={copyingId === row.id}
                            onClick={() => void copyCatalogToEditor(row)}
                          >
                            {copyingId === row.id ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" />}
                            <span className="hidden sm:inline">نسخ للتعديل</span>
                          </Button>
                        ) : null}
                        {!isCatalog && permissions.canEdit ? (
                          <Button size="icon" variant="outline" aria-label="تعديل" onClick={() => startEdit(row)}>
                            <Pencil className="size-4" />
                          </Button>
                        ) : null}
                        {!isCatalog && permissions.canPublish ? (
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="نشر أو إخفاء"
                            onClick={() => togglePublish(row)}
                          >
                            {row.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </Button>
                        ) : null}
                        {!isCatalog && permissions.canDelete ? (
                          <Button size="icon" variant="outline" aria-label="حذف" onClick={() => remove(row)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {hasNextPage ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 w-full font-bold"
                    disabled={isFetchingNextPage}
                    onClick={() => void fetchNextPage()}
                  >
                    {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {isFetchingNextPage ? "جاري تحميل المزيد…" : "تحميل بقية المحتوى"}
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function AdminNavButton({
  active,
  icon: Icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: typeof LayoutDashboard;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm font-bold transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(255,45,120,0.18)]"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </button>
  );
}

function AdminOverview({
  counts,
  myRole,
  maintenanceMode,
  onOpenSettings,
  onSelectKind,
}: {
  counts: Array<{ kind: CmsKind; count: number }>;
  myRole: string;
  maintenanceMode: boolean;
  onOpenSettings: () => void;
  onSelectKind: (kind: CmsKind) => void;
}) {
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-surface p-6 md:p-8">
        <div className="pointer-events-none absolute -left-12 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
              <Sparkles className="size-3.5" /> مركز قيادة Magrm
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight">كل شيء تحت سيطرتك</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              راقب محتوى المنصة، عدّل النصوص والإعدادات، وتحكم في حالة الموقع من لوحة واحدة مصممة للعمل بسرعة ووضوح.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="glow font-bold" onClick={onOpenSettings}>
              <Settings2 className="size-4" /> إعدادات الموقع
            </Button>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2 text-xs font-bold text-muted-foreground">
              <span className={`size-2 rounded-full ${maintenanceMode ? "bg-amber-400" : "bg-emerald-400"}`} />
              {maintenanceMode ? "وضع الصيانة" : "يعمل مباشرة"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStat icon={Activity} label="إجمالي العناصر" value={total.toLocaleString("ar-YE")} tone="primary" />
        <OverviewStat icon={CheckCircle2} label="أقسام المحتوى" value={CMS_KINDS.length.toString()} tone="emerald" />
        <OverviewStat icon={Users} label="صلاحيتك" value={myRole} tone="sky" />
        <OverviewStat icon={Settings2} label="الإعدادات المركزية" value="متاحة" tone="amber" />
      </div>

      <section className="card-surface p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">وصول سريع</p>
            <h3 className="mt-1 text-xl font-black">اختر قسمًا لإدارته</h3>
          </div>
          <p className="text-xs text-muted-foreground">الإحصائيات تُحدّث تلقائيًا من قاعدة المحتوى.</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {counts.map(({ kind, count }) => (
            <button
              key={kind}
              type="button"
              onClick={() => onSelectKind(kind)}
              className="group flex items-center justify-between rounded-2xl border border-border bg-surface-2 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card"
            >
              <span>
                <strong className="block text-sm font-black">{KIND_LABELS[kind]}</strong>
                <span className="mt-1 block text-xs text-muted-foreground">فتح وإدارة العناصر</span>
              </span>
              <span className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-black text-primary transition-transform group-hover:scale-105">
                {count.toLocaleString("ar-YE")}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function OverviewStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone: "primary" | "emerald" | "sky" | "amber";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-400",
    sky: "bg-sky-500/10 text-sky-400",
    amber: "bg-amber-500/10 text-amber-400",
  } as const;

  return (
    <div className="card-surface p-5">
      <div className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="size-5" />
      </div>
      <p className="mt-4 text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black text-foreground">{value}</p>
    </div>
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
