# 1. Crear un cliente

De "el cliente me mandó fotos por WhatsApp" a un **PR listo para producción**, sin renombrar fotos ni rellenar formularios a mano.

```text
1. pnpm cliente:recursos <slug>        crea recursos/<slug>/ (brief vacío + carpetas)
2. material → recursos/<slug>/entrada/ todo lo que mandó el cliente, tal cual
3. /nuevo-cliente <slug>               Claude ejecuta el pipeline y abre el PR
4. revisar PR → merge → Coolify        con la ficha que trae el PR (guía 03)
```

## Paso 1: carpeta de recursos

```bash
pnpm cliente:recursos motel-aurora
```

El slug va en kebab-case, es único y será la URL interna, la rama (`cliente/<slug>`) y el `SITE_FOLDER` de Coolify.

## Paso 2: dejar el material en `entrada/`

Copia en `recursos/<slug>/entrada/` todo lo que tengas, **sin ordenar ni renombrar**:

- Fotos con cualquier nombre (`IMG_2041.HEIC`, `WhatsApp Image….jpeg`), también en subcarpetas.
- Logo (PNG, SVG), fuentes (`.woff2`) si las hay.
- Textos: PDF de tarifas, carta, `.docx`, notas `.txt`, el chat de WhatsApp exportado.

Si ya conoces un dato con seguridad (dominio definitivo, plantilla que quieres), escríbelo en `recursos/<slug>/brief.md`: lo que escribe una persona manda sobre el intake.

`entrada/` y todo `recursos/<slug>/` están ignorados por Git. En la rama del cliente solo se suben el brief y las fotos ya ordenadas, nunca `entrada/` (puede tener chats y datos personales).

## Paso 3: un prompt

En Claude Code, desde la raíz del repo:

```text
/nuevo-cliente motel-aurora
```

El comando ejecuta el pipeline `pnpm cliente:crear <slug>`:

| Paso | Qué pasa |
| :-- | :-- |
| `intake` | Convierte HEIC y documentos y crea miniaturas. El agente mira cada foto y la clasifica (hero, una carpeta por habitación, instalaciones, galería, logo), redacta `brief.md` y escribe `preguntas.md` |
| — | Si faltan datos obligatorios, Claude te hace **todas las preguntas juntas, una sola vez** |
| `branch` · `recursos` | Rama `cliente/<slug>` y commit del brief y las fotos ordenadas |
| `generate` | `cliente:nuevo` copia la plantilla del brief a `clientes/<slug>/` |
| `assets` | Optimiza fotos y marca a WebP en `public/` |
| `agent` | Personaliza los 4 puntos (site.ts, theme.css, content.ts, public/) con el tono del brief |
| `gates` | `cliente:check --strict`, `pnpm verify` y `cliente:qa` (visual, funcional y SEO). Si algo falla, el agente lo repara (hasta 2 veces) |
| `commit` · `pr` | Commit y PR con datos pendientes, preguntas para el cliente y **ficha de Coolify** |

Sin Claude Code interactivo, lo mismo por terminal:

```bash
pnpm cliente:crear motel-aurora --intake-only   # solo intake: revisa brief.md y preguntas.md
pnpm cliente:crear motel-aurora                 # todo hasta el PR
pnpm cliente:crear motel-aurora --allow-pending # sigue aunque falten datos (dominio temporal, fotos pendientes)
pnpm cliente:crear motel-aurora --resume --from-step gates   # retomar tras un fallo
```

El estado y el log del agente quedan en `.pipeline/<slug>/`.

## Paso 4: revisar, publicar y desplegar

1. Revisa el PR: abre el sitio (`pnpm --filter @clientes/<slug> dev`) en desktop y móvil, el copy y la lista de **datos pendientes**.
2. Reenvía al cliente las **preguntas** del PR. Con sus respuestas, edita `recursos/<slug>/brief.md` y ejecuta `pnpm cliente:crear <slug> --resume --from-step agent`.
3. Merge a `main` y crea la app en Coolify con la ficha del PR ([guía 03](./03-desplegar.md)).

## Elegir plantilla

`pnpm plantilla:lista` muestra el catálogo (idioma, tipo de negocio, páginas y demo). El intake elige por tipo de negocio e idioma, y por defecto usa `asterre`. Para forzar otra, escríbela en `brief.md` → `Plantilla base`.

## Problemas frecuentes

| Mensaje | Qué hacer |
| :-- | :-- |
| `el brief no tiene completos estos campos obligatorios` | Responde `preguntas.md` en el brief o pasa el dato a Claude |
| `dominio … es temporal` | Usa `--allow-pending` hasta tener el dominio definitivo |
| `conserva material de ejemplo o de la plantilla` | Hay fotos o datos copiados de La Guaca o de la plantilla: reemplázalos o usa `--allow-pending` |
| `el árbol de trabajo no está limpio` | Commitea o descarta tus cambios antes; el pipeline no hace stash |
| `la rama cliente/<slug> ya existe` | Retoma con `--resume` o borra la rama si era una prueba |
