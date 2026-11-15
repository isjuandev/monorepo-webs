/** Tipos de scripts/lib/paths.mjs (única implementación; este archivo solo la describe). */

/** Valor JSON arbitrario (para campos desconocidos de los manifiestos). */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type SiteKind = "plantilla" | "cliente";

/** Contenido de plantilla.json o cliente.json. Todos los campos son opcionales. */
export interface SiteManifest {
  /** Nombre comercial o de la plantilla */
  nombre?: string;
  /** plantilla.json */
  descripcion?: string;
  idioma?: string;
  negocio?: string[];
  origen?: string;
  demo?: string;
  marcas?: string[];
  placeholders?: string[];
  /** cliente.json: slug de la plantilla de origen */
  plantilla?: string;
  estado?: string;
  coolify?: string;
  [campo: string]: JsonValue | undefined;
}

/** Sitio del monorepo. rel es la ruta relativa a la raíz (ej. "clientes/la-guaca"). */
export interface Site {
  slug: string;
  kind: SiteKind;
  dir: string;
  rel: string;
  /** Nombre del package.json; null si no existe el archivo, undefined si no declara name */
  pkg: string | null | undefined;
  manifestPath: string;
  /** Manifiesto parseado, o null si el archivo no existe */
  manifest: SiteManifest | null;
}

export interface GlobalPlaceholders {
  domains: string[];
  placeholders: string[];
}

export interface DocsPaths {
  docs: string;
  referencias: string;
  qa: string;
}

/** Raíz del repo: CMS_REPO_DIR si está definida; si no, la calculada desde este archivo */
export const ROOT_DIR: string;
export const PLANTILLAS_DIR: string;
export const CLIENTES_DIR: string;
export const RECURSOS_DIR: string;
export const BASE_TEMPLATE: string;
export const DEFAULT_TEMPLATE: string;
export const GLOBAL_PLACEHOLDERS: GlobalPlaceholders;

/** Todas las carpetas de plantillas/ y clientes/ (con o sin package.json) */
export function listSiteFolders(): Site[];
/** Sitios válidos (con package.json); kind opcional */
export function listSites(kind?: SiteKind): Site[];
export function listTemplates(): string[];
/** Normaliza nombres antiguos ("plantilla-asterre" → "asterre") */
export function canonicalSlug(name: string | null | undefined): string;
/** Busca un sitio por slug; null si no existe */
export function resolveSite(name: string | null | undefined): Site | null;
export function clientRel(slug: string): string;
export function templateRel(slug: string): string;
export function docsPaths(rel: string): DocsPaths;
