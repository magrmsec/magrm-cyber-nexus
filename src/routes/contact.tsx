import { createFileRoute } from "@tanstack/react-router";
import { Github, Instagram, Mail, MessageCircle, Send, Youtube } from "lucide-react";
import { useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { settings: s } = useSiteSettings();
  const whatsappNumber = "967733570889";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار أو شراء دورة/ملف من الموقع.")}`;
  const socialLinks = [
    { name: "X / تويتر", href: "https://x.com/magrm", icon: Send, description: "تابع آخر الأخبار والتحديثات" },
    { name: "GitHub", href: "https://github.com/magrm", icon: Github, description: "المشاريع والمصادر التقنية" },
    { name: "YouTube", href: "https://youtube.com/@magrm", icon: Youtube, description: "المحتوى المرئي والشروحات" },
    { name: "Telegram", href: "https://t.me/f_akx", icon: Send, description: "تحديثات المجتمع والتنبيهات" },
    { name: "Instagram", href: "https://instagram.com/m0_qd", icon: Instagram, description: "الصور والمنشورات الجديدة" },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
          تواصل معنا مباشرة
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-7">
          نحن هنا لمساعدتك في أي استفسار، أو لإتمام عمليات الشراء والدفع بكل سهولة عبر الواتساب.
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
              <MessageCircle className="size-7" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">التواصل عبر الواتساب</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              اضغط هنا للمراسلة الفورية وشراء الدورات والملفات مباشرة
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors">
              مراسلة عبر الواتساب
            </span>
          </a>

          {/* البريد الإلكتروني والدعم */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card/60 shadow-sm">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="size-7" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">البريد الإلكتروني</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              للاستفسارات الرسمية والدعم الفني عبر البريد
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
          <h2 id="social-links-heading" className="text-2xl font-black text-foreground">جميع حساباتنا على منصات التواصل</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">تواصل معنا عبر المنصة التي تناسبك، وسنرد عليك من خلال الحساب الرسمي.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map(({ name, href, icon: Icon, description }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 text-start shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Icon className="size-6" />
                </span>
                <span>
                  <strong className="block text-base text-foreground">{name}</strong>
                  <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
