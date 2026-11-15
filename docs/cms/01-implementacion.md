# CMS interno de la fábrica: documentación de implementación

> Estado: **propuesta para implementar** (no hay código escrito), revisada contra el código del repositorio el 2026-11-15; decisiones abiertas resueltas. Este documento especifica qué construir, en qué orden y con qué criterios de aceptación. Las reglas generales siguen en [AGENTS.md](../../AGENTS.md).

## 1. Objetivo y alcance

Una plataforma web interna, alojada en nuestro servidor (Coolify) y usada por un equipo de **2 personas**, para hacer visualmente lo que hoy se hace por consola:

1. **Crear** un cliente: elegir plantilla, arrastrar imágenes, escribir información a mano o importar un `.md` con estructura definida, y generar el sitio hasta un PR o un commit.
2. **Editar** clientes ya creados (textos, listas, imágenes, colores, contacto, páginas) y volver a publicar.

### Decisiones tomadas

| # | Decisión |
| :-- | :-- |
| 1 | Se aloja en el servidor propio; usuarios: 2 personas (requiere autenticación y aislamiento de secretos). |
| 2 | Crea **y edita** clientes. Por eso el contenido debe ser **datos** (JSON), no solo código TypeScript. |
| 3 | Se aprueba un backend Node dentro del stack: **Astro con `output: "server"` + `@astrojs/node` + Preact**. Sin librerías nuevas salvo autorización expresa. |
| 4 | El `.md` se **extiende** a partir del actual `brief.md`; no se crea un formato paralelo. |
| 5 | Este entregable es solo documentación: no se implementa todavía. |
| 6 | **Vista previa por subdominio.** Hay DNS en Cloudflare: cada borrador o cliente en preparación se sirve en `<slug>.nexobite.com` (p. ej. `la-guaca.nexobite.com`, §12.4), antes de pasar al dominio real. |
| 7 | **Publicación por PR** por defecto; el commit directo a `main` queda como opción por entorno (§8.3). |
| 8 | **Acceso solo con login** (sin VPN ni restricción por IP). Por eso las medidas de §11.1 (límite de intentos, cookies, CSP) son obligatorias, no opcionales. |
| 9 | **Credencial de GitHub: token de alcance limitado** (fine-grained, solo este repositorio: contenido y pull requests), porque el flujo por defecto abre PR con `gh`. Una clave de despliegue sola no basta. |
| 10 | **IA opcional** para redactar solo campos vacíos y `redactable`, con tope de gasto (Fase 6). Sin ella, el contenido editorial se escribe a mano o se importa con `contenido.md`. |
| 11 | **Cambios de diseño solo por CLI.** El CMS edita datos, marca y activos; nunca da al agente alcance sobre componentes. |
| 12 | **SVG rechazado** desde la web (se pide PNG); **HEIC no se ofrece** en el día 1 (se pide JPG) hasta comprobar `sharp` en la imagen Docker. |

### Fuera de alcance (de momento)

- Edición visual del diseño o de los componentes (solo datos, marca y activos).
- Multi-idioma dentro de un mismo cliente.
- Más de 2 usuarios, roles o permisos finos.
- Reemplazar el pipeline de CLI: el CMS lo **envuelve**, el CLI sigue funcionando.

## 2. Punto de partida (qué ya existe)

- Pipeline `pnpm cliente:crear`: intake → rama → recursos → generate → assets → agent → gates → commit → PR (`scripts/client-run.mjs`, `scripts/lib/pipeline.mjs`).
- Estado reanudable por cliente en `.pipeline/<slug>/state.json` y log del agente en `agent.jsonl`.
- `brief.md` con `## Sección`, `- Campo: valor` y `### Habitación`, leído por `scripts/lib/brief.mjs` (solo extrae unos pocos campos; el resto lo interpreta el agente).
- Optimización de imágenes con `sharp` (`scripts/optimize-assets.mjs`) y mapa `assets-manifest.json`. La convención es **por nombre de archivo** (`fotos/**/<nombre>.* → public/images/<nombre>.webp`); no hay slots: el agente decide qué imagen usa cada sección.
- Intake con IA que clasifica fotos (`scripts/recursos-intake.mjs`).
- Manifiestos `plantilla.json` y `cliente.json` (solo metadatos).
- Plantillas: `_base` (esqueleto sin `src/data/content.ts`), `asterre`, `hotellia`, `lunevar`, `pinevalley` y `selvra`. Cliente en producción: `la-guaca` (desde `asterre`).

### Cómo son hoy los clientes (dato clave)

Un cliente **no** es "plantilla + datos". El agente del pipeline puede modificar todo `clientes/<slug>/` y el brief incluye `## Cambios de diseño respecto a la plantilla`, así que cada cliente diverge de su plantilla también en código. Ejemplo medido en `la-guaca` frente a `asterre`:

- 37 diferencias en `src/`: 17 componentes modificados, `BaseLayout`, secciones nuevas (`RoomGallery`, `LocationCta`).
- Rutas renombradas: `/rooms` → `/habitaciones`, `/contact` → `/contacto`, `/experience` → `/experiencias`, `/privacy-policy` → `/politica-de-privacidad`; `/retreat` eliminada.
- Modelo de datos distinto: el `Room` de la-guaca tiene `hours`, `extraPerson`, `extraHour`, `cardPitch`, `headline`, `intro`, `reserveMessage`, `amenities`…, que no existen en el de asterre; `content.ts` pasa de 728 a 1.354 líneas.

Consecuencia: el esquema de una plantilla **no sirve** para editar a sus clientes. El esquema tiene que ser **de cada sitio** (§4.2).

### Lo que falta (el hueco que cubre este proyecto)

