// Contenido de ejemplo de la plantilla. Reemplaza textos e imágenes por los del cliente.
// Fotos de la plantilla de origen (usadas con licencia); viven en /public/images.

import { buildWhatsAppUrl } from "@repo/utils";
import { siteConfig } from "@/config/site";

const img = (name: string) => `/images/${name}.webp`;

/** Mensajes prellenados de WhatsApp; el número sale de siteConfig.contact.whatsapp */
export const WHATSAPP_MESSAGES = {
  general: `Hola, quiero consultar disponibilidad en ${siteConfig.name}.`,
};

/** Enlace a WhatsApp con mensaje; sin número configurado, cae en el motor de reservas */
export const whatsappUrl = (message: string = WHATSAPP_MESSAGES.general) =>
  siteConfig.contact.whatsapp
    ? buildWhatsAppUrl(siteConfig.contact.whatsapp, message)
    : siteConfig.bookingUrl;

export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export const IMAGES = {
  homeHero: img("home-hero"),
  homeIntro: img("home-intro"),
  homeWellness: img("home-wellness"),
  homeDining: [img("home-dining-1"), img("home-dining-2")] as [string, string],
  homeExperiences: img("home-experiences"),
  homeExperiencesHover: {
    montana: img("home-experiences-mountains"),
    mar: img("home-experiences-sea"),
    "vida-local": img("home-experiences-local"),
  } as Record<string, string>,
  ticker: [img("ticker-1"), img("ticker-2")] as [string, string],
  footer: img("footer"),
  retreatHero: img("retreat-hero"),
  retreatStory: [img("retreat-story-1"), img("retreat-story-2")] as [string, string],
  retreatDesign: [img("retreat-design-1"), img("retreat-design-2"), img("retreat-design-3")],
  retreatSustainability: img("retreat-sustainability"),
  retreatSetting: img("retreat-setting"),
  retreatMap: "/images/retreat-map.svg",
  retreatRoad: img("retreat-road"),
  roomsOverview: img("rooms-overview"),
  roomsInfo: img("rooms-info"),
  roomShared: img("room-shared"),
  experienceHero: img("experience-hero"),
  contactHero: img("contact-hero"),
  contactDirections: img("contact-directions"),
} as const;

/** Galería de una habitación: principal, ancha, vertical, detalle grande e inserto. */
const roomGallery = (key: string): RoomGallery => [
  img(`room-${key}`),
  img(`room-${key}-wide`),
  img(`room-${key}-tall`),
  img(`room-${key}-detail`),
  img(`room-${key}-inset`),
];

export interface FeatureItem {
  title: string;
  text: string;
}

export interface DetailGroup {
  label: string;
  items: string[];
}

export type RoomGallery = [string, string, string, string, string];

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
  gallery: RoomGallery;
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
    image: img("room-garden"),
    gallery: roomGallery("garden"),
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
    image: img("room-mountain"),
    gallery: roomGallery("mountain"),
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
    image: img("room-pool"),
    gallery: roomGallery("pool"),
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
    image: img("room-house"),
    gallery: roomGallery("house"),
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
    image: img("room-olive"),
    gallery: roomGallery("olive"),
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
    image: img("room-horizon"),
    gallery: roomGallery("horizon"),
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
    image: img("exp-wellness"),
    inset: img("exp-wellness-inset"),
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    title: "Sabores de temporada",
    text: "Desayunos en el patio, almuerzos ligeros de la huerta y cenas largas bajo las estrellas.",
    cta: { label: "Ver la carta", href: "#" },
    image: img("exp-dining"),
    inset: img("exp-dining-inset"),
  },
  {
    id: "montana",
    label: "La montaña",
    title: "Senderos y miradores",
    text: "Senderos entre bancales y miradores tranquilos, con rutas para todos los niveles.",
    cta: { label: "Ver rutas", href: "maps" },
    image: img("exp-mountains"),
    inset: img("exp-mountains-inset"),
  },
  {
    id: "mar",
    label: "El mar",
    title: "Rumbo a la costa",
    text: "Salidas privadas en barco por la costa, con paradas en calas solo accesibles por mar.",
    cta: { label: "Reservar salida", href: "booking" },
    image: img("exp-sea"),
    inset: img("exp-sea-inset"),
  },
  {
    id: "vida-local",
    label: "Vida local",
    title: "Oficios de la región",
    text: "Visitas a talleres, productores y mercados para conocer el oficio de la región.",
    cta: { label: "Consultar", href: "contact" },
    image: img("exp-local"),
    inset: img("exp-local-inset"),
  },
];

