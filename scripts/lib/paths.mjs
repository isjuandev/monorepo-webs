import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PLANTILLAS_DIR = path.join(ROOT_DIR, "plantillas");
export const CLIENTES_DIR = path.join(ROOT_DIR, "clientes");
export const RECURSOS_DIR = path.join(ROOT_DIR, "recursos");

/** Plantilla mínima de la que nacen las plantillas nuevas (plantilla:clonar) */
export const BASE_TEMPLATE = "_base";

/** Plantilla por defecto de un cliente nuevo cuando el brief no indica otra */
export const DEFAULT_TEMPLATE = "asterre";

/** Datos de ejemplo comunes a todas las plantillas (customize:check los busca en cada cliente) */
export const GLOBAL_PLACEHOLDERS = {
  domains: ["example.com", "nexobite.com"],
  placeholders: ["573000000000", "+57 300 000 0000", "reservas@example.com"],
};

const KINDS = [
  { kind: "plantilla", dir: PLANTILLAS_DIR, folder: "plantillas", manifest: "plantilla.json" },
  { kind: "cliente", dir: CLIENTES_DIR, folder: "clientes", manifest: "cliente.json" },
];

// Nombres antiguos de sites/ (Coolify y documentación vieja siguen usándolos)
const LEGACY_NAMES = { _template: BASE_TEMPLATE };

/**
 * Sitio del monorepo: { slug, kind, dir, rel, pkg, manifest }.
 * rel es la ruta relativa a la raíz (ej. "clientes/la-guaca").
 */
function describe(kindInfo, slug) {
  const dir = path.join(kindInfo.dir, slug);
  const pkgPath = path.join(dir, "package.json");
  const manifestPath = path.join(dir, kindInfo.manifest);
  return {
    slug,
    kind: kindInfo.kind,
    dir,
    rel: `${kindInfo.folder}/${slug}`,
    pkg: fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, "utf8")).name : null,
    manifestPath,
    manifest: fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
      : null,
  };
}

/** Todas las carpetas de plantillas/ y clientes/ (con o sin package.json) */
export function listSiteFolders() {
  return KINDS.flatMap((kindInfo) =>
    fs.existsSync(kindInfo.dir)
      ? fs
          .readdirSync(kindInfo.dir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => describe(kindInfo, entry.name))
      : []
  );
}

/** Sitios válidos (con package.json); kind opcional: "plantilla" o "cliente" */
export function listSites(kind) {
  return listSiteFolders().filter((site) => site.pkg && (!kind || site.kind === kind));
}

export function listTemplates() {
  return listSites("plantilla").map((site) => site.slug);
}

/** Normaliza nombres antiguos: "plantilla-asterre" → "asterre", "_template" → "_base" */
export function canonicalSlug(name) {
  const clean = String(name ?? "")
    .trim()
    .replace(/^sites\//, "")
    .replace(/^(plantillas|clientes)\//, "")
    .replace(/\/+$/, "");
  if (LEGACY_NAMES[clean]) return LEGACY_NAMES[clean];
  return clean.replace(/^plantilla-/, "");
}

/** Busca un sitio por slug (o nombre antiguo) en plantillas/ y clientes/; null si no existe */
export function resolveSite(name) {
  const slug = canonicalSlug(name);
  return listSites().find((site) => site.slug === slug) ?? null;
}

/** Ruta relativa de un sitio de cliente (exista o no) */
export function clientRel(slug) {
  return `clientes/${slug}`;
}

/** Ruta relativa de una plantilla (exista o no) */
export function templateRel(slug) {
  return `plantillas/${slug}`;
}

/** Carpetas de documentación de un sitio: docs/, docs/referencias/ y docs/qa/ (ignorada) */
export function docsPaths(rel) {
  return {
    docs: `${rel}/docs`,
    referencias: `${rel}/docs/referencias`,
    qa: `${rel}/docs/qa`,
  };
}
