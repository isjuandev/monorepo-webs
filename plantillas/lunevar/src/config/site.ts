import { type SiteMetadata, normalizeSiteUrl } from "@repo/utils";

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

const CLIENT_DOMAIN = "lunevar.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Lunevar",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Lunevar | Sitio Web Oficial",
  description: "Sitio web oficial de Lunevar.",
  locale: "es_CO",
  contact: {},
  socials: {},
};
