import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/settings";
import { useCmsRows } from "@/lib/cms";

const MASTER_ID = "ibm-isc2-cybersecurity-specialist-master";
const INFOSEC_ID = "infosec-cissp-specialization";
const CSOA_ID = "hackviser-csoa";
const HACKVISER_ID = "hackviser-certifications-master";
interface CourseCertificate {
  id: string;
  number: number;
  title: string;
  issuer: string;
  focus: string;
  strength: string;
  image: string;
  verify?: string;
}

const MASTER_CERTIFICATE = {
  id: MASTER_ID,
  title: "IBM and ISC2 Cybersecurity Specialist",
  issuer: "IBM وISC2 عبر Coursera",
  description: "شهادة مهنية دولية تجمع بين خبرة IBM ومسار ISC2 في برنامج واحد متكامل من 12 دورة. تمنح حاملها أساسًا قويًا للانطلاق في الأمن السيبراني، من فهم الأنظمة والشبكات والسحابة إلى مبادئ الحماية والاستجابة للحوادث والتحكم بالوصول والعمليات الأمنية، وتنتهي بمشروع تطبيقي يربط المعرفة بالواقع.",
  recognition: "تحمل الشهادة اعتماد Professional Certificate من IBM وISC2 عبر Coursera، وتُعد مسارًا مهنيًا دوليًا موثقًا لبناء مهارات الأمن السيبراني على مستوى البداية. يوضح البرنامج أنه يجهّز المتعلم لامتحان ISC2 Certified in Cybersecurity (CC)، مع بقاء امتحان CC وشهادة CISSP اعتمادات منفصلة تتطلب التسجيل والاختبار الخاص بها.",
  image: "/certificates/ibm-isc2-cybersecurity-specialist.jpg",
};

const INFOSEC_CERTIFICATE = {
  title: "Certified Information Systems Security Professional (CISSP) Specialization",
  issuer: "InfoSec عبر Coursera",
  image: "/certificates/infosec-cissp-specialization.jpg",
  description: "مسار مهني متقدم من InfoSec عبر Coursera، يضم 8 دورات تغطي نطاقات CISSP الثمانية، ويعرض أساسًا منظمًا في إدارة المخاطر وأمن الأصول والهندسة الأمنية والاتصالات وإدارة الهوية والتقييم والعمليات وأمن تطوير البرمجيات.",
  recognition: "الشهادة الظاهرة هي شهادة إتمام لمسار مهني من InfoSec عبر Coursera، مع رابط تحقق ظاهر في الوثيقة. المسار يهيئ المتعلم لاختبار ISC2 CISSP ويغطي نطاقاته الثمانية، لكنه لا يساوي شهادة CISSP الرسمية ولا يثبت اجتياز امتحان ISC2؛ فالاعتماد الرسمي يتطلب مسار الجهة المانحة وامتحانها الخاص.",
};

const INFOSEC_COURSES: CourseCertificate[] = [
  {
    id: "infosec-domain-1",
    number: 1,
    title: "CISSP Domain 1: Security and Risk Management",
    issuer: "InfoSec عبر Coursera",
    focus: "إدارة الأمن والمخاطر والحوكمة والسياسات التي تبني برنامجًا أمنيًا متينًا.",
    strength: "إدارة المخاطر والحوكمة",
    image: "/certificates/infosec-cissp-domain-1.jpg",
    verify: "https://coursera.org/verify/WQ53AE4RF1R4",
  },
  {
    id: "infosec-domain-2",
    number: 2,
    title: "CISSP Domain 2: Asset Security",
    issuer: "InfoSec عبر Coursera",
    focus: "تصنيف الأصول وحمايتها وإدارة البيانات خلال دورة حياتها.",
    strength: "حماية الأصول والبيانات",
    image: "/certificates/infosec-cissp-domain-2.jpg",
    verify: "https://coursera.org/verify/T5SP0RH12FU0",
  },
  {
    id: "infosec-domain-4",
    number: 4,
    title: "CISSP Domain 4: Communication and Network Security",
    issuer: "InfoSec عبر Coursera",
    focus: "أمن الاتصالات والشبكات وتقليل مخاطر البنية التحتية والخدمات المكشوفة.",
    strength: "أمن الشبكات والاتصالات",
    image: "/certificates/infosec-cissp-domain-4.jpg",
    verify: "https://coursera.org/verify/OGUL5A9AT8RZ",
  },
  {
    id: "infosec-domain-7",
    number: 7,
    title: "CISSP Domain 7: Security Operations",
    issuer: "InfoSec عبر Coursera",
    focus: "العمليات الأمنية والمراقبة والاستجابة للحوادث واستمرارية التشغيل.",
    strength: "العمليات والاستجابة",
    image: "/certificates/infosec-cissp-domain-7.jpg",
    verify: "https://coursera.org/verify/ILMJ8AJY1GGF",
  },
  {
    id: "infosec-domain-8",
    number: 8,
    title: "CISSP Domain 8: Software Development Security",
    issuer: "InfoSec عبر Coursera",
    focus: "دمج الأمن في دورة حياة تطوير البرمجيات وتقليل مخاطر التطبيقات.",
    strength: "أمن تطوير البرمجيات",
    image: "/certificates/infosec-cissp-domain-8.jpg",
    verify: "https://coursera.org/verify/P5S8O7NPJRAV",
  },
];

