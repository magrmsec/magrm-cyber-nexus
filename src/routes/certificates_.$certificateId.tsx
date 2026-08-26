import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const MASTER_ID = "ibm-isc2-cybersecurity-specialist-master";
interface CourseCertificate {
  id: string;
  number: number;
  title: string;
  issuer: string;
  focus: string;
  strength: string;
  image: string;
}

const MASTER_CERTIFICATE = {
  id: MASTER_ID,
  title: "IBM and ISC2 Cybersecurity Specialist",
  issuer: "IBM وISC2 عبر Coursera",
  description: "شهادة مهنية دولية تجمع بين خبرة IBM ومسار ISC2 في برنامج واحد متكامل من 12 دورة. تمنح حاملها أساسًا قويًا للانطلاق في الأمن السيبراني، من فهم الأنظمة والشبكات والسحابة إلى مبادئ الحماية والاستجابة للحوادث والتحكم بالوصول والعمليات الأمنية، وتنتهي بمشروع تطبيقي يربط المعرفة بالواقع.",
  recognition: "تحمل الشهادة اعتماد Professional Certificate من IBM وISC2 عبر Coursera، وتُعد مسارًا مهنيًا دوليًا موثقًا لبناء مهارات الأمن السيبراني على مستوى البداية. يوضح البرنامج أنه يجهّز المتعلم لامتحان ISC2 Certified in Cybersecurity (CC)، مع بقاء امتحان CC وشهادة CISSP اعتمادات منفصلة تتطلب التسجيل والاختبار الخاص بها.",
  image: "/certificates/ibm-isc2-cybersecurity-specialist.jpg",
};

const RELATED_COURSES: CourseCertificate[] = [
  {
    id: "ibm-cybersecurity-careers",
    number: 1,
    title: "Introduction to Cybersecurity Careers",
    issuer: "IBM عبر Coursera",
    focus: "التعرف على أدوار الأمن السيبراني والمهارات المطلوبة لبداية المسار المهني.",
    strength: "أساس مهني للمبتدئين",
    image: "/certificates/ibm-cybersecurity-careers.jpg",
  },
  {
    id: "ibm-hardware-operating-systems",
    number: 2,
    title: "Introduction to Hardware and Operating Systems",
    issuer: "IBM عبر Coursera",
    focus: "فهم العتاد وأنظمة التشغيل التي تقوم عليها البيئات التقنية الآمنة.",
    strength: "أساس تقني مهم",
    image: "/certificates/ibm-hardware-operating-systems.jpg",
  },
  {
    id: "ibm-software-programming-databases",
    number: 3,
    title: "Introduction to Software, Programming, and Databases",
    issuer: "IBM عبر Coursera",
    focus: "البرمجيات والبرمجة وقواعد البيانات كأساس لفهم حماية التطبيقات والبيانات.",
    strength: "أساس تطويري وبياني",
    image: "/certificates/ibm-software-programming-databases.jpg",
  },
  {
    id: "ibm-networking-storage",
    number: 4,
    title: "Introduction to Networking and Storage",
    issuer: "IBM عبر Coursera",
    focus: "الشبكات والتخزين ومفاهيم البنية التحتية وحماية البيانات أثناء التخزين والنقل.",
    strength: "أساس البنية التحتية",
    image: "/certificates/ibm-cybersecurity-storage.jpg",
  },
  {
    id: "ibm-cloud-computing",
    number: 5,
    title: "Introduction to Cloud Computing",
    issuer: "IBM عبر Coursera",
    focus: "مفاهيم الحوسبة السحابية والبيئات التي تحتاج إلى ضوابط وصول وحماية مناسبة.",
    strength: "أساس الأمن السحابي",
    image: "/certificates/ibm-cloud-computing.jpg",
  },
  {
    id: "ibm-cybersecurity-essentials",
    number: 6,
    title: "Introduction to Cybersecurity Essentials",
    issuer: "IBM عبر Coursera",
    focus: "المفاهيم الأساسية للتهديدات والضوابط ومبادئ حماية الأنظمة.",
    strength: "قاعدة الأمن السيبراني",
    image: "/certificates/ibm-cybersecurity-essentials.jpg",
  },
  {
    id: "isc2-security-principles",
    number: 7,
    title: "Security Principles",
    issuer: "ISC2 عبر Coursera",
    focus: "مبادئ الأمن وإدارة المخاطر والضوابط التي تدعم القرارات الأمنية السليمة.",
    strength: "مبادئ حاكمة للأمن",
    image: "/certificates/isc2-security-principles.jpg",
  },
  {
    id: "isc2-incident-response-bc-dr",
    number: 8,
    title: "Incident Response, BC, and DR Concepts",
    issuer: "ISC2 عبر Coursera",
    focus: "الاستجابة للحوادث واستمرارية الأعمال والتعافي من الكوارث.",
    strength: "دفاع واستمرارية الأعمال",
    image: "/certificates/isc2-incident-response-bc-dr.jpg",
  },
  {
    id: "isc2-access-control-concepts",
    number: 9,
    title: "Access Control Concepts",
    issuer: "ISC2 عبر Coursera",
    focus: "التحكم بالوصول وإدارة الصلاحيات والهوية وتقليل الامتيازات.",
    strength: "حماية الهوية والصلاحيات",
    image: "/certificates/isc2-access-control-concepts.jpg",
  },
  {
    id: "isc2-network-security",
    number: 10,
    title: "Network Security",
    issuer: "ISC2 عبر Coursera",
    focus: "أمن الشبكات والاتصالات وتقليل مخاطر الخدمات والاتصالات المكشوفة.",
    strength: "تخصص أمني عملي",
    image: "/certificates/isc2-network-security.jpg",
  },
  {
    id: "isc2-security-operations",
    number: 11,
    title: "Security Operations",
    issuer: "ISC2 عبر Coursera",
    focus: "العمليات الأمنية والمراقبة والاستجابة ضمن بيئة تشغيلية دفاعية.",
    strength: "عمليات ومراقبة أمنية",
    image: "/certificates/isc2-security-operations.jpg",
  },
  {
    id: "ibm-cybersecurity-capstone",
    number: 12,
    title: "Cybersecurity Case Studies and Capstone Project",
    issuer: "IBM عبر Coursera",
    focus: "دراسات حالة ومشروع تخرج يطبق مفاهيم المسار على حادثة أمن سيبراني.",
    strength: "تطبيق ختامي للمسار",
    image: "/certificates/ibm-cybersecurity-capstone.jpg",
  },
];

