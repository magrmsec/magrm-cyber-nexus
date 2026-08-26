import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SECURITY_APP_CATALOG } from "@/lib/security-app-catalog";
import { SECURITY_TOOL_CATALOG } from "@/lib/security-tool-catalog";
import { SECURITY_PORT_CATALOG } from "@/lib/security-port-catalog";
import { PREMIUM_COURSE_PRICES } from "@/lib/premium-course-prices";
import { SECURITY_VULNERABILITY_CATALOG } from "@/lib/security-vulnerability-catalog";
import { VERIFIED_VULNERABILITY_LABS } from "@/lib/verified-vulnerability-labs";
import { VERIFIED_VULHUB_LABS } from "@/lib/verified-vulnerability-labs-vulhub";

import {
  COURSE_CATEGORIES,
  LEVELS,
  SEVERITIES,
  VIDEO_CATEGORIES,
  type Course,
  type Level,
  type Port,
  type Severity,
  type Tool,
  type App as AppItem,
  type Video,
  type Vuln,
} from "@/lib/data";

/** كل المحتوى يأتي من قاعدة البيانات؛ معرف العنصر هو رقم التسلسل (seq). */

export const CMS_KINDS = ["course", "port", "video", "vuln", "tool", "app"] as const;
export type CmsKind = (typeof CMS_KINDS)[number];

export const KIND_LABELS: Record<CmsKind, string> = {
  course: "الدورات",
  port: "البورتات",
  video: "الفيديوهات",
  vuln: "الثغرات",
  tool: "الأدوات",
  app: "التطبيقات",
};

export type CmsData = Record<string, unknown>;

export interface CmsRow {
  id: string;
  seq: number;
  kind: CmsKind;
  data: CmsData;
  published: boolean;
  created_at: string;
  source?: "database" | "catalog";
}

export type FieldType = "text" | "textarea" | "number" | "select" | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
}

/** الأقسام الرئيسية الاثنا عشر لمحتوى الدورات. */
export const SECTIONS = [
  "الأساسيات",
  "أمن الشبكات",
  "أمن تطبيقات الويب",
  "أمن الأنظمة",
  "التشفير",
  "الهندسة العكسية",
  "التحليل الجنائي الرقمي",
  "أمن الجوّال",
  "أمن السحابة",
  "الهندسة الاجتماعية والوعي",
  "الحوكمة والامتثال",
  "الأدوات",
] as const;

export const FIELDS: Record<CmsKind, FieldDef[]> = {
  course: [
    { key: "title", label: "عنوان الدورة", type: "text", required: true },
    { key: "category", label: "القسم", type: "select", options: SECTIONS },
    { key: "level", label: "المستوى", type: "select", options: LEVELS },

    { key: "description", label: "الوصف", type: "textarea", required: true },
    { key: "price", label: "السعر ($)", type: "number" },
    { key: "hours", label: "عدد الساعات", type: "number" },
    { key: "lessons", label: "عدد الدروس", type: "number" },
    { key: "rating", label: "التقييم (من 5)", type: "number" },
    { key: "students", label: "عدد الطلاب", type: "number" },
    { key: "instructor", label: "المدرب", type: "text" },
  ],
  port: [
    { key: "name", label: "اسم البورت", type: "text", required: true },
    { key: "level", label: "المستوى", type: "select", options: LEVELS },
    { key: "description", label: "الوصف", type: "textarea", required: true },
    { key: "objective", label: "الهدف", type: "textarea" },
    { key: "tools", label: "الأدوات (افصل بفاصلة)", type: "list" },
    { key: "price", label: "السعر ($)", type: "number" },
    { key: "flags", label: "عدد الأعلام", type: "number" },
  ],
  video: [
    { key: "title", label: "عنوان الفيديو", type: "text", required: true },
    { key: "youtubeId", label: "معرف يوتيوب (YouTube ID)", type: "text", required: true },
    { key: "category", label: "التصنيف", type: "select", options: VIDEO_CATEGORIES },
    { key: "level", label: "المستوى", type: "select", options: LEVELS },
    { key: "description", label: "الوصف", type: "textarea" },
    { key: "minutes", label: "المدة (دقيقة)", type: "number" },
  ],
  vuln: [
    { key: "cve", label: "رقم CVE", type: "text", required: true },
    { key: "name", label: "اسم الثغرة", type: "text", required: true },
    { key: "severity", label: "الخطورة", type: "select", options: SEVERITIES },
    { key: "cvss", label: "درجة CVSS", type: "number" },
    { key: "type", label: "نوع الثغرة", type: "text" },
    { key: "date", label: "التاريخ (YYYY-MM-DD)", type: "text" },
    { key: "description", label: "الوصف", type: "textarea", required: true },
    { key: "affected", label: "الأنظمة المتأثرة (افصل بفاصلة)", type: "list" },
    { key: "mitigation", label: "طريقة الحماية", type: "textarea" },
  ],
  tool: [
    { key: "name", label: "اسم الأداة", type: "text", required: true },
    { key: "category", label: "التصنيف", type: "text", required: true },
    { key: "description", label: "الوصف", type: "textarea", required: true },
    { key: "url", label: "رابط التحميل", type: "text", required: true },
  ],
  app: [
    { key: "name", label: "اسم التطبيق", type: "text", required: true },
    { key: "platform", label: "المنصة", type: "text", required: true },
    { key: "description", label: "الوصف", type: "textarea", required: true },
    { key: "url", label: "رابط التحميل", type: "text", required: true },
  ],
};

