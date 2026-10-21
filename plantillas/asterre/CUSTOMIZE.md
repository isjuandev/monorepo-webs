# Personalizar este sitio (asterre)

Todo lo específico de un cliente vive en **4 puntos**. Los componentes y páginas solo componen datos: no hace falta editarlos para entregar un sitio.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), nombre, SEO, `locale`, año de fundación, enlaces de reservas y mapas, teléfono, correo, dirección, redes, valoración, `themeColor`, fuentes precargadas, menú (`NAV_LINKS`) y enlaces legales |
| 2 | Marca visual | `src/styles/theme.css` | colores, tipografías (`@font-face`), anchos y espaciados |
| 3 | Textos y datos | `src/data/content.ts` | `PAGES` (copys de cada página), `UI_LABELS` (botones, menús, formularios, accesibilidad), `ROOMS`, `EXPERIENCES`, `PRIVATE_EXPERIENCES`, `PLACES`, `STAY_INFO`, `INCLUDED`, `DISTANCES`, `WHATSAPP_MESSAGES`, FAQ de contacto (`PAGES.contact.faq`) y mapa de imágenes `IMAGES` |
| 4 | Activos | `public/` | fotos `.webp`, `favicon.svg`, mapa `retreat-map.svg` y fuentes `.woff2` |

## Flujo recomendado

1. `pnpm cliente:nuevo <slug> --from asterre --name "..." --domain "..."`
2. Edita los 4 puntos en este orden: `site.ts` → `theme.css` → `content.ts` → `public/`.
3. `pnpm cliente:check <slug>` y corrige todo lo que reporte.
4. `pnpm verify` y `pnpm cliente:qa <slug>`.

## Detalles por punto

### 1. `src/config/site.ts`
- `bookingUrl` y `mapsUrl` alimentan todos los botones "Ver disponibilidad" y "Abrir en mapas". `wazeUrl` (opcional) añade el botón "Ir con Waze" en contacto.
- `contact.whatsapp` (con código de país, solo dígitos) activa el botón flotante de WhatsApp, que aparece al pasar la primera sección. Su mensaje está en `WHATSAPP_MESSAGES` (`content.ts`). Sin número, el botón lleva a `bookingUrl`.
- Si el cliente no tiene valoraciones, elimina `rating`: se ocultan las insignias.
- `CLIENT_DOMAIN` debe coincidir con `SITE_URL` en Coolify.

### 2. `src/styles/theme.css`
- Cambia primero `--color-*` y `--font-*`. Si cambias fuentes, añade los `.woff2` a `public/fonts/`, actualiza `@font-face` y `preloadFonts`.

### 3. `src/data/content.ts`
- `ROOMS` genera `/rooms/<slug>` automáticamente: una entrada por habitación, con su galería de 5 fotos (`room-<clave>`, `-wide`, `-tall`, `-detail`, `-inset`).
- Al cambiar de idioma, traduce `UI_LABELS`, `PAGES`, `NAV_LINKS`/`LEGAL_LINKS` y ajusta `locale` en `site.ts` (el atributo `lang` se deriva de él).
- Los textos legales (`PAGES.privacy`, `PAGES.terms`) son de ejemplo: deben revisarlos los asesores legales del cliente.

### 4. `public/`
Reemplaza cada imagen conservando nombre y proporción. Los nombres y usos están en `IMAGES` (`src/data/content.ts`); formato `.webp`, lado largo ≥ 1600 px (hero ≥ 2400 px). La imagen para compartir se define en `ogImage` de `site.ts`.

## Checklist de entrega
- [ ] `pnpm cliente:check <slug> --strict` sin hallazgos
- [ ] Sin fotos, textos ni contactos de la plantilla en el sitio publicado
- [ ] Textos legales revisados por el cliente
- [ ] `pnpm verify` y Visual QA en verde