const CSOA_CERTIFICATE = {
  title: "Certified Security Operations Analyst (CSOA)",
  issuer: "Hackviser",
  image: "/certificates/hackviser-csoa.jpg",
  description: "شهادة مهنية عملية متخصصة في عمليات الأمن السيبراني، صُممت لمن يريد بناء مهارات حقيقية كمحلل SOC. تجمع بين مراقبة الأحداث، اكتشاف التهديدات، تحليل السجلات، التحقيق الجنائي الرقمي، وصيد التهديدات داخل سيناريوهات تدريبية عملية.",
  recognition: "الشهادة صادرة من Hackviser وتستند إلى تدريب عملي واختبار تطبيقي وتحليل سجلات وتحديد تهديدات داخل بيئة مضبوطة. وتذكر الجهة المانحة أنها تحظى باعتراف مهني لدى أصحاب العمل، لكن هذه الصفحة لا تصفها كاعتماد حكومي أو كبديل لشهادات CISSP أو CC أو شهادات الجهات التنظيمية الرسمية.",
};

const HACKVISER_CERTIFICATE = {
  title: "Hackviser — مجموعة الشهادات المهنية العملية",
  issuer: "Hackviser",
  image: "/certificates/hackviser-csoa.jpg",
  description: "قسم مستقل يجمع شهادات Hackviser العملية في عمليات الأمن السيبراني، اختبار الاختراق، وأمن تطبيقات الويب، بحيث تظهر كل شهادة بصورتها ووصفها ومجالات المهارة التي تغطيها.",
  recognition: "هذه شهادات مهنية صادرة من Hackviser كما تظهر في الصور والبيانات المتاحة. تُعرض بوضوح كمسارات تدريب وتقييم عملية، ولا تُقدَّم هنا على أنها اعتماد حكومي أو بديل عن الشهادات التنظيمية الرسمية مثل CISSP أو OSCP.",
};

const HACKVISER_CERTIFICATES = [
  {
    id: "hackviser-csoa",
    number: 1,
    title: "Certified Security Operations Analyst (CSOA)",
    issuer: "Hackviser",
    focus: "عمليات الأمن، اكتشاف التهديدات، تحليل السجلات، والتحقيق الجنائي الرقمي ضمن بيئات تدريبية عملية.",
    strength: "عمليات الأمن وSOC",
    image: "/certificates/hackviser-csoa.jpg",
  },
  {
    id: "hackviser-capt",
    number: 2,
    title: "Certified Associate Penetration Tester (CAPT)",
    issuer: "Hackviser",
    focus: "منهجيات الاستطلاع والتقييم واختبار الاختراق الأخلاقي داخل بيئات تدريبية مصرّح بها.",
    strength: "اختبار الاختراق",
    image: "/certificates/hackviser-capt.jpg",
  },
  {
    id: "hackviser-cwse",
    number: 3,
    title: "Certified Web Security Expert (CWSE)",
    issuer: "Hackviser",
    focus: "أمن تطبيقات الويب، تحليل سطح الهجوم، تقييم الثغرات، وكتابة التقارير الأمنية.",
    strength: "أمن تطبيقات الويب",
    image: "/certificates/hackviser-cwse.jpg",
  },
  {
    id: "hackviser-core-cybersecurity",
    number: 4,
    title: "CORE — Certified Cybersecurity Foundations",
    issuer: "Hackviser",
    focus: "أساسيات الأمن السيبراني والمفاهيم الأولية التي تهيئ للانتقال إلى المسارات العملية المتقدمة.",
    strength: "الأساسيات العملية",
    image: "/certificates/hackviser-core-cybersecurity.jpg",
  },
];

