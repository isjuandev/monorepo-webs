# AGENTS.md — Reglas y contexto para LLMs y agentes de IA

> **Para todos los LLMs (Claude, Gemini, Cursor, Copilot, Codex, Windsurf):** lee y respeta este documento antes de proponer, crear o modificar código. Es la fuente única de verdad sobre arquitectura, stack, estilo, aislamiento y flujo de trabajo. Las guías paso a paso para personas están en [`docs/guias/`](./docs/guias/).

---

## 1. Qué es este repositorio

`monorepo-webs` es la **fábrica de sitios web de Nexobite**: fabrica N sitios de clientes a partir de un catálogo de plantillas, con la menor intervención humana posible.

```text
recursos/<slug>/entrada/  →  /nuevo-cliente <slug>  →  PR con clientes/<slug>/  →  merge  →  Coolify
(material crudo)             (intake + agente + QA)     (listo para producción)              (1 app por cliente)
```

Principios:
1. **100 % estático:** Astro con `output: "static"`; sin backend.
2. **Un dominio y una app de Coolify por cliente.**
3. **Plantillas → clientes:** un cliente nace copiando una plantilla y se personaliza en 4 puntos (§6). Las plantillas no llevan datos reales; los clientes no se usan como plantilla.
4. **Núcleo compartido mínimo y agnóstico a marcas:** `packages/*`.
5. **Automatización primero:** el pipeline `pnpm cliente:crear` hace intake, generación, personalización, QA y PR. Una persona solo deja el material, responde las preguntas y revisa el PR.

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
  - Preferir **CSS puro** (`@keyframes`, `transition`, `IntersectionObserver` + clases CSS) para animaciones de entrada y hover. Los sitios existentes concentran esta lógica en `src/scripts/` (`motion.ts` en todas las plantillas).
  - Si un sitio requiere smooth-scroll o animaciones avanzadas (ej. clones de Framer), usar `lenis` de forma ligera y limpiando siempre los listeners en el ciclo de vida del componente. Hoy lo usan `plantillas/hotellia` y `plantillas/pinevalley` (dependencia propia de cada sitio, nunca en `packages/*`).
- **Lenguaje:** `TypeScript` en modo `strict` (`@repo/tsconfig`).
- **Linter y Formateador:** `Biome` (`@biomejs/biome` configurado en `biome.json`) + `astro check` + `.editorconfig`.
- **Control de calidad visual y funcional:** `Playwright` (`@playwright/test` en `playwright.config.ts` y `tests/visual-qa.spec.ts`).
- **Servidor de producción:** `Nginx` sobre Docker multi-stage con `turbo prune` (`docker/Dockerfile` y `docker/nginx.conf`, con `/healthz`, caché inmutable en `/_astro/` y cabeceras de seguridad básicas).
- **Plataforma de despliegue:** Coolify en VPS (una aplicación por cliente), ver [`docs/guias/03-desplegar.md`](./docs/guias/03-desplegar.md).

---

## 3. Estructura del monorepo

