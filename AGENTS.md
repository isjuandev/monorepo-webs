# AGENTS.md — Guía de Contexto y Reglas para LLMs y Agentes de IA

> **IMPORTANTE PARA TODOS LOS LLMs (Antigravity, Gemini, Claude, Cursor, Copilot, Codex, Windsurf):**  
> Lee y respeta este documento antes de proponer, crear o modificar código en este repositorio. Este archivo define la arquitectura, convenciones y flujo de trabajo obligatorio del monorepo.

---

## 1. Contexto General del Proyecto

Este repositorio (`monorepo-webs`) es el monorepo oficial de **Nexobite** para crear, mantener y desplegar **múltiples páginas web para múltiples clientes**.

### Principios clave del negocio y arquitectura:
1. **100% Estático / Sin Backend inicialmente:** Todos los sitios se compilan como sitios estáticos (`output: "static"` en Astro) para máxima velocidad, seguridad, SEO y bajo costo de infraestructura.
2. **Un dominio propio por cliente:** Cada sitio dentro de `sites/<cliente>` tiene su propio dominio de producción (ej. `https://clientex.com`) configurado de forma independiente.
3. **Código base compartido, marcas aisladas:** Los clientes comparten utilidades (`@repo/utils`), configuraciones (`@repo/tsconfig`) y primitivos de UI (`@repo/ui`), pero la identidad visual, textos, activos y dominio de cada cliente viven estrictamente aislados en su propia carpeta dentro de `sites/`.
4. **Despliegue en VPS propio:** Cada sitio se despliega como una aplicación independiente en un VPS (Coolify / Dokploy / Docker + Nginx) apuntando a su dominio correspondiente.

---

## 2. Stack Tecnológico

- **Gestor de paquetes:** `pnpm` (v9+) con `pnpm-workspace.yaml`
- **Orquestador de monorepo:** `Turborepo` (`turbo.json`)
- **Framework principal:** `Astro 5` (`output: "static"`) + `@astrojs/sitemap`
- **Framework de UI interactiva (Islas):** `Preact` (`@astrojs/preact`)
- **Lenguaje:** `TypeScript` en modo `strict`
- **Estilos:** CSS moderno con Custom Properties (variables CSS por cliente)
- **Servidor de producción:** `Nginx` sobre Docker (`docker/Dockerfile` y `docker/nginx.conf`)

---

## 3. Estructura del Monorepo y Responsabilidades

```text
monorepo-webs/
├── AGENTS.md                       # Este documento de contexto para agentes e IA
├── README.md                       # Documentación general de uso y despliegue
├── package.json                    # Scripts globales con Turborepo
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
        ├── public/                 # Archivos públicos sin procesar (favicon, og-image)
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

## 4. Reglas Obligatorias de Desarrollo (Do's & Don'ts)

### 4.1. Aislamiento estricto entre clientes
- **PROHIBIDO** importar código, imágenes o estilos desde `sites/cliente-a` hacia `sites/cliente-b`.
- **PROHIBIDO** guardar logos, textos comerciales, teléfonos o colores específicos de un cliente dentro de `packages/ui` o `packages/utils`.
- **No uses `sites/_template` para un cliente específico:** `sites/_template` debe mantenerse limpio como plantilla base. Solo modifícalo cuando se quiera mejorar la base para todos los futuros clientes.

### 4.2. Dónde crear cada componente (`packages/ui` vs `sites/<cliente>`)
- **En `packages/ui` (`@repo/ui`):**
  - Componentes transversales que sirven a 2 o más sitios (ej. `SEO.astro`, `Section.astro`, `Footer.astro`, botones, modales, acordeones de FAQ, botones flotantes de WhatsApp).
  - Deben ser agnósticos a la marca: reciben contenido por `props` / `<slot />` y usan variables CSS (`var(--color-primary)`, `var(--color-accent)`).
- **En `sites/<cliente>/src/components/`:**
  - Secciones o bloques hechos a la medida de ese cliente (ej. `HeroRestaurante.astro`, `CatalogoServicios.astro`, `GaleriaProyecto.astro`).

### 4.3. Arquitectura de Islas: Astro primero, Preact solo cuando sea necesario
- **Usa `.astro` por defecto:** Todo layout, sección informativa, tarjeta, cabecera o pie de página que no requiera estado reactivo en el navegador debe ser un componente `.astro` (0 KB de JavaScript en el cliente).
- **Usa Preact (`.tsx`) únicamente para interactividad en el cliente:** Carruseles interactivos, calculadoras de precios, filtros en vivo, menús hamburguesa complejos o formularios dinámicos.
- **Directivas de hidratación responsables:**
  - Usa `client:load` solo para elementos interactivos visibles en el primer pantallazo (above the fold).
  - Prefiere `client:visible` o `client:idle` para componentes interactivos en el resto de la página.

### 4.4. Manejo de Dominios y SEO Técnico por Cliente
- Cada sitio tiene su configuración centralizada en `sites/<cliente>/src/config/site.ts`.
- El dominio del cliente se define en la constante `CLIENT_DOMAIN` (ej. `"micliente.com"`), y `normalizeSiteUrl(CLIENT_DOMAIN)` genera `https://micliente.com`.
- **NUNCA hardcodees el dominio** en etiquetas `<head>`, páginas o componentes. Usa siempre `siteConfig` de `@/config/site` o `Astro.site`.
- Todo sitio nuevo debe conservar:
  1. La integración `sitemap()` en `astro.config.mjs`.
  2. El endpoint `src/pages/robots.txt.ts` para que `/robots.txt` apunte automáticamente a `https://<dominio-cliente>/sitemap-index.xml`.
  3. El componente `<SEO />` de `@repo/ui/astro/SEO.astro` dentro de `BaseLayout.astro`.

