#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, parseBrief, ROOT_DIR, recursosLeftovers } from "./lib/brief.mjs";
import {
  clientRel,
  DEFAULT_TEMPLATE,
  docsPaths,
  GLOBAL_PLACEHOLDERS,
  listTemplates,
  resolveSite,
} from "./lib/paths.mjs";
import {
  assertScope,
  branchExists,
  commandExists,
  commit,
  currentBranch,
  dirtyFiles,
  gatesWithRepair,
  ghostSites,
  git,
  loadState,
  log,
  must,
  openPullRequest,
  PipelineError,
  pendingSection,
  readIfExists,
  run,
  runAgentUntilDone,
  runSteps,
  statePaths,
} from "./lib/pipeline.mjs";
import { buildClientPrompt, buildIntakePrompt } from "./lib/prompts.mjs";
import { entradaFingerprint, intakePaths, intakePending } from "./recursos-intake.mjs";

const AGENT_TRAILER = "\n\nCo-Authored-By: Claude <noreply@anthropic.com>";

function printUsage() {
  console.log(`
Uso:
  pnpm cliente:crear <slug-cliente> [opciones]

Crea la web de un cliente sin supervisión, de recursos/<slug>/ a un PR listo para revisar:
  intake → branch → recursos → generate → assets → agent → gates (con reparación) → commit → pr

intake solo se ejecuta si recursos/<slug>/entrada/ tiene material nuevo: el agente clasifica las
fotos, redacta brief.md y deja en preguntas.md lo que solo el cliente puede responder.

Opciones:
  --dry-run              Valida el brief y el entorno, e imprime los pasos y el prompt (no cambia nada)
  --resume               Retoma la ejecución guardada en .pipeline/<slug>/ (en su rama)
  --from-step <paso>     Con --resume, repite desde ese paso (ej. gates)
  --base <rama>          Rama base (por defecto: main)
  --no-pr                Termina tras los commits locales, sin push ni PR
  --max-repairs <n>      Intentos de reparación automática por compuertas (por defecto: 2)
  --allow-pending        cliente:check sin --strict (datos pendientes se listan en el PR)
  --reintake             Repite el intake aunque entrada/ no haya cambiado
  --intake-only          Solo ejecuta el intake y valida el brief (muestra preguntas.md)
  --model <modelo>       Modelo para el agente (por defecto: el de tu Claude Code)
  --max-budget-usd <n>   Tope de gasto por llamada al agente
  -h, --help             Mostrar esta ayuda
`);
}

