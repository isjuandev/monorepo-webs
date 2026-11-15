/** Tipos de scripts/lib/brief.mjs (única implementación; este archivo solo la describe). */

export { RECURSOS_DIR, ROOT_DIR } from "./paths.mjs";

/** Sección "## " del brief con sus líneas */
export interface BriefSection {
  lines: string[];
}

export type BriefSections = Record<string, BriefSection>;

export interface BriefContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

/** Brief leído de recursos/<slug>/brief.md */
export interface ParsedBrief {
  /** Vacía si el brief es utilizable */
  errors: string[];
  briefPath: string;
  plantilla: string;
  name: string;
  domain: string;
  locale: string;
  motel: boolean;
  branch: string;
  rooms: string[];
  /** Rutas separadas por coma */
  routes: string;
  contact: BriefContact;
}

/** Resultado cuando no existe recursos/<slug>/brief.md */
export interface MissingBrief {
  errors: string[];
  briefPath?: undefined;
}

export type ParseBriefResult = ParsedBrief | MissingBrief;

export interface RecursosLeftovers {
  fields: string[];
  files: string[];
}

export const KEBAB_CASE_REGEX: RegExp;

export function normalize(text: string): string;
export function stripHtmlComments(text: string): string;
export function parseSections(text: string): BriefSections;
export function field(section: BriefSection | undefined, label: string): string;
export function cleanValue(value: string): string;
export function slugify(text: string): string;
export function parseBrief(slug: string): ParseBriefResult;
export function recursosLeftovers(slug: string, plantilla?: string | null): RecursosLeftovers;
