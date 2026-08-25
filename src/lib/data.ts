// Deterministic (seed-based) content generators — same output on server & client.

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const pick = <T,>(arr: T[], r: number) => arr[Math.floor(r * arr.length) % arr.length] as T;

export const LEVELS = ["مبتدئ", "متوسط", "متقدم"] as const;
export type Level = (typeof LEVELS)[number];

export const COURSE_CATEGORIES = [
  "اختراق أخلاقي",
  "اختبار اختراق",
  "أمن الشبكات",
  "أمن تطبيقات الويب",
  "تحليل البرمجيات الخبيثة",
  "التشفير",
  "الهندسة الاجتماعية",
  "Bug Bounty",
  "التحقيق الجنائي الرقمي",
  "أمن السحابة",
  "أمن الأنظمة",
  "البرمجة الآمنة",
];

const COURSE_TOPICS: Record<string, string[]> = {
  "اختراق أخلاقي": ["Ethical Hacking", "Kali Linux", "Reconnaissance", "Privilege Escalation", "Post Exploitation"],
  "اختبار اختراق": ["Penetration Testing", "Metasploit", "Red Team Ops", "Active Directory", "Pivoting"],
  "أمن الشبكات": ["Network Security", "Firewalls", "IDS/IPS", "VPN & Tunneling", "Packet Analysis"],
  "أمن تطبيقات الويب": ["Web AppSec", "SQL Injection", "XSS", "SSRF", "OWASP Top 10"],
  "تحليل البرمجيات الخبيثة": ["Malware Analysis", "Reverse Engineering", "Ransomware", "Sandboxing", "YARA Rules"],
  التشفير: ["Cryptography", "PKI", "AES & RSA", "Hashing", "TLS Internals"],
  "الهندسة الاجتماعية": ["Social Engineering", "Phishing", "OSINT", "Pretexting", "Vishing"],
  "Bug Bounty": ["Bug Bounty", "Recon Automation", "IDOR Hunting", "Report Writing", "Race Conditions"],
  "التحقيق الجنائي الرقمي": ["Digital Forensics", "Memory Forensics", "Disk Imaging", "Log Analysis", "Incident Response"],
  "أمن السحابة": ["Cloud Security", "AWS Security", "Azure AD", "Kubernetes Security", "Container Hardening"],
  "أمن الأنظمة": ["System Hardening", "Windows Internals", "Linux Security", "SIEM", "Endpoint Defense"],
  "البرمجة الآمنة": ["Secure Coding", "Python للأمن", "Bash Scripting", "Exploit Development", "Code Review"],
};

const INSTRUCTORS = ["Magrm", "Magrm Labs", "فريق Magrm الأحمر", "فريق Magrm الأزرق"];

export interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  level: Level;
  hours: number;
  rating: number;
  students: number;
  instructor: string;
  lessons: number;
  curriculum: { title: string; items: string[] }[];
}

export function makeCourse(id: number): Course {
  const r = rng(id * 17 + 3);
  const category = COURSE_CATEGORIES[id % COURSE_CATEGORIES.length] as string;
  const topics = COURSE_TOPICS[category] as string[];
  const topic = topics[Math.floor(r() * topics.length)] as string;
  const level = LEVELS[Math.floor(r() * 3)] as Level;
  const part = Math.floor(id / (COURSE_CATEGORIES.length * topics.length)) + 1;
  const title = `${topic} — ${level} · الجزء ${part}`;
  const hours = 3 + Math.floor(r() * 38);
  return {
    id,
    title,
    category,
    description: `دورة عملية متكاملة في ${category} تركّز على ${topic}. تتعلم فيها الأدوات والتقنيات المستخدمة في العالم الحقيقي مع مختبرات تطبيقية خطوة بخطوة، وسيناريوهات هجوم ودفاع حقيقية، وتقارير احترافية بمعايير الصناعة.`,
    price: 19 + Math.floor(r() * 28) * 10,
    level,
    hours,
    rating: Math.round((4 + r()) * 10) / 10,
    students: 120 + Math.floor(r() * 24000),
    instructor: pick(INSTRUCTORS, r()),
    lessons: 12 + Math.floor(r() * 60),
    curriculum: [
      { title: "الوحدة 1: الأساسيات", items: [`مقدمة في ${topic}`, "تجهيز بيئة المختبر", "المفاهيم الأساسية", "أخلاقيات العمل الأمني"] },
      { title: "الوحدة 2: الأدوات", items: ["الأدوات الأساسية", "الأتمتة بالسكربتات", "التعامل مع النتائج", "تجنب الاكتشاف"] },
      { title: "الوحدة 3: التطبيق العملي", items: ["مختبر عملي 1", "مختبر عملي 2", "سيناريو هجوم كامل", "تحليل النتائج"] },
      { title: "الوحدة 4: الاحتراف", items: ["كتابة التقرير الأمني", "الإجراءات الوقائية", "دراسات حالة", "الاختبار النهائي"] },
    ],
  };
}

