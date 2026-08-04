import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  type Video,
  type Vuln,
} from "@/lib/data";

/** المحتوى المُضاف من لوحة الإدارة يأخذ معرفات فوق هذا الرقم حتى لا يتعارض مع المحتوى الأساسي. */
export const CMS_ID_OFFSET = 1_000_000;

export const CMS_KINDS = ["course", "port", "video", "vuln", "tool"] as const;
export type CmsKind = (typeof CMS_KINDS)[number];

export const KIND_LABELS: Record<CmsKind, string> = {
  course: "الدورات",
  port: "البورتات",
  video: "الفيديوهات",
  vuln: "الثغرات",
  tool: "الأدوات",
};

export type CmsData = Record<string, unknown>;

export interface CmsRow {
  id: string;
  seq: number;
  kind: CmsKind;
  data: CmsData;
  published: boolean;
  created_at: string;
}

export type FieldType = "text" | "textarea" | "number" | "select" | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
}

export const FIELDS: Record<CmsKind, FieldDef[]> = {
  course: [
    { key: "title", label: "عنوان الدورة", type: "text", required: true },
    { key: "category", label: "التصنيف", type: "select", options: COURSE_CATEGORIES },
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
    id: CMS_ID_OFFSET + row.seq,
    title: str(d["title"], "دورة جديدة"),
    category: str(d["category"], COURSE_CATEGORIES[0] as string),
    description: str(d["description"]),
    price: num(d["price"], 0),
    level: (LEVELS.includes(d["level"] as Level) ? d["level"] : LEVELS[0]) as Level,
    hours: num(d["hours"], 1),
    rating: num(d["rating"], 5),
    students: num(d["students"], 0),
    instructor: str(d["instructor"], "Magrm"),
    lessons: num(d["lessons"], 1),
    curriculum: [
      { title: "الوحدة 1: المحتوى", items: ["مقدمة الدورة", "المحاور الأساسية", "التطبيق العملي", "الخاتمة"] },
    ],
  };
}

export function rowToPort(row: CmsRow): Port {
  const d = row.data;
  return {
    id: CMS_ID_OFFSET + row.seq,
    name: str(d["name"], "بورت جديد"),
    description: str(d["description"]),
    price: num(d["price"], 0),
    level: (LEVELS.includes(d["level"] as Level) ? d["level"] : LEVELS[0]) as Level,
    objective: str(d["objective"], "الوصول إلى العلم النهائي وتوثيق كل خطوة في تقرير احترافي."),
    tools: list(d["tools"]),
    flags: num(d["flags"], 1),
  };
}

export function rowToVideo(row: CmsRow): Video {
  const d = row.data;
  return {
    id: CMS_ID_OFFSET + row.seq,
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
  return {
    id: CMS_ID_OFFSET + row.seq,
    cve: str(d["cve"], "CVE-0000-0000"),
    name: str(d["name"], "ثغرة جديدة"),
    description: str(d["description"]),
    severity: (SEVERITIES.includes(d["severity"] as Severity) ? d["severity"] : "متوسط") as Severity,
    cvss: num(d["cvss"], 5),
    affected: list(d["affected"]),
    date: str(d["date"], new Date().toISOString().slice(0, 10)),
    type: str(d["type"], "غير محدد"),
    mitigation: str(d["mitigation"], "تحديث النظام المتأثر إلى آخر إصدار مدعوم."),
  };
}

export function rowToTool(row: CmsRow): Tool {
  const d = row.data;
  return {
    name: str(d["name"], "أداة"),
    category: str(d["category"], "أخرى"),
    description: str(d["description"]),
    url: str(d["url"], "#"),
  };
}

export async function fetchCmsRows(kind: CmsKind): Promise<CmsRow[]> {
  const { data, error } = await supabase
    .from("cms_items")
    .select("id, seq, kind, data, published, created_at")
    .eq("kind", kind)
    .order("seq", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CmsRow[];
}

export async function fetchCmsRowBySeq(kind: CmsKind, seq: number): Promise<CmsRow | null> {
  const { data, error } = await supabase
    .from("cms_items")
    .select("id, seq, kind, data, published, created_at")
    .eq("kind", kind)
    .eq("seq", seq)
    .maybeSingle();
  if (error) return null;
  return (data as unknown as CmsRow) ?? null;
}

export function useCmsRows(kind: CmsKind) {
  return useQuery({
    queryKey: ["cms", kind],
    queryFn: () => fetchCmsRows(kind),
    staleTime: 30_000,
  });
}

export function useCmsCourses(): Course[] {
  const { data } = useCmsRows("course");
  return (data ?? []).filter((r) => r.published).map(rowToCourse);
}
export function useCmsPorts(): Port[] {
  const { data } = useCmsRows("port");
  return (data ?? []).filter((r) => r.published).map(rowToPort);
}
export function useCmsVideos(): Video[] {
  const { data } = useCmsRows("video");
  return (data ?? []).filter((r) => r.published).map(rowToVideo);
}
export function useCmsVulns(): Vuln[] {
  const { data } = useCmsRows("vuln");
  return (data ?? []).filter((r) => r.published).map(rowToVuln);
}
export function useCmsTools(): Tool[] {
  const { data } = useCmsRows("tool");
  return (data ?? []).filter((r) => r.published).map(rowToTool);
}
