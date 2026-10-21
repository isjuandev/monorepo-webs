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
  pnpm cliente:recursos <slug-cliente>

Crea recursos/<slug-cliente>/ desde recursos/_plantilla-cliente/ (brief vacío y carpetas) con el
slug ya escrito en el brief. Después deja todo el material del cliente en entrada/ y lanza
/nuevo-cliente <slug-cliente> en Claude Code (o pnpm cliente:crear <slug-cliente>).
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

const rel = path.relative(ROOT_DIR, target);
console.log(`✔ Creado ${rel}/.

Siguiente paso: deja en ${rel}/entrada/ todo lo que mandó el cliente (fotos con cualquier nombre,
HEIC, logo, PDF, documentos, chat de WhatsApp exportado) y ejecuta en Claude Code:

  /nuevo-cliente ${slug}
`);
