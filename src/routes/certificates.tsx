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
    id: "isc2-cissp-specialization",
    title: "Certified Information Systems Security Professional (CISSP) Specialization",
    issuer: "ISC2 عبر Coursera",
    focus: "تخصص يغطي مجالات CISSP الثمانية: إدارة المخاطر، الأصول، الهندسة، الشبكات، الهوية، التقييم، العمليات، وتطوير البرمجيات الآمن",
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
    title: "Introduction to Cybersecurity and Storage",
    issuer: "IBM عبر Coursera",
    focus: "الأمن السيبراني والتخزين وحماية البيانات",
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
];

const KEY = "magrm-certificates";

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
              <p className="mt-2 text-sm text-muted-foreground">صور الشهادات كما تم استلامها، مرتبة من الأكثر ارتباطًا بالأمن السيبراني إلى الأقل.</p>
            </div>
            <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">{FEATURED_CERTIFICATES.length} شهادات</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CERTIFICATES.map((certificate) => (
              <article key={certificate.id} className="card-surface animate-rise overflow-hidden">
                <img src={certificate.image} alt={certificate.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" loading="lazy" />
                <div className="space-y-2 p-5">
                  <p className="text-xs font-bold text-primary">{certificate.issuer}</p>
                  <h3 className="font-bold leading-6">{certificate.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{certificate.focus}</p>
                  <p className="pt-1 text-xs text-muted-foreground">صورة مرفوعة من صاحب الحساب</p>
                </div>
              </article>
            ))}
          </div>
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
