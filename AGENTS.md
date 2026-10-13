# AGENTS.md — Guía de Contexto y Reglas para LLMs y Agentes de IA

> **IMPORTANTE PARA TODOS LOS LLMs (Antigravity, Gemini, Claude, Cursor, Copilot, Codex, Windsurf):**  
> Lee y respeta este documento antes de proponer, crear o modificar código en este repositorio. Este archivo es la fuente única de verdad sobre la arquitectura, librerías aprobadas, estilo de código, linting y flujo de trabajo obligatorio del monorepo colaborativo.

---

## 1. Contexto General del Proyecto

Este repositorio (`monorepo-webs`) es el monorepo oficial y colaborativo de **Nexobite** para crear, mantener y desplegar **múltiples páginas web para múltiples clientes**.

### Principios clave del negocio y arquitectura:
1. **100% Estático / Sin Backend inicialmente:** Todos los sitios se compilan como sitios estáticos (`output: "static"` en Astro) para máxima velocidad, seguridad, SEO y bajo costo de infraestructura.
2. **Un dominio propio por cliente:** Cada sitio dentro de `sites/<cliente>` tiene su propio dominio de producción (ej. `https://clientex.com`) configurado de forma independiente.
3. **Código base compartido, marcas aisladas:** Los clientes comparten utilidades (`@repo/utils`), configuraciones (`@repo/tsconfig`) y primitivos de UI (`@repo/ui`), pero la identidad visual, textos, activos y dominio de cada cliente viven estrictamente aislados en su propia carpeta dentro de `sites/`.
4. **Despliegue en VPS propio:** Cada sitio se despliega como una aplicación independiente en un VPS (Coolify / Dokploy / Docker + Nginx) apuntando a su dominio correspondiente.

---

## 2. Stack Tecnológico y Librerías Aprobadas (Stack Cerrado)

Para mantener consistencia absoluta entre todos los desarrolladores y LLMs, **NO instales librerías fuera de este stack sin autorización explícita del usuario**:

- **Gestor de paquetes (OBLIGATORIO):** `pnpm` (`>=9.0.0`) con `pnpm-workspace.yaml`.
  - **PROHIBIDO** ejecutar `npm install`, `npx`, `yarn` o `bun`.
  - **PROHIBIDO** crear archivos `package-lock.json` o `yarn.lock` en ninguna carpeta del monorepo.
- **Orquestador de monorepo:** `Turborepo` (`turbo.json`).
- **Framework principal:** `Astro 5` (`output: "static"`) + `@astrojs/sitemap`.
- **Framework de UI interactiva (Islas):** `Preact 10` (`@astrojs/preact`).
  - **PROHIBIDO** instalar `react` o `react-dom`. Si se necesita una librería externa para una isla interactiva, debe ser nativa de Preact o vanilla TS/JS sin dependencias pesadas.
- **Iconos:** SVGs inline/extraídos como componentes `.astro`/`.tsx`, o `lucide-preact` si se requiere un set de iconos.
- **Animaciones y Scroll:**
  - Preferir **CSS puro** (`@keyframes`, `transition`, `IntersectionObserver` + clases CSS) para animaciones de entrada y hover.
  - Si un sitio requiere smooth-scroll o animaciones avanzadas (ej. clones de Framer), usar `lenis` de forma ligera y limpiando siempre los listeners en el ciclo de vida del componente.
- **Lenguaje:** `TypeScript` en modo `strict` (`@repo/tsconfig`).
- **Linter y Formateador:** `Biome` (`@biomejs/biome` configurado en `biome.json`) + `astro check` + `.editorconfig`.
- **Servidor de producción:** `Nginx` sobre Docker (`docker/Dockerfile` y `docker/nginx.conf`).

---

## 3. Estructura del Monorepo y Responsabilidades

