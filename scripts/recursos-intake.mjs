#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { KEBAB_CASE_REGEX, RECURSOS_DIR, ROOT_DIR } from "./lib/brief.mjs";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const HEIC_EXTENSIONS = new Set([".heic", ".heif"]);
const READABLE_TEXT = new Set([".txt", ".md", ".csv", ".pdf"]);
// Formatos de texto que macOS convierte a .txt con textutil
const TEXTUTIL_EXTENSIONS = new Set([".docx", ".doc", ".rtf", ".odt", ".pages", ".html"]);
const FONT_EXTENSIONS = new Set([".woff2", ".woff", ".ttf", ".otf"]);
const VECTOR_EXTENSIONS = new Set([".svg", ".ico"]);
const THUMB_WIDTH = 512;

function printUsage() {
  console.log(`
Uso:
  pnpm cliente:intake <slug-cliente> --prepare
  pnpm cliente:intake <slug-cliente> --apply [--force]
  pnpm cliente:intake <slug-cliente> --status

Ordena la bandeja cruda recursos/<slug>/entrada/ (lo que mande el cliente, con cualquier nombre).
Lo ejecuta pnpm cliente:crear en el paso intake; a mano solo hace falta para depurar.

  --prepare  Convierte HEIC (sips) y documentos (textutil), genera miniaturas y escribe
             recursos/<slug>/.intake/indice.json para que el agente clasifique.
  --apply    Copia cada archivo al destino que el agente decidió en .intake/clasificacion.json
             (fotos/…, marca/…). entrada/ nunca se modifica.
  --status   Indica si entrada/ cambió desde el último intake (código 0 = al día, 2 = pendiente).
  --force    Con --apply, sobrescribe destinos que ya existen con otro contenido.
`);
}

function fail(message) {
  console.error(`\x1b[31m✖ ${message}\x1b[0m`);
  process.exit(1);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "__MACOSX") return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const hashFile = (file) => crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex");

export function intakePaths(slug) {
  const base = path.join(RECURSOS_DIR, slug);
  const intake = path.join(base, ".intake");
  return {
    base,
    entrada: path.join(base, "entrada"),
    intake,
    indice: path.join(intake, "indice.json"),
    clasificacion: path.join(intake, "clasificacion.json"),
    hecho: path.join(intake, "hecho.json"),
  };
}

/** Huella de entrada/: cambia si se añade, quita o modifica cualquier archivo */
export function entradaFingerprint(slug) {
  const { entrada } = intakePaths(slug);
  const files = walk(entrada).map((file) => {
    const stat = fs.statSync(file);
    return `${path.relative(entrada, file)}:${stat.size}:${Math.round(stat.mtimeMs)}`;
  });
  return {
    count: files.length,
    hash: crypto.createHash("sha1").update(files.sort().join("\n")).digest("hex"),
  };
}

/** true si entrada/ tiene archivos que aún no pasaron por el intake */
export function intakePending(slug) {
  const { hecho } = intakePaths(slug);
  const { count, hash } = entradaFingerprint(slug);
  if (count === 0) return false;
  if (!fs.existsSync(hecho)) return true;
  return JSON.parse(fs.readFileSync(hecho, "utf8")).hash !== hash;
}

function rel(file) {
  return path.relative(ROOT_DIR, file);
}

async function prepare(slug) {
  const paths = intakePaths(slug);
  const files = walk(paths.entrada);
  if (files.length === 0) {
    fail(`recursos/${slug}/entrada/ está vacía: deja ahí el material del cliente.`);
  }
  fs.rmSync(paths.intake, { recursive: true, force: true });
  for (const dir of ["miniaturas", "convertidos", "textos"]) {
    fs.mkdirSync(path.join(paths.intake, dir), { recursive: true });
  }

  const fotos = [];
  const textos = [];
  const otros = [];
  const pad = (n) => String(n).padStart(3, "0");
  const otro = (original, motivo) =>
    otros.push({ id: `o${pad(otros.length + 1)}`, original, motivo });

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const original = rel(file);
    if (IMAGE_EXTENSIONS.has(ext) || HEIC_EXTENSIONS.has(ext)) {
      const id = `f${pad(fotos.length + 1)}`;
      let legible = file;
      if (HEIC_EXTENSIONS.has(ext)) {
        legible = path.join(paths.intake, "convertidos", `${id}.jpg`);
        const result = spawnSync("sips", ["-s", "format", "jpeg", file, "--out", legible], {
          encoding: "utf8",
        });
        if (result.status !== 0 || !fs.existsSync(legible)) {
          otro(original, "HEIC sin convertir (sips no disponible): exporta a JPG");
          continue;
        }
      }
      try {
        const miniatura = path.join(paths.intake, "miniaturas", `${id}.jpg`);
        const info = await sharp(legible)
          .rotate()
          .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toFile(miniatura);
        const meta = await sharp(legible).rotate().metadata();
        const rotated = meta.orientation && meta.orientation >= 5;
        const ancho = rotated ? meta.height : meta.width;
        const alto = rotated ? meta.width : meta.height;
        fotos.push({
          id,
          original,
          legible: rel(legible),
          miniatura: rel(miniatura),
          ancho,
          alto,
          orientacion: ancho > alto ? "horizontal" : ancho < alto ? "vertical" : "cuadrada",
          bytes: fs.statSync(file).size,
          thumbBytes: info.size,
        });
      } catch (error) {
        otro(original, `imagen ilegible (${error.message})`);
      }
    } else if (READABLE_TEXT.has(ext)) {
      textos.push({ id: `t${pad(textos.length + 1)}`, original, legible: original });
    } else if (TEXTUTIL_EXTENSIONS.has(ext)) {
      const id = `t${pad(textos.length + 1)}`;
      const legible = path.join(paths.intake, "textos", `${id}.txt`);
      const result = spawnSync("textutil", ["-convert", "txt", "-output", legible, file]);
      if (result.status === 0 && fs.existsSync(legible)) {
        textos.push({ id, original, legible: rel(legible) });
      } else {
        otro(original, "documento sin convertir: expórtalo a PDF o TXT");
      }
    } else if (FONT_EXTENSIONS.has(ext) || VECTOR_EXTENSIONS.has(ext)) {
      otro(original, ext === ".svg" ? "vector (posible logo)" : "fuente o icono");
    } else {
      otro(original, `formato no usado (${ext || "sin extensión"})`);
    }
  }

  const indice = {
    slug,
    generado: new Date().toISOString(),
    huella: entradaFingerprint(slug),
    fotos,
    textos,
    otros,
  };
  fs.writeFileSync(paths.indice, `${JSON.stringify(indice, null, 2)}\n`);
  console.log(
    `✔ Intake preparado: ${fotos.length} fotos, ${textos.length} textos, ${otros.length} otros → ${rel(paths.indice)}`
  );
}

