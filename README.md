# Monorepo Webs — Nexobite (AI-Assisted Website Factory)

Monorepo colaborativo para desarrollar, clonar con fidelidad visual, mantener y desplegar múltiples sitios web estáticos/frontend para clientes (cada uno con su propio dominio) usando **Astro 5 + Preact**, **pnpm workspaces**, **Turborepo**, **Biome** y **Playwright**.

> **Para Agentes de IA y Desarrolladores:** Antes de realizar cualquier cambio, lee [AGENTS.md](./AGENTS.md) y [docs/governance.md](./docs/governance.md), donde se definen las reglas obligatorias de arquitectura, aislamiento entre clientes, estilo de código, skills y gobernanza.

---

## Requisitos del Entorno

- **Node.js:** `>= 20.0.0` (recomendado `22 LTS`, definido en [`.nvmrc`](./.nvmrc))
- **Gestor de paquetes:** `pnpm@9.15.0` (habilitado mediante `corepack enable`)

---

## Arquitectura y Estructura del Monorepo

```text
monorepo-webs/
├── AGENTS.md                       # Reglas obligatorias y contexto para todos los LLMs
├── CLAUDE.md                       # Puntero a AGENTS.md para Claude Code
├── README.md                       # Documentación general del proyecto
├── .nvmrc                          # Versión de Node.js (22 LTS)
├── .editorconfig                   # Configuración universal de formato
├── biome.json                      # Linter y formateador estricto (Biome)
├── playwright.config.ts            # Configuración compartida de Visual QA (Desktop + Mobile)
├── .github/
│   ├── CODEOWNERS                  # Propietarios del núcleo compartido
│   ├── PULL_REQUEST_TEMPLATE.md    # Plantilla de revisión para Pull Requests
│   └── workflows/
│       └── ci.yml                  # CI: frozen lockfile, aislamiento, lint, check, build y Playwright
├── .agents/
│   └── skills/                     # Skills especializadas para agentes de IA
│       ├── clone-website/          # Clonación e ingeniería inversa de sitios web
│       ├── visual-qa/              # Pruebas visuales/funcionales con Playwright
│       ├── review-monorepo/        # Auditoría de PR, aislamiento e impacto en paquetes
│       ├── seo-audit/              # Auditoría de SEO técnico, canonicals, OG, sitemap y robots.txt
│       └── deploy-client/          # Preparación y validación de despliegue en VPS/Docker
├── .claude/
│   └── commands/                   # Comandos slash (/clone-website, /visual-qa, /review-monorepo, etc.)
├── docs/
│   ├── governance.md               # Protección de main y reglas para packages/, _template y docker/
│   ├── research/                   # Briefs de inspección y reportes de QA por cliente
│   └── design-references/          # Capturas de referencia y comparación visual por cliente
├── scripts/
│   ├── new-client-site.mjs         # Generador CLI para nuevos clientes (pnpm new-client-site)
│   ├── verify-isolation.mjs        # Verificador de aislamiento entre clientes (pnpm verify:isolation)
│   └── visual-qa-summary.mjs       # Generador de reporte Markdown de Visual QA
├── tests/
│   └── visual-qa.spec.ts           # Suite Playwright de rutas, recursos, SEO y overflow
├── sites/                          # Sitios web individuales de cada cliente
│   └── _template/                  # Plantilla base genérica e intocable
├── packages/                       # Paquetes compartidos entre todos los sitios
│   ├── ui/                         # Componentes compartidos Astro y Preact (@repo/ui)
│   ├── utils/                      # Helpers de dominio, SEO, WhatsApp y utilidades (@repo/utils)
│   └── tsconfig/                   # Configuraciones base de TypeScript (@repo/tsconfig)
├── docker/                         # Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)
│   ├── Dockerfile                  # Dockerfile multi-stage con turbo prune y frozen lockfile
│   └── nginx.conf                  # Configuración Nginx optimizada para sitios estáticos Astro
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Creación Automatizada de un Nuevo Cliente (`pnpm new-client-site`)

Para crear un sitio nuevo sin modificar `sites/_template`, usa el generador incluido:

```bash
pnpm new-client-site cafe-aurora \
  --name "Café Aurora" \
  --domain "cafeaurora.co" \
  --description "Café de especialidad en Bogotá." \
  --whatsapp "573001234567" \
  --email "hola@cafeaurora.co"
```

El comando realiza automáticamente:
1. Valida que el slug esté en `kebab-case` y que `sites/<slug>` no exista previamente.
2. Copia `sites/_template` a `sites/<slug>` sin tocar la plantilla.
3. Configura `"name": "@sites/<slug>"` en `package.json` y escribe `src/config/site.ts` con el dominio, SEO y datos de contacto reales suministrados (sin inventar datos faltantes).
4. Crea las carpetas de trabajo en `docs/research/<slug>` y `docs/design-references/<slug>`.
5. Ejecuta `pnpm install`, `pnpm verify:isolation`, `pnpm lint`, `astro check` y `astro build`.

---

## Control de Calidad Visual y Funcional (`pnpm test:visual`)

El monorepo utiliza **Playwright** ([`playwright.config.ts`](./playwright.config.ts) y [`tests/visual-qa.spec.ts`](./tests/visual-qa.spec.ts)) para validar cada sitio en escritorio (`1440x900`) y móvil (`390x844`):

```bash
# Ejecutar pruebas visuales y funcionales en el sitio _template (por defecto)
pnpm test:visual

