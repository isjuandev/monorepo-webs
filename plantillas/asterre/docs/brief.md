# Brief de inspección — plantilla-asterre

Fuente: `https://asterre.framer.website/` (plantilla Framer de terceros, sitio de un retiro boutique).
Alcance acordado: **todas las rutas**, reproduciendo layout, tipografía, paleta e interacciones,
con **copy propio en español**. Las **fotos son las de la plantilla Asterre**, usadas bajo la licencia
que confirmó el equipo; antes de entregar a un cliente, verificar que la licencia cubre su uso o
reemplazarlas por fotos del cliente.

## Mapa de rutas (fuente → local)

| Fuente | Local | Archivo |
|---|---|---|
| `/` | `/` | `src/pages/index.astro` |
| `/retreat` | `/retreat` | `src/pages/retreat.astro` |
| `/rooms` | `/rooms` | `src/pages/rooms/index.astro` |
| `/rooms/<slug>` | `/rooms/<slug>` | `src/pages/rooms/[slug].astro` (datos en `src/data/content.ts`) |
| `/experience` (+ anclas) | `/experience#<id>` | `src/pages/experience.astro` |
| `/contact` | `/contact` | `src/pages/contact.astro` |
| `/privacy-policy` | `/privacy-policy` | `src/pages/privacy-policy.astro` |
| `/terms-of-use` | `/terms-of-use` | `src/pages/terms-of-use.astro` |

Destinos externos de la fuente (booking, mapas, clima, redes) se sustituyen por valores de
`src/config/site.ts` (`bookingUrl`, `mapsUrl`, `socials`).

## Tokens medidos

- Fondo crema `#e8e0d1`, tinta `#261a11`, superficie marrón `#734e34`, overlay `rgba(38,26,17,.4)`.
- Display: **Forum 400** (Google Fonts, OFL) — 144 / 80 / 64 / 32 / 28 px, `line-height .92–.96`,
  `letter-spacing -0.03em`, mayúsculas. Texto: Forum 21 px y 18 px (`-0.01em`).
- Etiquetas: **Almarai 400** 12 px, `line-height 1.44`, `+0.02em`, mayúsculas.
- Gutter 32 px (24 px móvil). Separación vertical de secciones 240 px. Breakpoints Framer: 1200 / 810.
- Móvil: h2 52 px, h3 24 px, display ~60 px.

## Secciones de la home

1. Hero 100vh: imagen + overlay, label superior, titular display letra a letra, etiquetas laterales,
   texto inferior izquierdo y tarjeta de reseñas crema (296 px).
2. Intro 100vh: imagen parallax, marca + "Est.", dos bloques con divisor, h2 + texto + CTA primario.
3. Bienestar 100vh: imagen parallax, h2 con etiquetas laterales, CTA primario.
4. Habitaciones: h2 + texto + enlace; carrusel con slide central 800×600 y laterales 640×480
   (paso 852 px), flechas 36 px, bucle infinito. Móvil 342 / 274 px.
5. Gastronomía: h2 + texto, dos imágenes 448×757 escalonadas (+280 px) con velocidades distintas.
6. Experiencias 100vh: fondo que cambia con hover sobre 3 enlaces con divisores.
7. Ticker marrón: dos filas display + imagen que se desplazan en sentidos opuestos ligadas al scroll.
8. CTA de cierre marrón + footer: imagen parallax con tarjeta marrón centrada de 360 px.

## Interacciones observadas → implementación

| Disparador | Comportamiento | Implementación |
|---|---|---|
| Carga / scroll | Titulares letra a letra (opacidad + blur + translateY, escalonado) | `SplitText.astro` + IntersectionObserver |
| Scroll | Header se oculta al bajar y reaparece con fondo crema al subir | script en `SiteHeader.astro` |
| Click | Menú a pantalla completa marrón, hamburguesa → X, contenido escalonado | `SiteHeader.astro` (vanilla) |
| Scroll | Parallax de imágenes de fondo (capa 400 px más alta) | `[data-parallax]` en `src/scripts/motion.ts` |
| Scroll | Ticker horizontal ligado al progreso de la sección | `[data-ticker-row]` |
| Hover | Fondo de "Experiencias" cambia por enlace (fade + scale) | `[data-hover-group]` |
| Click / swipe / teclado | Carrusel de habitaciones con bucle | `RoomsCarousel.tsx` (isla Preact, `client:visible`) |

No se detectó Lenis (`window.lenis` ausente), por lo que no se añadió smooth-scroll.

## Activos

- Fuentes auto-alojadas: `public/fonts/forum-400.woff2`, `public/fonts/almarai-400.woff2`.
- Fotos: 72 imágenes descargadas de `framerusercontent.com/images/<id>` con `scale-down-to`
  2048 (fondos a pantalla completa), 1024 (medianas) o 512 (miniaturas). El CDN las sirve como
  **WebP** aunque la URL termine en `.jpg`, así que se guardaron como `.webp`.
  Mapa SVG del retiro: `retreat-map.svg` (vector original).
- Nombres en `public/images/`: `home-*`, `retreat-*`, `room-<clave>[-wide|-tall|-detail|-inset]`,
  `room-shared`, `exp-<id>[-inset]`, `private-1..4`, `place-1..4`, `ticker-1..2`, `contact-*`,
  `footer`. Todas se referencian desde `IMAGES` / `ROOMS` / `EXPERIENCES` en `src/data/content.ts`.
- Correspondencia de habitaciones (local ← fuente): garden-room ← garden-room,
  mountain-suite ← tramuntana-suite, pool-suite ← pool-suite, casa-principal ← asterre-house,
  olive-room ← olive-room, horizon-suite ← horizon-suite.
- Iconos (estrellas, redes, flechas) dibujados como SVG inline propios.

## Diferencias deliberadas frente a la fuente

- Textos, nombres de habitaciones, precios y datos de contacto son de ejemplo.
- El bloque de clima del menú se reemplazó por horarios de check-in/out (no hay dato en vivo).
- Formulario de contacto: abre el cliente de correo con la consulta redactada (sitio estático).
- Badge "Made in Framer" omitido.
