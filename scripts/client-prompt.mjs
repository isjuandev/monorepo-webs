#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITES_DIR = path.join(ROOT_DIR, "sites");
const RECURSOS_DIR = path.join(ROOT_DIR, "recursos");
const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function printUsage() {
  console.log(`
Uso:
  pnpm client-prompt <slug-cliente> [opciones]

Lee recursos/<slug-cliente>/brief.md y genera el prompt de creación del sitio,
con los datos del brief ya rellenados. Por defecto lo copia al portapapeles.

Opciones:
  --base <rama>    Rama desde la que se crea la rama del cliente (por defecto: cliente/la-guaca)
  --no-copy        No copiar al portapapeles (solo imprimir)
  --out <archivo>  Guardar el prompt en un archivo
  -h, --help       Mostrar esta ayuda
`);
}

function fail(message) {
  console.error(`\x1b[31m✖ Error: ${message}\x1b[0m`);
  process.exit(1);
}

function parseArgs(argv) {
  const result = { slug: "", base: "cliente/la-guaca", copy: true, out: "", help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--no-copy") {
      result.copy = false;
    } else if (arg === "--base") {
      result.base = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (arg === "--out") {
      result.out = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (!arg.startsWith("--") && !result.slug) {
      result.slug = arg.trim();
    } else {
      fail(`opción no reconocida: ${arg}`);
    }
  }
  return result;
}

function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

/** Divide el brief en secciones "## " y, dentro de "Habitaciones", en habitaciones "### " */
function parseBrief(text) {
  const sections = {};
  let section = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      section = { title: normalize(line.slice(3)), lines: [], rooms: [] };
      sections[section.title] = section;
      continue;
    }
    if (!section) {
      continue;
    }
    if (line.startsWith("### ")) {
      section.rooms.push(line.slice(4).trim());
    }
    section.lines.push(line);
  }
  return sections;
}

/** Valor de un campo "- Etiqueta: valor" de una sección (busca por prefijo, sin acentos) */
function field(section, label) {
  const target = normalize(label);
  for (const line of section?.lines ?? []) {
    const match = /^- ([^:]+):\s*(.*)$/.exec(line);
    if (match && normalize(match[1]).startsWith(target)) {
      return match[2].trim();
    }
  }
  return "";
}

function slugify(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Valor limpio: sin aclaraciones entre paréntesis y sin "Pendiente" */
function cleanValue(value) {
  return value.split(" (")[0].trim();
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) {
    return {};
  }
  const counts = {};
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name !== ".gitkeep") {
        const rel = path.relative(dir, full).split(path.sep);
        const key = rel.length > 2 ? rel.slice(0, -1).join("/") : rel[0];
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
  };
  walk(dir);
  return counts;
}

