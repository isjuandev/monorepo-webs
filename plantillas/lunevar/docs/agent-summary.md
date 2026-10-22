# Resumen del agente — lunevar

Clon de https://extraordinary-wombat-796551.framer.app en `plantillas/lunevar/` (skill clone-website, modo A — Plantilla). Marca ficticia **Almara**, español (`es_CO`), dominio de ejemplo `lunevar.example.com`. Previsualizar: `pnpm --filter @plantillas/lunevar dev`. Inventario y medidas en `docs/brief.md`; capturas de la fuente en `docs/referencias/source/` (top y página completa de las 20 rutas en desktop 1440×900 y mobile 390×844, más estados de interacción en `source/states/`) y del clon en `docs/referencias/local/`.

## Rutas (origen → local)

| Origen | Local | Archivo |
| :-- | :-- | :-- |
| `/` | `/` | `src/pages/index.astro` + `src/components/home/*` |
| `/suites` | `/suites` | `src/pages/suites/index.astro` |
| `/suites/canyon-room` · `/dune-suite` · `/mesa-suite` · `/shadow-house` · `/star-loft` · `/courtyard-villa` | igual | `src/pages/suites/[slug].astro` (desde `SUITES`) |
| `/a-day-here` | `/a-day-here` | `src/pages/a-day-here.astro` |
| `/longevity` (y `#compare`) | igual | `src/pages/longevity.astro` |
| `/dining` | `/dining` | `src/pages/dining.astro` + isla `ReserveBar.tsx` |
| `/journal` | `/journal` | `src/pages/journal/index.astro` |
| `/journal/why-we-built-a-hotel-without-clocks` · `/clay-water-patience-a-morning-with-the-nahat-family` · `/what-two-nights-in-our-sleep-lab-taught-400-guests` · `/the-mineral-breakfast-explained` · `/a-field-guide-to-a-bortle-1-sky` · `/growing-food-where-it-almost-never-rains` · `/eleven-minutes-of-noon-designing-the-slit-of-light` | igual | `src/pages/journal/[slug].astro` (desde `ARTICLES`) |
| `/plan-your-stay` (+ `?arrive&depart&house&program`) | igual | `src/pages/plan-your-stay.astro` + isla `StayPlanner.tsx` |
| — | `/404` | `src/pages/404.astro` |

Se clonaron las 20 rutas del inventario; ninguna se excluyó (no hay páginas legales, duplicadas ni 404 en el sitemap). Se conservan los pathnames en inglés de la fuente; los textos visibles están en español.

## Animaciones e interacciones

