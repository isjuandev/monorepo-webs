# Monorepo Webs — Nexobite (AI-Assisted Website Factory)

Monorepo colaborativo para desarrollar, clonar con fidelidad visual, mantener y desplegar múltiples sitios web estáticos/frontend para clientes (cada uno con su propio dominio) usando **Astro 7 + Preact**, **pnpm workspaces**, **Turborepo**, **Biome** y **Playwright**.

> **Para Agentes de IA y Desarrolladores:** Antes de realizar cualquier cambio, lee [AGENTS.md](./AGENTS.md), [docs/governance.md](./docs/governance.md) y, para publicar, [docs/deploy-coolify.md](./docs/deploy-coolify.md), donde se definen las reglas obligatorias de arquitectura, aislamiento entre clientes, estilo de código, skills y gobernanza.

---

## Requisitos del Entorno

- **Node.js:** `>= 22.12.0` (recomendado `22 LTS`, definido en [`.nvmrc`](./.nvmrc))
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
├── .dockerignore                   # Exclusiones del contexto de build de Docker
├── biome.json                      # Linter y formateador estricto (Biome)
├── playwright.config.ts            # Configuración compartida de Visual QA (Desktop + Mobile)
├── .githooks/
│   └── pre-push                    # Ejecuta `pnpm verify` antes de cada push
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
│       ├── deploy-client/          # Preparación y validación de despliegue en VPS/Docker
│       ├── codebase-context/       # Contexto del repo desde el grafo de codebase-memory (ahorra tokens)
│       └── motel-copywriting/      # Tonos de marca, redacción de la web y CTA a WhatsApp/visita para moteles (50 tonos, 10 estilos)
├── .claude/
│   └── commands/                   # Comandos slash (/clone-website, /visual-qa, /review-monorepo, /seo-audit, /deploy-client, /codebase-context, /motel-copywriting)
├── docs/
│   ├── governance.md               # Protección de main y reglas para packages/, _template y docker/
│   ├── deploy-coolify.md           # Flujo local → GitHub → Coolify (una app por cliente)
│   ├── research/                   # Briefs de inspección y reportes de QA por cliente
│   └── design-references/          # Capturas de referencia y comparación visual por cliente
├── scripts/
│   ├── new-client-site.mjs         # Generador CLI para nuevos clientes (pnpm new-client-site, admite --from)
│   ├── customize-check.mjs         # Auditoría de restos de plantilla (pnpm customize:check)
│   ├── template-brands.json        # Marcas y datos de ejemplo de cada plantilla
│   ├── verify-isolation.mjs        # Verificador de aislamiento entre clientes (pnpm verify:isolation)
│   └── visual-qa-summary.mjs       # Generador de reporte Markdown de Visual QA
├── tests/
│   └── visual-qa.spec.ts           # Suite Playwright de rutas, recursos, SEO y overflow
├── sites/                          # Sitios web individuales
│   ├── _template/                  # Plantilla base genérica e intocable
│   ├── la-guaca/                   # Motel La Guaca: cliente real y plantilla por defecto de clientes nuevos
│   ├── motel-boutique/             # Motel/hotel boutique en español
│   ├── plantilla-asterre/          # Plantilla de retiro boutique (clon de asterre.framer.website)
│   ├── plantilla-hotellia/         # Plantilla de hotel boutique (clon de hotellia.framer.website)
│   └── plantilla-pinevalley/       # Plantilla de villa/casa de campo, landing de una página (clon de pinevalley.framer.website)
├── packages/                       # Paquetes compartidos entre todos los sitios
│   ├── ui/                         # Componentes Astro (SEO, Section, Footer) y Preact (Button) (@repo/ui)
│   ├── utils/                      # Helpers de dominio, robots.txt, WhatsApp y cn (@repo/utils)
│   └── tsconfig/                   # Configuraciones base de TypeScript (@repo/tsconfig)
├── docker/                         # Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)
│   ├── Dockerfile                  # Dockerfile multi-stage con turbo prune y frozen lockfile
│   └── nginx.conf                  # Nginx para sitios estáticos Astro (gzip, caché, /healthz)
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Sitios Actuales

