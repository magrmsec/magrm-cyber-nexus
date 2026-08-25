import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { getToolDetails } from "@/lib/tool-details";
import { useCmsTools } from "@/lib/cms";
import { useSiteSettings } from "@/lib/settings";
import { EmptyState } from "@/components/ui-bits";

export const Route = createFileRoute("/tools_/$toolId")({
  head: () => ({
    meta: [
      { title: "تفاصيل الأداة | Magrm Cyber Security" },
      { name: "description", content: "شرح تفصيلي لأداة أمن سيبراني مع السعر والتواصل عبر واتساب." },
    ],
  }),
  component: ToolDetail,
});

function ToolDetail() {
  const { toolId } = Route.useParams();
  const { items: tools, isLoading } = useCmsTools();
  const { settings: s } = useSiteSettings();
  const tool = tools.find((item) => String(item.id) === toolId);

  if (isLoading) return <EmptyState text="جاري تحميل تفاصيل الأداة…" />;
  if (!tool) throw notFound();

  const details = getToolDetails(tool);
  const price = tool.price ?? 100;
  const message = `السلام عليكم، أريد شراء/الاشتراك في الأداة التالية:\nالاسم: ${tool.name}\nالتصنيف: ${tool.category}\nالتفاصيل: ${tool.description}\nالسعر: $${price}`;
  const whatsappUrl = `${s("whatsapp")}?text=${encodeURIComponent(message)}`;

  return (
    <section className="hero-bg border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <Link to="/tools" className="text-sm font-bold text-primary">
          ← العودة إلى الأدوات
        </Link>

        <div className="mt-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{tool.category}</span>
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-bold text-muted-foreground">
              أداة احترافية
            </span>
          </div>

          <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-4xl">
            <span className="text-gradient">{tool.name}</span>
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">{details.overview}</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <ShieldCheck className="size-5 text-primary" /> ماذا تقدم الأداة؟
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {details.capabilities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <MessageCircle className="size-5 text-primary" /> الاستخدامات الأمنية
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {details.useCases.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-surface mt-5 p-6">
            <h2 className="flex items-center gap-2 font-bold">ما الذي يشمله الطلب؟</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground md:grid-cols-3">
              {details.deliverables.map((item) => (
                <li key={item} className="rounded-xl border border-border bg-surface-2 px-4 py-3">{item}</li>
              ))}
            </ul>
          </div>

          <div className="card-surface mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">سعر الأداة</p>
              <div className="mt-1 text-3xl font-black text-primary">${price}</div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">للتفاصيل والتسليم والاتفاق النهائي، تواصل معنا مباشرة عبر واتساب.</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700"
            >
              <MessageCircle className="size-6" />
              اشترك الآن عبر الواتساب
            </a>
          </div>

          {tool.url && tool.url !== "#" ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <ExternalLink className="size-4" /> الصفحة الرسمية للأداة
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
