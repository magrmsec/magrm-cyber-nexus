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
const runtimeArtifacts = [
  join(output, "server"),
  join(output, "nitro.json"),
  join(netlify, "functions-internal", "nitro.json"),
  join(netlify, "functions", "nitro.json"),
];

const assetDirectory = assetDirectories.find((directory) => existsSync(directory));
const assetFiles = assetDirectory
  ? readdirSync(assetDirectory).filter((file) => /\.(js|mjs|css)$/i.test(file))
  : [];
const runtimeArtifact = runtimeArtifacts.find((path) => existsSync(path));

if (!assetDirectory || assetFiles.length < 5) {
  console.error("Netlify build check failed: client assets are missing or incomplete.");
  process.exit(1);
}

const assetText = assetFiles
  .slice(0, 80)
  .map((file) => readFileSync(join(assetDirectory, file), "utf8"))
  .join("\n");
const checks = [
  ["Magrm content", /Magrm|Cyber Security/i.test(assetText)],
  ["client assets", assetFiles.length >= 5],
  ["Netlify/SSR output", Boolean(runtimeArtifact) || assetFiles.length >= 10],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Netlify build check failed: ${failed.join(", ")}.`);
  process.exit(1);
}

console.log(`Netlify build check passed: ${assetFiles.length} client assets${runtimeArtifact ? ` and output ${runtimeArtifact}` : ""}.`);
