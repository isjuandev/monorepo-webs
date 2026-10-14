import { buildWhatsAppUrl, normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface ClientSiteConfig extends SiteMetadata {
  /** Enlace general de reservas (WhatsApp sin mensaje); los CTA usan whatsappUrl() de content.ts */
  bookingUrl: string;
  /** Enlace a la ubicación en mapas */
  mapsUrl: string;
  contact: {
    phone?: string;
    /** Número internacional, solo dígitos (código de país + número) */
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

const CLIENT_DOMAIN = "la-guaca.nexobite.com";
const WHATSAPP_NUMBER = "573207274329";

export const siteConfig: ClientSiteConfig = {
  name: "La Guaca",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "La Guaca Motel | Habitaciones con jacuzzi en Armenia",
  description:
    "Motel en el km 2 vía Montenegro, Armenia. Abierto 24/7: cinco categorías con jacuzzi de agua caliente y garaje privado desde $115.000 por 5 horas.",
  locale: "es_CO",
  ogImage: "/images/og-image.jpg",
  bookingUrl: buildWhatsAppUrl(WHATSAPP_NUMBER),
  mapsUrl: "https://maps.app.goo.gl/pC9Ps9RnKSGE9G8f6",
  contact: {
    phone: "+57 320 727 4329",
    whatsapp: WHATSAPP_NUMBER,
    email: "laguacamotel28@gmail.com",
    address: "Km 2 vía Montenegro\nArmenia",
  },
  socials: {
    facebook: "https://www.facebook.com/motellaguaca",
    instagram: "https://www.instagram.com/motellaguaca",
  },
  themeColor: "#0b0909",
  preloadFonts: ["/fonts/forum-400.woff2", "/fonts/almarai-400.woff2"],
};

export const NAV_LINKS = [
  { label: "Habitaciones", href: "/habitaciones" },
  { label: "Experiencias", href: "/experiencias" },
  { label: "Contacto", href: "/contacto" },
];

export const LEGAL_LINKS = [
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Términos de uso", href: "/terminos-de-uso" },
];
