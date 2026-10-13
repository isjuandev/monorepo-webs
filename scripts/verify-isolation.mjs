#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITES_DIR = path.join(ROOT_DIR, "sites");
const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

const SOURCE_EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const FORBIDDEN_LOCKFILES = ["package-lock.json", "yarn.lock", "bun.lockb"];
const FORBIDDEN_DEPS = ["react", "react-dom"];

/**
 * Recorre recursivamente un directorio devolviendo rutas de archivos
 * @param {string} dir
 * @returns {string[]}
 */
function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name === ".astro" ||
      entry.name === ".turbo" ||
      entry.name === ".git"
    ) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extrae todos los specifiers de import/export/from de un archivo fuente
 * @param {string} content
 * @returns {string[]}
 */
function extractImports(content) {
  const specs = [];
  const importRegex =
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  let match = importRegex.exec(content);
  while (match !== null) {
    const spec = match[1] || match[2];
    if (spec) specs.push(spec);
    match = importRegex.exec(content);
  }
  return specs;
}

const errors = [];

// 1. Verificar lockfiles prohibidos en la raíz y subcarpetas
for (const lockfile of FORBIDDEN_LOCKFILES) {
  if (fs.existsSync(path.join(ROOT_DIR, lockfile))) {
    errors.push(`Lockfile prohibido detectado en raíz: ${lockfile}. Usa exclusivamente pnpm.`);
  }
}

// 2. Listar sitios y paquetes
const siteSlugs = fs.existsSync(SITES_DIR)
  ? fs
      .readdirSync(SITES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : [];

const packageSlugs = fs.existsSync(PACKAGES_DIR)
  ? fs
      .readdirSync(PACKAGES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : [];

// 3. Verificar que packages/* no importen nada de sites/* ni tengan dependencias prohibidas
for (const pkgSlug of packageSlugs) {
  const pkgDir = path.join(PACKAGES_DIR, pkgSlug);
  const pkgJsonPath = path.join(pkgDir, "package.json");

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...pkgJson.peerDependencies,
    };

    for (const dep of Object.keys(allDeps)) {
      if (dep.startsWith("@sites/")) {
        errors.push(`packages/${pkgSlug}/package.json no puede depender de un cliente (${dep}).`);
      }
      if (FORBIDDEN_DEPS.includes(dep)) {
        errors.push(`packages/${pkgSlug}/package.json contiene dependencia prohibida: ${dep}.`);
      }
    }
  }

  for (const filePath of walkFiles(pkgDir)) {
    if (!SOURCE_EXTENSIONS.has(path.extname(filePath))) continue;
    const relPath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, "utf8");
    for (const spec of extractImports(content)) {
      if (spec.startsWith("@sites/") || spec.includes("/sites/")) {
        errors.push(
          `${relPath}: Paquete compartido importa desde un sitio de cliente ("${spec}").`
        );
      }
    }
  }
}

// 4. Verificar aislamiento estricto entre sitios de clientes y estructura SEO mínima
for (const siteSlug of siteSlugs) {
  const siteDir = path.join(SITES_DIR, siteSlug);
  const pkgJsonPath = path.join(siteDir, "package.json");

  for (const lockfile of FORBIDDEN_LOCKFILES) {
    if (fs.existsSync(path.join(siteDir, lockfile))) {
      errors.push(`sites/${siteSlug}/${lockfile}: Lockfile prohibido detectado.`);
    }
  }

  if (!fs.existsSync(pkgJsonPath)) {
    errors.push(`sites/${siteSlug}: Falta package.json.`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const expectedPkgName = siteSlug === "_template" ? "@sites/template" : `@sites/${siteSlug}`;
  if (pkgJson.name !== expectedPkgName) {
    errors.push(
      `sites/${siteSlug}/package.json: "name" debe ser "${expectedPkgName}" (actual: "${pkgJson.name}").`
    );
  }

  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies,
  };
  for (const dep of Object.keys(allDeps)) {
    if (dep.startsWith("@sites/")) {
      errors.push(
        `sites/${siteSlug}/package.json: Prohibido depender de otro sitio de cliente (${dep}).`
      );
    }
    if (FORBIDDEN_DEPS.includes(dep)) {
      errors.push(`sites/${siteSlug}/package.json: Dependencia prohibida detectada (${dep}).`);
    }
  }

  // Verificar archivos requeridos de SEO y dominio por cliente
  const requiredFiles = ["astro.config.mjs", "src/config/site.ts", "src/pages/robots.txt.ts"];
  for (const reqFile of requiredFiles) {
    if (!fs.existsSync(path.join(siteDir, reqFile))) {
      errors.push(`sites/${siteSlug}: Falta archivo obligatorio "${reqFile}".`);
    }
  }

  // Verificar que ningún archivo fuente importe desde otro cliente
  for (const filePath of walkFiles(siteDir)) {
    if (!SOURCE_EXTENSIONS.has(path.extname(filePath))) continue;
    const relPath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, "utf8");

    for (const spec of extractImports(content)) {
      if (spec.startsWith("@sites/") && spec !== expectedPkgName) {
        errors.push(`${relPath}: Importación cruzada prohibida hacia otro cliente ("${spec}").`);
      }
      if (spec.startsWith("../")) {
        const resolvedTarget = path.resolve(path.dirname(filePath), spec);
        if (!resolvedTarget.startsWith(siteDir) && resolvedTarget.startsWith(SITES_DIR)) {
          errors.push(
            `${relPath}: Ruta relativa escapa del cliente actual hacia otro sitio ("${spec}").`
          );
        }
      }
      for (const otherSlug of siteSlugs) {
        if (otherSlug !== siteSlug && spec.includes(`sites/${otherSlug}`)) {
          errors.push(
            `${relPath}: Referencia cruzada prohibida hacia "sites/${otherSlug}" ("${spec}").`
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("\x1b[31m✖ Falló la verificación de aislamiento y gobernanza del monorepo:\x1b[0m");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(
    `\x1b[32m✔ Aislamiento y gobernanza verificados (${siteSlugs.length} sitio(s), ${packageSlugs.length} paquete(s)).\x1b[0m`
  );
}
