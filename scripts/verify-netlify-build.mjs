import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

if (process.env.NETLIFY !== "true") {
  console.log("Netlify build check skipped outside Netlify.");
  process.exit(0);
}

const root = process.cwd();
const dist = join(root, "dist");
const indexPath = join(dist, "index.html");

if (!existsSync(dist) || !existsSync(indexPath)) {
  console.error("Netlify build check failed: dist/index.html is missing.");
  process.exit(1);
}

const html = readFileSync(indexPath, "utf8");
const checks = [
  ["Magrm content", /Magrm/i.test(html)],
  ["SSR document", html.length > 10000],
  ["client hydration script", /<script[^>]+src=/i.test(html)],
  ["no external redirect shell", !/window\.location\.replace|meta http-equiv=[\"']refresh/i.test(html)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Netlify build check failed: ${failed.join(", ")}.`);
  process.exit(1);
}

console.log(`Netlify build check passed: ${html.length} bytes in dist/index.html.`);
