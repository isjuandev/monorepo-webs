#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, parseBrief } from "./lib/brief.mjs";
import { buildClientPrompt } from "./lib/prompts.mjs";

function printUsage() {
  console.log(`
Uso:
  pnpm client-prompt <slug-cliente> [opciones]

Valida recursos/<slug-cliente>/brief.md y genera el prompt de creación del sitio.
El modelo lee el brief y saca todos los datos de ahí; el prompt solo lleva el slug y la rama base.
Por defecto lo copia al portapapeles. Para hacerlo todo sin supervisión usa pnpm client:run.

Opciones:
  --base <rama>    Rama desde la que se crea la rama del cliente (por defecto: main)
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
  const result = { slug: "", base: "main", copy: true, out: "", help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--no-copy") {
      result.copy = false;
    } else if (arg === "--base") {
      result.base = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (arg === "--out") {
      result.out = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (!arg.startsWith("--") && !result.slug) {
      result.slug = arg.trim();
    } else {
      fail(`opción no reconocida: ${arg}`);
    }
  }
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.slug) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }
  if (!KEBAB_CASE_REGEX.test(args.slug)) {
    fail(`el slug "${args.slug}" no es kebab-case válido.`);
  }
  if (!args.base) {
    fail("--base necesita una rama.");
  }

  const brief = parseBrief(args.slug);
  if (brief.errors.length > 0) {
    fail(brief.errors.join("\n  "));
  }

  const prompt = buildClientPrompt({ slug: args.slug, base: args.base, ...brief });
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
    `\nPrompt generado para ${args.slug} desde ${args.base}; brief validado (plantilla ${brief.plantilla}).${
      args.copy ? " Copiado al portapapeles." : ""
    }`
  );
}

main();