1. **No hay esquema de contenido por sitio.** Cada `content.ts` tiene estructuras distintas (asterre: `ROOMS`/`EXPERIENCES`/`PAGES`; hotellia: `OFFERS`/`MENU`; pinevalley: `HERO`/`OVERVIEW`; selvra: `STAYS`; lunevar: 1.806 líneas) y es código: helpers `img()` (asterre, hotellia, la-guaca), interpolación de `siteConfig` (asterre, la-guaca), uniones de iconos (`IconName`), tuplas (`RoomGallery`), constantes compartidas entre ítems (`DEFAULT_DETAILS`, `DEFAULT_FEATURES`) y `satisfies`. El mapeo hoy lo hace un LLM.
2. **No hay forma de editar** un cliente existente de manera segura: `content.ts` y `site.ts` son código, y además cada cliente ha divergido de su plantilla (ver arriba).
3. **No hay capa web** ni autenticación.
4. **El pipeline asume una máquina de confianza:** `runClaude` hereda `process.env` (`spawn` sin `env`), usa un solo árbol de git y cambia de rama (`checkout`/`pull`/`checkout -b` en la raíz), y el agente tiene `Bash(pnpm:*)`, que permite ejecutar cualquier cosa (`pnpm exec`, `pnpm dlx`, scripts) y saltarse la prohibición de `git`/`gh` (§11).
5. **Valores fijos de este repo en el código:** la ficha del PR lleva escrito `isjuandev/monorepo-webs` y el trailer del commit del agente es fijo; el autor de los commits es el de la configuración de git de la máquina.

## 3. Arquitectura

```text
                    ┌──────────────────────────── servidor (Coolify) ───────────────────────────┐
 Navegador          │  apps/cms  (Astro server + Preact)                                         │
 (2 usuarios) ───►  │   ├─ UI: selector, formularios, imágenes, vista previa, trabajos           │
 HTTPS + login      │   ├─ API: /api/* (sesión, validación, subidas)                             │
                    │   ├─ Cola de trabajos (1 job por sitio, logs por SSE)                      │
                    │   └─ Núcleo @repo/cms-core (esquemas, md, datos, activos, git)             │
                    │            │ importa funciones     │ lanza procesos                        │
                    │      scripts/lib (refactor)   pnpm cliente:* · claude -p · gh · astro      │
                    │            ▼                                                               │
                    │  Volumen persistente:  /data/repo (clon)  /data/recursos  /data/.pipeline  │
                    └────────────────────────────────────────────────────────────────────────────┘
                                          │ push / PR                       │ webhook / deploy
                                          ▼                                 ▼
                                       GitHub ───────────────────────►  Coolify (1 app por cliente)
```

**Principio:** el sistema de archivos + git es la base de datos. No hay base de datos aparte: el historial de git es la auditoría y las ramas son los borradores.

### 3.1 Ubicación en el monorepo

- `apps/cms/`: la aplicación (nuevo workspace `@apps/cms`; añadir `apps/*` a `pnpm-workspace.yaml`).
- `apps/cms-core/` (`@repo/cms-core`): lógica sin UI ni HTTP, reutilizable por el CMS y por los scripts. Agnóstica a marcas (AGENTS §5.1).
  - **No va en `packages/`:** las Watch Paths de cada app de Coolify incluyen `packages/**` (ficha del PR en `client-run.mjs` y guía `03-desplegar.md`), así que cada cambio del CMS redesplegaría **todos** los clientes. `packages/` queda reservado para lo que consumen los sitios.
- `verify-isolation` ya no trata `apps/*` como sitio (solo recorre `plantillas/` y `clientes/`). Hay que **añadir** una regla nueva: ningún sitio puede depender de `@apps/*` ni de `@repo/cms-core`, ni importar desde `apps/` (hoy nada lo impide).
- El CMS **no** se publica como sitio estático ni con `docker/Dockerfile`: tiene su propia imagen (§12). Hay que comprobar que `turbo prune` de `docker/Dockerfile` (que no copia `apps/`) sigue funcionando con los importers de `apps/*` en `pnpm-lock.yaml`.

### 3.2 Módulos de `@repo/cms-core`

| Módulo | Responsabilidad |
| :-- | :-- |
| `schema` | Carga y valida el esquema de un sitio (`plantilla.schema.json` o `cliente.schema.json`); expone campos, repetidores, slots de imagen y páginas. |
| `markdown` | Parser y serializador **con ida y vuelta** de `brief.md` (negocio) y de `contenido.md` (editorial) (§6). |
| `datos` | Lee y escribe `site.json`, `content.json` y variables de `theme.css` de un sitio (§5). |
| `activos` | Optimiza imágenes con la función extraída de `optimize-assets.mjs` y añade encima la asignación a slots (modelo nuevo, §7). |
| `sitios` | Lista plantillas y clientes (extraído de `lib/paths.mjs`). |
| `git` | Operaciones de rama, commit con autor por usuario, push y PR. |
| `trabajos` | Ejecuta pasos del pipeline, guarda estado y expone el log. |

## 4. Contrato de sitio: `plantilla.schema.json` y `cliente.schema.json`

Cada plantilla añade, junto a `plantilla.json`, un archivo **declarativo** que describe lo editable. Al generar un cliente, `cliente:nuevo` lo copia como `cliente.schema.json`, y desde ahí **evoluciona con el cliente** (igual que su código, §2). La UI y el mapeo del `.md` se generan **solo** a partir del esquema del sitio: añadir una plantilla o personalizar un cliente no requiere tocar el CMS.

### 4.1 Qué declara

