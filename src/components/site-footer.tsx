import { Link } from "@tanstack/react-router";
import { Github, Globe, Mail, Send, ShieldCheck, Twitter, Youtube } from "lucide-react";
import { NAV_LINKS } from "./site-header";

const SOCIALS = [
  { icon: Twitter, label: "X / Twitter", href: "https://x.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: Send, label: "Telegram", href: "https://telegram.org" },
  { icon: Globe, label: "الموقع", href: "https://lovable.dev" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40">
              <ShieldCheck className="size-5" />
            </span>
            <span className="text-lg font-extrabold">
              <span className="text-gradient">Magrm</span> Cyber Security
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            منصة عربية متخصصة في الأمن السيبراني والاختراق الأخلاقي: دورات، مختبرات عملية، فيديوهات، أدوات، وقاعدة
            ثغرات محدّثة.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">روابط سريعة</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">تواصل</h3>
          <a
            href="mailto:contact@magrm.security"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="size-4" /> contact@magrm.security
          </a>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            للاستشارات الأمنية، اختبار الاختراق، أو التدريب المؤسسي — راسلنا عبر صفحة التواصل.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            أرسل رسالة
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        جميع الحقوق محفوظة © Magrm Cyber Security 2024
      </div>
    </footer>
  );
}