const str = (v: unknown, fallback = ""): string => (typeof v === "string" && v.trim() ? v : fallback);
const num = (v: unknown, fallback: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);

export function rowToCourse(row: CmsRow): Course {
  const d = row.data;
  return {
    id: row.seq,
    title: str(d["title"], "دورة جديدة"),
    category: str(d["category"], COURSE_CATEGORIES[0] as string),
    description: str(d["description"]),
    price: PREMIUM_COURSE_PRICES[row.seq] ?? num(d["price"], 0),
    level: (LEVELS.includes(d["level"] as Level) ? d["level"] : LEVELS[0]) as Level,
    hours: num(d["hours"], 1),
    rating: num(d["rating"], 5),
    students: num(d["students"], 0),
    instructor: str(d["instructor"], "Magrm"),
    lessons: num(d["lessons"], 1),
    curriculum: Array.isArray(d["curriculum"]) && d["curriculum"].length
      ? (d["curriculum"] as { title: string; items: string[] }[])
      : [
          { title: "الوحدة 1: الأساسيات", items: ["مقدمة الدورة", "تجهيز بيئة المختبر", "المفاهيم الأساسية", "أخلاقيات العمل الأمني"] },
          { title: "الوحدة 2: الأدوات", items: ["الأدوات الأساسية", "الأتمتة بالسكربتات", "التعامل مع النتائج", "تجنب الاكتشاف"] },
          { title: "الوحدة 3: التطبيق العملي", items: ["مختبر عملي 1", "مختبر عملي 2", "سيناريو هجوم كامل", "تحليل النتائج"] },
          { title: "الوحدة 4: الاحتراف", items: ["كتابة التقرير الأمني", "الإجراءات الوقائية", "دراسات حالة", "الاختبار النهائي"] },
        ],
  };
}

const LEGACY_PORT_PRICES: Record<number, number> = {
  1002: 179,
  1003: 239,
  1004: 219,
  1005: 199,
  1006: 229,
  1007: 249,
  1008: 289,
  1009: 269,
  1010: 259,
  1011: 239,
  1012: 219,
  1013: 229,
  1014: 199,
  1015: 249,
  1016: 239,
  1017: 219,
  1018: 259,
  1019: 229,
  1020: 279,
  1021: 299,
};

