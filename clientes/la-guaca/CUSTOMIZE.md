# Personalizar este sitio (la-guaca)

Sitio de La Guaca Motel, generado desde la plantilla `asterre` y adaptado a motel (tono `motel-copywriting` K1 + K2). Fuente de datos: `recursos/la-guaca/brief.md`. Guía de voz: `docs/research/la-guaca/guia-de-voz.md`.

| # | Qué cambia | Archivo | Qué contiene |
| :-- | :-- | :-- | :-- |
| 1 | Identidad y contacto | `src/config/site.ts` | dominio (`CLIENT_DOMAIN`), número de WhatsApp (`WHATSAPP_NUMBER`), nombre, SEO, `locale`, mapa, teléfono, correo, dirección, redes, `themeColor`, fuentes precargadas, menú (`NAV_LINKS`) y enlaces legales |
| 2 | Marca visual | `src/styles/theme.css` | negro, rojo y dorado del logo (`--color-*`), tipografías (`@font-face`) y medidas |
| 3 | Textos y datos | `src/data/content.ts` | `ROOMS` (tarifa, horas, persona/hora adicional, características propias, fotos), `COMMON_AMENITIES`, `INCLUDED`, `EXPERIENCES`, `STAY_INFO`, `PAGES` (incluida la FAQ), `UI_LABELS` y `WHATSAPP_MESSAGES` |
| 4 | Activos | `public/` | fotos `.webp` en `public/images`, `logo.webp`, `logo-mark.webp`, `og-image.jpg`, `favicon.png`, `apple-touch-icon.png` y fuentes `.woff2` |

## Rutas

`/`, `/habitaciones`, `/habitaciones/<slug>` (una por entrada de `ROOMS`), `/experiencias`, `/contacto`, `/politica-de-privacidad`, `/terminos-de-uso` y la 404.

## Notas

- **WhatsApp:** todos los CTA usan `whatsappUrl(mensaje)` de `content.ts`, que arma un enlace `wa.me` con `buildWhatsAppUrl`. Los mensajes viven en `WHATSAPP_MESSAGES`. El formulario de contacto abre WhatsApp con el mensaje ya redactado.
- **Fotos de habitación:** `image` es la portada (tarjetas, carrusel y primera foto de la galería) y `gallery` las demás, en orden. Están pensadas en retrato (3:4 o 9:16): en móvil la galería se desliza y en escritorio es un mosaico con la portada en 2x2. La segunda y la tercera foto se repiten en la sección de detalles. Nombres: `public/images/<slug>-NN.webp`.
- **Regenerar activos:** se optimizan desde `recursos/la-guaca/` a WebP (lado largo ≤ 2400 px en hero y 1440 px en habitaciones).
- **Textos legales:** son una base genérica y debe revisarlos el asesor legal del cliente.

## Checklist de entrega

- [ ] `pnpm cliente:check la-guaca --strict` sin hallazgos (requiere el dominio definitivo; ver abajo)
- [ ] Textos legales revisados por el cliente
- [ ] `pnpm verify` y Visual QA en verde

> `CLIENT_DOMAIN` es hoy `la-guaca.nexobite.com`, como pide el brief. `cliente:check` trata `nexobite.com` como dominio de ejemplo, así que la verificación estricta falla hasta tener el dominio propio del cliente.
