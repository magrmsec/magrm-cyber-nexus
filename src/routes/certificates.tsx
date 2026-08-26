import { createFileRoute } from "@tanstack/react-router";
import { Award, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "الشهادات المهنية | Magrm Cyber Security" },
      { name: "description", content: "شهادات Magrm المهنية والاعتمادات في مجال الأمن السيبراني." },
      { property: "og:title", content: "الشهادات المهنية | Magrm" },
      { property: "og:description", content: "معرض شهادات Magrm المهنية في الأمن السيبراني." },
    ],
  }),
  component: CertificatesPage,
});

interface Cert {
  id: string;
  title: string;
  image: string;
}

interface FeaturedCertificate {
  id: string;
  title: string;
  issuer: string;
  focus: string;
  image: string;
}

const FEATURED_CERTIFICATES: FeaturedCertificate[] = [
  {
    id: "ibm-isc2-cybersecurity-specialist-master",
    title: "IBM and ISC2 Cybersecurity Specialist",
    issuer: "IBM وISC2 عبر Coursera",
    focus: "الشهادة النهائية لمسار مهني واحد مكوّن من 12 دورة في الأمن السيبراني، وليست شهادة CISSP الرسمية نفسها",
    image: "/certificates/isc2-cissp-specialization.jpg",
  },
  {
    id: "isc2-security-operations",
    title: "Security Operations",
    issuer: "ISC2 عبر Coursera",
    focus: "عمليات الأمن والمراقبة والاستجابة ضمن مسار CISSP",
    image: "/certificates/isc2-security-operations.jpg",
  },
  {
    id: "isc2-network-security",
    title: "Network Security",
    issuer: "ISC2 عبر Coursera",
    focus: "أمن الشبكات والاتصالات ضمن مسار CISSP",
    image: "/certificates/isc2-network-security.jpg",
  },
  {
    id: "isc2-incident-response-bc-dr",
    title: "Incident Response, BC, and DR Concepts",
    issuer: "ISC2 عبر Coursera",
    focus: "الاستجابة للحوادث واستمرارية الأعمال والتعافي من الكوارث",
    image: "/certificates/isc2-incident-response-bc-dr.jpg",
  },
  {
    id: "isc2-cissp-domain-7-security-operations",
    title: "CISSP Domain 7: Security Operations",
    issuer: "ISC2 عبر Coursera",
    focus: "العمليات الأمنية، المراقبة، الاستجابة للحوادث، والتعافي التشغيلي",
    image: "/certificates/isc2-cissp-security-operations.jpg",
  },
  {
    id: "isc2-access-control-concepts",
    title: "Access Control Concepts",
    issuer: "ISC2 عبر Coursera",
    focus: "التحكم بالوصول وإدارة الصلاحيات والهوية",
    image: "/certificates/isc2-access-control-concepts.jpg",
  },
  {
    id: "isc2-cissp-domain-4-network-security",
    title: "CISSP Domain 4: Communication and Network Security",
    issuer: "ISC2 عبر Coursera",
    focus: "الاتصالات وأمن الشبكات",
    image: "/certificates/isc2-cissp-network-security.jpg",
  },
  {
    id: "isc2-cissp-domain-8-software-security",
    title: "CISSP Domain 8: Software Development Security",
    issuer: "ISC2 عبر Coursera",
    focus: "أمن تطوير البرمجيات ودورة حياة التطوير الآمن",
    image: "/certificates/isc2-cissp-software-development-security.jpg",
  },
  {
    id: "isc2-security-principles",
    title: "Security Principles",
    issuer: "ISC2 عبر Coursera",
    focus: "مبادئ الأمن وإدارة المخاطر والضوابط الأساسية",
    image: "/certificates/isc2-security-principles.jpg",
  },
  {
    id: "isc2-cissp-domain-3-security-architecture",
    title: "CISSP Domain 3: Security Architecture",
    issuer: "ISC2 عبر Coursera",
    focus: "هندسة الأمن والتصميم الآمن للأنظمة",
    image: "/certificates/isc2-cissp-security-architecture.jpg",
  },
  {
    id: "isc2-cissp-domain-6-security-assessment",
    title: "CISSP Domain 6: Security Assessment and Testing",
    issuer: "ISC2 عبر Coursera",
    focus: "تقييم الأمن والاختبارات الأمنية وقياس فعالية الضوابط",
    image: "/certificates/isc2-cissp-security-assessment-testing.jpg",
  },
  {
    id: "cde-cybersecurity-professional",
    title: "Cybersecurity Professional — Certificate of Achievement",
    issuer: "Cyber Defense Excellence (CDE)",
    focus: "اختبار الاختراق، أمن الشبكات، أمن الويب، SIEM، والاستجابة للحوادث",
    image: "/certificates/cde-cybersecurity-professional.jpg",
  },
  {
    id: "ibm-isc2-cybersecurity-specialist",
    title: "IBM and ISC2 Cybersecurity Specialist",
    issuer: "IBM وISC2 عبر Coursera",
    focus: "تخصص شامل في الأمن السيبراني يضم مسارات IBM وISC2 العملية",
    image: "/certificates/ibm-isc2-cybersecurity-specialist.jpg",
  },
  {
    id: "ibm-cybersecurity-essentials",
    title: "Introduction to Cybersecurity Essentials",
    issuer: "IBM عبر Coursera",
    focus: "أساسيات الأمن السيبراني والمفاهيم العملية",
    image: "/certificates/ibm-cybersecurity-essentials.jpg",
  },
  {
    id: "ibm-cybersecurity-careers",
    title: "Introduction to Cybersecurity Careers",
    issuer: "IBM عبر Coursera",
    focus: "المسارات المهنية والمهارات الأساسية في الأمن السيبراني",
    image: "/certificates/ibm-cybersecurity-careers.jpg",
  },
  {
    id: "ibm-cybersecurity-storage",
    title: "Introduction to Networking and Storage",
    issuer: "IBM عبر Coursera",
    focus: "الشبكات والتخزين ومفاهيم البنية التحتية",
    image: "/certificates/ibm-cybersecurity-storage.jpg",
  },
  {
    id: "google-ai-app-building",
    title: "AI for App Building",
    issuer: "Google عبر Coursera",
    focus: "بناء التطبيقات باستخدام أدوات الذكاء الاصطناعي",
    image: "/certificates/google-ai-app-building.jpg",
  },
  {
    id: "hackviser-core-cybersecurity",
    title: "CORE — Certified Cybersecurity Foundations",
    issuer: "Hackviser",
    focus: "أساسيات الأمن السيبراني والتدريبات العملية",
    image: "/certificates/hackviser-core-cybersecurity.jpg",
  },
  {
    id: "google-network-security",
    title: "Connect and Protect: Networks and Network Security",
    issuer: "Google عبر Coursera",
    focus: "الشبكات وأمن الشبكات",
    image: "/certificates/google-network-security.jpg",
  },
  {
    id: "google-cybersecurity-jobs",
    title: "Put It to Work: Prepare for Cybersecurity Jobs",
    issuer: "Google عبر Coursera",
    focus: "الاستعداد للعمل في الأمن السيبراني",
    image: "/certificates/google-cybersecurity-jobs.jpg",
  },
  {
    id: "ibm-cybersecurity-capstone",
    title: "Cybersecurity Case Studies and Capstone Project",
    issuer: "IBM عبر Coursera",
    focus: "دراسات الحالة ومشروع التخرج في الأمن السيبراني",
    image: "/certificates/ibm-cybersecurity-capstone.jpg",
  },
  {
    id: "ibm-cloud-computing",
    title: "Introduction to Cloud Computing",
    issuer: "IBM عبر Coursera",
    focus: "مقدمة في الحوسبة السحابية",
    image: "/certificates/ibm-cloud-computing.jpg",
  },
  {
    id: "ibm-software-programming-databases",
    title: "Introduction to Software, Programming, and Databases",
    issuer: "IBM عبر Coursera",
    focus: "البرمجيات والبرمجة وقواعد البيانات",
    image: "/certificates/ibm-software-programming-databases.jpg",
  },
  {
    id: "ibm-hardware-operating-systems",
    title: "Introduction to Hardware and Operating Systems",
    issuer: "IBM عبر Coursera",
    focus: "العتاد وأنظمة التشغيل",
    image: "/certificates/ibm-hardware-operating-systems.jpg",
  },
  {
    id: "google-ai-professional",
    title: "Google AI Professional Certificate",
    issuer: "Google عبر Coursera",
    focus: "مسار احترافي من 7 دورات في الذكاء الاصطناعي وتطبيقاته العملية",
    image: "/certificates/google-ai-professional.jpg",
  },
  {
    id: "google-ai-fundamentals",
    title: "AI Fundamentals",
    issuer: "Google عبر Coursera",
    focus: "أساسيات الذكاء الاصطناعي",
    image: "/certificates/google-ai-fundamentals.jpg",
  },
  {
    id: "google-ai-content-creation",
    title: "AI for Content Creation",
    issuer: "Google عبر Coursera",
    focus: "استخدام الذكاء الاصطناعي في إنشاء المحتوى",
    image: "/certificates/google-ai-content-creation.jpg",
  },
  {
    id: "google-ai-research-insights",
    title: "AI for Research and Insights",
    issuer: "Google عبر Coursera",
    focus: "البحث واستخلاص الرؤى باستخدام الذكاء الاصطناعي",
    image: "/certificates/google-ai-research-insights.jpg",
  },
  {
    id: "google-ai-communication",
    title: "AI for Writing and Communicating",
    issuer: "Google عبر Coursera",
    focus: "الذكاء الاصطناعي والكتابة والتواصل المهني",
    image: "/certificates/google-ai-communication.jpg",
  },
  {
    id: "hackviser-csoa",
    title: "Certified Security Operations Analyst (CSOA)",
    issuer: "Hackviser",
    focus: "عمليات الأمن، اكتشاف التهديدات، والتحقيق الجنائي الرقمي عبر اختبار عملي",
    image: "/certificates/hackviser-csoa.jpg",
  },
  {
    id: "hackviser-capt",
    title: "Certified Associate Penetration Tester (CAPT)",
    issuer: "Hackviser",
    focus: "منهجيات وأدوات وتقنيات اختبار الاختراق عبر تقييم عملي",
    image: "/certificates/hackviser-capt.jpg",
  },
  {
    id: "hackviser-cwse",
    title: "Certified Web Security Expert (CWSE)",
    issuer: "Hackviser",
    focus: "أمن الويب وتقييم الثغرات والمنهجيات المتقدمة عبر اختبار عملي",
    image: "/certificates/hackviser-cwse.jpg",
  },
  {
    id: "cde-cybersecurity-achievement",
    title: "Cybersecurity Professional — Certificate of Achievement",
    issuer: "Cyber Defense Excellence (CDE)",
    focus: "اختبار الاختراق وأمن الشبكات وتطبيقات الويب والاستجابة للحوادث",
    image: "/certificates/cde-cybersecurity-achievement.jpg",
  },
  {
    id: "one-million-prompters",
    title: "1 Million Prompters — Certificate of Completion",
    issuer: "Dubai Future Foundation / Dubai Centre for Artificial Intelligence",
    focus: "هندسة الأوامر والذكاء الاصطناعي",
    image: "/certificates/one-million-prompters.jpg",
  },
  {
    id: "cisco-introduction-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    focus: "مقدمة في الأمن السيبراني والتهديدات وحماية الأنظمة",
    image: "/certificates/cisco-introduction-cybersecurity.jpg",
  },
  {
    id: "opswat-icip",
    title: "Introduction to Critical Infrastructure Protection (ICIP)",
    issuer: "OPSWAT Academy",
    focus: "حماية البنية التحتية الحيوية",
    image: "/certificates/opswat-icip.jpg",
  },
  {
    id: "hackviser-csoa",
    title: "Certified Security Operations Analyst (CSOA)",
    issuer: "Hackviser",
    focus: "عمليات الأمن، اكتشاف التهديدات، والتحقيق الجنائي الرقمي عبر اختبار عملي",
    image: "/certificates/hackviser-csoa.jpg",
  },
  {
    id: "hackviser-capt",
    title: "Certified Associate Penetration Tester (CAPT)",
    issuer: "Hackviser",
    focus: "منهجيات وأدوات وتقنيات اختبار الاختراق عبر تقييم عملي",
    image: "/certificates/hackviser-capt.jpg",
  },
  {
    id: "hackviser-cwse",
    title: "Certified Web Security Expert (CWSE)",
    issuer: "Hackviser",
    focus: "أمن الويب وتقييم الثغرات والمنهجيات المتقدمة عبر اختبار عملي",
    image: "/certificates/hackviser-cwse.jpg",
  },
  {
    id: "cde-cybersecurity-achievement",
    title: "Cybersecurity Professional — Certificate of Achievement",
    issuer: "Cyber Defense Excellence (CDE)",
    focus: "اختبار الاختراق وأمن الشبكات وتطبيقات الويب والاستجابة للحوادث",
    image: "/certificates/cde-cybersecurity-achievement.jpg",
  },
  {
    id: "one-million-prompters",
    title: "1 Million Prompters — Certificate of Completion",
    issuer: "Dubai Future Foundation / Dubai Centre for Artificial Intelligence",
    focus: "هندسة الأوامر والذكاء الاصطناعي",
    image: "/certificates/one-million-prompters.jpg",
  },
  {
    id: "cisco-introduction-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    focus: "مقدمة في الأمن السيبراني والتهديدات وحماية الأنظمة",
    image: "/certificates/cisco-introduction-cybersecurity.jpg",
  },
];

