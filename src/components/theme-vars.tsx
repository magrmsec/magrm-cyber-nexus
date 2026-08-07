import { useSiteSettings, sv } from "@/lib/settings";

/** يحقن ألوان الموقع القادمة من لوحة الإعدادات فوق متغيرات الثيم. */
export function ThemeVars() {
  const { s } = useSiteSettings();
  const map: [string, string][] = [
    ["--primary", sv(s, "colorPrimary")],
    ["--ring", sv(s, "colorPrimary")],
    ["--magenta", sv(s, "colorPrimary")],
    ["--secondary", sv(s, "colorSecondary")],
    ["--background", sv(s, "colorBackground")],
    ["--card", sv(s, "colorCard")],
    ["--popover", sv(s, "colorCard")],
  ];
  const body = map
    .filter(([, v]) => /^#[0-9a-fA-F]{3,8}$/.test(v))
    .map(([k, v]) => `${k}: ${v};`)
    .join("");
  if (!body) return null;
  return <style dangerouslySetInnerHTML={{ __html: `:root{${body}}` }} />;
}
