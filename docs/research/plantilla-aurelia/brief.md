# Research & Brief de Clonación: Aurelia Resort

- **URL de Origen:** `https://aurelia-template.framer.website`
- **Slug del Cliente / Plantilla:** `plantilla-aurelia`
- **Carpeta Local:** `sites/plantilla-aurelia/`
- **Nombre Comercial:** Aurelia Resort
- **Dominio de Producción / Base:** `aurelia.example.com`
- **Modo de Contenido:** **B — Fiel 1:1** (autorizado por el usuario con licencias de imagen completas descargadas al repo).

---

## 1. Inventario de Rutas y Mapeo Local

| Ruta de Origen | Ruta Local | Archivo Astro | Estado |
|---|---|---|---|
| `/` | `/` | `src/pages/index.astro` | En alcance |
| `/rooms` | `/rooms` | `src/pages/rooms/index.astro` | En alcance |
| `/rooms/tropical-garden-suite` | `/rooms/tropical-garden-suite` | `src/pages/rooms/[slug].astro` | En alcance |
| `/rooms/infinity-pool-villa` | `/rooms/infinity-pool-villa` | `src/pages/rooms/[slug].astro` | En alcance |
| `/rooms/sunset-premium-ocean-suite` | `/rooms/sunset-premium-ocean-suite` | `src/pages/rooms/[slug].astro` | En alcance |
| `/rooms/sunset-premium-ocean-suite-copy` | `/rooms/sunset-premium-ocean-suite-copy` | `src/pages/rooms/[slug].astro` | En alcance |
| `/rooms/sunset-premium-ocean-suite-copy-copy` | `/rooms/sunset-premium-ocean-suite-copy-copy` | `src/pages/rooms/[slug].astro` | En alcance |
| `/rooms/sunset-premium-ocean-suite-copy-copy-copy` | `/rooms/sunset-premium-ocean-suite-copy-copy-copy` | `src/pages/rooms/[slug].astro` | En alcance |
| `/services` | `/services` | `src/pages/services.astro` | En alcance |
| `/gallery` | `/gallery` | `src/pages/gallery.astro` | En alcance |
| `/contact` | `/contact` | `src/pages/contact.astro` | En alcance |
| — | `/404` | `src/pages/404.astro` | En alcance (técnica) |
| — | `/robots.txt` | `src/pages/robots.txt.ts` | En alcance (técnica) |

---

## 2. Tipografía y Estilos Medidos

### Tipografías
- **Display / Headings (h1 - h5):** `"Cormorant Garamond"`, serif
  - Pesos: 500, 600, 700.
  - Archivos locales WOFF2: `/fonts/cormorant-garamond-500.woff2`, `600.woff2`, `700.woff2`, `italic.woff2`.
- **Textos / UI / Navegación / Badges:** `"Manrope"`, sans-serif
  - Pesos: 400, 500, 600, 700, 800.
  - Archivos locales WOFF2: `/fonts/manrope-400.woff2`, `500.woff2`, `600.woff2`, `700.woff2`, `800.woff2`.
- **Botones / Acentos alternativos:** `"Inter"`, sans-serif
  - Pesos: 700, 800, 900.
  - Archivos locales WOFF2: `/fonts/inter-700.woff2`, `800.woff2`, `900.woff2`.

### Jerarquía Tipográfica Computada
- `h1` Hero: 80px (desktop) / 44px (mobile), weight 500, line-height: 1.05.
- `h2` Section title: 64px (desktop) / 36px (mobile), weight 600, line-height: 1.15.
- `h3` Section subtitle: 44px, weight 600.
- `h4` Card title / Feature: 36px, weight 700.
- `h5` Room name: 28px, weight 700.
- Overlines / Badges: 13px, uppercase, tracking `0.15em` (`1.95px`), weight 600.
- Body paragraphs: 16px - 17px, line-height: 1.7, weight 400.

### Paleta de Colores
- `--color-primary`: `#1e2a24` (Verde bosque profundo de lujo).
- `--color-secondary`: `#24332c` (Verde bosque medio).
- `--color-accent`: `#bf9e65` (Dorado suave / arena cálida ibicenca).
- `--color-accent-hover`: `#ad8a51`.
- `--color-cream`: `#f8f5f0` (Crema / blanco roto suave para fondos claros).
- `--color-sand`: `#eee7dd` (Arena suave para tarjetas y sección FAQ).
- `--color-bg`: `#ffffff` (Blanco base).
- `--color-text`: `#1e2a24` (Texto principal en fondos claros).
- `--color-text-muted`: `#667069` (Texto secundario / descriptivo).
- `--color-text-light`: `#ffffff` (Texto en fondos oscuros).
- `--color-border`: `rgba(30, 42, 36, 0.12)` / `rgba(255, 255, 255, 0.15)`.

