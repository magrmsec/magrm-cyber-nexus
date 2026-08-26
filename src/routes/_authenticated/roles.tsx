import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  APP_ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  fetchStaff,
  grantRole,
  revokeRole,
  useMyPermissions,
} from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/roles")({
  head: () => ({
    meta: [
      { title: "إدارة الصلاحيات | Magrm Cyber Security" },
      { name: "description", content: "تحكّم بصلاحيات فريق Magrm: مدير، محرر، مشاهد — من يضيف ومن يعدّل ومن ينشر." },
      { property: "og:title", content: "إدارة الصلاحيات | Magrm" },
      { property: "og:description", content: "منح وسحب صلاحيات المدير والمحرر والمشاهد في لوحة إدارة Magrm." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  const queryClient = useQueryClient();
  const { permissions, isLoading: loadingPerms } = useMyPermissions();

  const { data: me } = useQuery({
    queryKey: ["me-id"],
    queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
  });

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
    enabled: permissions.canManageRoles,
  });

  const toggle = async (userId: string, role: string, has: boolean) => {
    try {
      if (has) await revokeRole(userId, role);
      else await grantRole(userId, role);
      toast.success(has ? `تم سحب صلاحية ${ROLE_LABELS[role]}` : `تم منح صلاحية ${ROLE_LABELS[role]}`);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["my-roles"] });
    } catch (err) {
      toast.error("تعذّر تحديث الصلاحية", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
    }
  };

  if (loadingPerms) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> جاري التحميل…
      </div>
    );
  }

  if (!permissions.canManageRoles) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-2xl font-black">هذه الصفحة للمدير فقط</h1>
        <p className="mt-2 text-sm text-muted-foreground">إدارة الصلاحيات متاحة لحسابات المدير (Admin) فقط.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/admin">العودة إلى اللوحة</Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10">
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">الصلاحيات</span>
            <h1 className="mt-3 text-2xl font-black md:text-3xl">
              <span className="text-gradient">إدارة الأدوار والصلاحيات</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              حدّد من يضيف ومن يعدّل ومن ينشر داخل لوحة إدارة المحتوى.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin">
              <ArrowRight className="size-4" /> لوحة المحتوى
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {APP_ROLES.map((r) => (
            <div key={r} className="card-surface p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="mt-4 font-extrabold">{ROLE_LABELS[r]}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-extrabold">
          الحسابات <span className="text-sm font-bold text-muted-foreground">({staff?.length ?? 0})</span>
        </h2>

        {isLoading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> جاري التحميل…
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {(staff ?? []).map((member) => {
              const isSelf = member.id === me;
              return (
                <div key={member.id} className="card-surface flex flex-wrap items-center gap-4 p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-muted-foreground">
                    <UserCog className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold" dir="ltr">
                      {member.email ?? member.id}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {member.isOwner
                        ? "مالك الموقع"
                        : member.roles.length
                          ? member.roles.map((r) => ROLE_LABELS[r] ?? r).join("، ")
                          : "بدون صلاحيات"}
                      {isSelf ? " — حسابك" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {APP_ROLES.map((r) => {
                      const has = member.isOwner || member.roles.includes(r);
                      const locked = member.isOwner || (isSelf && r === "admin");
                      return (
                        <button
                          key={r}
                          disabled={locked}
                          onClick={() => toggle(member.id, r, has)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            has
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary"
                          }`}
                          title={locked ? "حساب مالك الموقع محمي ولا يمكن سحب صلاحية الإدارة منه" : undefined}
                        >
                          {ROLE_LABELS[r]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
