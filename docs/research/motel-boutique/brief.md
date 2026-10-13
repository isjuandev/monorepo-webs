# Brief — motel-boutique (plantilla basada en la estructura de lasuitemotel.com)

Fuente: https://www.lasuitemotel.com/ (Squarespace, una sola página con anclas).

## Ruta
| Fuente | Local |
|---|---|
| `/` | `sites/motel-boutique/src/pages/index.astro` |
| `/nuestras-suites`, `/restaurante-lasuite`, `/new-page-3` | Fuera de alcance (secciones ancla `#suites`, `#servicios`, `#contacto`) |

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
- Sin fotos ni video de hero, sin mapa de Google ni galería.
- Sin comparación píxel a píxel contra la fuente (no hay snapshots de referencia).