### Layout y Geometría
- Contenedor máximo: `1280px` (con padding lateral de `24px` en desktop y `16px` en mobile).
- Ancho de tarjetas de habitaciones: 3 columnas en desktop (`~370px`), 1 columna en mobile.
- Bordes redondeados: `var(--radius-sm): 4px`, `var(--radius-md): 8px`, `var(--radius-lg): 16px`.

---

## 3. Inventario de Secciones por Página

### 3.1. Homepage (`/`)
1. **Header / Barra Superior:**
   - Barra secundaria superior: Ubicación ("Ibiza, Spain") y Teléfono ("+34 971 123 456").
   - Logo Aurelia (`/icons/logo.svg`).
   - Menú principal: HOME, ROOMS, SERVICES, GALLERY, CONTACT.
   - Botón CTA: "Book Now".
   - Versión móvil con botón hamburguesa y cajón desplegable suave.
2. **Hero:**
   - Badge: "WELCOME TO AURELIA"
   - Título: "Experience Timeless Luxury"
   - Subtítulo: "Aurelia is where elegance meets comfort. Discover a peaceful sanctuary surrounded by Mediterranean beauty."
   - Background Image: `/images/X2OmMfETcWH9nQhEhQes4qxoshI.jpg` con overlay sutil.
   - Formulario de Reserva en el Hero (Name, Email, Room Type, Check In, Check Out, Adults, Children, "Request Booking").
3. **About ("More than just a destination"):**
   - Overline: "AURELIA RESORT, IBIZA"
   - Título: "More than just a destination"
   - Descripción detallada sobre la esencia de Ibiza y el confort de clase mundial.
   - Firma dorada: `/icons/crest.svg`.
   - Imagen lateral: `/images/B9TgZKFojhZcITmuAoyhovIoabg.jpg`.
4. **CTA Banner:**
   - Fondo: `#1e2a24`
   - Texto: "Luxury stays, unforgettable moments, and the true spirit of Ibiza."
   - Botón: "Book Now".
5. **Featured Rooms:**
   - Overline: "LUXURY SUITES & VILLAS"
   - Título: "Featured Rooms"
   - Enlace: "All Rooms"
   - Descripción.
   - 3 Tarjetas de habitaciones destacadas (Tropical Garden Suite, Infinity Pool Villa, Sunset Premium Ocean Suite) con imagen, precio, especificaciones (m², cama, huéspedes) y botón "Explore Room".
6. **Beyond Your Stay (Servicios):**
   - Fondo: `#1e2a24`
   - Overline: "THE AURELIA EXPERIENCE"
   - Título: "Beyond Your Stay"
   - 3 Columnas/Tarjetas: Wellness & Spa, Sunset Dining, Private Experiences, con icono SVG en máscara dorada, título, descripción y horarios.
7. **A Glimpse of Aurelia (Galería):**
   - Fondo: `#f8f5f0`
   - Overline: "HIGHLIGHTS"
   - Título: "A Glimpse of Aurelia"
   - Cuadrícula de fotos seleccionadas en alta resolución.
8. **Reviews (Testimonios):**
   - 3 citas de huéspedes verificados de TripAdvisor, Google Reviews y Booking.com.
9. **FAQ (Before Your Stay):**
   - Fondo: `#eee7dd`
   - Overline: "FAQ"
   - Título: "Before Your Stay"
   - 6 Acordeones interactivos accesibles con apertura/cierre animado.
10. **Footer:**
    - Imagen de fondo / banner: `/images/oWJA0iz6yvn8OvIhxFQ2UQRM.jpg`.
    - Columnas de dirección, contacto, redes sociales, enlaces a páginas y copyright.

