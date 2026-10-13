# Brief — motel-boutique (plantilla basada en la estructura de lasuitemotel.com)

Fuente: https://www.lasuitemotel.com/ (Squarespace, una sola página con anclas).

## Ruta
| Fuente | Local |
|---|---|
| `/` | `sites/motel-boutique/src/pages/index.astro` |
| `/nuestras-suites` | `src/pages/nuestras-suites.astro` (detalle por suite, tarifas, política de estadía) |
| `/restaurante-lasuite` | `src/pages/restaurante.astro` (carta: desayunos, platos fuertes, bebidas) |
| `/new-page-3` (contacto + galería) | `src/pages/contacto.astro` |

Los slugs locales se simplificaron (`/restaurante`, `/contacto`) porque los de origen no son descriptivos.

## Secciones (orden)
1. Header fijo: logo, nav (Inicio, Suites, Servicios, Contacto), redes. Menú móvil = isla Preact.
2. Hero a pantalla completa con chevron y tarjeta blanca de promoción (abajo a la derecha).
3. "Las suites": 4 columnas (2 en tablet, 1 en móvil) con precio, hora y persona adicional, botón.
4. Tarjeta blanca de presentación + marquesina de texto.
5. "Servicios especiales": 3 columnas.
6. Contacto + footer.

## Estilo
Fondo negro, texto blanco, acento rojo `#e8554e`, botones con borde blanco. Títulos en Futura (pila de sistema), cuerpo Proxima Nova (pila de sistema).

## Decisiones
- Es una **plantilla**: textos, precios, teléfonos y dirección son marcadores de posición; imágenes son degradados CSS. No se copiaron textos, fotos ni datos del negocio original.
- Fuentes de Typekit no incluidas (licencia); se usa fallback de sistema.
- Dominio: `hoteles-template.nexobite.com`.

## Diferencias conocidas
- Sin fotos ni video de hero, sin mapa de Google ni galería (en `/contacto` solo van los datos de contacto).
- Sin comparación píxel a píxel contra la fuente (no hay snapshots de referencia).

## Animaciones (observadas en el original y su equivalente local)
| Original | Disparador | Local |
|---|---|---|
| Fundido de cada sección al cargar, 0.48 s ease-out | carga | `main` con `page-fade` 0.48 s ease-out |
| Entrada de imágenes y botones (`data-animation-role`) | scroll | `data-reveal` + `src/scripts/reveal.ts` (IntersectionObserver, fundido + 18 px, escalonado) |
| Botones: color/fondo 0.1 s linear | hover | igual en `.ui-btn` |
| Overlay del menú móvil: fundido 0.525 s linear | clic | `MobileMenu.tsx` |
| Cabecera estática (no fija) | n/a | `position: relative` |
| Hero con contenedor parallax | scroll | fondo `fixed` (parallax simple; sin imagen real aún) |
| Marquesina movida por JS | tiempo | CSS `translateX` continuo (velocidad aproximada) |
| Galería "View fullsize" | clic | `Gallery.tsx`: visor con Esc, flechas y foco devuelto |

Todas respetan `prefers-reduced-motion`.

### No verificado
- Velocidad exacta de la marquesina y factor real del parallax (la medición en el panel no fue concluyente).
- Fondo de video/imagen del hero y bloque de video/mapa: no incluidos.
