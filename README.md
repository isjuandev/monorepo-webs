# Monorepo Webs — fábrica de sitios de Nexobite

Fabrica sitios web estáticos de clientes (Astro 7 + Preact, un dominio y una app de Coolify por cliente) a partir de un catálogo de plantillas. Una persona deja el material del cliente en una carpeta y lanza un prompt; Claude hace el resto hasta un PR listo para producción.

```text
recursos/<slug>/entrada/  →  /nuevo-cliente <slug>  →  PR con clientes/<slug>/  →  merge  →  Coolify
(material crudo)             (intake + agente + QA)     (listo para producción)              (1 app por cliente)
```

## Crear un cliente en 4 pasos

```bash
pnpm cliente:recursos motel-aurora      # 1. crea recursos/motel-aurora/
# 2. copia en recursos/motel-aurora/entrada/ todo lo que mandó el cliente (fotos, logo, PDF, chat…)
```

```text
/nuevo-cliente motel-aurora             # 3. en Claude Code: intake, sitio, QA y PR
```

4. Revisa el PR, haz merge y crea la app de Coolify con la ficha que trae el PR.

Guía completa: [docs/guias/01-crear-cliente.md](./docs/guias/01-crear-cliente.md).

## Mapa del repositorio

| Carpeta | Qué hay | Guía |
| :-- | :-- | :-- |
| [`plantillas/`](./plantillas/) | Catálogo de diseños con marca ficticia (`asterre` por defecto, `hotellia`, `pinevalley`, `selvra` y `_base`) | [02-crear-plantilla](./docs/guias/02-crear-plantilla.md) |
| [`clientes/`](./clientes/) | Un sitio por cliente real (`la-guaca`) | [01-crear-cliente](./docs/guias/01-crear-cliente.md) |
| [`recursos/`](./recursos/) | Material de cada cliente: bandeja `entrada/`, brief y fotos ordenadas | [recursos/README](./recursos/README.md) |
| [`packages/`](./packages/) | Núcleo compartido: `@repo/ui`, `@repo/utils`, `@repo/tsconfig` | [04-reglas](./docs/guias/04-reglas.md) |
| [`scripts/`](./scripts/) | CLI de la fábrica (comandos abajo) | [AGENTS.md §9](./AGENTS.md) |
| [`tests/`](./tests/) | QA visual, funcional y SEO con Playwright | — |
| [`docker/`](./docker/) | Imagen de producción (Nginx) por `SITE_FOLDER=<slug>` | [03-desplegar](./docs/guias/03-desplegar.md) |
| [`.agents/skills/`](./.agents/skills/) | Skills de los agentes (intake, copy de moteles, clonado, QA, SEO…) | [AGENTS.md §8](./AGENTS.md) |

Cada sitio, sea plantilla o cliente, tiene la misma forma: un manifiesto (`plantilla.json` o `cliente.json`), `CUSTOMIZE.md`, `docs/` y los **4 puntos de personalización**:

- `src/config/site.ts`: identidad, contacto y dominio.
- `src/styles/theme.css`: marca visual.
- `src/data/content.ts`: textos.
- `public/`: activos.

## Comandos

| Comando | Para qué |
| :-- | :-- |
| `pnpm cliente:recursos <slug>` | Carpeta de recursos de un cliente nuevo |
| `pnpm cliente:crear <slug>` | Pipeline completo: intake → sitio → QA → PR (`--intake-only`, `--allow-pending`, `--resume`, `--dry-run`) |
| `pnpm cliente:qa <slug>` | QA visual, funcional y SEO de todas las rutas |
| `pnpm cliente:check <slug> --strict` | Restos de plantilla en un cliente |
| `pnpm plantilla:lista` | Catálogo de plantillas |
| `pnpm plantilla:clonar <url> <slug>` | Clona una web como plantilla nueva hasta el PR |
| `pnpm --filter @clientes/<slug> dev` | Servidor de desarrollo (`@plantillas/<slug>` para plantillas) |
| `pnpm verify` | Aislamiento + lint + tipos + build (igual que CI y el hook `pre-push`) |

Lista completa en [AGENTS.md §9](./AGENTS.md).

## Requisitos

- Node.js `>= 22.12.0` (`.nvmrc`) y **solo** `pnpm 9.15.0`: nunca `npm`, `npx`, `yarn` ni `bun`.
- Claude Code (`claude`) y GitHub CLI (`gh`) con sesión iniciada, para el pipeline.
- macOS para el intake de fotos HEIC y documentos (`sips` y `textutil`).

```bash
pnpm install
git config core.hooksPath .githooks   # una vez por clon: pnpm verify antes de cada push
```

## Para agentes de IA

Lee [AGENTS.md](./AGENTS.md): stack cerrado, estándares de código, aislamiento entre sitios y capa de personalización. Claude Code carga además [CLAUDE.md](./CLAUDE.md).
