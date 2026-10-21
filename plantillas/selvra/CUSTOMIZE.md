# Personalizar este sitio (selvra)

Retiro/alojamiento boutique con varias estancias y experiencias, en inglés (clon de `selvra-retreat.framer.website`). Todo lo específico de un cliente vive en **4 puntos**: los componentes y páginas no contienen marca, textos ni contactos, así que no hace falta editarlos para entregar un sitio.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), `name`, `logoText` (logotipo de la cabecera), `footerTagline`, título/descripción SEO, `locale`, teléfono, correo y dirección (JSON-LD y botón "Send by email" de la consulta), `themeColor`, `preloadFonts`, menú (`MENU_LINKS`) y enlaces del pie (`FOOTER_LINKS`) |
| 2 | Marca visual | `src/styles/theme.css` | colores (`--color-*`), tipografías (`--font-display`, `--font-sans`, `--font-ui` y sus `@font-face`), `--max-width`, `--gutter`, radios, sombras y curva de movimiento |
| 3 | Textos y datos | `src/data/content.ts` | estancias (`STAYS`), experiencias (`EXPERIENCES`), portada (`HOME`: hero, materiales, selector, momentos, FAQ, CTA), páginas (`PAGES`), textos del detalle (`DETAIL`), pie (`FOOTER`), 404 (`NOT_FOUND`), alt de imágenes y etiquetas de interfaz y del formulario (`UI_LABELS`) |
| 4 | Activos | `public/` | fotos, máscara del hero, `og-image.jpg`, favicons y fuentes `.woff2` |

## Flujo recomendado

1. `pnpm cliente:nuevo <slug> --from selvra --name "..." --domain "..."`
2. Edita los 4 puntos en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`.
3. `pnpm cliente:check <slug> --strict` y corrige todo lo que reporte.
4. `pnpm verify` y `pnpm cliente:qa <slug>`.

## Detalles por punto

### 1. `src/config/site.ts`
- `CLIENT_DOMAIN` debe coincidir con `SITE_URL` en Coolify.
- `logoText` es el logotipo de texto de la cabecera; el logotipo gigante del hero es `HOME.hero.wordmark` en `content.ts` (puede ser el mismo texto).
- `contact.email` es el destino del botón "Send by email" del borrador de consulta; si lo dejas vacío, el botón desaparece y solo queda "Copy text".
- Si añades o quitas páginas, ajusta `MENU_LINKS` y `FOOTER_LINKS`.

### 2. `src/styles/theme.css`
- Cambia primero `--color-primary` (verde casi negro: pie, botones, tarjetas activas), `--color-bg`/`--color-surface` (crema), `--color-panel` (bloque "At a glance") y `--color-accent` (bordes de los campos y foco).
- Si cambias fuentes: añade los `.woff2` a `public/fonts/`, actualiza los `@font-face`, las variables `--font-*` y `preloadFonts` en `site.ts`. Bespoke Serif se distribuye con la ITF Free Font License (Fontshare); Manrope e Inter con OFL.

### 3. `src/data/content.ts`
- **Estancias y experiencias** generan sus páginas (`/stays/<slug>`, `/experiences/<slug>`) y las opciones del formulario de consulta. El `slug` es también el valor de `?interest=` que preselecciona la opción desde el botón "Create an enquiry draft".
- Cada estancia recomienda una experiencia (`relatedExperience`) y cada experiencia una estancia (`relatedStay`); deben ser slugs existentes o el build falla con un mensaje claro.
- `HOME.materials` son los tres pasos de la escena fija ("Stone. Wood. Open space."): la foto de cada paso entra en fundido al llegar su texto. Funciona con 2 o más pasos.
- `HOME.moments.featured` es la experiencia de la tarjeta oscura grande; `others`, las dos tarjetas de debajo.
- `PAGES.demo` (`/demo`) y `PAGES.privacy` (`/privacy`) son páginas de texto de ejemplo: reescríbelas con la información real del negocio (o elimina `/demo`, ver abajo).
- Precios, horarios, FAQ y textos son de ejemplo: reemplázalos por datos reales del cliente.

### 4. `public/`
Reemplaza el archivo conservando nombre y proporción para no tocar rutas.

| Archivo | Uso | Tamaño sugerido |
| :-- | :-- | :-- |
| `images/hero-evening.webp` / `images/hero-day.webp` | fondo del hero (tarde por defecto / día) | 1672 × 941, mismo encuadre exacto en las dos |
| `images/hero-mask.svg` | silueta en blanco del primer plano (pabellón) que tapa el logotipo gigante | mismo tamaño y encuadre que las fotos del hero; polígono blanco sobre transparente |
| `images/material-stone.webp` | escena de materiales, galería de experiencias, detalle de "The place" | 1086 × 1448, vertical |
| `images/place-hero.webp` | foto ancha de "The place" | 1672 × 941 |
| `images/stays/stay-1…3.webp` | estancias (tarjetas, selector, detalle) | 1448 × 1086 |
| `images/experiences/experience-1…3.webp` | experiencias (tarjetas, destacada, detalle) | 1448 × 1086 |
| `images/og-image.jpg` | imagen al compartir | 1200 × 630 |
| `favicon.png` / `favicon-dark.png` / `apple-touch-icon.png` | iconos (modo claro/oscuro, iOS) | 64 × 64 / 64 × 64 / 180 × 180 |

> Las fotos actuales son las imágenes de demostración del sitio de origen y sirven solo como ejemplo: cámbialas todas antes de publicar un cliente.

**Máscara del hero:** si el cliente no tiene una foto con un primer plano claro, usa un SVG vacío (`<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941"/>`): el logotipo quedará delante de toda la foto.

## Páginas y secciones opcionales
- `/demo` ("About & legal") es opcional: borra `src/pages/demo.astro`, quita su enlace de `FOOTER_LINKS` y cambia `FOOTER.aboutLink`.
- En la portada, cada sección es un componente de `src/pages/index.astro` (`MaterialScene`, `StayChooser`, `Moments`, `FaqList`, `CtaStrip`) que puede quitarse sin afectar al resto.
- Con más o menos de 3 estancias/experiencias, los listados se adaptan (rejilla de 3/2/1 columnas); revisa que `HOME.moments` apunte a slugs existentes.

## Checklist de entrega
- [ ] `pnpm cliente:check <slug> --strict` sin hallazgos
- [ ] Sin textos, fotos, FAQ ni contactos de la plantilla en el sitio publicado
- [ ] Máscara del hero alineada con las fotos de día y tarde en desktop y mobile
- [ ] Opciones del formulario coinciden con las estancias/experiencias reales y `contact.email` es el buzón real
- [ ] `/privacy` y `/demo` reescritas (o eliminadas) con la información legal real
- [ ] `pnpm verify` y `pnpm cliente:qa <slug>` en verde
