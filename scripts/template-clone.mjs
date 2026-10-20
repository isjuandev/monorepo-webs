#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, ROOT_DIR, SITES_DIR } from "./lib/brief.mjs";
import { buildClonePrompt, discoverRoutes } from "./lib/clone.mjs";
import {
  AGENT_ALLOWED_TOOLS,
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
  readIfExists,
  run,
  runAgentUntilDone,
  runSteps,
  statePaths,
  tail,
} from "./lib/pipeline.mjs";

const PROBE_SLUG = "tmp-probe-plantilla";
const CUSTOMIZATION_FILES = ["src/config/site.ts", "src/data/content.ts", "src/styles/theme.css"];
// El clonado necesita leer la web de origen y bajar sus activos
const CLONE_ALLOWED_TOOLS = [
  ...AGENT_ALLOWED_TOOLS,
  "WebFetch",
  "Bash(curl:*)",
  "mcp__claude-in-chrome",
  "mcp__playwright",
];

function printUsage() {
  console.log(`
Uso:
  pnpm template:clone <url> <plantilla-slug> [opciones]

Clona una web como nueva plantilla del monorepo (sites/plantilla-*) con la skill clone-website,
en modo A (Plantilla: estructura y estilos reales, textos y datos de ejemplo), y abre un PR:
  routes → branch → generate → agent → gates (con reparación) → commit → pr

Opciones:
  --dry-run              Descubre rutas e imprime los pasos y el prompt (no cambia nada)
  --resume               Retoma la ejecución guardada en .pipeline/<slug>/
  --from-step <paso>     Con --resume, repite desde ese paso
  --base <rama>          Rama base (por defecto: main)
  --no-pr                Termina tras los commits locales
  --max-repairs <n>      Intentos de reparación automática (por defecto: 2)
  --model <modelo>       Modelo para el agente
  --max-budget-usd <n>   Tope de gasto por llamada al agente
  --probe <slug>         Solo ejecuta la prueba de personalización de una plantilla existente
`);
}

function parseArgs(argv) {
  const result = {
    url: "",
    slug: "",
    base: "main",
    dryRun: false,
    resume: false,
    fromStep: "",
    pr: true,
    maxRepairs: 2,
    model: "",
    maxBudgetUsd: "",
    probe: "",
    help: false,
  };
  const valueFlags = {
    "--base": "base",
    "--from-step": "fromStep",
    "--max-repairs": "maxRepairs",
    "--model": "model",
    "--max-budget-usd": "maxBudgetUsd",
    "--probe": "probe",
  };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--dry-run") result.dryRun = true;
    else if (arg === "--resume") result.resume = true;
    else if (arg === "--no-pr") result.pr = false;
    else if (arg in valueFlags) {
      result[valueFlags[arg]] = (argv[i + 1] ?? "").trim();
      i += 1;
    } else if (!arg.startsWith("--")) positional.push(arg.trim());
    else throw new PipelineError(`opción no reconocida: ${arg}`);
  }
  [result.url = "", result.slug = ""] = positional;
  result.maxRepairs = Number(result.maxRepairs);
  return result;
}

/**
 * Prueba de personalización (skill clone-website, "Deliver"): un cliente generado desde la
 * plantilla solo debe tener restos en los 4 puntos de personalización.
 */
