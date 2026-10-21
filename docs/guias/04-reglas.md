# Gobernanza, Protección de Ramas y Reglas de Colaboración

Este documento define las políticas recomendadas para operar `monorepo-webs` en equipo (desarrolladores humanos y agentes de IA) sin romper sitios de clientes existentes.

> **Nota de estado real:** Las reglas de protección de ramas en GitHub (Branch Protection / Rulesets) se configuran en la interfaz o API administrativa del repositorio en GitHub (`Settings -> Branches / Rules -> Rulesets`) y **no se activan automáticamente solo por existir archivos en Git**. Sigue la sección 1 para activarlas en GitHub.

---

## 1. Recomendaciones para Proteger la Rama `main` en GitHub

Configura un **Branch Ruleset** en GitHub para `refs/heads/main` con las siguientes opciones:

1. **Require a pull request before merging:**
   - Required approvals: `1` (mínimo).
   - Enable **Require review from Code Owners** (utiliza [`.github/CODEOWNERS`](../../.github/CODEOWNERS)).
   - Enable **Dismiss stale pull request approvals when new commits are pushed**.
2. **Require status checks to pass before merging:**
   - Enable **Require branches to be up to date before merging**.
   - Agregar como check obligatorio el job de GitHub Actions definido en [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):
     - `Lockfile, Isolation, Lint, Check, Build & Visual QA`
3. **Block force pushes & deletions:**
   - Mantener activados **Block force pushes** y **Restrict deletions** sobre `main`.

---

## 2. Reglas para Cambios en `packages/`, `plantillas/_base/` y `docker/`

Los directorios `packages/*`, `plantillas/_base/` y `docker/` constituyen el **núcleo compartido** del monorepo. Cualquier cambio en ellos impacta a múltiples clientes y debe cumplir:

1. **PR dedicado y atómico:**
   - No mezcles la construcción de un sitio de cliente (`clientes/cliente-x`) con refactorizaciones de `packages/ui`, `plantillas/_base` o `docker/` en el mismo Pull Request, salvo que sea estrictamente necesario para extraer un componente genérico nuevo.
2. **Retrocompatibilidad de Props (`@repo/ui` y `@repo/utils`):**
   - Al agregar nuevas variantes o propiedades a componentes en `packages/ui`, hazlas opcionales con valores por defecto para no romper sitios existentes.
   - Prohibido introducir colores, logos, dominios o textos de un cliente específico dentro de `packages/*` o `plantillas/_base/`.
3. **Verificación global obligatoria:**
   - Todo cambio en `packages/`, `plantillas/_base/` o `docker/` exige ejecutar `pnpm check` y `pnpm build` en la raíz (sin `--filter`) para comprobar que el 100% de los sitios compilan sin regresión.
4. **Inmutabilidad de `plantillas/_base`:**
   - `plantillas/_base` solo se edita cuando se incorpora una mejora estructural para futuros sitios. Para crear un cliente nuevo usa siempre `pnpm cliente:nuevo <slug-cliente>`.

---

## 3. Comprobaciones Automáticas de Aislamiento entre Clientes (`pnpm verify:isolation`)

El script [`scripts/verify-isolation.mjs`](../../scripts/verify-isolation.mjs) se ejecuta tanto localmente como en GitHub Actions y bloquea automáticamente cualquier commit/PR que:

1. Importe código o activos desde `clientes/<cliente-a>` hacia `clientes/<cliente-b>` (tanto por alias `@clientes/*` o `@plantillas/*` como por rutas relativas `../../`).
2. Declare dependencias `@clientes/*` o `@plantillas/*` dentro del `package.json` de otro sitio o dentro de `packages/*`.
3. Importe archivos de `plantillas/*` y `clientes/*` dentro de `packages/ui`, `packages/utils` o `packages/tsconfig`.
4. Introduzca lockfiles prohibidos (`package-lock.json`, `yarn.lock`, `bun.lockb`) o librerías prohibidas (`react`, `react-dom`).
5. Elimine archivos obligatorios de SEO y dominio por cliente (`astro.config.mjs`, `src/config/site.ts`, `src/pages/robots.txt.ts`).
6. Deje una plantilla sin `plantilla.json` (con al menos una marca de ejemplo en `marcas`) o un cliente sin `cliente.json` (con su `plantilla` de origen).
7. Repita un slug entre `plantillas/` y `clientes/` (el slug es el `SITE_FOLDER` de Coolify y debe ser único), o recree la antigua carpeta `sites/`.
