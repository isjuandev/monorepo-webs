#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  BASE_TEMPLATE,
  clientRel,
  DEFAULT_TEMPLATE,
  ROOT_DIR,
  resolveSite,
  templateRel,
} from "./lib/paths.mjs";

function printUsage() {
  console.log(`
Uso:
  pnpm cliente:nuevo <slug-cliente> [opciones]

Crea clientes/<slug>/ copiando una plantilla de plantillas/ (con --plantilla, crea plantillas/<slug>/).

Ejemplos:
  pnpm cliente:nuevo cafe-aurora --name "Café Aurora" --domain "cafeaurora.co"
  pnpm cliente:nuevo hotel-sol --from hotellia --name "Hotel Sol" --domain "hotelsol.co"

Opciones:
  --slug <slug>              Identificador en kebab-case (ej: cafe-aurora)
  --from <plantilla>         Plantilla de plantillas/ a copiar (por defecto: ${DEFAULT_TEMPLATE};
                             con --plantilla: ${BASE_TEMPLATE}). Conserva diseño, páginas y contenido.
  --plantilla                Crea una plantilla nueva en plantillas/<slug>/ (lo usa plantilla:clonar)
  --name "<Nombre>"          Nombre comercial del cliente
  --domain "<dominio.com>"   Dominio del cliente (sin protocolo)
  --title "<Título SEO>"     Título SEO principal
  --description "<Texto>"    Descripción meta para SEO
  --locale "<locale>"        Configuración regional (por defecto: "es_CO")
  --phone "<teléfono>"       Teléfono de contacto real (opcional)
  --whatsapp "<número>"      Número de WhatsApp real (opcional)
  --email "<correo>"         Correo electrónico de contacto real (opcional)
  --address "<dirección>"    Dirección física real (opcional)
  --skip-checks              Omitir instalación y comprobación inicial (check + build)
  --help, -h                 Mostrar esta ayuda
`);
}

/**
 * Parsea argumentos de línea de comandos
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const result = {
    slug: "",
    name: "",
    from: "",
    plantilla: false,
    domain: "",
    title: "",
    description: "",
    locale: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    skipChecks: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--skip-checks") {
      result.skipChecks = true;
    } else if (arg === "--plantilla") {
      result.plantilla = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextVal = argv[i + 1];
      if (nextVal !== undefined && !nextVal.startsWith("--")) {
        if (key in result) {
          result[key] = nextVal.trim();
        }
        i += 1;
      }
    } else if (!result.slug) {
      result.slug = arg.trim();
    }
  }
  return result;
}

/**
 * Convierte "cafe-aurora" en "Cafe Aurora" cuando no se especifica --name
 * @param {string} slug
 */
function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Copia recursivamente excluyendo artefactos de compilación y node_modules
 * @param {string} src
 * @param {string} dest
 */
function copyTemplateDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name === ".astro" ||
      entry.name === ".turbo" ||
      // Documentación y manifiesto son de la plantilla de origen, no del sitio nuevo
      (src === sourceDir && ["docs", "plantilla.json", "cliente.json"].includes(entry.name))
    ) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.slug) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (!KEBAB_CASE_REGEX.test(args.slug) || args.slug === "template") {
  console.error(
    `\x1b[31m✖ Error: El slug "${args.slug}" no es válido. Usa kebab-case en minúsculas (ej. "clinica-dental").\x1b[0m`
  );
  process.exit(1);
}

const kind = args.plantilla ? "plantilla" : "cliente";
const source = resolveSite(args.from || (args.plantilla ? BASE_TEMPLATE : DEFAULT_TEMPLATE));
if (source?.kind !== "plantilla") {
  console.error(
    `\x1b[31m✖ Error: "${args.from}" no es una plantilla de plantillas/ (los clientes no se copian).\x1b[0m`
  );
  process.exit(1);
}
const sourceDir = source.dir;
const fromTemplate = source.slug === BASE_TEMPLATE;

if (resolveSite(args.slug)) {
  console.error(
    `\x1b[31m✖ Error: Ya existe un sitio "${args.slug}" (${resolveSite(args.slug).rel}). Se aborta para no sobrescribir archivos existentes.\x1b[0m`
  );
  process.exit(1);
}
const siteRel = args.plantilla ? templateRel(args.slug) : clientRel(args.slug);
const targetSiteDir = path.join(ROOT_DIR, siteRel);

const brandName = args.name || slugToTitle(args.slug);
const clientDomain = (args.domain || `${args.slug}.example.com`)
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");
const siteTitle = args.title || `${brandName} | Sitio Web Oficial`;
const siteDescription = args.description || `Sitio web oficial de ${brandName}.`;
const packageName = args.plantilla ? `@plantillas/${args.slug}` : `@clientes/${args.slug}`;

console.log(`\n▶ Creando ${kind} en ${siteRel} desde ${source.rel}...`);

// 1. Copiar la plantilla de origen (queda intacta) hacia clientes/<slug> o plantillas/<slug>
copyTemplateDir(sourceDir, targetSiteDir);

// Manifiesto: en un cliente registra la plantilla de origen (customize:check sabe qué restos
// buscar); en una plantilla nueva deja los campos que completa plantilla:clonar
const manifest = args.plantilla
  ? {
      nombre: brandName,
      descripcion: "",
      idioma: (args.locale || "es_CO").slice(0, 2),
      negocio: [],
      origen: "",
      demo: "",
      marcas: [],
      placeholders: [],
    }
  : { nombre: brandName, plantilla: source.slug, estado: "en-construccion", coolify: "" };
