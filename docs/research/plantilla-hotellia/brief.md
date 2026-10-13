# Brief de inspección — plantilla-hotellia

Fuente: `https://hotellia.framer.website/` (plantilla Framer "Hotellia — A Boutique Hotel Responsive
Template"). **Modo B — Fiel**: textos, estructura, tipografías e imágenes reales de la fuente. El
equipo confirmó que tiene las licencias de las imágenes; antes de entregar a un cliente, verificar
que la licencia cubre su uso o sustituirlas por fotos del cliente.

## Mapa de rutas (fuente → local)

Rutas descubiertas en `/sitemap.xml`, menú y footer. No quedó ninguna fuera de alcance.

| Fuente | Local | Archivo |
|---|---|---|
| `/` | `/` | `src/pages/index.astro` |
| `/rooms` | `/rooms` | `src/pages/rooms/index.astro` |
| `/rooms/double-deluxe` · `/junior-suite` · `/family-suite` | `/rooms/<slug>` | `src/pages/rooms/[slug].astro` (datos `ROOMS`) |
| `/wine-dine` | `/wine-dine` | `src/pages/wine-dine.astro` |
| `/bar-menu` | `/bar-menu` | `src/pages/bar-menu.astro` |
| `/restaurant-menu` | `/restaurant-menu` | `src/pages/restaurant-menu.astro` |
| `/gallery` | `/gallery` | `src/pages/gallery.astro` |
| `/reserve` | `/reserve` | `src/pages/reserve.astro` |
| `/offers/weekend-retreat` · `/offers/summer-escape` | `/offers/<slug>` | `src/pages/offers/[slug].astro` (datos `OFFERS`) |
| `/terms` | `/terms` | `src/pages/terms.astro` |
| `/privacy` | `/privacy` | `src/pages/privacy.astro` |
| `/404` (y rutas inexistentes) | `/404` | `src/pages/404.astro` |

Todos los textos viven en `src/data/content.ts`; dominio, contacto y redes en `src/config/site.ts`.
Destinos externos conservados: `tel:02252595200`, `mailto:welcome@hotellia.com`,
`https://facebook.com`, `https://instagram.com`; en términos `mailto:info@hotellia.com` y
`tel:+15551234567`.

## Tokens medidos

- Fondos: sección `#f2f2f2`, tarjetas `#ffffff`, verde de marca `#1c3d2d` (heroes de página, footer,
  menú abierto `rgba(28,61,45,.8)` + `backdrop-filter: blur(10px)`).
- Texto `#000`, títulos h2 `#2b2822`, carta del gerente `#222`, footer `#b3b3b3` / `#ebebeb`.
- **Libre Baskerville** 400/600/400 italic (OFL, Google Fonts): h1 80/96 (48 tablet, 40 móvil),
  h2 40/48 `-0.04em` (32 tablet, 26 móvil), h3 32/38.4, h4 20/28 (16 tablet), FAQ 600 16/22.4.
- **Inter** 400/700 (OFL, archivos de Framer): cuerpo 16/19.2, pequeño 14/16.8 `-0.02em`,
  hero 700 18/25.2 `-0.04em`, lead 20/24 mayúsculas.
- **Manrope** 500/700 (OFL): botones 12/19.2 `-0.02em`; carta del gerente 700 16/24.
- Contenedor 1150 px, gutter 20 px, padding de sección 64 px, intro → contenido 64 px, párrafo de
  intro al 60 % del contenedor. Breakpoints Framer: ≥1200, 810–1199, ≤809.
- Heroes: home 100vh (80vh móvil); páginas 60vh. Títulos "fit text" en SVG con `foreignObject`
  (viewBox medido por página en `HERO_TITLES`).

## Inventario de animaciones e interacciones

| Elemento | Disparador | Fuente (medido) | Implementación |
|---|---|---|---|
| Smooth scroll | rueda/touch | Lenis 1.1.9, componente Framer intensidad 15 → `duration: 1.5` | `lenis` en `src/scripts/motion.ts` |
| Imagen hero home | carga | `scale 1.1→1`, 2 s, `cubic-bezier(.6,-.01,.3,.99)` | `@keyframes hero-zoom` |
| Overlay hero home | carga | opacidad 0→0.2, spring 1.5 s, delay .3 s | `.appear-fade` |
| Textos + marca HOTELLIA | carga | `y 30→0` + opacidad, spring 2.5 s, delay .8 s | `.appear-up` |
| Contenido hero home | scroll | `translateY(-0.352 × scroll)`, tope −300 px; hero `sticky` | `data-scroll-shift` |
| Hero de habitación | scroll | sticky + `translateY(-0.2 × scroll)`, tope −180 px; overlay .04 | `MediaHero sticky` |
| Heroes verdes | carga + scroll | título `y 30→0`, spring 2.5 s; sticky y el contenido lo cubre | `PageHero` |
| Header | scroll | `position: absolute` (se va con la página) + franja fija de 55 px con blur 20 px y máscara | `SiteHeader` + `.header-blur` |
| Menú | clic | overlay verde .8 + blur 10; letras con blur→nítido escalonadas; hover píldora blanca; botón Menu/Close | script en `SiteHeader.astro` (Esc cierra, foco gestionado, scroll bloqueado) |
| Ticker de ofertas | tiempo | 50 px/s hacia la izquierda, gap 64 | CSS `@keyframes ticker` 24.2 s |
| Tarjetas Wine & Dine | hover | fondo blanco, imagen 100 %×148 % → 40 %×59 % centrada, texto blanco→#0b0b0b | CSS (móvil: estado hover fijo) |
| Experiencias | scroll | tarjetas `sticky top: 80px` apiladas | CSS sticky |
| Tarjetas de habitación | hover | imagen 565×390 → 395×273, aparecen propiedades + precio | CSS `grid-template-rows` (tablet/móvil: siempre expandidas) |
| Reseñas | clic | 5 puntos, cambio inmediato; solo la 1.ª en Libre Baskerville | `ReviewsCarousel.tsx` (`client:visible`, flechas de teclado) |
| Carta del gerente | scroll | 2.ª hoja `perspective(1200px) rotateX(-90°→0)` mientras su borde superior va del 100 % al 33 % del viewport | `data-fold` |
| Fotos de habitación | scroll | imagen interior sube 0→−46 px | `data-parallax-y="46"` |
| FAQ | clic | varias abiertas a la vez, "+" rota 45°, respuesta con borde izquierdo | botones `aria-expanded` + `grid-template-rows` |
| Slideshow Wine & Dine | clic | sin autoplay, bucle infinito, paso 100 % + 10 px, ~0.7 s | `Slideshow.tsx` (`client:visible`) |
| Legales | carga | contenido opacidad 0→1 delay .8 s; "Last Updated" palabra a palabra (y 10→0, escalonado .08 s) | `.appear-fade` + `@keyframes legal-word` |
| Botones | hover | negro → `#222`; píldora blanca → `#f2f2f2` | CSS |
| Footer | hover | enlaces `#b3b3b3` → blanco | CSS |

Todas las animaciones respetan `prefers-reduced-motion` (sin Lenis, hoja de la carta desplegada,
sin ticker).

## Activos

- Fuentes en `public/fonts/` (descargadas de las URLs que carga la fuente).
- 38 imágenes en `public/images/` desde `framerusercontent.com/images/<id>?scale-down-to=2048`
  (el CDN sirvió JPEG/PNG reales, 1168×784 salvo `home-hero.jpg` 2596×1742, logos 344×76,
  firma 1536×1024, OG 1200×630, flechas 94×94). Favicons claro/oscuro en `public/`.
- Iconos (campana, contacto, amenidades, propiedades, "+") extraídos como SVG del DOM de la fuente
  y normalizados a `currentColor` en `src/data/icons.ts`.

## SEO

`<SEO />` con `siteConfig`, canonical, OG/Twitter, `lang="en"`, JSON-LD `Hotel` en `BaseLayout`.
`robots.txt.ts` y `sitemap()` intactos; 404 con `noindex`.

## Diferencias deliberadas / conocidas

- **Títulos `<title>`**: la fuente repite el título genérico en las páginas estáticas; aquí cada
  página usa "Página - Hotellia - A Boutique Hotel Responsive Template" (mejor SEO). Las
  habitaciones y ofertas coinciden con la fuente.
- **Formulario de reserva**: Framer lo envía a su backend; al ser estático, aquí abre el cliente de
  correo (`welcome@hotellia.com`) con la solicitud redactada. Mismos campos, validación y botón
  deshabilitado hasta completar.
- Badge "Made in Framer" omitido (no forma parte del diseño).
- Se reproducen dos rarezas de la fuente: la 2.ª reseña sin comilla inicial y, en móvil, la
  cuadrícula "Wine & Dine" de la galería con 2 columnas fijas de 361 px que desbordan (la segunda
  columna queda recortada).
- Flechas ocultas (opacidad 0) del carrusel de reseñas de la fuente no se renderizan.
- Curvas "spring" de Framer aproximadas con `cubic-bezier(.16,1,.3,1)`; las duraciones y retardos
  son los medidos.
- Desfases residuales medidos: ≤5 px en la altura total de algunas secciones (FAQ en móvil con
  preguntas de dos líneas).