| Elemento | Disparador | Fuente | Implementación | Estado |
| :-- | :-- | :-- | :-- | :-- |
| Hero: entrada | carga | texto en fundido y subida escalonada, foto con zoom suave | `[data-load]` (1,1 s `cubic-bezier(.22,1,.36,1)`, retardos 0,15–0,75 s) + `hero-zoom` 2,4 s | Implementada (duraciones no verificadas) |
| Reloj solar de la cabecera | tiempo | hora local + momento ("Night") + sol en mini arco | `SunClock.astro` + `scripts/sun-clock.ts` (cada 30 s) | Implementada |
| Dial del hero | tiempo | arco con el sol a la hora actual; de noche punteado con el sol en el horizonte | `[data-live-dial]` en `sun-clock.ts` | Implementada |
| Cabecera fija | scroll | se oculta al bajar, reaparece al subir; texto claro/oscuro según la sección | `SiteHeader.astro` (sondeo de `[data-tone]` a 50 px) | Implementada |
| Menú mobile | clic | capa oscura a pantalla completa con hora por enlace y arco | `#mobile-menu`, Esc, foco y bloqueo de scroll | Implementada y probada |
| Manifiesto palabra a palabra | scroll | de borroso a nítido, reversible | `[data-words]` en `scripts/motion.ts` (blur 10 px → 0) | Implementada |
| Cifras | entrada en vista | cuentan desde 0 | `[data-count]` 1,6 s ease-out cúbico | Implementada (duración no verificada) |
| Arco "Un día, medido por el sol" | scroll | sol interpolado entre rituales, trazo hasta el sol, marcas rellenas, tarjeta activa sólida | `SunArc.astro` + `scripts/sun-arc.ts` (driver "cards") | Implementada y probada |
| Aparición por scroll | scroll | fundido + subida de títulos, tarjetas y bloques | `[data-reveal]` (28 px, 1 s, escalonado) | Implementada |
| Parallax de fotos | scroll | hero, termal, cielo nocturno, arcos | `[data-parallax]` en `motion.ts` | Implementada (factores no verificados) |
| Hover de tarjetas | hover | zoom de foto | `scale(1.04)` 1–1,2 s | Implementada |
| Cinta solar | tiempo | marquesina infinita | `@keyframes ticker` 42 s lineal | Implementada (velocidad no verificada) |
| Acordeón de programas | clic | uno abierto (oscuro) y el resto en arena, +/− | `scripts/accordion.ts` (grid-rows 0fr→1fr 0,6 s, `inert`) | Implementada y probada |
| Carril de experiencias | arrastre / rueda / táctil | "Drag track" horizontal | `scripts/drag-scroll.ts` + scroll nativo con snap | Implementada |
| Foto de la cena | scroll + tiempo | revelado y Ken Burns | `clip-path` 1,4 s + `ken-burns` 18 s en vaivén | Implementada (no verificado) |
| Notas de huéspedes | tiempo / clic | fundido entre 5 citas, guiones activos | intervalo 5,5 s, pausa con puntero/foco, guiones `aria-pressed` | Implementada y probada |
| Planificador compacto (portada) | clic | rango en calendario, resumen y total | isla `StayPlanner` (`client:visible`) → enlace a `/plan-your-stay` con la selección | Implementada y probada |
| Planificador completo | clic / envío | fechas, casa, programa, datos; título "Cinco noches en…" y total | isla `StayPlanner` (`client:load`), lee la URL, validación nativa, abre `mailto:` | Implementada y probada |
| Lunas llenas en calendarios | — | punto bajo el día | cálculo astronómico en `lib/dates.ts` | Implementada |
| Filtros (suites, día, diario) | clic | muestra/oculta tarjetas | `scripts/filters.ts` (aviso si no queda ninguna) | Implementada y probada |
| Visor de galería | clic / teclado | modal con flechas | `<dialog>` modal: flechas, Esc, clic fuera, foco devuelto | Implementada y probada |
| Escena "De la primera luz…" | scroll | sol recorre el arco gigante mientras la escena queda fija | `SunArc` driver "section" en escena sticky de 170 vh | Implementada y probada |
| Línea del día | scroll | puntos de cada hora se rellenan; fondo del día a la noche | IntersectionObserver + degradado | Implementada |
| "Añadir a mi día" | clic | "Added ✓" en cobre | botón `aria-pressed` (sin persistencia, como la fuente) | Implementada y probada |
| Precios persona/pareja | clic | cambia los 3 precios | `[data-pricing]` | Implementada y probada |
| FAQ de longevidad | clic | acordeón | `accordion.ts` | Implementada y probada |
| Reserva de mesa | clic | calendario emergente, hora, huéspedes | isla `ReserveBar` (`client:visible`), Esc/clic fuera, `mailto:` | Implementada y probada |
| Suscripción | envío | Framer Forms | `NewsletterForm.astro` → `mailto:` + confirmación | Implementada (destino adaptado) |
| Pie que se descubre | scroll | sticky bajo el contenido, sol que sube tras el logotipo | interior retrasado respecto al scroll (`transform`, factor 0,6) + `--rise` del sol ligado al scroll; logotipo ajustado al ancho (`[data-fit-text]`) | Implementada con ajuste (ver diferencias) |
| `prefers-reduced-motion` | — | — | animaciones y transiciones a 0, revelados visibles, sin parallax ni blur, notas sin rotación | Implementada y probada |
| Smooth scroll | — | no hay (`window.lenis` indefinido) | — | No aplica (sin `lenis`) |
| Badge "Made in Framer" / "Edit Content" | — | propios de la plataforma | — | Fuera de alcance |

## Diferencias conocidas

