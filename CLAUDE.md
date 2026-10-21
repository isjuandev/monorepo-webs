@AGENTS.md

Lee y sigue todas las instrucciones definidas en [AGENTS.md](./AGENTS.md).

## Resumen rápido para Claude Code

- Solo `pnpm` (nunca `npm`, `npx`, `yarn` ni `bun`); sin `react`/`react-dom`, solo Preact.
- Sitios en dos carpetas: `plantillas/` (`_base`, `asterre` (por defecto), `hotellia`, `pinevalley`, `selvra`, cada una con `plantilla.json`) y `clientes/` (`la-guaca`, cada uno con `cliente.json`). Los slugs son únicos entre ambas. Nunca importes código entre sitios ni uses un cliente como plantilla.
- **Cliente nuevo:** `pnpm cliente:recursos <slug>`, dejar el material en `recursos/<slug>/entrada/` y `/nuevo-cliente <slug>`. El pipeline `pnpm cliente:crear <slug>` hace intake → PR. Plantilla nueva: `pnpm plantilla:clonar <url> <slug>`. Si te invoca ese pipeline, no ejecutes git.
- Antes de entregar cambios ejecuta `pnpm verify` (aislamiento + lint + check + build). Para QA visual y SEO: `pnpm cliente:qa <slug>` (todas las rutas, sirve también para plantillas).
- Skills en `.agents/skills/` y comandos slash en `.claude/commands/`: `/nuevo-cliente`, `/clone-website`, `/visual-qa`, `/review-monorepo`, `/seo-audit`, `/deploy-client`, `/codebase-context`, `/motel-copywriting`. La skill `recursos-intake` la usa el pipeline.
- **Al iniciar sesión y antes de explorar código, aplica la skill `codebase-context`**: consulta el grafo de codebase-memory (`index_status`, `get_architecture`, `search_graph`, `trace_path`, `get_code_snippet`) en vez de releer archivos. Lee archivos completos solo si es imprescindible (los `.astro` y los estilos se buscan con `search_code`/`grep`).
- Cada sitio se personaliza en 4 puntos: `src/config/site.ts`, `src/styles/theme.css`, `src/data/content.ts` (con `UI_LABELS`) y `public/`. No hardcodees marca, textos ni contactos en componentes (AGENTS.md §6). Valida un cliente con `pnpm cliente:check <slug> --strict`.
- La documentación de cada sitio vive en `<sitio>/docs/`: la de referencia en `docs/referencias/` y la QA en `docs/qa/`, que está ignorada.
- Guías para personas: [docs/guias/](./docs/guias/) (01 crear cliente, 02 crear plantilla, 03 desplegar en Coolify, 04 reglas).
