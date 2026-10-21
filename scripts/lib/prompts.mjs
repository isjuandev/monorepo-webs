/**
 * En modo headless, una respuesta final termina la ejecución: el agente no debe cerrar su turno
 * con un informe intermedio (p. ej. el de la skill codebase-context), un plan ni una pregunta.
 */
export const UNATTENDED_RULE =
  "Tu respuesta final cierra la ejecución: no la des hasta terminar y verificar todo el trabajo. No termines con un informe de contexto, un plan ni una pregunta, y no invoques skills que solo informan (como codebase-context): consulta el grafo de codebase-memory directamente.";

/**
 * Prompt de creación de un sitio de cliente.
 * - pipeline = false: prompt manual completo (el modelo hace git, recursos y generador).
 * - pipeline = true: para `pnpm cliente:crear`; rama, recursos, generador y activos ya están hechos.
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
    `- Sitio generado con pnpm cliente:nuevo ${slug} --from ${plantilla} (clientes/${slug}/).`,
    `- Imágenes de recursos/${slug}/ optimizadas en clientes/${slug}/public/ con su mismo nombre (fotos y logos en images/<nombre>.webp, og-image en images/og-image.jpg, fuentes en fonts/, favicons en la raíz); las que se llaman igual que en la plantilla ya la reemplazaron; el mapa origen → destino está en clientes/${slug}/docs/assets-manifest.json.`,
    "No ejecutes git (ni commit, ni push, ni cambios de rama): el orquestador commitea al terminar.",
    "Trabajas sin supervisión: si un dato falta, no preguntes; déjalo como pendiente visible y anótalo en el resumen.",
    UNATTENDED_RULE,
    "",
  ];

  const assetsStep = pipeline
    ? `   d) clientes/${slug}/public/: usa las imágenes ya optimizadas según clientes/${slug}/docs/assets-manifest.json, enlázalas desde content.ts y site.ts, y borra de public/ las imágenes de la plantilla que ya no se usen.`
    : `   d) clientes/${slug}/public/: reemplaza todas las imágenes de la plantilla con los assets de recursos/${slug}/marca/ y recursos/${slug}/fotos/ (optimizados a WebP, según la guía de CUSTOMIZE.md).`;

  const generatorStep = pipeline
    ? []
    : [
        `2. Genera el sitio con el generador, usando los valores del brief (nunca copies a mano ni modifiques la plantilla de origen): pnpm cliente:nuevo ${slug} --from ${plantilla} --name "${name}" --domain "${domain}" --locale "${locale}".`,
      ];

  const closing = pipeline
    ? [
        "Cierre:",
        `- Antes de terminar, ejecuta pnpm cliente:check ${slug} --strict, pnpm verify y pnpm cliente:qa ${slug}, y corrige lo que falle.`,
        `- Escribe clientes/${slug}/docs/agent-summary.md con: páginas creadas, recursos usados y faltantes, tono y supuestos, una sección "## Datos pendientes" (lista de lo que falta y bloquea la entrega) y diferencias conocidas. Ese archivo va en el PR.`,
        "",
      ]
    : [
        "Cierre:",
        "- Commits pequeños en la rama del cliente: primero los recursos (paso 0.5), después el sitio. No hagas push, PR ni despliegue sin que yo lo pida.",
        "- Resumen con: rama, páginas creadas, recursos usados y faltantes, tono y supuestos, datos pendientes, y pasos de despliegue según docs/guias/03-desplegar.md. Incluye también que los recursos y datos que vengan de otro cliente son provisionales, si lo son.",
        "",
      ];

  const step = (n) => (pipeline ? n - 1 : n);

  return [
    `Crea la web del cliente ${slug} siguiendo recursos/${slug}/brief.md.`,
    "",
    ...(pipeline ? pipelineSteps : manualSteps),
    "Instrucciones:",
    pipeline
      ? `1. Lee el CUSTOMIZE.md de la plantilla base (plantillas/${plantilla}/CUSTOMIZE.md). Para contexto del repo consulta el grafo de codebase-memory (herramientas mcp__codebase-memory-mcp) directamente.`
      : `1. Aplica la skill codebase-context y lee el CUSTOMIZE.md de la plantilla base (plantillas/${plantilla}/CUSTOMIZE.md).`,
    ...generatorStep,
    `${step(3)}. Personaliza en este orden, sin hardcodear nada en componentes (AGENTS.md §6):`,
    `   a) clientes/${slug}/src/config/site.ts`,
    `   b) clientes/${slug}/src/styles/theme.css`,
    `   c) clientes/${slug}/src/data/content.ts`,
    assetsStep,
    ...(motel
      ? [
          `   - Es motel: redacta content.ts con la skill motel-copywriting (modo monorepo, §1.1): el tono y los datos salen del brief y de recursos/${slug}/textos/. Sigue la verificación de .agents/skills/motel-copywriting/references/verificacion.md.`,
        ]
      : ["   - No es motel: usa la voz de marca del brief sin esa skill."]),
    `${step(4)}. Ajusta la estructura según el brief: quita o añade páginas en clientes/${slug}/src/ (pages y components).`,
    `${step(5)}. SEO: conserva sitemap() en astro.config.mjs, src/pages/robots.txt.ts, <SEO /> dentro de BaseLayout.astro, la página 404, metadatos por página y un solo H1 por página, con el mismo tono.`,
    `${step(6)}. Stack: el definido en AGENTS.md §2. Sin react ni react-dom, y sin importar código entre sitios.`,
    `${step(7)}. Limítate a clientes/${slug}/ (la guía de voz, si aplica, va en clientes/${slug}/docs/). Si necesitas tocar packages/*, scripts/, plantillas/, otra carpeta de recursos/ o cualquier otro sitio, ${pipeline ? "no lo hagas: anótalo en el resumen" : "detente y pregúntame"}.`,
    "",
    "Verificación obligatoria:",
    ...(motel
      ? [
          "- Motel: el checklist de .agents/skills/motel-copywriting/references/verificacion.md cumplido y tono consistente en todo el sitio.",
        ]
      : []),
    `- pnpm cliente:check ${slug} --strict en verde. Si faltan datos, repórtalos y dime qué bloquea la entrega.`,
    "- pnpm verify en verde.",
    pipeline
      ? `- pnpm cliente:qa ${slug} (todas las rutas del build), en desktop y en mobile, sin overflow horizontal.`
      : `- SITE_FOLDER=${slug} QA_ROUTES="${routes}" pnpm test:visual, en desktop y en mobile, sin overflow horizontal. Ajusta las rutas si el sitio cambia sus páginas.`,
    "",
    ...closing,
  ].join("\n");
}

/** Prompt de reparación tras fallar una compuerta del pipeline */
export function buildRepairPrompt({ siteRel, gate, output, attempt, maxAttempts }) {
  return [
    `La compuerta "${gate}" falló para ${siteRel} (intento de reparación ${attempt} de ${maxAttempts}).`,
    `Corrige la causa sin salirte de ${siteRel}/, sin ejecutar git y sin desactivar reglas, tests ni comprobaciones.`,
    `Si la falla es por datos que el brief no da, déjalos como pendientes visibles y actualiza la sección "## Datos pendientes" de ${siteRel}/docs/agent-summary.md.`,
    "",
    "Salida (recortada):",
    "```",
    output,
    "```",
  ].join("\n");
}

