# Personalizar este sitio (plantilla-pinevalley)

Landing de una sola página para casas de campo, villas o alojamientos completos (clon de `pinevalley.framer.website`). Todo lo específico de un cliente vive en **4 puntos**: los componentes y páginas no contienen marca, textos ni contactos, así que no hace falta editarlos para entregar un sitio.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), `name`, `logoText`, título/descripción SEO, `locale`, teléfono, correo, dirección, zona (`area`), consulta del mapa (`mapQuery`/`mapsUrl`), enlace externo de reservas (`bookingUrl`), redes (`socials`), `themeColor`, `preloadFonts`, menú (`MENU_LINKS`) y enlaces del footer (`FOOTER_LINKS`) |
| 2 | Marca visual | `src/styles/theme.css` | colores (`--color-*`), tipografías (`--font-sans`, `--font-display`, `--font-button` y sus `@font-face`), `--max-width`, `--gutter`, radios y sombra |
| 3 | Textos y datos | `src/data/content.ts` | copys de cada sección (`HERO`, `OVERVIEW`, `GALLERY`, `EXPERIENCE`, `AMENITIES`, `ROOMS`, `REVIEWS`, `LOCATION`, `BOOKING`, `FAQ`, `FOOTER`), alt de imágenes, página 404 (`NOT_FOUND`) y etiquetas de interfaz (`UI_LABELS`) |
| 4 | Activos | `public/` | fotos, avatares, logotipo del footer, `og-image.jpg`, favicons y fuentes `.woff2` |

## Flujo recomendado

1. `pnpm new-client-site <slug> --from plantilla-pinevalley --name "..." --domain "..."`
2. Edita los 4 puntos en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`.
3. `pnpm customize:check <slug>` y corrige todo lo que reporte.
4. `pnpm verify` y `SITE_FOLDER=<slug> QA_ROUTES="/,/404" pnpm test:visual`.

## Detalles por punto

### 1. `src/config/site.ts`
- `CLIENT_DOMAIN` debe coincidir con `SITE_URL` en Coolify.
- `logoText` es el logotipo de texto de cabecera y footer; `name` alimenta `<title>`, Open Graph y JSON-LD (`LodgingBusiness`).
- `contact.mapQuery` es lo que busca el mapa embebido de Google (`maps.google.com/maps?q=…&output=embed`); usa la dirección real o las coordenadas del alojamiento.
- `bookingUrl` es el destino del botón de la tarjeta de reserva (Airbnb, Booking, motor propio…). Los demás botones "Reserve Now / Book Your Stay" llevan al ancla `#booking`.
- Si añades o quitas secciones, ajusta `MENU_LINKS`/`FOOTER_LINKS`: los `href` son anclas (`/#gallery`) que deben coincidir con el `id` de la sección en `content.ts`.

### 2. `src/styles/theme.css`
- Cambia primero `--color-primary` (botones, tarjetas oscuras, menú móvil), `--color-text`, `--color-muted` y `--color-star`.
- Si cambias fuentes: añade los `.woff2` a `public/fonts/`, actualiza los `@font-face`, las variables `--font-*` y `preloadFonts` en `site.ts`.
- General Sans se distribuye con la ITF Free Font License (Fontshare); Inter / Inter Display con OFL.

### 3. `src/data/content.ts`
- Los `\n` dentro de un texto son los saltos de línea del diseño original: se respetan desde 810 px y en mobile el texto fluye libre (en títulos se respetan siempre). Si cambias un texto, mueve o quita los `\n` para que los renglones queden equilibrados.
- `OVERVIEW.statement` se ilumina letra a letra con el scroll; mantenlo en una o dos frases.
- `GALLERY.images[].shape` (`landscape`/`portrait`) define la proporción de cada foto en el masonry; con 6 fotos y el patrón original las columnas quedan parejas.
- `ROOMS.items` alimenta el carrusel coverflow (desktop: 5 tarjetas visibles; funciona con 3 o más).
- `HERO.foreground` es un **recorte con transparencia** de la misma foto que `HERO.background`: el título queda entre las dos capas. Si el cliente no tiene un recorte, usa un PNG/WebP transparente vacío o la misma silueta recortada; ambas imágenes deben tener exactamente el mismo encuadre.
- Las reseñas, precio, puntuación y FAQ son de ejemplo: reemplázalos por datos reales del cliente.

### 4. `public/`
Reemplaza el archivo conservando nombre y proporción para no tocar rutas.

| Archivo | Uso | Tamaño sugerido |
| :-- | :-- | :-- |
| `images/hero-background.webp` | fondo del hero | 1440 × 1728 o mayor, vertical 5:6 |
| `images/hero-foreground.webp` | recorte transparente de la casa sobre el título | mismo tamaño y encuadre que el fondo |
| `images/overview.webp` | foto del bloque "Property Overview" (parallax) | 2000 × 1300 |
| `images/gallery/gallery-1…6.webp` | galería y visor | horizontales 1600 × 1200, verticales 1200 × 1600 |
| `images/experience/experience-1…3.webp` | tarjetas de experiencias (parallax) | 900 × 1350, vertical |
| `images/rooms/room-1…5.webp` | carrusel de espacios | 1200 × 900 |
| `images/avatars/hero-*.webp`, `review-*.webp` | avatares del hero y de las reseñas | 160 × 160 o mayor, cuadrado |
| `images/booking.webp` | fondo de la sección de reserva (parallax) | 1600 × 1200 o mayor |
| `images/footer.webp` | fondo del footer (anclado abajo) | 1600 × 1500 |
| `images/logo-mark.webp` | logotipo/ilustración blanca del footer | 360 × 240, fondo transparente |
| `images/og-image.jpg` | imagen al compartir | 1200 × 630 |
| `favicon.png` / `favicon-dark.png` | icono (modo claro/oscuro) | 64 × 64 o mayor |

## Páginas y secciones opcionales
- El sitio es una sola página (`src/pages/index.astro`) más `404.astro`. Para quitar una sección, elimina su componente de `index.astro` y su enlace de `MENU_LINKS`/`FOOTER_LINKS`.
- Secciones independientes: `Experience`, `Rooms`, `Reviews`, `Location` y `Faq` pueden quitarse sin afectar al resto. `Booking` es el destino de todos los CTA internos: si la quitas, cambia esos `href` en `content.ts`/`site.ts`.

## Checklist de entrega
- [ ] `pnpm customize:check <slug> --strict` sin hallazgos
- [ ] Sin textos, imágenes, reseñas ni contactos de la plantilla en el sitio publicado
- [ ] Mapa (`mapQuery`) y `bookingUrl` apuntan al alojamiento real
- [ ] Recorte del hero alineado con el fondo en desktop, tablet y mobile
- [ ] `pnpm verify` y Visual QA en verde