function probe(slug) {
  const brands = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "scripts", "template-brands.json"), "utf8")
  );
  if (!(slug in brands.templates)) {
    throw new PipelineError(`sites/${slug} no está registrada en scripts/template-brands.json.`);
  }
  if (brands.templates[slug].brands.length === 0) {
    throw new PipelineError(
      `scripts/template-brands.json: "${slug}" no declara ninguna marca de ejemplo.`
    );
  }
  const probeDirs = [
    path.join(SITES_DIR, PROBE_SLUG),
    path.join(ROOT_DIR, "docs", "research", PROBE_SLUG),
    path.join(ROOT_DIR, "docs", "design-references", PROBE_SLUG),
  ];
  try {
    must("node", ["scripts/new-client-site.mjs", PROBE_SLUG, "--from", slug, "--skip-checks"]);
    const output = tail(run("node", ["scripts/customize-check.mjs", PROBE_SLUG]).output, 10000);
    const findings = [...output.matchAll(/^✖ (src\/[^\s:]+):\d+/gm)].map((match) => match[1]);
    if (findings.length === 0) {
      throw new PipelineError(
        `customize:check no encontró la marca de ejemplo de ${slug} en un cliente recién generado: revisa sus "brands" en scripts/template-brands.json.`
      );
    }
    const outside = [...new Set(findings.filter((file) => !CUSTOMIZATION_FILES.includes(file)))];
    if (outside.length > 0) {
      throw new PipelineError(
        `la plantilla tiene marca o datos de ejemplo fuera de los 4 puntos de personalización:\n  - ${outside.join("\n  - ")}`
      );
    }
    console.log(
      `✔ Prueba de personalización: ${findings.length} restos, todos en ${CUSTOMIZATION_FILES.join(", ")}.`
    );
  } finally {
    for (const dir of probeDirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

function buildPrBody({ slug, url, state }) {
  const summary = readIfExists(path.join(ROOT_DIR, "docs", "research", slug, "agent-summary.md"));
  const qa = readIfExists(path.join(ROOT_DIR, "docs", "research", slug, "visual-qa-report.md"));
  return [
    `## Nueva plantilla \`${slug}\``,
    "",
    `Clonada de ${url} con \`pnpm template:clone\` (skill clone-website, modo A — Plantilla).`,
    "",
    "## Resumen del agente",
    "",
    summary.trim() || "_El agente no escribió docs/research/<slug>/agent-summary.md._",
    "",
    "## Compuertas",
    "",
    "- [x] `pnpm verify` (aislamiento, lint, check, build)",
    `- [x] \`pnpm qa:site ${slug}\` (todas las rutas, desktop y mobile)`,
    `- [x] Prueba de personalización (\`node scripts/template-clone.mjs --probe ${slug}\`)`,
    `- Reparaciones automáticas: ${state.repairs ?? 0} · coste del agente: $${(state.costUsd ?? 0).toFixed(2)}`,
    "",
    "<details><summary>Informe de Visual QA</summary>",
    "",
    qa.trim() || "_Sin informe._",
    "</details>",
    "",
    "## Revisión humana",
    "",
    "- [ ] Comparado lado a lado con el original en desktop y mobile",
    "- [ ] Animaciones e interacciones revisadas con input real",
    "- [ ] `CUSTOMIZE.md` y `template-brands.json` revisados",
    "",
    "🤖 Generated with [Claude Code](https://claude.com/claude-code)",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.probe) {
    probe(args.probe);
    return;
  }
  if (args.help || !args.url || !args.slug) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const { url, slug, base } = args;
  const problems = [];
  if (!/^https?:\/\//.test(url)) problems.push(`la URL "${url}" debe empezar por http(s)://.`);
  if (!KEBAB_CASE_REGEX.test(slug) || !slug.startsWith("plantilla-")) {
    problems.push(`el slug "${slug}" debe ser kebab-case y empezar por "plantilla-".`);
  }
  if (!Number.isInteger(args.maxRepairs) || args.maxRepairs < 0)
    problems.push("--max-repairs debe ser un entero >= 0.");
  if (args.fromStep && !args.resume) problems.push("--from-step solo se usa junto con --resume.");
  for (const command of ["git", "pnpm", "claude", ...(args.pr ? ["gh"] : [])]) {
    if (!commandExists(command)) problems.push(`falta el comando "${command}" en el PATH.`);
  }
  const branch = `feat/${slug}`;
  for (const ghost of ghostSites()) {
    problems.push(
      `${ghost}/ no tiene package.json (restos ignorados de otra rama): bórrala o muévela.`
    );
  }
  if (!args.resume) {
    if (dirtyFiles().length > 0)
      problems.push("el árbol de trabajo no está limpio. Sin stash ni reset: revísalo tú.");
    if (fs.existsSync(path.join(SITES_DIR, slug))) problems.push(`sites/${slug}/ ya existe.`);
    if (branchExists(branch)) problems.push(`la rama ${branch} ya existe (local o en origin).`);
    if (loadState(slug))
      problems.push(`hay una ejecución guardada en .pipeline/${slug}/: usa --resume o bórrala.`);
  }
  if (problems.length > 0) {
    const message = `preflight:\n  - ${problems.join("\n  - ")}`;
    if (!args.dryRun) throw new PipelineError(message);
    log.warn(`${message}\n  (dry run: se continúa solo para mostrar el plan)`);
  }

  const routesFile = `docs/research/${slug}/routes.json`;
  const discovery = await discoverRoutes(url);
  if (!discovery.reachable) {
    throw new PipelineError(`no se pudo descargar ${url}.`);
  }
  if (discovery.localeRoutes.length > 0) {
    log.info(
      `${discovery.localeRoutes.length} variantes de idioma excluidas: ${discovery.localeRoutes.join(", ")}`
    );
  }
  log.ok(
    `${discovery.routes.length} rutas descubiertas en ${discovery.origin}: ${discovery.routes.join(", ")}`
  );

  const allowed = [
    `sites/${slug}/`,
    `docs/research/${slug}/`,
    `docs/design-references/${slug}/`,
    "scripts/template-brands.json",
    "pnpm-lock.yaml",
  ];
  const ownedPaths = [`sites/${slug}`, `docs/research/${slug}`, `docs/design-references/${slug}`];
  const claude = {
    model: args.model || undefined,
    maxBudgetUsd: args.maxBudgetUsd || undefined,
    allowedTools: CLONE_ALLOWED_TOOLS,
  };
  const prompt = buildClonePrompt({
    url,
    slug,
    routesFile,
    routes: discovery.routes,
    localeRoutes: discovery.localeRoutes,
  });
  const gates = [
    { name: "verify", command: "pnpm", args: ["verify"] },
    { name: "qa:site", command: "node", args: ["scripts/qa-site.mjs", slug] },
    {
      name: "prueba de personalización",
      command: "node",
      args: ["scripts/template-clone.mjs", "--probe", slug],
    },
  ];
  const name = discovery.title.split(/[|–—-]/)[0].trim() || slug;

  // Se reescribe también al retomar el paso agent, para que el agente lea el inventario actual
  const writeRoutes = () => {
    fs.mkdirSync(path.join(ROOT_DIR, "docs", "research", slug), { recursive: true });
    fs.writeFileSync(
      path.join(ROOT_DIR, routesFile),
      `${JSON.stringify({ source: url, ...discovery }, null, 2)}\n`
    );
  };

  const steps = [
    {
      name: "branch",
      title: `rama ${branch} desde ${base}`,
      run: () => {
        git("checkout", "-q", base);
        git("pull", "-q", "--ff-only", "origin", base);
        git("checkout", "-q", "-b", branch);
      },
    },
    {
      name: "generate",
      title: "pnpm new-client-site desde _template",
      run: () => {
        must(
          "node",
          [
            "scripts/new-client-site.mjs",
            slug,
            "--name",
            name,
            "--domain",
            `${slug}.example.com`,
            "--skip-checks",
          ],
          { capture: false }
        );
        writeRoutes();
        // Una plantilla no nace de otra: .template-origin solo tiene sentido en sitios de cliente
        fs.rmSync(path.join(SITES_DIR, slug, ".template-origin"), { force: true });
        must("pnpm", ["install"], { capture: false });
        commit(
          [...ownedPaths, "pnpm-lock.yaml"],
          `feat(${slug}): base de la plantilla e inventario de rutas`
        );
      },
    },
    {
      name: "agent",
      title: "clonado con Claude (skill clone-website, sin supervisión)",
      run: async (state) => {
        writeRoutes();
        const startedAt = Date.now();
        const summaryPath = path.join(ROOT_DIR, "docs", "research", slug, "agent-summary.md");
        const brandsPath = path.join(ROOT_DIR, "scripts", "template-brands.json");
        await runAgentUntilDone({
          slug,
          prompt,
          claude,
          state,
          isDone: () => {
            const missing = [];
            const pages = fs
              .readdirSync(path.join(SITES_DIR, slug, "src", "pages"), { recursive: true })
              .filter((file) => /\.astro$/.test(file) && !/^404\.astro$/.test(file));
            if (discovery.routes.length > 1 && pages.length < 2) {
              missing.push(`solo hay ${pages.length} página(s) en sites/${slug}/src/pages`);
            }
            if (!(slug in JSON.parse(fs.readFileSync(brandsPath, "utf8")).templates)) {
              missing.push(`${slug} no está registrada en scripts/template-brands.json`);
            }
            if (!fs.existsSync(summaryPath) || fs.statSync(summaryPath).mtimeMs < startedAt) {
              missing.push(`falta docs/research/${slug}/agent-summary.md`);
            }
            return missing.length > 0 ? missing.join("; ") : null;
          },
        });
        assertScope(base, allowed);
      },
    },
    {
      name: "gates",
      title: "verify, QA visual y prueba de personalización (con reparación)",
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
      title: "commit del clon",
      run: () => {
        assertScope(base, allowed);
        commit(
          [...ownedPaths, "scripts/template-brands.json", "pnpm-lock.yaml"],
          `feat(${slug}): nueva plantilla clonada de ${discovery.origin.replace(/^https?:\/\//, "")}\n\nCo-Authored-By: Claude <noreply@anthropic.com>`
        );
        const leftovers = dirtyFiles();
        if (leftovers.length > 0)
          throw new PipelineError(`quedan cambios sin commitear: ${leftovers.join(", ")}`);
      },
    },
    {
      name: "pr",
      title: args.pr ? "push y PR" : "omitido (--no-pr)",
      run: (state) => {
        if (!args.pr) {
          log.info(`Rama local lista: ${branch}.`);
          return;
        }
        state.prUrl = openPullRequest({
          branch,
          base,
          title: `feat(${slug}): nueva plantilla clonada de ${discovery.origin.replace(/^https?:\/\//, "")}`,
          body: buildPrBody({ slug, url, state }),
        });
        log.ok(`PR: ${state.prUrl}`);
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

  let state = { slug, url, branch, base, done: [] };
  if (args.resume) {
    state = loadState(slug) ?? state;
    if (state.done.length > 0 && currentBranch() !== state.branch) {
      throw new PipelineError(`--resume necesita estar en la rama ${state.branch}.`);
    }
  }
  await runSteps({ slug, steps, state, fromStep: args.fromStep });
  log.ok(
    `Plantilla ${slug} lista en ${branch} · estado en ${path.relative(ROOT_DIR, statePaths(slug).state)}`
  );
}

main().catch((error) => {
  console.error(
    `\n\x1b[31m✖ ${error instanceof PipelineError ? error.message : error.stack}\x1b[0m`
  );
  process.exit(1);
});