/** Prompt del paso intake: ordenar recursos/<slug>/entrada/ y redactar el brief */
export function buildIntakePrompt({ slug, templates, defaultTemplate }) {
  const dir = `recursos/${slug}`;
  return [
    `Ordena el material crudo del cliente ${slug} (${dir}/entrada/) aplicando la skill recursos-intake (.agents/skills/recursos-intake/SKILL.md).`,
    "",
    "Ya hecho por el orquestador (no lo repitas):",
    `- ${dir}/.intake/indice.json: cada foto con su id, miniatura (.intake/miniaturas/<id>.jpg), tamaño y orientación; los textos legibles (PDF, TXT, chats y documentos convertidos) y otros archivos (logos vectoriales, fuentes) con su id.`,
    "",
    "Tu trabajo:",
    `1. Lee la skill, ${dir}/.intake/indice.json, cada miniatura (Read sobre la imagen) y cada texto legible. Si ${dir}/brief.md ya existe, léelo: lo que escribió una persona manda.`,
    `2. Escribe ${dir}/.intake/clasificacion.json con el destino de cada id, según la skill (fotos/hero, fotos/habitaciones/<habitacion>, fotos/instalaciones, fotos/galeria, marca/ o "descartar").`,
    `3. Escribe o completa ${dir}/brief.md con el formato exacto de recursos/_plantilla-cliente/brief.md. Slug: ${slug}. Plantilla base: la del catálogo que mejor encaje (${templates.join(", ")}; por defecto ${defaultTemplate}). Si no hay dominio, usa "${slug}.nexobite.com (temporal)". Cada "### " de Habitaciones debe coincidir con una carpeta de fotos/habitaciones/.`,
    `4. Escribe ${dir}/preguntas.md: lista numerada y breve de lo que solo el cliente puede responder (datos que faltan o se contradicen), en el orden en que bloquean la entrega.`,
    "",
    "Reglas:",
    "- Nunca inventes datos: lo que no esté en el material va como Pendiente y a preguntas.md.",
    `- Solo escribes dentro de ${dir}/ (brief.md, preguntas.md y .intake/). No copies ni muevas fotos: el orquestador aplica tu clasificación. No toques ${dir}/entrada/.`,
    "- No ejecutes git ni instales nada.",
    UNATTENDED_RULE,
    "",
  ].join("\n");
}
