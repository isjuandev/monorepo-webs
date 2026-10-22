import { siteConfig } from "@/config/site";

/** Locale BCP 47 del sitio ("es_CO" → "es-CO"). */
export const LOCALE = (siteConfig.locale ?? "es_CO").replace("_", "-");

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

/** 1400 → "1.400" según el locale del sitio. */
export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** 1280 → "$1.280" con el símbolo de site.ts. */
export function formatPrice(value: number): string {
  return `${siteConfig.currencySymbol}${formatNumber(value)}`;
}

/** Fecha ISO → "12 feb 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}
