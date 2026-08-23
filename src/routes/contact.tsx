import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Send, ShieldCheck, Headphones } from "lucide-react";
import { useSiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { settings: s } = useSiteSettings();
  const whatsappNumber = "967733570889";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار أو شراء دورة/ملف من الموقع.")}`;

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
      </div>
    </div>
  );
}
          </form>

          <aside className="space-y-4">
            <InfoCard
              icon={Mail}
              title="البريد الإلكتروني"
              value={sv(cfg, "contactEmail")}
              href={`mailto:${sv(cfg, "contactEmail")}`}
            />
            <InfoCard
              icon={MessageSquare}
              title="الدعم الفني"
              value={sv(cfg, "supportEmail")}
              href={`mailto:${sv(cfg, "supportEmail")}`}
            />
            <InfoCard icon={MapPin} title="العمل" value={sv(cfg, "contactLocation")} />
            {sv(cfg, "paymentInstructions") || sv(cfg, "paymentAccount") ? (
              <div className="card-surface p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <CreditCard className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold">{sv(cfg, "paymentTitle")}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{sv(cfg, "paymentInstructions")}</p>
                {sv(cfg, "paymentAccount") ? (
                  <p className="mt-3 break-all font-mono text-sm text-primary" dir="ltr">
                    {sv(cfg, "paymentAccount")}
                  </p>
                ) : null}
                {sv(cfg, "paymentWallet") ? (
                  <p className="mt-1 break-all font-mono text-sm text-primary" dir="ltr">
                    {sv(cfg, "paymentWallet")}
                  </p>
                ) : null}
                {sv(cfg, "paymentNote") ? (
                  <p className="mt-3 text-xs text-muted-foreground">{sv(cfg, "paymentNote")}</p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-2 block text-sm font-bold">
        {label}
      </Label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-bold text-destructive">{error}</p> : null}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  href?: string | undefined;
}) {
  const body = (
    <div className="card-surface p-6">
      <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-sm font-bold">{title}</h3>
      <p className="mt-1 break-all text-sm text-muted-foreground">{value}</p>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {body}
    </a>
  ) : (
    body
  );
}