1. **Metadatos:** `schemaVersion`, plantilla, vista previa (captura de `docs/referencias/`), URL de demo.
2. **Identidad (`site`):** campos de `site.ts`. **No hay un modelo común:** cada plantilla define su `ClientSiteConfig` (pinevalley añade `logoText`, `contact.area`, `mapQuery`, `mapsUrl`, `bookingUrl`, `preloadFonts`; `_base` solo tiene contacto y redes). El esquema declara los campos del sitio, incluidos los menús (`MENU_LINKS`, `FOOTER_LINKS`), que hoy también viven en `site.ts`.
3. **Marca (`tema`):** variables CSS editables (`--color-*`, `--font-*`), con tipo (color, fuente) y valor por defecto.
4. **Contenido (`contenido`):** árbol de grupos y campos que reflejan `content.json`:
   - tipos de campo: `texto`, `textoLargo`, `enlace`, `numero`, `booleano`, `opcion`, `lista` (repetidor), `grupo`, `imagen`, `icono` (opciones tomadas del mapa de iconos del sitio, p. ej. `IconName` de `src/data/icons.ts`);
   - cada campo: etiqueta en español, ayuda, obligatorio, límites (`maxLength`), `ejemplo`, `redactable` (§8.1);
   - cada repetidor: campos del ítem, mínimo y máximo (una tupla como `RoomGallery` es mínimo = máximo), valores por defecto compartidos entre ítems (lo que hoy son constantes como `DEFAULT_DETAILS`) y clave de slug. La **ruta** que genera cada ítem depende del sitio y se declara en `paginas` (asterre: `/rooms/<slug>`; la-guaca: `/habitaciones/<slug>`).
5. **Imágenes (`imagenes`):** slots con nombre de archivo destino en `public/images/`, proporción, ancho mínimo, formato, obligatorio y, si aplica, plantilla de nombre por ítem (asterre: `room-<clave>`, `-wide`, `-tall`, `-detail`, `-inset`). Es un **modelo nuevo**: hoy las imágenes no tienen slots (§2).
6. **Páginas (`paginas`):** rutas, si son opcionales y qué grupos de contenido alimentan cada una (permite "quitar/añadir página" desde la UI).
7. **Mapeo con el brief (`md`):** solo para los campos que tienen un equivalente en el brief de negocio (identidad, contacto, datos de los repetidores como tarifa o capacidad), la sección y etiqueta de `brief.md` que los alimenta (§6). El resto del contenido editorial no sale del brief.

### 4.2 Reglas

- El esquema **del sitio** es la **fuente de verdad de la forma** de su contenido; el tipo TypeScript del sitio debe coincidir (comprobación en CI, §14).
- **Esquema por sitio:** la plantilla aporta el esquema inicial; el cliente tiene el suyo (`cliente.schema.json`). Cualquier cambio en el código de un cliente que altere su modelo de datos (como el `Room` de la-guaca) debe actualizar su esquema en el mismo commit; el CMS edita siempre con el esquema del sitio, nunca con el de la plantilla.
- Versionado: `schemaVersion` sube con cambios incompatibles. Un cliente guarda en `cliente.json` la plantilla y el `schemaVersion` de origen. Como los clientes divergen, **no** hay migración automática plantilla → cliente: el CMS solo avisa de que la plantilla tiene una versión nueva y las migraciones se aplican por cliente, revisando el diff.
- `plantilla:clonar` y `plantilla:probe` pasan a exigir el esquema (§13), y la guía `02-crear-plantilla.md` lo documenta.

## 5. Contenido como datos (necesario para editar)

Para poder editar clientes sin reescribir TypeScript, el punto 3 de AGENTS §6 pasa de "código" a "código + datos":

| Hoy | Después |
| :-- | :-- |
| `src/config/site.ts` con literales y menús (parcheado por regex en `new-client-site.mjs`, salvo desde `_base`, donde se genera entero) | `src/config/site.json` con los datos, incluidos los menús; `site.ts` conserva la interfaz del sitio, lo importa, lo valida y calcula (`normalizeSiteUrl`, `pageTitle`). |
| `src/data/content.ts` con textos, listas y helpers | `src/data/content.json` con textos y listas; `content.ts` conserva tipos, helpers (`img()`, `whatsappUrl`, `fillLabel`), aplica valores por defecto compartidos y reexporta los datos tipados. |
| `src/styles/theme.css` | Igual, pero con un **bloque delimitado** de variables editables (marcadores de inicio y fin) que el CMS reescribe sin tocar el resto. |
| `public/` | Igual. Las imágenes se referencian por nombre de slot. |

Consecuencias:

- Los componentes y páginas **no cambian** por la migración: siguen consumiendo `siteConfig` y `content.ts`.
- **Validación en build:** un `import` de JSON no garantiza los tipos (uniones como `IconName`, tuplas, opcionales). `site.ts` y `content.ts` validan los JSON contra el esquema del sitio al compilar y fallan con un mensaje claro; sin librerías nuevas (validador propio en `@repo/utils` o en el sitio).
- La regla de AGENTS §6 ("sin textos en componentes") se mantiene; se actualiza para indicar que los textos viven en `content.json`.
- **Migración por sitio**, en este orden de riesgo creciente: `pinevalley` (una página, 404 líneas) → `selvra` → `asterre` → **`la-guaca`** (cliente en producción, con su propio esquema) → `hotellia` → `lunevar` (1.806 líneas, con planificador y artículos). `_base` no tiene `content.ts`: se le **crea** un `content.json` mínimo y su esquema. Criterio por sitio: el build produce el **mismo HTML** antes y después (comparar `dist/` y la QA visual).
- `customize-check` ya revisa los `.json` de `src/` en busca de marcas y datos de ejemplo; solo hay que cambiar la lectura de `CLIENT_DOMAIN` (hoy un regex sobre `site.ts`) para que lea `site.json`. `plantilla:probe` debe exigir que los restos estén solo en los JSON y en `theme.css`.
- Las referencias a `siteConfig` dentro de textos (p. ej. el nombre en mensajes de WhatsApp) se expresan con marcadores (`{nombre}`) que `content.ts` resuelve.

