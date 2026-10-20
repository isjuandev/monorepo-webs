# AGENTS.md — Guía de Contexto y Reglas para LLMs y Agentes de IA

> **IMPORTANTE PARA TODOS LOS LLMs (Antigravity, Gemini, Claude, Cursor, Copilot, Codex, Windsurf):**  
> Lee y respeta este documento antes de proponer, crear o modificar código en este repositorio. Este archivo es la fuente única de verdad sobre la arquitectura, librerías aprobadas, estilo de código, linting, pruebas visuales y flujo de trabajo obligatorio del monorepo colaborativo.

---

## 1. Contexto General del Proyecto

Este repositorio (`monorepo-webs`) es la fábrica colaborativa de sitios web de **Nexobite** para desarrollar, clonar con fidelidad visual, mantener y desplegar **múltiples páginas web independientes para múltiples clientes**.

### Principios clave del negocio y arquitectura:
1. **100% Estático / Sin Backend inicialmente:** Todos los sitios se compilan como sitios estáticos (`output: "static"` en Astro) para máxima velocidad, seguridad, SEO y bajo costo de infraestructura.
2. **Un dominio propio por cliente:** Cada sitio dentro de `sites/<cliente>` tiene su propio dominio de producción (ej. `https://clientex.com`) configurado de forma independiente.
3. **Código base compartido, marcas aisladas:** Los clientes comparten utilidades (`@repo/utils`), configuraciones (`@repo/tsconfig`) y primitivos de UI (`@repo/ui`), pero la identidad visual, textos, activos y dominio de cada cliente viven estrictamente aislados en su propia carpeta dentro de `sites/`.
4. **Despliegue en VPS propio:** Cada sitio se despliega como una aplicación independiente en un VPS (Coolify / Dokploy / Docker + Nginx) apuntando a su dominio correspondiente.

---

## 2. Stack Tecnológico y Librerías Aprobadas (Stack Cerrado)

Para mantener consistencia absoluta entre todos los desarrolladores y LLMs, **NO instales librerías fuera de este stack sin autorización explícita del usuario**:

- **Entorno de ejecución:** `Node.js >= 22.12.0` (recomendado `22 LTS` en `.nvmrc`).
- **Gestor de paquetes (OBLIGATORIO):** `pnpm` (`9.15.0`) con `pnpm-workspace.yaml` y `pnpm-lock.yaml` versionado.
  - **PROHIBIDO** ejecutar `npm install`, `npx`, `yarn` o `bun`.
  - **PROHIBIDO** crear archivos `package-lock.json`, `yarn.lock` o `bun.lockb` en ninguna carpeta del monorepo.
- **Orquestador de monorepo:** `Turborepo` (`turbo.json`).
- **Framework principal:** `Astro 7` (`output: "static"`) + `@astrojs/sitemap`.
- **Framework de UI interactiva (Islas):** `Preact 11` (`@astrojs/preact`).
  - **PROHIBIDO** instalar `react` o `react-dom`. Si se necesita una librería externa para una isla interactiva, debe ser nativa de Preact o vanilla TS/JS sin dependencias pesadas.
- **Iconos:** SVGs inline/extraídos como componentes `.astro`/`.tsx`, o `lucide-preact` si se requiere un set de iconos.
- **Animaciones y Scroll:**
  - Preferir **CSS puro** (`@keyframes`, `transition`, `IntersectionObserver` + clases CSS) para animaciones de entrada y hover. Los sitios existentes concentran esta lógica en `src/scripts/` (`reveal.ts` en `motel-boutique`, `motion.ts` en `plantilla-asterre`, `plantilla-hotellia` y `plantilla-pinevalley`).
  - Si un sitio requiere smooth-scroll o animaciones avanzadas (ej. clones de Framer), usar `lenis` de forma ligera y limpiando siempre los listeners en el ciclo de vida del componente. Hoy lo usan `sites/plantilla-hotellia` y `sites/plantilla-pinevalley` (dependencia propia de cada sitio, nunca en `packages/*`).
