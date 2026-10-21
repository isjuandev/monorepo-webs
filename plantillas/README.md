# plantillas/

Catálogo de diseños de la fábrica. Cada cliente nace **copiando** una plantilla (`pnpm cliente:nuevo <slug> --from <plantilla>`, o automáticamente con `pnpm cliente:crear`) y desde ahí evoluciona por su cuenta.

- Marca y datos **ficticios**: nunca datos de un cliente real.
- Cada plantilla trae `plantilla.json` (manifiesto del catálogo), `CUSTOMIZE.md` (cómo personalizarla) y `docs/` (brief de clonado y referencias de la web de origen).
- `_base` es el esqueleto mínimo del que nacen las plantillas nuevas (`pnpm plantilla:clonar`). No es para clientes.

## Catálogo

Generado con `pnpm plantilla:lista --write` a partir de cada `plantilla.json` y de sus páginas.

<!-- catalogo:inicio -->

| Plantilla | Idioma | Negocio | Páginas | Demo | Descripción |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `_base` | es | — | 1: `/` | — | Esqueleto mínimo (inicio y 404): punto de partida de plantilla:clonar, no para clientes. |
| `asterre` (por defecto) | es | motel, hotel, retiro | 8: `/` `/contact` `/experience` `/privacy-policy` `/retreat` `/rooms` `/rooms/[slug]` `/terms-of-use` | [ver](https://casa-serena-template.nexobite.com) | Alojamiento boutique en español (motel, hotel o retiro): inicio, habitaciones con detalle, retiro, experiencias, contacto, legales y botón flotante de WhatsApp. Plantilla por defecto de clientes nuevos. |
| `hotellia` | en | hotel | 11: `/` `/bar-menu` `/gallery` `/offers/[slug]` `/privacy` `/reserve` `/restaurant-menu` `/rooms` `/rooms/[slug]` `/terms` `/wine-dine` | [ver](https://hotellia-template.nexobite.com) | Hotel boutique en inglés: habitaciones, ofertas, restaurante y menús, galería y reservas (smooth-scroll con lenis). |
| `pinevalley` | en | villa, casa-de-campo | 1: `/` | [ver](https://pinevalley-template.nexobite.com) | Villa o casa de campo en inglés, landing de una página: galería con visor, carrusel, reseñas, mapa y FAQ (lenis). |
| `selvra` | en | retiro, glamping | 9: `/` `/demo` `/enquire` `/experiences` `/experiences/[slug]` `/place` `/privacy` `/stays` `/stays/[slug]` | — | Retiro boutique en inglés: estancias y experiencias con detalle, lugar, solicitud de reserva y privacidad. |

<!-- catalogo:fin -->

## Crear o mejorar una plantilla

Guía: [docs/guias/02-crear-plantilla.md](../docs/guias/02-crear-plantilla.md).
