import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

if (process.env.NETLIFY !== "true") {
  console.log("Netlify build check skipped outside Netlify.");
  process.exit(0);
}

const root = process.cwd();
const dist = join(root, "dist");
const output = join(root, ".output");
const netlify = join(root, ".netlify");
const assetDirectories = [join(dist, "assets"), join(output, "public", "assets")];
const runtimeCandidates = [
  join(output, "server", "index.mjs"),
  join(netlify, "functions-internal", "server.mjs"),
  join(netlify, "functions", "server.mjs"),
];

const assetDirectory = assetDirectories.find((directory) => existsSync(directory));
const assetFiles = assetDirectory
  ? readdirSync(assetDirectory).filter((file) => /\.(js|mjs|css)$/i.test(file))
  : [];
const runtimePath = runtimeCandidates.find((file) => existsSync(file));

if (!assetDirectory || assetFiles.length === 0) {
  console.error("Netlify build check failed: no client assets were generated.");
  process.exit(1);
}

if (!runtimePath) {
  console.error("Netlify build check failed: no SSR runtime was generated.");
  process.exit(1);
}

const assetText = assetFiles
  .slice(0, 80)
  .map((file) => readFileSync(join(assetDirectory, file), "utf8"))
  .join("\n");
const runtimeText = readFileSync(runtimePath, "utf8");
const combinedText = `${assetText}\n${runtimeText}`;
const checks = [
  ["Magrm content", /Magrm|Cyber Security/i.test(combinedText)],
  ["Hackviser certificate content", /hackviser-certifications-master|Hackviser/i.test(combinedText)],
  ["SSR runtime", runtimeText.length > 5000],
  ["client assets", assetFiles.length >= 5],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Netlify build check failed: ${failed.join(", ")}.`);
  process.exit(1);
}

console.log(`Netlify build check passed: ${assetFiles.length} client assets and SSR runtime ${runtimePath}.`);
