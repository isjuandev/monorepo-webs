# Resumen del agente — plantilla-selvra

Clon de https://selvra-retreat.framer.website en `sites/plantilla-selvra/` (skill clone-website, modo A — Plantilla). Marca ficticia **Arvenna Retreat**, inglés, dominio `plantilla-selvra.example.com`. Previsualizar: `pnpm --filter @sites/plantilla-selvra dev`.

## Rutas (origen → local)

| Origen | Local | Archivo |
| :-- | :-- | :-- |
| `/` | `/` | `src/pages/index.astro` |
| `/stays` | `/stays` | `src/pages/stays/index.astro` |
| `/stays/stone-suite` · `/forest-house` · `/courtyard-loft` | igual | `src/pages/stays/[slug].astro` (desde `STAYS`) |
| `/experiences` | `/experiences` | `src/pages/experiences/index.astro` |
| `/experiences/morning-trail` · `/clay-stillness` · `/fire-supper` | igual | `src/pages/experiences/[slug].astro` (desde `EXPERIENCES`) |
| `/place` | `/place` | `src/pages/place.astro` |
| `/enquire` | `/enquire` (+ `?interest=<slug>`) | `src/pages/enquire.astro` + isla `EnquiryDraft.tsx` |
| `/demo` | `/demo` | `src/pages/demo.astro` (página "About this website", opcional) |
| `/privacy` | `/privacy` | `src/pages/privacy.astro` |
| — | `/404` | `src/pages/404.astro` |

Se clonaron las 13 rutas; ninguna se excluyó. `/demo` y `/privacy` son textos de plantilla en la fuente, pero se conservan como páginas genéricas "About" y "Privacy" (con texto de ejemplo propio) porque un cliente real necesita ambas; `/demo` está marcada como opcional en `CUSTOMIZE.md`. Variantes `/de/*` (12) excluidas por instrucción.

## Animaciones e interacciones

| Elemento | Disparador | Fuente (medido) | Implementación | Estado |
| :-- | :-- | :-- | :-- | :-- |
| Hero: paisaje y recorte | carga | escala ~1,03 a 300 ms → 1 a ~1,2 s, y +15 px → 0 | `settle-in` 1,1 s `cubic-bezier(.22,1,.36,1)` (escala 1,06, +30 px) | Implementada (curva aproximada) |
| Hero: logotipo gigante | carga | opacidad 0,69 a 300 ms → 1, +7,5 px → 0 | `rise-in` 1,1 s (opacidad 0, +16 px) | Implementada (curva aproximada) |
| Hero: parallax | scroll | fotos `translateY = +0,1·scrollY`, logotipo `−0,15·scrollY` | `[data-parallax]` en `scripts/motion.ts` (rAF, `translate`) | Implementada, valores exactos |
| Hero: recorte del pabellón | — | máscara SVG de luminancia `cover` sobre la misma foto | `mask: url(hero-mask.svg) center / cover luminance` | Implementada |
| Hero: Day / Evening | clic | cambio instantáneo y simultáneo de la foto en las dos capas (medido fotograma a fotograma: sin fundido); el logotipo nunca queda delante del pabellón | botones `aria-pressed`; foto de día apilada sobre la de tarde y cambio sin transición | Implementada, verificada |
| Logotipo "fit text" | carga/resize | SVG con viewBox que ocupa el ancho | `<text>` + viewBox ajustado con `getBBox()` | Implementada |
| Nav | scroll | `position: absolute` (se va con la página), blur 16 | igual | Implementada |
| Nav: enlaces | hover / página actual | subrayado | subrayado + `aria-current` | Implementada |
| Menú mobile | clic | se despliega dentro de la barra, botón "Close menu", fondo atenuado | panel + scrim, Esc, foco al abrir y devolución al cerrar | Implementada (animación de apertura no verificada) |
| Escena "Stone. Wood. Open space." | scroll | escenario sticky top 96; cada foto entra en fundido mientras su texto cruza ~72 % → ~61 % del viewport (96 px) | `[data-materials]` en `motion.ts`; con movimiento reducido el cambio es instantáneo, como en la fuente | Implementada, valores exactos |
| Selector de estancias | clic | `aria-pressed`, tarjeta activa oscura con "Selected", cambia foto/texto/enlace | isla Preact `StaySelector.tsx` (`client:visible`), fundido 0,5 s | Implementada (duración del fundido no verificada) |
| Tarjetas (estancias, experiencias, destacada) | hover | `translate 0 -3px` 0,4 s `cubic-bezier(.22,1,.36,1)`, foto `scale 1.025` 0,9 s, sombra más profunda | `.surface--card` + `.surface__media` | Implementada, valores exactos (CSS de la fuente) |
| Botones Primary/Secondary | hover / active | sube 2 px, flecha +3 px (0,4 s), active +1 px | `.btn` | Implementada, valores exactos |
| FAQ | clic | `grid-template-rows 0fr→1fr` + opacidad 0,75 s ease-in-out, gap 0→20, icono + → − | `FaqList.astro` con `aria-expanded` | Implementada, valores exactos |
| Formulario de consulta | envío | validación "Please complete this field.", borrador local, "Copy text" | isla `EnquiryDraft.tsx` (`client:load`), validación de fechas/correo, prefijado con `?interest=`, copiar al portapapeles | Implementada + botón "Send by email" añadido |
| Aparición por scroll en páginas interiores | — | no hay (opacidad 1 sin transformaciones al entrar) | — | No aplica |
| Smooth scroll | — | no hay (sin Lenis) | — | No aplica (no se añade `lenis`) |
| Selector de idioma | clic | English/Deutsch | — | Fuera de alcance (un solo idioma) |
| Badge "Made in Framer" | — | enlace a framer.com | — | Fuera de alcance (propio de la plataforma) |
| `prefers-reduced-motion` | — | quita transformaciones y fundidos | animaciones/transiciones a 0, parallax desactivado, materiales con cambio instantáneo | Implementada y probada |