interface CertificateGroup {
  id: string;
  title: string;
  description: string;
  memberIds: string[];
}

const CERTIFICATE_GROUPS: CertificateGroup[] = [
  {
    id: "ibm-isc2-specialist-track",
    title: "IBM and ISC2 Cybersecurity Specialist",
    description: "المسار الرئيسي: شهادة مهنية نهائية واحدة مكوّنة من 12 دورة، مع صور الدورات التابعة لها داخل المجموعة نفسها.",
    memberIds: [
      "ibm-isc2-cybersecurity-specialist-master",
      "ibm-cybersecurity-essentials",
      "ibm-hardware-operating-systems",
      "ibm-software-programming-databases",
      "ibm-cybersecurity-storage",
      "ibm-cloud-computing",
      "isc2-security-principles",
      "isc2-incident-response-bc-dr",
      "isc2-access-control-concepts",
      "isc2-network-security",
      "isc2-security-operations",
      "ibm-cybersecurity-capstone",
    ],
  },
  {
    id: "hackviser-professional-track",
    title: "Hackviser — شهادات الاختبار العملي",
    description: "مجموعة شهادات عملية متخصصة في اختبار الاختراق وأمن الويب وعمليات الأمن.",
    memberIds: ["hackviser-csoa", "hackviser-cwse", "hackviser-capt", "hackviser-core-cybersecurity"],
  },
  {
    id: "cde-cybersecurity-track",
    title: "Cyber Defense Excellence",
    description: "شهادة إنجاز مهنية في مجالات الأمن السيبراني واختبار الاختراق والدفاع والاستجابة للحوادث.",
    memberIds: ["cde-cybersecurity-professional", "cde-cybersecurity-achievement"],
  },
  {
    id: "isc2-domain-track",
    title: "ISC2 / InfoSec — CISSP Domain Courses",
    description: "دورات فرعية متقدمة مرتبطة بمجالات CISSP، معروضة كمجموعة تعليمية واحدة منفصلة عن الشهادة النهائية IBM وISC2.",
    memberIds: [
      "isc2-cissp-domain-3-security-architecture",
      "isc2-cissp-domain-4-network-security",
      "isc2-cissp-domain-6-security-assessment",
      "isc2-cissp-domain-7-security-operations",
      "isc2-cissp-domain-8-software-security",
    ],
  },
  {
    id: "opswat-track",
    title: "OPSWAT Academy",
    description: "مسار متخصص في حماية البنية التحتية الحيوية.",
    memberIds: ["opswat-icip"],
  },
  {
    id: "cisco-cybersecurity-track",
    title: "Cisco Networking Academy",
    description: "شهادة تأسيسية في مقدمة الأمن السيبراني والتهديدات وحماية الأنظمة.",
    memberIds: ["cisco-introduction-cybersecurity"],
  },
  {
    id: "google-cybersecurity-track",
    title: "Google Cybersecurity",
    description: "شهادات ومسارات Google المرتبطة بالشبكات والاستعداد المهني في الأمن السيبراني.",
    memberIds: ["google-network-security", "google-cybersecurity-jobs"],
  },
  {
    id: "google-ai-track",
    title: "Google AI عبر Coursera",
    description: "مسارات الذكاء الاصطناعي والتطبيقات المهنية، مرتبة بعد المسارات الأمنية المتخصصة.",
    memberIds: [
      "google-ai-professional",
      "google-ai-fundamentals",
      "google-ai-content-creation",
      "google-ai-research-insights",
      "google-ai-communication",
      "google-ai-app-building",
    ],
  },
  {
    id: "ibm-general-track",
    title: "IBM — مسارات تقنية عامة",
    description: "شهادات IBM التمهيدية المرتبطة بالعتاد والبرمجيات والحوسبة، خارج مسار IBM وISC2 الرئيسي.",
    memberIds: ["ibm-cybersecurity-careers"],
  },
  {
    id: "dubai-ai-track",
    title: "1 Million Prompters",
    description: "شهادة إتمام في هندسة الأوامر والذكاء الاصطناعي.",
    memberIds: ["one-million-prompters"],
  },
];

