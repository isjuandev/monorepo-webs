---
name: visual-qa
description: Execute automated visual and functional QA with Playwright on any client website in sites/<slug-cliente> across desktop and mobile viewports, detecting console/network errors, horizontal overflow, SEO issues, and visual differences against references.
---

# Visual QA (`visual-qa`)

Run reproducible functional and visual quality assurance on a client website inside `monorepo-webs`. Follow the core rules in [AGENTS.md](../../../AGENTS.md).

## 1. Propósito

Validar que un sitio de cliente (`sites/<slug-cliente>`) renderiza correctamente en escritorio (`1440x900`) y móvil (`390x844`), sin errores de consola/red, sin desbordamiento horizontal (`scrollWidth > innerWidth`), con controles interactivos operativos, endpoints técnicos SEO (`/robots.txt` y `/sitemap-index.xml`) activos, y capturas reproducibles comparadas contra referencias cuando existan.

## 2. Entradas

- **`SITE_FOLDER`** (obligatorio, por defecto `_template`): Nombre de la carpeta del cliente en `sites/<slug-cliente>`.
- **`QA_ROUTES`** (opcional, por defecto `/`): Lista de rutas separadas por comas (ej. `/,/servicios,/contacto`).
- **`BASE_URL`** (opcional): URL de un servidor local ya activo. Si no se define, Playwright compila y levanta automáticamente `astro preview`.
- **Capturas de referencia** (opcionales): Ubicadas en `docs/design-references/<slug-cliente>/snapshots/{desktop|mobile}-<ruta>.png`.

## 3. Procedimiento

1. **Preparación:**
   - Verifica que el sitio `sites/<slug-cliente>` exista y compile sin errores de tipos (`pnpm --filter @sites/<slug-cliente> check`).
2. **Ejecución de pruebas y capturas reproducibles:**
   - Ejecuta la suite de Playwright para el cliente y sus rutas:
     ```bash
     SITE_FOLDER=<slug-cliente> QA_ROUTES="/,/contacto" pnpm test:visual
     ```
   - Si deseas establecer o actualizar las capturas base (snapshots de referencia) a partir de una versión ya validada visualmente:
     ```bash
     SITE_FOLDER=<slug-cliente> QA_ROUTES="/,/contacto" pnpm test:visual:update
     ```
3. **Inspección de resultados y artefactos:**
   - Revisa el informe generado en `docs/research/<slug-cliente>/visual-qa-report.md` (y el detalle JSON en `visual-qa-report.json`).
   - Inspecciona las capturas actuales guardadas en `docs/design-references/<slug-cliente>/current-desktop-*.png` y `current-mobile-*.png`.
4. **Corrección iterativa:**
   - Si se detecta desbordamiento horizontal, corrige los selectores reportados en el error de Playwright.
   - Si fallan activos (`HTTP >= 400`) o errores de consola, repara las rutas de archivos en `public/` o los componentes Preact/Astro.
   - Vuelve a ejecutar `SITE_FOLDER=<slug-cliente> pnpm test:visual` hasta que todas las comprobaciones pasen.

## 4. Herramientas

- Configuración compartida: [`playwright.config.ts`](../../../playwright.config.ts)
- Suite de pruebas: [`tests/visual-qa.spec.ts`](../../../tests/visual-qa.spec.ts)
- Generador de reporte Markdown: [`scripts/visual-qa-summary.mjs`](../../../scripts/visual-qa-summary.mjs)

## 5. Límites

- **Prohibido declarar "réplica perfecta" o "pixel-perfect"** si no existen capturas de referencia previas en `docs/design-references/<slug-cliente>/snapshots/` contra las cuales se haya ejecutado la comparación automática.
- Las pruebas automatizadas complementan pero no sustituyen la inspección visual de animaciones complejas vinculadas al scroll.

## 6. Criterios de Finalización

- El comando `SITE_FOLDER=<slug-cliente> pnpm test:visual` finaliza con código `0`.
- Cero errores de `console.error`, `pageerror` o recursos con estado `>= 400`.
- Cero desbordamiento horizontal en desktop (`1440x900`) y mobile (`390x844`).
- Capturas actuales almacenadas en `docs/design-references/<slug-cliente>/` e informe actualizado en `docs/research/<slug-cliente>/visual-qa-report.md`.