### 4.5. Sitios sin Backend (Contacto y Conversión)
- Mantén `output: "static"` en `astro.config.mjs`. No agregues adaptadores SSR (Node/Vercel/Cloudflare SSR) a menos que el usuario lo pida explícitamente para un cliente puntual.
- Para llamadas a la acción (CTAs) de contacto, utiliza el helper `buildWhatsAppUrl(siteConfig.contact.whatsapp, mensaje)` de `@repo/utils`, enlaces `tel:`, `mailto:` o servicios externos de formularios estáticos.

---

## 5. Flujo Paso a Paso para Crear un Sitio de Cliente Nuevo

Cuando el usuario pida crear la web de un nuevo cliente (ej. *"Crea el sitio para el cliente Café Aurora con dominio cafeaurora.co"*), sigue exactamente estos pasos:

1. **Clonar la plantilla:**
   Copia `sites/_template` a `sites/<slug-cliente>` (usando kebab-case, ej. `sites/cafe-aurora`).
2. **Configurar `package.json` del sitio:**
   Cambia `"name"` en `sites/<slug-cliente>/package.json` a `"@sites/<slug-cliente>"`.
3. **Configurar `src/config/site.ts`:**
   Actualiza `CLIENT_DOMAIN`, `name`, `title`, `description`, `locale`, `contact` y `socials`.
4. **Personalizar estilos de marca (`src/styles/global.css`):**
   Ajusta las variables CSS en `:root` (`--color-primary`, `--color-accent`, `--color-bg`, `--color-text`, fuentes) según la identidad visual del cliente.
5. **Construir las páginas y secciones:**
   Desarrolla las secciones en `sites/<slug-cliente>/src/components/` y ensámblalas en `sites/<slug-cliente>/src/pages/index.astro` (y páginas adicionales si aplica) reutilizando `BaseLayout.astro` y `@repo/ui`.
6. **Validar el sitio:**
   Ejecuta `pnpm --filter @sites/<slug-cliente> check` y `pnpm --filter @sites/<slug-cliente> build` para verificar que el HTML estático, `robots.txt` y `sitemap-index.xml` se generen sin errores.

---

## 6. Comandos de Trabajo en el Monorepo

Ejecuta siempre los comandos desde la raíz del monorepo (`/monorepo-webs`):

- **Instalar dependencias en todo el workspace:**
  ```bash
  pnpm install
  ```
- **Levantar servidor de desarrollo de un único cliente (recomendado al trabajar en un cliente):**
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
- **Compilar todos los sitios del monorepo (CI / verificación global):**
  ```bash
  pnpm build
  ```
- **Agregar una dependencia solo a un sitio específico:**
  ```bash
  pnpm --filter @sites/<slug-cliente> add <paquete>
  ```
- **Agregar una dependencia al paquete compartido de UI:**
  ```bash
  pnpm --filter @repo/ui add <paquete>
  ```
- **Construir imagen Docker de producción para un cliente específico:**
  ```bash
  docker build -f docker/Dockerfile --build-arg SITE_FOLDER=<slug-cliente> -t web-<slug-cliente> .
  ```
