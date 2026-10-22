# Brief de clonado — lunevar

- **Fuente:** https://extraordinary-wombat-796551.framer.app (Framer, publicado el 22-oct-2026). Marca de la fuente: "Lunevar — A desert retreat that lives by the sun".
- **Modo:** A — Plantilla. Estructura, layout, estilos, animaciones e interacciones reales; textos en español propios, precios, personas y contactos de ejemplo; marca ficticia **Almara**.
- **Destino:** `plantillas/lunevar/` · dominio de ejemplo `lunevar.example.com` · `pnpm --filter @plantillas/lunevar dev`.
- **Inventario de rutas:** `docs/routes.json` (20 rutas: sitemap.xml, robots.txt y enlaces de la portada). `robots.txt` de la fuente: `Allow: /`.

## 1. Rutas

| Origen | Local | Archivo |
| :-- | :-- | :-- |
| `/` | `/` | `src/pages/index.astro` (+ `src/components/home/*`) |
| `/suites` | `/suites` | `src/pages/suites/index.astro` |
| `/suites/{canyon-room, dune-suite, mesa-suite, shadow-house, star-loft, courtyard-villa}` | igual | `src/pages/suites/[slug].astro` (desde `SUITES`) |
| `/a-day-here` | `/a-day-here` | `src/pages/a-day-here.astro` |
| `/longevity` (+ ancla `#compare`) | igual | `src/pages/longevity.astro` |
| `/dining` | `/dining` | `src/pages/dining.astro` (+ isla `ReserveBar.tsx`) |
| `/journal` | `/journal` | `src/pages/journal/index.astro` |
| `/journal/<7 cartas>` | igual | `src/pages/journal/[slug].astro` (desde `ARTICLES`) |
| `/plan-your-stay` (+ `?arrive&depart&house&program`) | igual | `src/pages/plan-your-stay.astro` (+ isla `StayPlanner.tsx`) |
| — | `/404` | `src/pages/404.astro` |

Se conservan los pathnames de la fuente (en inglés) para no romper el inventario; los textos visibles están en español.

## 2. Secciones por página (orden de la fuente)

- **Portada:** hero (foto a sangre, "Live by / the light.", dial solar en vivo, barra de estancia) · manifiesto con fotos en píldora y cuatro cifras · "A day, measured by the sun" (arco fijo + 6 rituales) · "Rooms that keep the shade" (3 suites en arco, la central desplazada) · cinta solar · casa termal (foto a sangre + 5 tarjetas de vidrio) · programas de longevidad (arco + acordeón de 3) · "The land is the program" (carril arrastrable de 6 experiencias) · cena (foto + menú de 3 tiempos) · "After dark" (cielo nocturno + 3 tarjetas) · notas de huéspedes (5 citas rotativas) + prensa · "Your stay begins at sunrise" (planificador compacto) · pie fijo que se descubre.
- **Suites:** cabecera a sangre con cifras 14/6/4 · filtros Todas/Suites/Casas/Villas · rejilla de 6 tarjetas en arco · tabla "Compare, quietly." · banda oscura "Not sure which?".
- **Detalle de suite:** chips, nombre en dos líneas, resumen, 4 cifras, CTA y precio · arco + inserto redondo · galería de 3 con visor · "How the light moves" (5 momentos en línea) · "In the house" (8 comodidades) + tarjeta de reserva · "Other ways to keep the shade" (3).
- **A day here:** escena fija con arco gigante y sol ligado al scroll · línea de 8 horas (día → noche) con "Add to my day" · "Six ways to spend the light" con filtros por momento.
- **Longevity:** hero oscuro con arco y VFC · 4 cifras · "Four movements, like a day" · precios con selector persona/pareja (3 tarjetas, la central destacada) · equipo (3) · FAQ (5, acordeón).
- **Dining:** cabecera a sangre · "Three tables, three lights" (3 arcos) · cita del chef · menú de 4 tiempos en degradado + barra de reserva con calendario emergente.
- **Journal:** título + carta destacada · filtros por categoría · rejilla de 6 · banda de suscripción.
- **Carta:** chips, título, autor, portada con pie, cuerpo (párrafos, cita, subtítulo, imágenes), etiquetas, compartir · "Keep reading" (3).
- **Plan your stay:** título + 4 pasos (fechas, casa, programa, datos) con resumen fijo oscuro y total · "Far enough to matter" (3 accesos + mapa) · franja de contacto (correo, teléfono, WhatsApp, prensa).

### Enlaces y formularios
- Internos: todos a rutas locales. Externos: Instagram (`siteConfig.socials.instagram`), Google Maps (`contact.mapsDestination`), WhatsApp (`wa.me`), `tel:` y `mailto:`.
- Formularios de la fuente (Framer Forms): suscripción del pie y del diario, "Send request" del planificador, reserva de mesa. Sitio estático: todos abren el correo del visitante con el mensaje listo hacia `contact.email` y muestran una confirmación.

## 3. Estilo medido

