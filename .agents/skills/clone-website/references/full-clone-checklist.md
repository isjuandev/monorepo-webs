# Clonación completa: inventario, construcción, comparación y entrega

Úsalo junto con [SKILL.md](../SKILL.md). Nada se da por terminado hasta cumplir la lista final (sección 8). Si algo no se puede verificar, dilo explícitamente: no uses "listo", "100%" ni "pixel-perfect" sin evidencia.

## 0. Datos de entrada

- URL principal, `slug-cliente` (kebab-case), nombre comercial y dominio de producción.
- **Modo de contenido** (si el usuario no elige, usa A):
  - **A — Plantilla:** conserva estructura, layout, estilos y comportamiento; textos, precios, teléfonos y direcciones de ejemplo; imágenes como marcadores de posición.
  - **B — Fiel:** textos, imágenes y videos reales de la fuente. Solo si el usuario confirma que tiene permiso del dueño.

## 1. Inventario completo ANTES de construir

Guárdalo en `plantillas/<slug>/docs/brief.md`.

### 1.1 Rutas y subpáginas
- Descarga y lee `/sitemap.xml` y `/robots.txt` de la fuente.
- Extrae los enlaces internos del menú, header, footer y cuerpo. Revisa blog, colecciones, políticas, 404 y páginas ocultas.
- Tabla: ruta de origen → ruta local → archivo que la implementa.
- Visita cada ruta en desktop (1440x900) y mobile (390x844).
- Una ruta queda fuera de alcance solo si el usuario lo aprueba, y debe constar en el brief.

### 1.2 Secciones por página
- Orden de secciones, jerarquía de encabezados y textos.
- Todos los enlaces con su destino (internos, WhatsApp, redes, mapas, `tel:`, `mailto:`).
- Formularios, campos y destino del envío.

### 1.3 Estilo medido, no estimado
- Estilos computados reales: tipografías (familia, tamaño, peso, interlineado, tracking), colores, espaciados, anchos máximos, radios y sombras, en desktop, tablet y mobile.
- Fuentes que carga la página. Si tienen licencia (Typekit, Adobe), usa un fallback y regístralo.
- Breakpoints reales.

### 1.4 Inventario de animaciones e interacciones (una fila por cada una)

Registra: elemento, disparador (carga, scroll, hover, clic, tiempo), propiedades que cambian, duración, curva, retardo, y si se repite o es reversible. Revisa como mínimo:

- Animaciones al cargar la página.
- Aparición por scroll de textos, imágenes y botones.
- Parallax, fondos fijos y secciones pegajosas (sticky).
- Header: estático, fijo o con cambios al hacer scroll.
- Menús (desktop y mobile), acordeones, tabs, carruseles, sliders.
- Visores o lightbox de imágenes.
- Hover de botones, enlaces, tarjetas e imágenes.
- Marquesinas y textos en movimiento (mide la velocidad real).
- Videos de fondo, autoplay y loop.
- Contadores, cursores personalizados, transiciones entre páginas.

Lee los keyframes y transiciones del CSS y los atributos tipo `data-animation`; no lo deduzcas de una sola captura. Usa entrada real (rueda, teclado, puntero): el scroll programado no activa lo mismo. Si una medición no es concluyente, anótala como "no verificado".

### 1.5 Assets
- Tabla: URL de origen → ruta local en `plantillas/<slug>/public/` → tipo y dimensiones reales (un `.png` puede ser AVIF).
- Incluye favicon, `og:image`, logos, imágenes, videos y SVG. En modo A usa marcadores de posición y anótalo.

### 1.6 SEO por página
- `title`, `meta description`, canonical, Open Graph, Twitter, `lang`, datos estructurados (JSON-LD).
- Recréalos con `siteConfig`; no hardcodees el dominio.

## 2. Construcción

