import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const APP_ROLES = ["admin", "editor", "viewer"] as const;
export const SITE_OWNER_EMAIL = "amgdkeit@gmail.com";

export function isSiteOwner(email: string | null | undefined): boolean {
  return email?.trim().toLocaleLowerCase() === SITE_OWNER_EMAIL;
}
export type AppRole = (typeof APP_ROLES)[number] | "user";

export const ROLE_LABELS: Record<string, string> = {
  admin: "مدير",
  editor: "محرر",
  viewer: "مشاهد",
  user: "مستخدم",
  owner: "مالك الموقع",
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: "صلاحيات كاملة: إضافة، تعديل، نشر، حذف، وإدارة الصلاحيات.",
  editor: "يضيف ويعدّل المحتوى، ولا يستطيع النشر أو الحذف.",
  viewer: "يطّلع على المحتوى داخل اللوحة فقط بدون أي تعديل.",
  user: "بدون صلاحيات على لوحة الإدارة.",
};

export interface Permissions {
  roles: string[];
  isOwner: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  isStaff: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canPublish: boolean;
  canDelete: boolean;
  canManageRoles: boolean;
}

export function permissionsFrom(roles: string[], isOwner = false): Permissions {
  const isAdmin = isOwner || roles.includes("admin");
  const isEditor = roles.includes("editor");
  const isViewer = roles.includes("viewer");
  return {
    roles,
    isOwner,
    isAdmin,
    isEditor,
    isViewer,
    isStaff: isAdmin || isEditor || isViewer,
    canCreate: isAdmin || isEditor,
    canEdit: isAdmin || isEditor,
    canPublish: isAdmin,
    canDelete: isAdmin,
    canManageRoles: isAdmin,
  };
}

export function useMyPermissions() {
  const query = useQuery({
    queryKey: ["my-roles"],
    queryFn: async (): Promise<{ roles: string[]; isOwner: boolean }> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return { roles: [], isOwner: false };
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      if (error) throw error;
      return {
        roles: (data ?? []).map((r) => r.role as string),
        isOwner: isSiteOwner(userData.user.email),
      };
    },
    staleTime: 60_000,
  });

  return {
    isLoading: query.isLoading,
    userId: undefined as string | undefined,
    permissions: permissionsFrom(query.data?.roles ?? [], query.data?.isOwner ?? false),
  };
}

export interface StaffMember {
  id: string;
  email: string | null;
  roles: string[];
  isOwner: boolean;
}

export async function fetchStaff(): Promise<StaffMember[]> {
  const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
    supabase.from("profiles").select("id, email").order("created_at", { ascending: true }),
    supabase.from("user_roles").select("user_id, role"),
  ]);
  if (pErr) throw pErr;
  if (rErr) throw rErr;
  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
    isOwner: isSiteOwner(p.email),
  }));
}

export async function grantRole(userId: string, role: string) {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as never });
  if (error) throw error;
}

export async function revokeRole(userId: string, role: string) {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role as never);
  if (error) throw error;
}
