---
name: codebase-context
description: Obtener contexto del monorepo desde el grafo de codebase-memory (arquitectura, símbolos, relaciones) en lugar de releer archivos, indexando o refrescando el índice solo cuando hace falta. Úsala al empezar una sesión o antes de explorar código en monorepo-webs.
---

# Contexto del Proyecto con codebase-memory (`codebase-context`)

Reglas comunes en [AGENTS.md](../../../AGENTS.md). El objetivo es **entender el repo consultando el grafo** (`codebase-memory-mcp`) y leer archivos completos solo cuando sea imprescindible, para ahorrar tokens.

## 1. Preparar el índice (siempre primero, una vez por sesión)

1. Proyecto: obtén el nombre con `list_projects` (la ruta de la raíz del repo con `/` → `-`). Por ejemplo, la raíz `/Users/isjuandev/Documents/WS-PERSONAL/monorepo-webs` se indexa como `Users-isjuandev-Documents-WS-PERSONAL-monorepo-webs`. Si trabajas desde otro clon o worktree, comprueba el nombre con `list_projects` antes de consultar.
2. `index_status(project)`:
   - Si responde `ready` con nodos > 0, **no reindexes**: el índice se refresca solo.
   - Si no existe, está vacío o cambiaste de rama o hiciste ediciones masivas sin que se reflejen → `index_repository(repo_path=<raíz del repo>, mode="full")`.
3. Opcional: `detect_changes` para ver qué cambió desde el último índice antes de decidir si reindexar.
4. No uses `persistence: true` salvo que el usuario lo pida (escribe `.codebase-memory/graph.db.zst` dentro del repo).

## 2. Obtener el panorama general (barato)

- `get_architecture(project, aspects=["overview"])`: conteos, paquetes, puntos de entrada, hotspots, límites entre paquetes y clusters.
- Para un sitio concreto: `get_architecture(project, aspects=["structure"], path="clientes/<slug>")`.
- Complementa con `AGENTS.md` (reglas y comandos) y, si existe, el ADR (`manage_adr`) en vez de reexplorar.

## 3. Elegir la herramienta según la pregunta

| Necesitas | Herramienta |
| :-- | :-- |
| Dónde está un símbolo o componente | `search_graph` (nombre/patrón) |
| Quién usa / a quién llama algo | `trace_path` |
| Leer solo una función o interfaz | `get_code_snippet` |
| Estructura de un archivo sin abrirlo | `get_file_outline` |
| Relaciones de varios saltos | `query_graph` |
| Literales, textos, rutas, CSS, `.astro` | `search_code` o `grep` |
| Verificar que un archivo está en el índice | `check_index_coverage` |

## 4. Límites conocidos (verifica antes de afirmar)

- Los componentes `.astro`, los `.md`, el CSS fino y `docker/nginx.conf` no se modelan como código: el grafo cubre sobre todo TypeScript (`.ts`/`.tsx`) y la estructura de archivos. Para `.astro` y estilos usa `search_code`/`grep` y lectura puntual.
- Se excluyen `node_modules`, `dist`, `.astro`, `.turbo`, imágenes y fuentes: nunca esperes hallazgos ahí.
- Carpetas residuales ignoradas por Git (p. ej. un `clientes/<x>` sin código, solo con `dist`) pueden aparecer como ruido.
- El índice es "mejor esfuerzo": si una ruta citada importa, compruébala con `check_index_coverage` o léela.

## 5. Mapa mínimo del repo (para orientarte sin consultar)

- `packages/ui`, `packages/utils`, `packages/tsconfig`: núcleo compartido (agnóstico a marcas).
- `plantillas/` (`_base`, `asterre` (por defecto), `hotellia`, `pinevalley`, `selvra`, cada una con `plantilla.json`) y `clientes/` (`la-guaca`, cada uno con `cliente.json`): sitios; cada uno se personaliza en 4 puntos (`src/config/site.ts`, `src/styles/theme.css`, `src/data/content.ts`, `public/`), ver AGENTS.md §6. Su documentación, referencias y QA viven en `<sitio>/docs/`.
- `scripts/`: pipeline `client-run` (`pnpm cliente:crear`, con paso intake de `recursos-intake`) y `template-clone` (`pnpm plantilla:clonar`), sobre `lib/` (`paths.mjs` resuelve plantillas y clientes, `pipeline.mjs`, `brief.mjs`, `prompts.mjs`, `clone.mjs`); más `new-client-site`, `customize-check`, `qa-site`, `optimize-assets`, `templates-list`, `changed-sites`, `verify-isolation` y `visual-qa-summary`.
- `recursos/`: material de cada cliente (bandeja `entrada/`, brief y fotos ordenadas); `_plantilla-cliente/` es el esqueleto vacío y `la-guaca/` el ejemplo relleno.

## 6. Mantener el contexto al día

- Tras mergear o cambiar de rama con muchos cambios: `index_repository` (modo `full`) y comprueba con `index_status`.
- Si descubres decisiones de arquitectura relevantes que no estén en AGENTS.md, propónselas al usuario; solo guarda un ADR (`manage_adr`) si lo aprueba.
- No pegues salidas largas del grafo en las respuestas: resume y cita rutas (`archivo:línea`).