export const COURSES_COUNT = 1000;
export const allCourses = (): Course[] => Array.from({ length: COURSES_COUNT }, (_, i) => makeCourse(i + 1));

/* ---------------- Ports (challenges) ---------------- */
export interface Port {
  id: number;
  name: string;
  description: string;
  price: number;
  level: Level;
  objective: string;
  tools: string[];
  flags: number;
}
const PORT_DEFS: [string, string, string[]][] = [
  ["اختراق شبكة WiFi (WPA2)", "تحدي عملي لكسر تشفير WPA2 والتقاط الـ Handshake وتحليله.", ["Aircrack-ng", "Hashcat", "Wireshark"]],
  ["اختراق سيرفر Linux", "استغلال خدمة ضعيفة على سيرفر لينكس والوصول إلى صلاحيات الروت.", ["Nmap", "Metasploit", "LinPEAS"]],
  ["تخطي جدار ناري (Firewall Evasion)", "تجاوز قواعد الجدار الناري وأنظمة كشف التسلل.", ["Nmap", "Proxychains", "Chisel"]],
  ["اختراق قاعدة بيانات SQL", "استغلال ثغرة حقن SQL لاستخراج بيانات كاملة.", ["SQLMap", "Burp Suite"]],
  ["اختراق تطبيق ويب (XSS to Account Takeover)", "سلسلة استغلال من XSS حتى الاستيلاء على الحساب.", ["Burp Suite", "XSStrike"]],
  ["اختراق Active Directory", "من مستخدم عادي إلى Domain Admin داخل بيئة AD.", ["BloodHound", "Mimikatz", "Impacket"]],
  ["كسر كلمات المرور (Password Cracking)", "كسر هاشات متعددة الأنواع بأساليب متقدمة.", ["Hashcat", "John the Ripper"]],
  ["استغلال Buffer Overflow", "تطوير Exploit كامل لثغرة تجاوز سعة المخزن.", ["GDB", "Immunity Debugger", "Python"]],
  ["اختراق كاميرات IoT", "الوصول إلى أجهزة إنترنت الأشياء عبر بيانات اعتماد افتراضية.", ["Shodan", "Nmap", "Hydra"]],
  ["هجوم Man In The Middle", "اعتراض الترافيك داخل الشبكة المحلية وفك تشفيره.", ["Ettercap", "Bettercap", "Wireshark"]],
  ["اختراق خادم Windows", "استغلال SMB والحصول على SYSTEM.", ["Metasploit", "CrackMapExec"]],
  ["تصعيد الصلاحيات في Linux", "من مستخدم محدود إلى root عبر إعدادات خاطئة.", ["LinPEAS", "GTFOBins"]],
  ["اختراق API (Broken Auth)", "استغلال ثغرات المصادقة و IDOR في واجهات REST.", ["Burp Suite", "Postman", "ffuf"]],
  ["تحليل برمجية خبيثة", "تفكيك عينة برمجية خبيثة واستخراج مؤشرات الاختراق.", ["Ghidra", "x64dbg", "YARA"]],
  ["اختراق سحابة AWS", "استغلال أذونات IAM خاطئة للوصول إلى S3 حساس.", ["Pacu", "AWS CLI", "ScoutSuite"]],
  ["Bypass لنظام مصادقة ثنائية", "تجاوز 2FA عبر منطق تطبيق ضعيف.", ["Burp Suite", "Turbo Intruder"]],
  ["اختراق حاويات Docker", "الهروب من الحاوية إلى النظام المضيف.", ["Docker", "amicontained", "deepce"]],
  ["هجوم الهندسة الاجتماعية", "بناء حملة تصيّد كاملة واختبارها في بيئة معزولة.", ["GoPhish", "SET", "Maltego"]],
  ["تحقيق جنائي رقمي", "تحليل صورة ذاكرة واستخراج الأدلة.", ["Volatility", "Autopsy", "FTK Imager"]],
  ["تحدي CTF شامل", "بورت نهائي يجمع كل المهارات في سيناريو شركة كاملة.", ["كل الأدوات"]],
];
export const allPorts = (): Port[] =>
  PORT_DEFS.map(([name, description, tools], i) => {
    const r = rng(i * 31 + 7);
    return {
      id: i + 1,
      name,
      description,
      price: 29 + Math.floor(r() * 20) * 10,
      level: LEVELS[i % 3] as Level,
      objective: `الوصول إلى العلم النهائي (Root Flag) وتوثيق كل خطوة في تقرير احترافي.`,
      tools,
      flags: 2 + (i % 3),
    };
  });

