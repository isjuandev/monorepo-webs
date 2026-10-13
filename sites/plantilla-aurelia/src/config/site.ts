import { type SiteMetadata, normalizeSiteUrl } from "@repo/utils";

export interface ClientSiteConfig extends SiteMetadata {
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    city?: string;
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
}

const CLIENT_DOMAIN = "aurelia.example.com";

export const siteConfig: ClientSiteConfig = {
  name: "Aurelia Resort",
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: "Aurelia",
  description: "Hotel template for Framer. Experience Timeless Luxury at Aurelia Resort, Ibiza.",
  locale: "en_US",
  contact: {
    phone: "+34 971 123 456",
    email: "hello@aureliaresort.com",
    address: "Carrer Punta Blanca 5, 07849 Santa Eulària des Riu",
    city: "Ibiza, Spain",
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
};
