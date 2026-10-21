#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { docsPaths, ROOT_DIR, resolveSite } from "./lib/paths.mjs";

const site = resolveSite(process.env.SITE_FOLDER || "_base");
if (!site) {
  console.error(
    `✖ SITE_FOLDER="${process.env.SITE_FOLDER}" no existe en clientes/ ni plantillas/.`
  );
  process.exit(1);
}
const qaDir = path.join(ROOT_DIR, docsPaths(site.rel).qa);
const reportJsonPath = path.join(qaDir, "visual-qa-report.json");
const reportMdPath = path.join(qaDir, "visual-qa-report.md");

if (!fs.existsSync(reportJsonPath)) {
  console.error(`✖ No se encontró reporte JSON en ${reportJsonPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportJsonPath, "utf8"));
const stats = report.stats || {};
const lines = [
  `# Informe de Control de Calidad Visual (Visual QA) — \`${site.rel}\``,
  "",
  `- **Fecha:** ${new Date().toISOString()}`,
  `- **Sitio evaluado:** \`${site.rel}\``,
  `- **Pruebas esperadas (pasadas):** ${stats.expected ?? 0}`,
  `- **Pruebas fallidas (discrepancias):** ${stats.unexpected ?? 0}`,
  `- **Pruebas omitidas:** ${stats.skipped ?? 0}`,
  "",
  "## Detalle de Ejecución por Viewport y Ruta",
  "",
];

for (const suite of report.suites || []) {
  for (const childSuite of suite.suites || []) {
    lines.push(`### ${childSuite.title}`);
    lines.push("");
    for (const spec of childSuite.specs || []) {
      for (const testRun of spec.tests || []) {
        const project = testRun.projectName || "default";
        const status = testRun.status === "expected" ? "PASS" : testRun.status.toUpperCase();
        lines.push(`- **[${status}] (${project})** ${spec.title}`);
        for (const annotation of testRun.annotations || []) {
          lines.push(`  - *Nota (${annotation.type}):* ${annotation.description}`);
        }
        for (const result of testRun.results || []) {
          for (const err of result.errors || []) {
            lines.push(`  - **Error / Discrepancia:** \`${(err.message || "").split("\n")[0]}\``);
          }
        }
      }
    }
    lines.push("");
  }
}

fs.writeFileSync(reportMdPath, `${lines.join("\n")}\n`, "utf8");
console.log(`✔ Informe de Visual QA generado en ${path.relative(ROOT_DIR, reportMdPath)}`);
