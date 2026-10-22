import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface ClientSiteConfig extends SiteMetadata {
  /** Nombre corto que se dibuja como logotipo de texto en cabecera y footer */
  logoText: string;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    /** Ciudad/zona que se muestra en la tarjeta de reserva */
    area: string;
    /** Consulta del mapa embebido (Google Maps `q=`) */
    mapQuery: string;
    mapsUrl: string;
  };
  /** Enlace externo de reservas (Airbnb, Booking, motor propio…) */
  bookingUrl: string;
  socials: NavLink[];
  /** Color de la barra del navegador en móvil (meta theme-color) */
  themeColor: string;
  /** Fuentes de /public/fonts precargadas en <head>; deben coincidir con theme.css */
  preloadFonts: string[];
}

// Plantilla: reemplaza el dominio, la marca y los datos de contacto por los del cliente real.
const CLIENT_DOMAIN = "plantilla-pinevalley.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Pine Valley",
  logoText: "PINE VALLEY",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Pine Valley — Una escapada moderna al lujo",
  description:
    "Descubre un refugio diseñado con cuidado, donde la arquitectura contemporánea se encuentra con la naturaleza: el destino perfecto para relajarte, reconectar y desconectar.",
  locale: "es_CO",
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "+1 (555) 123-4567",
    phoneHref: "tel:+15551234567",
    email: "hola@ejemplo.com",
    address: "Calle Ejemplo 123, Tu ciudad, Región 00000, País",
    area: "Tu ciudad, Región",
    mapQuery: "Aspen, Colorado",
    mapsUrl: "https://maps.google.com/?q=Aspen%2C%20Colorado",
  },
  bookingUrl: "https://www.airbnb.com/",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Airbnb", href: "https://www.airbnb.com/" },
  ],
  themeColor: "#3b82c4",
  preloadFonts: ["/fonts/inter-400.woff2", "/fonts/general-sans-600.woff2"],
};

/** Título de página con el sufijo de marca ("Página — <título SEO del sitio>"). */
export function pageTitle(page?: string): string {
  return page ? `${page} — ${siteConfig.name}` : siteConfig.title;
}

/** Anclas de la landing (deben coincidir con los `id` de las secciones). */
export const MENU_LINKS: NavLink[] = [
  { label: "Inicio", href: "/#home" },
  { label: "Galería", href: "/#gallery" },
  { label: "Comodidades", href: "/#amenities" },
  { label: "Habitaciones", href: "/#rooms" },
  { label: "Opiniones", href: "/#reviews" },
  { label: "Reservas", href: "/#booking" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Inicio", href: "/#home" },
  { label: "Galería", href: "/#gallery" },
  { label: "Comodidades", href: "/#amenities" },
  { label: "Reservas", href: "/#booking" },
];