/* ---------------- Videos ---------------- */
export const VIDEO_CATEGORIES = ["شروحات أدوات", "اختراق مواقع", "اختراق شبكات", "CTF", "تحليل ثغرات"];
const YT_IDS = [
  "4t4kBkMsDbQ", "2OPVViV-GQk", "WfYxrLaqlN8", "0VJyfJzbPE4", "B7tTQ272OHE",
  "QiNLNDSLuJY", "csxy3LQB4X0", "xuYZNJCvHgQ", "qTaOZrDnMzQ", "ZTnwg3qCdVM",
  "qwA6MmbeGNo", "z4LhLJnmoZ0", "evyxNUzl-HA", "fNzpcB7ODxQ", "W6SIU-ggTDI",
  "Uk3DEgY5Ue8", "4EMWBYVggQI", "VXxH4n684HE", "qA0YcYMRWyI", "oTD_ki86c9I",
];
export interface Video {
  id: number;
  title: string;
  description: string;
  minutes: number;
  category: string;
  level: Level;
  youtubeId: string;
}
const VIDEO_TOPICS = [
  "شرح Nmap من الصفر", "استغلال ثغرة SQL Injection", "كسر شبكة WiFi عملياً", "حل تحدي CTF", "تحليل ثغرة CVE",
  "استخدام Burp Suite", "اختراق خادم ويب", "أساسيات Metasploit", "التقاط الحزم بـ Wireshark", "تصعيد الصلاحيات",
  "جمع المعلومات OSINT", "ثغرات XSS بالتفصيل", "أتمتة الفحص بـ Nuclei", "تجاوز رفع الملفات", "هجمات Brute Force",
  "تحليل ذاكرة بـ Volatility", "أمن السحابة عملياً", "بناء مختبر اختراق", "كتابة تقرير Bug Bounty", "أساسيات Reverse Engineering",
];
export const VIDEOS_COUNT = 700;
export function makeVideo(id: number): Video {
  const r = rng(id * 13 + 5);
  const category = VIDEO_CATEGORIES[id % VIDEO_CATEGORIES.length] as string;
  const topic = VIDEO_TOPICS[id % VIDEO_TOPICS.length] as string;
  const part = Math.floor(id / VIDEO_TOPICS.length) + 1;
  return {
    id,
    title: `${topic} — الحلقة ${part}`,
    description: `فيديو شرح ضمن سلسلة ${category}. نغطي فيه ${topic} بشكل عملي مع أمثلة حية داخل بيئة مختبر آمنة.`,
    minutes: 5 + Math.floor(r() * 55),
    category,
    level: LEVELS[Math.floor(r() * 3)] as Level,
    youtubeId: YT_IDS[id % YT_IDS.length] as string,
  };
}
export const allVideos = (): Video[] => Array.from({ length: VIDEOS_COUNT }, (_, i) => makeVideo(i + 1));

