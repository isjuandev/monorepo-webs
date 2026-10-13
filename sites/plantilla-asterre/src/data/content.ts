// Contenido de ejemplo de la plantilla. Reemplaza textos e imágenes por los del cliente.
// Las imágenes viven en /public/images; los placeholders SVG se sustituyen por fotos reales.

export const IMAGES = {
  landscape: "/images/placeholder-landscape.svg",
  interior: "/images/placeholder-interior.svg",
  garden: "/images/placeholder-garden.svg",
  sea: "/images/placeholder-sea.svg",
  detail: "/images/placeholder-detail.svg",
  map: "/images/placeholder-map.svg",
} as const;

export interface FeatureItem {
  title: string;
  text: string;
}

export interface DetailGroup {
  label: string;
  items: string[];
}

export interface Room {
  slug: string;
  number: string;
  name: string;
  guests: number;
  size: number;
  view: string;
  bed: string;
  price: number;
  tagline: string;
  overview: string;
  image: string;
  gallery: [string, string, string, string];
  features: FeatureItem[];
  details: DetailGroup[];
}

const DEFAULT_DETAILS: DetailGroup[] = [
  { label: "Lo esencial", items: ["2 huéspedes", "Cama king", "Vista al jardín", "Planta baja"] },
  {
    label: "En la habitación",
    items: ["Terraza privada", "Zona de estar", "Climatización", "Caja fuerte"],
  },
  { label: "Baño", items: ["Ducha a ras de suelo", "Amenities naturales", "Batas y pantuflas"] },
  { label: "Comodidades", items: ["Cortinas blackout", "Servicio de cortesía", "Wi-Fi"] },
  {
    label: "Incluido",
    items: ["Desayuno diario", "Acceso al spa", "Limpieza diaria", "Guarda equipaje"],
  },
];

const DEFAULT_FEATURES: FeatureItem[] = [
  { title: "Terraza privada", text: "Un espacio exterior propio para el café de la mañana." },
  {
    title: "Descanso amplio",
    text: "Cama generosa vestida con lino natural y almohadas a elegir.",
  },
  { title: "Baño de piedra", text: "Ducha amplia revestida en piedra local y luz natural." },
];

