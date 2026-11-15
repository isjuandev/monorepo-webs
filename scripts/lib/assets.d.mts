/** Tipos de scripts/lib/assets.mjs (única implementación; este archivo solo la describe). */

export type AssetAction = "webp" | "og" | "copy";

/** Archivo omitido por el plan */
export interface AssetSkip {
  skip: string;
}

/** Destino y transformación de un archivo de recursos */
export interface AssetPlanned {
  skip?: undefined;
  kind: string;
  room?: string | undefined;
  action: AssetAction;
  /** Solo en action "webp" */
  maxWidth?: number;
  output: string;
}

export type AssetPlan = AssetSkip | AssetPlanned;

/** Entrada de docs/assets-manifest.json */
export interface AssetItem {
  source: string;
  output: string;
  publicPath: string;
  kind: string;
  room?: string;
  width?: number;
  height?: number;
  bytes: number;
}

export interface OptimizeOptions {
  force?: boolean;
  rejectSvg?: boolean;
  log?: (line: string) => void;
}

export interface OptimizeResult {
  items: AssetItem[];
  skipped: string[];
  manifestPath: string;
}

export interface PlanFileOptions {
  rejectSvg?: boolean;
}

export const RASTER_EXTENSIONS: Set<string>;
export const COPY_AS_IS: RegExp;
export const MAX_WIDTH: Record<string, number>;
export const DEFAULT_MAX_WIDTH: number;
export const WEBP_QUALITY: number;

export function toWebp(source: string, output: string, maxWidth: number): Promise<void>;
export function toOgImage(source: string, output: string): Promise<void>;
export function planFile(
  source: string,
  recursosDir: string,
  publicDir: string,
  options?: PlanFileOptions
): AssetPlan;
export function optimizeSiteAssets(
  slug: string,
  options?: OptimizeOptions
): Promise<OptimizeResult>;
