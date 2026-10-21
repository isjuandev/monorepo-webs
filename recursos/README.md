# recursos/

Material de cada cliente. Aquí **tú** dejas lo que mande el cliente y el pipeline lo convierte en su sitio: `pnpm cliente:crear <slug>` (o `/nuevo-cliente <slug>` en Claude Code) lo lee para generar `clientes/<slug>/` y abrir el PR. Guía completa: [docs/guias/01-crear-cliente.md](../docs/guias/01-crear-cliente.md).

- [`_plantilla-cliente/`](./_plantilla-cliente/): esqueleto **vacío** (brief sin datos y carpetas) que copia `pnpm cliente:recursos <slug>`.
- [`la-guaca/`](./la-guaca/): **ejemplo relleno** de un cliente real (brief completo, fotos por habitación, marca y fuentes). Sirve de referencia, no se copia: el pipeline avisa si un cliente nuevo conserva sus datos o archivos.

## Flujo

```bash
pnpm cliente:recursos <slug>                  # 1. crea recursos/<slug>/ con el slug escrito en el brief
# 2. deja TODO el material del cliente en recursos/<slug>/entrada/, sin ordenar ni renombrar
pnpm cliente:crear <slug> --intake-only       # 3. (opcional) ordena entrada/, redacta brief.md y preguntas.md
pnpm cliente:crear <slug>                     # 4. genera el sitio y abre el PR (o /nuevo-cliente <slug>)
```

El paso **intake** (skill [`recursos-intake`](../.agents/skills/recursos-intake/SKILL.md)):

- Convierte HEIC y documentos y genera miniaturas en `.intake/`.
- El agente mira cada foto, la copia con su nombre definitivo a `fotos/` o `marca/` y completa `brief.md`.
- Deja en `preguntas.md` lo que solo el cliente puede responder.
- Solo se repite si `entrada/` cambia (o con `--reintake`).
- Si ya sabes un dato, escríbelo en `brief.md`: lo que escribe una persona manda sobre el intake.

`cliente:crear` se detiene si faltan datos obligatorios del brief, si quedan datos o archivos de los ejemplos (La Guaca o la plantilla), o si el dominio es temporal (`*.nexobite.com`). Con `--allow-pending` sigue y los lista en el PR como **provisionales**.

## Estructura

```text
recursos/<slug-cliente>/
├── entrada/                         # bandeja cruda: lo que mande el cliente, tal cual (nunca se sube a Git)
├── .intake/                         # trabajo del intake: índice, miniaturas, clasificación (nunca se sube)
├── brief.md                         # datos, tono, contacto, marca, habitaciones, páginas y FAQ
├── preguntas.md                     # lo que falta, en lenguaje del cliente (lo escribe el intake)
├── marca/
│   ├── logo.webp                    # logo principal (svg, png o webp)
│   ├── logo-mark.webp               # variante corta o isotipo (opcional)
│   ├── favicon.png                  # favicon (svg, o png de 512x512)
│   ├── apple-touch-icon.png         # icono iOS 180x180 (opcional)
│   ├── og-image.jpg                 # imagen para compartir en redes (1200x630)
│   └── fuentes/<familia>-<peso>.woff2
├── fotos/
│   ├── hero/hero-1.webp             # horizontal (escritorio) + hero-1-mobile.webp (vertical)
│   ├── habitaciones/<habitacion>/   # una carpeta por "### " del brief, fotos <habitacion>-01… (la 01 es la portada)
│   ├── instalaciones/               # fachada, recepción, parqueadero, zonas comunes
│   └── galeria/                     # resto de fotos
├── textos/                          # material del cliente ya ordenado (opcional; el intake lee entrada/)
└── referencias/                     # capturas o enlaces de inspiración (solo referencia visual)
```

Con el intake no hace falta tocar `marca/` ni `fotos/` a mano. Si los rellenas tú, sigue las reglas de nombres de abajo.

## Qué hace el pipeline con cada archivo

