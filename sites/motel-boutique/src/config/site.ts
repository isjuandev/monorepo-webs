import { normalizeSiteUrl, type SiteMetadata } from "@repo/utils";

export interface ClientSiteConfig extends SiteMetadata {
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
}

const CLIENT_DOMAIN = "hoteles-template.nexobite.com";

export const siteConfig: ClientSiteConfig = {
  name: "Motel Boutique",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Motel Boutique | Suites privadas para adultos",
  description:
    "Plantilla para moteles y hoteles boutique: suites, tarifas por horas, servicios especiales y contacto por WhatsApp.",
  locale: "es_CO",
  contact: {
    phone: "+57 600 000 0000",
    whatsapp: "573000000000",
    email: "contacto@ejemplo.com",
    address: "Calle 00 # 00-00, Ciudad",
  },
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
};