# Ejecutar pruebas en un cliente y rutas específicas
SITE_FOLDER=cafe-aurora QA_ROUTES="/,/menu,/contacto" pnpm test:visual

# Guardar/actualizar capturas base de referencia (snapshots)
SITE_FOLDER=cafe-aurora pnpm test:visual:update
```

Qué verifica automáticamente:
- Respuesta HTTP `200` y ausencia de errores en `console.error`, `pageerror` o activos rotos (`HTTP >= 400`).
- Presencia de `<title>`, `<meta name="description">`, `<link rel="canonical">`, `/robots.txt` y `/sitemap-index.xml`.
- **Cero desbordamiento horizontal** (`document.documentElement.scrollWidth <= window.innerWidth`) tanto en desktop como en mobile.
- Capturas reproducibles en `docs/design-references/<cliente>/current-{desktop|mobile}-<ruta>.png`, comparación contra snapshots de referencia (si existen) y generación de informe en `docs/research/<cliente>/visual-qa-report.md`.

---

## Catálogo de Skills para Agentes de IA

| Skill | Archivo Canónico | Comando Slash | Propósito |
| :--- | :--- | :--- | :--- |
| **`clone-website`** | [`.agents/skills/clone-website/SKILL.md`](./.agents/skills/clone-website/SKILL.md) | `/clone-website <url>` | Clonar/reconstruir sitios web existentes con alta fidelidad visual en `sites/<cliente>` |
| **`visual-qa`** | [`.agents/skills/visual-qa/SKILL.md`](./.agents/skills/visual-qa/SKILL.md) | `/visual-qa <cliente>` | Ejecutar validación visual/funcional en desktop y mobile con Playwright |
| **`review-monorepo`** | [`.agents/skills/review-monorepo/SKILL.md`](./.agents/skills/review-monorepo/SKILL.md) | `/review-monorepo` | Auditar aislamiento entre clientes, impacto en paquetes compartidos, lint, tipos y build |
| **`seo-audit`** | [`.agents/skills/seo-audit/SKILL.md`](./.agents/skills/seo-audit/SKILL.md) | `/seo-audit <cliente>` | Auditar SEO técnico, canonicals, OpenGraph, jerarquía de encabezados, sitemap y `robots.txt` |
| **`deploy-client`** | [`.agents/skills/deploy-client/SKILL.md`](./.agents/skills/deploy-client/SKILL.md) | `/deploy-client <cliente>` | Validar poda con `turbo prune` y preparar ficha de despliegue para VPS (Coolify/Dokploy/Docker) |

---

## Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)

Cada sitio del monorepo se despliega como una aplicación estática independiente conectada al dominio del cliente:

### Opción A: Usando el Dockerfile reproducible (`docker/Dockerfile`)
El [`docker/Dockerfile`](./docker/Dockerfile) utiliza `turbo prune` y `pnpm install --frozen-lockfile` para aislar y compilar únicamente el sitio indicado:
- **Dockerfile Location:** `/docker/Dockerfile`
- **Build Argument:** `SITE_FOLDER=cliente-x`
- **Build Argument opcional:** `SITE_URL=https://clientex.com`
- **Dominio asignado:** `https://clientex.com`

### Opción B: Usando Nixpacks / Static Buildpack
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm --filter @sites/cliente-x build`
- **Publish Directory:** `sites/cliente-x/dist`
- **Dominio asignado:** `https://clientex.com`

---

## Comandos Principales (Exclusivamente `pnpm`)

| Comando | Descripción |
| :--- | :--- |
| `pnpm install` | Instala las dependencias de todos los workspaces |
| `pnpm install --frozen-lockfile` | Instalación determinista para CI y producción |
| `pnpm new-client-site <slug>` | Crea y verifica un nuevo sitio de cliente a partir de `_template` |
| `pnpm verify:isolation` | Verifica aislamiento estricto entre clientes y reglas del monorepo |
| `pnpm dev` | Inicia todos los sitios en modo desarrollo |
| `pnpm --filter @sites/<cliente> dev` | Inicia únicamente el sitio de un cliente específico |
| `pnpm build` | Compila todos los sitios para producción |
| `pnpm --filter @sites/<cliente> build` | Compila únicamente el sitio de un cliente específico |
| `pnpm check` | Ejecuta validación de tipos (`tsc` + `astro check`) en todo el monorepo |
| `pnpm lint` | Valida formato, imports y reglas de código con Biome |
| `pnpm lint:fix` | Corrige automáticamente formato e imports con Biome |
| `pnpm test:visual` | Ejecuta la suite de Playwright (desktop + mobile) y genera el reporte |
| `pnpm test:visual:update` | Actualiza las capturas base de referencia de Playwright |
| `pnpm clean` | Limpia las carpetas `dist`, `.astro`, `.turbo`, reportes y `node_modules` |
