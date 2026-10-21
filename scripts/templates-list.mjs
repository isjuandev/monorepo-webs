#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { DEFAULT_TEMPLATE, listSites, PLANTILLAS_DIR, ROOT_DIR } from "./lib/paths.mjs";

const START = "<!-- catalogo:inicio -->";
const END = "<!-- catalogo:fin -->";
const README_PATH = path.join(PLANTILLAS_DIR, "README.md");

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Uso:
  pnpm plantilla:lista [--write]

Muestra el catálogo de plantillas/ a partir de cada plantilla.json y de sus páginas.
Con --write actualiza la tabla del catálogo en plantillas/README.md.
`);
  process.exit(0);
}

/** Rutas del sitio a partir de src/pages (sin 404 ni endpoints) */
function pagesOf(dir) {
  const pagesDir = path.join(dir, "src", "pages");
  return fs
    .readdirSync(pagesDir, { recursive: true })
    .filter((file) => file.endsWith(".astro") && !/(^|\/)404\.astro$/.test(file))
    .map((file) => `/${file.replace(/\.astro$/, "").replace(/(^|\/)index$/, "")}`)
    .map((route) => route.replace(/\/$/, "") || "/")
    .sort();
}

const rows = listSites("plantilla").map((site) => {
  const manifest = site.manifest ?? {};
  const pages = pagesOf(site.dir);
  return {
    slug: site.slug,
    nombre: manifest.nombre ?? site.slug,
    idioma: manifest.idioma ?? "?",
    negocio: (manifest.negocio ?? []).join(", ") || "—",
    descripcion: manifest.descripcion ?? "",
    demo: manifest.demo ?? "",
    paginas: pages,
  };
});

const table = [
  "| Plantilla | Idioma | Negocio | Páginas | Demo | Descripción |",
  "| :-- | :-- | :-- | :-- | :-- | :-- |",
  ...rows.map((row) =>
    [
      "",
      `\`${row.slug}\`${row.slug === DEFAULT_TEMPLATE ? " (por defecto)" : ""}`,
      row.idioma,
      row.negocio,
      `${row.paginas.length}: ${row.paginas.map((page) => `\`${page}\``).join(" ")}`,
      row.demo ? `[ver](${row.demo})` : "—",
      row.descripcion,
      "",
    ]
      .join(" | ")
      .trim()
  ),
].join("\n");

if (args.includes("--write")) {
  const readme = fs.readFileSync(README_PATH, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start < 0 || end < start) {
    console.error(
      `✖ ${path.relative(ROOT_DIR, README_PATH)} no tiene los marcadores del catálogo.`
    );
    process.exit(1);
  }
  fs.writeFileSync(
    README_PATH,
    `${readme.slice(0, start + START.length)}\n\n${table}\n\n${readme.slice(end)}`
  );
  console.log(`✔ Catálogo actualizado en ${path.relative(ROOT_DIR, README_PATH)}`);
} else {
  console.log(`\nPlantillas disponibles (${rows.length}):\n`);
  for (const row of rows) {
    const flag = row.slug === DEFAULT_TEMPLATE ? " · por defecto" : "";
    console.log(`• ${row.slug} — ${row.nombre} [${row.idioma} · ${row.negocio}${flag}]`);
    console.log(`  ${row.descripcion}`);
    console.log(`  ${row.paginas.length} páginas: ${row.paginas.join(" ")}`);
    if (row.demo) console.log(`  Demo: ${row.demo}`);
    console.log("");
  }
}