## 6. Formatos `.md`: brief de negocio y contenido editorial

El `brief.md` actual y `content.json` contienen **cosas distintas**:

- **Brief de negocio (`brief.md`):** hechos que da el cliente: identidad, contacto, tarifas, horarios, políticas, servicios en texto libre, tono (`Estilo (1-10)`, tono principal), cambios de diseño. Hoy lo completa el intake.
- **Contenido editorial (`content.json`):** el copy del sitio: titulares, intros, CTA, mensajes de WhatsApp, textos alternativos, `UI_LABELS`. Casi ningún campo tiene un equivalente en el brief; por eso hoy el paso brief → contenido lo hace un LLM.

Por eso hay **dos documentos** con la misma gramática:

1. `brief.md` (se extiende el actual): alimenta de forma determinista solo los campos con mapeo declarado (§4.1.7). El resto del contenido sale del paso de IA opcional (§8.1) o se escribe a mano.
2. `contenido.md` (nuevo): se genera desde el esquema del sitio, tiene una sección por grupo de `content.json` y permite redactar todo el copy fuera de la web e importarlo **sin IA**, con ida y vuelta.

Se mantiene la gramática actual y se formaliza para que sea **parseable sin LLM** y reversible.

### 6.1 Gramática

- `## Sección`: grupo de campos (nombre normalizado sin acentos ni mayúsculas, como hoy).
- `- Etiqueta: valor`: campo simple. Valor vacío o `Pendiente` = sin dato.
- Valores largos: líneas de continuación con sangría de 2 espacios.
- Listas simples: sub-viñetas con sangría (`  - elemento`).
- `### Nombre del ítem`: un elemento de un repetidor (habitación, oferta, experiencia, FAQ…), con sus propios campos debajo.
- `<!-- ... -->`: comentarios; se ignoran al leer y se **conservan** al escribir. Ojo: hoy `brief.mjs` los elimina antes de parsear (`stripHtmlComments`) y el bloque de ejemplo de `### Habitación` vive dentro de un comentario; el serializador debe conservarlos en su sitio.
- Líneas sueltas sin `- Etiqueta:` (p. ej. `## Servicios incluidos…`, "una línea por servicio"): se leen como lista simple de la sección.
- Secciones o campos desconocidos: se conservan tal cual (no se pierde nada al editar desde la web).

### 6.2 Qué se añade respecto al brief actual

1. Una sección `## Generación` que ya existe (plantilla, slug, nombre, dominio, locale, tipo de negocio) pasa a validarse **estrictamente** contra el esquema de la plantilla elegida.
2. Secciones y campos **adicionales** por plantilla, declarados en el esquema (§4.1.7): el `.md` deja de ser solo para moteles.
3. Un **encabezado de versión** (`schemaVersion`) para detectar un `.md` hecho para otra versión del esquema.
4. Una **plantilla de `brief.md` y otra de `contenido.md` descargables por sitio**, generadas desde el esquema (con comentarios de ayuda y ejemplos). Es lo que se entrega a quien redacte la información fuera de la web.

### 6.3 Importación y exportación

- **Importar:** arrastrar el `.md` → parseo → validación → vista previa de los campos reconocidos, los desconocidos y los errores **con número de línea**. Nada se guarda hasta confirmar.
- **Exportar:** cualquier cliente puede volver a `brief.md` y `contenido.md` desde los datos actuales (útil para copiar a otro cliente de la misma plantilla).
- **Conflictos:** lo escrito por una persona manda sobre lo inferido por la IA (regla actual del intake) y se marca el origen de cada valor (`manual`, `md`, `intake`).

## 7. Imágenes

### 7.1 Modelo

- Cada slot (§4.1.5) define su archivo destino. El destino siempre es `public/images/<nombre>.webp` (ancho máximo según tipo), más `og-image.jpg`, `favicon` y fuentes `.woff2` en sus rutas.
- Los slots son una capa **nueva** sobre la convención actual por nombre de archivo: asignar una foto a un slot equivale a guardarla en `recursos/<slug>/fotos/…` con el nombre del slot y pasarla por la misma función de optimización. Así `cliente:activos` y la web siguen dando el mismo resultado.
- Los originales se guardan en el volumen (`recursos/<slug>/…`) para poder regenerar; a git viajan las versiones optimizadas y lo que el pipeline sube con `git add -f` en la rama del cliente (brief, `fotos/`, `marca/`; nunca `entrada/` ni `.intake/`).

### 7.2 Dos formas de subir

1. **A un slot concreto:** arrastrar sobre el slot. Se valida proporción y tamaño mínimo (avisa si es menor al recomendado), se optimiza y se escribe. La vista previa se actualiza al instante.
2. **A una zona general ("bandeja"):** va a `entrada/`; el **intake** (el agente de hoy) propone en qué slot va cada foto. La persona **confirma o corrige** en una cuadrícula antes de aplicar. Nada se asigna sin confirmación.

### 7.3 Reglas

- Formatos aceptados: JPG, PNG, WebP, AVIF y TIFF (los que hoy procesa `optimize-assets`); PDF y documentos solo para el intake.
  - **HEIC:** hoy no se procesa (no está en `RASTER_EXTENSIONS`) y el `sharp` precompilado normalmente no decodifica HEIC/HEVC. No se ofrece en la web hasta comprobar el soporte en la imagen Docker; mientras tanto se rechaza con un mensaje que pide exportar a JPG.
  - **SVG:** hoy se copia tal cual a `public/images/` (sin recodificar). Un SVG puede llevar scripts, así que **desde la web se rechaza** con un mensaje que pide PNG (decisión 12). Sanearlo (sin `<script>`, manejadores `on*`, `<foreignObject>` ni referencias externas) queda como mejora futura. `optimize-assets` debe aplicar la misma regla a los SVG que lleguen por la web; los logos SVG vía CLI siguen siendo material revisado por una persona.
