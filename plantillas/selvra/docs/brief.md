# Brief de inspección — plantilla-selvra

- **Fuente:** https://selvra-retreat.framer.website (Framer, sin Lenis ni smooth scroll; `html` sin clases).
- **Modo de contenido:** A — Plantilla. Marca ficticia **Arvenna Retreat** (`ARVENNA`), textos reescritos, contactos de ejemplo. Fotos: las imágenes de demostración de la fuente (generadas, de una plantilla ficticia) como marcadores de posición, igual que en `plantilla-pinevalley`/`plantilla-hotellia`; deben sustituirse en cada cliente.
- **Dominio:** `plantilla-selvra.example.com` · **Idioma:** inglés (`en_US`), el principal. Las 12 variantes `/de/*` se excluyen.
- **Capturas:** `docs/design-references/plantilla-selvra/source/` (fuente, 1440×900 y 390×844, top/full + estados) y `local/` (clon).

## Rutas

Ver `routes.json`. Las 13 rutas se clonan; ninguna se excluye. `/demo` y `/privacy` se conservan como páginas de texto genéricas (about/legal) porque un cliente real necesita ambas; `/demo` queda documentada como opcional en `CUSTOMIZE.md`.

## Sistema visual (medido)

| Token | Valor |
| :-- | :-- |
| Fondo / superficie | `#f4f0e8` |
| Texto / primario | `#202923` |
| Acento (bordes de campos, foco) | `#7d8b74` |
| Panel "At a glance" | `#c8bead` |
| Degradado del hero | `rgba(13,22,17,0) → rgba(13,22,17,.78)` desde y=252 |
| Display | Bespoke Serif 400 (Fontshare) — h1 88/1.12, h2 56/1.12 −0.015em, h3 32/1.15 −0.01em, nombres 32/1.12; mobile h1 46, h2 36 |
| Texto | Manrope 400 — 18/1.5 (cuerpo), 16/1.4, 14/1.4 (rótulos) |
| Formulario | Inter 400 16/1.5 |
| Contenedor | 1200 px con 40 px de margen (1120 útiles); mobile 20 px; breakpoints Framer 810/1200 |
| Radios | 8 px tarjetas/imágenes, 6 px botones/campos |
| Sombras | botón `0 3px 14px rgba(20,30,23,.14)`; tarjeta `0 2px 18px rgba(20,30,23,.07)` → hover `0 3px 22px …/.1`; nav `0 4px 10px -3px …/.18, 0 24px 64px -16px …/.28` |

## Secciones por página

- **Home:** nav flotante absoluta (top 20, inset 40, alto 76, blur 16, máx. 1600 px) · hero 720 px (mobile 680) con paisaje + logotipo gigante + recorte del pabellón con máscara SVG de luminancia, título 64 px, botón secundario y conmutador Day/Evening · escena "Stone. Wood. Open space." (escenario 672×630 sticky top 96 + 3 textos a la derecha) · "Three ways to settle in." (selector de 3 estancias + foto 669×500 + texto + botón) · "A day with room in it." (experiencia destacada oscura 1116×540 + 2 tarjetas) · FAQ (4 preguntas, acordeón) · CTA con línea superior · pie oscuro.
- **Stays / Experiences:** rótulo + h1 + entradilla · rejilla de 3 tarjetas (imagen 360 / 240 px).
- **Detalle (6 rutas):** volver · h1 · rótulo · resumen · foto 1440×620 · 2 bloques h2+p + panel "At a glance" con botón a `/enquire?interest=<slug>` · galería 2×(548×430) · recomendación cruzada (estancia → experiencia y viceversa).
- **Place:** intro · foto 1440×600 · historia (2 col. con foto 520×640) · "The journey…" (2 col. con botón).
- **Enquire:** aviso con borde · formulario (elección, llegada, salida, huéspedes, nombre, correo, mensaje) · borrador local con copiar.
- **Demo / Privacy:** intro + bloques h3 + párrafo de 800 px.

## Enlaces y formularios

- Internos: todos reescritos a rutas locales (`/stays/<slug>`, `/experiences/<slug>`, `/enquire?interest=<slug>`).
- Externos de la fuente fuera de alcance: selector de idioma (variantes `/de`) y badge "Made in Framer" → no se reproducen.
- Formulario: la fuente no envía nada (borrador local + copiar). Se replica igual y se añade "Send by email" (`mailto:` a `siteConfig.contact.email`).

## Activos

| Origen (framerusercontent.com/images/…) | Local (`public/`) | Tipo y tamaño |
| :-- | :-- | :-- |
| `RsupW31UdNGj5mlrUUMMLnkuU9A.jpg` | `images/hero-evening.webp` | JPEG 1672×941 → WebP |
| `uJcjNgPsf4s0rXlrT5xhzyZ2RI.jpg` | `images/hero-day.webp` | JPEG 1672×941 → WebP |
| `qfZRWPNwsbZIRdMS9BTxYRi7pU.svg` | `images/hero-mask.svg` | SVG 1672×941 (polígono blanco) |
| `Gz2x4sL0jcCwUWZCLgmnnHwbx4.jpg` | `images/material-stone.webp` | JPEG 1086×1448 → WebP |
| `UttpFKfJUuAUk1hmWwLxYkNxKM.jpg` | `images/place-hero.webp` | JPEG 1672×941 → WebP |
| `PlSLX3glioak9n9OObgvMbOwCI.jpg` / `JAr7uZksB1ew8Y04yZ0YsIfLo.jpg` / `60eV8CPWVLCW6S882KyyBwq4PvU.jpg` | `images/stays/stay-1…3.webp` | JPEG 1448×1086 → WebP |
| `dZLbI7YTyJg2s1CRpFlJVBpLE.jpg` / `INbltZj2u06njsVpJmdaOv9AU.jpg` / `UF27pRZxUeLQvpHWFm7w9oUyGPc.jpg` | `images/experiences/experience-1…3.webp` | JPEG 1448×1086 → WebP |
| `assets/sM6UpDTqNmQzNnzOul16Djvlsw.jpg` | `images/og-image.jpg` | JPEG 1200×630 |
| `ARekEdz….jpg` / `aAT25Dp….jpg` / `7pyCQVu….jpg` | `favicon.png` / `favicon-dark.png` / `apple-touch-icon.png` | 64×64 / 64×64 / 180×180 |
| Fontshare/Framer woff2 | `fonts/bespoke-serif-400.woff2`, `fonts/manrope-400.woff2`, `fonts/inter-400.woff2` | WOFF2 |

## SEO

Cada página: `title` ("Página — ARVENNA"), `description` propia, canonical y OG vía `<SEO />` con `siteConfig`, `og:image` (detalles usan su foto), JSON-LD `LodgingBusiness` en el layout, `robots.txt`, `sitemap-index.xml` y `404` con `noindex`.

## Animaciones e interacciones

Ver la tabla de `agent-summary.md`.