| Carpeta | Paquete | Descripción | Idioma |
| :--- | :--- | :--- | :--- |
| `sites/_template` | `@sites/_template` | Plantilla base mínima para nuevos clientes | es |
| `sites/la-guaca` | `@sites/la-guaca` | Motel La Guaca (cliente real): inicio, 9 habitaciones con galería, experiencias, contacto y legales. **Plantilla por defecto** de clientes nuevos (`recursos/_plantilla-cliente/` es su copia literal) | es |
| `sites/motel-boutique` | `@sites/motel-boutique` | Motel/hotel boutique: home, suites, restaurante y contacto | es |
| `sites/plantilla-asterre` | `@sites/plantilla-asterre` | Retiro boutique: home, rooms, retreat, experience, contact y legales | en |
| `sites/plantilla-hotellia` | `@sites/plantilla-hotellia` | Hotel boutique: rooms, offers, wine & dine, menús, gallery, reserve y legales (smooth-scroll con `lenis`) | en |
| `sites/plantilla-pinevalley` | `@sites/plantilla-pinevalley` | Villa / casa de campo de una página: hero con profundidad, galería con visor, carrusel coverflow, reseñas, mapa, reserva y FAQ (smooth-scroll con `lenis`) | en |

---

## Pipeline automatizado: de brief o URL a PR (`pnpm client:run` / `pnpm template:clone`)

Dos comandos locales hacen todo el trabajo sin supervisión y terminan en un **PR listo para revisar**. Tú revisas y mergeas, y Coolify despliega al llegar a `main`. Los pasos deterministas (git, generador, imágenes, compuertas, PR) los hace el script; el trabajo creativo lo hace Claude Code en modo headless (`claude -p`), que no puede ejecutar git y solo puede tocar las rutas del sitio.

```bash
# Cliente nuevo desde una plantilla
pnpm recursos:new hotel-sol             # crea recursos/hotel-sol/ (brief + carpetas)
# … rellena recursos/hotel-sol/brief.md y deja fotos, marca y textos …
pnpm client:run hotel-sol --dry-run     # valida el brief y el entorno, y muestra el plan y el prompt
pnpm client:run hotel-sol               # rama → recursos → generador → activos → agente → compuertas → PR

# Nueva plantilla clonada de una web (skill clone-website, modo Plantilla)
pnpm template:clone https://ejemplo.framer.website plantilla-ejemplo
```

| Paso | `client:run` | `template:clone` |
| :-- | :-- | :-- |
| Preflight | brief válido, árbol limpio, rama libre, `claude`/`gh`, dominio no temporal (o `--allow-pending`) | URL accesible, slug `plantilla-*`, inventario de rutas (`sitemap.xml`, `robots.txt`, enlaces) |
| Determinista | rama `cliente/[motel-]<slug>`, commit de `recursos/<slug>`, `new-client-site --from`, `optimize-assets` | rama `feat/<slug>`, `new-client-site`, `docs/research/<slug>/routes.json` |
| Agente | personaliza los 4 puntos (y `motel-copywriting` si es motel) | clona todas las rutas, `CUSTOMIZE.md` y `template-brands.json` |
| Compuertas | `customize:check --strict`, `verify`, `qa:site` | `verify`, `qa:site`, prueba de personalización (`--probe`) |
| Cierre | guardia de alcance, commits, push y `gh pr create` con resumen, pendientes, QA y ficha de Coolify | igual |

Si una compuerta falla, el agente la repara en la misma sesión (`--max-repairs`, por defecto 2). El estado y el log del agente se guardan en `.pipeline/<slug>/` (ignorado por Git). Para retomar, usa `--resume [--from-step <paso>]`. Otras opciones: `--no-pr`, `--base`, `--model` y `--max-budget-usd` (`--help` en cada comando).

