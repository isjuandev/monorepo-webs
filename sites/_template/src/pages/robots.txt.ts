import { siteConfig } from "@/config/site";
import { generateRobotsTxt } from "@repo/utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href : siteConfig.url;
  return new Response(generateRobotsTxt(siteUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
