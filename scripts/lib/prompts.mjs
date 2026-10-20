/**
 * Prompt de creación de un sitio de cliente.
 * - pipeline = false: prompt manual completo (el modelo hace git, recursos y generador).
 * - pipeline = true: para `pnpm client:run`; rama, recursos, generador y activos ya están hechos.
 */
export function buildClientPrompt({
  slug,
  base,
  plantilla,
  name,
  domain,
  locale,
  motel,
  branch,
  routes,
  pipeline = false,
}) {
  const source = `Fuente única: la carpeta recursos/${slug}/. Del brief salen todos los datos: plantilla base, nombre comercial, dominio, locale, tipo de negocio, tono, contacto, marca, habitaciones, páginas y cambios de diseño. Si falta brief.md, si falta un dato obligatorio (plantilla, nombre, dominio, locale) o si algo se contradice, detente y avísame. Los demás campos vacíos son pendientes: no inventes datos.`;

  const manualSteps = [
    `${source} Sobre recursos/ solo haces dos cosas: leerla y subirla a su rama de cliente con el paso 0.5. No modifiques ni borres nada dentro de ella.`,
    "",
    "Paso 0: comprobaciones y rama (antes de tocar nada):",
    `1. Lee recursos/${slug}/brief.md y verifica que tiene los datos obligatorios.`,
    "2. git status --short debe salir vacío. Si no, detente y avísame; sin stash, reset ni borrado.",
    `3. git checkout ${base}`,
    `4. git pull origin ${base}`,
    `5. Verifica que la rama ${branch} no existe. Si existe, detente y avísame.`,
    `6. git checkout -b ${branch}`,
    `Todo el trabajo va en esa rama. La rama parte del estado actual de ${base}, pero el sitio de ese cliente de origen no se toca.`,
    "",
    "Paso 0.5: recursos del cliente a su rama (después de validar el brief):",
    `1. git add -f recursos/${slug}`,
    `2. Verifica que lo staged solo contiene archivos bajo recursos/${slug}/ (git diff --cached --name-only). Si hay algo más, detente y avísame.`,
    `3. Commit separado: "chore(${slug}): sube recursos del cliente (brief, fotos, marca y fuentes)".`,
    `No modifiques .gitignore. Esta excepción aplica solo a recursos/${slug}/ en la rama ${branch}; no la repitas en otras ramas ni con otras carpetas de recursos/.`,
    "",
  ];

  const pipelineSteps = [
    `${source.replace("detente y avísame", "detente y explica el motivo en tu respuesta final")} recursos/ es de solo lectura: no la modifiques ni la borres.`,
    "",
    "Ya hecho por el orquestador (no lo repitas):",
    `- Rama ${branch} creada desde ${base}, con los recursos del cliente ya commiteados.`,
    `- Sitio generado con pnpm new-client-site ${slug} --from ${plantilla} (sites/${slug}/).`,
    `- Imágenes de recursos/${slug}/ optimizadas en sites/${slug}/public/ (images/, fonts/, og-image.jpg y favicons); el mapa origen → destino está en docs/research/${slug}/assets-manifest.json.`,
    "No ejecutes git (ni commit, ni push, ni cambios de rama): el orquestador commitea al terminar.",
    "Trabajas sin supervisión: si un dato falta, no preguntes; déjalo como pendiente visible y anótalo en el resumen.",
    "",
  ];

  const assetsStep = pipeline
    ? `   d) sites/${slug}/public/: usa las imágenes ya optimizadas según docs/research/${slug}/assets-manifest.json, enlázalas desde content.ts y site.ts, y borra de public/ las imágenes de la plantilla que ya no se usen.`
    : `   d) sites/${slug}/public/: reemplaza todas las imágenes de la plantilla con los assets de recursos/${slug}/marca/ y recursos/${slug}/fotos/ (optimizados a WebP, según la guía de CUSTOMIZE.md).`;

  const generatorStep = pipeline
    ? []
    : [
        `2. Genera el sitio con el generador, usando los valores del brief (nunca copies a mano ni modifiques la plantilla de origen): pnpm new-client-site ${slug} --from ${plantilla} --name "${name}" --domain "${domain}" --locale "${locale}".`,
      ];

  const closing = pipeline
    ? [
        "Cierre:",
        `- Antes de terminar, ejecuta pnpm customize:check ${slug} --strict, pnpm verify y pnpm qa:site ${slug}, y corrige lo que falle.`,
        `- Escribe docs/research/${slug}/agent-summary.md con: páginas creadas, recursos usados y faltantes, tono y supuestos, una sección "## Datos pendientes" (lista de lo que falta y bloquea la entrega) y diferencias conocidas. Ese archivo va en el PR.`,
        "",
      ]
    : [
        "Cierre:",
        "- Commits pequeños en la rama del cliente: primero los recursos (paso 0.5), después el sitio. No hagas push, PR ni despliegue sin que yo lo pida.",
        "- Resumen con: rama, páginas creadas, recursos usados y faltantes, tono y supuestos, datos pendientes, y pasos de despliegue según docs/deploy-coolify.md. Incluye también que los recursos y datos que vengan de otro cliente son provisionales, si lo son.",
        "",
      ];

  const step = (n) => (pipeline ? n - 1 : n);

  return [
    `Crea la web del cliente ${slug} siguiendo recursos/${slug}/brief.md.`,
    "",
    ...(pipeline ? pipelineSteps : manualSteps),
    "Instrucciones:",
    `1. Aplica la skill codebase-context y lee el CUSTOMIZE.md de la plantilla base (sites/${plantilla}/CUSTOMIZE.md).`,
    ...generatorStep,
    `${step(3)}. Personaliza en este orden, sin hardcodear nada en componentes (AGENTS.md §6):`,
    `   a) sites/${slug}/src/config/site.ts`,
    `   b) sites/${slug}/src/styles/theme.css`,
    `   c) sites/${slug}/src/data/content.ts`,
    assetsStep,
    ...(motel
      ? [
          `   - Es motel: redacta content.ts con la skill motel-copywriting (modo monorepo, §1.1): el tono y los datos salen del brief y de recursos/${slug}/textos/. Sigue la verificación de .agents/skills/motel-copywriting/references/verificacion.md.`,
        ]
      : ["   - No es motel: usa la voz de marca del brief sin esa skill."]),
    `${step(4)}. Ajusta la estructura según el brief: quita o añade páginas en sites/${slug}/src/ (pages y components).`,
    `${step(5)}. SEO: conserva sitemap() en astro.config.mjs, src/pages/robots.txt.ts, <SEO /> dentro de BaseLayout.astro, la página 404, metadatos por página y un solo H1 por página, con el mismo tono.`,
    `${step(6)}. Stack: el definido en AGENTS.md §2. Sin react ni react-dom, y sin importar código entre sitios.`,
    `${step(7)}. Limítate a sites/${slug}/ y a docs/research/${slug}/ (guía de voz, si aplica). Si necesitas tocar packages/*, scripts/, sites/${plantilla}/, otra carpeta de recursos/ o cualquier otro sitio, ${pipeline ? "no lo hagas: anótalo en el resumen" : "detente y pregúntame"}.`,
    "",
    "Verificación obligatoria:",
    ...(motel
      ? [
          "- Motel: el checklist de .agents/skills/motel-copywriting/references/verificacion.md cumplido y tono consistente en todo el sitio.",
        ]
      : []),
    `- pnpm customize:check ${slug} --strict en verde. Si faltan datos, repórtalos y dime qué bloquea la entrega.`,
    "- pnpm verify en verde.",
    pipeline
      ? `- pnpm qa:site ${slug} (todas las rutas del build), en desktop y en mobile, sin overflow horizontal.`
      : `- SITE_FOLDER=${slug} QA_ROUTES="${routes}" pnpm test:visual, en desktop y en mobile, sin overflow horizontal. Ajusta las rutas si el sitio cambia sus páginas.`,
    "",
    ...closing,
  ].join("\n");
}

/** Prompt de reparación tras fallar una compuerta del pipeline */
export function buildRepairPrompt({ slug, gate, output, attempt, maxAttempts }) {
  return [
    `La compuerta "${gate}" falló para sites/${slug} (intento de reparación ${attempt} de ${maxAttempts}).`,
    `Corrige la causa sin salirte de sites/${slug}/ ni de docs/research/${slug}/, sin ejecutar git y sin desactivar reglas, tests ni comprobaciones.`,
    `Si la falla es por datos que el brief no da, déjalos como pendientes visibles y actualiza la sección "## Datos pendientes" de docs/research/${slug}/agent-summary.md.`,
    "",
    "Salida (recortada):",
    "```",
    output,
    "```",
  ].join("\n");
}
