---
name: review-monorepo
description: Audit branch changes across the monorepo before opening or merging a Pull Request. Verifies client isolation, shared package impact, lockfile integrity, Biome linting, Astro/TS diagnostics, and build reproducibility.
---

# Review Monorepo (`review-monorepo`)

Audit changes in the repository to guarantee strict compliance with [AGENTS.md](../../../AGENTS.md), client isolation, and build stability before merging into `main`.

## 1. Propósito

Actuar como guardián técnico de calidad y arquitectura del monorepo colaborativo, detectando acoplamientos prohibidos entre clientes, cambios riesgosos en paquetes transversales (`packages/*`, `sites/_template`, `docker/`), desviaciones de estilo y errores de compilación.

## 2. Entradas

- Rama de trabajo actual comparada contra `main` (`git diff main...HEAD` y `git status`).
- Lista de sitios y paquetes modificados.

## 3. Procedimiento

1. **Inspección de alcance (Git Diff):**
   - Ejecuta `git status` y `git diff --name-only main...HEAD` para clasificar los archivos modificados en:
     - **Aislados de cliente:** `sites/<slug-cliente>/**`, `docs/**`.
     - **Transversales / Críticos:** `packages/**`, `sites/_template/**`, `docker/**`, `package.json`, `pnpm-lock.yaml`, `turbo.json`, `biome.json`.
2. **Verificación de Aislamiento y Gobernanza:**
   - Ejecuta:
     ```bash
     pnpm verify:isolation
     ```
   - Confirma que ningún cliente importe desde otro cliente, que `packages/*` no dependa de `sites/*`, que no existan lockfiles ajenos a `pnpm` (`package-lock.json`, `yarn.lock`) ni dependencias prohibidas (`react`, `react-dom`), y que ningún secreto o credencial real se haya incluido en el diff.
3. **Verificación de Estilo, Tipos y Compilación:**
   - Ejecuta en orden:
     ```bash
     pnpm lint
     pnpm check
     pnpm build
     ```
   - Si el cambio afecta `packages/ui`, `packages/utils` o `sites/_template`, es obligatorio que `pnpm check` y `pnpm build` pasen para **todos** los sitios del monorepo sin excepción.
4. **Verificación Visual de Sitios Afectados:**
   - Para cada sitio modificado en `sites/<slug-cliente>`, ejecuta:
     ```bash
     SITE_FOLDER=<slug-cliente> pnpm test:visual
     ```
5. **Emisión del Informe de Revisión:**
   - Entrega un resumen estructurado con:
     - Archivos y paquetes afectados.
     - Impacto en código compartido (`packages/*`, `sites/_template`, `docker/`).
     - Resultado real de `verify:isolation`, `lint`, `check`, `build` y `test:visual`.
     - Bloqueantes encontrados (si existen) o aprobación lista para PR.

## 4. Herramientas

- Verificador de aislamiento: [`scripts/verify-isolation.mjs`](../../../scripts/verify-isolation.mjs) (`pnpm verify:isolation`)
- Linter y formateador: Biome (`pnpm lint`)
- Diagnósticos de tipos: Turborepo + `tsc` + `astro check` (`pnpm check`)
- Compilación: Turborepo (`pnpm build`)
- Pruebas visuales: Playwright (`pnpm test:visual`)

## 5. Límites

- No modifica ni aprueba despliegues a producción.
- No permite excepciones a la regla de aislamiento entre clientes ni a las restricciones de stack definidas en [AGENTS.md](../../../AGENTS.md).

## 6. Criterios de Finalización

- `pnpm verify:isolation`, `pnpm lint`, `pnpm check` y `pnpm build` ejecutados con código de salida `0`.
- Ningún secreto, credencial o archivo prohibido en el árbol de Git.
- Dictamen de revisión documentado con hallazgos reales verificados por comando.
