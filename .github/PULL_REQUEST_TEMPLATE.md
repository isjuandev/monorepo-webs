## Resumen del Cambio

<!-- Describe brevemente qué hace este PR y a qué cliente(s) o paquete(s) afecta -->

- **Tipo de cambio:**
  - [ ] Nuevo sitio de cliente (`sites/<slug-cliente>`)
  - [ ] Clonación / actualización de sitio existente (`sites/<slug-cliente>`)
  - [ ] Cambio transversal en paquetes compartidos (`packages/*`, `sites/_template`, `docker/`)
  - [ ] Infraestructura / CI / Skills / Documentación

- **Sitio(s) afectado(s):** `sites/...`

---

## Lista de Verificación Obligatoria (Pre-Merge)

- [ ] Se respetan las reglas de arquitectura y estilo definidas en [`AGENTS.md`](../AGENTS.md).
- [ ] `pnpm verify:isolation` pasa sin errores (cero imports cruzados entre clientes y cero dependencias prohibidas).
- [ ] `pnpm lint` pasa sin errores de Biome.
- [ ] `pnpm check` (`tsc --noEmit` + `astro check`) pasa sin errores ni advertencias.
- [ ] `pnpm build` compila todos los sitios afectados (`output: "static"`, `robots.txt` y `sitemap-index.xml`).
- [ ] `SITE_FOLDER=<slug-cliente> pnpm test:visual` ejecutado (sin errores de consola, activos rotos ni overflow horizontal en desktop/mobile).
- [ ] No se incluyen credenciales, archivos `.env` reales ni secretos en el commit.

---

## Impacto en Núcleo Compartido (`packages/*`, `sites/_template/`, `docker/`)

<!-- Si este PR modifica archivos fuera de un único sites/<slug-cliente>, completa esta sección -->

- [ ] No aplica (este PR solo toca un cliente aislado).
- [ ] Este PR modifica `packages/*`, `sites/_template/` o `docker/` y se verificó que **todos** los sitios del monorepo compilan correctamente con `pnpm build`.

---

## Evidencia Visual (Desktop `1440x900` / Mobile `390x844`)

<!-- Adjunta capturas de docs/design-references/<slug-cliente>/ o resumen de docs/research/<slug-cliente>/visual-qa-report.md -->