const CSOA_TOPICS = [
  "مبادئ SOC ونمذجة التهديدات",
  "مراقبة الأمن وتقنيات SIEM وEDR وIDS/IPS",
  "تحليل السجلات والاستجابة للحوادث",
  "التحقيق الجنائي للشبكات والأجهزة الطرفية",
  "صيد التهديدات والاستخبارات مفتوحة المصدر",
  "تحليل الحزم وكتابة التقارير والتصعيد",
];

interface GenericCertificate {
  title: string;
  issuer: string;
  image: string;
  description: string;
  recognition: string;
  topics: string[];
}

const GENERIC_CERTIFICATES: Record<string, GenericCertificate> = {
  "hackviser-cwse": {
    title: "Certified Web Security Expert (CWSE)",
    issuer: "Hackviser",
    image: "/certificates/hackviser-cwse.jpg",
    description: "شهادة مهنية عملية متخصصة في أمن تطبيقات الويب، تركز على فهم سطح الهجوم وتحليل الثغرات وتطبيق منهجيات اختبار آمنة داخل بيئات تدريبية مصرّح بها.",
    recognition: "شهادة مهنية صادرة من Hackviser وموجهة لمهارات أمن الويب العملية. تُعرض هنا كما هي من الجهة المانحة، ولا تُوصف كاعتماد حكومي أو بديل عن الشهادات التنظيمية الدولية مثل CISSP أو OSCP.",
    topics: ["أمن تطبيقات الويب", "تحليل الثغرات", "منهجيات اختبار الويب", "كتابة التقارير الأمنية"],
  },
  "hackviser-capt": {
    title: "Certified Associate Penetration Tester (CAPT)",
    issuer: "Hackviser",
    image: "/certificates/hackviser-capt.jpg",
    description: "شهادة مهنية عملية في أساسيات اختبار الاختراق، تمنح المتعلم إطارًا منظمًا لفهم التقييم الأمني واكتشاف نقاط الضعف ضمن بيئات تدريبية معزولة.",
    recognition: "شهادة مهنية صادرة من Hackviser بمستوى Associate وتركز على التدريب العملي. لا تُعرض كاعتماد حكومي أو كشهادة CISSP أو OSCP الرسمية.",
    topics: ["أساسيات اختبار الاختراق", "الاستطلاع الأمني", "تقييم المخاطر", "التوثيق وكتابة التقارير"],
  },
  "cde-cybersecurity-professional": {
    title: "Cybersecurity Professional — Certificate of Achievement",
    issuer: "Cyber Defense Excellence (CDE)",
    image: "/certificates/cde-cybersecurity-professional.jpg",
    description: "شهادة إنجاز مهنية تجمع موضوعات عملية في اختبار الاختراق وأمن الشبكات والويب وSIEM والاستجابة للحوادث، وتعرض مسارًا متنوعًا لبناء المعرفة الدفاعية والهجومية الأخلاقية.",
    recognition: "شهادة إنجاز مهنية كما تظهر في الصورة المرفوعة من صاحب الحساب. لا يوجد في البيانات المتاحة ما يثبت اعتمادًا حكوميًا أو اعتمادًا دوليًا مستقلًا، لذلك نعرضها باسم الجهة دون مبالغة.",
    topics: ["اختبار الاختراق الأخلاقي", "أمن الشبكات والويب", "SIEM", "الاستجابة للحوادث"],
  },
  "opswat-icip": {
    title: "Introduction to Critical Infrastructure Protection (ICIP)",
    issuer: "OPSWAT Academy",
    image: "/certificates/opswat-icip.jpg",
    description: "شهادة مهنية تمهيدية في حماية البنية التحتية الحيوية، وتسلط الضوء على أهمية حماية الأنظمة الحساسة وتقليل مخاطر التشغيل والاتصال.",
    recognition: "شهادة دورة صادرة عن OPSWAT Academy كما تظهر في الصورة المرفوعة. تُعد قيمة مهنية متخصصة في مجال حماية البنية التحتية، ولا تُعرض كبديل عن اعتماد حكومي أو شهادة CISSP.",
    topics: ["حماية البنية التحتية الحيوية", "الأمن التشغيلي", "حماية الأنظمة الحساسة", "إدارة المخاطر"],
  },
  "cisco-introduction-cybersecurity": {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    image: "/certificates/cisco-introduction-cybersecurity.jpg",
    description: "شهادة تأسيسية من Cisco Networking Academy تقدم مدخلًا واضحًا إلى التهديدات السيبرانية ومبادئ حماية الأنظمة والبيانات.",
    recognition: "شهادة إتمام دورة من Cisco Networking Academy كما تظهر في الصورة المرفوعة. تمنح أساسًا تعليميًا جيدًا، لكنها ليست شهادة Cisco مهنية متقدمة أو اعتماد CISSP.",
    topics: ["مبادئ الأمن السيبراني", "أنواع التهديدات", "حماية البيانات", "أساسيات الدفاع"],
  },
  "google-network-security": {
    title: "Connect and Protect: Networks and Network Security",
    issuer: "Google عبر Coursera",
    image: "/certificates/google-network-security.jpg",
    description: "شهادة دورة تركّز على فهم الشبكات وتأمين الاتصالات، وتمنح المتعلم أساسًا عمليًا لفهم المخاطر التي تواجه البنية الشبكية.",
    recognition: "شهادة إتمام دورة من Google عبر Coursera كما تظهر في الصورة المرفوعة. هي جزء من تعلم مهني، وليست اعتمادًا تنظيميًا مستقلًا مثل CISSP أو CC.",
    topics: ["الشبكات", "أمن الشبكات", "الاتصالات", "حماية البنية التحتية"],
  },
  "google-cybersecurity-jobs": {
    title: "Put It to Work: Prepare for Cybersecurity Jobs",
    issuer: "Google عبر Coursera",
    image: "/certificates/google-cybersecurity-jobs.jpg",
    description: "شهادة دورة تساعد على تحويل المعرفة الأمنية إلى مهارات قابلة للعرض في سوق العمل، مع التركيز على الاستعداد المهني وبناء ملف وظيفي في الأمن السيبراني.",
    recognition: "شهادة إتمام دورة من Google عبر Coursera كما تظهر في الصورة المرفوعة، وقيمتها الأساسية في الإعداد المهني والتطبيق العملي، وليست اعتمادًا حكوميًا مستقلًا.",
    topics: ["الاستعداد الوظيفي", "مهارات محلل الأمن", "بناء الملف المهني", "تطبيق المعرفة"],
  },
  "google-ai-professional": {
    title: "Google AI Professional Certificate",
    issuer: "Google عبر Coursera",
    image: "/certificates/google-ai-professional.jpg",
    description: "شهادة مهنية في تطبيقات الذكاء الاصطناعي تساعد على تحويل الأدوات الحديثة إلى مهارات عملية في العمل والإنتاجية وحل المشكلات.",
    recognition: "Professional Certificate من Google عبر Coursera كما تظهر في الصورة المرفوعة؛ وهي شهادة مهنية في الذكاء الاصطناعي وليست اعتمادًا سيبرانيًا مستقلًا.",
    topics: ["أساسيات الذكاء الاصطناعي", "تطبيقات العمل", "حل المشكلات", "الإنتاجية الرقمية"],
  },
  "hackviser-core-cybersecurity": {
    title: "CORE — Certified Cybersecurity Foundations",
    issuer: "Hackviser",
    image: "/certificates/hackviser-core-cybersecurity.jpg",
    description: "شهادة تأسيسية في الأمن السيبراني تمنح المتعلم مدخلًا عمليًا إلى المفاهيم والمهارات التي يحتاجها قبل الانتقال إلى المسارات المتقدمة.",
    recognition: "شهادة تأسيسية صادرة من Hackviser كما تظهر في الصورة المرفوعة، ومناسبة لبناء الأساس وليست اعتمادًا مهنيًا متقدمًا مثل CISSP أو OSCP.",
    topics: ["أساسيات الأمن السيبراني", "مفاهيم التهديدات", "المهارات الأولية", "التعلم العملي"],
  },
  "one-million-prompters": {
    title: "1 Million Prompters — Certificate of Completion",
    issuer: "Dubai Future Foundation / Dubai Centre for Artificial Intelligence",
    image: "/certificates/one-million-prompters.jpg",
    description: "شهادة إتمام في هندسة الأوامر والذكاء الاصطناعي، تضيف مهارة تقنية مساندة للاستفادة من أدوات الذكاء الاصطناعي في التعلم والعمل.",
    recognition: "شهادة إتمام كما تظهر في الصورة المرفوعة، وتختص بالذكاء الاصطناعي وهندسة الأوامر وليست شهادة أمن سيبراني.",
    topics: ["هندسة الأوامر", "الذكاء الاصطناعي", "التواصل مع النماذج", "التطبيقات العملية"],
  },
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
    if (params.certificateId !== MASTER_ID && params.certificateId !== INFOSEC_ID && params.certificateId !== CSOA_ID && params.certificateId !== HACKVISER_ID && !GENERIC_CERTIFICATES[params.certificateId]) throw notFound();
    return {
      certificateId: params.certificateId,
      certificate: params.certificateId === INFOSEC_ID ? INFOSEC_CERTIFICATE : params.certificateId === HACKVISER_ID ? HACKVISER_CERTIFICATE : MASTER_CERTIFICATE,
      courses: params.certificateId === INFOSEC_ID ? INFOSEC_COURSES : params.certificateId === HACKVISER_ID ? HACKVISER_CERTIFICATES : RELATED_COURSES,
    };
  },
  head: ({ params }) => {
    const detail = params.certificateId === INFOSEC_ID ? INFOSEC_CERTIFICATE : params.certificateId === MASTER_ID ? MASTER_CERTIFICATE : params.certificateId === HACKVISER_ID ? HACKVISER_CERTIFICATE : params.certificateId === CSOA_ID ? CSOA_CERTIFICATE : GENERIC_CERTIFICATES[params.certificateId] ?? MASTER_CERTIFICATE;
    return {
      meta: [
        { title: `${detail.title} | Magrm` },
        { name: "description", content: detail.description },
        { property: "og:title", content: detail.title },
        { property: "og:description", content: detail.description },
      ],
    };
  },
  component: CertificateDetailPage,
});