```text
monorepo-webs/
├── README.md · AGENTS.md · CLAUDE.md
├── plantillas/                     # Catálogo de diseños (pnpm plantilla:lista)
│   ├── README.md                   # Catálogo generado (pnpm plantilla:lista --write)
│   ├── _base/                      # Esqueleto mínimo: punto de partida de plantilla:clonar
│   ├── asterre/                    # Alojamiento boutique en español (por defecto para moteles)
│   ├── hotellia/                   # Hotel boutique (lenis)
│   ├── pinevalley/                 # Villa de una página (lenis)
│   └── selvra/                     # Retiro boutique
├── clientes/                       # Un sitio por cliente real
│   ├── README.md
│   └── la-guaca/                   # Motel La Guaca (desde asterre)
├── recursos/                       # Material de cada cliente (ignorado por Git salvo el ejemplo)
│   ├── README.md
│   ├── _plantilla-cliente/         # Esqueleto vacío: brief, entrada/, fotos/, marca/, textos/
│   └── la-guaca/                   # Ejemplo relleno de un cliente real
├── packages/
│   ├── ui/                         # (@repo/ui) SEO, Section, Footer · Button (Preact)
│   ├── utils/                      # (@repo/utils) normalizeSiteUrl, generateRobotsTxt, buildWhatsAppUrl, cn
│   └── tsconfig/                   # (@repo/tsconfig) base, astro, preact
├── scripts/                        # CLI de la fábrica (comandos en §9)
│   ├── lib/                        # paths (resuelve plantillas/clientes), pipeline, brief, prompts, clone
│   ├── client-run.mjs              # pnpm cliente:crear — intake → … → PR
│   ├── recursos-intake.mjs         # pnpm cliente:intake — prepara y aplica el intake
│   ├── template-clone.mjs          # pnpm plantilla:clonar — URL → plantilla → PR
│   └── …                           # new-client-site, customize-check, qa-site, optimize-assets, templates-list, verify-isolation
├── tests/                          # Suite Playwright compartida (visual, funcional y SEO)
├── docker/                         # Dockerfile (SITE_FOLDER=<slug>) y nginx.conf
├── docs/guias/                     # 01-crear-cliente · 02-crear-plantilla · 03-desplegar · 04-reglas
├── .agents/skills/                 # Skills para agentes (§8)
└── .claude/commands/               # Comandos slash, incluido /nuevo-cliente
```

### Anatomía de un sitio (igual en plantillas y clientes)

```text
<plantillas|clientes>/<slug>/
├── plantilla.json | cliente.json   # Manifiesto (catálogo / plantilla de origen y estado)
├── CUSTOMIZE.md                    # Guía de los 4 puntos de personalización
├── astro.config.mjs · package.json # @plantillas/<slug> o @clientes/<slug>
├── docs/                           # Brief, agent-summary, guía de voz, assets-manifest
│   ├── referencias/                # Capturas de la fuente y snapshots de QA (versionadas)
│   └── qa/                         # Informes y capturas de cliente:qa (ignorada por Git)
├── public/                         # Activos (punto 4)
└── src/
    ├── config/site.ts              # Identidad, contacto y dominio (punto 1)
    ├── styles/theme.css            # Marca visual (punto 2) · global.css
    ├── data/content.ts             # Textos y datos, UI_LABELS (punto 3)
    ├── layouts/BaseLayout.astro    # <SEO /> de @repo/ui
    ├── components/ (sections/)     # Secciones del sitio
    ├── scripts/motion.ts           # Animaciones de entrada
    └── pages/                      # index, 404, robots.txt.ts y páginas (dinámicas con [slug])
```

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
- **Carpetas de sitios (`clientes/<slug>`, `plantillas/<slug>`):** `kebab-case` en minúsculas y **únicas entre ambas carpetas** (ej. `clientes/clinica-dental`, `plantillas/hotellia`). Las plantillas no llevan prefijo `plantilla-`.
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

> **Regla:** Dentro de `<sitio>/src/`, usa siempre el alias `@/...` en lugar de rutas relativas encadenadas (`../../components/...`).

---

## 5. Reglas Arquitectónicas y de Gobernanza (Do's & Don'ts)

### 5.1. Aislamiento estricto entre sitios (verificado por `pnpm verify:isolation`)
- **PROHIBIDO** importar código, imágenes o estilos entre sitios: de un cliente a otro, de una plantilla a un cliente o al revés. Un cliente **copia** su plantilla al nacer (`pnpm cliente:nuevo`) y desde ahí evoluciona solo.
- **PROHIBIDO** guardar logos, textos comerciales, teléfonos o colores específicos de un cliente dentro de `packages/ui` o `packages/utils`.
- **Las plantillas no son clientes:** nunca pongas datos reales de un cliente en `plantillas/*`, y nunca uses un cliente como plantilla de otro. Si un cliente aporta una mejora genérica, pórtala a su plantilla con datos de ejemplo.
- **Cero secretos en Git:** Nunca almacenes tokens, claves SSH ni archivos `.env` reales en el repositorio.

