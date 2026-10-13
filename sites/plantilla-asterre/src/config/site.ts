import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface ClientSiteConfig extends SiteMetadata {
  /** Año de fundación mostrado junto al logotipo */
  established: string;
  /** Enlace del motor de reservas (botones "Ver disponibilidad") */
  bookingUrl: string;
  /** Enlace a la ubicación en mapas */
  mapsUrl: string;
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    x?: string;
  };
  rating?: {
    score: string;
    reviews: number;
  };
  /** Color de la barra del navegador en móvil (meta theme-color) */
  themeColor: string;
  /** Fuentes de /public/fonts precargadas en <head>; deben coincidir con theme.css */
  preloadFonts: string[];
}

// Plantilla: reemplaza el dominio, la marca y los datos de contacto por los del cliente real.
const CLIENT_DOMAIN = "plantilla-asterre.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Casa Serena",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Casa Serena | Retiro privado",
  description:
    "Plantilla de sitio para retiros privados, hoteles boutique y casas de huéspedes rodeadas de naturaleza.",
  locale: "es_CO",
  ogImage: "/images/home-hero.webp",
  established: "2026",
  bookingUrl: "https://example.com/reservas",
  mapsUrl: "https://maps.google.com",
  contact: {
    phone: "+57 300 000 0000",
    email: "reservas@example.com",
    address: "Dirección del alojamiento\nCiudad, País",
  },
  socials: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
  },
  rating: {
    score: "4.9",
    reviews: 120,
  },
  themeColor: "#e8e0d1",
  preloadFonts: ["/fonts/forum-400.woff2", "/fonts/almarai-400.woff2"],
};

export const NAV_LINKS = [
  { label: "Habitaciones", href: "/rooms" },
  { label: "Experiencias", href: "/experience" },
  { label: "El retiro", href: "/retreat" },
  { label: "Contacto", href: "/contact" },
];

export const LEGAL_LINKS = [
  { label: "Política de privacidad", href: "/privacy-policy" },
  { label: "Términos de uso", href: "/terms-of-use" },
];
