import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX } from "./brief.mjs";
import {
  BASE_TEMPLATE,
  CLIENTES_DIR,
  clientRel,
  DEFAULT_TEMPLATE,
  PLANTILLAS_DIR,
  ROOT_DIR,
  resolveSite,
  templateRel,
} from "./paths.mjs";

/**
 * Lógica de generación de sitios (clientes y plantillas) a partir de una plantilla.
 * Sin efectos al importarse: no lee process.argv ni llama a process.exit.
 */

/** Error de validación con el mensaje listo para mostrar (distinto de un fallo de subproceso). */
export class NewSiteError extends Error {}

/**
 * Parsea los argumentos de línea de comandos de `pnpm cliente:nuevo`.
 * @param {string[]} argv
 */
export function parseArgs(argv) {
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
 * @param {string} sourceDir Raíz de la plantilla de origen
 */
function copyTemplateDir(src, dest, sourceDir) {
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
      copyTemplateDir(srcPath, destPath, sourceDir);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/** Indica si `dir` está estrictamente dentro de `parent` (nunca es la propia carpeta `parent`). */
function isInside(parent, dir) {
  const rel = path.relative(parent, dir);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

/**
 * Valida las opciones y genera el sitio. Lanza NewSiteError (con el mensaje a mostrar) si no es válido.
 * @param {ReturnType<typeof parseArgs>} args
 * @param {{ log?: (mensaje: string) => void }} [opciones]
 */
export function generateSite(args, { log = console.log } = {}) {
  if (!KEBAB_CASE_REGEX.test(args.slug) || args.slug === "template") {
    throw new NewSiteError(
      `\x1b[31m✖ Error: El slug "${args.slug}" no es válido. Usa kebab-case en minúsculas (ej. "clinica-dental").\x1b[0m`
    );
  }

  const kind = args.plantilla ? "plantilla" : "cliente";
  const source = resolveSite(args.from || (args.plantilla ? BASE_TEMPLATE : DEFAULT_TEMPLATE));
  if (source?.kind !== "plantilla") {
    throw new NewSiteError(
      `\x1b[31m✖ Error: "${args.from}" no es una plantilla de plantillas/ (los clientes no se copian).\x1b[0m`
    );
  }
  const sourceDir = source.dir;
  const fromTemplate = source.slug === BASE_TEMPLATE;

  const existing = resolveSite(args.slug);
  if (existing) {
    throw new NewSiteError(
      `\x1b[31m✖ Error: Ya existe un sitio "${args.slug}" (${existing.rel}). Se aborta para no sobrescribir archivos existentes.\x1b[0m`
    );
  }
  const siteRel = args.plantilla ? templateRel(args.slug) : clientRel(args.slug);
  const targetSiteDir = path.join(ROOT_DIR, siteRel);
  // Defensa en profundidad: el destino debe quedar dentro de plantillas/ o clientes/
  if (!isInside(PLANTILLAS_DIR, targetSiteDir) && !isInside(CLIENTES_DIR, targetSiteDir)) {
    throw new NewSiteError(
      `\x1b[31m✖ Error: El destino "${siteRel}" queda fuera de plantillas/ y clientes/.\x1b[0m`
    );
  }

  const brandName = args.name || slugToTitle(args.slug);
  const clientDomain = (args.domain || `${args.slug}.example.com`)
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const siteTitle = args.title || `${brandName} | Sitio Web Oficial`;
  const siteDescription = args.description || `Sitio web oficial de ${brandName}.`;
  const packageName = args.plantilla ? `@plantillas/${args.slug}` : `@clientes/${args.slug}`;

  log(`\n▶ Creando ${kind} en ${siteRel} desde ${source.rel}...`);

  // 1. Copiar la plantilla de origen (queda intacta) hacia clientes/<slug> o plantillas/<slug>
  copyTemplateDir(sourceDir, targetSiteDir, sourceDir);

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

  // 2. Actualizar package.json del nuevo sitio
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
  const patchCopiedSiteConfig = () => {
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
  };
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

  let pending = [];
  if (fromTemplate) {
    fs.writeFileSync(siteConfigPath, siteConfigContent, "utf8");
  } else {
    pending = patchCopiedSiteConfig();
    // Mantiene el formato de Biome tras reemplazar valores largos
    execFileSync("pnpm", ["exec", "biome", "format", "--write", `${siteRel}/src/config/site.ts`], {
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

  return {
    slug: args.slug,
    kind,
    siteRel,
    targetSiteDir,
    packageName,
    brandName,
    sourceRel: source.rel,
    fromTemplate,
    pending,
  };
}

/**
 * Ejecuta las comprobaciones posteriores a la generación: instalación, aislamiento, lint, check
 * y build (salvo con `skipChecks`) y, en clientes copiados de una plantilla con contenido, el
 * aviso de personalización y customize-check.
 * @param {ReturnType<typeof generateSite>} result
 * @param {{ log?: (mensaje: string) => void, skipChecks?: boolean }} [opciones]
 */
export function runSiteChecks(result, { log = console.log, skipChecks = false } = {}) {
  const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT_DIR, stdio: "inherit" });

  if (!skipChecks) {
    log("▶ Vinculando workspace y ejecutando comprobaciones iniciales...");
    run("pnpm", ["install"]);
    run("node", ["scripts/verify-isolation.mjs"]);
    run("pnpm", ["lint"]);
    run("pnpm", ["--filter", result.packageName, "check"]);
    run("pnpm", ["--filter", result.packageName, "build"]);
  }

  if (!result.fromTemplate && result.kind === "cliente") {
    const { siteRel, sourceRel, pending, slug } = result;
    log(`
\x1b[33m⚠ Sitio copiado desde ${sourceRel}. Personalízalo en 4 puntos (ver ${siteRel}/CUSTOMIZE.md):\x1b[0m
  1. Identidad y contacto: ${siteRel}/src/config/site.ts${
    pending.length > 0 ? ` (no se pudo ajustar: ${pending.join(", ")})` : ""
  }
  2. Marca visual:         ${siteRel}/src/styles/theme.css
  3. Textos y datos:       ${siteRel}/src/data/content.ts
  4. Imágenes y logos:     ${siteRel}/public/
Cuando termines: pnpm cliente:check ${slug} --strict`);
    run("node", ["scripts/customize-check.mjs", slug]);
  }
}