function CertificateDetailPage() {
  const { certificateId, certificate, courses } = Route.useLoaderData();
  const { settings: s } = useSiteSettings();
  if (certificateId === INFOSEC_ID) return <InfosecCertificateDetailPage />;
  if (certificateId === HACKVISER_ID) return <HackviserCertificateDetailPage />;
  if (certificateId === CSOA_ID) return <CsoaCertificateDetailPage />;
  const generic = GENERIC_CERTIFICATES[certificateId];
  if (generic) return <GenericCertificateDetailPage certificate={generic} />;

  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> {s("certificateBackLabel") || "العودة إلى الشهادات"}
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
            <h2 className="text-2xl font-black">{s("certificateRecognitionTitle") || "قوة الشهادة واعتمادها"}</h2>
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
              <ArrowRight className="size-4" /> {s("certificateReturnButton") || "العودة إلى قسم الشهادات"}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}


function InfosecCertificateDetailPage() {
  const { settings: s } = useSiteSettings();
  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> {s("certificateBackLabel") || "العودة إلى الشهادات"}
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">قسم مستقل — InfoSec</p>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-5xl">
                <span className="text-gradient">{INFOSEC_CERTIFICATE.title}</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{INFOSEC_CERTIFICATE.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">{INFOSEC_CERTIFICATE.issuer}</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">8 دورات</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">رابط تحقق</span>
              </div>
            </div>
            <div className="card-surface overflow-hidden p-3 ring-1 ring-primary/45">
              <img src={INFOSEC_CERTIFICATE.image} alt={INFOSEC_CERTIFICATE.title} className="w-full rounded-lg object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="card-surface p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary" />
            <h2 className="text-2xl font-black">قوة المسار وطبيعة الاعتماد</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted-foreground">{INFOSEC_CERTIFICATE.recognition}</p>
        </section>

        <section className="mt-12" aria-labelledby="infosec-courses-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">الشهادات الفرعية المرسلة</p>
              <h2 id="infosec-courses-heading" className="mt-2 text-2xl font-black">الدورات التابعة لمسار CISSP</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">هذه الصور هي الشهادات الفرعية التي أرسلها صاحب الحساب. أُدرجت كما هي، وتبقى جزءًا من المسار وليست شهادات CISSP مستقلة.</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">{INFOSEC_COURSES.length} صور</span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INFOSEC_COURSES.map((course) => (
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
                  {course.verify ? (
                    <a href={course.verify} target="_blank" rel="noopener noreferrer" className="inline-flex text-xs font-bold text-primary underline underline-offset-4">
                      فتح رابط التحقق
                    </a>
                  ) : null}
                  <p className="border-t border-border pt-3 text-xs leading-6 text-muted-foreground">شهادة دورة ضمن مسار InfoSec المهني عبر Coursera، وليست اعتمادًا مستقلًا منفصلًا.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/certificates">
              <ArrowRight className="size-4" /> {s("certificateReturnButton") || "العودة إلى قسم الشهادات"}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}

function HackviserCertificateDetailPage() {
  const { settings: s } = useSiteSettings();
  const { data: cmsCertificateRows = [] } = useCmsRows("certificate");
  const editableCertificates = HACKVISER_CERTIFICATES.map((certificate) => {
    const row = cmsCertificateRows.find((item) => String(item.data.legacyId ?? "") === certificate.id);
    if (!row) return certificate;
    const data = row.data;
    return {
      ...certificate,
      title: typeof data.title === "string" && data.title.trim() ? data.title : certificate.title,
      issuer: typeof data.issuer === "string" && data.issuer.trim() ? data.issuer : certificate.issuer,
      focus: typeof data.focus === "string" && data.focus.trim() ? data.focus : certificate.focus,
      strength: typeof data.strength === "string" && data.strength.trim() ? data.strength : certificate.strength,
      image: typeof data.image === "string" && data.image.trim() ? data.image : certificate.image,
    };
  });
  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> {s("certificateBackLabel") || "العودة إلى الشهادات"}
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{s("hackviserDetailEyebrow") || "قسم Hackviser المستقل"}</p>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-5xl">
                <span className="text-gradient">{s("hackviserDetailTitle") || HACKVISER_CERTIFICATE.title}</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{s("hackviserDetailDescription") || HACKVISER_CERTIFICATE.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">{HACKVISER_CERTIFICATE.issuer}</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">{HACKVISER_CERTIFICATES.length} شهادات تابعة</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">مسارات عملية</span>
              </div>
            </div>
            <div className="card-surface overflow-hidden p-3 ring-1 ring-primary/45">
              <img src={HACKVISER_CERTIFICATE.image} alt={HACKVISER_CERTIFICATE.title} className="w-full rounded-lg object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="card-surface p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary" />
            <h2 className="text-2xl font-black">{s("hackviserRecognitionTitle") || "قوة المجموعة وطبيعة الاعتماد"}</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted-foreground">{s("hackviserRecognitionText") || HACKVISER_CERTIFICATE.recognition}</p>
        </section>

        <section className="mt-12" aria-labelledby="hackviser-certificates-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{s("hackviserSubsectionEyebrow") || "الشهادات التابعة لمجموعة Hackviser"}</p>
              <h2 id="hackviser-certificates-heading" className="mt-2 text-2xl font-black">{s("hackviserSubsectionTitle") || "جميع شهادات Hackviser"}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s("hackviserSubsectionDescription") || "تظهر كل شهادة بصورة مستقلة مع اسمها والمهارات التي تركز عليها، مرتبة من المسارات التخصصية إلى الشهادة التأسيسية."}</p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">{editableCertificates.length} {s("hackviserCertificateCountLabel") || "شهادات"}</span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {editableCertificates.map((certificate) => (
              <article key={certificate.id} className="card-surface animate-rise overflow-hidden">
                <img src={certificate.image} alt={certificate.title} className="aspect-[4/3] w-full bg-surface-2 object-contain" loading="lazy" />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">{s("hackviserCertificateBadge") || "الشهادة"} {certificate.number}</span>
                    <span className="text-xs font-bold text-muted-foreground">{certificate.strength}</span>
                  </div>
                  <p className="text-xs font-bold text-primary">{certificate.issuer}</p>
                  <h3 className="font-bold leading-6">{certificate.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{certificate.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/certificates">
              <ArrowRight className="size-4" /> {s("certificateReturnButton") || "العودة إلى قسم الشهادات"}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}

function CsoaCertificateDetailPage() {
  const { settings: s } = useSiteSettings();
  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> {s("certificateBackLabel") || "العودة إلى الشهادات"}
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">الشهادة المهنية التالية</p>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-5xl">
                <span className="text-gradient">{CSOA_CERTIFICATE.title}</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{CSOA_CERTIFICATE.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">{CSOA_CERTIFICATE.issuer}</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">اختبار عملي</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">عمليات الأمن SOC</span>
              </div>
            </div>
            <div className="card-surface overflow-hidden p-3 ring-1 ring-primary/45">
              <img src={CSOA_CERTIFICATE.image} alt={CSOA_CERTIFICATE.title} className="w-full rounded-lg object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="card-surface p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary" />
            <h2 className="text-2xl font-black">{s("certificateRecognitionTitle") || "قوة الشهادة واعتمادها"}</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted-foreground">{CSOA_CERTIFICATE.recognition}</p>
        </section>

        <section className="mt-12" aria-labelledby="csoa-topics-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">المهارات التي تثبتها</p>
          <h2 id="csoa-topics-heading" className="mt-2 text-2xl font-black">مسار عملي لمحلل عمليات الأمن</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CSOA_TOPICS.map((topic) => (
              <div key={topic} className="card-surface flex items-start gap-3 p-5">
                <Award className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm font-bold leading-7">{topic}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/certificates">
              <ArrowRight className="size-4" /> {s("certificateReturnButton") || "العودة إلى قسم الشهادات"}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}


function GenericCertificateDetailPage({ certificate }: { certificate: GenericCertificate }) {
  const { settings: s } = useSiteSettings();
  const { data: cmsCertificateRows = [] } = useCmsRows("certificate");
  const row = cmsCertificateRows.find((item) => String(item.data.legacyId ?? "") === Object.keys(GENERIC_CERTIFICATES).find((key) => GENERIC_CERTIFICATES[key] === certificate));
  const data = row?.data ?? {};
  const editableCertificate: GenericCertificate = {
    ...certificate,
    title: typeof data.title === "string" && data.title.trim() ? data.title : certificate.title,
    issuer: typeof data.issuer === "string" && data.issuer.trim() ? data.issuer : certificate.issuer,
    image: typeof data.image === "string" && data.image.trim() ? data.image : certificate.image,
    description: typeof data.description === "string" && data.description.trim() ? data.description : certificate.description,
    recognition: typeof data.recognition === "string" && data.recognition.trim() ? data.recognition : certificate.recognition,
    topics: Array.isArray(data.topics) && data.topics.length ? data.topics.map(String) : certificate.topics,
  };
  return (
    <>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowRight className="size-4" /> {s("certificateBackLabel") || "العودة إلى الشهادات"}
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">شهادة مهنية</p>
              <h1 className="animate-rise mt-4 text-3xl font-black leading-tight md:text-5xl">
                <span className="text-gradient">{editableCertificate.title}</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{editableCertificate.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">{editableCertificate.issuer}</span>
                <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-bold">شهادة مهنية</span>
              </div>
            </div>
            <div className="card-surface overflow-hidden p-3 ring-1 ring-primary/45">
              <img src={editableCertificate.image} alt={editableCertificate.title} className="w-full rounded-lg object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="card-surface p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary" />
            <h2 className="text-2xl font-black">{s("certificateRecognitionTitle") || "قوة الشهادة واعتمادها"}</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted-foreground">{editableCertificate.recognition}</p>
        </section>

        <section className="mt-12" aria-labelledby="certificate-topics-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">المجالات التي تغطيها</p>
          <h2 id="certificate-topics-heading" className="mt-2 text-2xl font-black">{s("certificateTopicsTitle") || "المهارات والمحاور الرئيسية"}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {editableCertificate.topics.map((topic) => (
              <div key={topic} className="card-surface flex items-start gap-3 p-5">
                <Award className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm font-bold leading-7">{topic}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/certificates">
              <ArrowRight className="size-4" /> {s("certificateReturnButton") || "العودة إلى قسم الشهادات"}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