const certificateById = new Map(FEATURED_CERTIFICATES.map((certificate) => [certificate.id, certificate]));
const DISPLAYED_CERTIFICATE_COUNT = new Set(CERTIFICATE_GROUPS.flatMap((group) => group.memberIds)).size;

const KEY = "magrm-certificates";

function CertificateCard({ certificate, featured = false }: { certificate: FeaturedCertificate; featured?: boolean }) {
  return (
    <article className={`card-surface animate-rise overflow-hidden ${featured ? "ring-1 ring-primary/45" : ""}`}>
      <img src={certificate.image} alt={certificate.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" loading="lazy" />
      <div className="space-y-2 p-5">
        <p className="text-xs font-bold text-primary">{certificate.issuer}</p>
        <h4 className="font-bold leading-6">{certificate.title}</h4>
        <p className="text-sm leading-6 text-muted-foreground">{certificate.focus}</p>
        <p className="pt-1 text-xs text-muted-foreground">صورة مرفوعة من صاحب الحساب</p>
      </div>
    </article>
  );
}

function CertificatesPage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
      supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCerts(JSON.parse(raw) as Cert[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Cert[]) => {
    setCerts(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = () => {
    if (!signedIn) { toast.error("سجّل الدخول أولاً"); return; }
    if (!title.trim()) {
      toast.error("اكتب عنوان الشهادة أولاً");
      return;
    }
    persist([...certs, { id: String(Date.now()), title: title.trim(), image: image.trim() }]);
    setTitle("");
    setImage("");
    toast.success("تمت إضافة الشهادة");
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <PageHero
        eyebrow="Magrm"
        title="الشهادات المهنية"
        description="هذه المساحة مخصصة لعرض شهادات Magrm المهنية. أضف صورة الشهادة وعنوانها ليظهرا هنا مباشرة."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <section aria-labelledby="uploaded-certificates-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">ملف Mohammed Qaed Mohammed Ali Al-Azzani</p>
              <h2 id="uploaded-certificates-heading" className="mt-2 text-2xl font-black">الشهادات المرفوعة</h2>
              <p className="mt-2 text-sm text-muted-foreground">مجموعات مرتبة من أقوى مسار مهني إلى الشهادات الأصغر، مع إبقاء الشهادة الرئيسية ودوراتها التابعة في مكان واحد.</p>
            </div>
            <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">{DISPLAYED_CERTIFICATE_COUNT} صور</span>
          </div>

          {CERTIFICATE_GROUPS.map((group) => {
            const certificates = group.memberIds
              .map((id) => certificateById.get(id))
              .filter((certificate): certificate is FeaturedCertificate => Boolean(certificate));
            if (certificates.length === 0) return null;
            return (
              <section key={group.id} aria-labelledby={`${group.id}-heading`} className="mt-10 border-t border-border/70 pt-8 first:mt-0 first:border-t-0 first:pt-0">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">المجموعة {CERTIFICATE_GROUPS.indexOf(group) + 1}</p>
                    <h3 id={`${group.id}-heading`} className="mt-2 text-xl font-black">{group.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{group.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground">{certificates.length} عناصر</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((certificate, index) => (
                    <CertificateCard key={certificate.id} certificate={certificate} featured={index === 0} />
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        {signedIn && (<div className="card-surface p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <ImagePlus className="size-4 text-primary" /> إضافة شهادة جديدة
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Input
              id="cert-title"
              aria-label="عنوان الشهادة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الشهادة… مثال: OSCP - Offensive Security"
              maxLength={120}
              className="h-11"
            />
            <Input
              id="cert-file"
              aria-label="صورة الشهادة"
              type="file"
              accept="image/*"
              className="h-11 cursor-pointer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            <Button onClick={add} className="h-11 font-bold">
              <Plus className="size-4" /> إضافة
            </Button>
          </div>
          {image ? (
            <img src={image} alt="معاينة الشهادة" className="mt-4 h-40 rounded-xl border border-border object-contain" />
          ) : null}
        </div>)} 

        {certs.length === 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-border bg-surface/40 text-center text-sm text-muted-foreground"
              >
                <div>
                  <Award className="mx-auto size-8 text-primary/60" />
                  <p className="mt-3">مكان مخصص لشهادة</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <div key={c.id} className="card-surface animate-rise overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-surface-2">
                    <Award className="size-10 text-primary/60" />
                  </div>
                )}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
                  <h3 className="min-w-0 truncate font-bold">{c.title}</h3>
                  <button
                    aria-label="حذف"
                    onClick={() => persist(certs.filter((x) => x.id !== c.id))}
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
