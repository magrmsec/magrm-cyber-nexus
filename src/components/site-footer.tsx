import { Link } from "@tanstack/react-router";
import { Youtube, Twitter, Github, Send, Instagram, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "./site-header";
import { useSiteSettings } from "@/lib/settings";

// يضيف رسالة جاهزة تلقائيًا لأي رابط واتساب
function withWhatsAppMessage(url?: string, message?: string) {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}text=${encodeURIComponent(message ?? "")}`;
}

export function SiteFooter() {
  const { settings: s } = useSiteSettings();

  const socialLinks = [
    { label: "تويتر / X", href: s("twitterUrl"), icon: Twitter },
    { label: "GitHub", href: s("githubUrl"), icon: Github },
    { label: "يوتيوب", href: s("youtubeUrl"), icon: Youtube },
    { label: "تلجرام", href: s("telegramUrl"), icon: Send },
    { label: "انستغرام", href: s("instagramUrl"), icon: Instagram },
    {
      label: "واتساب",
      href: withWhatsAppMessage(s("whatsappUrl"), "مرحباً، أريد الاستفسار عن خدماتكم في Magrm Cyber Security"),
      icon: MessageCircle,
    },
  ].filter(x => x.href);

  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold">
              <span className="text-gradient">{s("brandPrefix")}</span>
              {s("brandSuffix")}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">{s("footerAbout")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  title={item.label}
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">روابط سريعة</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">تواصل معنا</h3>
          <p className="mt-4">
            <a href={`mailto:${s("contactEmail")}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <span className="text-sm">{s("contactEmail")}</span>
            </a>
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{s("footerContactNote")}</p>
          <a
            href={withWhatsAppMessage(s("whatsappUrl"), "مرحباً، أريد التواصل معكم بخصوص Magrm Cyber Security")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {s("footerCtaText")}
          </a>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {s("footerCopyright")}
      </div>
    </footer>
  );
}
