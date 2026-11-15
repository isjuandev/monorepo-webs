import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { KEBAB_CASE_REGEX, RECURSOS_DIR, ROOT_DIR, slugify } from "./brief.mjs";
import { clientRel, docsPaths } from "./paths.mjs";

/** Extensiones raster que se convierten a WebP (HEIC no se procesa) */
export const RASTER_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".tif",
  ".tiff",
]);
/** Archivos de marca que se copian sin transformar */
export const COPY_AS_IS = /^(favicon|apple-touch-icon)/;
// Ancho máximo por carpeta de fotos/ (las fotos verticales se limitan por el mismo ancho)
export const MAX_WIDTH = { hero: 2400, habitaciones: 1600, instalaciones: 1600, galeria: 1600 };
export const DEFAULT_MAX_WIDTH = 1600;
export const WEBP_QUALITY = 80;

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name.startsWith(".") || entry.name === "entrada" ? [] : walk(full);
    }
    return entry.name.startsWith(".") ? [] : [full];
  });
}

/** Nombre de archivo en kebab-case con la extensión indicada */
function kebabName(file, extension) {
  return `${slugify(path.parse(file).name) || "archivo"}${extension}`;
}

function isFresh(source, output, force) {
  return (
    !force && fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs
  );
}

/**
 * Convierte una imagen a WebP (EXIF aplicado, ancho limitado sin ampliar).
 * @param {string} source ruta de origen
 * @param {string} output ruta de destino
 * @param {number} maxWidth ancho máximo en px
 */
export async function toWebp(source, output, maxWidth) {
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

/**
 * Genera la imagen Open Graph (1200x630, recorte cover, JPEG).
 * @param {string} source ruta de origen
 * @param {string} output ruta de destino
 */
export async function toOgImage(source, output) {
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

/**
 * Decide destino y transformación de cada archivo de recursos.
 * @param {string} source archivo dentro de recursos/<slug>/
 * @param {string} recursosDir raíz recursos/<slug>/
 * @param {string} publicDir carpeta public/ del sitio
 * @param {{ rejectSvg?: boolean }} [options] rejectSvg: omite los SVG pidiendo PNG
 * @returns {{ skip: string } | { kind: string, room?: string, action: "webp" | "og" | "copy", maxWidth?: number, output: string }}
 */
export function planFile(source, recursosDir, publicDir, { rejectSvg = false } = {}) {
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
      output: path.join(publicDir, "images", kebabName(name, ".webp")),
    };
  }

  if (area === "marca") {
    if (rest[0] === "fuentes") {
      return ext === ".woff2"
        ? {
            kind: "fuente",
            action: "copy",
            output: path.join(publicDir, "fonts", kebabName(name, ext)),
          }
        : { skip: "solo se copian fuentes .woff2" };
    }
    if (rejectSvg && ext === ".svg") {
      return { skip: "SVG no soportado en la web: sube el logo en PNG" };
    }
    if (name.startsWith("og-image") && RASTER_EXTENSIONS.has(ext)) {
      return {
        kind: "og-image",
        action: "og",
        output: path.join(publicDir, "images", "og-image.jpg"),
      };
    }
    if (COPY_AS_IS.test(name) || ext === ".ico") {
      return { kind: "marca", action: "copy", output: path.join(publicDir, kebabName(name, ext)) };
    }
    if (ext === ".svg") {
      return {
        kind: "marca",
        action: "copy",
        output: path.join(publicDir, "images", kebabName(name, ext)),
      };
    }
    if (RASTER_EXTENSIONS.has(ext)) {
      return {
        kind: "marca",
        action: "webp",
        maxWidth: 1200,
        output: path.join(publicDir, "images", kebabName(name, ".webp")),
      };
    }
    return { skip: `formato no soportado (${ext})` };
  }

  return { skip: "fuera de fotos/ y marca/ (solo lectura para el agente)" };
}

/**
 * Optimiza recursos/<slug>/{fotos,marca} hacia clientes/<slug>/public/ y escribe
 * docs/assets-manifest.json. Es lo que ejecuta `pnpm cliente:activos`.
 * @param {string} slug slug kebab-case del cliente
 * @param {{ force?: boolean, rejectSvg?: boolean, log?: (line: string) => void }} [options]
 *   force: reprocesa aunque el destino sea más reciente; rejectSvg: omite los SVG;
 *   log: recibe las líneas de resumen (por defecto console.log)
 * @returns {Promise<{ items: object[], skipped: string[], manifestPath: string }>}
 * @throws {Error} si el slug no es válido o faltan recursos/<slug>/ o el sitio del cliente
 */
export async function optimizeSiteAssets(
  slug,
  { force = false, rejectSvg = false, log = console.log } = {}
) {
  if (!KEBAB_CASE_REGEX.test(slug)) {
    throw new Error(`el slug "${slug}" no es kebab-case válido.`);
  }

  const recursosDir = path.join(RECURSOS_DIR, slug);
  const siteDir = path.join(ROOT_DIR, clientRel(slug));
  if (!fs.existsSync(recursosDir)) {
    throw new Error(`no existe recursos/${slug}/.`);
  }
  if (!fs.existsSync(path.join(siteDir, "package.json"))) {
    throw new Error(`no existe ${clientRel(slug)}/. Genera el sitio antes con pnpm cliente:nuevo.`);
  }

  const publicDir = path.join(siteDir, "public");
  const items = [];
  const skipped = [];
  let processed = 0;

  const claimed = new Map();
  for (const source of walk(recursosDir)) {
    const plan = planFile(source, recursosDir, publicDir, { rejectSvg });
    const sourceRel = path.relative(ROOT_DIR, source);
    if (plan.skip) {
      skipped.push(`${sourceRel}: ${plan.skip}`);
      continue;
    }
    if (claimed.has(plan.output)) {
      skipped.push(`${sourceRel}: mismo nombre que ${claimed.get(plan.output)} (renombra uno)`);
      continue;
    }
    claimed.set(plan.output, sourceRel);

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

  const manifestPath = path.join(ROOT_DIR, docsPaths(clientRel(slug)).docs, "assets-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify({ slug, items, skipped }, null, 2)}\n`);

  const totalKb = Math.round(items.reduce((sum, item) => sum + item.bytes, 0) / 1024);
  log(
    `✔ ${items.length} activos en ${clientRel(slug)}/public/ (${processed} procesados, ${totalKb} KB en total).`
  );
  log(`  Manifiesto: ${path.relative(ROOT_DIR, manifestPath)}`);
  if (skipped.length > 0) {
    log(`  Omitidos (${skipped.length}):`);
    for (const line of skipped) {
      log(`  - ${line}`);
    }
  }

  return { items, skipped, manifestPath };
}
