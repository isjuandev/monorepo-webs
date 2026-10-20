#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { KEBAB_CASE_REGEX, RECURSOS_DIR, ROOT_DIR, SITES_DIR, slugify } from "./lib/brief.mjs";

const RASTER_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const COPY_AS_IS = /^(favicon|apple-touch-icon)/;
// Ancho máximo por carpeta de fotos/ (las fotos verticales se limitan por el mismo ancho)
const MAX_WIDTH = { hero: 2400, habitaciones: 1600, instalaciones: 1600, galeria: 1600 };
const DEFAULT_MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

function printUsage() {
  console.log(`
Uso:
  pnpm optimize-assets <slug-cliente> [--force]

Copia y optimiza los activos de recursos/<slug-cliente>/ hacia sites/<slug-cliente>/public/:
  fotos/<carpeta>/**      → public/images/<carpeta>/**.webp (redimensionadas, EXIF aplicado)
  marca/logo*.svg         → public/ (copia)
  marca/favicon*, apple-touch-icon* → public/ (copia)
  marca/og-image.*        → public/og-image.jpg (1200x630)
  marca/fuentes/*.woff2   → public/fonts/
  marca/<otras imágenes>  → public/images/marca/*.webp
Escribe el mapa origen → destino en docs/research/<slug-cliente>/assets-manifest.json.
Sin --force, omite los archivos cuyo destino ya es más reciente que el origen.
`);
}

function fail(message) {
  console.error(`\x1b[31m✖ Error: ${message}\x1b[0m`);
  process.exit(1);
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(full);
    }
    return entry.name.startsWith(".") ? [] : [full];
  });
}

/** Normaliza cada segmento de una ruta relativa a kebab-case y cambia la extensión */
function kebabPath(relative, extension) {
  const parts = relative.split(path.sep);
  const file = parts.pop();
  const base = slugify(path.parse(file).name) || "archivo";
  return path.join(...parts.map((part) => slugify(part) || part), `${base}${extension}`);
}

function isFresh(source, output, force) {
  return (
    !force && fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs
  );
}

async function toWebp(source, output, maxWidth) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const info = await sharp(source)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(output);
  // Un WebP de origen sin redimensionar que pesa menos que la recompresión se conserva tal cual
  const original = await sharp(source).metadata();
  if (original.format === "webp" && original.width === info.width && !original.orientation) {
    if (fs.statSync(source).size < info.size) {
      fs.copyFileSync(source, output);
    }
  }
}

async function toOgImage(source, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: 1200, height: 630, fit: "cover" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(output);
}

function copy(source, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(source, output);
}

/** Decide destino y transformación de cada archivo de recursos */
function planFile(source, recursosDir, publicDir) {
  const relative = path.relative(recursosDir, source);
  const [area, ...rest] = relative.split(path.sep);
  const ext = path.extname(source).toLowerCase();
  const name = path.basename(source).toLowerCase();

  if (area === "fotos") {
    if (!RASTER_EXTENSIONS.has(ext)) {
      return { skip: `formato no soportado (${ext})` };
    }
    const [folder] = rest;
    const room = folder === "habitaciones" && rest.length > 2 ? slugify(rest[1]) : undefined;
    return {
      kind: folder ?? "fotos",
      room,
      action: "webp",
      maxWidth: MAX_WIDTH[folder] ?? DEFAULT_MAX_WIDTH,
      output: path.join(publicDir, "images", kebabPath(rest.join(path.sep), ".webp")),
    };
  }

  if (area === "marca") {
    if (rest[0] === "fuentes") {
      return ext === ".woff2"
        ? {
            kind: "fuente",
            action: "copy",
            output: path.join(publicDir, "fonts", kebabPath(rest.slice(1).join(path.sep), ext)),
          }
        : { skip: "solo se copian fuentes .woff2" };
    }
    if (name.startsWith("og-image") && RASTER_EXTENSIONS.has(ext)) {
      return { kind: "og-image", action: "og", output: path.join(publicDir, "og-image.jpg") };
    }
    if (COPY_AS_IS.test(name) || ext === ".svg" || ext === ".ico") {
      return {
        kind: "marca",
        action: "copy",
        output: path.join(publicDir, kebabPath(rest.join(path.sep), ext)),
      };
    }
    if (RASTER_EXTENSIONS.has(ext)) {
      return {
        kind: "marca",
        action: "webp",
        maxWidth: 1200,
        output: path.join(publicDir, "images", "marca", kebabPath(rest.join(path.sep), ".webp")),
      };
    }
    return { skip: `formato no soportado (${ext})` };
  }

  return { skip: "fuera de fotos/ y marca/ (solo lectura para el agente)" };
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((arg) => !arg.startsWith("--")) ?? "";
  const force = args.includes("--force");
  if (!slug || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(slug ? 0 : 1);
  }
  if (!KEBAB_CASE_REGEX.test(slug)) {
    fail(`el slug "${slug}" no es kebab-case válido.`);
  }

  const recursosDir = path.join(RECURSOS_DIR, slug);
  const siteDir = path.join(SITES_DIR, slug);
  if (!fs.existsSync(recursosDir)) {
    fail(`no existe recursos/${slug}/.`);
  }
  if (!fs.existsSync(path.join(siteDir, "package.json"))) {
    fail(`no existe sites/${slug}/. Genera el sitio antes con pnpm new-client-site.`);
  }

  const publicDir = path.join(siteDir, "public");
  const items = [];
  const skipped = [];
  let processed = 0;

  for (const source of walk(recursosDir)) {
    const plan = planFile(source, recursosDir, publicDir);
    const sourceRel = path.relative(ROOT_DIR, source);
    if (plan.skip) {
      skipped.push(`${sourceRel}: ${plan.skip}`);
      continue;
    }

    if (!isFresh(source, plan.output, force)) {
      try {
        if (plan.action === "webp") {
          await toWebp(source, plan.output, plan.maxWidth);
        } else if (plan.action === "og") {
          await toOgImage(source, plan.output);
        } else {
          copy(source, plan.output);
        }
        processed += 1;
      } catch (error) {
        skipped.push(`${sourceRel}: no se pudo procesar (${error.message})`);
        continue;
      }
    }

    const isImage = plan.action !== "copy" || RASTER_EXTENSIONS.has(path.extname(plan.output));
    const metadata = isImage ? await sharp(plan.output).metadata() : {};
    items.push({
      source: sourceRel,
      output: path.relative(ROOT_DIR, plan.output),
      publicPath: `/${path.relative(publicDir, plan.output).split(path.sep).join("/")}`,
      kind: plan.kind,
      ...(plan.room ? { room: plan.room } : {}),
      ...(metadata.width ? { width: metadata.width, height: metadata.height } : {}),
      bytes: fs.statSync(plan.output).size,
    });
  }

  const manifestPath = path.join(ROOT_DIR, "docs", "research", slug, "assets-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify({ slug, items, skipped }, null, 2)}\n`);

  const totalKb = Math.round(items.reduce((sum, item) => sum + item.bytes, 0) / 1024);
  console.log(
    `✔ ${items.length} activos en sites/${slug}/public/ (${processed} procesados, ${totalKb} KB en total).`
  );
  console.log(`  Manifiesto: ${path.relative(ROOT_DIR, manifestPath)}`);
  if (skipped.length > 0) {
    console.log(`  Omitidos (${skipped.length}):`);
    for (const line of skipped) {
      console.log(`  - ${line}`);
    }
  }
}

main();
