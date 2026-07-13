#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "..", "src", "server.ts"), "utf8");

const TOOL_RE = /server\.tool\(\s*"([a-z_0-9]+)"\s*,\s*("(?:[^"\\]|\\.)*")/g;

const MIN_CHARS = 200;
const REQUIRED_MARKERS = ["use ", "use this", "use to", "use after", "use before", "use when", "use for", "instead", "after "];

const failures = [];
let count = 0;

for (const m of src.matchAll(TOOL_RE)) {
  count++;
  const name = m[1];
  const description = JSON.parse(m[2]);
  const lower = description.toLowerCase();

  if (description.length < MIN_CHARS) {
    failures.push(`  ${name}: ${description.length} chars (min ${MIN_CHARS})`);
    continue;
  }
  if (!REQUIRED_MARKERS.some((marker) => lower.includes(marker))) {
    failures.push(`  ${name}: missing usage-guidance marker (one of: ${REQUIRED_MARKERS.join(", ")})`);
  }
}

if (count === 0) {
  console.error("lint-tool-descriptions: no tool registrations found — regex may be broken");
  process.exit(2);
}

if (failures.length) {
  console.error(`lint-tool-descriptions: ${failures.length} of ${count} tools fail the Glama rubric:`);
  for (const f of failures) console.error(f);
  console.error("\nSee CONTRIBUTING.md for the description template.");
  process.exit(1);
}

console.log(`lint-tool-descriptions: ${count} tools pass.`);
