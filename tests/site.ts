import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(__dirname, "..");

/**
 * Sitio que evalúa la suite: SITE_FOLDER es el slug (o un nombre antiguo como
 * "plantilla-asterre" o "_template") y se busca en clientes/ y plantillas/.
 */
export function resolveQaSite(name = process.env.SITE_FOLDER || "_base") {
  const slug = name
    .trim()
    .replace(/^(sites|plantillas|clientes)\//, "")
    .replace(/^plantilla-/, "")
    .replace(/^_template$/, "_base");
  const rel = ["clientes", "plantillas"]
    .map((folder) => `${folder}/${slug}`)
    .find((candidate) => fs.existsSync(path.join(ROOT_DIR, candidate, "package.json")));
  if (!rel) {
    throw new Error(`SITE_FOLDER="${name}" no existe en clientes/ ni en plantillas/.`);
  }
  const dir = path.join(ROOT_DIR, rel);
  const siteConfig = fs.readFileSync(path.join(dir, "src", "config", "site.ts"), "utf8");
  const domain = /const CLIENT_DOMAIN\s*=\s*"([^"]*)"/.exec(siteConfig)?.[1] ?? "";
  return {
    slug,
    rel,
    dir,
    dist: path.join(dir, "dist"),
    qa: path.join(dir, "docs", "qa"),
    snapshots: path.join(dir, "docs", "referencias", "snapshots"),
    // Host canónico: SITE_URL (build arg de producción) o CLIENT_DOMAIN de src/config/site.ts
    host: process.env.SITE_URL ? new URL(process.env.SITE_URL).host : domain,
  };
}