- **Textos y marca:** todo el copy es propio en español (modo A), con la estructura y longitudes de la fuente; los titulares en castellano son más largos y algunos ocupan una línea más (manifiesto, casa termal, títulos de suite).
- **Fotos:** se usan las imágenes de demostración de la plantilla de Framer como marcadores de posición (precedente: selvra, hotellia). `cliente:check` avisa si un cliente las conserva.
- **Logotipos de prensa:** la fuente carga Instrument Serif, Tenor Sans, Marcellus y Syne solo para cinco logotipos; se imitan con variantes de Fraunces y Hanken Grotesk para no cargar cuatro fuentes más.
- **Carril de experiencias:** en la fuente las tarjetas 5 y 6 son más grandes y están desplazadas; aquí las seis tienen el mismo tamaño.
- **Mapa de "Lo bastante lejos":** en la fuente el panel está vacío en las capturas (componente no renderizado); se dibuja un mapa esquemático SVG que enlaza a la ruta en Google Maps.
- **Fechas:** la fuente muestra fechas fijas de demostración (marzo de 2027); los planificadores usan fechas reales (hoy + `SUN.defaultLeadDays`) y no permiten elegir días pasados. No hay fechas completas por defecto (`PLAN.bookedDates`).
- **Formularios:** la fuente envía a Framer Forms; al ser estático, se abre el correo del visitante hacia `contact.email` con el mensaje listo.
- **Filtro "Suites":** en la fuente no se pudo verificar qué tipos incluye; se clasifica cada estancia con `kind` (suite/casa/villa).
- **Pie:** en la fuente es `sticky` detrás del contenido y se descubre de abajo arriba. Así, el contenido tapa el formulario de suscripción hasta el final del scroll y la QA (hover de cada botón visible) no podía alcanzarlo; aquí el pie está en el flujo y su interior se retrasa un 60 % respecto al scroll, con un efecto parecido y controles siempre accesibles.
- **Mobile del arco de la portada:** en la fuente el arco queda fijo detrás de las tarjetas; aquí se muestra encima de ellas y el sol avanza igual con el scroll.
- **Duraciones y curvas** marcadas como "no verificado" en la tabla son estimaciones a partir de capturas, no medidas de los keyframes de Framer.

## Verificación

| Comando | Resultado |
| :-- | :-- |
| `pnpm verify` | Verde: aislamiento ✔, Biome sin errores (326 archivos), `astro check` 0 errores en los 7 sitios (lunevar: 54 archivos), build de los 7 sitios (lunevar: 21 páginas) |
| `pnpm cliente:qa lunevar` | 41 superadas, 1 omitida (endpoints SEO, que solo corre en desktop y pasó): 20 rutas × desktop 1440 y mobile 390, sin errores de consola, recursos rotos ni desbordamiento horizontal, un `<h1>` por página, canonical/OG con el dominio del sitio |
| `pnpm plantilla:probe lunevar` | Verde: 22 restos, todos en `site.ts`, `content.ts` y `theme.css` |
| Pruebas de interacción con Playwright (temporales, fuera del repo) | 30/30: menú mobile (Esc y foco), cabecera ocultable, reloj, arcos ligados al scroll, acordeones, rotación de notas, filtros, visor (flechas, Esc, foco), "Añadir a mi día", precios por pareja, calendario emergente, planificador (URL, rango, total, validación) y `prefers-reduced-motion` |

Primera pasada de la QA: fallaban las 20 rutas en desktop porque el pie `sticky` tapaba el botón "Suscribirme"; corregido con el ajuste del pie descrito arriba.

## Supuestos

- Español como idioma de la plantilla (como asterre y selvra) y `es_CO` para el formato de números y fechas; pathnames en inglés conservados de la fuente.
- Marca ficticia "Almara" y personas de ejemplo (Dra. Inés Moreno, Tomás Arenal…) declaradas como `marcas`/`placeholders` en `plantilla.json`.
- Moneda con símbolo `$` y separador de miles del locale; importes de ejemplo iguales a los de la fuente.
- Las cartas del diario se reescribieron como textos cortos de ejemplo (no se copió el contenido de la fuente).