- **Fuentes:** Fraunces (variable, romana e itálica; títulos 400, cifras 300) y Hanken Grotesk (variable; texto 400, etiquetas 500). Mismos archivos de Google Fonts (OFL), auto-alojados. Métricas de respaldo de Framer copiadas en `theme.css`.
- **Escala display (1440):** 138/127 (−2,07 px) · 97/95 (−1,46) · 85/83 · 72/71 · 57 · tarjetas 36/41 · cifras 65 (300). Texto 17/26,35, secundario 15/22,5, chips 13, etiquetas 10–12 (tracking 1,2 px en horas).
- **Colores:** arena `#f5ede1`, `#efe4d3`, `#ebddc8`; superficie `#fbf6ee`; tinta `#2a1d14`; cobre `#c8642c` (`#b2531f`); brillo `#f0b784`; noche `#110d0c`; tierra `#3b2a1e`; crema `#f3e7d6`.
- **Layout:** contenedor 1360 + 40 de margen (20 en mobile) · secciones 120–160 px de alto de relleno · radios 16/20/24/28/32 y arcos `1000px 1000px 6px 6px` · píldoras 100 px · botones 52 px.
- **Breakpoints de la fuente:** 1440 (desktop), 810–1199 (tablet), < 810 (mobile). Menú mobile por debajo de 1000 px.

## 4. Animaciones e interacciones (fuente)

| Elemento | Disparador | Qué cambia | Duración / curva |
| :-- | :-- | :-- | :-- |
| Hero | carga | fundido + subida escalonada del texto, zoom suave de la foto | no verificado (≈1 s, ease-out) |
| Reloj de la cabecera | tiempo | hora local, momento del día y sol en el mini arco | cada minuto |
| Dial del hero | tiempo | sol y trazo del arco según la hora; punteado de noche | — |
| Cabecera | scroll | se oculta al bajar y reaparece al subir; color según la sección | ≈0,6 s (no verificado) |
| Manifiesto | scroll | palabras de borrosas a nítidas (reversible) | ligado al scroll |
| Cifras | scroll (entrada) | cuentan desde cero | ≈1,5 s (no verificado) |
| Arco "A day, measured" | scroll | sol recorre el arco, trazo continuo hasta el sol, marcas rellenas, tarjeta activa sólida | ligado al scroll |
| Tarjetas, fotos | hover | zoom de la foto | ≈1 s |
| Cinta solar | tiempo | marquesina infinita | no verificado (~40 s/vuelta) |
| Casa termal, cielo nocturno, arcos | scroll | parallax de la foto | no verificado |
| Programas | clic | acordeón de una sola apertura (oscuro/arena, +/−) | ≈0,6 s |
| Experiencias | arrastre | carril horizontal "Drag track" | — |
| Cena | scroll / tiempo | foto revelada (Reveal) y Ken Burns | no verificado |
| Notas de huéspedes | tiempo / clic | fundido entre 5 citas cada ~5–6 s, guiones | medido: cambio entre 7,5 y 10 s de muestreo |
| Planificadores | clic | rango en el calendario, título y total recalculados | instantáneo |
| Visor de la galería | clic | modal con flechas y Esc | — |
| Filtros (suites, día, diario) | clic | muestra/oculta tarjetas | — |
| "Add to my day" | clic | "Added ✓" en cobre | — |
| Selector persona/pareja | clic | precios de las 3 tarjetas | — |
| Pie | scroll | se descubre bajo el contenido (sticky) con un sol que sube tras el logotipo | ligado al scroll |
| Escena de "A day here" | scroll | sol del amanecer al atardecer en el arco gigante | ligado al scroll |
| Smooth scroll | — | no hay (sin Lenis: `window.lenis` indefinido) | — |

## 5. Activos

Las 39 imágenes de la fuente (`framerusercontent.com/images/<id>.jpg|png`, descargadas a `scale-down-to=2048`) se convirtieron a WebP con nombres semánticos en `public/images/` (`hero/`, `suites/`, `places/`, `rituals/`, `experiences/`, `people/`, `journal/`). `og-image.jpg` es un recorte 1200×630 de la foto del hero. El favicon SVG de la fuente (sol sobre el horizonte, sin marca) se recreó en `public/favicon.svg`. **Modo A:** son marcadores de posición de demostración de la plantilla de Framer; deben sustituirse en cada cliente.

## 6. SEO por página

`<SEO />` de `@repo/ui` con título "Página — Almara", descripción por página (`meta` en `content.ts`), canonical, Open Graph y Twitter, `lang="es"`. JSON-LD: `Resort` en todas las páginas, `HotelRoom` en cada suite, `BlogPosting` en cada carta y `FAQPage` en Longevidad. `robots.txt` y `sitemap-index.xml` generados con el dominio de `site.ts`.

## 7. Exclusiones

Ninguna ruta del inventario queda fuera. No se clonan: el badge "Made in Framer" ni el botón "Edit Content" (propios de la plataforma).
