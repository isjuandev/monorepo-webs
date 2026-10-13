#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteFolder = process.env.SITE_FOLDER || "_template";
const reportJsonPath = path.join(ROOT_DIR, "docs", "research", siteFolder, "visual-qa-report.json");
const reportMdPath = path.join(ROOT_DIR, "docs", "research", siteFolder, "visual-qa-report.md");

if (!fs.existsSync(reportJsonPath)) {
  console.error(`✖ No se encontró reporte JSON en ${reportJsonPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportJsonPath, "utf8"));
const stats = report.stats || {};
const lines = [
  `# Informe de Control de Calidad Visual (Visual QA) — \`sites/${siteFolder}\``,
  "",
  `- **Fecha:** ${new Date().toISOString()}`,
  `- **Sitio evaluado:** \`sites/${siteFolder}\``,
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