/* ---------------- Vulnerabilities ---------------- */
export const SEVERITIES = ["حرج", "عالي", "متوسط", "منخفض"] as const;
export type Severity = (typeof SEVERITIES)[number];
export interface Vuln {
  id: number;
  cve: string;
  name: string;
  description: string;
  severity: Severity;
  cvss: number;
  affected: string[];
  date: string;
  type: string;
  mitigation: string;
}
const VULN_PRODUCTS = [
  ["Apache HTTP Server", "2.4.x"], ["Microsoft Windows", "10/11/Server"], ["Linux Kernel", "5.x/6.x"],
  ["WordPress", "6.x"], ["OpenSSL", "3.x"], ["Cisco IOS", "XE"], ["VMware vCenter", "7/8"],
  ["Fortinet FortiOS", "7.x"], ["Atlassian Confluence", "8.x"], ["Jenkins", "2.x"],
  ["MySQL", "8.0"], ["Docker Engine", "24.x"], ["Kubernetes", "1.2x"], ["Adobe Acrobat", "23.x"],
  ["Google Chrome", "12x"], ["Mozilla Firefox", "12x"], ["Android", "12/13/14"], ["Apple macOS", "14"],
  ["PHP", "8.x"], ["Node.js", "20.x"],
];
const VULN_TYPES = [
  "Remote Code Execution", "SQL Injection", "Cross-Site Scripting", "Privilege Escalation",
  "Path Traversal", "Deserialization", "Authentication Bypass", "Buffer Overflow",
  "Server-Side Request Forgery", "Information Disclosure", "Denial of Service", "Use After Free",
];
export const VULNS_COUNT = 1000;
export function makeVuln(id: number): Vuln {
  const r = rng(id * 23 + 11);
  const [product, version] = VULN_PRODUCTS[id % VULN_PRODUCTS.length] as [string, string];
  const type = VULN_TYPES[Math.floor(r() * VULN_TYPES.length)] as string;
  const sev = SEVERITIES[Math.floor(r() * 4)] as Severity;
  const cvss =
    sev === "حرج" ? 9 + Math.round(r() * 10) / 10 : sev === "عالي" ? 7 + Math.round(r() * 19) / 10 : sev === "متوسط" ? 4 + Math.round(r() * 29) / 10 : 1 + Math.round(r() * 29) / 10;
  const year = 2019 + (id % 6);
  const month = String(1 + (id % 12)).padStart(2, "0");
  const day = String(1 + (id % 28)).padStart(2, "0");
  return {
    id,
    cve: `CVE-${year}-${String(10000 + id * 7).slice(0, 5)}`,
    name: `${type} في ${product}`,
    description: `ثغرة من نوع ${type} تصيب ${product} الإصدار ${version}. تسمح للمهاجم باستغلال معالجة غير آمنة للمدخلات، ما قد يؤدي إلى تنفيذ عمليات غير مصرح بها على النظام المستهدف عن بُعد أو محلياً حسب الإعدادات.`,
    severity: sev,
    cvss: Math.min(10, Math.round(cvss * 10) / 10),
    affected: [`${product} ${version}`, `${product} أقل من آخر تحديث أمني`],
    date: `${year}-${month}-${day}`,
    type,
    mitigation: `تحديث ${product} إلى آخر إصدار مدعوم، وتقييد الوصول الشبكي للخدمة، وتفعيل المراقبة على السجلات لرصد محاولات الاستغلال.`,
  };
}
export const allVulns = (): Vuln[] => Array.from({ length: VULNS_COUNT }, (_, i) => makeVuln(i + 1));