> Los scripts del pipeline deben estar en la rama base (`main`): el primer paso hace `git checkout <base>`.
>
> El prompt de `--dry-run` es el del orquestador (da por hechos la rama y el esqueleto): sirve para revisarlo, no para pegarlo. Para hacerlo en una sesión de Claude genera el prompt manual con `pnpm client-prompt <slug>` o `pnpm template-prompt <url> <plantilla-slug>`; se copia al portapapeles.

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
5. Ejecuta `pnpm install`, `pnpm verify:isolation`, `pnpm lint`, `astro check` y `astro build` (omitible con `--skip-checks`).

### Partir de otra plantilla (`--from`)

Por defecto se copia `sites/_template`. Para reutilizar el diseño, las páginas y el contenido de otro sitio existente usa `--from`:

```bash
pnpm new-client-site hotel-sol \
  --from plantilla-hotellia \
  --name "Hotel Sol" \
  --domain "hotelsol.co"
```

Con `--from` el script copia ese sitio, renombra el paquete a `@sites/<slug>`, ajusta `CLIENT_DOMAIN` (y `name`, `title`, `description`, `locale` si los pasas), registra la plantilla de origen en `.template-origin` y al terminar muestra un resumen de `customize:check`. **No** reescribe contacto, redes, textos, imágenes ni colores: siguen siendo los de la plantilla y se reemplazan en los 4 puntos de la siguiente sección.

Opciones adicionales: `--from`, `--title`, `--locale` (por defecto `es_CO`), `--phone` y `--address`.

---

## Personalizar un Sitio de Cliente (4 puntos)

Cada plantilla (`_template`, `la-guaca`, `plantilla-asterre`, `plantilla-hotellia`, `plantilla-pinevalley`) se personaliza editando **solo cuatro puntos**; los componentes y páginas no contienen marca, textos ni contactos:

| # | Qué cambia | Archivo | Contenido |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), nombre, SEO, `locale`, teléfono, correo, dirección, redes, enlaces de reservas/mapas, `themeColor`, fuentes precargadas, menús |
| 2 | Marca visual | `src/styles/theme.css` | colores (`--color-*`), tipografías (`--font-*`, `@font-face`), anchos y espaciados |
| 3 | Textos y datos | `src/data/content.ts` | copys por página, habitaciones/ofertas/menús/reseñas/FAQ, alt de imágenes y `UI_LABELS` (botones, ARIA, formularios, 404) |
| 4 | Activos | `public/` | logos, fotos, favicon, og-image y fuentes |

Flujo recomendado para un cliente nuevo desde una plantilla:

```bash
# 1. Crear el sitio desde la plantilla
pnpm new-client-site hotel-sol --from plantilla-hotellia --name "Hotel Sol" --domain "hotelsol.co"

# 2. Editar los 4 puntos (guía y tamaños de imagen en sites/hotel-sol/CUSTOMIZE.md)

# 3. Detectar lo que siga siendo de la plantilla (dominio de ejemplo, marcas, contactos, imágenes idénticas)
pnpm customize:check hotel-sol           # informativo
pnpm customize:check hotel-sol --strict  # falla si hay hallazgos (obligatorio antes de entregar)

# 4. Validar
pnpm verify && SITE_FOLDER=hotel-sol pnpm test:visual
```

`customize:check` usa `scripts/template-brands.json` (marcas y datos de ejemplo de cada plantilla); al agregar una plantilla nueva, regístrala allí. `motel-boutique` aún no sigue esta convención (sin `theme.css` ni `CUSTOMIZE.md`).

---

## Control de Calidad Visual y Funcional (`pnpm test:visual`)

El monorepo utiliza **Playwright** ([`playwright.config.ts`](./playwright.config.ts) y [`tests/visual-qa.spec.ts`](./tests/visual-qa.spec.ts)) para validar cada sitio en escritorio (`1440x900`) y móvil (`390x844`):

