import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | Magrm Cyber Security" },
      { name: "description", content: "تسجيل دخول مدير الموقع للوصول إلى لوحة إدارة المحتوى في Magrm." },
      { property: "og:title", content: "تسجيل الدخول | Magrm" },
      { property: "og:description", content: "بوابة الدخول إلى لوحة إدارة محتوى Magrm Cyber Security." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("أدخل بريداً صحيحاً وكلمة مرور من 6 أحرف على الأقل");
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("تم إنشاء الحساب", { description: "راجع بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول." });
          setMode("in");
          return;
        }
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error("تعذّر إتمام العملية", { description: err instanceof Error ? err.message : "حاول مرة أخرى" });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      toast.error("تعذّر تسجيل الدخول عبر Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <section className="hero-bg flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="card-surface animate-rise w-full max-w-md p-7">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-black">
          <span className="text-gradient">{mode === "in" ? "تسجيل الدخول" : "إنشاء حساب"}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          الدخول مخصص لإدارة محتوى الموقع.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground" htmlFor="email">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-2 h-11"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground" htmlFor="password">
              كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 h-11"
            />
          </div>
          <Button type="submit" size="lg" className="glow w-full font-bold" disabled={busy}>
            <LogIn className="size-4" /> {mode === "in" ? "دخول" : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> أو <span className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={google}>
          المتابعة باستخدام Google
        </Button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "in" ? "up" : "in"))}
          className="mt-5 w-full text-sm font-bold text-primary"
        >
          {mode === "in" ? "ليس لديك حساب؟ أنشئ حساباً" : "لديك حساب بالفعل؟ سجّل الدخول"}
        </button>
      </div>
    </section>
  );
}
