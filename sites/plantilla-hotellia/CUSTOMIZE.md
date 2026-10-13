# Personalizar este sitio (plantilla-hotellia)

Todo lo específico de un cliente vive en **4 puntos**. Los componentes y páginas no contienen marca, textos ni contactos: no hace falta editarlos para entregar un sitio.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), nombre, título/descripción SEO, `locale`, teléfono, correo, redes, `themeColor`, fuentes precargadas, menú y enlaces del footer |
| 2 | Marca visual | `src/styles/theme.css` | colores (`--color-*`), tipografías (`--font-*` y `@font-face`), `--max-width`, espaciados |
| 3 | Textos y datos | `src/data/content.ts` | copys de todas las secciones, habitaciones, ofertas, menús, reseñas, FAQ, textos legales, etiquetas de interfaz (`UI_LABELS`) y página 404 (`NOT_FOUND`) |
| 4 | Activos | `public/` | logos, fotos, firma, `og-image.png`, favicons y fuentes `.woff2` |

## Flujo recomendado

1. `pnpm new-client-site <slug> --from plantilla-hotellia --name "..." --domain "..."`
2. Edita los 4 puntos en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`.
3. `pnpm customize:check <slug>` y corrige todo lo que reporte.
4. `pnpm verify` y `SITE_FOLDER=<slug> pnpm test:visual`.

## Detalles por punto

### 1. `src/config/site.ts`
- `CLIENT_DOMAIN` debe coincidir con `SITE_URL` en Coolify.
- `name` se usa como `aria-label`, `alt` del logo, JSON-LD y `<title>`.
- `preloadFonts` debe listar las fuentes de `public/fonts` que declares en `theme.css`.

### 2. `src/styles/theme.css`
- Cambia primero `--color-primary`, `--color-bg`, `--color-text`, `--font-display` y `--font-sans`.
- Si cambias fuentes: añade los `.woff2` a `public/fonts/`, actualiza los `@font-face` y `preloadFonts`.

### 3. `src/data/content.ts`
- `HERO_TITLES.brand` dibuja el nombre en grande con un `viewBox` medido: si el nombre tiene otra longitud, ajusta `width`/`height` hasta que encaje.
- `ROOMS` y `OFFERS` generan las páginas `/rooms/<slug>` y `/offers/<slug>` automáticamente; para quitar o añadir una, borra o agrega su objeto.
- Alt de imágenes: se definen junto a cada imagen en `IMAGES` y en cada habitación/oferta.
- Los textos legales (`PRIVACY`/`TERMS`) son de ejemplo: deben revisarlos los asesores legales del cliente.

### 4. `public/`
Reemplaza el archivo conservando el nombre y la proporción para no tocar rutas.

| Archivo | Uso | Tamaño sugerido |
| :-- | :-- | :-- |
| `images/logo-white.png` / `logo-black.png` | cabecera, ticker, carta del gerente | ancho ≥ 300 px, fondo transparente |
| `images/home-hero.jpg` | hero de la home | 2600 × 1750 |
| `images/og-image.png` | imagen al compartir | 1200 × 630 |
| `images/signature.png` | firma de la carta | 1536 × 1024, fondo transparente |
| `images/bar-*.jpg`, `restaurant-*.jpg`, `exp-*.jpg`, `gallery-*.jpg` | secciones y galería | lados largos ≥ 1600 px |
| `favicon.png` / `favicon-dark.png` | icono (modo claro/oscuro) | 256 × 256 |

## Páginas opcionales
Puedes eliminar `src/pages/bar-menu.astro`, `restaurant-menu.astro`, `wine-dine.astro` u `offers/` si el cliente no las necesita; recuerda quitar sus enlaces en `MENU_LINKS`/`FOOTER_*_LINKS` de `site.ts`.

## Checklist de entrega
- [ ] `pnpm customize:check <slug> --strict` sin hallazgos
- [ ] Sin textos, imágenes ni contactos de la plantilla en el sitio publicado
- [ ] Textos legales revisados por el cliente
- [ ] `pnpm verify` y Visual QA en verde