- Límite de tamaño por archivo y por subida (configurable), conteo máximo por lote.
- Detección de duplicados por hash (como `recursosLeftovers`) y de **restos de plantilla**. **Cambio de regla:** hoy las imágenes idénticas a la plantilla son solo un aviso en `cliente:check` (no fallan ni con `--strict`); pasan a ser error en `--strict` y bloquean la publicación.
- La optimización debe ser la **misma función** que usa `cliente:activos` (se extrae de `optimize-assets.mjs`), para que CLI y web den el mismo resultado.
- Al sustituir una imagen en un cliente ya publicado, se actualiza `assets-manifest.json`.

## 8. Flujos

### 8.1 Crear un cliente

1. **Selector de plantilla:** tarjetas con captura, descripción, tipo de negocio y demo (desde `plantilla.json` y el esquema).
2. **Datos base:** nombre, slug (kebab-case, único entre plantillas y clientes), dominio, locale.
3. **Contenido:** formulario generado del esquema de la plantilla **o** importación de `brief.md` y `contenido.md`. Guardado automático como borrador.
4. **Imágenes:** slots y bandeja (§7).
5. **Validación:** panel de **pendientes** (obligatorios vacíos, imágenes faltantes, restos de plantilla, dominio temporal), equivalente a `cliente:check --strict` pero antes de lanzar nada.
6. **Generar:** el trabajo ejecuta, en este orden:
   1. generar el sitio desde la plantilla (`cliente:nuevo`);
   2. volcar **datos deterministas**: `site.json`, `content.json`, variables de tema y `cliente.schema.json` (copia del de la plantilla) desde el formulario;
   3. activos (§7);
   4. **paso opcional de IA** (marcado, con costo y tope): redactar solo los campos que quedaron vacíos y que el esquema marca como `redactable`, a partir del brief de negocio, con la skill `motel-copywriting` cuando aplique, y con alcance limitado a `content.json`. Es el único paso que convierte el brief en copy; sin él, el contenido editorial se escribe a mano o se importa con `contenido.md`;
   - a diferencia del pipeline de CLI, el CMS **no** pide al agente cambios de diseño ni de componentes; si el brief los trae, se derivan a una tarea por CLI y el cliente actualiza su esquema (§4.2);
   5. compuertas (`cliente:check --strict`, `verify`, `cliente:qa`) con reparación automática;
   6. commit y PR (o commit directo, §8.3).
7. **Resultado:** enlace a la vista previa, informe de QA y PR.

### 8.2 Editar un cliente

1. Se elige el cliente; el CMS carga `site.json`, `content.json` y el bloque de tema, junto con **el esquema del propio cliente** (`cliente.schema.json`). Si el cliente no tiene esquema (no migrado), se muestra como "solo CLI".
2. Se edita en formulario; los cambios son un **borrador** (rama `cms/<slug>/<fecha>-<usuario>`), nunca tocan `main` directamente.
3. **Vista previa** del borrador (§12.4).
4. **Publicar:** valida, ejecuta compuertas rápidas (check + build + QA de rutas afectadas), y commit/PR o merge.
5. Si la plantilla de origen subió de `schemaVersion`, el CMS lo **avisa**; la migración del cliente es una tarea aparte, revisada por diff (§4.2), y no bloquea la edición.

### 8.3 Publicación

- Modo configurable por entorno: **PR** (por defecto, decisión 7) o **commit directo a `main`** (como ya se trabaja en este repo). En modo directo, la compuerta de calidad es obligatoria y el autor del commit es la persona que publica. Abrir el PR requiere el token de GitHub de alcance limitado (decisión 9).
- Tras el merge, Coolify despliega el cliente (webhook). Una fase posterior puede usar la API/MCP de Coolify para crear la app y mostrar la ficha de despliegue.

## 9. Backend

### 9.1 API (todas bajo sesión; todas validan en servidor)

| Área | Endpoints (resumen) |
| :-- | :-- |
| Sesión | iniciar y cerrar sesión; usuario actual |
| Plantillas | listar; detalle y esquema; descargar plantilla `.md` |
| Clientes | listar; crear borrador; leer; guardar campos; migrar esquema |
| Markdown | previsualizar importación (`brief.md` o `contenido.md`); confirmar importación; exportar |
| Imágenes | subir a slot; subir a bandeja; ver propuesta del intake; confirmar asignación; borrar |
| Validación | pendientes de un cliente |
| Trabajos | lanzar (generar, publicar, QA); estado; cancelar; reanudar; log por SSE |
| Vista previa | estado y URL de la vista previa de un borrador |
| Sistema | `/healthz`; uso y costo acumulado del agente |

### 9.2 Trabajos

- **Cola con un trabajo activo por sitio** y un límite global bajo (1 o 2): el pipeline actual usa un único árbol de git y cambia de rama.
- Para poder trabajar en paralelo, cada trabajo usa un **`git worktree`** propio con `node_modules` compartido vía el almacén de pnpm; si da problemas, se serializa todo.
- Reutilizar `state.json` (pasos hechos, `--resume`, costo) y `agent.jsonl`; la UI muestra el paso actual, el log en vivo (SSE), el costo y permite **cancelar** (matar el proceso hijo y limpiar el worktree).
- Tope de gasto por trabajo (`--max-budget-usd`) configurable; la UI muestra el estimado antes de lanzar el paso de IA.
- Los trabajos que se interrumpen por reinicio del servidor se marcan como `interrumpido` y se pueden reanudar desde el último paso hecho.