```bash
# Ejecutar pruebas visuales y funcionales en el sitio _template (por defecto)
pnpm test:visual

# Ejecutar pruebas en un cliente y rutas específicas
SITE_FOLDER=cafe-aurora QA_ROUTES="/,/menu,/contacto" pnpm test:visual

# Variables opcionales: QA_PORT (por defecto 4321) y BASE_URL (usar un servidor ya levantado)

# Guardar/actualizar capturas base de referencia (snapshots)
SITE_FOLDER=cafe-aurora pnpm test:visual:update
```

Qué verifica automáticamente:
- Respuesta HTTP `200` y ausencia de errores en `console.error`, `pageerror` o activos rotos (`HTTP >= 400`).
- Presencia de `<title>`, `<meta name="description">`, `<link rel="canonical">`, `/robots.txt` y `/sitemap-index.xml`.
- **Cero desbordamiento horizontal** (`document.documentElement.scrollWidth <= window.innerWidth`) tanto en desktop como en mobile.
- Capturas reproducibles en `docs/design-references/<cliente>/current-{desktop|mobile}-<ruta>.png`, comparación contra snapshots de referencia (si existen) y generación de informe en `docs/research/<cliente>/visual-qa-report.md`. Las capturas `current-*` y los informes son artefactos ignorados por Git.

`pnpm qa:site <slug>` compila el sitio y ejecuta la suite sobre **todas** las páginas del build (`QA_ROUTES=auto`, que lee `sites/<slug>/dist/`). En CI (`ci.yml`) se ejecuta `qa:site` sobre los sitios cambiados respecto a la base (`scripts/changed-sites.mjs`); si cambia el núcleo compartido, sobre todos, y si no cambia ningún sitio, sobre `_template`.

---

## Catálogo de Skills para Agentes de IA

| Skill | Archivo Canónico | Comando Slash | Propósito |
| :--- | :--- | :--- | :--- |
| **`clone-website`** | [`.agents/skills/clone-website/SKILL.md`](./.agents/skills/clone-website/SKILL.md) | `/clone-website <url>` | Clonar/reconstruir sitios web existentes con alta fidelidad visual en `sites/<cliente>` |
| **`visual-qa`** | [`.agents/skills/visual-qa/SKILL.md`](./.agents/skills/visual-qa/SKILL.md) | `/visual-qa <cliente>` | Ejecutar validación visual/funcional en desktop y mobile con Playwright |
| **`review-monorepo`** | [`.agents/skills/review-monorepo/SKILL.md`](./.agents/skills/review-monorepo/SKILL.md) | `/review-monorepo` | Auditar aislamiento entre clientes, impacto en paquetes compartidos, lint, tipos y build |
| **`seo-audit`** | [`.agents/skills/seo-audit/SKILL.md`](./.agents/skills/seo-audit/SKILL.md) | `/seo-audit <cliente>` | Auditar SEO técnico, canonicals, OpenGraph, jerarquía de encabezados, sitemap y `robots.txt` |
| **`deploy-client`** | [`.agents/skills/deploy-client/SKILL.md`](./.agents/skills/deploy-client/SKILL.md) | `/deploy-client <cliente>` | Validar poda con `turbo prune` y preparar ficha de despliegue para VPS (Coolify/Dokploy/Docker) |
| **`codebase-context`** | [`.agents/skills/codebase-context/SKILL.md`](./.agents/skills/codebase-context/SKILL.md) | `/codebase-context [pregunta]` | Cargar contexto del repo desde el grafo de codebase-memory (indexa solo si hace falta) y ahorrar tokens |
| **`motel-copywriting`** | [`.agents/skills/motel-copywriting/SKILL.md`](./.agents/skills/motel-copywriting/SKILL.md) | `/motel-copywriting <slug-cliente> [estilo o tono]` | Elegir tono de marca (50 tonos, 10 estilos) y redactar la web de un motel con CTA a WhatsApp y visita, sin inventar datos |

---

## Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)

