import { UNATTENDED_RULE } from "./prompts.mjs";

/** Inventario determinista de rutas: sitemap.xml, robots.txt y enlaces internos de la portada */
export async function discoverRoutes(url) {
  const origin = new URL(url).origin;
  const fetchText = async (target) => {
    try {
      const response = await fetch(target, { redirect: "follow" });
      return response.ok ? await response.text() : "";
    } catch {
      return "";
    }
  };
  const routes = new Set(["/"]);
  const toRoute = (href) => {
    try {
      const target = new URL(href, origin);
      if (target.origin !== origin) return null;
      if (
        /\.(png|jpe?g|webp|avif|svg|gif|css|js|xml|txt|ico|pdf|mp4|woff2?)$/i.test(target.pathname)
      ) {
        return null;
      }
      return target.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return null;
    }
  };

  const robots = await fetchText(`${origin}/robots.txt`);
  const sitemapUrls = [
    `${origin}/sitemap.xml`,
    ...[...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((match) => match[1]),
  ];
  const seenSitemaps = new Set();
  while (sitemapUrls.length > 0) {
    const sitemapUrl = sitemapUrls.shift();
    if (seenSitemaps.has(sitemapUrl) || seenSitemaps.size > 20) continue;
    seenSitemaps.add(sitemapUrl);
    const xml = await fetchText(sitemapUrl);
    for (const [, loc] of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      if (/\.xml$/i.test(loc)) sitemapUrls.push(loc);
      else {
        const route = toRoute(loc);
        if (route) routes.add(route);
      }
    }
  }

  const home = await fetchText(url);
  for (const [, href] of home.matchAll(/href="([^"#]+)/g)) {
    const route = toRoute(href);
    if (route) routes.add(route);
  }
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(home)?.[1]?.trim() ?? "";
  // Variantes de idioma (/de, /de/stays…): duplican rutas del idioma principal y no se clonan
  const all = [...routes].sort();
  const localeRoutes = all.filter((route) => {
    const match = /^\/([a-z]{2}(?:-[a-z]{2})?)(\/.*)?$/.exec(route);
    return match && all.includes(match[2] ?? "/");
  });
  return {
    origin,
    title,
    routes: all.filter((route) => !localeRoutes.includes(route)),
    localeRoutes,
    sitemaps: [...seenSitemaps],
    reachable: Boolean(home),
  };
}

/**
 * Prompt de clonado (skill clone-website, modo A — Plantilla).
 * - manual = false: para `pnpm plantilla:clonar`; rama, esqueleto y routes.json ya están hechos.
 * - manual = true: para pegar en una sesión de Claude; el modelo hace también git, generador y commits.
 */
export function buildClonePrompt({ url, slug, routesFile, routes, localeRoutes, manual = false }) {
  const localeNote =
    localeRoutes.length > 0
      ? `Variantes de idioma detectadas y excluidas (${localeRoutes.length}: ${localeRoutes.slice(0, 4).join(", ")}${localeRoutes.length > 4 ? ", …" : ""}): la plantilla va en un solo idioma, el principal. No las clones.`
      : "";
  const head = manual
    ? [
        "Paso 0 (antes de tocar nada):",
        "1. git status --short debe salir vacío. Si no, detente y avísame; sin stash, reset ni borrado.",
        "2. git checkout main && git pull origin main",
        `3. Verifica que la rama feat/${slug} y la carpeta plantillas/${slug}/ no existen. Si existen, detente y avísame.`,
        `4. git checkout -b feat/${slug}`,
        `5. pnpm cliente:nuevo ${slug} --plantilla --name "<marca ficticia>" --domain "${slug}.example.com" --skip-checks y luego pnpm install (crea plantillas/${slug}/ desde plantillas/_base/ con su plantilla.json).`,
        `6. Guarda en ${routesFile} este inventario de ${routes.length} rutas (sacado de sitemap.xml, robots.txt y los enlaces de la portada): ${routes.join(", ")}. Clónalas todas; si alguna no merece clonarse (duplicada, demo, legal genérica, 404), justifícalo en el resumen.`,
        ...(localeNote ? [`   ${localeNote}`] : []),
        `7. Commit: "feat(${slug}): base de la plantilla e inventario de rutas".`,
        "",
      ]
    : [
        "Ya hecho por el orquestador (no lo repitas):",
        `- Rama creada y plantilla base generada con pnpm cliente:nuevo ${slug} --plantilla (plantillas/${slug}/, dominio ${slug}.example.com, manifiesto plantillas/${slug}/plantilla.json).`,
        `- Inventario de rutas en ${routesFile} (${routes.length} rutas desde sitemap.xml, robots.txt y enlaces de la portada). Clónalas todas; si alguna no merece clonarse (duplicada, legal genérica, 404), justifícalo en el resumen.`,
        "No ejecutes git (ni commit, ni push, ni cambios de rama): el orquestador commitea al terminar.",
        ...(localeNote ? [`- ${localeNote}`] : []),
        "Trabajas sin supervisión: no preguntes; decide con el criterio de la skill y anota los supuestos.",
        UNATTENDED_RULE,
        "",
      ];
  return [
    `Clona ${url} como la nueva plantilla del monorepo plantillas/${slug}/ aplicando la skill clone-website (.agents/skills/clone-website/SKILL.md) en modo A — Plantilla: estructura, layout, estilos, animaciones e interacciones reales, con textos, precios, contactos e imágenes de ejemplo (marca ficticia).`,
    "",
    ...head,
    "Instrucciones:",
    "1. Lee la checklist completa de .agents/skills/clone-website/references/full-clone-checklist.md. Para contexto del repo consulta el grafo de codebase-memory (herramientas mcp__codebase-memory-mcp) directamente.",
    "2. Observa la web de origen en desktop (1440x900) y mobile (390x844) con las herramientas disponibles (navegador, WebFetch, curl o pnpm exec playwright screenshot) y guarda las capturas en plantillas/" +
      `${slug}/docs/referencias/source/.`,
    `3. Construye todas las rutas en plantillas/${slug}/ respetando la capa de personalización (AGENTS.md §6): src/config/site.ts, src/styles/theme.css, src/data/content.ts (con UI_LABELS) y public/. Nada de marca, contactos ni textos visibles en componentes.`,
    `4. Escribe plantillas/${slug}/CUSTOMIZE.md (4 puntos, tamaños de imagen, páginas opcionales, checklist de entrega) siguiendo el de las otras plantillas.`,
    `5. Completa plantillas/${slug}/plantilla.json: nombre, descripción, idioma, tipos de negocio ("negocio"), web de origen, marcas ficticias ("marcas") y datos de ejemplo ("placeholders"). Solo puedes tocar plantillas/${slug}/${manual ? "; si necesitas algo más, detente y pregúntame" : ""}.`,
    "6. Stack del AGENTS.md §2: Astro + Preact (sin react), CSS puro o lenis para animaciones, sin dependencias nuevas salvo lenis en el package.json del sitio si de verdad hace falta.",
    "",
    "Verificación obligatoria antes de terminar:",
    "- pnpm verify en verde.",
    `- pnpm cliente:qa ${slug} (todas las rutas, desktop y mobile, sin overflow horizontal).`,
    `- node scripts/template-clone.mjs --probe ${slug} en verde (prueba de personalización).`,
    "",
    "Cierre:",
    `- Escribe plantillas/${slug}/docs/agent-summary.md con: tabla de rutas origen → local, tabla de animaciones e interacciones (implementada / justificada), diferencias conocidas y supuestos.`,
    ...(manual
      ? [
          `- Commits pequeños en feat/${slug} (conventional commits, scope ${slug}). No hagas push, PR ni despliegue sin que yo lo pida.`,
          "- Al final, resúmeme lo mismo que el agent-summary.md y los comandos ejecutados con su resultado.",
        ]
      : []),
    "",
  ].join("\n");
}
