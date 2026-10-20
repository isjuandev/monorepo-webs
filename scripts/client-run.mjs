#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, parseBrief, ROOT_DIR } from "./lib/brief.mjs";
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
  runClaude,
  runSteps,
  saveState,
  statePaths,
} from "./lib/pipeline.mjs";
import { buildClientPrompt } from "./lib/prompts.mjs";

const AGENT_TRAILER = "\n\nCo-Authored-By: Claude <noreply@anthropic.com>";

function printUsage() {
  console.log(`
Uso:
  pnpm client:run <slug-cliente> [opciones]

Crea la web de un cliente sin supervisión, de recursos/<slug>/brief.md a un PR listo para revisar:
  branch → recursos → generate → assets → agent → gates (con reparación) → commit → pr

Opciones:
  --dry-run              Valida el brief y el entorno, e imprime los pasos y el prompt (no cambia nada)
  --resume               Retoma la ejecución guardada en .pipeline/<slug>/ (en su rama)
  --from-step <paso>     Con --resume, repite desde ese paso (ej. gates)
  --base <rama>          Rama base (por defecto: main)
  --no-pr                Termina tras los commits locales, sin push ni PR
  --max-repairs <n>      Intentos de reparación automática por compuertas (por defecto: 2)
  --allow-pending        customize:check sin --strict (datos pendientes se listan en el PR)
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
  const { global } = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "scripts", "template-brands.json"), "utf8")
  );
  const exampleDomain = global.domains.find(
    (item) => brief.domain === item || brief.domain?.endsWith(`.${item}`)
  );
  if (exampleDomain && !args.allowPending) {
    problems.push(
      `el dominio del brief (${brief.domain}) es temporal (*.${exampleDomain}) y customize:check --strict nunca pasará: usa --allow-pending o pon el dominio definitivo.`
    );
  }
  for (const ghost of ghostSites()) {
    problems.push(
      `${ghost}/ no tiene package.json (restos ignorados de otra rama): bórrala o muévela antes de seguir.`
    );
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
    if (fs.existsSync(path.join(ROOT_DIR, "sites", args.slug))) {
      problems.push(`sites/${args.slug}/ ya existe.`);
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
  const message = `preflight:\n  - ${problems.join("\n  - ")}`;
  if (!args.dryRun) {
    throw new PipelineError(message);
  }
  log.warn(`${message}\n  (dry run: se continúa solo para mostrar el plan)`);
}

function buildPrBody({ slug, brief, state, allowPending }) {
  const summary = readIfExists(path.join(ROOT_DIR, "docs", "research", slug, "agent-summary.md"));
  const qa = readIfExists(path.join(ROOT_DIR, "docs", "research", slug, "visual-qa-report.md"));
  const customize = run("node", ["scripts/customize-check.mjs", slug]).output.trim();
  const pending = pendingSection(summary);
  return [
    `## Cliente \`${slug}\` — ${brief.name}`,
    "",
    `Generado con \`pnpm client:run ${slug}\` desde \`${brief.plantilla}\` (brief: \`recursos/${slug}/brief.md\`).`,
    "",
    "## Datos pendientes",
    "",
    pending || "_Ninguno declarado por el agente._",
    "",
    "## Resumen del agente",
    "",
    summary.trim() || "_El agente no escribió docs/research/<slug>/agent-summary.md._",
    "",
    "## Compuertas",
    "",
    `- [x] \`pnpm customize:check ${slug}${allowPending ? "" : " --strict"}\``,
    "- [x] `pnpm verify` (aislamiento, lint, check, build)",
    `- [x] \`pnpm qa:site ${slug}\` (todas las rutas, desktop y mobile)`,
    `- Reparaciones automáticas: ${state.repairs ?? 0} · coste del agente: $${(state.costUsd ?? 0).toFixed(2)}`,
    "",
    "<details><summary>customize:check</summary>",
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
    "## Despliegue en Coolify (tras el merge a main)",
    "",
    "Ver `docs/deploy-coolify.md` §2:",
    `- Build args: \`SITE_FOLDER=${slug}\`, \`SITE_URL=https://${brief.domain}\``,
    `- Dominio: \`https://${brief.domain}\` · Health check: \`/healthz\` · Puerto: \`80\``,
    `- Watch paths: \`sites/${slug}/**\`, \`packages/**\`, \`docker/**\`, \`pnpm-lock.yaml\`, \`package.json\`, \`turbo.json\``,
    "",
    "## Revisión humana",
    "",
    "- [ ] Revisado el sitio en local (`pnpm --filter @sites/" +
      slug +
      " dev`) en desktop y mobile",
    "- [ ] Copy y tono aprobados",
    "- [ ] Datos pendientes resueltos o aceptados como provisionales",
    "",
    "🤖 Generated with [Claude Code](https://claude.com/claude-code)",
  ].join("\n");
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
  const brief = parseBrief(slug);
  preflight(args, brief);
  if (brief.errors.length > 0) {
    return;
  }
  log.ok(
    `Brief válido: ${brief.name} · ${brief.domain} · plantilla ${brief.plantilla} · rama ${brief.branch}`
  );

  const allowed = [
    `sites/${slug}/`,
    `docs/research/${slug}/`,
    `docs/design-references/${slug}/`,
    `recursos/${slug}/`,
    "pnpm-lock.yaml",
  ];
  const sitePaths = [`sites/${slug}`, `docs/research/${slug}`, `docs/design-references/${slug}`];
  const claude = {
    model: args.model || undefined,
    maxBudgetUsd: args.maxBudgetUsd || undefined,
  };
  const prompt = buildClientPrompt({ slug, base, ...brief, pipeline: true });
  const gates = [
    {
      name: `customize:check${args.allowPending ? "" : " --strict"}`,
      command: "node",
      args: ["scripts/customize-check.mjs", slug, ...(args.allowPending ? [] : ["--strict"])],
    },
    { name: "verify", command: "pnpm", args: ["verify"] },
    { name: "qa:site", command: "node", args: ["scripts/qa-site.mjs", slug] },
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
        must("git", ["add", "-f", `recursos/${slug}`]);
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
      title: `pnpm new-client-site --from ${brief.plantilla}`,
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
        const response = await runClaude({ ...claude, slug, prompt });
        state.sessionId = response.sessionId;
        state.costUsd = (state.costUsd ?? 0) + response.costUsd;
        saveState(slug, state);
        log.info(
          `Agente: ${response.turns} turnos · $${response.costUsd.toFixed(2)} · sesión ${response.sessionId}`
        );
        if (response.isError) {
          throw new PipelineError(
            `el agente terminó con error (${response.subtype}). Retoma con --resume --from-step agent.\n${response.result}`
          );
        }
        assertScope(base, allowed);
      },
    },
    {
      name: "gates",
      title: "customize:check, verify y QA visual (con reparación)",
      run: async (state) => {
        const repairs = await gatesWithRepair({
          slug,
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
        commit(
          sitePaths,
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
  console.error("  Retoma con: pnpm client:run <slug> --resume [--from-step <paso>]");
  process.exit(1);
});
