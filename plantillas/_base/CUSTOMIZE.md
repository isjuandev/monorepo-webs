# Personalizar este sitio (_base)

Los sitios nacen de `pnpm cliente:nuevo` con estos puntos de personalización:

| # | Qué cambia | Archivo |
| :-- | :-- | :-- |
| 1 | Identidad y contacto (dominio, nombre, SEO, contacto, redes) | `src/config/site.ts` |
| 2 | Marca visual (colores, fuentes, anchos) | `src/styles/theme.css` |
| 3 | Textos y secciones | `src/pages/index.astro` y componentes en `src/components/` (a medida que el sitio crezca, mueve los textos a `src/data/content.ts`) |
| 4 | Activos (logo, imágenes, favicon) | `public/` |

Regla: no escribas nombres de marca, teléfonos, correos ni dominios en componentes; léelos de `siteConfig`.
Antes de entregar: `pnpm cliente:check <slug> --strict`, `pnpm verify` y `pnpm cliente:qa <slug>`.