fs.writeFileSync(
  path.join(targetSiteDir, args.plantilla ? "plantilla.json" : "cliente.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

// 2. Actualizar package.json del nuevo cliente
const pkgJsonPath = path.join(targetSiteDir, "package.json");
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
pkgJson.name = packageName;
fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`, "utf8");

// 3. Generar o ajustar src/config/site.ts sin inventar datos comerciales no suministrados
const siteConfigPath = path.join(targetSiteDir, "src", "config", "site.ts");

/**
 * Ajusta el site.ts copiado de otra plantilla: el dominio siempre, y el resto de campos
 * de nivel superior solo si se pasaron explícitamente. Devuelve los campos no ajustados.
 */
function patchCopiedSiteConfig() {
  let content = fs.readFileSync(siteConfigPath, "utf8");
  const pending = [];
  const patch = (label, regex, value) => {
    if (!regex.test(content)) {
      pending.push(label);
      return;
    }
    content = content.replace(regex, (_m, prefix) => `${prefix} ${JSON.stringify(value)}`);
  };
  patch("CLIENT_DOMAIN", /^(const CLIENT_DOMAIN =)\s*"[^"]*"/m, clientDomain);
  if (args.name) patch("name", /^( {2}name:)\s*"(?:[^"\\]|\\.)*"/m, brandName);
  if (args.title) patch("title", /^( {2}title:)\s*"(?:[^"\\]|\\.)*"/m, siteTitle);
  if (args.description) {
    patch("description", /^( {2}description:)\s*"(?:[^"\\]|\\.)*"/m, siteDescription);
  }
  if (args.locale) patch("locale", /^( {2}locale:)\s*"(?:[^"\\]|\\.)*"/m, args.locale);
  fs.writeFileSync(siteConfigPath, content, "utf8");
  return pending;
}
const contactLines = [];
if (args.phone) {
  contactLines.push(`    phone: ${JSON.stringify(args.phone)},`);
}
if (args.whatsapp) {
  contactLines.push(`    whatsapp: ${JSON.stringify(args.whatsapp)},`);
}
if (args.email) {
  contactLines.push(`    email: ${JSON.stringify(args.email)},`);
}
if (args.address) {
  contactLines.push(`    address: ${JSON.stringify(args.address)},`);
}

const contactBlock =
  contactLines.length > 0 ? `  contact: {\n${contactLines.join("\n")}\n  },` : "  contact: {},";

const siteConfigContent = fromTemplate
  ? `import { type SiteMetadata, normalizeSiteUrl } from "@repo/utils";

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

const CLIENT_DOMAIN = ${JSON.stringify(clientDomain)};

export const siteConfig: ClientSiteConfig = {
  name: ${JSON.stringify(brandName)},
  domain: CLIENT_DOMAIN,
  url: normalizeSiteUrl(CLIENT_DOMAIN),
  title: ${JSON.stringify(siteTitle)},
  description: ${JSON.stringify(siteDescription)},
  locale: ${JSON.stringify(args.locale || "es_CO")},
${contactBlock}
  socials: {},
};
`
  : "";

let unpatchedFields = [];
if (fromTemplate) {
  fs.writeFileSync(siteConfigPath, siteConfigContent, "utf8");
} else {
  unpatchedFields = patchCopiedSiteConfig();
  // Mantiene el formato de Biome tras reemplazar valores largos
  execSync(`pnpm exec biome format --write ${siteRel}/src/config/site.ts`, {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });
}

// 4. Carpeta de documentación del sitio (investigación, resúmenes del agente, referencias y QA)
fs.mkdirSync(path.join(targetSiteDir, "docs"), { recursive: true });
fs.writeFileSync(
  path.join(targetSiteDir, "docs", ".gitkeep"),
  `# Investigación, referencias y QA de ${args.slug}\n`,
  "utf8"
);

// 5. Ejecutar comprobaciones iniciales salvo que se indique --skip-checks
if (!args.skipChecks) {
  console.log("▶ Vinculando workspace y ejecutando comprobaciones iniciales...");
  execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });
  execSync("node scripts/verify-isolation.mjs", { cwd: ROOT_DIR, stdio: "inherit" });
  execSync("pnpm lint", { cwd: ROOT_DIR, stdio: "inherit" });
  execSync(`pnpm --filter ${packageName} check`, { cwd: ROOT_DIR, stdio: "inherit" });
  execSync(`pnpm --filter ${packageName} build`, { cwd: ROOT_DIR, stdio: "inherit" });
}

if (!fromTemplate && !args.plantilla) {
  console.log(`
\x1b[33m⚠ Sitio copiado desde ${source.rel}. Personalízalo en 4 puntos (ver ${siteRel}/CUSTOMIZE.md):\x1b[0m
  1. Identidad y contacto: ${siteRel}/src/config/site.ts${
    unpatchedFields.length > 0 ? ` (no se pudo ajustar: ${unpatchedFields.join(", ")})` : ""
  }
  2. Marca visual:         ${siteRel}/src/styles/theme.css
  3. Textos y datos:       ${siteRel}/src/data/content.ts
  4. Imágenes y logos:     ${siteRel}/public/
Cuando termines: pnpm cliente:check ${args.slug} --strict`);
  execSync(`node scripts/customize-check.mjs ${args.slug}`, { cwd: ROOT_DIR, stdio: "inherit" });
}

console.log(`
\x1b[32m✔ Sitio "${brandName}" (${packageName}) creado y verificado con éxito.\x1b[0m

Archivos principales:
  - Configuración de dominio y SEO: ${siteRel}/src/config/site.ts
  - Estilos y variables de marca:   ${siteRel}/src/styles/theme.css
  - Página de inicio:               ${siteRel}/src/pages/index.astro
  - Investigación / Referencias:    ${siteRel}/docs/

Comandos para trabajar en este cliente:
  pnpm --filter ${packageName} dev
  pnpm --filter ${packageName} check
  pnpm --filter ${packageName} build
`);