## Diferencias conocidas

- **Marca y textos:** todos los textos son de ejemplo propios (modo A); la estructura, longitudes y jerarquía se conservan.
- **Fotos:** se usan las imágenes de demostración de la fuente como marcadores de posición (precedente: `plantilla-pinevalley`, `plantilla-hotellia`). Deben sustituirse en cada cliente (`customize:check` detecta las idénticas).
- **Logotipo gigante del hero:** "ARVENNA" tiene 7 letras frente a 6 de la fuente, así que al ocupar el mismo ancho queda algo más bajo; en 1920 px queda casi todo tapado por el recorte, igual que en la fuente.
- **Nav:** sin selector de idioma, los enlaces quedan pegados al borde derecho de la barra.
- **Escena de materiales en mobile:** cada paso muestra su foto encima del texto (la fuente intercala el orden en el segundo paso; se replica con `order`, el tercero a sangre).
- **Tablet (810–1199 px):** no se midió la fuente en este rango; se usan tamaños intermedios (h1 64, h2 44, escenario 520 px).
- **Formulario:** se añade "Send by email" (`mailto:` a `siteConfig.contact.email`) para que la plantilla sirva a un cliente real; sin correo configurado, el botón no aparece.
- **Duraciones no verificadas:** fundido del selector de estancias (0,5 s) y apertura del menú mobile (0,35 s) son estimaciones.

## Supuestos

- Se usó inglés por ser el idioma principal de la fuente.
- Bespoke Serif (Fontshare, ITF Free Font License), Manrope e Inter (OFL) se auto-alojan con los mismos archivos de la fuente.
- La foto "Day" del hero (no presente en el HTML inicial) es `uJcjNgPsf4s0rXlrT5xhzyZ2RI.jpg`, confirmada visualmente contra la captura del estado Day.
- Contactos de ejemplo: los placeholders globales de `template-brands.json` (`+57 300 000 0000`, `reservas@example.com`) y "Retreat address"; solo se usan en JSON-LD y en el `mailto:` del formulario.

## Verificación

- `pnpm verify` ✔ (aislamiento, lint, check, build de los 7 sitios).
- `QA_PORT=4510 pnpm qa:site plantilla-selvra` ✔ 27/27 (13 rutas × desktop/mobile + endpoints SEO), sin overflow horizontal. El puerto 4321 estaba ocupado por un `astro preview` de `plantilla-asterre` ajeno a esta sesión.
- `node scripts/template-clone.mjs --probe plantilla-selvra` ✔ (12 restos, todos en `site.ts`, `content.ts`, `theme.css`).
- Prueba temporal de interacciones con Playwright ✔: Day/Evening, parallax, fundido y sticky de materiales, selector, FAQ abrir/cerrar, hover de tarjetas, `?interest=`, validación, orden de fechas, borrador, copiar, menú mobile con Esc y foco, movimiento reducido, sin errores de consola.
- Sin overflow horizontal en 768, 1024 y 1920 px en las 13 rutas.
