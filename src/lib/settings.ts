import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** كل نصوص وألوان وروابط الموقع تُقرأ من جدول site_settings (صف واحد id = 'main'). */

export type SettingsFieldType = "text" | "textarea" | "color" | "list";

export interface SettingsField {
  key: string;
  label: string;
  type: SettingsFieldType;
  hint?: string;
}

export interface SettingsGroup {
  id: string;
  title: string;
  fields: SettingsField[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "brand",
    title: "الهوية والشعار",
    fields: [
      { key: "brandPrefix", label: "الشعار — الجزء الملوّن", type: "text" },
      { key: "brandSuffix", label: "الشعار — بقية الاسم", type: "text" },
      { key: "siteTagline", label: "وصف الموقع المختصر", type: "textarea" },
    ],
  },
  {
    id: "hero",
    title: "الواجهة الرئيسية",
    fields: [
      { key: "heroBadge", label: "الشارة العلوية", type: "text" },
      { key: "heroTitle", label: "العنوان الرئيسي", type: "text" },
      { key: "heroDescription", label: "الوصف تحت العنوان", type: "textarea" },
      { key: "heroPrimaryCta", label: "نص الزر الأساسي", type: "text" },
      { key: "heroSecondaryCta", label: "نص الرابط الثانوي", type: "text" },
      { key: "partners", label: "شعارات الشركاء (افصل بفاصلة)", type: "list" },
    ],
  },
  {
    id: "stats",
    title: "إحصائيات الصفحة الأولى",
    fields: [
      { key: "stat1Value", label: "الإحصائية 1 — القيمة", type: "text", hint: "اتركه فارغاً ليُحسب تلقائياً من قاعدة البيانات" },
      { key: "stat1Label", label: "الإحصائية 1 — التسمية", type: "text" },
      { key: "stat2Value", label: "الإحصائية 2 — القيمة", type: "text" },
      { key: "stat2Label", label: "الإحصائية 2 — التسمية", type: "text" },
      { key: "stat3Value", label: "الإحصائية 3 — القيمة", type: "text" },
      { key: "stat3Label", label: "الإحصائية 3 — التسمية", type: "text" },
      { key: "stat4Value", label: "الإحصائية 4 — القيمة", type: "text" },
      { key: "stat4Label", label: "الإحصائية 4 — التسمية", type: "text" },
    ],
  },
  {
    id: "about",
    title: "قسم عني",
    fields: [
      { key: "aboutEyebrow", label: "الشارة", type: "text" },
      { key: "aboutName", label: "الاسم / العنوان", type: "text" },
      { key: "aboutIntro", label: "النبذة المختصرة", type: "textarea" },
      { key: "aboutMission", label: "الرسالة (فقرة 1)", type: "textarea" },
      { key: "aboutExperience", label: "الخبرة (فقرة 2)", type: "textarea" },
      { key: "aboutSkills", label: "التخصصات (افصل بفاصلة)", type: "list" },
      { key: "aboutCertificates", label: "الشهادات (افصل بفاصلة)", type: "list" },
      { key: "aboutStat1Value", label: "إحصائية 1 — القيمة", type: "text" },
      { key: "aboutStat1Label", label: "إحصائية 1 — التسمية", type: "text" },
      { key: "aboutStat2Value", label: "إحصائية 2 — القيمة", type: "text" },
      { key: "aboutStat2Label", label: "إحصائية 2 — التسمية", type: "text" },
      { key: "aboutStat3Value", label: "إحصائية 3 — القيمة", type: "text" },
      { key: "aboutStat3Label", label: "إحصائية 3 — التسمية", type: "text" },
      { key: "aboutStat4Value", label: "إحصائية 4 — القيمة", type: "text" },
      { key: "aboutStat4Label", label: "إحصائية 4 — التسمية", type: "text" },
    ],
  },
  {
    id: "contact",
    title: "روابط التواصل",
    fields: [
      { key: "contactEmail", label: "البريد الإلكتروني", type: "text" },
      { key: "supportEmail", label: "بريد الدعم", type: "text" },
      { key: "whatsapp", label: "رابط واتساب", type: "text" },
      { key: "telegram", label: "رابط تلجرام", type: "text" },
      { key: "instagram", label: "رابط انستقرام", type: "text" },
      { key: "youtube", label: "رابط يوتيوب", type: "text" },
      { key: "twitter", label: "رابط X / تويتر", type: "text" },
      { key: "github", label: "رابط GitHub", type: "text" },
      { key: "contactLocation", label: "مكان العمل", type: "text" },
    ],
  },
  {
    id: "payment",
    title: "طريقة الدفع",
    fields: [
      { key: "paymentTitle", label: "عنوان قسم الدفع", type: "text" },
      { key: "paymentInstructions", label: "نص تعليمات الدفع", type: "textarea" },
      { key: "paymentAccount", label: "رقم الحساب البنكي / IBAN", type: "text" },
      { key: "paymentWallet", label: "رقم المحفظة الإلكترونية", type: "text" },
      { key: "paymentNote", label: "ملاحظة بعد التحويل", type: "textarea" },
    ],
  },
  {
    id: "colors",
    title: "ألوان الموقع",
    fields: [
      { key: "colorPrimary", label: "اللون الأساسي", type: "color" },
      { key: "colorSecondary", label: "اللون الثانوي", type: "color" },
      { key: "colorBackground", label: "لون الخلفية", type: "color" },
      { key: "colorCard", label: "لون البطاقات", type: "color" },
    ],
  },
  {
    id: "footer",
    title: "الفوتر",
    fields: [
      { key: "footerAbout", label: "نبذة الفوتر", type: "textarea" },
      { key: "footerContactNote", label: "ملاحظة التواصل", type: "textarea" },
      { key: "footerCtaText", label: "نص زر الفوتر", type: "text" },
      { key: "footerCopyright", label: "حقوق النشر", type: "text" },
    ],
  },
];

