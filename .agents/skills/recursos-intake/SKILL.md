---
name: recursos-intake
description: Ordena el material crudo de un cliente (recursos/<slug>/entrada/: fotos con cualquier nombre, HEIC, PDF, documentos, chats de WhatsApp exportados) en la estructura de recursos/ y redacta su brief.md y preguntas.md sin inventar datos. La ejecuta el paso intake de pnpm cliente:crear; úsala también si te piden ordenar recursos de un cliente a mano.
---

# Intake de recursos (`recursos-intake`)

Reglas comunes en [AGENTS.md](../../../AGENTS.md) y estructura de destino en [recursos/README.md](../../../recursos/README.md). El objetivo es que nadie tenga que renombrar fotos ni rellenar el brief a mano: el cliente manda lo que tenga, se deja en `entrada/` y esta skill lo convierte en recursos listos para `cliente:crear`.

## 1. Entradas (ya preparadas por el orquestador)

`recursos/<slug>/.intake/indice.json`:

- `fotos[]`: `id` (`f001`…), `original`, `miniatura` (JPG de 512 px que debes **mirar** con Read), `ancho`, `alto`, `orientacion`.
- `textos[]`: `id` (`t001`…), `legible` (PDF, TXT, MD, CSV o documento convertido a TXT). Léelos todos: ahí están tarifas, horarios, contactos, carta, políticas y la voz del cliente. Un chat de WhatsApp exportado es una fuente válida de datos (no copies nombres ni teléfonos de terceros).
- `otros[]`: `id` (`o001`…) y `motivo`. Un SVG puede ser el logo y una fuente `.woff2` la tipografía de marca; el resto se ignora.

Si `recursos/<slug>/brief.md` ya existe, lo que escribió una persona **manda**: solo completas campos vacíos o `Pendiente`.

## 2. Clasificación de fotos → `.intake/clasificacion.json`

```json
{
  "archivos": [
    { "id": "f001", "destino": "fotos/hero/hero-1" },
    { "id": "f002", "destino": "fotos/hero/hero-1-mobile" },
    { "id": "f003", "destino": "fotos/habitaciones/suite-jacuzzi/suite-jacuzzi-01" },
    { "id": "f004", "destino": "fotos/instalaciones/fachada" },
    { "id": "o001", "destino": "marca/logo" },
    { "id": "f005", "destino": "descartar", "motivo": "borrosa" }
  ]
}
```

- `destino` sin extensión, en kebab-case, bajo `fotos/{hero,habitaciones/<habitacion>,instalaciones,galeria}/` o `marca/` (`marca/logo`, `marca/logo-mark`, `marca/og-image`, `marca/favicon`, `marca/fuentes/<familia>-<peso>`).
- **Hero:** de 1 a 3 fotos horizontales, las más impactantes y nítidas. Si hay una vertical equivalente, va como `hero-N-mobile`.
- **Habitaciones:** agrupa por habitación (misma cama, decoración y jacuzzi). La carpeta es el slug del nombre de la habitación que uses en el brief. Numera con dos dígitos (`<habitacion>-01`…), y la `-01` es la mejor foto general (portada).
- **Instalaciones:** fachada, recepción, parqueadero, zonas comunes, restaurante.
- **Galería:** buenas fotos que no encajan arriba.
- **Descartar:** borrosas, duplicadas, capturas de pantalla, fotos con personas identificables, menores o contenido explícito, y fotos con marcas de agua de otro negocio. Anota el motivo.
- Los nombres de foto son únicos en todo el cliente (el sitio los aplana en `public/images/`), por eso llevan el prefijo de su habitación.
- Si no puedes distinguir dos habitaciones parecidas, agrúpalas como una sola y anótalo en `preguntas.md`.

## 3. Brief → `recursos/<slug>/brief.md`

- Usa el formato **exacto** de [`recursos/_plantilla-cliente/brief.md`](../../../recursos/_plantilla-cliente/brief.md): mismas secciones `## `, mismos campos `- Etiqueta:` y un `### <Habitación>` por carpeta de `fotos/habitaciones/`.
- **Generación** (obligatoria, sin `Pendiente`):
  - Slug: el de la carpeta.
  - Nombre comercial: el del material. Si de verdad no aparece, déjalo vacío para que el pipeline se detenga y pregunte.
  - Dominio: el definitivo si aparece. Si no, `<slug>.nexobite.com (temporal)`.
  - Locale: `es_CO` salvo que el material indique otro país o idioma.
  - Tipo de negocio y Plantilla base: la del catálogo (`pnpm plantilla:lista`) que encaje por tipo de negocio e idioma (por defecto `asterre`).
- **Tono** (moteles): elige estilo y tono con la skill [motel-copywriting](../motel-copywriting/SKILL.md) según el material, y justifícalo en una línea.
- **Contacto, horarios, tarifas y políticas:** copia literal del material. Lo que falte o se contradiga va como `Pendiente`, nunca un dato de ejemplo.
- **Marca:** colores (hex) solo si aparecen o se pueden medir del logo, y tipografías solo si vienen en el material. Si no, `Pendiente`, y el agente de personalización usará los de la plantilla.

## 4. Preguntas → `recursos/<slug>/preguntas.md`

Lista numerada, corta y en lenguaje del cliente (se le puede reenviar tal cual por WhatsApp), ordenada por lo que más bloquea la entrega:

1. Datos obligatorios que faltan (nombre, dominio definitivo).
2. Contacto y tarifas que faltan o se contradicen.
3. Fotos que faltan (habitaciones sin fotos, sin logo, sin fachada) o habitaciones dudosas.
4. Licencia de fuentes o fotos de terceros.

## 5. Límites

- Solo escribes `brief.md`, `preguntas.md` y `.intake/clasificacion.json` dentro de `recursos/<slug>/`. **Nunca** modificas `entrada/` ni copias fotos: el orquestador aplica la clasificación (`pnpm cliente:intake <slug> --apply`).
- `entrada/` y `.intake/` nunca se suben a Git (pueden contener chats y datos personales).
- Sin git, sin instalar dependencias y sin inventar datos.
