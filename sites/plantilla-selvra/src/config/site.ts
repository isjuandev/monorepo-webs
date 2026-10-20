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
  title: "Arvenna Retreat — Unhurried stays above the lake",
  description:
    "Three quiet stays in stone and oak, a handful of unhurried experiences and a landscape that sets the pace. A sample retreat website.",
  locale: "en_US",
  ogImage: "/images/og-image.jpg",
  logoText: "ARVENNA",
  footerTagline: "ARVENNA / HILLSIDE RETREAT",
  contact: {
    phone: "+57 300 000 0000",
    phoneHref: "tel:+573000000000",
    email: "reservas@example.com",
    address: "Retreat address",
  },
  themeColor: "#202923",
  preloadFonts: ["/fonts/bespoke-serif-400.woff2", "/fonts/manrope-400.woff2"],
};

/** Título de página con el sufijo de marca ("Página — <marca>"). */
export function pageTitle(page?: string): string {
  return page ? `${page} — ${siteConfig.logoText}` : siteConfig.title;
}

export const MENU_LINKS: NavLink[] = [
  { label: "Stays", href: "/stays" },
  { label: "Experiences", href: "/experiences" },
  { label: "The place", href: "/place" },
  { label: "Enquire", href: "/enquire" },
];

export const FOOTER_LINKS: NavLink[] = [
  ...MENU_LINKS,
  { label: "About & legal", href: "/demo" },
  { label: "Privacy", href: "/privacy" },
];