function buildPrompt(ctx) {
  const motelLines = ctx.motel
    ? [
        "   - Motel: redacta content.ts con la skill motel-copywriting (modo monorepo, §1.1): el tono y los datos salen del brief y de recursos/" +
          ctx.slug +
          "/textos/. Sigue la verificación de .agents/skills/motel-copywriting/references/verificacion.md.",
      ]
    : ["   - No es motel: usa la voz de marca del brief sin la skill motel-copywriting."];

  return [
    `Crea la web del cliente ${ctx.slug} siguiendo recursos/${ctx.slug}/brief.md.`,
    "",
    `Fuente única: la carpeta recursos/${ctx.slug}/. Del brief salen plantilla base, nombre comercial, dominio, locale, tipo de negocio, tono, contacto, marca, habitaciones, páginas y cambios de diseño. Si falta brief.md, si falta un dato obligatorio (plantilla, nombre, dominio, locale) o si algo se contradice, detente y avísame. Los demás campos vacíos son pendientes: no inventes datos. Sobre recursos/ solo haces dos cosas: leerla y subirla a su rama de cliente con el paso 0.5. No modifiques ni borres nada dentro de ella.`,
    "",
    "Datos clave (ya rellenados desde el brief):",
    `- Slug: ${ctx.slug}`,
    `- Plantilla base: ${ctx.plantilla}`,
    `- Nombre comercial: ${ctx.name}`,
    `- Dominio: ${ctx.domain}`,
    `- Locale: ${ctx.locale}`,
    `- Tipo de negocio: ${ctx.tipo}`,
    `- Rama base: ${ctx.base}`,
    `- Rama del cliente: ${ctx.branch}`,
    `- Rutas para QA: ${ctx.routes}`,
    `- Recursos disponibles: ${ctx.resources}`,
    `- Campos pendientes en el brief: ${ctx.pending}`,
    "",
    "Paso 0: comprobaciones y rama (antes de tocar nada):",
    `1. Verifica que recursos/${ctx.slug}/brief.md existe y que tiene los datos obligatorios.`,
    "2. git status --short debe salir vacío. Si no, detente y avísame; sin stash, reset ni borrado.",
    `3. git checkout ${ctx.base}`,
    `4. git pull origin ${ctx.base}`,
    `5. Verifica que la rama ${ctx.branch} no existe. Si existe, detente y avísame.`,
    `6. git checkout -b ${ctx.branch}`,
    `Todo el trabajo va en esa rama. La rama parte del estado actual de ${ctx.base}, pero el sitio de ese cliente de origen no se toca.`,
    "",
    "Paso 0.5: recursos del cliente a su rama (después de validar el brief):",
    `1. git add -f recursos/${ctx.slug}`,
    `2. Verifica que lo staged solo contiene archivos bajo recursos/${ctx.slug}/ (git diff --cached --name-only). Si hay algo más, detente y avísame.`,
    `3. Commit separado: "chore(${ctx.slug}): sube recursos del cliente (brief, fotos, marca y fuentes)".`,
    `No modifiques .gitignore. Esta excepción aplica solo a recursos/${ctx.slug}/ en la rama ${ctx.branch}; no la repitas en otras ramas ni con otras carpetas de recursos/.`,
    "",
    "Instrucciones:",
    `1. Aplica la skill codebase-context y lee el CUSTOMIZE.md de la plantilla base (sites/${ctx.plantilla}/CUSTOMIZE.md).`,
    "2. Genera el sitio con el generador, usando los valores del brief (nunca copies a mano ni modifiques la plantilla de origen):",
    `   pnpm new-client-site ${ctx.slug} --from ${ctx.plantilla} --name "${ctx.name}" --domain "${ctx.domain}" --locale "${ctx.locale}"`,
    "3. Personaliza en este orden, sin hardcodear nada en componentes (AGENTS.md §6):",
    `   a) sites/${ctx.slug}/src/config/site.ts`,
    `   b) sites/${ctx.slug}/src/styles/theme.css`,
    `   c) sites/${ctx.slug}/src/data/content.ts`,
    `   d) sites/${ctx.slug}/public/: reemplaza todas las imágenes de la plantilla con los assets de recursos/${ctx.slug}/marca/ y recursos/${ctx.slug}/fotos/ (optimizados a WebP, según la guía de CUSTOMIZE.md).`,
    ...motelLines,
    `4. Ajusta la estructura según el brief: quita o añade páginas en sites/${ctx.slug}/src/ (pages y components).`,
    "5. SEO: conserva sitemap() en astro.config.mjs, src/pages/robots.txt.ts, <SEO /> dentro de BaseLayout.astro, la página 404, metadatos por página y un solo H1 por página, con el mismo tono.",
    "6. Stack: el definido en AGENTS.md §2. Sin react ni react-dom, y sin importar código entre sitios.",
    `7. Limítate a sites/${ctx.slug}/ y a docs/research/${ctx.slug}/ (guía de voz, si aplica). Si necesitas tocar packages/*, scripts/, sites/${ctx.plantilla}/, otra carpeta de recursos/ o cualquier otro sitio, detente y pregúntame.`,
    "",
    "Verificación obligatoria:",
    ...(ctx.motel
      ? [
          `- Motel: el checklist de .agents/skills/motel-copywriting/references/verificacion.md cumplido y tono consistente en todo el sitio.`,
        ]
      : []),
    `- pnpm customize:check ${ctx.slug} --strict en verde. Si faltan datos, repórtalos y dime qué bloquea la entrega.`,
    "- pnpm verify en verde.",
    `- SITE_FOLDER=${ctx.slug} QA_ROUTES="${ctx.routes}" pnpm test:visual, en desktop y en mobile, sin overflow horizontal. Ajusta las rutas a las páginas reales del sitio.`,
    "",
    "Cierre:",
    `- Commits pequeños en ${ctx.branch}: primero los recursos (paso 0.5), después el sitio. No hagas push, PR ni despliegue sin que yo lo pida.`,
    `- Resumen con: rama, páginas creadas, recursos usados y faltantes, tono y supuestos, datos pendientes, y pasos de despliegue según docs/deploy-coolify.md. Incluye también que los recursos y datos que vengan de otro cliente son provisionales, si lo son.`,
    "",
    `Brief completo (copia de recursos/${ctx.slug}/brief.md, fuente de verdad):`,
    "----- INICIO BRIEF -----",
    ctx.briefText.trim(),
    "----- FIN BRIEF -----",
    "",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.slug) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }
  if (!KEBAB_CASE_REGEX.test(args.slug)) {
    fail(`el slug "${args.slug}" no es kebab-case válido.`);
  }
  if (!args.base) {
    fail("--base necesita una rama.");
  }

  const clientDir = path.join(RECURSOS_DIR, args.slug);
  const briefPath = path.join(clientDir, "brief.md");
  if (!fs.existsSync(briefPath)) {
    fail(`no existe ${path.relative(ROOT_DIR, briefPath)}.`);
  }

  const briefText = stripHtmlComments(fs.readFileSync(briefPath, "utf8"));
  const sections = parseBrief(briefText);
  const generation = sections[normalize("Generación")];

  const required = {
    "Plantilla base": field(generation, "Plantilla base"),
    Slug: field(generation, "Slug"),
    "Nombre comercial": field(generation, "Nombre comercial"),
    Dominio: field(generation, "Dominio"),
    Locale: field(generation, "Locale"),
    "Tipo de negocio": field(generation, "Tipo de negocio"),
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !cleanValue(value) || /pendiente|\|/i.test(cleanValue(value)))
    .map(([label]) => label);
  if (missing.length > 0) {
    fail(`el brief no tiene completos estos campos obligatorios: ${missing.join(", ")}.`);
  }

  const briefSlug = required.Slug.trim();
  if (briefSlug !== args.slug) {
    fail(`el slug del brief ("${briefSlug}") no coincide con la carpeta recursos/${args.slug}/.`);
  }

  const plantilla = cleanValue(required["Plantilla base"]);
  if (!fs.existsSync(path.join(SITES_DIR, plantilla, "package.json"))) {
    fail(`la plantilla "${plantilla}" no existe en sites/.`);
  }

  const localeMatch = /\(([a-z]{2}_[A-Z]{2})\)/.exec(required.Locale);
  const locale = localeMatch ? localeMatch[1] : cleanValue(required.Locale);
  const name = cleanValue(required["Nombre comercial"]);
  const domain = cleanValue(required.Dominio);
  const tipo = required["Tipo de negocio"];
  const motel = /motel/i.test(tipo);
  const branch = motel ? `cliente/motel-${args.slug}` : `cliente/${args.slug}`;

  const rooms = (generation && sections[normalize("Habitaciones")]?.rooms) ?? [];
  const routes = [
    "/",
    ...(rooms.length > 0 ? ["/habitaciones"] : []),
    ...rooms.map((room) => `/habitaciones/${slugify(room)}`),
  ].join(",");

  const resourcesCounts = countFiles(clientDir);
  const resourcesTotal = Object.values(resourcesCounts).reduce((sum, value) => sum + value, 0);
  const resources = `${resourcesTotal} archivos (${Object.keys(resourcesCounts).length} carpetas)`;
  const pending = (briefText.match(/pendiente/gi) ?? []).length;

  const prompt = buildPrompt({
    slug: args.slug,
    plantilla,
    name,
    domain,
    locale,
    tipo,
    motel,
    branch,
    base: args.base,
    routes,
    resources,
    pending: String(pending),
    briefText,
  });

  process.stdout.write(`${prompt}\n`);

  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), prompt);
  }
  if (args.copy) {
    const result = spawnSync("pbcopy", { input: prompt });
    if (result.error || result.status !== 0) {
      console.error("Aviso: no pude copiar al portapapeles (pbcopy no disponible).");
    }
  }

  console.error(
    `\nPrompt generado para ${args.slug}: plantilla ${plantilla}, rama ${branch} desde ${args.base}, ${pending} campos pendientes, ${resources}.${
      args.copy ? " Copiado al portapapeles." : ""
    }`
  );
  if (!motel) {
    console.error(
      "Aviso: el tipo de negocio no es motel; el prompt no incluye la skill motel-copywriting."
    );
  }
}

main();
