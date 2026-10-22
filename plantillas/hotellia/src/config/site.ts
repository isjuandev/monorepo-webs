import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

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
  title: "Hotellia - Plantilla responsive para hoteles boutique",
  description:
    "Hotellia es una plantilla web limpia y minimalista, pensada para hoteles boutique, resorts de lujo y experiencias de hospitalidad serena.",
  locale: "es_CO",
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
  { label: "Habitaciones", href: "/rooms" },
  { label: "Vinos y cenas", href: "/wine-dine" },
  { label: "Galería", href: "/gallery" },
  { label: "Reservar", href: "/reserve" },
];

export const FOOTER_PRIMARY_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Habitaciones", href: "/rooms" },
  { label: "Vinos y cenas", href: "/wine-dine" },
  { label: "Galería", href: "/gallery" },
  { label: "Reservar", href: "/reserve" },
];

export const FOOTER_SECONDARY_LINKS = [
  { label: "Política de privacidad", href: "/privacy" },
  { label: "Términos y condiciones", href: "/terms" },
  { label: "404", href: "/404" },
];