```text
monorepo-webs/
├── AGENTS.md                       # Este documento de contexto y reglas para LLMs
├── CLAUDE.md                       # Puntero a AGENTS.md para Claude Code
├── README.md                       # Documentación general de uso, skills y despliegue
├── .editorconfig                   # Reglas de formato de archivo universales
├── biome.json                      # Configuración estricta de Linter y Formatter (Biome)
├── .agents/
│   └── skills/
│       └── clone-website/          # Skill canónica para clonar/reconstruir sitios web en sites/<cliente>
│           ├── SKILL.md
│           └── references/
│               ├── inspection-guide.md
│               └── framer-and-motion.md
├── .claude/
│   └── commands/
│       └── clone-website.md        # Comando /clone-website para Claude Code
├── docs/
│   ├── research/                   # Briefs de inspección y mapeo de activos por cliente
│   └── design-references/          # Capturas de referencia y comparación visual por cliente
├── package.json                    # Scripts globales con Turborepo y Biome
├── pnpm-workspace.yaml             # Define los workspaces: sites/* y packages/*
├── turbo.json                      # Pipeline de tareas (dev, build, preview, check, lint)
├── docker/
│   ├── Dockerfile                  # Build multi-stage parametrizado con ARG SITE_FOLDER
│   └── nginx.conf                  # Configuración Nginx con caché y compresión Gzip
├── packages/
│   ├── ui/                         # (@repo/ui) Componentes Astro y Preact compartidos
│   │   └── src/
│   │       ├── astro/              # Componentes estáticos .astro (SEO, Section, Footer)
│   │       └── preact/             # Islas interactivas .tsx (Button, etc.)
│   ├── utils/                      # (@repo/utils) Helpers puros (dominios, robots.txt, WhatsApp, cn)
│   └── tsconfig/                   # (@repo/tsconfig) Configs base de TS (base, astro, preact)
└── sites/
    ├── _template/                  # Plantilla maestra para clonar al crear nuevos clientes
    └── <slug-cliente>/             # Carpeta individual por cada cliente real
        ├── astro.config.mjs        # Configura Astro site URL, Preact y Sitemap
        ├── package.json            # Nombre del paquete: @sites/<slug-cliente>
        ├── public/                 # Archivos públicos sin procesar (favicon, fuentes, imágenes)
        └── src/
            ├── assets/             # Imágenes optimizadas por Astro
            ├── components/         # Componentes exclusivos de este cliente
            ├── config/
            │   └── site.ts         # Fuente única de verdad del cliente (dominio, SEO, contacto)
            ├── layouts/
            │   └── BaseLayout.astro
            ├── pages/
            │   ├── index.astro
            │   └── robots.txt.ts   # Endpoint estático que genera /robots.txt con su dominio
            └── styles/
                └── global.css      # Variables de color, tipografía y estilos del cliente
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
- **Type Imports:** Usa siempre `import type { ... }` cuando importes únicamente tipos o interfaces (`useImportType: "error"` en Biome).
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
- **Variables CSS:** En `:root` con prefijos semánticos en `kebab-case`:
  - Colores: `--color-primary`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`.
  - Tipografía: `--font-sans`, `--font-display`.
  - Layout: `--max-width`, `--radius-md`.

### 4.4. Orden de Importaciones y Rutas
Respeta siempre este orden de imports en `.astro`, `.ts` y `.tsx`:
1. Paquetes del framework / externos (`astro:*`, `preact`, `preact/hooks`).
2. Paquetes compartidos del monorepo (`@repo/ui`, `@repo/ui/astro/*`, `@repo/utils`).
3. Archivos internos del sitio usando el alias `@/` (`@/layouts/...`, `@/components/...`, `@/config/site`).
4. Hojas de estilo (`@/styles/global.css`).

> **Regla:** Dentro de `sites/<cliente>/src/`, usa siempre el alias `@/...` en lugar de rutas relativas encadenadas (`../../components/...`).

---

## 5. Reglas Arquitectónicas (Do's & Don'ts)

### 5.1. Aislamiento estricto entre clientes
- **PROHIBIDO** importar código, imágenes o estilos desde `sites/cliente-a` hacia `sites/cliente-b`.
- **PROHIBIDO** guardar logos, textos comerciales, teléfonos o colores específicos de un cliente dentro de `packages/ui` o `packages/utils`.
- **No uses `sites/_template` para un cliente específico:** `sites/_template` debe mantenerse limpio como plantilla base. Solo modifícalo cuando se quiera mejorar la base para todos los futuros clientes.

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