`pnpm cliente:activos <slug>` (lo ejecuta `cliente:crear`) copia y optimiza hacia `clientes/<slug>/public/` con una convención plana (el nombre se conserva y la carpeta se aplana), y deja el mapa en `clientes/<slug>/docs/assets-manifest.json`:

| En `recursos/<slug>/` | Resultado en `clientes/<slug>/public/` |
| :-- | :-- |
| `fotos/hero/*` | `images/<nombre>.webp` (ancho máx. 2400) |
| `fotos/habitaciones/<hab>/*` | `images/<nombre>.webp` (ancho máx. 1600) |
| `fotos/instalaciones/*`, `fotos/galeria/*` | `images/<nombre>.webp` (ancho máx. 1600) |
| `marca/logo*` y otras imágenes de `marca/` | `images/<nombre>.webp` (svg: copia en `images/`) |
| `marca/favicon*`, `marca/apple-touch-icon*` | `public/` tal cual |
| `marca/og-image.*` | `images/og-image.jpg` recortada a 1200x630 |
| `marca/fuentes/*.woff2` | `fonts/` |

Como todo acaba en `images/`, dos archivos no pueden llamarse igual en carpetas distintas (por eso las fotos de habitación llevan el prefijo de la habitación). Si pasa, el segundo se omite y se avisa.
| `brief.md`, `textos/`, `referencias/` | no se copian: el agente solo los lee |
| `entrada/`, `.intake/` | se ignoran: el intake ya copió lo útil a `fotos/` y `marca/` |

Formatos de foto aceptados: jpg, png, webp, avif y tiff. HEIC (iPhone) no: expórtalo a JPG antes.

## Reglas

- **Nombres:** `kebab-case`, sin espacios, tildes ni `ñ` (`vip-love-01.webp`, no `VIP Love 1.JPG`). El pipeline normaliza, pero así el brief y las carpetas coinciden.
- **Habitaciones:** el nombre de la carpeta es el slug del título `### ` del brief (`### Presidencial Oro` → `presidencial-oro/`). De ahí salen la URL (`/habitaciones/presidencial-oro`) y las rutas de QA.
- **Orden de fotos:** numera con dos dígitos (`-01`, `-02`…); la `-01` es la portada de la habitación.
- **Escritorio y móvil:** si una foto necesita encuadre vertical en móvil, súbela con el mismo nombre y el sufijo `-mobile`.
- **Calidad:** sube los originales de mejor calidad; el pipeline los comprime. Si solo hay versiones comprimidas, dilo en el brief (`Marca → Originales en alta`).
- **Datos:** lo que no sepas, déjalo vacío o escribe `Pendiente`. Nunca un dato inventado ni "de ejemplo".
- **Sin secretos:** nada de contraseñas, tokens ni datos bancarios.
- **Solo lectura:** nadie borra ni modifica `entrada/`. El intake solo escribe `brief.md`, `preguntas.md`, `.intake/` y copias ordenadas en `fotos/` y `marca/`.

## Git

El contenido de cada cliente está ignorado por Git (pesado y de terceros). Se versionan este `README.md`, `_plantilla-cliente/` y el ejemplo `la-guaca/`. Los recursos de un cliente nuevo se suben forzados (`git add -f`) solo en su rama `cliente/<slug>`, y **sin** `entrada/` ni `.intake/` (`cliente:crear` lo hace en el paso `recursos`).

## Checklist antes de lanzar (si no usas el intake)

- [ ] `brief.md`: los 6 campos de **Generación** completos (sin `Pendiente`) y ningún dato de La Guaca.
- [ ] Una carpeta en `fotos/habitaciones/` por cada `### ` del brief, con el mismo slug.
- [ ] `marca/` con logo, favicon y og-image del cliente.
- [ ] Fuentes en `marca/fuentes/` si la marca usa tipografías propias (y su licencia indicada en el brief).
- [ ] `pnpm cliente:crear <slug> --dry-run` sin errores de preflight.
