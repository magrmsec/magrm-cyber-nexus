import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/ui-bits";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | Magrm Cyber Security" },
      { name: "description", content: "تواصل مع فريق Magrm للاستشارات الأمنية، اختبار الاختراق، أو التدريب المؤسسي." },
      { property: "og:title", content: "تواصل معنا | Magrm" },
      { property: "og:description", content: "أرسل رسالتك لفريق Magrm للأمن السيبراني." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً").max(100, "الاسم طويل جداً"),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255),
  subject: z.string().trim().min(3, "اكتب موضوعاً واضحاً").max(150),
  message: z.string().trim().min(10, "الرسالة قصيرة جداً").max(1000, "الرسالة طويلة جداً"),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const next: Record<string, string> = {};
      for (const issue of res.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("راجع الحقول المطلوبة");
      return;
    }
    setErrors({});
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("تم إرسال رسالتك بنجاح", { description: "سيتواصل معك فريق Magrm قريباً." });
  };

  return (
    <>
      <PageHero
        eyebrow="تواصل"
        title="تواصل معنا"
        description="استشارات أمنية، اختبار اختراق، تدريب مؤسسي، أو استفسار عن الدورات — نحن هنا."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form onSubmit={submit} className="card-surface space-y-5 p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="الاسم" error={errors["name"]}>
                <Input
                  value={form.name}
                  maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اسمك الكامل"
                  className="h-11"
                />
              </Field>
              <Field label="البريد الإلكتروني" error={errors["email"]}>
                <Input
                  value={form.email}
                  maxLength={255}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-11"
                  dir="ltr"
                />
              </Field>
            </div>
            <Field label="الموضوع" error={errors["subject"]}>
              <Input
                value={form.subject}
                maxLength={150}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="موضوع الرسالة"
                className="h-11"
              />
            </Field>
            <Field label="الرسالة" error={errors["message"]}>
              <Textarea
                value={form.message}
                maxLength={1000}
                rows={6}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="اكتب تفاصيل طلبك هنا…"
              />
            </Field>
            <Button type="submit" size="lg" className="glow w-full font-bold sm:w-auto">
              <Send className="size-4" /> إرسال الرسالة
            </Button>
          </form>

          <aside className="space-y-4">
            <InfoCard icon={Mail} title="البريد الإلكتروني" value="contact@magrm.security" href="mailto:contact@magrm.security" />
            <InfoCard icon={MessageSquare} title="الدعم الفني" value="support@magrm.security" href="mailto:support@magrm.security" />
            <InfoCard icon={MapPin} title="العمل" value="عن بُعد — خدمة كل الدول العربية" />
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-bold">{label}</Label>
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
