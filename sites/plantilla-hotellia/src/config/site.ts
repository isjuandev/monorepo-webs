import { type SiteMetadata, normalizeSiteUrl } from "@repo/utils";

export interface ClientSiteConfig extends SiteMetadata {
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
  };
  socials: {
    facebook: string;
    instagram: string;
  };
  /** Color de la barra del navegador en móvil (meta theme-color) */
  themeColor: string;
  /** Fuentes de /public/fonts precargadas en <head>; deben coincidir con theme.css */
  preloadFonts: string[];
}

// Plantilla: reemplaza el dominio, la marca y los datos de contacto por los del cliente real.
const CLIENT_DOMAIN = "plantilla-hotellia.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Hotellia",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Hotellia - A Boutique Hotel Responsive Template",
  description:
    "Hotellia is a clean, minimal website template crafted for boutique hotels, luxury resorts, and serene hospitality experiences.",
  locale: "en_US",
  ogImage: "/images/og-image.png",
  contact: {
    phone: "022 5259-5200",
    phoneHref: "tel:02252595200",
    email: "welcome@hotellia.com",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  themeColor: "#1c3d2d",
  preloadFonts: ["/fonts/libre-baskerville-400.woff2", "/fonts/inter-400.woff2"],
};

/** Título de página con el sufijo de marca ("Página - <título SEO del sitio>"). */
export function pageTitle(page?: string): string {
  return page ? `${page} - ${siteConfig.title}` : siteConfig.title;
}

export const MENU_LINKS = [
  { label: "Rooms", href: "/rooms" },
  { label: "Wine & Dine", href: "/wine-dine" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reserve", href: "/reserve" },
];

export const FOOTER_PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Wine & Dine", href: "/wine-dine" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reserve", href: "/reserve" },
];

export const FOOTER_SECONDARY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "404", href: "/404" },
];
