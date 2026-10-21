---
name: seo-audit
description: Audit technical and on-page SEO for a client website under clientes/<slug-cliente>, verifying domain configuration, canonical URLs, OpenGraph/Twitter tags, heading hierarchy, alt attributes, sitemap-index.xml, and robots.txt.
---

# SEO Audit (`seo-audit`) — Diseño y Procedimiento

Audita el SEO técnico y estructural de un sitio de cliente en `monorepo-webs` siguiendo las reglas comunes de [AGENTS.md](../../../AGENTS.md).

## 1. Propósito

Garantizar que cada sitio de cliente (`clientes/<slug-cliente>`) cumpla con el estándar de SEO técnico antes de pasar a producción: configuración de dominio real (`CLIENT_DOMAIN`), URLs canónicas absolutas, metadatos OpenGraph/Twitter completos, jerarquía semántica de encabezados (`<h1>` único por página), textos alternativos en imágenes, `/robots.txt` y `/sitemap-index.xml`.

## 2. Entradas

- **`slug-cliente`**: Carpeta del cliente bajo `clientes/<slug-cliente>`.
- **`CLIENT_DOMAIN`**: Dominio de producción esperado en `clientes/<slug-cliente>/src/config/site.ts`.
- **Rutas del sitio**: Páginas dentro de `clientes/<slug-cliente>/src/pages/`.

## 3. Procedimiento

1. **Verificación de configuración base (`src/config/site.ts` y `astro.config.mjs`):**
   - Confirmar que `CLIENT_DOMAIN` no sea un dominio placeholder (`clientedemo.com` o `*.example.com`) cuando se audita para lanzamiento.
   - Confirmar que `astro.config.mjs` tenga `site: process.env.SITE_URL || siteConfig.url` y la integración `sitemap()`.
2. **Compilación e inspección del HTML estático (`dist/`):**
   - Ejecutar `pnpm --filter @clientes/<slug-cliente> build`.
   - Inspeccionar cada archivo `.html` generado en `clientes/<slug-cliente>/dist/`:
     - Presencia de `<title>` único y descriptivo (30–65 caracteres recomendados).
     - Presencia de `<meta name="description">` no vacía (70–160 caracteres recomendados).
     - `<link rel="canonical" href="https://<dominio>/...">` apuntando al dominio real del cliente.
     - Etiquetas OpenGraph (`og:title`, `og:description`, `og:url`, `og:image`, `og:locale`) y Twitter Card.
     - Un único `<h1>` visible por página y secuencia lógica `<h2>` -> `<h3>`.
     - Atributo `alt` presente en todas las etiquetas `<img>`.
3. **Verificación de indexabilidad (`/robots.txt` y `/sitemap-index.xml`):**
   - Confirmar que `dist/robots.txt` contenga `Sitemap: https://<dominio>/sitemap-index.xml`.
   - Confirmar que `dist/sitemap-index.xml` y `dist/sitemap-0.xml` incluyan todas las páginas públicas con el dominio correcto.
   - Ejecutar `SITE_FOLDER=<slug-cliente> pnpm test:visual` para validar los endpoints en servidor de previsualización.

## 4. Herramientas

- Compilador estático de Astro (`pnpm --filter @clientes/<slug-cliente> build`)
- Suite Playwright (`SITE_FOLDER=<slug-cliente> pnpm test:visual`)
- Componente compartido [`packages/ui/src/astro/SEO.astro`](../../../packages/ui/src/astro/SEO.astro) y helper [`packages/utils/src/index.ts`](../../../packages/utils/src/index.ts)

## 5. Límites

- Audita SEO técnico, semántico y metadatos estáticos en el código y build local; no consulta Google Search Console ni métricas de backlinks externos.
- No inventa palabras clave ni datos de negocio que no estén en el brief del cliente.

## 6. Criterios de Finalización

- Build estático exitoso con `sitemap-index.xml` y `robots.txt` apuntando al dominio real del cliente.
- Todas las páginas públicas tienen `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<h1>` único e imágenes con `alt`.
- Reporte de hallazgos SEO entregado indicando cualquier metadato o imagen OG pendiente antes del lanzamiento.
