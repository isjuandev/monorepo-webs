#!/usr/bin/env node

import { optimizeSiteAssets } from "./lib/assets.mjs";

function printUsage() {
  console.log(`
Uso:
  pnpm cliente:activos <slug-cliente> [--force]

Copia y optimiza los activos de recursos/<slug-cliente>/ hacia clientes/<slug-cliente>/public/,
con una convención plana (mismo nombre de archivo, otra carpeta):
  fotos/**/<nombre>.*     → public/images/<nombre>.webp (redimensionadas, EXIF aplicado)
  marca/<imagen>.*        → public/images/<imagen>.webp (svg: copia en public/images/)
  marca/og-image.*        → public/images/og-image.jpg (1200x630)
  marca/favicon*, apple-touch-icon* → public/ (copia)
  marca/fuentes/*.woff2   → public/fonts/
Dos archivos con el mismo nombre en carpetas distintas se reportan y no se pisan.
Escribe el mapa origen → destino en clientes/<slug-cliente>/docs/assets-manifest.json.
Ignora entrada/ y .intake/ (material crudo que ordena el paso intake de cliente:crear).
Sin --force, omite los archivos cuyo destino ya es más reciente que el origen.
`);
}

function fail(message) {
  console.error(`\x1b[31m✖ Error: ${message}\x1b[0m`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((arg) => !arg.startsWith("--")) ?? "";
  const force = args.includes("--force");
  if (!slug || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(slug ? 0 : 1);
  }
  try {
    await optimizeSiteAssets(slug, { force });
  } catch (error) {
    fail(error.message);
  }
}

main();