- **Lenguaje:** `TypeScript` en modo `strict` (`@repo/tsconfig`).
- **Linter y Formateador:** `Biome` (`@biomejs/biome` configurado en `biome.json`) + `astro check` + `.editorconfig`.
- **Control de calidad visual y funcional:** `Playwright` (`@playwright/test` en `playwright.config.ts` y `tests/visual-qa.spec.ts`).
- **Servidor de producción:** `Nginx` sobre Docker multi-stage con `turbo prune` (`docker/Dockerfile` y `docker/nginx.conf`, con `/healthz`, caché inmutable en `/_astro/` y cabeceras de seguridad básicas).
- **Plataforma de despliegue:** Coolify en VPS (una aplicación por cliente), ver [`docs/deploy-coolify.md`](./docs/deploy-coolify.md).

---

## 3. Estructura del Monorepo y Responsabilidades

```text
monorepo-webs/
├── AGENTS.md                       # Este documento de contexto y reglas para LLMs
├── CLAUDE.md                       # Puntero a AGENTS.md para Claude Code
├── README.md                       # Documentación general de uso, skills y despliegue
├── .nvmrc                          # Versión de Node.js recomendada (22 LTS)
├── .editorconfig                   # Reglas de formato de archivo universales
├── .dockerignore                   # Exclusiones del contexto de build de Docker
├── biome.json                      # Configuración estricta de Linter y Formatter (Biome)
├── playwright.config.ts            # Configuración compartida de pruebas visuales/funcionales
├── .githooks/
│   └── pre-push                    # Ejecuta `pnpm verify` antes de cada push (activar con core.hooksPath)
├── .github/
│   ├── CODEOWNERS                  # Propietarios de código del núcleo compartido
│   ├── PULL_REQUEST_TEMPLATE.md    # Plantilla de PR con checklist de calidad
│   └── workflows/
│       └── ci.yml                  # Pipeline de CI (lockfile, aislamiento, lint, check, build, visual QA)
├── .agents/
│   └── skills/                     # Skills especializadas para agentes de IA
│       ├── clone-website/          # Clonar/reconstruir sitios web en sites/<cliente> (incluye references/)
│       ├── visual-qa/              # Validación visual/funcional desktop y mobile con Playwright
│       ├── review-monorepo/        # Auditoría de PR, aislamiento e impacto en paquetes
│       ├── seo-audit/              # Auditoría de SEO técnico, canonicals, OG, sitemap y robots.txt
│       ├── deploy-client/          # Preparación y validación de despliegue en VPS/Docker
│       ├── codebase-context/       # Contexto del repo desde el grafo de codebase-memory (ahorra tokens)
│       └── motel-copywriting/      # Tonos de marca, redacción de la web y CTA a WhatsApp/visita para moteles (50 tonos, 10 estilos)
├── .claude/
│   └── commands/                   # Comandos slash (/clone-website, /visual-qa, /review-monorepo, /seo-audit, /deploy-client, /codebase-context, /motel-copywriting)
├── docs/
│   ├── governance.md               # Reglas de protección de main y cambios en núcleo compartido
│   ├── deploy-coolify.md           # Flujo local → GitHub → Coolify (una app por cliente)
│   ├── research/                   # Briefs de inspección y reportes de QA por cliente
│   └── design-references/          # Capturas de referencia y comparación visual por cliente
├── scripts/
│   ├── new-client-site.mjs         # Generador automatizado de nuevos sitios de clientes (admite --from <plantilla>)
│   ├── customize-check.mjs         # Auditoría de restos de plantilla en un sitio de cliente
│   ├── template-brands.json        # Marcas y datos de ejemplo de cada plantilla (usado por customize-check)
│   ├── verify-isolation.mjs        # Verificador de aislamiento entre clientes y gobernanza
│   └── visual-qa-summary.mjs       # Generador de informe Markdown de Visual QA
├── tests/
│   └── visual-qa.spec.ts           # Suite compartida de Playwright (desktop y mobile)
├── package.json                    # Scripts globales con Turborepo, Biome y Playwright
├── pnpm-lock.yaml                  # Lockfile único y reproducible del workspace
├── pnpm-workspace.yaml             # Define los workspaces: sites/* y packages/*
├── turbo.json                      # Pipeline de tareas (dev, build, preview, check, clean)
├── docker/
│   ├── Dockerfile                  # Build multi-stage con turbo prune y pnpm --frozen-lockfile
│   └── nginx.conf                  # Nginx: gzip, caché, cabeceras de seguridad y /healthz
├── packages/
│   ├── ui/                         # (@repo/ui) src/astro: SEO, Section, Footer · src/preact: Button
│   ├── utils/                      # (@repo/utils) normalizeSiteUrl, generateRobotsTxt, buildWhatsAppUrl, cn, SiteMetadata
│   └── tsconfig/                   # (@repo/tsconfig) Configs base de TS (base, astro, preact)
└── sites/
    ├── _template/                  # Plantilla maestra genérica (intocable salvo mejoras globales)
    ├── motel-boutique/             # Motel/hotel boutique en español (home, nuestras-suites, restaurante, contacto); aún sin theme.css ni CUSTOMIZE.md
    ├── la-guaca/                   # Motel en español (cliente real) y plantilla por defecto de clientes nuevos: recursos/_plantilla-cliente/ es su copia literal
    ├── plantilla-asterre/          # Retiro boutique en inglés, clon de asterre.framer.website (rooms/[slug], retreat, experience, contact, legales)
    ├── plantilla-hotellia/         # Hotel boutique en inglés, clon de hotellia.framer.website (rooms, offers, wine-dine, menús, gallery, reserve, legales; usa lenis)
    └── plantilla-pinevalley/       # Villa/casa de campo en inglés, landing de una página clon de pinevalley.framer.website (galería con visor, carrusel coverflow, FAQ, mapa; usa lenis)
```