### 9.3 Concurrencia de edición (2 personas)

- **Bloqueo optimista:** cada lectura devuelve un hash del contenido; guardar con un hash obsoleto devuelve conflicto y muestra un diff por campo, sin pisar el trabajo del otro.
- **Presencia simple:** aviso "X está editando este cliente" (sin edición colaborativa en tiempo real; no hace falta para 2 personas).

## 10. Frontend (Preact, Astro primero)

Páginas estáticas del shell en `.astro`; Preact solo donde hay estado: formulario dinámico, arrastrar y soltar, visor de logs, cuadrícula de asignación de fotos.

| Pantalla | Contenido |
| :-- | :-- |
| Inicio | Clientes y borradores con estado (producción, en curso, pendiente), trabajos recientes. |
| Nuevo cliente | Asistente de §8.1 (plantilla → datos → contenido → imágenes → validar → generar). |
| Cliente | Pestañas: Identidad, Marca, Contenido (por grupos del esquema), Imágenes, Páginas, Publicación. |
| Importar `.md` | Arrastrar, vista previa de reconocidos, desconocidos y errores por línea. |
| Trabajos | Lista, log en vivo, costo, cancelar y reanudar. |
| Vista previa | Iframe en escritorio y móvil (390×844) con selector de ruta. |

Requisitos: accesible (teclado y etiquetas), usable en móvil para revisar, textos de interfaz en español y todos centralizados (no hardcodear en componentes, igual que en los sitios).

## 11. Autenticación y seguridad

El CMS ejecuta un agente con permisos de escritura y tiene credenciales de Git: es un objetivo de mayor riesgo que los sitios.

1. **Acceso:** inicio de sesión propio con **2 usuarios definidos por variables de entorno**, contraseñas con hash `scrypt` (módulo nativo de Node) y cookie de sesión firmada, `HttpOnly`, `Secure`, `SameSite=Strict`. Protección CSRF en operaciones que cambian estado, límite de intentos y bloqueo temporal. Sin restricción por red (decisión 8), el login es la única barrera: contraseñas largas, bloqueo por intentos fallidos y sesiones con caducidad corta. Una capa de acceso en el proxy (Cloudflare Access o IP) queda como mejora opcional.
2. **Secretos fuera del agente:** `runClaude` hoy hereda `process.env`. En el CMS el agente debe recibir un entorno **mínimo** (solo la clave de Anthropic necesaria), **sin** `GH_TOKEN` ni claves SSH. Git, push y PR los hace siempre el orquestador, como ya ocurre.
3. **Aislamiento real del agente:** quitar `git`/`gh` de la lista no basta. Hoy `AGENT_ALLOWED_TOOLS` incluye `Bash(pnpm:*)` y `Bash(node scripts/:*)`, y `pnpm exec`, `pnpm dlx` o un script de `package.json` permiten ejecutar cualquier comando. En el CMS:
   - el agente corre en un proceso aislado (contenedor o usuario del sistema propio) que **no puede leer** las credenciales del orquestador (`~/.config/gh`, claves SSH, variables de Coolify) y sin red de salida salvo la API de Anthropic;
   - `pnpm` se limita a subcomandos concretos (`pnpm --filter <sitio> build|check`, `pnpm lint`), sin `exec`, `dlx` ni `install` de paquetes nuevos;
   - el trabajo sucede en el worktree del trabajo (§9.2), no en el clon principal.
4. **Inyección por material del cliente:** PDFs, chats exportados y documentos son contenido no confiable que el agente lee. Mitigaciones: el aislamiento del punto 3, guardia de alcance (`scopeViolations`) obligatoria, y revisión humana del diff antes de publicar.
5. **Subidas:** validar tipo real (no solo extensión), tamaño, cantidad; nombres saneados (kebab-case); rechazar rutas con `..`; procesar las imágenes rasterizadas siempre re-codificando con `sharp` (descarta metadatos y payloads incrustados); rechazar SVG desde la web (§7.3), que hoy se copian sin procesar.
6. **Rutas y slugs:** todo slug debe cumplir `KEBAB_CASE_REGEX`, no estar en la lista de **subdominios reservados** (`cms`, `www`, `mail`, `api`, `admin`, `coolify`…, porque el slug pasa a ser un subdominio de `nexobite.com`, §12.4) y resolverse **dentro** de `plantillas/`, `clientes/` o `recursos/`; nunca construir rutas con entradas sin validar.
7. **Auditoría:** cada commit lleva como autor a la persona que lo origina (`git commit --author` o `-c user.name/-c user.email` por trabajo; hoy se usa la configuración de git de la máquina); el historial de git es el registro. El trailer del agente y el repositorio de la ficha de Coolify (hoy escritos a fuego en `client-run.mjs`) pasan a configurarse. Los trabajos guardan usuario, hora, costo y resultado.
8. **Cabeceras y transporte:** HTTPS, CSP estricta, `X-Frame-Options` salvo para la vista previa propia, sin indexación (`noindex`).
9. **Cero secretos en Git** (AGENTS §5.1): claves solo como variables de entorno de Coolify.

## 12. Despliegue en el servidor

### 12.1 Imagen propia (`docker/Dockerfile.cms`)

Node 22 + pnpm 9.15, `git`, `gh`, la CLI de `claude`, dependencias del sistema para Chromium de Playwright (QA) y `sharp`. Más pesada que la imagen de Nginx de los sitios; es un solo servicio.

### 12.2 Aplicación en Coolify

