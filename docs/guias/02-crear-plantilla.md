# 2. Crear una plantilla

Una plantilla es un diseño reutilizable con **marca y datos ficticios**. Los clientes nacen copiándola. Se crean clonando una web existente (Framer, Webflow, etc.) con la skill `clone-website`.

```bash
pnpm plantilla:clonar https://ejemplo.framer.website aurora --dry-run   # rutas descubiertas y prompt
pnpm plantilla:clonar https://ejemplo.framer.website aurora             # clona hasta el PR
```

El slug va sin prefijo (`aurora`, no `plantilla-aurora`) y debe ser único entre `plantillas/` y `clientes/`.

## Qué hace el pipeline

| Paso | Qué pasa |
| :-- | :-- |
| `routes` | Descubre las rutas de la web (sitemap, robots, enlaces) y descarta variantes de idioma |
| `generate` | `pnpm cliente:nuevo <slug> --plantilla` crea `plantillas/<slug>/` desde `plantillas/_base` con su `plantilla.json` |
| `agent` | Clona todas las rutas con la skill `clone-website` en modo Plantilla, con capturas en `docs/referencias/` |
| `gates` | `pnpm verify`, `cliente:qa` y la **prueba de personalización**: un cliente generado desde la plantilla solo puede tener restos de marca en `site.ts`, `content.ts` y `theme.css` |
| `commit` · `pr` | PR con el resumen del agente y el informe de QA |

## Requisitos de toda plantilla

- `plantilla.json` completo:
  - `nombre`, `descripcion`, `idioma`, `negocio` (tipos de negocio).
  - `origen`, `demo`.
  - `marcas`: nombres ficticios de la plantilla, que `cliente:check` busca en los clientes.
  - `placeholders`: teléfonos, correos y direcciones de ejemplo.
- `CUSTOMIZE.md` con los 4 puntos, los tamaños de imagen y el checklist de entrega.
- Nada de marca, contactos ni textos visibles en componentes: todo en los 4 puntos (AGENTS.md §6).
- Dominio de ejemplo `<slug>.example.com`.

Después del merge, actualiza el catálogo con `pnpm plantilla:lista --write` y, si quieres una demo pública, crea su app de Coolify con `SITE_FOLDER=<slug>` ([guía 03](./03-desplegar.md)).

## Mejorar una plantilla con lo aprendido en un cliente

Si un cliente añade algo genérico (por ejemplo, un botón flotante de WhatsApp), pórtalo a su plantilla con datos de ejemplo en un PR aparte. Nunca copies datos reales del cliente ni importes código entre sitios. Verifica con:

```bash
pnpm verify
pnpm cliente:qa <plantilla>
pnpm plantilla:probe <plantilla>
```
