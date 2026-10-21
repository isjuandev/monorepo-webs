# clientes/

Un sitio por cliente real, cada uno con su dominio y su app de Coolify. Se crean con `/nuevo-cliente <slug>` o `pnpm cliente:crear <slug>` ([guía](../docs/guias/01-crear-cliente.md)), nunca copiando carpetas a mano.

Cada cliente tiene:

- `cliente.json`: plantilla de origen, `estado` (`en-construccion` o `produccion`) y nombre de la app de Coolify.
- Los 4 puntos de personalización: `src/config/site.ts`, `src/styles/theme.css`, `src/data/content.ts` y `public/`.
- `docs/`: resumen del agente, guía de voz, mapa de activos y QA (en `docs/qa/`, ignorada por Git).
- Sus recursos de origen en `recursos/<slug>/`.

| Cliente | Plantilla de origen | Dominio | Estado | App de Coolify |
| :-- | :-- | :-- | :-- | :-- |
| `la-guaca` | `asterre` | la-guaca.nexobite.com (temporal) | producción | `cliente/la-guaca` |

Al publicar un cliente nuevo, añade su fila aquí y actualiza su `cliente.json`.
