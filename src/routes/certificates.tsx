import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { sv, useSiteSettings } from "@/lib/settings";
import { FEATURED_CERTIFICATES, type LegacyCertificate } from "@/lib/certificate-catalog";
import { useCmsRows } from "@/lib/cms";

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

type FeaturedCertificate = LegacyCertificate;


const certificateById = new Map(FEATURED_CERTIFICATES.map((certificate) => [certificate.id, certificate]));
const MASTER_CERTIFICATE_ID = "ibm-isc2-cybersecurity-specialist-master";
const HACKVISER_MASTER_ID = "hackviser-certifications-master";
const INFOSEC_MASTER_ID = "infosec-cissp-specialization";
const INFOSEC_MAIN_CERTIFICATE_IDS = [INFOSEC_MASTER_ID] as const;
const MAIN_CERTIFICATE_IDS = [
  MASTER_CERTIFICATE_ID,
  "cde-cybersecurity-professional-2025",
  "cde-cybersecurity-professional",
  "opswat-icip",
  "cisco-introduction-cybersecurity",
  "google-network-security",
  "google-cybersecurity-jobs",
  "google-ai-professional",
  "one-million-prompters",
] as const;
const KEY = "magrm-certificates";

function CertificateCard({ certificate, featured = false }: { certificate: FeaturedCertificate; featured?: boolean }) {
  return (
    <article className={`card-surface animate-rise overflow-hidden ${featured ? "ring-1 ring-primary/45" : ""}`}>
      <img src={certificate.image} alt={certificate.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" loading="lazy" />
      <div className="space-y-2 p-5">
        <p className="text-xs font-bold text-primary">{certificate.issuer}</p>
        <h4 className="font-bold leading-6">{certificate.title}</h4>
        <p className="text-sm leading-6 text-muted-foreground">{certificate.focus}</p>
      </div>
    </article>
  );
}

function CertificatesPage() {
  const { s } = useSiteSettings();
  const { data: cmsCertificateRows = [] } = useCmsRows("certificate");
  const editableCertificateById = useMemo(() => {
    const map = new Map(certificateById);
    for (const row of cmsCertificateRows) {
      const data = row.data as Record<string, unknown>;
      const legacyId = String(data.legacyId ?? "");
      const original = map.get(legacyId);
      if (!original) continue;
      map.set(legacyId, {
        ...original,
        title: String(data.title ?? original.title),
        issuer: String(data.issuer ?? original.issuer),
        focus: String(data.focus ?? original.focus),
        image: String(data.image ?? original.image),
      });
    }
    return map;
  }, [cmsCertificateRows]);
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
        title={sv(s, "certificatesPageTitle") || "الشهادات المهنية"}
        description={sv(s, "certificatesPageDescription") || "هذه المساحة مخصصة لعرض شهادات Magrm المهنية. أضف صورة الشهادة وعنوانها ليظهرا هنا مباشرة."}
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <section aria-labelledby="uploaded-certificates-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{sv(s, "certificatesMainSectionEyebrow") || "الشهادات المهنية الرئيسية"}</p>
              <h2 id="uploaded-certificates-heading" className="mt-2 text-2xl font-black">{sv(s, "certificatesMainSectionTitle") || "أقوى الشهادات المهنية"}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{sv(s, "certificatesMainSectionDescription") || "اختر الشهادة لفتح واجهة تفاصيل مستقلة تحتوي الصورة الأصلية والوصف المهني وقوة الاعتماد والمحتوى التابع لها."}</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">{MAIN_CERTIFICATE_IDS.length} {sv(s, "certificatesMainCountLabel") || "شهادات"}</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {MAIN_CERTIFICATE_IDS.map((certificateId) => {
              const certificate = editableCertificateById.get(certificateId);
              if (!certificate) return null;
                              const isMaster = certificateId === MASTER_CERTIFICATE_ID;
                const isHackviserMaster = certificateId === HACKVISER_MASTER_ID;
                const displayCertificate = isMaster
                  ? { ...certificate, title: sv(s, "certificateMasterTitle") || certificate.title, focus: sv(s, "certificateMasterDescription") || certificate.focus }
                  : isHackviserMaster
                    ? { ...certificate, title: "Hackviser — مجموعة الشهادات المهنية العملية", focus: "مجموعة مستقلة تضم شهادات Hackviser في عمليات الأمن، اختبار الاختراق، وأمن تطبيقات الويب، مع صفحة تفاصيل تعرض كل شهادة وصورتها ووصفها." }
                    : certificate;

              return (
                <Link key={certificateId} to="/certificates/$certificateId" params={{ certificateId }} className="block transition-transform hover:-translate-y-1">
                  <CertificateCard certificate={displayCertificate} featured />
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm font-bold text-primary">
                    <span>{isMaster ? "فتح الشهادة والدورات الـ12 التابعة" : sv(s, "certificatesOpenDetailsLabel") || "فتح تفاصيل الشهادة وقوتها واعتمادها"}</span>
                    <span aria-hidden="true">←</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="hackviser-section-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{sv(s, "hackviserSectionEyebrow") || "قسم Hackviser المستقل"}</p>
              <h2 id="hackviser-section-heading" className="mt-2 text-2xl font-black">{sv(s, "hackviserSectionTitle") || "Hackviser — مجموعة الشهادات المهنية العملية"}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{sv(s, "hackviserSectionDescription") || "مجموعة مستقلة تضم شهادات Hackviser في عمليات الأمن، اختبار الاختراق، وأمن تطبيقات الويب، مع صفحة تفاصيل تعرض كل شهادة وصورتها ووصفها."}</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">4 {sv(s, "hackviserCertificateCountLabel") || "شهادات"}</span>
          </div>
          {(() => {
            const certificate = editableCertificateById.get(HACKVISER_MASTER_ID);
            if (!certificate) return null;
            return (
              <Link to="/certificates/$certificateId" params={{ certificateId: HACKVISER_MASTER_ID }} className="block transition-transform hover:-translate-y-1">
                <CertificateCard certificate={{ ...certificate, title: sv(s, "hackviserSectionTitle") || certificate.title, focus: sv(s, "hackviserSectionDescription") || certificate.focus }} featured />
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm font-bold text-primary">
                  <span>{sv(s, "hackviserOpenDetailsLabel") || "فتح مجموعة Hackviser والشهادات التابعة"}</span>
                  <span aria-hidden="true">←</span>
                </div>
              </Link>
            );
          })()}
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-0 pb-12">
        <section aria-labelledby="infosec-certificate-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">القسم الثاني المستقل — InfoSec</p>
              <h2 id="infosec-certificate-heading" className="mt-2 text-2xl font-black">مسار CISSP المهني من InfoSec</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">الشهادة الرئيسية الثانية، وعند فتحها ستظهر صور الشهادات الفرعية التي أرسلتها ضمن قسم مستقل.</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">شهادة رئيسية</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {INFOSEC_MAIN_CERTIFICATE_IDS.map((certificateId) => {
              const certificate = editableCertificateById.get(certificateId);
              if (!certificate) return null;
              const displayCertificate = { ...certificate, title: sv(s, "certificateInfoSecTitle") || certificate.title, focus: sv(s, "certificateInfoSecDescription") || certificate.focus };
              return (
                <Link key={certificateId} to="/certificates/$certificateId" params={{ certificateId }} className="block transition-transform hover:-translate-y-1">
                  <CertificateCard certificate={displayCertificate} featured />
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm font-bold text-primary">
                    <span>فتح الشهادة والصور الفرعية التابعة</span>
                    <span aria-hidden="true">←</span>
                  </div>
                </Link>
              );
            })}
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

        {certs.length > 0 && (
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