export type SiteSettings = Record<string, string | string[]>;

export const DEFAULT_SETTINGS: SiteSettings = {
  brandPrefix: "Magrm",
  brandSuffix: "Cyber Security",
  siteTagline: "منصة عربية متخصصة في الأمن السيبراني والاختراق الأخلاقي.",

  heroBadge: "منصة Magrm للأمن السيبراني",
  heroTitle: "المرونة السيبرانية يبدأ من هنا",
  heroDescription:
    "ابنِ مهاراتك الهجومية والدفاعية عبر مسارات عملية بالكامل: مختبرات اختراق حيّة، تحليل ثغرات حقيقية، أدوات الصناعة، وتقارير بمعايير احترافية — كل ذلك بالعربي.",
  heroPrimaryCta: "مكتبة الدورات",
  heroSecondaryCta: "ابدأ التعلم مجاناً ←",
  partners: ["CrowdStrike", "Fortinet", "Palo Alto", "Cisco", "IBM Security", "Splunk", "Microsoft", "AWS"],

  stat1Value: "",
  stat1Label: "دورة تدريبية",
  stat2Value: "",
  stat2Label: "فيديو شرح",
  stat3Value: "",
  stat3Label: "ثغرة موثّقة",
  stat4Value: "",
  stat4Label: "متدرّب",

  aboutEyebrow: "من أنا",
  aboutName: "Magrm — باحث أمن سيبراني",
  aboutIntro:
    "أعمل منذ أكثر من عقد في مجال الأمن الهجومي والدفاعي: اختبار اختراق للمؤسسات، أبحاث ثغرات، وبناء برامج تدريب عربية بمعايير عالمية.",
  aboutMission:
    "هدفي بناء جيل عربي قادر على الدفاع عن بنيته الرقمية. أؤمن بأن التعلم الحقيقي يحدث داخل المختبر لا في الشرائح النظرية، لذلك بُنيت كل مادة في هذه المنصة حول التطبيق العملي: بيئات حقيقية، أدوات حقيقية، وثغرات حقيقية موثّقة بمعرّفات CVE.",
  aboutExperience:
    "عملت مع فرق أمنية في قطاعات المصارف والاتصالات والحكومة، وشاركت في برامج مكافآت اكتشاف الثغرات مع شركات عالمية، إضافة إلى تدريب فرق SOC والفرق الحمراء داخل المؤسسات.",
  aboutSkills: [
    "اختبار اختراق الشبكات والأنظمة",
    "أمن تطبيقات الويب و API",
    "عمليات الفريق الأحمر (Red Teaming)",
    "الهندسة العكسية وتحليل البرمجيات الخبيثة",
    "التحقيق الجنائي الرقمي والاستجابة للحوادث",
    "أمن السحابة والحاويات",
  ],
  aboutCertificates: ["OSCP", "OSCE", "CISSP", "CEH Master", "GPEN", "eWPTX"],
  aboutStat1Value: "+12",
  aboutStat1Label: "سنة خبرة",
  aboutStat2Value: "+1000",
  aboutStat2Label: "دورة تدريبية",
  aboutStat3Value: "+45,000",
  aboutStat3Label: "طالب",
  aboutStat4Value: "+320",
  aboutStat4Label: "ثغرة مكتشفة",

  contactEmail: "contact@magrm.security",
  supportEmail: "support@magrm.security",
  whatsapp: "https://wa.me/000000000",
  telegram: "https://t.me/magrm",
  instagram: "https://instagram.com/magrm",
  youtube: "https://youtube.com/@magrm",
  twitter: "https://x.com/magrm",
  github: "https://github.com/magrm",
  contactLocation: "عن بُعد — خدمة كل الدول العربية",

  paymentTitle: "طريقة الدفع",
  paymentInstructions:
    "لتفعيل أي دورة أو بورت مدفوع، حوّل قيمة الاشتراك على الحساب أو المحفظة أدناه، ثم أرسل صورة الإيصال عبر نموذج التواصل أو البريد الإلكتروني.",
  paymentAccount: "SA00 0000 0000 0000 0000 0000",
  paymentWallet: "+000 000 000 000",
  paymentNote: "يتم تفعيل الوصول خلال 24 ساعة كحد أقصى بعد التحقق من التحويل.",


  colorPrimary: "",
  colorSecondary: "",
  colorBackground: "",
  colorCard: "",

  footerAbout:
    "منصة عربية متخصصة في الأمن السيبراني والاختراق الأخلاقي: دورات، مختبرات عملية، فيديوهات، أدوات، وقاعدة ثغرات محدّثة.",
  footerContactNote: "للاستشارات الأمنية، اختبار الاختراق، أو التدريب المؤسسي — راسلنا عبر صفحة التواصل.",
  footerCtaText: "أرسل رسالة",
  footerCopyright: "جميع الحقوق محفوظة © Magrm Cyber Security 2024",
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("data").eq("id", "main").maybeSingle();
  if (error || !data) return { ...DEFAULT_SETTINGS };
  const stored = (data.data ?? {}) as Record<string, unknown>;
  const merged: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const [k, v] of Object.entries(stored)) {
    if (Array.isArray(v)) merged[k] = v.map(String);
    else if (typeof v === "string" && v.trim()) merged[k] = v;
  }
  return merged;
}

export function useSiteSettings() {
  const q = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 30_000,
  });
  return { s: q.data ?? DEFAULT_SETTINGS, isLoading: q.isLoading };
}

/** قراءة قيمة نصية بأمان. */
export const sv = (s: SiteSettings, key: string): string => {
  const v = s[key];
  return typeof v === "string" ? v : "";
};

/** قراءة قائمة بأمان. */
export const sl = (s: SiteSettings, key: string): string[] => {
  const v = s[key];
  if (Array.isArray(v)) return v;
  return typeof v === "string" && v.trim() ? v.split(/[,،]/).map((x) => x.trim()).filter(Boolean) : [];
};
