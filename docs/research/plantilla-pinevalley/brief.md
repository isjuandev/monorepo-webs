# Brief — plantilla-pinevalley

- **Fuente:** https://pinevalley.framer.website/ (Framer, plantilla "Pine Valley" de brxneo). Única fuente usada.
- **Destino:** `sites/plantilla-pinevalley/` (`@sites/plantilla-pinevalley`), dominio de ejemplo `plantilla-pinevalley.example.com`.
- **Modo de contenido:** A — Plantilla. Estructura, layout, estilos, animaciones, textos de marketing e imágenes de la fuente como **material de ejemplo**; contactos y dirección sustituidos por placeholders genéricos (`hello@example.com`, `+1 (555) 123-4567`, `123 Example Road…`). Las reseñas, precio y FAQ son de ejemplo y deben reemplazarse por datos del cliente.
- **Idioma:** inglés (`en_US`), igual que la fuente. Para un cliente en español solo se traduce `src/data/content.ts` y `locale` en `site.ts`.
- **Capturas fuente:** `docs/design-references/plantilla-pinevalley/source/` (desktop 1440×900, tablet 810×1080, mobile 390×844; `*-top`, `*-full` y estados: scroll del hero, cabecera al subir, visor, carrusel, FAQ abierto, menú móvil). HTML fuente en `source/home.html`.

## 1. Rutas

`/sitemap.xml` solo lista `/`; `robots.txt` permite todo. Menú y footer usan anclas de la misma página.

| Fuente | Local | Archivo |
| :-- | :-- | :-- |
| `/` | `/` | `src/pages/index.astro` |
| `/#home`, `#gallery`, `#amenities`, `#rooms`, `#reviews`, `#booking` | anclas iguales (+ `#experience`, `#location`, `#faq`) | `id` de cada sección |
| 404 de Framer | `/404` | `src/pages/404.astro` (cabecera sólida) |
| `/robots.txt`, `/sitemap-index.xml` | técnicas | `src/pages/robots.txt.ts`, `@astrojs/sitemap` |

Enlaces externos conservados como destino de ejemplo (configurables en `site.ts`): Google Maps, Airbnb (botón de la tarjeta de reserva), Instagram, TikTok, Facebook. Fuera de alcance: insignias "Made in Framer" / "Get Template" y el enlace de compra de la plantilla.

**Páginas dinámicas:** la fuente no tiene subpáginas (las habitaciones son solo tarjetas del carrusel con título), así que no se crearon `[slug].astro`: inventar páginas de detalle rompería la regla de fuente única. Si un cliente las necesita, `ROOMS.items` es el punto de partida.

## 2. Secciones (orden)