/* ---------------- Tools ---------------- */
export interface Tool {
  id?: number;
  name: string;
  category: string;
  description: string;
  url: string;
  price?: number;
}
export const TOOLS: Tool[] = [
  ["Kali Linux", "توزيعات", "توزيعة لينكس متخصصة في اختبار الاختراق تضم أكثر من 600 أداة أمنية.", "https://www.kali.org/get-kali/"],
  ["Parrot OS", "توزيعات", "توزيعة أمنية خفيفة للاختبار والخصوصية والتحقيق الجنائي.", "https://parrotsec.org/download/"],
  ["BlackArch", "توزيعات", "توزيعة مبنية على Arch تضم آلاف أدوات الاختراق.", "https://blackarch.org/downloads.html"],
  ["Burp Suite", "ويب", "المنصة الأشهر لاختبار أمان تطبيقات الويب واعتراض الطلبات.", "https://portswigger.net/burp/communitydownload"],
  ["OWASP ZAP", "ويب", "بروكسي مفتوح المصدر لفحص ثغرات الويب آلياً.", "https://www.zaproxy.org/download/"],
  ["Metasploit", "استغلال", "إطار عمل شامل لتطوير وتنفيذ الاستغلالات.", "https://www.metasploit.com/download"],
  ["Wireshark", "شبكات", "محلل حزم الشبكة الأقوى لتحليل الترافيك.", "https://www.wireshark.org/download.html"],
  ["Nmap", "شبكات", "ماسح المنافذ والخدمات القياسي في الصناعة.", "https://nmap.org/download.html"],
  ["Masscan", "شبكات", "ماسح منافذ فائق السرعة يمسح الإنترنت كامل.", "https://github.com/robertdavidgraham/masscan"],
  ["John the Ripper", "كلمات مرور", "أداة كسر كلمات المرور الكلاسيكية متعددة الصيغ.", "https://www.openwall.com/john/"],
  ["Hashcat", "كلمات مرور", "أسرع أداة كسر هاشات باستخدام كرت الشاشة.", "https://hashcat.net/hashcat/"],
  ["Hydra", "كلمات مرور", "أداة Brute Force للخدمات الشبكية المختلفة.", "https://github.com/vanhauser-thc/thc-hydra"],
  ["Medusa", "كلمات مرور", "أداة تخمين بيانات اعتماد متوازية وسريعة.", "https://github.com/jmk-foofus/medusa"],
  ["SQLMap", "ويب", "أداة أوتوماتيكية لاكتشاف واستغلال ثغرات حقن SQL.", "https://sqlmap.org/"],
  ["Aircrack-ng", "لاسلكي", "حزمة كاملة لتدقيق أمان الشبكات اللاسلكية.", "https://www.aircrack-ng.org/downloads.html"],
  ["Wifite", "لاسلكي", "أداة آلية لمهاجمة الشبكات اللاسلكية.", "https://github.com/derv82/wifite2"],
  ["Kismet", "لاسلكي", "كاشف شبكات لاسلكية ونظام كشف تسلل.", "https://www.kismetwireless.net/download/"],
  ["Bettercap", "شبكات", "سكين الجيش السويسري لهجمات الشبكات و MITM.", "https://www.bettercap.org/installation/"],
  ["Ettercap", "شبكات", "أداة كلاسيكية لهجمات الرجل في المنتصف.", "https://www.ettercap-project.org/downloads.html"],
  ["Maltego", "OSINT", "منصة رسم علاقات المعلومات المفتوحة المصدر.", "https://www.maltego.com/downloads/"],
  ["theHarvester", "OSINT", "جمع الإيميلات والنطاقات الفرعية من مصادر عامة.", "https://github.com/laramies/theHarvester"],
  ["Shodan", "OSINT", "محرك بحث الأجهزة المتصلة بالإنترنت.", "https://www.shodan.io/"],
  ["Recon-ng", "OSINT", "إطار استطلاع كامل بواجهة شبيهة بـ Metasploit.", "https://github.com/lanmaster53/recon-ng"],
  ["SpiderFoot", "OSINT", "أتمتة كاملة لجمع المعلومات عن الهدف.", "https://github.com/smicallef/spiderfoot"],
  ["Nikto", "ويب", "ماسح خوادم الويب للثغرات والإعدادات الخاطئة.", "https://github.com/sullo/nikto"],
  ["Gobuster", "ويب", "أداة سريعة لاكتشاف المسارات والنطاقات الفرعية.", "https://github.com/OJ/gobuster"],
  ["Dirbuster", "ويب", "اكتشاف الملفات والمجلدات المخفية على الخوادم.", "https://www.kali.org/tools/dirbuster/"],
  ["Feroxbuster", "ويب", "أداة Content Discovery مكتوبة بلغة Rust.", "https://github.com/epi052/feroxbuster"],
  ["Subfinder", "استطلاع", "اكتشاف النطاقات الفرعية بسرعة عالية.", "https://github.com/projectdiscovery/subfinder"],
  ["Amass", "استطلاع", "رسم خريطة السطح الهجومي الخارجي للمؤسسات.", "https://github.com/owasp-amass/amass"],
  ["Nuclei", "استطلاع", "فحص الثغرات بقوالب مجتمعية قابلة للتخصيص.", "https://github.com/projectdiscovery/nuclei"],
  ["httpx", "استطلاع", "فحص سريع لخدمات HTTP وجمع البصمات.", "https://github.com/projectdiscovery/httpx"],
  ["Ffuf", "ويب", "أداة Fuzzing سريعة جداً لمسارات ومعاملات الويب.", "https://github.com/ffuf/ffuf"],
  ["Wfuzz", "ويب", "إطار Fuzzing مرن لتطبيقات الويب.", "https://github.com/xmendez/wfuzz"],
  ["Responder", "شبكات", "التقاط بيانات الاعتماد عبر تسميم LLMNR/NBT-NS.", "https://github.com/lgandx/Responder"],
  ["Mimikatz", "ويندوز", "استخراج بيانات الاعتماد من ذاكرة ويندوز.", "https://github.com/gentilkiwi/mimikatz"],
  ["BloodHound", "ويندوز", "تحليل مسارات الهجوم داخل Active Directory.", "https://github.com/SpecterOps/BloodHound"],
  ["CrackMapExec", "ويندوز", "أداة ما بعد الاستغلال لشبكات ويندوز.", "https://github.com/byt3bl33d3r/CrackMapExec"],
  ["Impacket", "ويندوز", "مكتبة بايثون لبروتوكولات الشبكة وهجمات AD.", "https://github.com/fortra/impacket"],
  ["Cobalt Strike", "Red Team", "منصة محاكاة الخصوم التجارية للفرق الحمراء.", "https://www.cobaltstrike.com/"],
  ["Empire", "Red Team", "إطار ما بعد الاستغلال بـ PowerShell و Python.", "https://github.com/BC-SECURITY/Empire"],
  ["Sliver", "Red Team", "إطار C2 حديث ومفتوح المصدر.", "https://github.com/BishopFox/sliver"],
  ["Covenant", "Red Team", "إطار C2 مبني على .NET.", "https://github.com/cobbr/Covenant"],
  ["Ghidra", "هندسة عكسية", "أداة NSA مفتوحة المصدر للهندسة العكسية.", "https://ghidra-sre.org/"],
  ["IDA Free", "هندسة عكسية", "المفكك الأشهر لتحليل الملفات التنفيذية.", "https://hex-rays.com/ida-free/"],
  ["x64dbg", "هندسة عكسية", "مصحح أخطاء مفتوح المصدر لويندوز.", "https://x64dbg.com/"],
  ["Radare2", "هندسة عكسية", "إطار كامل للهندسة العكسية من الطرفية.", "https://rada.re/n/"],
  ["Volatility", "تحقيق جنائي", "تحليل صور الذاكرة واستخراج الأدلة.", "https://www.volatilityfoundation.org/releases"],
  ["Autopsy", "تحقيق جنائي", "منصة تحقيق جنائي رقمي بواجهة رسومية.", "https://www.autopsy.com/download/"],
  ["Sleuth Kit", "تحقيق جنائي", "أدوات سطر أوامر لتحليل أنظمة الملفات.", "https://www.sleuthkit.org/sleuthkit/download.php"],
  ["Binwalk", "تحقيق جنائي", "تحليل واستخراج محتويات ملفات الفيرموير.", "https://github.com/ReFirmLabs/binwalk"],
  ["GoPhish", "هندسة اجتماعية", "منصة إدارة حملات التصيّد الاحتيالي.", "https://getgophish.com/"],
  ["SET", "هندسة اجتماعية", "Social Engineer Toolkit لهجمات العنصر البشري.", "https://github.com/trustedsec/social-engineer-toolkit"],
  ["Evilginx2", "هندسة اجتماعية", "بروكسي تصيّد متقدم يتجاوز المصادقة الثنائية.", "https://github.com/kgretzky/evilginx2"],
  ["OpenVAS", "فحص ثغرات", "ماسح ثغرات مفتوح المصدر للمؤسسات.", "https://openvas.org/"],
  ["Nessus", "فحص ثغرات", "ماسح الثغرات التجاري الأشهر.", "https://www.tenable.com/downloads/nessus"],
  ["Pacu", "سحابة", "إطار استغلال بيئات AWS.", "https://github.com/RhinoSecurityLabs/pacu"],
  ["ScoutSuite", "سحابة", "تدقيق أمان متعدد المزودين السحابيين.", "https://github.com/nccgroup/ScoutSuite"],
  ["Trivy", "سحابة", "فحص ثغرات الحاويات والبنية التحتية ككود.", "https://github.com/aquasecurity/trivy"],
  ["Hashid", "مساعدة", "التعرف على نوع الهاش تلقائياً.", "https://github.com/psypanda/hashID"],
  ["CyberChef", "مساعدة", "سكين الجيش السويسري للتشفير والترميز.", "https://gchq.github.io/CyberChef/"],
  ["Proxychains", "مساعدة", "تمرير أي أداة عبر سلسلة بروكسيات.", "https://github.com/haad/proxychains"],
].map((t) => ({ name: t[0] as string, category: t[1] as string, description: t[2] as string, url: t[3] as string }));