### 5.2. Dónde crear cada componente (`packages/ui` vs sitio)
- **En `packages/ui` (`@repo/ui`):**
  - Componentes transversales que sirven a 2 o más sitios (`SEO.astro`, `Section.astro`, `Footer.astro`, botones, modales, acordeones de FAQ, botones flotantes de WhatsApp).
  - Deben ser agnósticos a la marca: reciben contenido por `props` / `<slot />` y usan clases con prefijo `ui-` y variables CSS (`var(--color-primary)`, `var(--color-accent)`).
- **En `clientes/<slug>/src/components/` o `plantillas/<slug>/src/components/`:**
  - Secciones o bloques hechos a la medida de ese cliente (`HeroRestaurante.astro`, `CatalogoServicios.astro`, `GaleriaProyecto.astro`).

### 5.3. Arquitectura de Islas: Astro primero, Preact solo cuando sea necesario
- **Usa `.astro` por defecto:** Todo layout, sección informativa, tarjeta, cabecera o pie de página que no requiera estado reactivo en el navegador debe ser un componente `.astro` (0 KB de JavaScript en el cliente).
- **Usa Preact (`.tsx`) únicamente para interactividad en el cliente:** Carruseles interactivos, calculadoras de precios, filtros en vivo, tabs complejas, menús móviles con estado o formularios dinámicos.
- **Directivas de hidratación responsables:**
  - Usa `client:load` solo para elementos interactivos visibles en el primer pantallazo (above the fold).
  - Prefiere `client:visible` o `client:idle` para componentes interactivos en el resto de la página.

### 5.4. Manejo de Dominios y SEO Técnico por Cliente
- Cada sitio tiene su configuración centralizada en `<sitio>/src/config/site.ts`.
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
- Cada plantilla incluye un `CUSTOMIZE.md` en su raíz con los 4 puntos, tamaños de imagen sugeridos, páginas opcionales y checklist de entrega, y un `plantilla.json` (nombre, idioma, tipo de negocio, demo, `marcas` y `placeholders` de ejemplo). Una plantilla nueva nace con ambos.
- `pnpm cliente:check <slug>` audita un cliente (dominio de ejemplo, marcas y datos de ejemplo de su plantilla de origen según `cliente.json` → `plantilla.json`, e imágenes idénticas); con `--strict` falla si hay hallazgos. Es obligatorio en verde antes de entregar un cliente real y no aplica a las plantillas.

---

## 7. Flujo para crear un cliente

**Vía automatizada (siempre que se pueda):** guía completa en [`docs/guias/01-crear-cliente.md`](./docs/guias/01-crear-cliente.md).

1. `pnpm cliente:recursos <slug>`: crea `recursos/<slug>/` con el esqueleto.
2. Deja el material del cliente, tal como llegue, en `recursos/<slug>/entrada/`.
3. En Claude Code: `/nuevo-cliente <slug>`, o `pnpm cliente:crear <slug>`. El pipeline ejecuta:
   - **intake:** el agente ordena las fotos, redacta `brief.md` y `preguntas.md`.
   - **generate:** `cliente:nuevo` desde la plantilla del brief.
   - **assets:** `cliente:activos`.
   - **agent:** personalización de los 4 puntos.
   - **gates:** `cliente:check --strict`, `verify` y `cliente:qa`, con reparación automática.
   - **commit y PR,** con la ficha de Coolify.
4. Una persona revisa el PR, hace merge y crea la app de Coolify con la ficha ([`docs/guias/03-desplegar.md`](./docs/guias/03-desplegar.md)).

**Si te invoca el pipeline** (prompt headless de `cliente:crear` o `plantilla:clonar`), **no ejecutes git**: el orquestador crea la rama, commitea y abre el PR. Trabaja solo dentro de las rutas que indique el prompt; la guardia de alcance rechaza el resto.

**A mano** (solo si el usuario lo pide): `pnpm cliente:nuevo <slug> --from <plantilla> --name "<Nombre>" --domain "<dominio>"`. Después edita los 4 puntos (§6) siguiendo el `CUSTOMIZE.md`, y valida con `pnpm cliente:check <slug> --strict`, `pnpm verify` y `pnpm cliente:qa <slug>`. No inventes teléfonos, correos ni direcciones.