1. **Hero** (`Hero.astro`, h = 1.2 × ancho en desktop; 1200 px tablet; 1100 px mobile): fondo + título + recorte transparente de la casa por delante (efecto profundidad). Avatares (4 × 28 px, solape 8 px) + "Trusted by +200 people", H1 General Sans 60/72 (48 tablet, 36 mobile), texto 16 (14), botón blanco.
2. **Overview** (`Overview.astro`): etiqueta, frase General Sans 32/500 con revelado por letra, foto 1392×600 con parallax, 8 tarjetas de características (4/3/2 columnas, gap 8, 101 px de alto, borde #dedede, radio 8).
3. **Gallery** (`Gallery.astro` + isla `GalleryLightbox.tsx`): masonry 3 columnas (2 en mobile), gap 12, radio 8, hover zoom 1.05; botón negro "View gallery"; visor negro a pantalla completa con contador "n / 6", flechas, cerrar.
4. **Experience** (`Experience.astro`): 3 tarjetas 500 px (416 tablet, 400 mobile en 1 columna) con imagen en parallax y título abajo a la izquierda.
5. **Amenities** (`Amenities.astro`): 12 tarjetas icono + texto (4/3/2 columnas).
6. **Rooms** (`Rooms.astro` + isla `RoomsCarousel.tsx`): coverflow de 5 tarjetas 550×400 (escala 0.95 / 0.765 / 0.63, desplazamiento ±357.5 px, sombra `0 25px 50px -12px rgba(0,0,0,.25)` en la activa, título solo en la activa); flechas negras redondas de 30 px. Tablet y mobile: una tarjeta a todo el ancho.
7. **Reviews** (`Reviews.astro`): 6 tarjetas (3/2/1 columnas, gap 8, padding 24): avatar 50 px, nombre, "Stayed …", 5 estrellas doradas, cita.
8. **Location** (`Location.astro`): mapa Google embebido 720×400, tarjeta negra con dirección y teléfono, 6 lugares cercanos (3/2 columnas) con minutos.
9. **Booking** (`Booking.astro`): sección 900 px (1080 tablet, 844 mobile) con fondo en parallax, contenido centrado vertical; tarjeta blanca 400 px: precio 28/600, estrellas + "4.9 (248 Reviews)", zona, texto y botón negro externo.
10. **FAQ** (`Faq.astro` + isla `FaqAccordion.tsx`): 8 preguntas, lista de 720 px, filas con borde; al abrir la fila escala a 0.98 y el icono gira de + a ×.
11. **Footer** (`SiteFooter.astro`): 1200 px (1000 tablet/mobile), radio superior 32, imagen de fondo anclada abajo; logotipo de texto, texto, botón, ilustración blanca a la derecha; columnas Navigation / Contact / Follow (space-between); © + "Available for Booking" con punto verde pulsante.

## 3. Estilo medido

- **Fuentes** (mismos archivos que carga la fuente, en `public/fonts/`): Inter 400/500/600/700/900 (texto, logotipo 900), Inter Display 500 (botones, tracking −0.02em), General Sans 500/600 (títulos; Fontshare, ITF Free Font License).
- **Colores** (tokens de Framer → `theme.css`): texto #000, gris #545454 (`--color-muted`), gris claro #a4a4a4 (`--color-subtle`), borde #dedede, blanco #fff, estrellas doradas (`--color-star`, aprox. #d9a43f), disponibilidad #3cff00 / rgba(119,255,0,.5).
- **Layout:** ancho máx. 1440, gutter 24, sección 96 / 72 / 48 px de padding vertical y 48 px entre encabezado y contenido; encabezados: etiqueta 14, H2 40/52 (32 tablet, 28 mobile, máx. 600 px), texto 16 (14 mobile, máx. 520). Framer usa `text-wrap: balance` en títulos y textos, y saltos de línea manuales (`\n` en `content.ts`, solo ≥ 810 px).
- **Breakpoints:** desktop ≥ 1200, tablet 810–1199, mobile < 810 (los mismos de la fuente).

## 4. Animaciones e interacciones

| Elemento | Disparador | Fuente (medido) | Implementación |
| :-- | :-- | :-- | :-- |
| Smooth scroll | rueda/táctil | Lenis en `<html>` | `lenis` en `src/scripts/motion.ts` (`duration 1.2`, anclas) |
| Contenido del hero | carga | opacity 0→1, y 50→0, resorte (damping 30, stiffness 130, mass .2), retardo 0.4 s | `[data-appear="0.4"]` + transición CSS |
| Contenido del hero | scroll | parallax `speed 50` → translateY = scrollY × 0.5 (pasa por detrás de la casa) | `[data-scroll-speed="0.5"]` → `--scroll-shift` |
| Encabezados de sección | scroll (umbral 0.5, una vez) | opacity 0→1, y 50→0, mismo resorte | `[data-reveal]` + IntersectionObserver |
| Frase del Overview | scroll continuo | revelado por caracteres, opacidad 0.2→1 entre 90 % y 30 % del viewport | `[data-text-reveal]` (split en spans, reversible) |
| Fotos Overview / Experience / Booking | scroll continuo | imagen 1.5× más alta que el marco, se desplaza ±sobrante/2 al cruzar el viewport | `[data-parallax]` |
| Cabecera | scroll | se oculta al bajar (−150 px), reaparece al subir; transparente/blanca sobre el hero, fondo blanco y texto negro después | `[data-header]` `.is-hidden` + `data-variant` |
| Enlaces del menú | hover | blanco → #dedede | CSS |
| Botones | hover | punto de 8 px crece desde el puntero e invierte colores | `.btn__fill` + `--fill-x/y` desde `pointerenter` |
| Avatares del hero | hover | escala 1.08 (resorte) | CSS |
| Galería | hover / clic | zoom 1.05; visor con contador, flechas, teclado | CSS + isla Preact (`client:visible`), Esc y devolución de foco |
| Carrusel de espacios | clic flechas | coverflow con escala/desplazamiento, resorte | isla Preact + transiciones CSS 0.6 s |
| FAQ | clic | fila escala 0.98, respuesta se despliega, icono + → × (resorte bounce .2, 0.4 s) | isla Preact + `grid-template-rows` |
| Menú móvil | clic | panel negro superior con enlaces 24/700 y botón | `<script>` vanilla en `SiteHeader.astro`, Esc, bloqueo de scroll |
| "Available for Booking" | tiempo | punto verde con halo | `@keyframes pulse` (velocidad no verificada, la fuente no la anima en CSS) |
| Reduced motion | — | — | sin Lenis, sin parallax ni revelados (todo visible) |

## 5. Activos (fuente → local)

| Fuente (`framerusercontent.com/images/…`) | Local (`public/`) | Tipo / tamaño |
| :-- | :-- | :-- |
| `cJvsyX83B7pivSAodfIduWaOc.webp` | `images/hero-background.webp` | WebP 1084×1300 |
| `PcArxoW6SyY5NxWF1Vf2fQr6oY.png` | `images/hero-foreground.webp` | WebP con alfa 1084×1300 |
| `37UPjIo0Q1KIt0Ixcpk13Gjf04Q.webp` | `images/overview.webp` | WebP 1200×896 |
| `euPx…`, `IfgG…`, `Js7D…`, `p0ph…`, `hscy…`, `NjYF…` | `images/gallery/gallery-1…6.webp` | WebP 1200×896 / 896×1200 |
| `tRvf…`, `bFem…`, `z0U8…` | `images/experience/experience-1…3.webp` | WebP ~800×1200 |
| `Xi1y…`, `SPUo…`, `NgFm…`, `BOx8…`, `vXLl…` | `images/rooms/room-1…5.webp` | WebP 1200×896 |
| `mMaa…`, `mXOA…`, `KiaX…`, `8d4S…` | `images/avatars/hero-1…4.webp` | WebP ≤512 |
| `UqJP…`, `YCdL…`, `S0Zh…`, `GKj4…`, `BNNW…`, `7gKp…` | `images/avatars/review-1…6.webp` | WebP ≤512 |
| `iAcvAwEC2kHsRynG1czmn6y4DI.jpeg` | `images/booking.webp` | WebP 1600×1195 |
| `a0q8R6pqz5kghVR9syAp7y3s0g.png` | `images/footer.webp` | WebP 1084×1029 |
| `qRIVLUO8AAoatNJzOFYA9np0KQ.png` | `images/logo-mark.webp` | WebP con alfa 512×341 |
| `73AFls8BZwsydJg6VnBjCuO3I.jpg` (og:image) | `images/og-image.jpg` | JPEG |
| `nzG5…png` / `QghE…png` | `favicon.png` / `favicon-dark.png` | PNG 64 |
| Sprite SVG inline (25 iconos) | `src/data/icons.ts` | trazos originales, `currentColor` |

Las resoluciones están limitadas por los originales subidos a Framer (el hero mide 1084×1300 en origen).

## 6. SEO

`<title>` "Pine Valley — A Modern Escape Into Luxury", descripción original, canonical y Open Graph con `<SEO />` de `@repo/ui`, `lang="en"`, JSON-LD `LodgingBusiness` generado desde `siteConfig`, favicons claro/oscuro, `robots.txt` y `sitemap-index.xml`. La 404 lleva `noindex`.

## 7. Diferencias conocidas

- Los resortes de Framer (spring) se aproximan con `cubic-bezier`; duraciones equivalentes, no idénticas.
- El relleno de botón de Framer también desliza el texto (dos capas); aquí se invierte el color sin el deslizamiento.
- Botones e ilustraciones de Framer ("Made in Framer", "Get Template") omitidos a propósito.
- El carrusel en tablet/mobile cambia de tarjeta con un fundido (la fuente desliza la tarjeta).
- El mapa de Google se carga solo con red (en capturas sin red aparece el fondo gris de marcador).
- Mobile: algunas preguntas del FAQ y textos parten renglón en otro punto porque Framer usa anchos internos distintos por breakpoint.