function parseArgs(argv) {
  const result = {
    slug: "",
    base: "main",
    dryRun: false,
    resume: false,
    fromStep: "",
    pr: true,
    maxRepairs: 2,
    allowPending: false,
    reintake: false,
    intakeOnly: false,
    model: "",
    maxBudgetUsd: "",
    help: false,
  };
  const valueFlags = {
    "--base": "base",
    "--from-step": "fromStep",
    "--max-repairs": "maxRepairs",
    "--model": "model",
    "--max-budget-usd": "maxBudgetUsd",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--dry-run") result.dryRun = true;
    else if (arg === "--resume") result.resume = true;
    else if (arg === "--no-pr") result.pr = false;
    else if (arg === "--allow-pending") result.allowPending = true;
    else if (arg === "--reintake") result.reintake = true;
    else if (arg === "--intake-only") result.intakeOnly = true;
    else if (arg in valueFlags) {
      result[valueFlags[arg]] = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (!arg.startsWith("--") && !result.slug) result.slug = arg.trim();
    else throw new PipelineError(`opción no reconocida: ${arg}`);
  }
  result.maxRepairs = Number(result.maxRepairs);
  if (!Number.isInteger(result.maxRepairs) || result.maxRepairs < 0) {
    throw new PipelineError("--max-repairs debe ser un entero >= 0.");
  }
  if (result.fromStep && !result.resume) {
    throw new PipelineError("--from-step solo se usa junto con --resume.");
  }
  return result;
}

function preflight(args, brief) {
  const problems = [...brief.errors];
  for (const command of ["git", "pnpm", "claude", ...(args.pr ? ["gh"] : [])]) {
    if (!commandExists(command)) problems.push(`falta el comando "${command}" en el PATH.`);
  }
  if (args.pr && commandExists("gh") && !run("gh", ["auth", "status"]).ok) {
    problems.push("gh no tiene sesión iniciada (gh auth login) o usa --no-pr.");
  }
  const exampleDomain = GLOBAL_PLACEHOLDERS.domains.find(
    (item) => brief.domain === item || brief.domain?.endsWith(`.${item}`)
  );
  if (exampleDomain && !args.allowPending) {
    problems.push(
      `el dominio del brief (${brief.domain}) es temporal (*.${exampleDomain}) y cliente:check --strict nunca pasará: usa --allow-pending o pon el dominio definitivo.`
    );
  }
  for (const ghost of ghostSites()) {
    problems.push(
      `${ghost}/ sobra (restos ignorados de otra rama o de la antigua sites/): bórrala antes de seguir.`
    );
  }
  const leftovers = recursosLeftovers(args.slug, brief.plantilla);
  if (leftovers.fields.length > 0 || leftovers.files.length > 0) {
    const detail = [
      ...(leftovers.fields.length > 0 ? [`datos del brief: ${leftovers.fields.join(", ")}`] : []),
      ...(leftovers.files.length > 0 ? [`${leftovers.files.length} archivo(s) idénticos`] : []),
    ].join(" y ");
    if (args.allowPending) {
      log.warn(
        `recursos/${args.slug} conserva material de la plantilla (${detail}): irán como provisionales en el PR.`
      );
    } else {
      problems.push(
        `recursos/${args.slug} conserva material de ejemplo o de la plantilla (${detail}). Reemplázalo, déjalo como Pendiente o usa --allow-pending.`
      );
    }
  }
  const roomsDir = path.join(ROOT_DIR, "recursos", args.slug, "fotos", "habitaciones");
  if (brief.rooms?.length > 0 && fs.existsSync(roomsDir)) {
    const folders = fs.readdirSync(roomsDir).filter((name) => !name.startsWith("."));
    const withoutPhotos = brief.rooms.filter((room) => !folders.includes(room));
    const orphanFolders = folders.filter((folder) => !brief.rooms.includes(folder));
    if (withoutPhotos.length > 0) {
      log.warn(`habitaciones del brief sin carpeta de fotos: ${withoutPhotos.join(", ")}`);
    }
    if (orphanFolders.length > 0) {
      log.warn(
        `carpetas de fotos/habitaciones/ que no coinciden con ningún "### " del brief: ${orphanFolders.join(", ")}`
      );
    }
  }
  if (!args.resume) {
    const dirty = dirtyFiles();
    if (dirty.length > 0) {
      problems.push(
        `el árbol de trabajo no está limpio (${dirty.length} archivos). Sin stash ni reset: revísalo tú.`
      );
    }
    if (brief.branch && branchExists(brief.branch)) {
      problems.push(`la rama ${brief.branch} ya existe (local o en origin).`);
    }
    if (resolveSite(args.slug)) {
      problems.push(`ya existe un sitio "${args.slug}" (${resolveSite(args.slug).rel}/).`);
    }
    if (loadState(args.slug)) {
      problems.push(
        `hay una ejecución guardada en .pipeline/${args.slug}/: usa --resume o bórrala.`
      );
    }
  }
  if (problems.length === 0) {
    return;
  }
  const questions = readIfExists(path.join(ROOT_DIR, "recursos", args.slug, "preguntas.md")).trim();
  const message = `preflight:\n  - ${problems.join("\n  - ")}${
    questions
      ? `\n\nPreguntas para el cliente (recursos/${args.slug}/preguntas.md):\n${questions}`
      : ""
  }`;
  if (!args.dryRun) {
    throw new PipelineError(message);
  }
  log.warn(`${message}\n  (dry run: se continúa solo para mostrar el plan)`);
}

/** Material de la plantilla de recursos que el cliente aún no ha reemplazado */
function provisionalSection(slug, plantilla) {
  const { fields, files } = recursosLeftovers(slug, plantilla);
  if (fields.length === 0 && files.length === 0) {
    return [];
  }
  return [
    "## Recursos provisionales (material de ejemplo o de la plantilla)",
    "",
    ...fields.map((label) => `- Brief: **${label}** igual que en la plantilla`),
    ...(files.length > 0
      ? [
          `- ${files.length} archivo(s) idénticos al ejemplo o a la plantilla (${files.slice(0, 5).join(", ")}${files.length > 5 ? ", …" : ""})`,
        ]
      : []),
    "",
  ];
}

function buildPrBody({ slug, brief, state, allowPending }) {
  const siteRel = clientRel(slug);
  const { docs, qa: qaDir } = docsPaths(siteRel);
  const summary = readIfExists(path.join(ROOT_DIR, docs, "agent-summary.md"));
  const qa = readIfExists(path.join(ROOT_DIR, qaDir, "visual-qa-report.md"));
  const questions = readIfExists(path.join(ROOT_DIR, "recursos", slug, "preguntas.md")).trim();
  const customize = run("node", ["scripts/customize-check.mjs", slug], {
    timeout: 120_000,
  }).output.trim();
  const pending = pendingSection(summary);
  return [
    `## Cliente \`${slug}\` — ${brief.name}`,
    "",
    `Generado con \`pnpm cliente:crear ${slug}\` desde la plantilla \`${brief.plantilla}\` (brief: \`recursos/${slug}/brief.md\`).`,
    "",
    "## Datos pendientes",
    "",
    pending || "_Ninguno declarado por el agente._",
    "",
    ...(questions
      ? [
          "## Preguntas para el cliente",
          "",
          "Listas para reenviar por WhatsApp:",
          "",
          questions,
          "",
        ]
      : []),
    ...provisionalSection(slug, brief.plantilla),
    "## Resumen del agente",
    "",
    summary.trim() || `_El agente no escribió ${docs}/agent-summary.md._`,
    "",
    "## Compuertas",
    "",
    `- [x] \`pnpm cliente:check ${slug}${allowPending ? "" : " --strict"}\``,
    "- [x] `pnpm verify` (aislamiento, lint, check, build)",
    `- [x] \`pnpm cliente:qa ${slug}\` (todas las rutas en desktop y mobile, SEO: canonical, og, h1 y sitemap con el dominio)`,
    `- Reparaciones automáticas: ${state.repairs ?? 0} · coste del agente: $${(state.costUsd ?? 0).toFixed(2)}`,
    "",
    "<details><summary>cliente:check</summary>",
    "",
    "```",
    customize,
    "```",
    "</details>",
    "",
    "<details><summary>Informe de Visual QA</summary>",
    "",
    qa.trim() || "_Sin informe._",
    "</details>",
    "",
    "## Ficha de Coolify (tras el merge a main)",
    "",
    "Nueva aplicación en el proyecto Monorepo-Webs (guía: `docs/guias/03-desplegar.md`):",
    "",
    "| Campo | Valor |",
    "| :-- | :-- |",
    "| Repositorio / rama | `isjuandev/monorepo-webs` · `main` |",
    "| Build Pack · Dockerfile | `Dockerfile` · `/docker/Dockerfile` (Base Directory `/`) |",
    `| Build Variables | \`SITE_FOLDER=${slug}\` · \`SITE_URL=https://${brief.domain}\` |`,
    `| Dominio | \`https://${brief.domain}\` |`,
    "| Puerto · Health check | `80` · `/healthz` |",
    `| Watch Paths | \`${siteRel}/**\` \`packages/**\` \`docker/**\` \`pnpm-lock.yaml\` \`package.json\` \`turbo.json\` |`,
    "",
    `- [ ] DNS: registro \`A\` de \`${brief.domain}\` al IP del VPS (y \`www\` si aplica)`,
    `- [ ] Tras el primer despliegue: \`https://${brief.domain}/healthz\`, \`/robots.txt\` y \`/sitemap-index.xml\` responden`,
    `- [ ] \`${siteRel}/cliente.json\`: \`estado\` → \`produccion\` y \`coolify\` → nombre de la app`,
    "",
    "## Revisión humana",
    "",
    `- [ ] Revisado el sitio en local (\`pnpm --filter @clientes/${slug} dev\`) en desktop y mobile`,
    "- [ ] Copy y tono aprobados",
    "- [ ] Datos pendientes y preguntas resueltos o aceptados como provisionales",
    "",
    "🤖 Generated with [Claude Code](https://claude.com/claude-code)",
  ].join("\n");
}

/**
 * Paso intake: si recursos/<slug>/entrada/ tiene material nuevo, prepara el índice, el agente
 * clasifica las fotos y redacta brief.md y preguntas.md, y se aplica la clasificación.
 * Trabaja solo sobre recursos/ (ignorada por Git), así que no necesita rama.
 */
async function runIntake(args, claude) {
  const { slug } = args;
  const paths = intakePaths(slug);
  const { count } = entradaFingerprint(slug);
  if (count === 0) {
    return;
  }
  if (!args.reintake && !intakePending(slug)) {
    log.info(`Intake al día (${count} archivos en recursos/${slug}/entrada/).`);
    return;
  }
  if (args.dryRun) {
    log.step(
      `Intake: se ordenarían ${count} archivos de recursos/${slug}/entrada/ (omitido en dry run)`
    );
    return;
  }
  if (!commandExists("claude")) {
    throw new PipelineError('falta el comando "claude" en el PATH (lo necesita el intake).');
  }
  log.step(`Intake: ${count} archivos en recursos/${slug}/entrada/`);
  must("node", ["scripts/recursos-intake.mjs", slug, "--prepare"], { capture: false });
  const startedAt = Date.now();
  const outputs = [
    paths.clasificacion,
    path.join(paths.base, "brief.md"),
    path.join(paths.base, "preguntas.md"),
  ];
  const state = loadState(`${slug}/intake`) ?? { slug, done: [] };
  await runAgentUntilDone({
    slug: `${slug}/intake`,
    prompt: buildIntakePrompt({
      slug,
      templates: listTemplates(),
      defaultTemplate: DEFAULT_TEMPLATE,
    }),
    claude,
    state,
    isDone: () => {
      const missing = outputs.filter(
        (file) => !fs.existsSync(file) || fs.statSync(file).mtimeMs < startedAt
      );
      return missing.length > 0
        ? `faltan ${missing.map((file) => path.relative(ROOT_DIR, file)).join(", ")}`
        : null;
    },
  });
  must("node", ["scripts/recursos-intake.mjs", slug, "--apply", "--force"], { capture: false });
  log.ok(`Intake listo: revisa recursos/${slug}/brief.md y recursos/${slug}/preguntas.md`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.slug) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }
  if (!KEBAB_CASE_REGEX.test(args.slug)) {
    throw new PipelineError(`el slug "${args.slug}" no es kebab-case válido.`);
  }

  const { slug, base } = args;
  const claude = {
    model: args.model || undefined,
    maxBudgetUsd: args.maxBudgetUsd || undefined,
  };
  await runIntake(args, claude);
  const brief = parseBrief(slug);
  if (args.intakeOnly) {
    const questions = readIfExists(path.join(ROOT_DIR, "recursos", slug, "preguntas.md")).trim();
    if (questions) {
      log.step(`Preguntas para el cliente (recursos/${slug}/preguntas.md)`);
      console.log(questions);
    }
    if (brief.errors.length > 0) {
      throw new PipelineError(`brief incompleto:\n  - ${brief.errors.join("\n  - ")}`);
    }
    log.ok(
      `Brief válido: ${brief.name} · ${brief.domain} · plantilla ${brief.plantilla}. Siguiente: pnpm cliente:crear ${slug}`
    );
    return;
  }
  preflight(args, brief);
  if (brief.errors.length > 0) {
    return;
  }
  log.ok(
    `Brief válido: ${brief.name} · ${brief.domain} · plantilla ${brief.plantilla} · rama ${brief.branch}`
  );

  const siteRel = clientRel(slug);
  const allowed = [`${siteRel}/`, `recursos/${slug}/`, "pnpm-lock.yaml"];
  const sitePaths = [siteRel];
  const prompt = buildClientPrompt({ slug, base, ...brief, pipeline: true });
  const gates = [
    {
      name: `cliente:check${args.allowPending ? "" : " --strict"}`,
      command: "node",
      args: ["scripts/customize-check.mjs", slug, ...(args.allowPending ? [] : ["--strict"])],
      timeout: 120_000,
    },
    { name: "verify", command: "pnpm", args: ["verify"] },
    { name: "cliente:qa", command: "node", args: ["scripts/qa-site.mjs", slug] },
  ];

  const steps = [
    {
      name: "branch",
      title: `rama ${brief.branch} desde ${base}`,
      run: () => {
        git("checkout", "-q", base);
        git("pull", "-q", "--ff-only", "origin", base);
        git("checkout", "-q", "-b", brief.branch);
      },
    },
    {
      name: "recursos",
      title: `commit de recursos/${slug}/`,
      run: () => {
        // entrada/ y .intake/ (material crudo, chats y datos personales) nunca se suben
        must("git", [
          "add",
          "-f",
          "--",
          `recursos/${slug}`,
          `:(exclude)recursos/${slug}/entrada`,
          `:(exclude)recursos/${slug}/.intake`,
        ]);
        const staged = git("diff", "--cached", "--name-only").split("\n").filter(Boolean);
        const outside = staged.filter((file) => !file.startsWith(`recursos/${slug}/`));
        if (outside.length > 0) {
          throw new PipelineError(
            `hay archivos staged fuera de recursos/${slug}/: ${outside.join(", ")}`
          );
        }
        commit(
          [`recursos/${slug}`],
          `chore(${slug}): sube recursos del cliente (brief, fotos, marca y fuentes)`
        );
      },
    },
    {
      name: "generate",
      title: `pnpm cliente:nuevo --from ${brief.plantilla}`,
      run: () => {
        must(
          "node",
          [
            "scripts/new-client-site.mjs",
            slug,
            "--from",
            brief.plantilla,
            "--name",
            brief.name,
            "--domain",
            brief.domain,
            "--locale",
            brief.locale,
            "--skip-checks",
          ],
          { capture: false }
        );
        must("pnpm", ["install"], { capture: false });
        commit(
          [...sitePaths, "pnpm-lock.yaml"],
          `feat(${slug}): generar sitio desde ${brief.plantilla}`
        );
      },
    },
    {
      name: "assets",
      title: "optimizar activos del cliente",
      run: () => {
        must("node", ["scripts/optimize-assets.mjs", slug], { capture: false });
        commit(sitePaths, `feat(${slug}): activos del cliente optimizados a WebP`);
      },
    },
    {
      name: "agent",
      title: "personalización con Claude (sin supervisión)",
      run: async (state) => {
        const startedAt = Date.now();
        const summaryPath = path.join(ROOT_DIR, docsPaths(siteRel).docs, "agent-summary.md");
        await runAgentUntilDone({
          slug,
          prompt,
          claude,
          state,
          isDone: () =>
            fs.existsSync(summaryPath) && fs.statSync(summaryPath).mtimeMs >= startedAt
              ? null
              : `falta escribir ${siteRel}/docs/agent-summary.md al terminar la personalización`,
        });
        assertScope(base, allowed);
      },
    },
    {
      name: "gates",
      title: "cliente:check, verify y QA visual (con reparación)",
      run: async (state) => {
        const repairs = await gatesWithRepair({
          slug,
          siteRel,
          gates,
          state,
          maxRepairs: args.maxRepairs,
          claude,
          base,
          allowed,
        });
        state.repairs = (state.repairs ?? 0) + repairs;
      },
    },
    {
      name: "commit",
      title: "commit del trabajo del agente",
      run: () => {
        assertScope(base, allowed);
        // recursos/<slug>/ entra también: el brief ya está versionado y puede haberse completado
        commit(
          [...sitePaths, `recursos/${slug}`],
          `feat(${slug}): personaliza contenido, marca y páginas del cliente${AGENT_TRAILER}`
        );
        const leftovers = dirtyFiles();
        if (leftovers.length > 0) {
          throw new PipelineError(`quedan cambios sin commitear: ${leftovers.join(", ")}`);
        }
      },
    },
    {
      name: "pr",
      title: args.pr ? "push y PR" : "omitido (--no-pr)",
      run: (state) => {
        if (!args.pr) {
          log.info(`Rama local lista: ${brief.branch}. Push y PR cuando quieras.`);
          return;
        }
        const url = openPullRequest({
          branch: brief.branch,
          base,
          title: `feat(${slug}): sitio del cliente ${brief.name}`,
          body: buildPrBody({ slug, brief, state, allowPending: args.allowPending }),
        });
        state.prUrl = url;
        log.ok(`PR: ${url}`);
      },
    },
  ];

  if (args.dryRun) {
    log.step("Dry run: pasos que se ejecutarían");
    for (const [index, step] of steps.entries()) {
      log.info(`${index + 1}. ${step.name} — ${step.title}`);
    }
    log.step("Prompt del agente");
    console.log(prompt);
    return;
  }

  let state = { slug, branch: brief.branch, base, done: [] };
  if (args.resume) {
    state = loadState(slug) ?? state;
    if (state.done.length > 0 && currentBranch() !== state.branch) {
      throw new PipelineError(
        `--resume necesita estar en la rama ${state.branch} (git checkout ${state.branch}).`
      );
    }
  }

  await runSteps({ slug, steps, state, fromStep: args.fromStep });
  log.ok(
    `Cliente ${slug} listo en ${brief.branch}${state.prUrl ? ` · PR ${state.prUrl}` : ""} · estado en ${path.relative(ROOT_DIR, statePaths(slug).state)}`
  );
}

main().catch((error) => {
  console.error(
    `\n\x1b[31m✖ ${error instanceof PipelineError ? error.message : error.stack}\x1b[0m`
  );
  console.error("  Retoma con: pnpm cliente:crear <slug> --resume [--from-step <paso>]");
  process.exit(1);
});