**Plantilla nueva:** `pnpm plantilla:clonar <url> <slug>`. Guía: [`docs/guias/02-crear-plantilla.md`](./docs/guias/02-crear-plantilla.md).

---

## 8. Skills del monorepo (`.agents/skills/`)

Antes de una tarea especializada, lee su skill (también como comando slash en `.claude/commands/`):

- **`recursos-intake`**: ordena `recursos/<slug>/entrada/` y redacta el brief y las preguntas para el cliente.
- **`motel-copywriting`**: tono de marca y textos de moteles (CTA a WhatsApp y visita, sin inventar datos).
- **`clone-website`**: clonar una web como plantilla (o cliente) con fidelidad visual.
- **`visual-qa`**: QA visual y funcional con Playwright en desktop (`1440x900`) y mobile (`390x844`).
- **`seo-audit`**: SEO técnico (canonicals, OpenGraph, encabezados, robots y sitemap).
- **`review-monorepo`**: auditoría de PR (aislamiento, impacto en el núcleo, lint, tipos y build).
- **`deploy-client`**: validación de la poda con `turbo prune` y ficha de despliegue.
- **`codebase-context`**: contexto del repo desde el grafo de `codebase-memory-mcp`. **Úsala al iniciar sesión.**

Comando de alto nivel: **`/nuevo-cliente <slug>`** ([`.claude/commands/nuevo-cliente.md`](./.claude/commands/nuevo-cliente.md)) orquesta el flujo del §7 de punta a punta.

---

## 9. Comandos (solo `pnpm`, desde la raíz)

| Comando | Qué hace |
| :-- | :-- |
| `pnpm install` | Instala dependencias (en CI: `--frozen-lockfile`) |
| `pnpm verify` | `verify:isolation` + `lint` + `check` + `build` (igual que CI y el hook `pre-push`) |
| `pnpm cliente:recursos <slug>` | Crea `recursos/<slug>/` con el esqueleto y la bandeja `entrada/` |
| `pnpm cliente:crear <slug>` | Pipeline completo hasta el PR (`--dry-run`, `--intake-only`, `--resume`, `--from-step`, `--allow-pending`, `--no-pr`) |
| `pnpm cliente:intake <slug> --prepare\|--apply\|--status` | Pasos sueltos del intake (depuración) |
| `pnpm cliente:nuevo <slug> --from <plantilla>` | Genera `clientes/<slug>/` copiando una plantilla (`--plantilla`: genera `plantillas/<slug>/`) |
| `pnpm cliente:activos <slug>` | Optimiza `recursos/<slug>/{fotos,marca}` hacia `clientes/<slug>/public/` (WebP) |
| `pnpm cliente:check <slug> [--strict]` | Audita restos de plantilla en un cliente |
| `pnpm cliente:qa <slug>` | Build y QA visual, funcional y SEO de todas las rutas (cliente o plantilla) |
| `pnpm cliente:prompt <slug>` | Prompt manual equivalente a `cliente:crear` (al portapapeles) |
| `pnpm plantilla:lista [--write]` | Catálogo de plantillas (con `--write` actualiza `plantillas/README.md`) |
| `pnpm plantilla:clonar <url> <slug>` | Clona una web como plantilla nueva hasta el PR |
| `pnpm plantilla:prompt <url> <slug>` | Prompt manual de clonado (al portapapeles) |
| `pnpm --filter @clientes/<slug> dev` | Servidor de desarrollo de un sitio (`@plantillas/<slug>` para plantillas) |
| `pnpm lint` · `pnpm lint:fix` · `pnpm check` | Biome y diagnósticos de Astro/TS |
| `docker build -f docker/Dockerfile --build-arg SITE_FOLDER=<slug> -t web-<slug> .` | Imagen de producción de un sitio |

Activa el hook una vez por clon: `git config core.hooksPath .githooks`.
