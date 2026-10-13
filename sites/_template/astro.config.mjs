import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { siteConfig } from "./src/config/site";

export default defineConfig({
  site: process.env.SITE_URL || siteConfig.url,
  output: "static",
  integrations: [preact(), sitemap()],
});