### Sitios existentes y convenciones observadas
- Todos los sitios exponen `src/config/site.ts`, `src/layouts/BaseLayout.astro`, `src/pages/robots.txt.ts`, `src/pages/404.astro` y `src/styles/global.css`; `_template`, `la-guaca`, `plantilla-asterre`, `plantilla-hotellia` y `plantilla-pinevalley` además separan los tokens de marca en `src/styles/theme.css` y traen un `CUSTOMIZE.md` (ver sección 6).
- Los sitios clonados (`motel-boutique`, `plantilla-*`) concentran su contenido en `src/data/content.ts`, mantienen secciones en `src/components/sections/` (o directamente en `src/components/`) y usan `src/scripts/*.ts` para animaciones de entrada.
- Páginas dinámicas (`rooms/[slug].astro`, `offers/[slug].astro`) se generan estáticamente a partir de `src/data/content.ts`.
- Las plantillas (`plantilla-*`) usan dominios de ejemplo (`*.example.com`); se reemplazan al entregar a un cliente real.
- Los reportes y capturas en `docs/research/<cliente>/` y `docs/design-references/<cliente>/` (`current-*.png`, `visual-qa-report.*`) son artefactos generados e ignorados por Git; solo se versionan las referencias fuente (`source/`, `local/`, `snapshots/`) y los briefs.

---

## 4. Estándares de Código y Estilo (Cómo deben escribir código todos los LLMs)

Todo código generado por cualquier LLM debe ser **indistinguible** del resto del repositorio. Sigue estas reglas sin excepción:

### 4.1. Formato y Sintaxis (Biome + EditorConfig)
- **Indentación:** 2 espacios (nunca tabs).
- **Comillas:** Comillas dobles (`"`) tanto en TypeScript/JavaScript como en atributos HTML/JSX.
- **Punto y coma (`;`):** Obligatorio al final de cada sentencia TS/JS.
- **Comas finales (Trailing commas):** Estilo `es5` (en objetos y arrays multilínea).
- **Longitud de línea:** Máximo 100 caracteres como guía de legibilidad.
- **Inmutabilidad:** Usa siempre `const` por defecto; usa `let` solo cuando la reasignación sea indispensable. **PROHIBIDO** usar `var`.