### 3.2. Página de Habitaciones (`/rooms`)
- Hero de página: "LUXURY SUITES & VILLAS" -> "Our Rooms".
- Cuadrícula con las 6 habitaciones completas:
  1. Tropical Garden Suite ($239, 85m², Kingsize Bed, 6 guests)
  2. Infinity Pool Villa ($349, 120m², Kingsize Bed, 4 guests)
  3. Sunset Premium Ocean Suite ($289, 75m², Kingsize Bed, 2 guests)
  4. Coastal Breeze Suite ($229, 59m², Double bed, 2 guests)
  5. Executive Ocean Residence ($179, 64m², Single bed, 2 guests)
  6. Private Garden Villa ($189, 59m², Queensize bed, 4 guests)
- Testimonios y FAQ.

### 3.3. Detalle de Habitación (`/rooms/[slug]`)
- Título y descripción de la habitación.
- Widget lateral interactivo de reserva (Name, Email, Check-in, Check-out, Guests).
- Galería de 3 fotos con distribución característica (1 foto grande 2:1 a la izquierda, 2 fotos apiladas a la derecha).
- Sección "About [Room]": precio por noche, especificaciones técnicas y descripción.
- "Hotel Amenities": 8 comodidades con iconos SVG dorados (Air Conditioning, Breakfast Included, Minibar, High-Speed Wi-Fi, Daily Housekeeping, Streaming Services, Smart Room Access, In-room Safe).
- Banner CTA de reserva.
- "Other Rooms": carrusel o cuadrícula con las demás suites.
- Testimonios y FAQ.

### 3.4. Servicios (`/services`)
- Hero: "Where Luxury Feels Natural".
- Introducción: "Where Moments Become Memories".
- 3 bloques ampliados de servicios con imágenes duales en alta definición:
  - Sunset Dining: menú, horarios de cena y bar al atardecer.
  - Private Experiences: charters privados en yate, tours por la isla, picnics románticos.
  - Wellness & Spa: masajes reconstituyentes, tratamientos faciales, horarios diarios.
- Testimonios y FAQ.

### 3.5. Galería (`/gallery`)
- Hero: "A Glimpse of Aurelia".
- Cuadrícula completa con las 14 fotografías en alta definición.

### 3.6. Contacto (`/contact`)
- Hero: "Get in Touch".
- Formulario de contacto funcional (Name, Email, Subject, Message, botón "Send message").
- Sección "OUR LOCATION" con teléfono, email y dirección en Santa Eulària des Riu, Ibiza.
- Mapa visual de ubicación interactivo.
- Banner CTA y FAQ.

---

## 4. Inventario de Animaciones e Interacciones

| Elemento | Disparador | Propiedades que cambian | Duración / Easing | Retardo | Reversible / Repetición |
|---|---|---|---|---|---|
| Carga inicial (Hero) | Carga de página | `opacity: 0 -> 1`, `transform: translateY(24px) -> 0` | 0.8s ease-out | 0.1s - 0.3s | No |
| Scroll Reveal (Secciones) | `IntersectionObserver` | `opacity: 0 -> 1`, `transform: translateY(20px) -> 0` | 0.6s ease-out | 0.05s escalonado | Respeta `prefers-reduced-motion` |
| Hover Tarjeta de Habitación | Pointer hover | `transform: scale(1.02)`, `box-shadow` | 0.3s ease | 0s | Sí |
| Botones primarios | Pointer hover | `background-color`, `transform: translateY(-1px)` | 0.2s ease | 0s | Sí |
| Acordeón FAQ | Clic | `max-height: 0 -> 300px`, `opacity: 0 -> 1`, rotación de icono `+` -> `×` (o 45deg) | 0.3s cubic-bezier(0.4, 0, 0.2, 1) | 0s | Sí |
| Menú Móvil | Clic en hamburguesa | `transform: translateY(0)`, `opacity: 1`, blur de fondo | 0.35s cubic-bezier(0.16, 1, 0.3, 1) | 0s | Sí |
| Formulario de Reserva | Focus en inputs | `border-color: var(--color-accent)`, `outline: none` | 0.2s ease | 0s | Sí |

---

## 5. Mapeo de Assets Locales

- **Fuentes:** 12 archivos WOFF2 en `/fonts/` (`cormorant-garamond-*.woff2`, `manrope-*.woff2`, `inter-*.woff2`).
- **Iconos:** 16 archivos SVG en `/icons/` (`logo.svg`, `crest.svg`, comodidades y servicios).
- **Imágenes:** 24 imágenes en alta resolución en `/images/` (fotografías de suites, interiores, vistas al mar, restaurante y spa).
