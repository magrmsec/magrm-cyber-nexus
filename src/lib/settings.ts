import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** كل نصوص وألوان وروابط الموقع تُقرأ من جدول site_settings (صف واحد id = 'main'). */

export type SettingsFieldType = "text" | "textarea" | "color" | "list" | "toggle";

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
    id: "page-text",
    title: "عناوين ووصف صفحات المحتوى",
    fields: [
      { key: "homeExploreTitle", label: "عنوان استكشاف المنصة", type: "text" },
      { key: "homeFeaturedTitle", label: "عنوان الدورات المميزة", type: "text" },
      { key: "homeLatestTitle", label: "عنوان أحدث الثغرات", type: "text" },
      { key: "coursesPageTitle", label: "عنوان صفحة الدورات", type: "text" },
      { key: "coursesPageDescription", label: "وصف صفحة الدورات", type: "textarea" },
      { key: "videosPageTitle", label: "عنوان صفحة الفيديوهات", type: "text" },
      { key: "videosPageDescription", label: "وصف صفحة الفيديوهات", type: "textarea" },
      { key: "videosCoverImage", label: "رابط خلفية أغلفة الفيديوهات", type: "text", hint: "ضع رابط صورة الخلفية أو مسارها داخل الموقع" },
      { key: "toolsPageTitle", label: "عنوان صفحة الأدوات", type: "text" },
      { key: "toolsPageDescription", label: "وصف صفحة الأدوات", type: "textarea" },
      { key: "appsPageTitle", label: "عنوان صفحة التطبيقات", type: "text" },
      { key: "appsPageDescription", label: "وصف صفحة التطبيقات", type: "textarea" },
      { key: "vulnsPageTitle", label: "عنوان صفحة الثغرات", type: "text" },
      { key: "vulnsPageDescription", label: "وصف صفحة الثغرات", type: "textarea" },
      { key: "portsPageTitle", label: "عنوان صفحة البورتات", type: "text" },
      { key: "portsPageDescription", label: "وصف صفحة البورتات", type: "textarea" },
      { key: "certificatesPageTitle", label: "عنوان صفحة الشهادات", type: "text" },
      { key: "certificatesPageDescription", label: "وصف صفحة الشهادات", type: "textarea" },
    ],
  },
  {
    id: "detail-interface",
    title: "نصوص صفحات التفاصيل والأزرار",
    fields: [
      { key: "detailBackLabel", label: "زر العودة", type: "text" },
      { key: "detailWhatsappButton", label: "زر التواصل عبر واتساب", type: "text" },
      { key: "detailPriceLabel", label: "تسمية السعر", type: "text" },
      { key: "detailOverviewTitle", label: "عنوان التفاصيل العامة", type: "text" },
      { key: "detailRelatedTitle", label: "عنوان المحتوى المرتبط", type: "text" },
      { key: "detailVerificationLabel", label: "تسمية رابط التحقق", type: "text" },
      { key: "detailOpenVideoLabel", label: "زر فتح الفيديو", type: "text" },
      { key: "detailProfessionalLabel", label: "وسم المحتوى الاحترافي", type: "text" },
      { key: "detailCapabilitiesTitle", label: "عنوان قدرات الأداة", type: "text" },
      { key: "detailUseCasesTitle", label: "عنوان الاستخدامات الأمنية", type: "text" },
      { key: "detailDeliverablesTitle", label: "عنوان ما يشمله الطلب", type: "text" },
      { key: "detailProtectionTitle", label: "عنوان الحماية والتوصيات", type: "text" },
      { key: "detailAccessTitle", label: "عنوان الوصول إلى الملف", type: "text" },
      { key: "detailContactButton", label: "زر التواصل في التفاصيل", type: "text" },
      { key: "detailDownloadButton", label: "زر تحميل الأداة", type: "text" },
      { key: "detailObjectiveTitle", label: "عنوان هدف البورت", type: "text" },
      { key: "detailToolsTitle", label: "عنوان أدوات البورت", type: "text" },
      { key: "detailPathTitle", label: "عنوان مسار الحل", type: "text" },
      { key: "detailPurchaseButton", label: "زر الشراء", type: "text" },
      { key: "certificateBackLabel", label: "زر العودة من الشهادة", type: "text" },
      { key: "certificateRecognitionTitle", label: "عنوان اعتماد الشهادة", type: "text" },
      { key: "certificateTopicsTitle", label: "عنوان محاور الشهادة", type: "text" },
      { key: "certificateReturnButton", label: "زر العودة لقسم الشهادات", type: "text" },
    ],
  },
  {
    id: "interface",
    title: "نصوص الواجهة المشتركة",
    fields: [
      { key: "uiSearchLabel", label: "تسمية البحث", type: "text" },
      { key: "uiAllOption", label: "خيار الكل", type: "text" },
      { key: "uiCategoryLabel", label: "تسمية التصنيف", type: "text" },
      { key: "uiLevelLabel", label: "تسمية المستوى", type: "text" },
      { key: "uiSeverityLabel", label: "تسمية الخطورة", type: "text" },
      { key: "uiResultsLabel", label: "تسمية النتائج", type: "text" },
      { key: "uiLoadMore", label: "زر تحميل المزيد", type: "text" },
      { key: "uiClose", label: "زر الإغلاق", type: "text" },
      { key: "uiEmptyResults", label: "رسالة عدم وجود نتائج", type: "text" },
    ],
  },
  {
    id: "certificates",
    title: "الشهادات الرئيسية",
    fields: [
      { key: "certificateMasterTitle", label: "عنوان شهادة 12 دورة", type: "text" },
      { key: "certificateMasterDescription", label: "وصف شهادة 12 دورة", type: "textarea" },
      { key: "certificateInfoSecTitle", label: "عنوان شهادة InfoSec", type: "text" },
      { key: "certificateInfoSecDescription", label: "وصف شهادة InfoSec", type: "textarea" },
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
    id: "awards",
    title: "جوائز الأمن السيبراني",
    fields: [
      { key: "awardsTitle", label: "عنوان قسم الجوائز", type: "text" },
      { key: "award1Title", label: "الجائزة 1 — الاسم", type: "text" },
      { key: "award1Year", label: "الجائزة 1 — السنة", type: "text" },
      { key: "award2Title", label: "الجائزة 2 — الاسم", type: "text" },
      { key: "award2Year", label: "الجائزة 2 — السنة", type: "text" },
      { key: "award3Title", label: "الجائزة 3 — الاسم", type: "text" },
      { key: "award3Year", label: "الجائزة 3 — السنة", type: "text" },
      { key: "award4Title", label: "الجائزة 4 — الاسم", type: "text" },
      { key: "award4Year", label: "الجائزة 4 — السنة", type: "text" },
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
    title: "نصوص وروابط التواصل",
    fields: [
      { key: "contactTitle", label: "عنوان صفحة التواصل", type: "text" },
      { key: "contactIntro", label: "المقدمة تحت العنوان", type: "textarea" },
      { key: "contactWhatsappTitle", label: "عنوان بطاقة الواتساب", type: "text" },
      { key: "contactWhatsappDescription", label: "وصف بطاقة الواتساب", type: "textarea" },
      { key: "contactWhatsappButton", label: "نص زر الواتساب", type: "text" },
      { key: "contactEmailTitle", label: "عنوان بطاقة البريد", type: "text" },
      { key: "contactEmailDescription", label: "وصف بطاقة البريد", type: "textarea" },
      { key: "contactSocialTitle", label: "عنوان منصات التواصل", type: "text" },
      { key: "contactSocialDescription", label: "وصف منصات التواصل", type: "textarea" },
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
    id: "operations",
    title: "تشغيل الموقع ووضع الصيانة",
    fields: [
      { key: "maintenanceMode", label: "وضع الصيانة", type: "toggle", hint: "عند التفعيل يتوقف الموقع للزوار وتبقى لوحة الإدارة متاحة لك." },
      { key: "maintenanceTitle", label: "عنوان صفحة الصيانة", type: "text" },
      { key: "maintenanceMessage", label: "رسالة صفحة الصيانة", type: "textarea" },
      { key: "maintenanceContact", label: "رابط التواصل أثناء الصيانة", type: "text" },
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

  homeExploreTitle: "استكشف المنصة",
  homeFeaturedTitle: "دورات مميزة",
  homeLatestTitle: "أحدث الثغرات",
  coursesPageTitle: "الدورات المدفوعة",
  coursesPageDescription: "مسارات تدريبية عملية بالكامل في الاختراق الأخلاقي والأمن السيبراني، من المستوى المبتدئ حتى الاحتراف.",
  videosPageTitle: "مكتبة الفيديوهات",
  videosPageDescription: "شروحات عملية مجانية بالفيديو: أدوات الاختراق، ثغرات الويب، الشبكات، وتحديات CTF.",
  videosCoverImage: "/cyber-hacker-video-background-magrm-preview.png",
  toolsPageTitle: "أدوات الأمن السيبراني",
  toolsPageDescription: "ترسانة الأدوات التي يعتمد عليها محترفو الأمن السيبراني حول العالم",
  appsPageTitle: "برامج وتطبيقات الأمن السيبراني",
  appsPageDescription: "قسم واحد يضم كتالوجًا واسعًا من الأدوات والتطبيقات، مرتبًا حسب المجال والمنصة مع روابط المواقع الرسمية. استخدم البحث والتصنيفات للوصول بسرعة إلى ما تحتاجه.",
  vulnsPageTitle: "قاعدة الثغرات CVE",
  vulnsPageDescription: "أرشيف ثغرات CVE مصنّف حسب الخطورة والنوع، مع الأنظمة المتأثرة وتاريخ الاكتشاف وطرق الحماية.",
  portsPageTitle: "البورتات العملية",
  portsPageDescription: "بيئات معزولة واقعية تحاكي الشبكات والخوادم والأجهزة والسحابة وتطبيقات ومنصات التواصل. اختبر، التقط الأعلام، واكتب تقريرك الاحترافي ضمن نطاق مصرح به.",
  certificatesPageTitle: "الشهادات المهنية",
  certificatesPageDescription: "هذه المساحة مخصصة لعرض شهادات Magrm المهنية. أضف صورة الشهادة وعنوانها ليظهرا هنا مباشرة.",
  certificateMasterTitle: "IBM and ISC2 Cybersecurity Specialist",
  certificateMasterDescription: "مسار مهني متكامل من 12 دورة يقدّم أساسًا عمليًا في الأمن السيبراني والشبكات والسحابة والاستجابة للحوادث والعمليات الأمنية.",
  certificateInfoSecTitle: "Certified Information Systems Security Professional (CISSP) Specialization",
  certificateInfoSecDescription: "مسار مهني من 8 دورات يغطي نطاقات CISSP ويهيئ لاختبار ISC2 CISSP، مع شهادة إتمام قابلة للتحقق من Coursera.",

  detailBackLabel: "← العودة",
  detailWhatsappButton: "اشترك الآن عبر الواتساب",
  detailPriceLabel: "السعر",
  detailOverviewTitle: "التفاصيل العامة",
  detailRelatedTitle: "المحتوى المرتبط",
  detailVerificationLabel: "رابط التحقق",
  detailOpenVideoLabel: "فتح الفيديو",
  detailProfessionalLabel: "أداة احترافية",
  detailCapabilitiesTitle: "ماذا تقدم الأداة؟",
  detailUseCasesTitle: "الاستخدامات الأمنية",
  detailDeliverablesTitle: "ما الذي يشمله الطلب؟",
  detailProtectionTitle: "الحماية والتوصيات",
  detailAccessTitle: "الوصول إلى ملف الثغرة",
  detailContactButton: "تواصل معنا عبر الواتساب",
  detailDownloadButton: "تحميل الأداة",
  detailObjectiveTitle: "الهدف",
  detailToolsTitle: "الأدوات المستخدمة",
  detailPathTitle: "مسار الحل",
  detailPurchaseButton: "اشترِ الآن",
  certificateBackLabel: "العودة إلى الشهادات",
  certificateRecognitionTitle: "قوة الشهادة واعتمادها",
  certificateTopicsTitle: "المهارات والمحاور الرئيسية",
  certificateReturnButton: "العودة إلى قسم الشهادات",

  uiSearchLabel: "البحث في المحتوى",
  uiAllOption: "الكل",
  uiCategoryLabel: "التصنيف",
  uiLevelLabel: "المستوى",
  uiSeverityLabel: "مستوى الخطورة",
  uiResultsLabel: "عدد النتائج",
  uiLoadMore: "تحميل المزيد",
  uiClose: "إغلاق",
  uiEmptyResults: "لا توجد نتائج مطابقة.",

  stat1Value: "",
  stat1Label: "دورة تدريبية",
  stat2Value: "",
  stat2Label: "فيديو شرح",
  stat3Value: "",
  stat3Label: "ثغرة موثّقة",
  stat4Value: "",
  stat4Label: "متدرّب",

  aboutEyebrow: "من أنا",
  aboutName: "Mohammed Al-Azzani",
  aboutIntro:
    "هنا يبدأ الحضور الذي لا يكتفي بملاحقة الخطر؛ بل يقرأه قبل أن يصل، ويحوّل المعرفة إلى قوة، والانضباط إلى حماية، والطموح إلى أثرٍ يفرض احترامه في عالم الأمن السيبراني.",
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

  awardsTitle: "جوائز الأمن السيبراني",
  award1Title: "أفضل منصة تدريب سيبراني عربية",
  award1Year: "2024",
  award2Title: "جائزة التميّز في المحتوى التقني",
  award2Year: "2023",
  award3Title: "اعتماد مسارات Red Team",
  award3Year: "2023",
  award4Title: "أفضل مختبرات عملية",
  award4Year: "2022",

  contactTitle: "تواصل معنا مباشرة",
  contactIntro:
    "يسعدنا تواصلك. فريق Magrm هنا للإجابة عن استفساراتك وتقديم الدعم والمعلومات التي تحتاجها في مجال الأمن السيبراني، وسنكون معك خطوة بخطوة.",
  contactWhatsappTitle: "التواصل عبر الواتساب",
  contactWhatsappDescription: "للاستفسارات الرسمية والدعم الفني عبر الواتساب",
  contactWhatsappButton: "مراسلة عبر الواتساب",
  contactEmailTitle: "البريد الإلكتروني",
  contactEmailDescription: "للاستفسارات الرسمية والدعم الفني عبر البريد",
  contactSocialTitle: "جميع حساباتنا على منصات التواصل",
  contactSocialDescription: "تواصل معنا عبر المنصة التي تناسبك، وسنرد عليك في أسرع وقت ممكن.",
  contactEmail: "contact@magrm.security",
  supportEmail: "support@magrm.security",
  whatsapp: "https://wa.me/967733570889",
  telegram: "https://t.me/T_akx",
  instagram: "https://instagram.com/m0_qd",
  youtube: "https://youtube.com/@magrm",
  twitter: "https://x.com/magrm",
  github: "https://github.com/magrm",
  contactLocation: "عن بُعد — خدمة كل الدول العربية",

  maintenanceMode: "false",
  maintenanceTitle: "الموقع تحت الصيانة المؤقتة",
  maintenanceMessage: "نعمل حاليًا على تحسين المنصة. سنعود إليك قريبًا بتجربة أفضل.",
  maintenanceContact: "https://wa.me/967733570889",

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
    else if (typeof v === "string" && v.trim()) {
      // توافق مؤقت مع القيم القديمة المحفوظة قبل اعتماد هوية Mohammed Al-Azzani.
      // عند حفظ قيمة جديدة من لوحة الإدارة تُقبل وتظهر بشكل طبيعي.
      if (k === "aboutName" && v.startsWith("Magrm ـ الاسم الذي يخشاه المخترقون")) continue;
      if (k === "aboutIntro" && v.startsWith("لا أنتظر الاختراق ليحدث")) continue;
      merged[k] = v;
    }
  }
  return merged;
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

export function useSiteSettings() {
  const q = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 30_000,
  });
  const data = q.data ?? DEFAULT_SETTINGS;
  // دالة قابلة للاستدعاء: settings("whatsapp") ترجع نص القيمة مباشرة
  const settings = (key: string): string => sv(data, key);
  const settingsList = (key: string): string[] => sl(data, key);
  return { settings, settingsList, s: data, isLoading: q.isLoading };
}