- Crea el sitio con `pnpm cliente:nuevo <slug> --name "<nombre>" --domain "<dominio>"`. No toques `plantillas/_base`.
- Ejecuta `pnpm install` después de crearlo (el generador puede omitirlo) para actualizar el lockfile.
- Respeta el stack cerrado de [AGENTS.md](../../../../AGENTS.md): sin librerías nuevas sin autorización, TypeScript estricto, sin `any`, Biome, imports con alias `@/`.
- `.astro` por defecto; Preact solo para interacción con estado, con `client:visible` o `client:idle` salvo que esté sobre el pliegue.
- Datos y textos en `src/data`, no incrustados en los componentes.
- Cada fila del inventario 1.4 se implementa con CSS, `IntersectionObserver` o vanilla JS solo si hace falta.
- Todas las animaciones respetan `prefers-reduced-motion` y limpian sus listeners.
- Accesibilidad: foco visible, teclado, `aria` correcto, contraste, `alt` en imágenes; visores con Esc y devolución del foco.
- Responsive real en desktop, tablet y mobile, sin overflow horizontal.
- Mantén `robots.txt.ts`, `sitemap()`, `<SEO />` y `404.astro`.

## 3. Comparación (por ruta y por viewport)

- Abre fuente y versión local con el mismo viewport, scroll y estado.
- Compara geometría, tipografía, colores, espaciados y recorte de imágenes; corrige primero las mayores diferencias.
- Compara cada animación en estado inicial, activo y final, y también al revertir el scroll.
- Prueba un viewport más ancho que el diseño (1920).
- Guarda capturas en `plantillas/<slug>/docs/referencias/` y snapshots en `plantillas/<slug>/docs/referencias/snapshots/`.

## 4. Validación automática

Reporta el resultado real de cada comando:

```bash
pnpm verify:isolation
pnpm lint
pnpm --filter @plantillas/<slug> check
pnpm --filter @plantillas/<slug> build
QA_ROUTES="<rutas separadas por coma>" SITE_FOLDER=<slug> pnpm test:visual
```

Además, prueba las interacciones (visores, menús, formularios, animaciones por scroll, movimiento reducido) con Playwright. Si el test es temporal, bórralo después.

## 5. Entrega y Git

- Rama nueva desde `main` actualizado: `git fetch && git checkout -b feat/<slug> origin/main`.
- Verifica que `git status` quede limpio y que no haya secretos.
- Antes del PR haz `git fetch` y confirma que no hay conflictos con `main`. Si un PR anterior se fusionó con squash, basa la rama nueva en `origin/main`, no en la rama vieja.
- Abre el PR hacia `main` con [la plantilla del repo](../../../../.github/PULL_REQUEST_TEMPLATE.md). Si el CI de GitHub está pausado, indica que la validación fue local.
- No hagas merge, deploy ni cambios en Coolify sin confirmación del usuario.

## 6. Prohibiciones

- No omitir subpáginas ni animaciones sin avisar.
- No copiar texto, fotos ni datos de un negocio real en modo A.
- No instalar librerías fuera del stack.
- No marcar nada como completado sin la evidencia de la sección 8.

## 7. Formato del reporte final

Instrucciones de ejecución local, tabla de rutas, tabla de animaciones (original → implementación), diferencias conocidas, comandos ejecutados con su resultado y enlace del PR.

## 8. Lista de verificación final (presentar marcada y con evidencia)

- [ ] Todas las rutas del sitemap y la navegación están clonadas (tabla fuente → local).
- [ ] Cada sección de cada página está construida, con su orden y sus estados.
- [ ] Inventario de animaciones completo; cada fila implementada o marcada "no verificado/fuera de alcance" con motivo.
- [ ] Tipografías, colores y espaciados medidos y aplicados; fuentes con licencia documentadas.
- [ ] Assets mapeados; en modo A, marcadores de posición declarados.
- [ ] SEO por página (title, description, canonical, OG, JSON-LD) y 404.
- [ ] Formularios y enlaces funcionan y apuntan al destino correcto.
- [ ] Comparación fuente vs local hecha por ruta y viewport, con capturas guardadas.
- [ ] `verify:isolation`, `lint`, `check`, `build` y `test:visual` pasan, con salida adjunta.
- [ ] Prueba de interacciones y de movimiento reducido pasa.
- [ ] Brief completo en `plantillas/<slug>/docs/brief.md`, con diferencias conocidas.
- [ ] Rama y PR sin conflictos hacia `main`.
