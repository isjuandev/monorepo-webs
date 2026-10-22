# Personalizar este sitio (lunevar)

Retiro boutique en el desierto con casa de longevidad, en español (adaptado de la fuente en inglés, clon de `extraordinary-wombat-796551.framer.app`). Todo lo específico de un cliente vive en **4 puntos**: los componentes y páginas no contienen marca, textos ni contactos, así que no hace falta editarlos para entregar un sitio.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), `name`, `logoText` (cabecera), `wordmark` (logotipo gigante del pie), `legalName` (copyright), título/descripción SEO, `locale`, correo, teléfono, WhatsApp y su horario, correo de prensa, dirección y destino de Google Maps, Instagram, `currencySymbol`, `themeColor`, `preloadFonts`, menú (`MENU_LINKS`, con la "hora" de cada enlace en el menú mobile) y columnas del pie (`FOOTER_COLUMNS`) |
| 2 | Marca visual | `src/styles/theme.css` | colores (`--color-*`: arena, cobre, tierra y noche), tipografías (`--font-display`, `--font-sans` y sus `@font-face`), `--max-width`, `--gutter`, radios, sombras y curva de movimiento |
| 3 | Textos y datos | `src/data/content.ts` | horario solar (`SUN`), suites (`SUITES`), rituales del día (`RITUALS`), experiencias (`EXPERIENCES`), circuito termal, programas y lo que incluyen (`PROGRAMS`, `PROGRAM_FEATURES`), notas de huéspedes, prensa, portada (`HOME`), páginas (`SUITES_PAGE`, `SUITE_DETAIL`, `DAY_PAGE`, `LONGEVITY`, `DINING`, `JOURNAL`, `PLAN`), cartas del diario (`ARTICLES`), pie (`FOOTER`), 404 (`NOT_FOUND`), alt de imágenes y etiquetas de interfaz (`UI_LABELS`, `PLANNER_LABELS`) |
| 4 | Activos | `public/` | fotos (`images/`), `og-image.jpg`, `favicon.svg` y fuentes `.woff2` |

## Flujo recomendado

