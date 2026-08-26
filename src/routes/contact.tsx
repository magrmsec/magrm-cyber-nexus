import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Github, Instagram, Mail, MessageCircle, Send, Youtube } from "lucide-react";
import { useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function WhatsAppBusinessIcon() {
  return (
    <span className="relative block size-8" aria-label="واتساب الأعمال">
      <MessageCircle className="size-8" />
      <span className="absolute -bottom-1 -right-2 grid size-4 place-items-center rounded-full bg-emerald-600 text-white ring-2 ring-card">
        <BriefcaseBusiness className="size-2.5" />
      </span>
    </span>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.956 6.817H1.69l7.73-8.835L1.266 2.25h6.826l4.713 6.231 5.439-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function ContactPage() {
  const { settings: s } = useSiteSettings();
  const whatsappNumber = "967733570889";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار أو شراء دورة/ملف من الموقع.")}`;
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/m0_qd", icon: Instagram, tone: "bg-pink-500/15 text-pink-400" },
    { name: "Telegram", href: "https://t.me/f_akx", icon: Send, tone: "bg-sky-500/15 text-sky-400" },
    { name: "X / تويتر", href: "https://x.com/magrm", icon: XLogo, tone: "bg-black/20 text-foreground" },
    { name: "GitHub", href: "https://github.com/magrm", icon: Github, tone: "bg-slate-500/15 text-slate-300" },
    { name: "YouTube", href: "https://youtube.com/@magrm", icon: Youtube, tone: "bg-red-500/15 text-red-400" },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
          {s("contactTitle")}
        </h1>
        <p className="mt-4 whitespace-nowrap text-sm leading-6 text-muted-foreground">
          {s("contactIntro")}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* زر الواتساب المباشر */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card/60 hover:border-primary/50 hover:bg-card transition-all group shadow-sm"
          >
            <div className="grid size-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <WhatsAppBusinessIcon />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">{s("contactWhatsappTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {s("contactWhatsappDescription")}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors">
              {s("contactWhatsappButton")}
            </span>
          </a>

          {/* البريد الإلكتروني والدعم */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card/60 shadow-sm">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="size-7" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">{s("contactEmailTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {s("contactEmailDescription")}
            </p>
            <a
              href={`mailto:${s("contactEmail")}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {s("contactEmail")}
            </a>
          </div>
        </div>

        <section className="mt-10" aria-labelledby="social-links-heading">
          <h2 id="social-links-heading" className="text-2xl font-black text-foreground">{s("contactSocialTitle")}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{s("contactSocialDescription")}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {socialLinks.map(({ name, href, icon: Icon, tone }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-56 flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
              >
                <span className={`grid size-16 place-items-center rounded-2xl transition-transform group-hover:scale-110 ${tone}`}>
                  <Icon className="size-8" />
                </span>
                <span className="mt-5">
                  <strong className="block text-lg text-foreground">{name}</strong>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
