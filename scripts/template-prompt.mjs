#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX } from "./lib/brief.mjs";
import { buildClonePrompt, discoverRoutes } from "./lib/clone.mjs";
import { canonicalSlug, docsPaths, resolveSite, templateRel } from "./lib/paths.mjs";

function printUsage() {
  console.log(`
Uso:
  pnpm plantilla:prompt <url> <slug> [opciones]

Descubre las rutas de <url> (sitemap.xml, robots.txt y enlaces de la portada, sin variantes de
idioma) y genera el prompt manual para clonarla como plantilla en una sesión de Claude: el modelo
hace la rama, el esqueleto, el clon, la verificación y los commits. Por defecto lo copia al
portapapeles. Para hacerlo todo sin supervisión usa pnpm plantilla:clonar.

Opciones:
  --no-copy        No copiar al portapapeles (solo imprimir)
  --out <archivo>  Guardar el prompt en un archivo
  -h, --help       Mostrar esta ayuda
`);
}

function fail(message) {
  console.error(`\x1b[31m✖ Error: ${message}\x1b[0m`);
  process.exit(1);
}

function parseArgs(argv) {
  const result = { url: "", slug: "", copy: true, out: "", help: false };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--no-copy") {
      result.copy = false;
    } else if (arg === "--out") {
      result.out = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (!arg.startsWith("--")) {
      positional.push(arg.trim());
    } else {
      fail(`opción no reconocida: ${arg}`);
    }
  }
  [result.url = "", result.slug = ""] = positional;
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.url || !args.slug) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }
  if (!/^https?:\/\//.test(args.url)) {
    fail(`la URL "${args.url}" debe empezar por http(s)://.`);
  }
  if (!KEBAB_CASE_REGEX.test(args.slug) || canonicalSlug(args.slug) !== args.slug) {
    fail(`el slug "${args.slug}" debe ser kebab-case y sin el prefijo "plantilla-".`);
  }
  if (resolveSite(args.slug)) {
    fail(`ya existe un sitio "${args.slug}" (${resolveSite(args.slug).rel}).`);
  }

  const discovery = await discoverRoutes(args.url);
  if (!discovery.reachable) {
    fail(`no se pudo descargar ${args.url}.`);
  }

  const prompt = buildClonePrompt({
    url: args.url,
    slug: args.slug,
    routesFile: `${docsPaths(templateRel(args.slug)).docs}/routes.json`,
    routes: discovery.routes,
    localeRoutes: discovery.localeRoutes,
    manual: true,
  });
  process.stdout.write(`${prompt}\n`);

  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), prompt);
  }
  if (args.copy) {
    const result = spawnSync("pbcopy", { input: prompt });
    if (result.error || result.status !== 0) {
      console.error("Aviso: no pude copiar al portapapeles (pbcopy no disponible).");
    }
  }
  console.error(
    `\nPrompt generado para ${args.slug}: ${discovery.routes.length} rutas${
      discovery.localeRoutes.length > 0
        ? ` (${discovery.localeRoutes.length} variantes de idioma excluidas)`
        : ""
    }.${args.copy ? " Copiado al portapapeles." : ""}`
  );
}

main();
