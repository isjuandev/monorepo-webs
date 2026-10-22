import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface ClientSiteConfig extends SiteMetadata {
  /** Logotipo de texto de la cabecera */
  logoText: string;
  /** Rótulo del pie ("MARCA / DESCRIPTOR") */
  footerTagline: string;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
  };
  /** Color de la barra del navegador en móvil (meta theme-color) */
  themeColor: string;
  /** Fuentes de /public/fonts precargadas en <head>; deben coincidir con theme.css */
  preloadFonts: string[];
}

// Plantilla: reemplaza el dominio, la marca y los datos de contacto por los del cliente real.
const CLIENT_DOMAIN = "plantilla-selvra.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Arvenna Retreat",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Arvenna Retreat — Estancias tranquilas sobre el lago",
  description:
    "Tres estancias silenciosas de piedra y roble, un puñado de experiencias pausadas y un paisaje que marca el ritmo. Un sitio de retiro de ejemplo.",
  locale: "es_CO",
  ogImage: "/images/og-image.jpg",
  logoText: "ARVENNA",
  footerTagline: "ARVENNA / RETIRO EN LA LADERA",
  contact: {
    phone: "+57 300 000 0000",
    phoneHref: "tel:+573000000000",
    email: "reservas@example.com",
    address: "Dirección del retiro",
  },
  themeColor: "#202923",
  preloadFonts: ["/fonts/bespoke-serif-400.woff2", "/fonts/manrope-400.woff2"],
};

/** Título de página con el sufijo de marca ("Página — <marca>"). */
export function pageTitle(page?: string): string {
  return page ? `${page} — ${siteConfig.logoText}` : siteConfig.title;
}

export const MENU_LINKS: NavLink[] = [
  { label: "Estancias", href: "/stays" },
  { label: "Experiencias", href: "/experiences" },
  { label: "El lugar", href: "/place" },
  { label: "Solicitud", href: "/enquire" },
];

export const FOOTER_LINKS: NavLink[] = [
  ...MENU_LINKS,
  { label: "Acerca de y legal", href: "/demo" },
  { label: "Privacidad", href: "/privacy" },
];