export const TOOL_CATEGORIES = Array.from(new Set(TOOLS.map((t) => t.category)));

/* ---------------- Mobile apps ---------------- */
export interface App {
  id?: number;
  name: string;
  platform: string;
  description: string;
  url: string;
  category?: string;
}
export const APPS: App[] = [
  ["Termux", "Android", "طرفية لينكس كاملة على الأندرويد لتشغيل أدوات الاختراق.", "https://f-droid.org/packages/com.termux/"],
  ["NetHunter", "Android", "نسخة Kali Linux الرسمية للهواتف مع دعم هجمات لاسلكية.", "https://www.kali.org/get-kali/#kali-mobile"],
  ["zANTI", "Android", "أداة تدقيق شبكات محمولة لاختبار أمان الشبكة.", "https://www.zimperium.com/zanti-mobile-penetration-testing/"],
  ["Fing", "Android / iOS", "ماسح شبكات لاكتشاف الأجهزة والمنافذ المفتوحة.", "https://www.fing.com/products/fing-app"],
  ["WiFi Analyzer", "Android", "تحليل قنوات وإشارات الشبكات اللاسلكية حولك.", "https://f-droid.org/packages/com.vrem.wifianalyzer/"],
  ["Termius", "Android / iOS", "عميل SSH احترافي لإدارة السيرفرات من الجوال.", "https://termius.com/download"],
  ["Orbot", "Android", "توجيه ترافيك الجهاز عبر شبكة Tor للخصوصية.", "https://guardianproject.info/apps/org.torproject.android/"],
  ["Aegis Authenticator", "Android", "تطبيق مصادقة ثنائية مفتوح المصدر ومشفّر.", "https://getaegis.app/"],
  ["Bitwarden", "Android / iOS", "مدير كلمات مرور مفتوح المصدر ومشفّر بالكامل.", "https://bitwarden.com/download/"],
  ["Signal", "Android / iOS", "مراسلة مشفّرة طرف لطرف بمعايير أمنية عالية.", "https://signal.org/download/"],
  ["Hacker's Keyboard", "Android", "لوحة مفاتيح كاملة بأزرار Ctrl و Esc للطرفية.", "https://f-droid.org/packages/org.pocketworkstation.pckeyboard/"],
  ["PortDroid", "Android", "مجموعة أدوات تحليل شبكات ومسح منافذ.", "https://play.google.com/store/apps/details?id=com.stealthcopter.portdroid"],
].map((t) => ({ name: t[0] as string, platform: t[1] as string, description: t[2] as string, url: t[3] as string }));