1. `pnpm cliente:nuevo <slug> --from lunevar --name "..." --domain "..."`
2. Edita los 4 puntos en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`.
3. `pnpm cliente:check <slug> --strict` y corrige todo lo que reporte.
4. `pnpm verify` y `pnpm cliente:qa <slug>`.

## Detalles por punto

### 1. `src/config/site.ts`
- `CLIENT_DOMAIN` debe coincidir con `SITE_URL` en Coolify.
- `contact.email` recibe las solicitudes del planificador, las reservas de mesa y las suscripciones (el sitio es estático: se abre el correo del visitante con el mensaje listo).
- `contact.whatsapp` va solo con dígitos y código de país (`573001234567`).
- `currencySymbol` antecede a todos los precios; el separador de miles sale de `locale`.
- Si añades o quitas páginas, ajusta `MENU_LINKS` y `FOOTER_COLUMNS`.

### 2. `src/styles/theme.css`
- Cambia primero `--color-accent` (cobre: acentos, botones, el sol), `--color-glow` (acento sobre fondos oscuros), `--color-bg`/`--color-sand`/`--color-sand-deep` (arenas de las secciones claras) y `--color-primary`/`--color-night`/`--color-plum` (tierra y noche).
- Los degradados "del día a la noche" (portada, "Un día aquí", gastronomía) usan colores intermedios en el `<style>` de cada sección; si cambias mucho la paleta, revísalos.
- Fraunces y Hanken Grotesk son variables (OFL, Google Fonts). Si cambias de fuente: añade los `.woff2` a `public/fonts/`, actualiza los `@font-face`, las variables `--font-*` y `preloadFonts` en `site.ts`.

### 3. `src/data/content.ts`
- **`SUN`**: amanecer, mediodía solar, atardecer, salida de la luna y estrellas visibles. Alimenta el reloj de la cabecera, el dial del hero, los arcos que se mueven con el scroll, la cinta de la portada y el "Amanecer de mañana" del pie. `defaultLeadDays` es la antelación de la llegada sugerida en los planificadores.
- **`SUITES`** genera `/suites/<slug>`, las tarjetas, la tabla comparativa y las casas del planificador (`PLAN.houses`). `kind` (`suite`, `house`, `villa`) alimenta el filtro de `/suites`; `related` son tres slugs existentes (el build falla con un mensaje claro si no).
- **`RITUALS`**: los que caen entre el amanecer y el atardecer aparecen en el arco de la portada; todos forman la línea de "Un día aquí" (los posteriores al atardecer se pintan en tono noche).
- **`EXPERIENCES`**: carril arrastrable de la portada y rejilla filtrable de "Un día aquí" (`phase`: `dawn`, `day`, `dusk`, `night`).
- **`PROGRAMS`**: acordeón de la portada, tarjetas de precios (`pricePerson`/`pricePerCouple`) y opciones del planificador. `includes` tiene un valor por cada `PROGRAM_FEATURES`.
- **`ARTICLES`**: cada carta genera `/journal/<slug>`; `author` es el índice en `LONGEVITY.team`. `JOURNAL_FEATURED` elige la destacada.
- **`PLAN.bookedDates`**: fechas completas (`AAAA-MM-DD`) que se muestran atenuadas en los calendarios; por defecto no hay ninguna. Las lunas llenas se calculan solas.
- Precios, horarios, temperaturas, cifras, FAQ, nombres de personas y textos son de ejemplo: reemplázalos por datos reales del cliente.

### 4. `public/`
Reemplaza el archivo conservando nombre y proporción para no tocar rutas.

| Archivo | Uso | Tamaño sugerido |
| :-- | :-- | :-- |
| `images/hero/home.webp` | hero de la portada | 2400 × 1340, horizontal (sujeto a la derecha) |
| `images/hero/suites.webp` | cabecera de `/suites` | 2400 × 1600 |
| `images/hero/dining.webp` | cabecera de `/dining` | 1600 × 1070 o mayor |
| `images/hero/longevity.webp` | arco de `/longevity` | 900 × 1200, vertical |
| `images/suites/suite-1…6.webp` | tarjetas en arco, detalle y planificador | 1200 × 1600, vertical |
| `images/suites/stone-detail.webp` · `images/places/*.webp` | galerías, insertos redondos, piscina termal, cielo nocturno | 1600–2400 de ancho, horizontal |
| `images/rituals/*.webp` | rituales del día, programas y noche | 1000–1600 de ancho |
| `images/experiences/experience-*.webp` | experiencias | 900 × 1200 (1–3) y 1600 × 1200 (5–6) |
| `images/people/team-*.webp` · `chef.webp` · `guest-*.webp` | equipo (vertical 900 × 1200), chef (600 × 760) y huéspedes (160 × 160) | — |
| `images/journal/moonrise.webp` | carta destacada | 2000 × 1500 |
| `images/og-image.jpg` | imagen al compartir | 1200 × 630 |
| `favicon.svg` | icono | 64 × 64 (SVG) |

> Las fotos actuales son las imágenes de demostración del sitio de origen y sirven solo como ejemplo: cámbialas todas antes de publicar un cliente (`cliente:check` avisa de las idénticas).

## Páginas y secciones opcionales
- Cada sección de la portada es un componente de `src/pages/index.astro` (`Manifesto`, `SunPath`, `SuitesPreview`, `SunTicker`, `ThermalHouse`, `Programs`, `LandCarousel`, `Supper`, `AfterDark`, `GuestNotes`, `PlanTeaser`) y puede quitarse sin afectar al resto.
- `/longevity` es opcional para un retiro sin programas: borra `src/pages/longevity.astro`, quita su enlace de `MENU_LINKS`/`FOOTER_COLUMNS`, las secciones `Programs` de la portada y deja `PROGRAMS` vacío (el planificador ofrecerá solo "Solo descansar").
- `/journal` es opcional: borra `src/pages/journal/` y su enlace del menú y del pie.
- `/dining` es opcional: borra `src/pages/dining.astro`, su enlace y la sección `Supper` de la portada (o cambia su botón).

## Checklist de entrega
- [ ] `pnpm cliente:check <slug> --strict` sin hallazgos
- [ ] Sin textos, fotos, personas, precios ni contactos de la plantilla en el sitio publicado
- [ ] `SUN` con el horario solar real del lugar (o aproximado por estación) y `PLAN.bookedDates` revisado
- [ ] `contact.email` es el buzón real que recibe solicitudes, reservas de mesa y suscripciones
- [ ] `pnpm verify` y `pnpm cliente:qa <slug>` en verde
