# 5. Uso rápido de la fábrica

Chuleta de comandos para el día a día. Las guías detalladas están en [01](./01-crear-cliente.md), [02](./02-crear-plantilla.md), [03](./03-desplegar.md) y [04](./04-reglas.md).

## Clonar una web como plantilla nueva

Revisa primero las rutas detectadas, sin clonar:

```bash
pnpm plantilla:clonar https://ejemplo.framer.website aurora --dry-run
```

Clona hasta el PR:

```bash
pnpm plantilla:clonar https://ejemplo.framer.website aurora
```

Sale un PR con `plantillas/aurora/`: código, `plantilla.json`, `CUSTOMIZE.md` y capturas en `docs/referencias/`. El slug va sin prefijo y debe ser único entre `plantillas/` y `clientes/`.

Probar las rutas de una plantilla existente:

```bash
pnpm plantilla:probe aurora
```

Verla en local:

```bash
pnpm --filter @plantillas/aurora dev
```

Tras el merge, actualiza el catálogo:

```bash
pnpm plantilla:lista --write
```

Si prefieres hacerlo a mano, `pnpm plantilla:prompt <url> <slug>` deja el prompt de clonado en el portapapeles.

## Crear un cliente

1. Crea la carpeta de recursos:

```bash
pnpm cliente:recursos motel-aurora
```

2. Copia en `recursos/motel-aurora/entrada/` todo lo que mandó el cliente, sin renombrar: fotos, logo, PDF, chats.

3. Lanza el pipeline desde Claude Code con `/nuevo-cliente motel-aurora`. Desde terminal, en dos pasos:

```bash
pnpm cliente:crear motel-aurora --intake-only
```

```bash
pnpm cliente:crear motel-aurora
```

Opciones útiles:
- `--allow-pending`: sigue aunque falten datos o el dominio sea temporal.
- `--resume --from-step gates`: retoma tras un fallo.
- `--dry-run`: comprueba sin escribir nada.
- `--no-pr`: no abre el PR.

El estado y el log quedan en `.pipeline/motel-aurora/`.

4. Responde `preguntas.md`. Con las respuestas, edita `recursos/motel-aurora/brief.md` y relanza desde el agente:

```bash
pnpm cliente:crear motel-aurora --resume --from-step agent
```

5. Revisa el PR: sitio en local, copy y lista de datos pendientes.

```bash
pnpm --filter @clientes/motel-aurora dev
```

6. Haz merge y crea la app en Coolify con la ficha del PR (guía 03).

Vía manual, si no usas el pipeline:

```bash
pnpm cliente:nuevo motel-aurora --from asterre --name "<Nombre>" --domain "<dominio.com>"
```

Después valida:

```bash
pnpm cliente:check motel-aurora --strict
```

```bash
pnpm verify
```

```bash
pnpm cliente:qa motel-aurora
```

No inventes teléfonos, correos ni direcciones. Si no los tienes, déjalos como pendientes.

## Editar un cliente existente

1. Cambia solo los 4 puntos:
   - `src/config/site.ts`: identidad, contacto y dominio.
   - `src/styles/theme.css`: colores y tipografía.
   - `src/data/content.ts`: textos y `UI_LABELS`.
   - `public/`: logos, fotos y favicon.

2. Si cambian fotos o marca, deja los originales en `recursos/la-guaca/` y optimízalos:

```bash
pnpm cliente:activos la-guaca
```

3. Revisa en local:

```bash
pnpm --filter @clientes/la-guaca dev
```

4. Valida antes de abrir el PR:

```bash
pnpm cliente:check la-guaca --strict
```

```bash
pnpm verify
```

```bash
pnpm cliente:qa la-guaca
```

5. Crea la rama, sube los cambios y abre el PR. Activa el hook una vez por clon para que `pnpm verify` corra antes de cada push:

```bash
git config core.hooksPath .githooks
```

```bash
git switch -c cliente/la-guaca-<tema>
```

```bash
gh pr create --fill
```

## Reglas que no debes saltarte

- Solo `pnpm`. Nunca `npm`, `npx`, `yarn` ni `bun`.
- Nada de marca, textos ni contactos escritos en componentes: todo va en los 4 puntos.
- No importes código ni imágenes entre sitios.
- No uses un cliente como plantilla.
- Los cambios en `packages/`, `plantillas/_base/` o `docker/` van en un PR aparte (guía 04).
