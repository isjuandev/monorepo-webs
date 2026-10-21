#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { listSites, ROOT_DIR } from "./lib/paths.mjs";

// Cambios en estas rutas afectan a todos los sitios
const SHARED_PATHS = [
  "packages/",
  "tests/",
  "playwright.config.ts",
  "package.json",
  "pnpm-lock.yaml",
  "turbo.json",
];

const base = (process.argv[2] ?? "").trim();
if (!base || base === "--help" || base === "-h") {
  console.log(`
Uso:
  node scripts/changed-sites.mjs <ref-base>

Imprime (uno por línea) los slugs de plantillas/ y clientes/ que cambian respecto a <ref-base>.
Si cambia el núcleo compartido (${SHARED_PATHS.join(", ")}), imprime todos.
`);
  process.exit(base ? 0 : 1);
}

const sites = listSites().sort((a, b) => a.slug.localeCompare(b.slug));
const allSites = sites.map((site) => site.slug);

const diff = spawnSync("git", ["diff", "--name-only", `${base}...HEAD`], {
  cwd: ROOT_DIR,
  encoding: "utf8",
});
if (diff.status !== 0) {
  // Sin base comparable (p. ej. primer push): se prueban todos
  console.error(`Aviso: no se pudo comparar con ${base}; se listan todos los sitios.`);
  console.log(allSites.join("\n"));
  process.exit(0);
}

const files = diff.stdout.split("\n").filter(Boolean);
const shared = files.some((file) =>
  SHARED_PATHS.some((prefix) => (prefix.endsWith("/") ? file.startsWith(prefix) : file === prefix))
);
const changed = shared
  ? allSites
  : sites
      .filter((site) => files.some((file) => file.startsWith(`${site.rel}/`)))
      .map((site) => site.slug);

if (changed.length > 0) {
  console.log(changed.join("\n"));
}
