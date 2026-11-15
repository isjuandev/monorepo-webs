/** Tipos de scripts/lib/new-site.mjs (única implementación; este archivo solo la describe). */

import type { SiteKind } from "./paths.mjs";

/** Opciones de `pnpm cliente:nuevo` (resultado de parseArgs). */
export interface NewSiteOptions {
  slug: string;
  name: string;
  from: string;
  plantilla: boolean;
  domain: string;
  title: string;
  description: string;
  locale: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  skipChecks: boolean;
  help: boolean;
}

/** Resultado de generateSite. */
export interface NewSiteResult {
  slug: string;
  kind: SiteKind;
  /** Ruta relativa a la raíz (ej. "clientes/cafe-aurora") */
  siteRel: string;
  targetSiteDir: string;
  /** Nombre del package.json (ej. "@clientes/cafe-aurora") */
  packageName: string;
  brandName: string;
  /** Ruta relativa de la plantilla de origen */
  sourceRel: string;
  /** true si el sitio nace de la plantilla _base (site.ts generado entero) */
  fromTemplate: boolean;
  /** Campos de site.ts que no se pudieron ajustar al parchear */
  pending: string[];
}

export interface NewSiteLogOptions {
  log?: (mensaje: string) => void;
}

export interface RunSiteChecksOptions extends NewSiteLogOptions {
  /** Omite install, aislamiento, lint, check y build (equivale a --skip-checks) */
  skipChecks?: boolean;
}

/** Error de validación con el mensaje listo para mostrar. */
export class NewSiteError extends Error {}

export function parseArgs(argv: string[]): NewSiteOptions;
/** Lanza NewSiteError con el mensaje a mostrar si las opciones no son válidas. */
export function generateSite(args: NewSiteOptions, opciones?: NewSiteLogOptions): NewSiteResult;
export function runSiteChecks(result: NewSiteResult, opciones?: RunSiteChecksOptions): void;