export const PRIVATE_EXPERIENCES = [
  {
    title: "Desayuno al amanecer",
    text: "Una mesa preparada en un mirador mientras despierta el valle.",
    image: img("private-1"),
    ratio: "1 / 1",
  },
  {
    title: "Ruta por la costa",
    text: "Un día en coche por carreteras escénicas con paradas elegidas.",
    image: img("private-2"),
    ratio: "332 / 590",
  },
  {
    title: "Cata de aceite",
    text: "Recorrido por una almazara familiar y degustación guiada.",
    image: img("private-3"),
    ratio: "3 / 4",
  },
  {
    title: "Noche de estrellas",
    text: "Observación guiada con telescopio lejos de la ciudad.",
    image: img("private-4"),
    ratio: "4 / 3",
  },
];

export const PLACES = [
  {
    name: "El pueblo",
    text: "Calles de piedra, mercado semanal y cafés en la plaza.",
    image: img("place-1"),
  },
  {
    name: "La costa",
    text: "Calas tranquilas y restaurantes frente al mar a pocos minutos.",
    image: img("place-2"),
  },
  {
    name: "El valle",
    text: "Bancales, huertas y miradores para caminar sin prisa.",
    image: img("place-3"),
  },
  {
    name: "La ciudad",
    text: "Casco histórico, tiendas y museos para una escapada de un día.",
    image: img("place-4"),
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

export const INCLUDED: FeatureItem[] = [
  { title: "Desayuno", text: "Pan del día, fruta de temporada y café recién hecho cada mañana." },
  { title: "Bienestar", text: "Piscina exterior, sauna y espacios para estirar sin horario." },
  {
    title: "Limpieza diaria",
    text: "Habitaciones ordenadas y ropa de cama fresca durante tu estancia.",
  },
  { title: "Despensa", text: "Agua, café y pequeños productos locales siempre a mano." },
  {
    title: "Conserjería",
    text: "Ayuda con planes, reservas en restaurantes, traslados y excursiones.",
  },
  { title: "Wi-Fi", text: "Conexión estable de alta velocidad en toda la propiedad." },
];

export const DISTANCES = [
  { label: "Aeropuerto", value: "45 min" },
  { label: "Centro del pueblo", value: "15 min" },
  { label: "Playa más cercana", value: "20 min" },
];

/**
 * Etiquetas de interfaz (navegación, accesibilidad, formularios y botones).
 * Cámbialas aquí al traducir o adaptar el sitio; los componentes no contienen texto propio.
 */
export const UI_LABELS = {
  skipToContent: "Saltar al contenido",
  mainNav: "Principal",
  footerNav: "Pie de página",
  menu: "Menú",
  checkAvailability: "Ver disponibilidad",
  hours: "Horarios",
  contact: "Contacto",
  location: "Ubicación",
  established: (year: string) => `Est. ${year}`,
  reviewsCount: (count: number) => `(${count} reseñas)`,
  allRightsReserved: (year: number) => `© ${year}, Todos los derechos reservados`,
  menuCtaTitle: "¿Lista tu escapada?",
  menuCtaText: "Consulta fechas y tarifas en nuestro motor de reservas.",
  reviews: "Reseñas",
  excellent: "Excelente",
  basedOnReviews: (count: number) => `Basado en ${count} reseñas`,
  viewAllRooms: "Ver todas las habitaciones",
  roomsCarousel: "Habitaciones",
  carouselRole: "carrusel",
  previousRoom: "Habitación anterior",
  nextRoom: "Habitación siguiente",
  roomsCount: (count: number) => `${count} habitaciones`,
  openAllYear: "Abierto todo el año",
  guests: (count: number) => `${count} huéspedes`,
  squareMeters: (size: number) => `${size} m²`,
  fromPerNight: (price: number) => `Desde $${price}/noche`,
  roomNumber: (number: string) => `Habitación Nº ${number}`,
  openInMaps: "Abrir en mapas",
  lastUpdated: "Última actualización:",
  gallery: "Galería",
  mapAlt: "Mapa de ubicación",
  form: {
    name: "Nombre",
    namePlaceholder: "Tu nombre completo",
    email: "Correo",
    emailPlaceholder: "Tu correo",
    phone: "Teléfono",
    phonePlaceholder: "Tu teléfono",
    enquiryType: "Tipo de consulta",
    selectOption: "Selecciona una opción",
    enquiryTypes: ["Reserva", "Experiencias", "Eventos privados", "Prensa", "Otro"],
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos cómo podemos ayudarte",
    consent: "Acepto ser contactado sobre mi consulta.",
    submit: "Enviar mensaje",
    missingEmail: "Configura un correo de contacto en src/config/site.ts.",
    opening: "Abriendo tu aplicación de correo…",
    mailSubject: (type: string, name: string) => `Consulta: ${type} — ${name}`,
    mailName: "Nombre",
    mailEmail: "Correo",
    mailPhone: "Teléfono",
  },
  whatsappFloat: "Escríbenos",
  whatsappFloatAria: "Escríbenos por WhatsApp",
  closingCta: {
    title: "Tu próxima escapada",
    sideLeft: "Un retiro privado",
    sideRight: "Reserva directa",
  },
} as const;

export interface LegalSectionCopy {
  title: string;
  paragraphs: string[];
  list?: string[];
}

/**
 * Textos de cada página. Las páginas solo componen estos bloques con imágenes y componentes.
 * Los textos legales son de ejemplo: deben revisarlos los asesores legales del cliente.
 */
export const PAGES = {
  home: {
    hero: {
      label: "Un retiro privado",
      title: "Lejos de todo",
      sideLeft: "Entre montañas",
      sideRight: "Ciudad, País",
      intro: "Una casa de campo restaurada entre colinas y mar, pensada para bajar el ritmo.",
    },
    highlights: (roomCount: number) => [
      { label: "Bienestar", items: ["Piscina exterior", "Spa y masajes"] },
      {
        label: "La estancia",
        items: [UI_LABELS.roomsCount(roomCount), UI_LABELS.openAllYear],
      },
    ],
    slowDown: {
      title: "Bajar el ritmo",
      text: "Mañanas lentas, comidas sin reloj y tardes a la sombra: aquí el tiempo se mide de otra manera.",
      cta: "Conocer el retiro",
    },
    wellness: {
      title: "Pausa necesaria",
      sideLeft: "Spa al aire libre",
      sideRight: "Rituales diarios",
      cta: "Ver bienestar",
    },
    rooms: {
      title: "Dormir bien",
      text: "Habitaciones y suites con materiales nobles, luz natural y vistas que invitan a quedarse.",
    },
    dining: {
      label: "Cocina de temporada",
      title: "Mesa compartida",
      text: "Producto local, pescado del día y vinos de la zona en platos sencillos, pensados para compartir sin prisa.",
    },
    experiences: { label: "Experiencias", title: "Salir a descubrir" },
    ticker: ["Montaña y mar", "Ciudad, País"],
  },
  retreat: {
    meta: {
      title: "El retiro",
      description: "La historia, el diseño y la forma de recibir de nuestra casa.",
    },
    hero: {
      label: "Vida en el campo",
      title: "Nuestra casa",
      sideLeft: "Cerca de la montaña",
      sideRight: "Cerca del mar",
      intro: "Una casa antigua recuperada con respeto por su historia y su paisaje.",
    },
    storyTitle: "La historia",
    storyCaptions: [
      "La casa original lleva generaciones en estas colinas, rodeada de bancales, árboles frutales y caminos de piedra.",
      "Hoy es un refugio tranquilo que conserva sus muros, sus materiales y su relación directa con el entorno.",
    ] as [string, string],
    design: {
      label: "Diseño y arquitectura",
      title: "Hecha para el lugar",
      text: "La reforma mantiene el carácter de la casa y suma espacios luminosos, materiales honestos y una conexión constante con el exterior.",
      points: ["Materiales locales", "Espacios abiertos", "Detalles originales"],
    },
    ourWay: {
      title: "Nuestra forma",
      items: [
        {
          title: "Bienvenida personal",
          text: "Te recibimos sin formularios eternos ni esperas en recepción.",
        },
        { title: "Sin horarios", text: "Cada día se organiza a tu medida, sin agendas fijas." },
        {
          title: "Consejo local",
          text: "Recomendaciones de rutas, mesas y rincones que no salen en guías.",
        },
        {
          title: "Atención discreta",
          text: "Estamos cerca cuando nos necesitas y lejos cuando no.",
        },
        {
          title: "Pequeños gestos",
          text: "Detalles pensados en cada habitación para que todo sea fácil.",
        },
        {
          title: "Siempre disponibles",
          text: "Un equipo atento para reservas, planes o peticiones especiales.",
        },
      ],
    },
    sustainability: {
      label: "Sostenibilidad",
      title: "Cuidar la tierra",
      text: "Tomamos decisiones responsables en todo el retiro, entre ellas:",
      items: [
        "Trabajamos con artesanos y proveedores locales",
        "Cocinamos con producto de temporada",
        "Ahorramos agua y energía",
        "Reducimos los plásticos de un solo uso",
        "Plantamos especies nativas",
      ],
    },
    setting: {
      label: "El entorno",
      title: "Cerca del pueblo",
      text: "La casa está rodeada de naturaleza, con el pueblo, los senderos y la costa a pocos minutos.",
    },
    places: {
      label: "Alrededores",
      title: "Explorar desde aquí",
      footer:
        "Pueblos de montaña, mercados, calas y rincones con historia a un corto trayecto de la casa.",
      cta: "Explorar la zona",
    },
    directions: { label: "Cómo llegar", title: "El camino hasta casa" },
  },
  experience: {
    meta: {
      title: "Experiencias",
      description: "Bienestar, gastronomía y planes para descubrir la región a tu ritmo.",
    },
    hero: {
      title: "Días a tu ritmo",
      sideLeft: "Descansar",
      sideRight: "Explorar",
      text: "Nadar, comer bien, descansar o salir a explorar: tú decides cómo se llena cada día.",
    },
    private: { label: "Experiencias privadas", title: "Hecho a tu medida" },
  },
  contact: {
    meta: {
      title: "Contacto",
      description: "Escríbenos para reservas, experiencias o cualquier consulta sobre tu estancia.",
    },
    hero: {
      label: "Estamos para ayudarte",
      title: "Hablemos",
      sideLeft: "Consejo local",
      sideRight: "Planes a medida",
    },
    form: {
      label: "Envíanos una nota",
      title: "¿En qué podemos ayudarte?",
      text: "Desde experiencias en la zona hasta peticiones especiales, resolvemos tus dudas antes de llegar.",
    },
    reach: {
      title: "Contacto directo",
      call: { title: "Llámanos", text: "Atendemos todos los días de 8:00 a 20:00.", cta: "Llamar" },
      write: {
        title: "Escríbenos",
        text: "Respondemos en menos de 24 horas.",
        cta: "Enviar correo",
      },
      visit: { title: "Encuéntranos", cta: "Abrir en mapas" },
    },
    directions: {
      label: "Cómo llegar",
      title: "El camino hasta aquí",
      cta: "Ver ruta",
      wazeCta: "Ir con Waze",
    },
    faq: {
      label: "Antes de llegar",
      title: "Preguntas frecuentes",
      items: [
        {
          question: "¿Cómo reservo?",
          answer: "Escríbenos por WhatsApp con la fecha y la habitación, o reserva en línea.",
          link: { label: "Ver disponibilidad", href: "booking" },
        },
        {
          question: "¿A qué hora es el ingreso y la salida?",
          answer: "El ingreso es desde las 15:00 y la salida hasta las 11:00.",
        },
        {
          question: "¿Cómo llego?",
          answer: "Abre la ruta en tu aplicación de mapas; el acceso está señalizado.",
          link: { label: "Ver ruta", href: "maps" },
        },
      ] satisfies FaqItem[],
    },
  },
  rooms: {
    meta: {
      title: "Habitaciones y suites",
      description:
        "Habitaciones y suites con materiales naturales, luz abundante y vistas abiertas.",
    },
    hero: { label: "Habitaciones y suites", title: "Elige tu rincón" },
    overview: {
      title: "Pensado para el lugar",
      text: "Interiores cálidos, rincones exteriores propios y vistas que acompañan cada momento del día.",
    },
    included: { title: "Todo incluido" },
    info: { label: "Antes de llegar", title: "Información útil" },
    yourStay: (name: string) => `Tu estancia en ${name}`,
  },
  room: {
    details: {
      label: "Los detalles",
      title: "Todo sobre la habitación",
      text: "Una mirada cercana a los espacios, materiales y comodidades preparados para tu llegada.",
    },
    moreTitle: "Ver más",
  },
  notFound: {
    title: "Página no encontrada",
    label: "Error 404",
    heading: "Camino perdido",
    text: "La página que buscas no existe o fue movida.",
    cta: "Volver al inicio",
  },
  privacy: {
    meta: (name: string) => ({
      title: "Política de privacidad",
      description: `Cómo ${name} recopila, usa y protege tus datos personales.`,
    }),
    hero: { label: "Cómo usamos tus datos", title: "Privacidad" },
    updated: "enero de 2026",
    intro: (name: string) =>
      `${name} respeta tu privacidad. Esta política explica qué información recopilamos, cómo la usamos y qué opciones tienes al visitar el sitio, enviar una consulta o reservar.`,
    sections: (email?: string): LegalSectionCopy[] => [
      {
        title: "Datos que recopilamos",
        paragraphs: [
          "Podemos tratar los datos que nos facilitas al contactarnos o reservar, como:",
        ],
        list: [
          "Nombre, correo electrónico y teléfono",
          "Fechas de estancia y preferencias",
          "Mensajes enviados a través del formulario",
          "Datos técnicos básicos de navegación",
        ],
      },
      {
        title: "Para qué los usamos",
        paragraphs: [
          "Usamos tus datos para responder consultas, gestionar reservas, mejorar el sitio web y, si lo autorizas, enviarte información relevante sobre tu estancia.",
        ],
      },
      {
        title: "Con quién los compartimos",
        paragraphs: [
          "Solo compartimos datos con proveedores necesarios para prestar el servicio (por ejemplo, motor de reservas o alojamiento web) y cuando la ley lo exige.",
        ],
      },
      {
        title: "Conservación",
        paragraphs: [
          "Conservamos los datos durante el tiempo necesario para la finalidad indicada y los plazos legales aplicables.",
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          `Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a ${email ?? "nuestro correo de contacto"}.`,
        ],
      },
    ],
  },
  terms: {
    meta: (name: string) => ({
      title: "Términos de uso",
      description: `Condiciones de uso del sitio web de ${name}.`,
    }),
    hero: { label: "Condiciones del sitio", title: "Términos de uso" },
    updated: "enero de 2026",
    intro: (name: string) =>
      `Estos términos regulan el uso del sitio web de ${name}. Te recomendamos leerlos antes de navegar o reservar.`,
    sections: [
      {
        title: "Uso del sitio",
        paragraphs: [
          "Este sitio ofrece información sobre el alojamiento, sus servicios y experiencias. Al usarlo aceptas hacerlo de forma lícita y respetuosa.",
        ],
      },
      {
        title: "Reservas",
        paragraphs: [
          "Las reservas se gestionan a través de nuestro motor de reservas o de forma directa. Las condiciones de pago y cancelación se indican en cada confirmación.",
        ],
      },
      {
        title: "Contenido",
        paragraphs: [
          "Textos, fotografías y diseño son propiedad del alojamiento o se usan con licencia. No está permitido reutilizarlos sin autorización.",
        ],
      },
      {
        title: "Enlaces externos",
        paragraphs: [
          "El sitio puede enlazar a servicios de terceros (mapas, reservas, redes sociales). No somos responsables de su contenido ni de sus políticas.",
        ],
      },
      {
        title: "Cambios",
        paragraphs: [
          "Podemos actualizar estos términos en cualquier momento. La versión vigente es siempre la publicada en esta página.",
        ],
      },
    ] satisfies LegalSectionCopy[],
  },
};