export const Route = createFileRoute("/certificates_/$certificateId")({
  loader: ({ params }) => {
    if (params.certificateId !== MASTER_ID) throw notFound();
    return { certificate: MASTER_CERTIFICATE, courses: RELATED_COURSES };
  },
  head: () => ({
    meta: [
      { title: "IBM and ISC2 Cybersecurity Specialist | Magrm" },
      { name: "description", content: MASTER_CERTIFICATE.description },
      { property: "og:title", content: MASTER_CERTIFICATE.title },
      { property: "og:description", content: MASTER_CERTIFICATE.description },
    ],
  }),
  component: CertificateDetailPage,
});

function CertificateDetailPage() {
  const { certificate, courses } = Route.useLoaderData();

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> العودة إلى الشهادات
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">الشهادة الرئيسية</p>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-5xl">
                <span className="text-gradient">{certificate.title}</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{certificate.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">IBM + ISC2</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">12 دورة</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">Professional Certificate</span>
              </div>
            </div>
            <div className="card-surface overflow-hidden p-3 ring-1 ring-primary/45">
              <img src={certificate.image} alt={certificate.title} className="w-full rounded-lg object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="card-surface p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary" />
            <h2 className="text-2xl font-black">قوة الشهادة واعتمادها</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted-foreground">{certificate.recognition}</p>
        </section>

        <section className="mt-12" aria-labelledby="related-courses-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">المحتوى التابع</p>
              <h2 id="related-courses-heading" className="mt-2 text-2xl font-black">الدورات الـ12 التابعة للشهادة</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">هذه الصور تمثل الدورات المكوّنة للمسار نفسه، وليست شهادات مهنية مستقلة عن الشهادة الرئيسية.</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">12 دورة</span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article key={course.id} className="card-surface animate-rise overflow-hidden">
                <img src={course.image} alt={course.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" loading="lazy" />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">الدورة {course.number}</span>
                    <span className="text-xs font-bold text-muted-foreground">{course.strength}</span>
                  </div>
                  <p className="text-xs font-bold text-primary">{course.issuer}</p>
                  <h3 className="font-bold leading-6">{course.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{course.focus}</p>
                  <p className="border-t border-border pt-3 text-xs leading-6 text-muted-foreground">اعتمادها: شهادة دورة ضمن المسار المهني IBM وISC2، وليست اعتمادًا مستقلًا منفصلًا.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/certificates">
              <ArrowRight className="size-4" /> العودة إلى قسم الشهادات
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