export function rowToPort(row: CmsRow): Port {
  const d = row.data;
  return {
    id: row.seq,
    name: str(d["name"], "بورت جديد"),
    description: str(d["description"]),
    price: LEGACY_PORT_PRICES[row.seq] ?? num(d["price"], 150),
    level: "متقدم",
    objective: str(d["objective"], "الوصول إلى العلم النهائي وتوثيق كل خطوة في تقرير احترافي."),
    tools: list(d["tools"]),
    flags: num(d["flags"], 1),
  };
}

export function rowToVideo(row: CmsRow): Video {
  const d = row.data;
  return {
    id: row.seq,
    title: str(d["title"], "فيديو جديد"),
    description: str(d["description"]),
    minutes: num(d["minutes"], 10),
    category: str(d["category"], VIDEO_CATEGORIES[0] as string),
    level: (LEVELS.includes(d["level"] as Level) ? d["level"] : LEVELS[0]) as Level,
    youtubeId: str(d["youtubeId"]),
  };
}

export function rowToVuln(row: CmsRow): Vuln {
  const d = row.data;
  const cvss = num(d["cvss"], 5);
  const storedPrice = num(d["price"], 0);
  const isFreeLab = Boolean(str(d["downloadUrl"]) || str(d["downloadPath"]));
  const price = isFreeLab ? 0 : storedPrice > 0 ? storedPrice : cvss >= 9 ? 999 : cvss >= 7 ? 499 : 0;
  return {
    id: row.seq,
    cve: str(d["cve"], "CVE-0000-0000"),
    name: str(d["name"], "ثغرة جديدة"),
    description: str(d["description"]),
    severity: (SEVERITIES.includes(d["severity"] as Severity) ? d["severity"] : "متوسط") as Severity,
    cvss,
    affected: list(d["affected"]),
    date: str(d["date"], new Date().toISOString().slice(0, 10)),
    type: str(d["type"], "غير محدد"),
    mitigation: str(d["mitigation"], "تحديث النظام المتأثر إلى آخر إصدار مدعوم."),
    ...(price > 0 ? { price } : {}),
    ...(str(d["downloadUrl"]) ? { downloadUrl: str(d["downloadUrl"]) } : {}),
    ...(str(d["downloadPath"]) ? { downloadPath: str(d["downloadPath"]) } : {}),
    ...(str(d["downloadName"]) ? { downloadName: str(d["downloadName"]) } : {}),
    ...(str(d["labSource"]) ? { labSource: str(d["labSource"]) } : {}),
    ...(num(d["fileBytes"], 0) > 0 ? { fileBytes: num(d["fileBytes"], 0) } : {}),
  };
}

export function rowToTool(row: CmsRow): Tool {
  const d = row.data;
  return {
    id: row.seq,
    name: str(d["name"], "أداة"),
    category: str(d["category"], "أخرى"),
    description: str(d["description"]),
    url: str(d["url"], "#"),
  };
}

const PAGE = 1000;

/** يجلب كل صفوف النوع المطلوب (مع تقسيم داخلي لتجاوز حد 1000 صف). */
export function rowToApp(row: CmsRow): AppItem {
  const d = row.data;
  return {
    id: row.seq,
    name: str(d["name"], "تطبيق"),
    platform: str(d["platform"], "Android"),
    description: str(d["description"]),
    url: str(d["url"], "#"),
  };
}