### 4.2. TypeScript Estricto
- **Cero `any`:** Está **PROHIBIDO** usar `any`, `@ts-ignore` o `@ts-expect-error`. Define siempre interfaces o tipos explícitos.
- **Type Imports:** Usa siempre `import type { ... }` o `{ type ... }` cuando importes únicamente tipos o interfaces (`useImportType: "error"` en Biome).
- **Sin código muerto:** No dejes variables, parámetros ni imports sin utilizar (`noUnusedVariables` y `noUnusedImports` son errores de compilación).
- **Tipado de Props:**
  - En componentes `.astro`: declara `export interface Props { ... }` en el frontmatter.
  - En componentes `.tsx` (Preact): declara `export interface NombreComponenteProps { ... }` y usa named exports (`export function NombreComponente(...)`).

### 4.3. Convenciones de Nomenclatura
- **Carpetas de clientes (`sites/<slug-cliente>`):** `kebab-case` en minúsculas (ej. `sites/clinica-dental`, `sites/cafe-aurora`).
- **Páginas de Astro (`src/pages/`):** `kebab-case` (ej. `index.astro`, `sobre-nosotros.astro`, `contacto.astro`).
- **Componentes (`.astro` y `.tsx`):** `PascalCase` descriptivo (ej. `HeroBanner.astro`, `PricingCard.astro`, `MobileMenu.tsx`).
- **Funciones, variables y helpers (`.ts`):** `camelCase` (ej. `buildWhatsAppUrl`, `normalizeSiteUrl`, `siteConfig`).
- **Interfaces y Tipos:** `PascalCase` (ej. `SiteMetadata`, `ClientSiteConfig`).
- **Constantes de configuración:** `UPPER_SNAKE_CASE` (ej. `CLIENT_DOMAIN`).
- **Variables CSS:** En `:root` (archivo `src/styles/theme.css`) con prefijos semánticos en `kebab-case`:
  - Colores: `--color-primary`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`.
  - Tipografía: `--font-sans`, `--font-display`.
  - Layout: `--max-width`, `--radius-md`.

### 4.4. Orden de Importaciones y Rutas
Respeta siempre este orden de imports en `.astro`, `.ts` y `.tsx`:
1. Paquetes del framework / externos (`astro:*`, `preact`, `preact/hooks`).
2. Paquetes compartidos del monorepo (`@repo/ui`, `@repo/ui/astro/*`, `@repo/utils`).
3. Archivos internos del sitio usando el alias `@/` (`@/layouts/...`, `@/components/...`, `@/config/site`).
4. Hojas de estilo (`@/styles/theme.css` y después `@/styles/global.css`).

> **Regla:** Dentro de `sites/<cliente>/src/`, usa siempre el alias `@/...` en lugar de rutas relativas encadenadas (`../../components/...`).

---

## 5. Reglas Arquitectónicas y de Gobernanza (Do's & Don'ts)

### 5.1. Aislamiento estricto entre clientes (verificado por `pnpm verify:isolation`)
- **PROHIBIDO** importar código, imágenes o estilos desde `sites/cliente-a` hacia `sites/cliente-b`.
- **PROHIBIDO** guardar logos, textos comerciales, teléfonos o colores específicos de un cliente dentro de `packages/ui` o `packages/utils`.
- **No uses `sites/_template` para un cliente específico:** `sites/_template` debe mantenerse limpio como plantilla base.
- **Cero secretos en Git:** Nunca almacenes tokens, claves SSH ni archivos `.env` reales en el repositorio.

### 5.2. Dónde crear cada componente (`packages/ui` vs `sites/<cliente>`)
- **En `packages/ui` (`@repo/ui`):**
  - Componentes transversales que sirven a 2 o más sitios (`SEO.astro`, `Section.astro`, `Footer.astro`, botones, modales, acordeones de FAQ, botones flotantes de WhatsApp).
  - Deben ser agnósticos a la marca: reciben contenido por `props` / `<slot />` y usan clases con prefijo `ui-` y variables CSS (`var(--color-primary)`, `var(--color-accent)`).
- **En `sites/<cliente>/src/components/`:**
  - Secciones o bloques hechos a la medida de ese cliente (`HeroRestaurante.astro`, `CatalogoServicios.astro`, `GaleriaProyecto.astro`).

### 5.3. Arquitectura de Islas: Astro primero, Preact solo cuando sea necesario
- **Usa `.astro` por defecto:** Todo layout, sección informativa, tarjeta, cabecera o pie de página que no requiera estado reactivo en el navegador debe ser un componente `.astro` (0 KB de JavaScript en el cliente).
- **Usa Preact (`.tsx`) únicamente para interactividad en el cliente:** Carruseles interactivos, calculadoras de precios, filtros en vivo, tabs complejas, menús móviles con estado o formularios dinámicos.
- **Directivas de hidratación responsables:**
  - Usa `client:load` solo para elementos interactivos visibles en el primer pantallazo (above the fold).
  - Prefiere `client:visible` o `client:idle` para componentes interactivos en el resto de la página.

### 5.4. Manejo de Dominios y SEO Técnico por Cliente
- Cada sitio tiene su configuración centralizada en `sites/<cliente>/src/config/site.ts`.
- El dominio del cliente se define en la constante `CLIENT_DOMAIN` (ej. `"micliente.com"`), y `normalizeSiteUrl(CLIENT_DOMAIN)` genera `https://micliente.com`.
- **NUNCA hardcodees el dominio** en etiquetas `<head>`, páginas o componentes. Usa siempre `siteConfig` de `@/config/site` o `Astro.site`.
- Todo sitio nuevo debe conservar:
  1. La integración `sitemap()` en `astro.config.mjs`.
  2. El endpoint `src/pages/robots.txt.ts` para que `/robots.txt` apunte automáticamente a `https://<dominio-cliente>/sitemap-index.xml`.
  3. El componente `<SEO />` de `@repo/ui/astro/SEO.astro` dentro de `BaseLayout.astro`.

---

## 6. Capa de Personalización por Cliente (obligatoria en todo sitio)

Un sitio de cliente se personaliza editando **solo 4 puntos**, sin tocar componentes ni páginas:

| # | Qué cambia | Archivo | Contenido |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | `CLIENT_DOMAIN`, nombre, SEO, `locale`, teléfono, correo, dirección, redes, enlaces de reservas/mapas, `themeColor`, `preloadFonts`, menús de navegación y footer |
| 2 | Marca visual | `src/styles/theme.css` | variables `:root` (`--color-*`, `--font-*`, medidas) y `@font-face` |
| 3 | Textos y datos | `src/data/content.ts` | copys por página (`PAGES`/secciones), listas (habitaciones, ofertas, menús, reseñas, FAQ), alt de imágenes y etiquetas de interfaz `UI_LABELS` (botones, ARIA, formularios, 404) |
| 4 | Activos | `public/` | logos, fotos, favicon, og-image y fuentes `.woff2` |

**Reglas para cualquier LLM o desarrollador:**
- **PROHIBIDO** escribir en componentes `.astro`/`.tsx` o páginas nombres de marca, nombres de personas, teléfonos, correos, dominios o textos visibles para el usuario (incluidos `aria-label`, `alt`, `placeholder` y mensajes de formulario). Léelos de `siteConfig` (`@/config/site`) o de `@/data/content`.
- Los valores de color y tipografía viven solo en `theme.css`; `global.css` y los `<style>` de componentes consumen `var(--...)`.
- Cada plantilla (`_template`, `plantilla-*`) incluye un `CUSTOMIZE.md` en su raíz con los 4 puntos, tamaños de imagen sugeridos, páginas opcionales y checklist de entrega. Un clon nuevo debe nacer con esta convención y su `CUSTOMIZE.md`.
- `pnpm customize:check <slug-cliente>` audita un sitio de cliente (dominio de ejemplo, marcas de la plantilla de origen, contactos placeholder e imágenes idénticas) usando `scripts/template-brands.json`; con `--strict` falla si hay hallazgos. Al agregar una plantilla nueva, registra sus marcas y datos de ejemplo en ese JSON. Es obligatorio en verde antes de entregar un cliente real y no aplica a las plantillas.

---

## 7. Flujo Paso a Paso para Crear un Sitio de Cliente Nuevo

**Vía automatizada (preferida cuando existe `recursos/<slug>/brief.md`):** `pnpm client:run <slug>` ejecuta todo este flujo sin supervisión y abre un PR (ver README, "Pipeline automatizado"). Para clonar una web como plantilla nueva: `pnpm template:clone <url> <plantilla-slug>`. Si te invoca ese pipeline, no ejecutes git: el orquestador crea la rama, commitea y abre el PR.

Cuando el usuario pida crear la web de un nuevo cliente a mano, utiliza el generador oficial `new-client-site` (no inventes teléfonos, correos ni direcciones que el usuario no haya proporcionado):

1. **Ejecutar el generador:**
   ```bash
   pnpm new-client-site <slug-cliente> --name "<Nombre Comercial>" --domain "<dominio.com>"
   pnpm new-client-site <slug-cliente> --from plantilla-hotellia --name "<Nombre Comercial>" --domain "<dominio.com>"
   ```
   *(El generador valida el `kebab-case`, se detiene si el sitio ya existe, copia `sites/_template` (o la plantilla indicada con `--from`) sin modificar el origen, configura `@sites/<slug-cliente>` y `src/config/site.ts`, crea las carpetas en `docs/` y ejecuta las comprobaciones iniciales. Con `--from` conserva diseño, páginas y contenido de la plantilla, solo ajusta paquete, dominio y los campos `name/title/description/locale` pasados, registra el origen en `.template-origin` y muestra un resumen de `customize:check`. Nunca copies sitios a mano).*
2. **Personalizar los 4 puntos** descritos en la sección 6, en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`. Sigue el `CUSTOMIZE.md` del sitio. No inventes datos que el usuario no haya dado: deja visibles como pendientes los que falten.
3. **Construir las páginas y secciones** que la plantilla no cubra: desarrolla las secciones en `sites/<slug-cliente>/src/components/` y ensámblalas en `src/pages/` reutilizando `BaseLayout.astro` y `@repo/ui`, respetando las reglas de la sección 6.
4. **Auditar restos de plantilla** (solo clientes reales): `pnpm customize:check <slug-cliente> --strict`.
5. **Validar calidad, aislamiento y QA visual antes de entregar:**
   - `pnpm verify` (equivale a `verify:isolation` + `lint` + `check` + `build`, igual que CI y el hook `pre-push`)
   - O por separado: `pnpm verify:isolation`, `pnpm lint`, `pnpm --filter @sites/<slug-cliente> check`, `pnpm --filter @sites/<slug-cliente> build`
   - `pnpm qa:site <slug-cliente>` (todas las rutas del build) o `SITE_FOLDER=<slug-cliente> QA_ROUTES="/,/otra-ruta" pnpm test:visual`
6. **Desplegar:** una aplicación de Coolify por cliente con `docker/Dockerfile`, `SITE_FOLDER` y `SITE_URL` (ver [`docs/deploy-coolify.md`](./docs/deploy-coolify.md)). Activa el hook una vez por clon: `git config core.hooksPath .githooks`.

---

## 8. Catálogo de Skills del Monorepo (`.agents/skills/`)

Antes de ejecutar tareas especializadas, lee la skill correspondiente:

- **`clone-website`** ([`.agents/skills/clone-website/SKILL.md`](./.agents/skills/clone-website/SKILL.md)): Clonar o reconstruir sitios web existentes (incluyendo Framer y páginas animadas) dentro de `sites/<slug-cliente>/`.
- **`visual-qa`** ([`.agents/skills/visual-qa/SKILL.md`](./.agents/skills/visual-qa/SKILL.md)): Ejecutar pruebas funcionales y visuales con Playwright en desktop (`1440x900`) y mobile (`390x844`), detectar overflow horizontal, guardar capturas y comparar contra referencias.
- **`review-monorepo`** ([`.agents/skills/review-monorepo/SKILL.md`](./.agents/skills/review-monorepo/SKILL.md)): Auditar ramas antes de un PR verificando aislamiento entre clientes, impacto en paquetes compartidos, linting, tipos y build.
- **`seo-audit`** ([`.agents/skills/seo-audit/SKILL.md`](./.agents/skills/seo-audit/SKILL.md)): Auditar SEO técnico, canonicals, OpenGraph, jerarquía de encabezados, `robots.txt` y `sitemap-index.xml`.
- **`deploy-client`** ([`.agents/skills/deploy-client/SKILL.md`](./.agents/skills/deploy-client/SKILL.md)): Validar la poda con `turbo prune` y preparar la ficha de despliegue para VPS (Coolify / Dokploy / Docker + Nginx) sin ejecutar despliegues no autorizados.
- **`codebase-context`** ([`.agents/skills/codebase-context/SKILL.md`](./.agents/skills/codebase-context/SKILL.md)): Obtener contexto del repo desde el grafo de `codebase-memory-mcp` (índice, arquitectura, símbolos y relaciones) en vez de releer archivos. **Úsala al iniciar una sesión y antes de explorar código.**
- **`motel-copywriting`** ([`.agents/skills/motel-copywriting/SKILL.md`](./.agents/skills/motel-copywriting/SKILL.md)): Elegir el tono de marca y redactar todos los textos de sitios de moteles (hero, habitaciones, tarifas, FAQ, microcopy) con CTA a reserva por WhatsApp y visita presencial, sin inventar datos. Úsala siempre que escribas o revises copy de un motel.

---

## 9. Comandos Oficiales del Monorepo (Solo `pnpm`)

Ejecuta siempre los comandos desde la raíz del monorepo (`/monorepo-webs`):

- **Instalar dependencias (respetando lockfile):**
  ```bash
  pnpm install
  pnpm install --frozen-lockfile
  ```
- **Crear un nuevo sitio de cliente:**
  ```bash
  pnpm new-client-site <slug-cliente> --name "<Nombre>" --domain "<dominio.com>"
  pnpm new-client-site <slug-cliente> --from plantilla-hotellia --name "<Nombre>" --domain "<dominio.com>"
  ```
- **Pipeline automatizado (brief/URL → PR, sin supervisión):**
  ```bash
  pnpm recursos:new <slug-cliente>                      # carpeta de recursos y brief
  pnpm client:run <slug-cliente> [--dry-run|--resume|--no-pr|--allow-pending]
  pnpm template:clone <url> <plantilla-slug> [--dry-run|--resume|--no-pr]
  pnpm optimize-assets <slug-cliente>                   # recursos → public/ (WebP)
  pnpm qa:site <slug-cliente>                           # build + QA de todas las rutas
  ```
- **Auditar restos de plantilla en un sitio de cliente:**
  ```bash
  pnpm customize:check <slug-cliente>
  pnpm customize:check <slug-cliente> --strict   # falla si hay hallazgos
  ```
- **Verificación completa (aislamiento + lint + check + build, lo mismo que CI):**
  ```bash
  pnpm verify
  ```
- **Verificar aislamiento entre clientes y gobernanza:**
  ```bash
  pnpm verify:isolation
  ```
- **Levantar servidor de desarrollo de un único cliente:**
  ```bash
  pnpm --filter @sites/<slug-cliente> dev
  ```
- **Compilar un único cliente para producción / previsualizar el build:**
  ```bash
  pnpm --filter @sites/<slug-cliente> build
  pnpm --filter @sites/<slug-cliente> preview
  ```
- **Verificar tipos y diagnósticos de Astro/TS:**
  ```bash
  pnpm check
  pnpm --filter @sites/<slug-cliente> check
  ```
- **Ejecutar linter y formato en todo el monorepo (Biome):**
  ```bash
  pnpm lint
  pnpm lint:fix
  pnpm format
  ```
- **Ejecutar pruebas funcionales y de calidad visual con Playwright:**
  ```bash
  SITE_FOLDER=<slug-cliente> pnpm test:visual
  SITE_FOLDER=<slug-cliente> QA_ROUTES="/,/rooms" pnpm test:visual   # rutas específicas
  SITE_FOLDER=<slug-cliente> pnpm test:visual:update
  ```
  Sin `SITE_FOLDER` se prueba `_template`. Variables opcionales: `QA_PORT` (por defecto `4321`) y `BASE_URL` (usa un servidor ya levantado).
- **Construir imagen Docker de producción para un cliente específico:**
  ```bash
  docker build -f docker/Dockerfile --build-arg SITE_FOLDER=<slug-cliente> -t web-<slug-cliente> .
  docker run --rm -p 8080:80 web-<slug-cliente>   # http://localhost:8080 y /healthz
  ```
- **Limpiar artefactos:** `pnpm clean`
