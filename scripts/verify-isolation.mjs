#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { CLIENTES_DIR, listSiteFolders, PLANTILLAS_DIR, ROOT_DIR } from "./lib/paths.mjs";

const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

const SOURCE_EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const FORBIDDEN_LOCKFILES = ["package-lock.json", "yarn.lock", "bun.lockb"];
const FORBIDDEN_DEPS = ["react", "react-dom"];
const SITE_SCOPES = ["@plantillas/", "@clientes/", "@sites/"];
const SITE_ROOTS = [PLANTILLAS_DIR, CLIENTES_DIR];
const isSitePackage = (name) => SITE_SCOPES.some((scope) => name.startsWith(scope));

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

// 2. Listar sitios (plantillas/ y clientes/) y paquetes
if (fs.existsSync(path.join(ROOT_DIR, "sites"))) {
  errors.push(
    "sites/ ya no se usa: los sitios viven en plantillas/ y clientes/ (borra la carpeta y sus restos)."
  );
}
const sites = listSiteFolders();
const slugCounts = new Map();
for (const site of sites) slugCounts.set(site.slug, (slugCounts.get(site.slug) ?? 0) + 1);
for (const [slug, count] of slugCounts) {
  if (count > 1) {
    errors.push(`El slug "${slug}" existe a la vez en plantillas/ y clientes/: debe ser único.`);
  }
}

const packageSlugs = fs.existsSync(PACKAGES_DIR)
  ? fs
      .readdirSync(PACKAGES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : [];

// 3. Verificar que packages/* no importen nada de plantillas/ ni clientes/ ni tengan dependencias prohibidas
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
      if (isSitePackage(dep)) {
        errors.push(`packages/${pkgSlug}/package.json no puede depender de un sitio (${dep}).`);
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
      if (isSitePackage(spec) || /(^|\/)(plantillas|clientes|sites)\//.test(spec)) {
        errors.push(`${relPath}: Paquete compartido importa desde un sitio ("${spec}").`);
      }
    }
  }
}

// 4. Verificar aislamiento estricto entre sitios, manifiestos y estructura SEO mínima
for (const site of sites) {
  const siteDir = site.dir;

  for (const lockfile of FORBIDDEN_LOCKFILES) {
    if (fs.existsSync(path.join(siteDir, lockfile))) {
      errors.push(`${site.rel}/${lockfile}: Lockfile prohibido detectado.`);
    }
  }

  if (!site.pkg) {
    errors.push(
      `${site.rel}: Falta package.json (si son restos ignorados de otra rama, borra la carpeta).`
    );
    continue;
  }

  const manifestName = site.kind === "plantilla" ? "plantilla.json" : "cliente.json";
  if (!site.manifest) {
    errors.push(`${site.rel}: Falta el manifiesto ${manifestName}.`);
  } else if (
    site.kind === "plantilla" &&
    (site.manifest.marcas ?? []).length === 0 &&
    site.slug !== "_base"
  ) {
    errors.push(`${site.rel}/plantilla.json: declara al menos una marca de ejemplo en "marcas".`);
  } else if (site.kind === "cliente" && !site.manifest.plantilla) {
    errors.push(`${site.rel}/cliente.json: falta "plantilla" (plantilla de origen).`);
  }

  const scope = site.kind === "plantilla" ? "@plantillas" : "@clientes";
  const expectedPkgName = `${scope}/${site.slug === "_base" ? "base" : site.slug}`;
  if (site.pkg !== expectedPkgName) {
    errors.push(
      `${site.rel}/package.json: "name" debe ser "${expectedPkgName}" (actual: "${site.pkg}").`
    );
  }

  const pkgJson = JSON.parse(fs.readFileSync(path.join(siteDir, "package.json"), "utf8"));
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies,
  };
  for (const dep of Object.keys(allDeps)) {
    if (isSitePackage(dep)) {
      errors.push(`${site.rel}/package.json: Prohibido depender de otro sitio (${dep}).`);
    }
    if (FORBIDDEN_DEPS.includes(dep)) {
      errors.push(`${site.rel}/package.json: Dependencia prohibida detectada (${dep}).`);
    }
  }

  // Verificar archivos requeridos de SEO y dominio por sitio
  const requiredFiles = ["astro.config.mjs", "src/config/site.ts", "src/pages/robots.txt.ts"];
  for (const reqFile of requiredFiles) {
    if (!fs.existsSync(path.join(siteDir, reqFile))) {
      errors.push(`${site.rel}: Falta archivo obligatorio "${reqFile}".`);
    }
  }

  // Verificar que ningún archivo fuente importe desde otro sitio (plantilla o cliente)
  for (const filePath of walkFiles(siteDir)) {
    if (!SOURCE_EXTENSIONS.has(path.extname(filePath))) continue;
    // docs/ guarda capturas y HTML de referencia de la web de origen, no código del sitio
    if (filePath.startsWith(path.join(siteDir, "docs") + path.sep)) continue;
    const relPath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, "utf8");

    for (const spec of extractImports(content)) {
      if (isSitePackage(spec) && spec !== expectedPkgName) {
        errors.push(`${relPath}: Importación cruzada prohibida hacia otro sitio ("${spec}").`);
      }
      if (spec.startsWith("../")) {
        const resolvedTarget = path.resolve(path.dirname(filePath), spec);
        const escapes = !resolvedTarget.startsWith(`${siteDir}${path.sep}`);
        if (escapes && SITE_ROOTS.some((root) => resolvedTarget.startsWith(root))) {
          errors.push(`${relPath}: Ruta relativa escapa del sitio actual hacia otro ("${spec}").`);
        }
      }
      for (const other of sites) {
        if (other.slug !== site.slug && spec.includes(other.rel)) {
          errors.push(`${relPath}: Referencia cruzada prohibida hacia "${other.rel}" ("${spec}").`);
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
    `\x1b[32m✔ Aislamiento y gobernanza verificados (${sites.filter((site) => site.kind === "plantilla").length} plantilla(s), ${sites.filter((site) => site.kind === "cliente").length} cliente(s), ${packageSlugs.length} paquete(s)).\x1b[0m`
  );
}
