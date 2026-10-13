export interface SiteMetadata {
  /** Nombre comercial del cliente */
  name: string;
  /** Dominio principal sin protocolo (ej. "micliente.com") */
  domain: string;
  /** URL canónica base con protocolo (ej. "https://micliente.com") */
  url: string;
  /** Título SEO por defecto */
  title: string;
  /** Descripción SEO por defecto */
  description: string;
  /** Configuración regional (ej. "es_CO") */
  locale?: string;
  /** Ruta o URL de la imagen OpenGraph por defecto */
  ogImage?: string;
}

/**
 * Normaliza un dominio o URL asegurando que tenga protocolo https:// y sin slash final
 */
export function normalizeSiteUrl(domainOrUrl: string): string {
  const trimmed = domainOrUrl.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Genera el contenido de robots.txt apuntando al sitemap del dominio del cliente
 */
export function generateRobotsTxt(siteUrl: string): string {
  const baseUrl = normalizeSiteUrl(siteUrl);
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${baseUrl}/sitemap-index.xml`, ""].join("\n");
}

/**
 * Genera un enlace directo a WhatsApp con mensaje codificado
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  if (!message) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Une clases CSS condicionalmente
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(" ");
}
