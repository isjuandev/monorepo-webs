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

const CLIENT_DOMAIN = "clientedemo.com";

export const siteConfig: ClientSiteConfig = {
  name: "Cliente Demo",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Cliente Demo | Sitio Web Oficial",
  description: "Descripción del sitio web del cliente optimizada para SEO.",
  locale: "es_CO",
  contact: {
    phone: "+57 300 000 0000",
    whatsapp: "573000000000",
    email: "contacto@clientedemo.com",
  },
  socials: {
    instagram: "https://instagram.com/",
  },
};