## 6. Flujo Paso a Paso para Crear un Sitio de Cliente Nuevo

Cuando el usuario pida crear la web de un nuevo cliente (ej. *"Crea el sitio para el cliente Café Aurora con dominio cafeaurora.co"*), sigue exactamente estos pasos:

1. **Clonar la plantilla:**
   Copia `sites/_template` a `sites/<slug-cliente>` (usando `kebab-case`, ej. `sites/cafe-aurora`).
2. **Configurar `package.json` del sitio:**
   Cambia `"name"` en `sites/<slug-cliente>/package.json` a `"@sites/<slug-cliente>"`.
3. **Configurar `src/config/site.ts`:**
   Actualiza `CLIENT_DOMAIN`, `name`, `title`, `description`, `locale`, `contact` y `socials`.
4. **Personalizar estilos de marca (`src/styles/global.css`):**
   Ajusta las variables CSS en `:root` (`--color-primary`, `--color-accent`, `--color-bg`, `--color-text`, fuentes) según la identidad visual del cliente.
5. **Construir las páginas y secciones:**
   Desarrolla las secciones en `sites/<slug-cliente>/src/components/` y ensámblalas en `sites/<slug-cliente>/src/pages/index.astro` reutilizando `BaseLayout.astro` y `@repo/ui`.
6. **Validar calidad, linting y compilación antes de entregar:**
   Ejecuta obligatoriamente:
   - `pnpm lint` (verifica estilo y reglas de Biome)
   - `pnpm --filter @sites/<slug-cliente> check` (verifica tipos de Astro y TypeScript)
   - `pnpm --filter @sites/<slug-cliente> build` (verifica generación de HTML estático, `robots.txt` y `sitemap-index.xml`)

---

## 7. Skill de Clonación de Sitios Web (`clone-website`)

El monorepo cuenta con la skill canónica `.agents/skills/clone-website/SKILL.md` (y el comando `.claude/commands/clone-website.md` para `/clone-website <url>`):
- Cuando el usuario pida clonar, replicar o hacer ingeniería inversa de una web existente para un cliente, **lee primero `.agents/skills/clone-website/SKILL.md`** junto con sus guías en `.agents/skills/clone-website/references/`.
- Sigue el flujo de 4 fases (*1. Map*, *2. Observe*, *3. Build*, *4. Compare & Deliver*) construyendo el sitio dentro de `sites/<slug-cliente>/` y guardando las notas de inspección en `docs/research/<slug-cliente>/` y las capturas en `docs/design-references/<slug-cliente>/`.

---

## 8. Comandos Oficiales del Monorepo (Solo `pnpm`)

Ejecuta siempre los comandos desde la raíz del monorepo (`/monorepo-webs`):

- **Instalar dependencias en todo el workspace:**
  ```bash
  pnpm install
  ```
- **Levantar servidor de desarrollo de un único cliente:**
  ```bash
  pnpm --filter @sites/<slug-cliente> dev
  ```
- **Compilar un único cliente para producción:**
  ```bash
  pnpm --filter @sites/<slug-cliente> build
  ```
- **Verificar tipos y diagnósticos de Astro en un cliente:**
  ```bash
  pnpm --filter @sites/<slug-cliente> check
  ```
- **Ejecutar linter y formato en todo el monorepo (Biome):**
  ```bash
  pnpm lint
  pnpm lint:fix
  pnpm format
  ```
- **Compilar todos los sitios del monorepo (CI / verificación global):**
  ```bash
  pnpm build
  ```
- **Agregar una dependencia aprobada solo a un sitio específico:**
  ```bash
  pnpm --filter @sites/<slug-cliente> add <paquete>
  ```
- **Agregar una dependencia aprobada al paquete compartido de UI:**
  ```bash
  pnpm --filter @repo/ui add <paquete>
  ```
- **Construir imagen Docker de producción para un cliente específico:**
  ```bash
  docker build -f docker/Dockerfile --build-arg SITE_FOLDER=<slug-cliente> -t web-<slug-cliente> .
  ```
