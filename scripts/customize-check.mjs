#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITES_DIR = path.join(ROOT_DIR, "sites");
const CONFIG_PATH = path.join(ROOT_DIR, "scripts", "template-brands.json");

const TEXT_EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json"]);
const IGNORED_DIRS = new Set(["node_modules", "dist", ".astro", ".turbo", ".git"]);

function printUsage() {
  console.log(`
Uso:
  pnpm customize:check <slug-cliente> [--strict]

Detecta restos de la plantilla de origen en sites/<slug-cliente>: dominio de ejemplo,
nombres de marca, contactos placeholder e imágenes idénticas a las de la plantilla.

Opciones:
  --strict     Sale con código 1 si hay hallazgos (dominio, marca o contactos de la plantilla)
  --help, -h   Mostrar esta ayuda
`);
}

/**
 * Recorre recursivamente un directorio devolviendo rutas de archivos
 * @param {string} dir
 * @returns {string[]}
 */
function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * @param {string} filePath
 */
function hashFile(filePath) {
  return crypto.createHash("sha1").update(fs.readFileSync(filePath)).digest("hex");
}

/**
 * @param {string} value
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const argv = process.argv.slice(2);
const strict = argv.includes("--strict");
const slug = argv.find((arg) => !arg.startsWith("--") && arg !== "-h");

if (argv.includes("--help") || argv.includes("-h") || !slug) {
  printUsage();
  process.exit(argv.includes("--help") || argv.includes("-h") ? 0 : 1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const siteDir = path.join(SITES_DIR, slug);

if (!fs.existsSync(path.join(siteDir, "package.json"))) {
  console.error(`\x1b[31m✖ Error: No existe el sitio sites/${slug}.\x1b[0m`);
  process.exit(1);
}

if (slug in config.templates) {
  console.log(`ℹ sites/${slug} es una plantilla del monorepo, no un sitio de cliente: no aplica.`);
  process.exit(0);
}

// Plantilla de origen: la registra new-client-site en .template-origin; si falta, se comparan todas.
const originFile = path.join(siteDir, ".template-origin");
const origin = fs.existsSync(originFile) ? fs.readFileSync(originFile, "utf8").trim() : "";
const originNames = origin && origin in config.templates ? [origin] : Object.keys(config.templates);

const brands = [...new Set(originNames.flatMap((name) => config.templates[name].brands))];
const placeholders = [
  ...new Set([
    ...config.global.placeholders,
    ...originNames.flatMap((name) => config.templates[name].placeholders),
  ]),
];

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

// 1. Dominio de ejemplo en src/config/site.ts
const siteConfigPath = path.join(siteDir, "src", "config", "site.ts");
if (!fs.existsSync(siteConfigPath)) {
  errors.push("Falta src/config/site.ts.");
} else {
  const match = /const CLIENT_DOMAIN\s*=\s*"([^"]*)"/.exec(fs.readFileSync(siteConfigPath, "utf8"));
  const domain = match ? match[1] : "";
  if (!domain) {
    errors.push("src/config/site.ts: no se encontró CLIENT_DOMAIN.");
  } else if (config.global.domains.some((item) => domain === item || domain.endsWith(`.${item}`))) {
    errors.push(`src/config/site.ts: CLIENT_DOMAIN "${domain}" es un dominio de ejemplo.`);
  }
}

// 2. Marcas y contactos de la plantilla dentro de src/
const brandRegexes = brands.map((brand) => ({
  label: brand,
  regex: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(brand)}(?![\\p{L}\\p{N}])`, "u"),
}));
const placeholderRegexes = placeholders.map((value) => ({
  label: value,
  regex: new RegExp(escapeRegExp(value)),
}));

for (const filePath of walkFiles(path.join(siteDir, "src"))) {
  if (!TEXT_EXTENSIONS.has(path.extname(filePath))) continue;
  const relative = path.relative(siteDir, filePath);
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  lines.forEach((line, index) => {
    for (const { label, regex } of brandRegexes) {
      if (regex.test(line)) {
        errors.push(`${relative}:${index + 1} contiene la marca de la plantilla "${label}".`);
      }
    }
    for (const { label, regex } of placeholderRegexes) {
      if (regex.test(line)) {
        errors.push(`${relative}:${index + 1} contiene el dato de ejemplo "${label}".`);
      }
    }
  });
}

// 3. Imágenes y archivos de public/ idénticos a los de la plantilla de origen
const templateHashes = new Map();
for (const name of originNames) {
  const publicDir = path.join(SITES_DIR, name, "public");
  for (const filePath of walkFiles(publicDir)) {
    if (/\.(woff2?|ttf|otf)$/i.test(filePath)) continue;
    templateHashes.set(hashFile(filePath), `${name}/${path.relative(publicDir, filePath)}`);
  }
}
const identicalImages = [];
const clientPublic = path.join(siteDir, "public");
for (const filePath of walkFiles(clientPublic)) {
  if (/\.(woff2?|ttf|otf)$/i.test(filePath)) continue;
  if (templateHashes.has(hashFile(filePath))) {
    identicalImages.push(path.relative(siteDir, filePath));
  }
}
if (identicalImages.length > 0) {
  const sample = identicalImages.slice(0, 5).join(", ");
  const rest = identicalImages.length > 5 ? ` y ${identicalImages.length - 5} más` : "";
  warnings.push(
    `${identicalImages.length} archivo(s) de public/ son idénticos a los de la plantilla (${sample}${rest}).`
  );
}

console.log(
  `\nAuditoría de personalización: sites/${slug}${origin ? ` (origen: ${origin})` : ""}\n`
);

for (const message of warnings) console.log(`\x1b[33m⚠ ${message}\x1b[0m`);
for (const message of errors) console.log(`\x1b[31m✖ ${message}\x1b[0m`);

if (errors.length === 0 && warnings.length === 0) {
  console.log("\x1b[32m✔ Sin restos de plantilla detectados.\x1b[0m\n");
  process.exit(0);
}

console.log(
  `\n${errors.length} hallazgo(s) y ${warnings.length} aviso(s). Guía: sites/${slug}/CUSTOMIZE.md\n`
);
process.exit(strict && errors.length > 0 ? 1 : 0);