/** Destino válido: fotos/<carpeta>/.../<nombre> o marca/[fuentes/]<nombre>, en kebab-case */
function validDestination(destino) {
  const parts = destino.split("/");
  if (!["fotos", "marca"].includes(parts[0]) || parts.length < 2) return false;
  if (
    parts[0] === "fotos" &&
    !["hero", "habitaciones", "instalaciones", "galeria"].includes(parts[1])
  )
    return false;
  return parts.slice(1).every((part) => KEBAB_CASE_REGEX.test(part));
}

function apply(slug, force) {
  const paths = intakePaths(slug);
  if (!fs.existsSync(paths.indice)) fail("falta .intake/indice.json: ejecuta antes --prepare.");
  if (!fs.existsSync(paths.clasificacion)) {
    fail("falta .intake/clasificacion.json (lo escribe el agente en el paso intake).");
  }
  const indice = JSON.parse(fs.readFileSync(paths.indice, "utf8"));
  const clasificacion = JSON.parse(fs.readFileSync(paths.clasificacion, "utf8"));
  const sources = new Map([...indice.fotos, ...indice.otros].map((item) => [item.id, item]));

  const problems = [];
  const copies = [];
  // Fotos ya ordenadas (por una persona o un intake anterior): sus nombres también cuentan
  const basenames = new Map(
    walk(path.join(paths.base, "fotos")).map((file) => [
      path.parse(file).name,
      path.relative(paths.base, file).replace(/\.[^.]+$/, ""),
    ])
  );
  for (const item of clasificacion.archivos ?? []) {
    if (!item?.id || !item.destino || item.destino === "descartar") continue;
    const source = sources.get(item.id);
    if (!source) {
      problems.push(`${item.id}: no existe en indice.json`);
      continue;
    }
    const destino = item.destino.replace(/\.[a-z0-9]+$/i, "");
    if (!validDestination(destino)) {
      problems.push(
        `${item.id}: destino no válido "${item.destino}" (kebab-case bajo fotos/ o marca/)`
      );
      continue;
    }
    const legible = path.join(ROOT_DIR, source.legible ?? source.original);
    const target = path.join(paths.base, `${destino}${path.extname(legible).toLowerCase()}`);
    // public/images/ es plano: dos fotos no pueden compartir nombre aunque estén en carpetas distintas
    const name = path.basename(destino);
    if (destino.startsWith("fotos/") && basenames.has(name) && basenames.get(name) !== destino) {
      problems.push(`${item.id}: el nombre "${name}" ya lo usa ${basenames.get(name)}`);
      continue;
    }
    basenames.set(name, destino);
    if (fs.existsSync(target) && hashFile(target) !== hashFile(legible) && !force) {
      problems.push(`${rel(target)} ya existe con otro contenido (usa --force para sobrescribir)`);
      continue;
    }
    copies.push({ legible, target });
  }
  if (problems.length > 0) {
    fail(`clasificación con problemas:\n  - ${problems.join("\n  - ")}`);
  }
  for (const { legible, target } of copies) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(legible, target);
  }
  fs.writeFileSync(
    paths.hecho,
    `${JSON.stringify({ ...entradaFingerprint(slug), aplicado: new Date().toISOString(), copias: copies.length }, null, 2)}\n`
  );
  console.log(`✔ Intake aplicado: ${copies.length} archivos ordenados en recursos/${slug}/`);
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((arg) => !arg.startsWith("--")) ?? "";
  if (!slug || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(slug ? 0 : 1);
  }
  if (!KEBAB_CASE_REGEX.test(slug)) fail(`el slug "${slug}" no es kebab-case válido.`);
  if (!fs.existsSync(path.join(RECURSOS_DIR, slug))) {
    fail(`no existe recursos/${slug}/ (créala con pnpm cliente:recursos ${slug}).`);
  }
  if (args.includes("--prepare")) await prepare(slug);
  else if (args.includes("--apply")) apply(slug, args.includes("--force"));
  else if (args.includes("--status")) {
    const pending = intakePending(slug);
    console.log(pending ? "pendiente" : "al día");
    process.exit(pending ? 2 : 0);
  } else {
    printUsage();
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
