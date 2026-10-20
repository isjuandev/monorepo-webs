import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR } from "./brief.mjs";
import { buildRepairPrompt } from "./prompts.mjs";

export const STATE_ROOT = path.join(ROOT_DIR, ".pipeline");
// Códigos de color ANSI (ESC[...m) de las salidas de terminal
const ANSI_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*[A-Za-z]`, "g");
const OUTPUT_TAIL_LINES = 150;

// Herramientas del agente headless: edición de archivos, comandos pnpm/node del repo y skills.
// git queda fuera: ramas, commits y PR los hace el orquestador.
export const AGENT_ALLOWED_TOOLS = [
  "Read",
  "Edit",
  "MultiEdit",
  "Write",
  "Glob",
  "Grep",
  "TodoWrite",
  "Skill",
  "Bash(pnpm:*)",
  "Bash(node scripts/:*)",
  "Bash(ls:*)",
  "Bash(mkdir:*)",
  "Bash(rm sites/:*)",
  "mcp__codebase-memory-mcp",
];
export const AGENT_DISALLOWED_TOOLS = ["Bash(git:*)", "Bash(gh:*)", "Bash(npm:*)", "Bash(npx:*)"];

export const log = {
  step: (message) => console.log(`\n\x1b[36m▶ ${message}\x1b[0m`),
  info: (message) => console.log(`  ${message}`),
  ok: (message) => console.log(`\x1b[32m✔ ${message}\x1b[0m`),
  warn: (message) => console.log(`\x1b[33m⚠ ${message}\x1b[0m`),
};

export class PipelineError extends Error {}

export function fail(message) {
  throw new PipelineError(message);
}

/** Ejecuta un comando y devuelve { ok, status, output }. Con capture = false hereda la terminal. */
export function run(command, args = [], { capture = true, env, input } = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    env: { ...process.env, ...env },
    input,
    encoding: "utf8",
    stdio: capture ? ["pipe", "pipe", "pipe"] : ["inherit", "inherit", "inherit"],
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  return { ok: result.status === 0, status: result.status, output };
}

/** Ejecuta un comando y aborta el pipeline si falla */
export function must(command, args = [], options = {}) {
  const result = run(command, args, options);
  if (!result.ok) {
    fail(`falló: ${command} ${args.join(" ")}\n${tail(result.output, 40)}`);
  }
  return result.output.trim();
}

export function git(...args) {
  return must("git", args);
}

/** Últimas líneas de una salida, sin códigos ANSI */
export function tail(output, lines = OUTPUT_TAIL_LINES) {
  return output.replace(ANSI_REGEX, "").trimEnd().split("\n").slice(-lines).join("\n");
}

export function commandExists(command) {
  return run("which", [command]).ok;
}

/**
 * Carpetas de sites/ sin package.json: restos ignorados (dist, node_modules) de otra rama.
 * Rompen verify:isolation, así que el preflight las reporta (no se borran solas).
 */
export function ghostSites() {
  const sitesDir = path.join(ROOT_DIR, "sites");
  return fs
    .readdirSync(sitesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !fs.existsSync(path.join(sitesDir, entry.name, "package.json")))
    .map((entry) => `sites/${entry.name}`);
}

export function currentBranch() {
  return git("rev-parse", "--abbrev-ref", "HEAD");
}

export function branchExists(branch) {
  const local = run("git", ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`]).ok;
  const remote = run("git", ["ls-remote", "--exit-code", "--heads", "origin", branch]).ok;
  return local || remote;
}

/** Archivos con cambios sin commitear (incluye los no rastreados) */
export function dirtyFiles() {
  return git("status", "--porcelain", "--untracked-files=all")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/^.* -> /, ""));
}

/** Archivos que difieren de la rama base, commiteados o no */
export function changedFiles(base) {
  const committed = git("diff", "--name-only", `${base}...HEAD`).split("\n").filter(Boolean);
  return [...new Set([...committed, ...dirtyFiles()])];
}

/** Devuelve los archivos cambiados fuera de los prefijos permitidos */
export function scopeViolations(base, allowed) {
  return changedFiles(base).filter(
    (file) =>
      !allowed.some((prefix) => (prefix.endsWith("/") ? file.startsWith(prefix) : file === prefix))
  );
}

export function assertScope(base, allowed) {
  const violations = scopeViolations(base, allowed);
  if (violations.length > 0) {
    fail(
      `cambios fuera del alcance permitido (revísalos a mano, no se revierten solos):\n  - ${violations.join("\n  - ")}`
    );
  }
  log.ok("Guardia de alcance: todos los cambios están dentro de las rutas permitidas.");
}

/** Commit de las rutas indicadas; no hace nada si no hay cambios. Devuelve true si commiteó. */
export function commit(paths, message) {
  must("git", ["add", "-A", "--", ...paths]);
  if (run("git", ["diff", "--cached", "--quiet"]).ok) {
    return false;
  }
  must("git", ["commit", "-q", "-m", message]);
  log.ok(`Commit: ${message.split("\n")[0]}`);
  return true;
}

export function statePaths(slug) {
  const dir = path.join(STATE_ROOT, slug);
  return { dir, state: path.join(dir, "state.json"), agentLog: path.join(dir, "agent.jsonl") };
}

export function loadState(slug) {
  const { state } = statePaths(slug);
  return fs.existsSync(state) ? JSON.parse(fs.readFileSync(state, "utf8")) : null;
}

export function saveState(slug, state) {
  const paths = statePaths(slug);
  fs.mkdirSync(paths.dir, { recursive: true });
  fs.writeFileSync(
    paths.state,
    `${JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2)}\n`
  );
}

/** Resumen corto de lo que hace el agente, a partir de los eventos stream-json */
function describeEvent(event) {
  if (event.type !== "assistant") {
    return null;
  }
  return (event.message?.content ?? [])
    .map((block) => {
      if (block.type === "tool_use") {
        const input = block.input ?? {};
        const detail = input.file_path ?? input.command ?? input.pattern ?? input.skill ?? "";
        return `· ${block.name}${detail ? ` ${String(detail).replace(`${ROOT_DIR}/`, "").slice(0, 100)}` : ""}`;
      }
      if (block.type === "text" && block.text.trim()) {
        return `  ${block.text.trim().split("\n")[0].slice(0, 120)}`;
      }
      return null;
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Ejecuta Claude Code sin supervisión (`claude -p`, stream-json) y devuelve
 * { sessionId, isError, subtype, result, costUsd, turns }.
 */
export function runClaude({
  slug,
  prompt,
  resume,
  model,
  maxBudgetUsd,
  allowedTools,
  disallowedTools,
}) {
  const { dir, agentLog } = statePaths(slug);
  fs.mkdirSync(dir, { recursive: true });
  const args = [
    "-p",
    "--output-format",
    "stream-json",
    "--verbose",
    "--permission-mode",
    "acceptEdits",
    "--allowedTools",
    ...(allowedTools ?? AGENT_ALLOWED_TOOLS),
    "--disallowedTools",
    ...(disallowedTools ?? AGENT_DISALLOWED_TOOLS),
    ...(resume ? ["--resume", resume] : []),
    ...(model ? ["--model", model] : []),
    ...(maxBudgetUsd ? ["--max-budget-usd", String(maxBudgetUsd)] : []),
  ];

  return new Promise((resolve, reject) => {
    const child = spawn("claude", args, { cwd: ROOT_DIR, stdio: ["pipe", "pipe", "inherit"] });
    const logStream = fs.createWriteStream(agentLog, { flags: "a" });
    let buffer = "";
    let sessionId = resume ?? null;
    let final = null;

    child.stdout.on("data", (chunk) => {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        logStream.write(`${line}\n`);
        let event;
        try {
          event = JSON.parse(line);
        } catch {
          continue;
        }
        if (event.session_id) sessionId = event.session_id;
        if (event.type === "result") final = event;
        const description = describeEvent(event);
        if (description) console.log(`\x1b[2m${description}\x1b[0m`);
      }
    });
    child.on("error", reject);
    child.on("close", (code) => {
      logStream.end();
      if (!final) {
        reject(
          new PipelineError(
            `claude terminó (código ${code}) sin evento de resultado. Log: ${agentLog}`
          )
        );
        return;
      }
      resolve({
        sessionId,
        isError: Boolean(final.is_error),
        subtype: final.subtype,
        result: final.result ?? "",
        costUsd: final.total_cost_usd ?? 0,
        turns: final.num_turns ?? 0,
      });
    });
    child.stdin.end(prompt);
  });
}

/** Ejecuta las compuertas en orden; devuelve la primera que falle o null */
export function runGates(gates) {
  for (const gate of gates) {
    log.step(`Compuerta: ${gate.name}`);
    const result = run(gate.command, gate.args, { capture: true });
    if (!result.ok) {
      log.warn(`Falló: ${gate.name}`);
      return { gate: gate.name, output: tail(result.output) };
    }
    log.ok(gate.name);
  }
  return null;
}

/**
 * Compuertas con bucle de reparación: si una falla, el agente la corrige en la misma sesión
 * y se repiten todas, hasta maxRepairs intentos. Tras cada reparación se revisa el alcance.
 * Devuelve el número de reparaciones que hicieron falta.
 */
export async function gatesWithRepair({ slug, gates, state, maxRepairs, claude, base, allowed }) {
  for (let attempt = 0; ; attempt += 1) {
    const failure = runGates(gates);
    if (!failure) {
      return attempt;
    }
    if (attempt >= maxRepairs) {
      fail(
        `la compuerta "${failure.gate}" sigue fallando tras ${maxRepairs} reparaciones.\n${tail(failure.output, 40)}\nCorrige a mano y retoma con --resume --from-step gates.`
      );
    }
    log.step(`Reparación ${attempt + 1}/${maxRepairs} (${failure.gate})`);
    const response = await runClaude({
      ...claude,
      slug,
      resume: state.sessionId,
      prompt: buildRepairPrompt({
        slug,
        gate: failure.gate,
        output: failure.output,
        attempt: attempt + 1,
        maxAttempts: maxRepairs,
      }),
    });
    state.sessionId = response.sessionId;
    state.costUsd = (state.costUsd ?? 0) + response.costUsd;
    saveState(slug, state);
    assertScope(base, allowed);
  }
}

/** Ejecuta los pasos en orden, con reanudación (state.done) y --from-step */
export async function runSteps({ slug, steps, state, fromStep }) {
  const names = steps.map((step) => step.name);
  if (fromStep && !names.includes(fromStep)) {
    fail(`--from-step "${fromStep}" no existe. Pasos: ${names.join(", ")}.`);
  }
  const startIndex = fromStep ? names.indexOf(fromStep) : 0;
  state.done = (state.done ?? []).filter((name) => names.indexOf(name) < startIndex);

  for (const step of steps.slice(startIndex)) {
    if (state.done.includes(step.name)) {
      continue;
    }
    log.step(`Paso ${names.indexOf(step.name) + 1}/${names.length}: ${step.name} — ${step.title}`);
    state.current = step.name;
    saveState(slug, state);
    await step.run(state);
    state.done.push(step.name);
    saveState(slug, state);
  }
  state.current = null;
  saveState(slug, state);
}

/** Lee la sección "## Datos pendientes" de un resumen Markdown */
export function pendingSection(markdown) {
  const match = /^## Datos pendientes\s*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(markdown);
  return match ? match[1].trim() : "";
}

export function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

/** Push de la rama y apertura del PR con gh; devuelve la URL del PR */
export function openPullRequest({ branch, base, title, body }) {
  must("git", ["push", "-u", "origin", branch]);
  const existing = run("gh", ["pr", "view", branch, "--json", "url", "--jq", ".url"]);
  if (existing.ok && existing.output.trim()) {
    log.info("El PR ya existía; se actualizó con el push.");
    return existing.output.trim();
  }
  return must(
    "gh",
    ["pr", "create", "--base", base, "--head", branch, "--title", title, "--body-file", "-"],
    {
      input: body,
    }
  )
    .split("\n")
    .pop();
}
