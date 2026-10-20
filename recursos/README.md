# recursos/

Entrada manual del material de cada cliente. Aquí **tú** dejas datos, logos, fotos y textos. `pnpm client:run <slug>` los lee para generar `sites/<slug>/` y abrir el PR.

> **La plantilla es La Guaca, literal.** [`_plantilla-cliente/`](./_plantilla-cliente/) es una copia exacta de [`la-guaca/`](./la-guaca/): brief relleno, 9 habitaciones con fotos, marca y fuentes. Su sitio [`sites/la-guaca/`](../sites/la-guaca/) es la plantilla base (`Plantilla base: la-guaca`). Cada cliente nuevo nace como La Guaca y se reemplaza **todo**: datos, fotos, logos y fuentes.

## Flujo

```bash
pnpm recursos:new <slug-cliente>                 # 1. copia la plantilla (La Guaca) y escribe el slug
# 2. reemplaza el brief y los archivos de La Guaca por los del cliente (abajo)
pnpm client:run <slug-cliente> --dry-run         # 3. valida el brief y muestra el plan
pnpm client:run <slug-cliente>                   # 4. genera el sitio y abre el PR
```

`client:run` se detiene si quedan datos de identidad o contacto de La Guaca en el brief (nombre, dominio, teléfono, WhatsApp, correo, dirección, mapa, redes) o archivos idénticos a los de la plantilla. Con `--allow-pending` sigue y los lista en el PR como **provisionales** (útil si aún no tienes las fotos del cliente). Lo mismo con un dominio temporal (`*.nexobite.com`). Alternativa manual: `pnpm client-prompt <slug-cliente>` copia el prompt para pegarlo en Claude.

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

Las carpetas vacías se dejan (La Guaca tiene `galeria/`, `textos/` y `referencias/` vacías): el agente las marca como pendientes. Si el cliente tiene otras habitaciones, borra las carpetas de La Guaca que no apliquen y crea las suyas.

**Mantén los nombres de archivo de La Guaca** cuando el papel sea el mismo (`logo.webp`, `logo-mark.webp`, `og-image.jpg`, `favicon.png`, `hero-1.webp`/`hero-1-mobile.webp`, `fachada.webp`, `forum-400.woff2`…). El sitio de la plantilla ya los referencia, así que al optimizar reemplazan las imágenes de La Guaca sin tocar código. Una fuente distinta (otra familia) sí exige cambiar `theme.css`; eso lo hace el agente.

## Qué hace el pipeline con cada archivo

`pnpm optimize-assets <slug>` (lo ejecuta `client:run`) copia y optimiza hacia `sites/<slug>/public/` con la convención plana de La Guaca (el nombre se conserva y la carpeta se aplana), y deja el mapa en `docs/research/<slug>/assets-manifest.json`. Con los recursos de La Guaca produce exactamente su `public/`:

| En `recursos/<slug>/` | Resultado en `sites/<slug>/public/` |
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

El contenido de cada cliente está ignorado por Git (pesado y de terceros). Se versionan este `README.md`, `_plantilla-cliente/` y `la-guaca/` (el cliente de origen de la plantilla). Si actualizas La Guaca y quieres que la plantilla cambie también, copia `la-guaca/` sobre `_plantilla-cliente/` y vuelve a ajustar la cabecera del brief. Los recursos de un cliente nuevo se suben forzados (`git add -f`) solo en su rama `cliente/<slug>` (`client:run` lo hace en el paso `recursos`).

## Checklist antes de lanzar

- [ ] `brief.md`: los 6 campos de **Generación** completos (sin `Pendiente`) y ningún dato de La Guaca.
- [ ] Una carpeta en `fotos/habitaciones/` por cada `### ` del brief, con el mismo slug.
- [ ] `marca/` con logo, favicon y og-image del cliente (no los de La Guaca).
- [ ] Fuentes en `marca/fuentes/` si la marca usa tipografías propias (y su licencia indicada en el brief).
- [ ] `pnpm client:run <slug> --dry-run` sin errores de preflight.
