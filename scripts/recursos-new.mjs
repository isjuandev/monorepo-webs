#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, RECURSOS_DIR, ROOT_DIR } from "./lib/brief.mjs";

const TEMPLATE_DIR = path.join(RECURSOS_DIR, "_plantilla-cliente");

function fail(message) {
  console.error(`\x1b[31m✖ Error: ${message}\x1b[0m`);
  process.exit(1);
}

const slug = (process.argv[2] ?? "").trim();
if (!slug || slug === "--help" || slug === "-h") {
  console.log(`
Uso:
  pnpm recursos:new <slug-cliente>

Crea recursos/<slug-cliente>/ desde recursos/_plantilla-cliente/ con el slug ya escrito en el brief.
Después rellena brief.md, deja las fotos y la marca en sus carpetas y lanza pnpm client:run <slug-cliente>.
`);
  process.exit(slug ? 0 : 1);
}
if (!KEBAB_CASE_REGEX.test(slug)) {
  fail(`el slug "${slug}" no es kebab-case válido.`);
}

const target = path.join(RECURSOS_DIR, slug);
if (fs.existsSync(target)) {
  fail(`ya existe ${path.relative(ROOT_DIR, target)}/.`);
}

fs.cpSync(TEMPLATE_DIR, target, {
  recursive: true,
  filter: (source) => path.basename(source) !== ".gitkeep",
});

const briefPath = path.join(target, "brief.md");
const brief = fs.readFileSync(briefPath, "utf8");
fs.writeFileSync(
  briefPath,
  brief.replace(/^- Slug \(kebab-case\):.*$/m, `- Slug (kebab-case): ${slug}`)
);

console.log(
  `✔ Creado ${path.relative(ROOT_DIR, target)}/. Rellena brief.md y añade fotos y marca.`
);