Cada sitio se despliega como una aplicación estática independiente conectada al dominio del cliente. La guía completa (flujo local → GitHub → Coolify, Watch Paths, Auto Deploy y checklist por cliente) está en [`docs/deploy-coolify.md`](./docs/deploy-coolify.md).

Activa una vez por clon el hook que ejecuta `pnpm verify` antes de cada push:

```bash
git config core.hooksPath .githooks
```

### Opción A: Dockerfile reproducible (`docker/Dockerfile`, recomendada)
Usa `turbo prune` y `pnpm install --frozen-lockfile` para compilar solo el sitio indicado y servirlo con Nginx (puerto `80`, health check en `/healthz`):
- **Dockerfile Location:** `/docker/Dockerfile` (Base Directory `/`)
- **Build Argument:** `SITE_FOLDER=cliente-x`
- **Build Argument:** `SITE_URL=https://clientex.com` (debe coincidir con `CLIENT_DOMAIN`)

```bash
docker build -f docker/Dockerfile --build-arg SITE_FOLDER=cliente-x -t web-cliente-x .
docker run --rm -p 8080:80 web-cliente-x
```

### Opción B: Nixpacks / Static Buildpack
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm --filter @sites/cliente-x build`
- **Publish Directory:** `sites/cliente-x/dist`

---

## Comandos Principales (Exclusivamente `pnpm`)

| Comando | Descripción |
| :--- | :--- |
| `pnpm install` | Instala las dependencias de todos los workspaces |
| `pnpm install --frozen-lockfile` | Instalación determinista para CI y producción |
| `pnpm recursos:new <slug>` | Crea `recursos/<slug>/` (brief y carpetas) desde `recursos/_plantilla-cliente` |
| `pnpm client:run <slug>` | Pipeline sin supervisión: brief → sitio del cliente → compuertas → PR |
| `pnpm template:clone <url> <plantilla-slug>` | Pipeline sin supervisión: URL → nueva plantilla → compuertas → PR |
| `pnpm client-prompt <slug>` | Genera el prompt manual de creación (alternativa a `client:run`) |
| `pnpm template-prompt <url> <plantilla-slug>` | Descubre las rutas y genera el prompt manual de clonado para pegar en Claude (alternativa a `template:clone`) |
| `pnpm optimize-assets <slug>` | Optimiza `recursos/<slug>/` (WebP, og-image, fuentes) hacia `sites/<slug>/public/` |
| `pnpm qa:site <slug>` | Build + Playwright sobre todas las rutas del sitio |
| `pnpm new-client-site <slug>` | Crea y verifica un nuevo sitio de cliente a partir de `_template` |
| `pnpm verify` | Aislamiento + lint + check + build (lo mismo que CI y el hook `pre-push`) |
| `pnpm customize:check <slug>` | Audita restos de plantilla en un sitio de cliente (`--strict` falla si hay hallazgos) |
| `pnpm verify:isolation` | Verifica aislamiento estricto entre clientes y reglas del monorepo |
| `pnpm dev` | Inicia todos los sitios en modo desarrollo |
| `pnpm --filter @sites/<cliente> dev` | Inicia únicamente el sitio de un cliente específico |
| `pnpm build` | Compila todos los sitios para producción |
| `pnpm preview` | Sirve el build de los sitios (`astro preview`) |
| `pnpm --filter @sites/<cliente> build` | Compila únicamente el sitio de un cliente específico |
| `pnpm check` | Ejecuta validación de tipos (`tsc` + `astro check`) en todo el monorepo |
| `pnpm lint` | Valida formato, imports y reglas de código con Biome |
| `pnpm lint:fix` | Corrige automáticamente formato e imports con Biome |
| `pnpm test:visual` | Ejecuta la suite de Playwright (desktop + mobile) y genera el reporte |
| `pnpm test:visual:update` | Actualiza las capturas base de referencia de Playwright |
| `pnpm format` | Formatea todo el repositorio con Biome |
| `pnpm clean` | Limpia las carpetas `dist`, `.astro`, `.turbo`, reportes y `node_modules` |