export const ROOMS: Room[] = [
  {
    slug: "garden-room",
    number: "01",
    name: "Habitación Jardín",
    guests: 2,
    size: 38,
    view: "Vista al jardín",
    bed: "Cama king",
    price: 180,
    tagline: "Piedra cálida, lino suave y una terraza que abre al jardín.",
    overview: "Interiores luminosos que se abren a una terraza rodeada de árboles y hierbas.",
    image: IMAGES.interior,
    gallery: [IMAGES.interior, IMAGES.detail, IMAGES.garden, IMAGES.landscape],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
  {
    slug: "mountain-suite",
    number: "02",
    name: "Suite Montaña",
    guests: 2,
    size: 54,
    view: "Vista a la montaña",
    bed: "Cama king",
    price: 240,
    tagline: "Ventanales amplios y el perfil de la montaña desde la cama.",
    overview: "Una suite elevada con sala propia y vistas abiertas al valle y las cumbres.",
    image: IMAGES.landscape,
    gallery: [IMAGES.landscape, IMAGES.interior, IMAGES.detail, IMAGES.garden],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
  {
    slug: "pool-suite",
    number: "03",
    name: "Suite Piscina",
    guests: 2,
    size: 62,
    view: "Piscina privada",
    bed: "Cama king",
    price: 320,
    tagline: "Un rincón íntimo con piscina propia y sombra de olivos.",
    overview: "Agua, piedra y madera en una suite pensada para no tener que salir.",
    image: IMAGES.sea,
    gallery: [IMAGES.sea, IMAGES.interior, IMAGES.garden, IMAGES.detail],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
  {
    slug: "casa-principal",
    number: "04",
    name: "Casa Principal",
    guests: 4,
    size: 96,
    view: "Piscina privada",
    bed: "2 camas king",
    price: 420,
    tagline: "Dos dormitorios, cocina abierta y un patio solo para ti.",
    overview: "La casa completa para familias o amigos que buscan espacio y privacidad.",
    image: IMAGES.garden,
    gallery: [IMAGES.garden, IMAGES.interior, IMAGES.sea, IMAGES.detail],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
  {
    slug: "olive-room",
    number: "05",
    name: "Habitación Olivo",
    guests: 2,
    size: 42,
    view: "Vista al olivar",
    bed: "Cama queen",
    price: 200,
    tagline: "Luz filtrada entre olivos y un rincón de lectura junto a la ventana.",
    overview: "Una habitación serena orientada al olivar, ideal para estancias largas.",
    image: IMAGES.detail,
    gallery: [IMAGES.detail, IMAGES.interior, IMAGES.garden, IMAGES.landscape],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
  {
    slug: "horizon-suite",
    number: "06",
    name: "Suite Horizonte",
    guests: 3,
    size: 58,
    view: "Vista al mar",
    bed: "Cama king + sofá cama",
    price: 280,
    tagline: "El mar a lo lejos y atardeceres desde una terraza alta.",
    overview: "Nuestra suite más alta, con terraza orientada al oeste y bañera exenta.",
    image: IMAGES.landscape,
    gallery: [IMAGES.landscape, IMAGES.sea, IMAGES.interior, IMAGES.detail],
    features: DEFAULT_FEATURES,
    details: DEFAULT_DETAILS,
  },
];

export interface Experience {
  id: string;
  label: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  image: string;
  inset: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "bienestar",
    label: "Bienestar",
    title: "Cuerpo y calma",
    text: "Yoga al amanecer, piscina templada y tratamientos privados adaptados a cada huésped.",
    cta: { label: "Reservar sesión", href: "booking" },
    image: IMAGES.interior,
    inset: IMAGES.garden,
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    title: "Sabores de temporada",
    text: "Desayunos en el patio, almuerzos ligeros de la huerta y cenas largas bajo las estrellas.",
    cta: { label: "Ver la carta", href: "#" },
    image: IMAGES.detail,
    inset: IMAGES.interior,
  },
  {
    id: "montana",
    label: "La montaña",
    title: "Senderos y miradores",
    text: "Senderos entre bancales y miradores tranquilos, con rutas para todos los niveles.",
    cta: { label: "Ver rutas", href: "maps" },
    image: IMAGES.landscape,
    inset: IMAGES.garden,
  },
  {
    id: "mar",
    label: "El mar",
    title: "Rumbo a la costa",
    text: "Salidas privadas en barco por la costa, con paradas en calas solo accesibles por mar.",
    cta: { label: "Reservar salida", href: "booking" },
    image: IMAGES.sea,
    inset: IMAGES.landscape,
  },
  {
    id: "vida-local",
    label: "Vida local",
    title: "Oficios de la región",
    text: "Visitas a talleres, productores y mercados para conocer el oficio de la región.",
    cta: { label: "Consultar", href: "contact" },
    image: IMAGES.garden,
    inset: IMAGES.detail,
  },
];

export const PRIVATE_EXPERIENCES = [
  {
    title: "Desayuno al amanecer",
    text: "Una mesa preparada en un mirador mientras despierta el valle.",
    image: IMAGES.landscape,
    ratio: "1 / 1",
  },
  {
    title: "Ruta por la costa",
    text: "Un día en coche por carreteras escénicas con paradas elegidas.",
    image: IMAGES.sea,
    ratio: "332 / 590",
  },
  {
    title: "Cata de aceite",
    text: "Recorrido por una almazara familiar y degustación guiada.",
    image: IMAGES.detail,
    ratio: "3 / 4",
  },
  {
    title: "Noche de estrellas",
    text: "Observación guiada con telescopio lejos de la ciudad.",
    image: IMAGES.garden,
    ratio: "4 / 3",
  },
];

export const PLACES = [
  {
    name: "El pueblo",
    text: "Calles de piedra, mercado semanal y cafés en la plaza.",
    image: IMAGES.garden,
  },
  {
    name: "La costa",
    text: "Calas tranquilas y restaurantes frente al mar a pocos minutos.",
    image: IMAGES.sea,
  },
  {
    name: "El valle",
    text: "Bancales, huertas y miradores para caminar sin prisa.",
    image: IMAGES.landscape,
  },
  {
    name: "La ciudad",
    text: "Casco histórico, tiendas y museos para una escapada de un día.",
    image: IMAGES.detail,
  },
];

export const STAY_INFO = [
  { label: "Check-in", value: "Desde las 15:00" },
  { label: "Check-out", value: "Hasta las 11:00" },
  { label: "Desayuno", value: "7:30 – 11:00" },
  { label: "Traslados", value: "Bajo solicitud" },
  { label: "Niños", value: "Habitaciones familiares" },
  { label: "Mascotas", value: "Consultar" },
];
