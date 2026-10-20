#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { KEBAB_CASE_REGEX, ROOT_DIR, SITES_DIR } from "./lib/brief.mjs";

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("--")) ?? "";
const routesIndex = args.indexOf("--routes");
const routes = routesIndex >= 0 ? (args[routesIndex + 1] ?? "") : "auto";

if (!slug || args.includes("--help") || args.includes("-h")) {
  console.log(`
Uso:
  pnpm qa:site <slug> [--routes "/,/ruta"] [--update]

Compila sites/<slug> y ejecuta la suite de Playwright (desktop y mobile) sobre todas las
páginas del build (QA_ROUTES=auto) o sobre las rutas indicadas. Genera el informe Markdown.
`);
  process.exit(slug ? 0 : 1);
}
if (!(KEBAB_CASE_REGEX.test(slug) || slug === "_template")) {
  console.error(`✖ Error: el slug "${slug}" no es válido.`);
  process.exit(1);
}
if (!fs.existsSync(path.join(SITES_DIR, slug, "package.json"))) {
  console.error(`✖ Error: no existe sites/${slug}/.`);
  process.exit(1);
}

const env = { ...process.env, SITE_FOLDER: slug, QA_ROUTES: routes };
const run = (command, commandArgs, extraEnv = env) =>
  spawnSync(command, commandArgs, { cwd: ROOT_DIR, env: extraEnv, stdio: "inherit" }).status ?? 1;

// QA_ROUTES=auto lee las rutas de dist/ al recoger los tests, antes de que arranque el servidor
if (run("pnpm", ["--filter", `./sites/${slug}`, "build"]) !== 0) {
  process.exit(1);
}

const update = args.includes("--update");
const playwrightArgs = ["exec", "playwright", "test", ...(update ? ["--update-snapshots"] : [])];
const testStatus = run("pnpm", playwrightArgs, update ? { ...env, UPDATE_SNAPSHOTS: "true" } : env);
const summaryStatus = run("node", ["scripts/visual-qa-summary.mjs"]);
process.exit(testStatus || summaryStatus);
