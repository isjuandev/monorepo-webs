@AGENTS.md

Lee y sigue todas las instrucciones definidas en [AGENTS.md](./AGENTS.md).

## Resumen rápido para Claude Code

- Solo `pnpm` (nunca `npm`, `npx`, `yarn` ni `bun`); sin `react`/`react-dom`, solo Preact.
- Sitios actuales en `sites/`: `_template`, `la-guaca`, `motel-boutique`, `plantilla-asterre`, `plantilla-hotellia`, `plantilla-pinevalley` y `plantilla-selvra`. Nunca importes código entre sitios. `la-guaca` es la plantilla por defecto de clientes nuevos: `recursos/_plantilla-cliente/` es su copia literal y su sitio es la `Plantilla base` del brief.
- Pipeline sin supervisión: `pnpm client:run <slug>` (brief en `recursos/<slug>/` → PR) y `pnpm template:clone <url> <plantilla-slug>` (URL → plantilla → PR). Si te invoca ese pipeline, no ejecutes git.
- Antes de entregar cambios ejecuta `pnpm verify` (aislamiento + lint + check + build); para QA visual: `pnpm qa:site <slug>` (todas las rutas).
- Skills en `.agents/skills/` y comandos slash en `.claude/commands/`: `/clone-website`, `/visual-qa`, `/review-monorepo`, `/seo-audit`, `/deploy-client`, `/codebase-context`, `/motel-copywriting` (copy y tono para moteles).
- **Al iniciar sesión y antes de explorar código, aplica la skill `codebase-context`**: consulta el grafo de codebase-memory (`index_status`, `get_architecture`, `search_graph`, `trace_path`, `get_code_snippet`) en vez de releer archivos; lee archivos completos solo si es imprescindible (los `.astro` y estilos se buscan con `search_code`/`grep`).
- Cada sitio se personaliza en 4 puntos: `src/config/site.ts` (identidad/contacto), `src/styles/theme.css` (marca visual), `src/data/content.ts` (textos y `UI_LABELS`) y `public/` (activos). No hardcodees marca, textos ni contactos en componentes (AGENTS.md §6). Para clientes nuevos usa `pnpm new-client-site <slug> --from <plantilla>` y valida con `pnpm customize:check <slug> --strict`.
- Despliegue en Coolify: [docs/deploy-coolify.md](./docs/deploy-coolify.md). Gobernanza: [docs/governance.md](./docs/governance.md).