- Una app, con dominio propio (`cms.nexobite.com`) y HTTPS. La cookie de sesión **no** lleva atributo `Domain`, para que no viaje a las vistas previas `*.nexobite.com`.
- **Volúmenes persistentes:**
  - `/data/repo`: clon del monorepo.
  - `/data/recursos`: material de clientes (ignorado por Git: **es el único lugar donde viven los originales**, así que debe tener respaldo).
  - `/data/.pipeline`: estado y logs.
  - almacén de pnpm (caché).
- **Variables de entorno (ejemplos de nombre, sin valores):** clave de Anthropic, token de GitHub fine-grained limitado a este repositorio (contenido y pull requests), solo en el orquestador y nunca en el entorno del agente, secreto de sesión, usuarios y hashes, URL del repo, modo de publicación (PR o directo), límites de subida y de gasto.
- Salud: `/healthz`. Arranque: sincroniza el clon (`git fetch`) y valida que las herramientas existan (`git`, `pnpm`, `claude`, `gh`).

### 12.3 Respaldo y recuperación

- Respaldo periódico del volumen de `recursos/` (los originales no están en Git salvo lo que el pipeline sube con `git add -f` en la rama del cliente).
- Todo lo demás se reconstruye desde Git.

### 12.4 Vista previa en servidor

El problema: los sitios usan rutas absolutas (`/images/...`), así que no funcionan bajo un subdirectorio.

- **Decidido (decisión 6):** compilar el borrador a `dist/` y servirlo enrutando por **subdominio directo de `nexobite.com`**: `<slug>.nexobite.com` (p. ej. `la-guaca.nexobite.com`). En Cloudflare se crea un registro comodín `*.nexobite.com` apuntando al servidor, o un registro por cliente (más control, sin exponer slugs no creados). Los registros explícitos (`cms`, `www`, correo…) tienen prioridad sobre el comodín, y los slugs reservados se bloquean (§11.6). El certificado lo cubre Cloudflare (Universal SSL cubre un nivel de subdominio) o, si el tráfico va sin proxy, un certificado comodín de Coolify por desafío DNS. `scripts/lib/static-server.mjs` sirve un único `dist` por proceso (fijado al arrancar); hay que extraer su resolución de rutas a una función que elija el `dist` según la cabecera `Host`, para servir todos los borradores con un solo proceso.
- Cada vista previa exige un build de Astro del sitio: se lanza al pedir la vista previa o al publicar, no en cada guardado.
- Las vistas previas llevan `noindex` y, al ser accesibles solo con el enlace, conviene protegerlas con la misma sesión del CMS o con un acceso de Cloudflare.
- No exponer `astro dev` de los sitios al exterior.

## 13. Cambios en el código existente

1. **Extraer a librerías importables** (hoy son scripts con `main()` y `process.exit`): `optimize-assets`, el parser/serializador de brief, el generador de sitios (`new-client-site`, que además ejecuta código al importarse), la lectura de `paths`. Los scripts quedan como envoltorios finos del CLI para no romper `pnpm cliente:*`.
2. `brief.mjs`: reemplazar la extracción parcial por el parser completo guiado por el esquema, que conserve comentarios; conservar `parseBrief` como compatibilidad.
3. `new-client-site.mjs`: dejar de parchear `site.ts` con regex; escribir `site.json` y copiar el esquema de la plantilla como `cliente.schema.json`.
4. `client-run.mjs`: separar el paso `agent` en **volcado determinista** + **IA opcional**; aceptar un entorno mínimo para el agente; hacer configurables el repositorio de la ficha de Coolify, el trailer y el autor de los commits.
5. `lib/pipeline.mjs`: `runClaude` con `env` explícito y lista de herramientas restringida para el CMS (§11.3); funciones de git que reciban el `cwd` del worktree en lugar de `ROOT_DIR` fijo.
6. `customize-check.mjs`: leer `CLIENT_DOMAIN` desde `site.json` (los JSON ya se revisan) y convertir las imágenes idénticas a la plantilla en error con `--strict`. `plantilla:probe`: exigir que los restos estén solo en los JSON y en `theme.css`.
7. `optimize-assets.mjs`: rechazar SVG que llegue por la web; HEIC no soportado hasta comprobar `sharp` (§7.3).
8. `template-clone.mjs`: la plantilla nueva debe nacer con su `plantilla.schema.json` y su contenido en JSON (la skill `clone-website` y el prompt se actualizan).
9. `verify-isolation.mjs`: regla nueva que prohíbe a los sitios depender de `@apps/*` o `@repo/cms-core`, o importar desde `apps/`; y que cada cliente migrado tenga `cliente.schema.json` válido.
10. `lib/static-server.mjs`: resolución de rutas reutilizable y selección del `dist` por `Host` (§12.4).
11. `docker/Dockerfile`: comprobar `turbo prune` con `apps/*` en el workspace.

## 14. Pruebas y calidad

- **Unitarias** (con `node:test`, sin librerías nuevas): parser y serializador de `.md` (ida y vuelta idéntica, errores por línea), validación de esquema, mapeo md → JSON, saneado de rutas y nombres, optimización de imágenes.
- **Contrato de sitio (CI):** para cada plantilla y cada cliente migrado, su esquema valida su propio `site.json` y `content.json`, y los tipos de `site.ts`/`content.ts` coinciden con el esquema; el build es idéntico al de antes de migrar.
- **Playwright (ya en el stack):** flujos de extremo a extremo: crear con `.md`, arrastrar imágenes, editar y publicar un cliente de prueba, y conflicto de edición entre dos sesiones.
- **Seguridad:** pruebas de subidas hostiles (nombre con `..`, imagen corrupta, archivo enorme, SVG con `<script>`), de acceso sin sesión y de escape del agente (que un `pnpm exec`/`pnpm dlx` o la lectura de credenciales falle dentro del aislamiento).
- `pnpm verify` debe seguir en verde y cubrir `apps/cms` y `@repo/cms-core` (Biome, `astro check`, build).

