import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { sv, useSiteSettings } from "@/lib/settings";


export const NAV_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/courses", label: "الدورات" },
  { to: "/videos", label: "الفيديوهات" },
  { to: "/tools", label: "الأدوات" },
  { to: "/apps", label: "التطبيقات" },
  { to: "/vulnerabilities", label: "الثغرات" },
  { to: "/ports", label: "البورتات" },
  { to: "/certificates", label: "الشهادات" },
  { to: "/about", label: "عن Magrm" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40">
            <ShieldCheck className="size-5" />
          </span>
          <span className="truncate text-base font-extrabold tracking-tight sm:text-lg">
            <span className="text-gradient">Magrm</span> Cyber Security
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary bg-primary/10" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <Button asChild size="sm" variant="outline">
              <Link to="/admin">لوحة الإدارة</Link>
            </Button>
          ) : null}
          <Button asChild size="sm">
            <Link to="/courses">ابدأ التعلم</Link>
          </Button>
        </div>

        <button
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="animate-rise border-t border-border bg-card/95 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-primary bg-primary/10" }}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/90"
              >
                {l.label}
              </Link>
            ))}
            {signedIn ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-bold text-primary"
              >
                لوحة الإدارة
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