export async function fetchCmsRows(kind: CmsKind): Promise<CmsRow[]> {
  const all: CmsRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("cms_items")
      .select("id, seq, kind, data, published, created_at")
      .eq("kind", kind)
      .eq("published", true)
      .order("seq", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const rows = (data ?? []) as unknown as CmsRow[];
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
}

export async function fetchCmsRowBySeq(kind: CmsKind, seq: number): Promise<CmsRow | null> {
  if (kind === "port") {
    const item = SECURITY_PORT_CATALOG.find((p) => p.id === seq);
    if (item) {
      return { id: `port-catalog-${item.id}`, seq: item.id, kind: "port", data: item as unknown as CmsData, published: true, created_at: new Date().toISOString() };
    }
  }
  if (kind === "vuln") {
    const vulhubLab = VERIFIED_VULHUB_LABS.find((v) => v.id === seq);
    if (vulhubLab) {
      return { id: `vulhub-lab-${vulhubLab.id}`, seq: vulhubLab.id, kind: "vuln", data: vulhubLab as unknown as CmsData, published: true, created_at: vulhubLab.date };
    }
    const lab = VERIFIED_VULNERABILITY_LABS.find((v) => v.id === seq);
    if (lab) {
      return { id: `verified-lab-${lab.id}`, seq: lab.id, kind: "vuln", data: lab as unknown as CmsData, published: true, created_at: lab.date };
    }
  }
  if (kind === "vuln" && seq >= 100001) {
    const item = SECURITY_VULNERABILITY_CATALOG.find((v) => v.id === seq);
    if (item) {
      const row: CmsRow = { id: `catalog-${item.id}`, seq: item.id, kind: "vuln", data: item as unknown as CmsData, published: true, created_at: item.date };
      return (rowToVuln(row).price ?? 0) > 0 ? row : null;
    }
  }
  const { data, error } = await supabase
    .from("cms_items")
    .select("id, seq, kind, data, published, created_at")
    .eq("kind", kind)
    .eq("seq", seq)
    .eq("published", true)
    .maybeSingle();
  if (error) return null;
  const row = (data as unknown as CmsRow) ?? null;
  return row && (rowToVuln(row).price ?? 0) > 0 ? row : null;
}

export function useCmsRows(kind: CmsKind) {
  return useQuery({
    queryKey: ["cms", kind],
    queryFn: () => fetchCmsRows(kind),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useCmsCourses() {
  const q = useCmsRows("course");
  return { items: (q.data ?? []).filter((r) => r.published).map(rowToCourse), isLoading: q.isLoading };
}
export function useCmsPorts() {
  const q = useCmsRows("port");
  const cmsPorts = (q.data ?? []).filter((r) => r.published).map(rowToPort);
  const seen = new Set<string>();
  const items = [...cmsPorts, ...SECURITY_PORT_CATALOG]
    .filter((port) => {
      const key = port.name.trim().toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((port, index) => ({ ...port, id: port.id ?? index + 1 }));
  return { items, isLoading: q.isLoading };
}
export function useCmsVideos() {
  const q = useCmsRows("video");
  return { items: (q.data ?? []).filter((r) => r.published).map(rowToVideo), isLoading: q.isLoading };
}
export function useCmsVulns() {
  const q = useCmsRows("vuln");
  return { items: (q.data ?? []).filter((r) => r.published).map(rowToVuln), isLoading: q.isLoading };
}
const PREMIUM_TOOL_PRICES: Array<[string, number]> = [
  ["nessus", 4790],
  ["cobalt strike", 2500],
  ["burp suite", 499],
  ["ida pro", 1995],
  ["binary ninja", 1499],
  ["invicti", 3000],
  ["acunetix", 3000],
  ["metasploit pro", 3000],
  ["metasploit", 350],
  ["maltego", 999],
  ["qualys", 5000],
  ["crowdstrike", 2000],
  ["checkmarx", 2000],
  ["veracode", 3000],
  ["rapid7", 3000],
];
const TOOL_PRICE_STEPS = [0, 10, 20, 5, 15, 30, 10, 25, 40];
function getToolPrice(name: string, existingPrice: number | undefined, index: number) {
  const normalized = name.trim().toLocaleLowerCase();
  const premium = PREMIUM_TOOL_PRICES.find(([needle]) => normalized.includes(needle));
  return premium?.[1] ?? existingPrice ?? 100 + (TOOL_PRICE_STEPS[index % TOOL_PRICE_STEPS.length] ?? 0);
}

export function useCmsTools() {
  const q = useCmsRows("tool");
  const cmsTools = (q.data ?? []).filter((r) => r.published).map(rowToTool);
  const seen = new Set<string>();
  const items = [...cmsTools, ...SECURITY_TOOL_CATALOG]
    .filter((tool) => {
      const nameKey = tool.name.trim().toLocaleLowerCase();
      const urlKey = tool.url.trim().toLocaleLowerCase();
      if (seen.has(nameKey) || seen.has(urlKey)) return false;
      seen.add(nameKey);
      seen.add(urlKey);
      return true;
    })
    .map((tool, index) => ({ ...tool, id: tool.id ?? index + 1, price: getToolPrice(tool.name, tool.price, index) }));
  return { items, isLoading: q.isLoading };
}
export function useCmsApps() {
  const q = useCmsRows("app");
  const cmsApps = (q.data ?? []).filter((r) => r.published).map(rowToApp);
  const seen = new Set<string>();
  const items = [...cmsApps, ...SECURITY_APP_CATALOG]
    .filter((app) => {
      const nameKey = app.name.trim().toLocaleLowerCase();
      const urlKey = app.url.trim().toLocaleLowerCase();
      if (seen.has(nameKey) || seen.has(urlKey)) return false;
      seen.add(nameKey);
      seen.add(urlKey);
      return true;
    })
    .map((app, index) => ({ ...app, id: app.id ?? index + 1 }));
  return { items, isLoading: q.isLoading };
}

/* ————— جلب من الخادم بنظام "تحميل المزيد" (بدون صفحات مرقّمة) ————— */

export interface CmsFilter {
  search?: string;
  category?: string;
  level?: string;
  severity?: string;
  minPrice?: number;
  maxPrice?: number;
  pricing?: "free" | "paid";
  searchKeys?: string[];
  publishedOnly?: boolean;
}

const sel = (s: string): string => s;
const ANY = "الكل";
const clean = (s: string) => s.replace(/[,()%]/g, " ").trim();

function buildQuery(kind: CmsKind, f: CmsFilter, count?: "exact") {
  let q = supabase
    .from("cms_items")
    .select(sel("id, seq, kind, data, published, created_at"), count ? { count } : undefined)
    .eq("kind", kind);
  if (f.publishedOnly !== false) q = q.eq("published", true);
  if (f.category && f.category !== ANY) q = q.eq("data->>category", f.category);
  if (f.level && f.level !== ANY) q = q.eq("data->>level", f.level);
  if (f.severity && f.severity !== ANY) q = q.eq("data->>severity", f.severity);
  if (typeof f.minPrice === "number" && f.minPrice > 0) q = q.gte("data->price", f.minPrice);
  if (typeof f.maxPrice === "number" && Number.isFinite(f.maxPrice)) q = q.lte("data->price", f.maxPrice);
  const term = clean(f.search ?? "");
  if (term) {
    const keys = f.searchKeys?.length ? f.searchKeys : ["title", "name", "description"];
    q = q.or(keys.map((k) => `data->>${k}.ilike.%${term}%`).join(","));
  }
  return q;
}

function vulnerabilityMatchesPricing(row: CmsRow, pricing?: CmsFilter["pricing"]): boolean {
  if (!pricing) return true;
  const isPaid = (rowToVuln(row).price ?? 0) > 0;
  return pricing === "paid" ? isPaid : !isPaid;
}

function staticVulnerabilityRows(filter: CmsFilter): CmsRow[] {
  const term = clean(filter.search ?? "").toLocaleLowerCase();
  const catalog = SECURITY_VULNERABILITY_CATALOG as unknown as Vuln[];
  const paid = catalog.filter((item) => (item.price ?? 0) > 0);
  const free = [...VERIFIED_VULNERABILITY_LABS, ...VERIFIED_VULHUB_LABS];
  const mixed: Vuln[] = [];
  const paidGroupSizes = [2, 5, 2, 4, 3, 6, 3, 5, 2, 4, 6, 3];
  let paidIndex = 0;
  let freeIndex = 0;
  let groupIndex = 0;
  while (paidIndex < paid.length || freeIndex < free.length) {
    const groupSize = paidGroupSizes[groupIndex % paidGroupSizes.length] ?? 2;
    for (let i = 0; i < groupSize && paidIndex < paid.length; i += 1) mixed.push(paid[paidIndex++] as Vuln);
    const nextFree = free[freeIndex];
    if (nextFree) mixed.push(nextFree);
    freeIndex += 1;
    groupIndex += 1;
  }
  return mixed
    .filter((item) => (item.price ?? 0) > 0 || Boolean(item.downloadUrl) || Boolean(item.downloadPath))
    .filter((item) => !filter.pricing || (filter.pricing === "paid" ? (item.price ?? 0) > 0 : (item.price ?? 0) === 0))
    .filter((item) => !filter.severity || filter.severity === ANY || item.severity === filter.severity)
    .filter((item) => {
      if (!term) return true;
      const keys = filter.searchKeys?.length ? filter.searchKeys : ["cve", "name", "description"];
      return keys.some((key) => String((item as unknown as Record<string, unknown>)[key] ?? "").toLocaleLowerCase().includes(term));
    })
    .map((item) => ({ id: `catalog-${item.id}`, seq: item.id, kind: "vuln", data: item as unknown as CmsData, published: true, created_at: item.date }));
}

function interleaveVulnerabilityRows(paid: CmsRow[], free: CmsRow[]): CmsRow[] {
  const mixed: CmsRow[] = [];
  const paidGroupSizes = [2, 5, 2, 4, 3, 6, 3, 5, 2, 4, 6, 3];
  let paidIndex = 0;
  let freeIndex = 0;
  let groupIndex = 0;
  while (paidIndex < paid.length || freeIndex < free.length) {
    const groupSize = paidGroupSizes[groupIndex % paidGroupSizes.length] ?? 2;
    for (let i = 0; i < groupSize && paidIndex < paid.length; i += 1) mixed.push(paid[paidIndex++] as CmsRow);
    const nextFree = free[freeIndex];
    if (nextFree) mixed.push(nextFree);
    freeIndex += 1;
    groupIndex += 1;
  }
  return mixed;
}

async function fetchVulnerabilitySlice(f: CmsFilter, from: number, size: number): Promise<CmsRow[]> {
  const { data, error } = await buildQuery("vuln", f).order("seq", { ascending: true }).range(0, 9999);
  if (error) throw error;
  const cmsRows = ((data ?? []) as unknown as CmsRow[])
    .filter((row) => (rowToVuln(row).price ?? 0) > 0)
    .filter((row) => vulnerabilityMatchesPricing(row, f.pricing))
    .map((row) => ({ ...row, source: "database" as const }));
  const staticRows = staticVulnerabilityRows(f).map((row) => ({ ...row, source: "catalog" as const }));
  const paidRows = [...cmsRows, ...staticRows.filter((row) => (rowToVuln(row).price ?? 0) > 0)];
  const freeRows = staticRows.filter((row) => (rowToVuln(row).price ?? 0) === 0);
  return interleaveVulnerabilityRows(paidRows, freeRows).slice(from, from + size);
}

export async function fetchCmsSlice(kind: CmsKind, f: CmsFilter, from: number, size: number): Promise<CmsRow[]> {
  if (kind === "vuln") return fetchVulnerabilitySlice(f, from, size);
  const { data, error } = await buildQuery(kind, f)
    .order("seq", { ascending: true })
    .range(from, from + size - 1);
  if (error) throw error;
  return ((data ?? []) as unknown as CmsRow[]).map((row) => ({ ...row, source: "database" }));
}

function adminCatalogRows(kind: CmsKind): CmsRow[] {
  if (kind === "port") {
    return SECURITY_PORT_CATALOG.map((item, index) => ({
      id: `port-catalog-${item.id ?? index}`,
      seq: item.id ?? 2000000 + index,
      kind,
      data: item as unknown as CmsData,
      published: true,
      created_at: new Date().toISOString(),
      source: "catalog",
    }));
  }
  if (kind === "tool") {
    return SECURITY_TOOL_CATALOG.map((item, index) => ({
      id: `tool-catalog-${index}`,
      seq: 3000000 + index,
      kind,
      data: item as unknown as CmsData,
      published: true,
      created_at: new Date().toISOString(),
      source: "catalog",
    }));
  }
  if (kind === "app") {
    return SECURITY_APP_CATALOG.map((item, index) => ({
      id: `app-catalog-${index}`,
      seq: 4000000 + index,
      kind,
      data: item as unknown as CmsData,
      published: true,
      created_at: new Date().toISOString(),
      source: "catalog",
    }));
  }
  return [];
}

function adminDedupeKey(row: CmsRow): string {
  const d = row.data;
  const name = String(d["name"] ?? d["title"] ?? d["cve"] ?? row.id).trim().toLocaleLowerCase();
  const url = String(d["url"] ?? "").trim().toLocaleLowerCase();
  return url ? `${name}|${url}` : name;
}

/** قائمة الإدارة الكاملة: صفوف قاعدة البيانات أولاً ثم عناصر الكتالوجات الثابتة مع إزالة التكرار. */
export async function fetchAdminSlice(kind: CmsKind, from: number, size: number): Promise<CmsRow[]> {
  if (kind === "vuln") {
    return fetchVulnerabilitySlice({ publishedOnly: false }, from, size);
  }

  if (kind === "course" || kind === "video") {
    const { data, error } = await buildQuery(kind, { publishedOnly: false })
      .order("seq", { ascending: true })
      .range(from, from + size - 1);
    if (error) throw error;
    return ((data ?? []) as unknown as CmsRow[]).map((row) => ({ ...row, source: "database" as const }));
  }

  const { data, error } = await buildQuery(kind, { publishedOnly: false })
    .order("seq", { ascending: true })
    .range(0, 9999);
  if (error) throw error;

  const databaseRows = ((data ?? []) as unknown as CmsRow[]).map((row) => ({ ...row, source: "database" as const }));
  const seen = new Set<string>();
  const combined = [...databaseRows, ...adminCatalogRows(kind)].filter((row) => {
    const key = adminDedupeKey(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return combined.slice(from, from + size);
}

export async function countAdmin(kind: CmsKind): Promise<number> {
  if (kind === "course" || kind === "video" || kind === "vuln") {
    return countCms(kind, { publishedOnly: false });
  }
  const allRows = await fetchAdminSlice(kind, 0, 50000);
  return allRows.length;
}

export async function countCms(kind: CmsKind, f: CmsFilter = {}): Promise<number> {
  if (kind === "vuln") {
    const rows = await fetchVulnerabilitySlice(f, 0, 10000);
    return rows.length;
  }
  const { count, error } = await buildQuery(kind, f, "exact").limit(1);
  if (error) return 0;
  return count ?? 0;
}

/** تحميل تدريجي: كل دفعة تجلب `size` عنصراً إضافياً. */
export function useCmsInfinite(kind: CmsKind, filter: CmsFilter = {}, size = 24) {
  return useInfiniteQuery({
    queryKey: ["cms-slice", kind, filter, size],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchCmsSlice(kind, filter, pageParam as number, size),
    getNextPageParam: (last, pages) => (last.length < size ? undefined : pages.length * size),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useCmsCount(kind: CmsKind, filter: CmsFilter = {}) {
  return useQuery({
    queryKey: ["cms-count", kind, filter],
    queryFn: () => countCms(kind, filter),
    staleTime: 30_000,
  });
}

/** أول N عنصر منشور من نوع معيّن (للصفحة الرئيسية). */
export function useCmsPreview(kind: CmsKind, limit: number, filter: CmsFilter = {}) {
  const q = useQuery({
    queryKey: ["cms-preview", kind, limit, filter],
    queryFn: () => fetchCmsSlice(kind, filter, 0, limit),
    staleTime: 0,
  });
  return { rows: q.data ?? [], isLoading: q.isLoading };
}
