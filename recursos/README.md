# recursos/

Entrada manual del material de cada cliente. Aquí **tú** dejas datos, logos, fotos y textos. `pnpm client:run <slug>` los lee para generar `sites/<slug>/` y abrir el PR.

> **Ejemplo de referencia completo: [`recursos/la-guaca/`](./la-guaca/)** (motel, 9 habitaciones, sitio publicado en `sites/la-guaca/`). Cuando dudes de cómo nombrar o dónde poner algo, copia lo que hace La Guaca. La plantilla vacía es [`_plantilla-cliente/`](./_plantilla-cliente/).

## Flujo

```bash
pnpm recursos:new <slug-cliente>                 # 1. crea la carpeta con el brief y el slug ya escrito
# 2. rellena brief.md y deja los archivos en sus carpetas (abajo)
pnpm client:run <slug-cliente> --dry-run         # 3. valida el brief y muestra el plan
pnpm client:run <slug-cliente>                   # 4. genera el sitio y abre el PR
```

Si el dominio aún es temporal (`*.nexobite.com`), añade `--allow-pending`. Alternativa manual: `pnpm client-prompt <slug-cliente>` copia el prompt para pegarlo en Claude.

## Estructura (tal como está en La Guaca)

```text
recursos/<slug-cliente>/
├── brief.md                         # datos, tono, contacto, marca, habitaciones, páginas y FAQ
├── marca/
│   ├── logo.webp                    # logo principal (svg, png o webp)
│   ├── logo-mark.webp               # variante corta o isotipo (opcional)
│   ├── favicon.png                  # favicon (svg, o png de 512x512 si existe; La Guaca usa 64x64)
│   ├── apple-touch-icon.png         # icono iOS 180x180 (opcional)
│   ├── og-image.jpg                 # imagen para compartir en redes (1200x630)
│   └── fuentes/
│       ├── forum-400.woff2          # <familia>-<peso>.woff2
│       └── almarai-400.woff2
├── fotos/
│   ├── hero/
│   │   ├── hero-1.webp              # horizontal (escritorio)
│   │   ├── hero-1-mobile.webp       # vertical (móvil), mismo número
│   │   └── …                        # hero-2, hero-3…
│   ├── habitaciones/
│   │   ├── junior/                  # una carpeta por habitación = slug del "### " del brief
│   │   │   ├── junior-01.webp       # <habitacion>-01, -02…; la 01 es la portada
│   │   │   └── …
│   │   └── vip-love-decorada/
│   │       └── vip-love-decorada-01.webp
│   ├── instalaciones/
│   │   ├── fachada.webp             # fachada, recepción, parqueadero, zonas comunes
│   │   └── fachada-mobile.webp
│   └── galeria/                     # resto de fotos que no son de una habitación
├── textos/                          # material del cliente: carta, tarifas, FAQ, políticas (.md, .txt, .docx, .pdf)
└── referencias/                     # capturas o enlaces de inspiración (solo referencia visual)
```

Las carpetas vacías se dejan (La Guaca tiene `galeria/`, `textos/` y `referencias/` vacías): el agente las marca como pendientes.

## Qué hace el pipeline con cada archivo

`pnpm optimize-assets <slug>` (lo ejecuta `client:run`) copia y optimiza hacia `sites/<slug>/public/`, y deja el mapa en `docs/research/<slug>/assets-manifest.json`:

| En `recursos/<slug>/` | Resultado en `sites/<slug>/public/` |
| :-- | :-- |
| `fotos/hero/*` | `images/hero/*.webp` (ancho máx. 2400) |
| `fotos/habitaciones/<hab>/*` | `images/habitaciones/<hab>/*.webp` (ancho máx. 1600) |
| `fotos/instalaciones/*`, `fotos/galeria/*` | `images/<carpeta>/*.webp` (ancho máx. 1600) |
| `marca/logo*`, otras imágenes de `marca/` | `images/marca/*.webp` (svg: copia tal cual en `public/`) |
| `marca/favicon*`, `marca/apple-touch-icon*` | `public/` tal cual |
| `marca/og-image.*` | `og-image.jpg` recortada a 1200x630 |
| `marca/fuentes/*.woff2` | `fonts/` |
| `brief.md`, `textos/`, `referencias/` | no se copian: el agente solo los lee |

Formatos de foto aceptados: jpg, png, webp, avif y tiff. HEIC (iPhone) no: expórtalo a JPG antes.

## Reglas

- **Nombres:** `kebab-case`, sin espacios, tildes ni `ñ` (`vip-love-01.webp`, no `VIP Love 1.JPG`). El pipeline normaliza, pero así el brief y las carpetas coinciden.
- **Habitaciones:** el nombre de la carpeta es el slug del título `### ` del brief (`### Presidencial Oro` → `presidencial-oro/`). De ahí salen la URL (`/habitaciones/presidencial-oro`) y las rutas de QA.
- **Orden de fotos:** numera con dos dígitos (`-01`, `-02`…); la `-01` es la portada de la habitación.
- **Escritorio y móvil:** si una foto necesita encuadre vertical en móvil, súbela con el mismo nombre y el sufijo `-mobile`.
- **Calidad:** sube los originales de mejor calidad; el pipeline los comprime. Si solo hay versiones comprimidas, dilo en el brief (`Marca → Originales en alta`).
- **Datos:** lo que no sepas, déjalo vacío o escribe `Pendiente`. Nunca un dato inventado ni "de ejemplo".
- **Sin secretos:** nada de contraseñas, tokens ni datos bancarios.
- **Solo lectura:** nadie (ni el agente ni el pipeline) modifica ni borra estas carpetas; solo se leen.

## Git

El contenido de cada cliente está ignorado por Git (pesado y de terceros). Se versionan este `README.md`, `_plantilla-cliente/` y el ejemplo `la-guaca/`. Los recursos de un cliente nuevo se suben forzados (`git add -f`) solo en su rama `cliente/<slug>` (`client:run` lo hace en el paso `recursos`).

## Checklist antes de lanzar

- [ ] `brief.md`: los 6 campos de **Generación** completos (sin `Pendiente`).
- [ ] Una carpeta en `fotos/habitaciones/` por cada `### ` del brief, con el mismo slug.
- [ ] `marca/` con al menos logo, favicon y og-image.
- [ ] Fuentes en `marca/fuentes/` si la marca usa tipografías propias (y su licencia indicada en el brief).
- [ ] `pnpm client:run <slug> --dry-run` sin errores de preflight.