## 15. Fases, entregables y criterios de aceptación

| Fase | Entrega | Criterio de aceptación |
| :-- | :-- | :-- |
| **0. Cimientos** | Workspaces `apps/cms` y `apps/cms-core`; regla nueva de `verify-isolation`; refactor de scripts a librerías; autenticación; imagen Docker y despliegue "hola mundo" en Coolify con volúmenes. | Login funcional con 2 usuarios; `/healthz` verde; `pnpm cliente:*` sigue igual; un cambio en `apps/` no redespliega ningún cliente; `docker/Dockerfile` sigue construyendo un sitio. |
| **1a. Esquema y datos (plantilla piloto)** | Formato del esquema, `site.json`/`content.json`, validación en build y bloque de tema en **una** plantilla (`pinevalley`). | Build idéntico antes y después; el esquema valida los datos; `cliente:check` lee los JSON. |
| **1b. Esquema y datos (cliente real)** | Migración de `asterre` y de `la-guaca` con su propio `cliente.schema.json` (su `Room` y rutas son distintos de los de asterre). | Build de la-guaca idéntico; su esquema valida sus datos; queda claro qué partes siguen en código. Si esta fase no sale, se replantea la edición de clientes antes de seguir. |
| **2. Crear (MVP)** | Selector, formulario generado, subida a slots, validación de pendientes, trabajo de generación con logs en vivo y agente aislado (§11.3), PR. Sin IA salvo clasificación de fotos. | Un cliente completo se crea desde la web hasta el PR, con `cliente:check --strict` y QA en verde. |
| **3. Importar `.md`** | Parser/serializador con ida y vuelta de `brief.md` y `contenido.md`, plantillas descargables, vista previa de importación con errores por línea. | Un `contenido.md` bien formado puebla todo el contenido editorial; `brief.md` puebla los campos con mapeo declarado; uno malformado señala la línea; exportar e importar no pierde datos (ni comentarios). |
| **4. Editar** | Borradores por rama, bloqueo optimista, vista previa por subdominio, publicación con compuertas, aviso de nueva `schemaVersion` en la plantilla de origen. | Dos personas editan clientes distintos sin interferir y, sobre el mismo, ven el conflicto sin pérdida. |
| **5. Resto de plantillas** | Migración a datos y esquema de `selvra`, `hotellia`, `lunevar`, y creación de contenido y esquema de `_base` (hoy sin `content.ts`); actualización de `plantilla:clonar`. | Todas con build idéntico y contrato en CI en verde. |
| **6. IA opcional y despliegue** | Paso de redacción acotado con tope de gasto; despliegue vía Coolify; respaldos y runbook. | Costo visible y limitado; restauración de `recursos/` probada. |

Orden de riesgo: la **Fase 1a** valida el supuesto más costoso (contenido como datos sin romper nada), y la **1b** valida el más dudoso (que un cliente que ya divergió se pueda describir con un esquema). Conviene cerrar ambas antes de invertir en la UI.

## 16. Documentación y reglas a actualizar al implementar

- **AGENTS.md:** §1 (el principio "sin backend" pasa a valer para los sitios, no para `apps/cms`), §2 (añadir Astro `server` y `@astrojs/node` solo para `apps/cms`; los sitios siguen `static`), §3 (nuevas carpetas `apps/`), §6 (el punto 1 incluye `site.json`, el punto 3 `content.json`, y el esquema del sitio), §9 (nuevos comandos, p. ej. arrancar el CMS en local).
- **CLAUDE.md** (resumen rápido) y las skills `clone-website`, `nuevo-cliente`.
- **Guías:** `02-crear-plantilla.md` (esquema obligatorio), `03-desplegar.md` (las Watch Paths no incluyen `apps/**`), nueva guía de uso del CMS y runbook de operación (respaldo, rotación de claves, alta de usuario).
- **`CUSTOMIZE.md`** de cada plantilla: indicar que se edita por web o por los JSON.

## 17. Riesgos

| Riesgo | Mitigación |
| :-- | :-- |
| Refactor de contenido a JSON rompe plantillas | Migrar de a una, build idéntico como criterio, piloto pequeño primero. |
| Los clientes divergen de su plantilla (la-guaca: componentes, rutas y modelo propios) | Esquema por sitio (§4.2), fase 1b con la-guaca, clientes sin esquema marcados como "solo CLI". |
| El brief no contiene el copy del sitio | Formato `contenido.md` aparte (§6) e IA opcional acotada para pasar de brief a copy. |
| `lunevar` es muy grande y tiene lógica propia | Migrarla al final; permitir "campos avanzados" no editables que se mantienen en código. |
| Agente con acceso a material no confiable y credenciales; `Bash(pnpm:*)` permite ejecutar cualquier cosa | Proceso aislado sin acceso a credenciales ni red, `pnpm` restringido, guardia de alcance y revisión del diff (§11). |
| Un cambio en el CMS redespliega todos los clientes | `cms-core` fuera de `packages/` (§3.1). |
| SVG con scripts y HEIC no soportado | SVG rechazado desde la web; HEIC solo tras comprobar `sharp` en la imagen (§7.3). |
| Solo login como barrera de acceso | Límite de intentos, sesiones cortas, CSP y, si hace falta, Cloudflare Access (§11.1). |
| Costo del agente | IA opcional y acotada, tope por trabajo, costo visible. |
| Pérdida de originales (`recursos/` no está en Git) | Respaldo del volumen y subida a la rama del cliente por el pipeline. |
| Imagen Docker pesada (Chromium + claude + gh) | Aceptable para un solo servicio; separar el QA en un contenedor aparte si crece. |
| Trabajos paralelos sobre un solo clon | `git worktree` por trabajo o cola serializada. |
