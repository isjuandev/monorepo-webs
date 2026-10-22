import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface NavLink {
  label: string;
  href: string;
  /** Hora decorativa que acompaña al enlace en el menú mobile */
  time?: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface ClientSiteConfig extends SiteMetadata {
  /** Logotipo de texto de la cabecera */
  logoText: string;
  /** Logotipo gigante del pie (suele ser el mismo texto en mayúsculas) */
  wordmark: string;
  /** Línea de copyright del pie (se antepone "© <año>") */
  legalName: string;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    /** Número de WhatsApp solo con dígitos (código de país incluido) */
    whatsapp: string;
    /** Horario de atención que acompaña al enlace de WhatsApp */
    whatsappHours: string;
    pressEmail: string;
    address: string;
    /** Destino de la ruta de Google Maps en "Cómo llegar" */
    mapsDestination: string;
  };
  socials: {
    instagram: string;
  };
  /** Símbolo de moneda de los precios (los importes viven en content.ts) */
  currencySymbol: string;
  /** Color de la barra del navegador en móvil (meta theme-color) */
  themeColor: string;
  /** Fuentes de /public/fonts precargadas en <head>; deben coincidir con theme.css */
  preloadFonts: string[];
}

// Plantilla: reemplaza el dominio, la marca y los datos de contacto por los del cliente real.
const CLIENT_DOMAIN = "lunevar.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Almara",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Almara — Un retiro en el desierto que vive al ritmo del sol",
  description:
    "Veinticuatro suites de piedra y sombra, una casa de longevidad y una mesa larga bajo las estrellas. Planea una estancia al ritmo de la luz. Sitio de retiro de ejemplo.",
  locale: "es_CO",
  ogImage: "/images/og-image.jpg",
  logoText: "ALMARA",
  wordmark: "ALMARA",
  legalName: "Almara Retiros",
  contact: {
    email: "reservas@example.com",
    phone: "+57 300 000 0000",
    phoneHref: "tel:+573000000000",
    whatsapp: "573000000000",
    whatsappHours: "05:00–23:00",
    pressEmail: "prensa@example.com",
    address: "Dirección del retiro",
    mapsDestination: "Dirección del retiro",
  },
  socials: {
    instagram: "https://www.instagram.com/",
  },
  currencySymbol: "$",
  themeColor: "#2a1d14",
  preloadFonts: ["/fonts/fraunces-roman.woff2", "/fonts/hanken-grotesk.woff2"],
};

/** Título de página con el sufijo de marca ("Página — <marca>"). */
export function pageTitle(page?: string): string {
  return page ? `${page} — ${siteConfig.name}` : siteConfig.title;
}

export const PLAN_HREF = "/plan-your-stay";

export const MENU_LINKS: NavLink[] = [
  { label: "Inicio", href: "/", time: "05:00" },
  { label: "Suites", href: "/suites", time: "05:48" },
  { label: "Un día aquí", href: "/a-day-here", time: "07:30" },
  { label: "Longevidad", href: "/longevity", time: "10:00" },
  { label: "Gastronomía", href: "/dining", time: "19:30" },
  { label: "Diario", href: "/journal", time: "23:30" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Estancia",
    links: [
      { label: "Suites", href: "/suites" },
      { label: "Longevidad", href: "/longevity" },
      { label: "Gastronomía", href: "/dining" },
      { label: "Planea tu estancia", href: PLAN_HREF },
    ],
  },
  {
    title: "Leer",
    links: [
      { label: "Un día aquí", href: "/a-day-here" },
      { label: "Diario", href: "/journal" },
    ],
  },
];
