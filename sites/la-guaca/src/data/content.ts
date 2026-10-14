// Contenido de La Guaca Motel. Fuente: recursos/la-guaca/brief.md.
// Tono K1 (el jacuzzi como protagonista) + K2 (suite-experiencia), persona "tú".
// Guía de voz: docs/research/la-guaca/guia-de-voz.md

import { buildWhatsAppUrl } from "@repo/utils";
import { siteConfig } from "@/config/site";

const img = (name: string) => `/images/${name}.webp`;

export interface Photo {
  src: string;
  alt: string;
}

const photo = (name: string, alt: string): Photo => ({ src: img(name), alt });

/* ---------- WhatsApp ---------- */

export const WHATSAPP_MESSAGES = {
  general: "Hola, quiero reservar una habitación con jacuzzi en La Guaca. ¿Qué tienen disponible?",
  room: (name: string) => `Hola, me interesa la habitación ${name}. ¿Está disponible?`,
  rates: "Hola, ¿me comparten las tarifas de las habitaciones?",
  occasion: "Hola, quiero celebrar una ocasión especial. ¿Qué opciones de decoración tienen?",
  menu: "Hola, ¿me comparten la carta del restaurante?",
  room46: "Hola, quiero reservar la Presidencial 46, la del domo y la fuente. ¿Está disponible?",
};

/** Enlace wa.me con mensaje inicial; sin número configurado vuelve al enlace general */
export const whatsappUrl = (message: string = WHATSAPP_MESSAGES.general) =>
  siteConfig.contact.whatsapp
    ? buildWhatsAppUrl(siteConfig.contact.whatsapp, message)
    : siteConfig.bookingUrl;

/* ---------- Imágenes ---------- */

export const IMAGES = {
  logo: img("logo"),
  logoMark: img("logo-mark"),
  homeHero: photo(
    "hero-1",
    "Habitación con cama redonda, cojines rojos y techo iluminado en azul y amarillo"
  ),
  homeHeroMobile: img("hero-1-mobile"),
  homeIntro: img("hero-2"),
  homeJacuzzi: img("super"),
  homeOccasions: [
    photo("decoracion", "Habitación decorada con globos rojos y pétalos de rosa sobre la cama"),
    photo("especial", "Habitación Especial con cama doble, columnas azules y jacuzzi"),
  ] as [Photo, Photo],
  homeExperiences: img("hero-3"),
  ticker: [img("suite-04"), img("presidencial")] as [string, string],
  footer: img("hero-3"),
  roomsOverview: img("suite-07"),
  roomsInfo: img("super-especial"),
  experienceHero: img("presidencial"),
  contactHero: img("hero-2"),
} as const;

/* ---------- Habitaciones ---------- */

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
  /** Tarifa base en pesos colombianos */
  price: number;
  /** Horas incluidas en la tarifa base */
  hours: number;
  extraPerson: number;
  extraHour: number;
  /** Rasgo diferencial corto para tarjetas y carrusel */
  highlight: string;
  tagline: string;
  overview: string;
  image: Photo;
  /** Fotos adicionales (la principal es `image`) */
  gallery: Photo[];
  features: FeatureItem[];
  /** Características propias de la categoría (lo que no está en todas) */
  amenities: string[];
  /** Restricciones o excepciones de la categoría */
  notes?: string[];
}

/** Lo que se repite en todas las habitaciones (brief: características comunes a las cinco) */
export const COMMON_AMENITIES = [
  "Silla del amor",
  "Equipo de sonido",
  "Televisor LED con cable y canales para adultos",
  "Aire acondicionado",
  "Nevera y minibar",
  "Garaje privado",
  "Servicio a la habitación",
  "Restaurante 24 horas",
];

export const ROOM_VERSIONS_NOTE =
  "Hay diferentes versiones de cada habitación: el color y la distribución de sus elementos pueden variar.";

export const ROOMS: Room[] = [
  {
    slug: "suite",
    number: "01",
    name: "Suite",
    price: 115000,
    hours: 5,
    extraPerson: 57500,
    extraHour: 23000,
    highlight: "Jacuzzi y silla del amor",
    tagline: "Jacuzzi con agua caliente, silla del amor y equipo de sonido por 5 horas.",
    overview:
      "La Suite tiene lo esencial de La Guaca: jacuzzi con agua caliente, silla del amor, equipo de sonido y televisor LED con canales para adultos. Llegas por tu garaje privado y tienes 5 horas incluidas.",
    image: photo(
      "suite-01",
      "Suite con cama doble, jacuzzi y silla del amor junto a una pared verde"
    ),
    gallery: [
      photo("suite-04", "Jacuzzi blanco, silla del amor y sofá en la Suite"),
      photo("suite-02", "Suite con silla del amor y cama con luz cálida en la base"),
      photo("suite-08", "Suite con piso ajedrezado, jacuzzi y mesa de vidrio"),
      photo("suite-03", "Jacuzzi de la Suite junto a columnas verdes y espejo redondo"),
      photo("suite-05", "Cama amplia de la Suite con columnas verdes al fondo"),
      photo("suite-06", "Suite con cama, televisor y sala junto a columnas verdes"),
      photo("suite-07", "Suite con cama doble, espejo y silla del amor"),
      photo("suite-09", "Suite con piso ajedrezado, columna y silla del amor"),
      photo("suite-10", "Jacuzzi y ducha de vidrio en una suite de piso ajedrezado"),
    ],
    features: [
      { title: "Jacuzzi con agua caliente", text: "Listo para dos, dentro de la habitación." },
      { title: "Silla del amor", text: "Diseñada para la pareja, a pocos pasos de la cama." },
      { title: "Música y TV", text: "Equipo de sonido y televisor LED con cable." },
    ],
    amenities: ["Jacuzzi con agua caliente"],
  },
  {
    slug: "especial",
    number: "02",
    name: "Especial",
    price: 133000,
    hours: 5,
    extraPerson: 66500,
    extraHour: 26600,
    highlight: "Jacuzzi y turco",
    tagline: "Jacuzzi con agua caliente y turco en la misma habitación, por 5 horas.",
    overview:
      "La Especial suma turco a todo lo de la Suite. Primero el vapor, luego el jacuzzi con agua caliente, con silla del amor, equipo de sonido y televisor LED con canales para adultos. Son 5 horas con garaje privado.",
    image: photo("especial", "Habitación Especial con cama doble, columnas azules y jacuzzi"),
    gallery: [],
    features: [
      { title: "Turco", text: "Vapor caliente sin salir de la habitación." },
      { title: "Jacuzzi con agua caliente", text: "Para después del turco, a tu ritmo." },
      { title: "Silla del amor", text: "En la habitación, junto al resto del equipamiento." },
    ],
    amenities: ["Jacuzzi con agua caliente", "Turco"],
  },
  {
    slug: "super",
    number: "03",
    name: "Super",
    price: 150000,
    hours: 5,
    extraPerson: 75000,
    extraHour: 30000,
    highlight: "Pista de baile y luces",
    tagline: "Jacuzzi de lujo grande, turco y pista de baile con luces profesionales por 5 horas.",
    overview:
      "En la Super el jacuzzi crece: es de lujo, grande y con agua caliente. Además tiene turco, una amplia pista de baile y juego de luces profesionales para ponerle ritmo con el equipo de sonido. Buena opción si vienes con amigos.",
    image: photo("super", "Habitación Super con jacuzzi tras un vidrio, cama doble y pared verde"),
    gallery: [],
    features: [
      { title: "Jacuzzi de lujo grande", text: "Más espacio en el agua, siempre caliente." },
      { title: "Pista de baile", text: "Amplia, dentro de la habitación." },
      { title: "Luces profesionales", text: "Un juego de luces para armar el ambiente." },
    ],
    amenities: [
      "Jacuzzi de lujo grande con agua caliente",
      "Turco",
      "Amplia pista de baile",
      "Juego de luces profesionales",
    ],
  },
  {
    slug: "super-especial",
    number: "04",
    name: "Super Especial",
    price: 220000,
    hours: 5,
    extraPerson: 110000,
    extraHour: 44000,
    highlight: "Barra de striptease",
    tagline: "Barra de striptease, jacuzzi de lujo grande, turco y pista con luces por 5 horas.",
    overview:
      "La Super Especial tiene todo lo de la Super: jacuzzi de lujo grande, turco, pista de baile y luces profesionales. Y agrega barra de striptease. El show lo pones tú; el escenario ya está listo.",
    image: photo(
      "super-especial",
      "Habitación Super Especial con barra, cama con luz inferior y mesa de centro"
    ),
    gallery: [],
    features: [
      { title: "Barra de striptease", text: "En el centro de la pista, para tu propio show." },
      { title: "Pista y luces", text: "Amplia pista de baile con luces profesionales." },
      { title: "Jacuzzi de lujo grande", text: "Agua caliente y turco en la misma habitación." },
    ],
    amenities: [
      "Barra de striptease",
      "Jacuzzi de lujo grande con agua caliente",
      "Turco",
      "Amplia pista de baile",
      "Juego de luces profesionales",
    ],
  },
  {
    slug: "presidencial",
    number: "05",
    name: "Presidencial",
    price: 255000,
    hours: 5,
    extraPerson: 127500,
    extraHour: 51000,
    highlight: "Columpio y muro de las caricias",
    tagline:
      "La categoría más completa: columpio, muro de las caricias, barra, turco y jacuzzi grande.",
    overview:
      "La Presidencial reúne todo: jacuzzi grande de lujo con agua caliente, turco, barra de striptease, pista de baile con luces profesionales, columpio y muro de las caricias. La habitación 46 suma domo y fuente de agua; si la quieres a ella, pídela por WhatsApp.",
    image: photo(
      "presidencial",
      "Habitación Presidencial con barra, silla del amor y piso de vidrio iluminado"
    ),
    gallery: [],
    features: [
      { title: "Columpio", text: "Instalado en la habitación, junto a la pista." },
      { title: "Muro de las caricias", text: "Uno de los elementos propios de esta categoría." },
      { title: "Domo y fuente de agua", text: "Solo en la habitación 46: pídela al reservar." },
    ],
    amenities: [
      "Domo (solo habitación 46)",
      "Fuente de agua (solo habitación 46)",
      "Barra de striptease",
      "Jacuzzi grande de lujo con agua caliente",
      "Columpio",
      "Turco",
      "Amplia pista de baile",
      "Juego de luces profesionales",
      "Muro de las caricias",
    ],
    notes: ["Domo y fuente de agua: solo en la habitación 46."],
  },
];

/* ---------- Experiencias ---------- */

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
    id: "jacuzzi",
    label: "Jacuzzi",
    title: "Agua caliente en todas",
    text: "Las cinco categorías tienen jacuzzi con agua caliente. Desde la Super es un jacuzzi de lujo grande, con más espacio para dos.",
    cta: { label: "Ver habitaciones", href: "/habitaciones" },
    image: img("suite-04"),
    inset: img("suite-03"),
  },
  {
    id: "turco",
    label: "Turco",
    title: "Vapor desde la Especial",
    text: "Especial, Super, Super Especial y Presidencial incluyen turco. Combínalo con el jacuzzi durante tus 5 horas.",
    cta: { label: "Ver la Especial", href: "/habitaciones/especial" },
    image: img("especial"),
    inset: img("suite-10"),
  },
  {
    id: "pista",
    label: "Pista y luces",
    title: "Tu propia pista de baile",
    text: "Super, Super Especial y Presidencial tienen amplia pista de baile, juego de luces profesionales y equipo de sonido.",
    cta: { label: "Ver la Super", href: "/habitaciones/super" },
    image: img("super"),
    inset: img("hero-3"),
  },
  {
    id: "show",
    label: "Ambiente de show",
    title: "Barra para tu show",
    text: "Super Especial y Presidencial suman barra de striptease junto a la pista. Las luces ya están; el show lo pones tú.",
    cta: { label: "Ver la Super Especial", href: "/habitaciones/super-especial" },
    image: img("super-especial"),
    inset: img("hero-1"),
  },
  {
    id: "presidencial",
    label: "Presidencial",
    title: "Columpio, domo y fuente",
    text: "La Presidencial agrega columpio y muro de las caricias. Domo y fuente de agua: solo en la habitación 46.",
    cta: { label: "Pedir la 46", href: whatsappUrl(WHATSAPP_MESSAGES.room46) },
    image: img("presidencial"),
    inset: img("hero-2"),
  },
  {
    id: "restaurante",
    label: "Restaurante 24 horas",
    title: "Pide sin salir",
    text: "Servicio a la habitación y restaurante abierto las 24 horas, con platos desde $16.500 hasta $51.700.",
    cta: { label: "Pedir la carta", href: whatsappUrl(WHATSAPP_MESSAGES.menu) },
    image: img("suite-09"),
    inset: img("suite-06"),
  },
];

export const PRIVATE_EXPERIENCES = [
  {
    title: "Silla del amor",
    text: "En las cinco categorías, de la Suite a la Presidencial.",
    image: photo("suite-02", "Silla del amor frente a la cama de la Suite"),
    ratio: "1 / 1",
  },
  {
    title: "Música y TV",
    text: "Equipo de sonido y televisor LED con cable y canales para adultos.",
    image: photo("suite-06", "Televisor sobre la cama en una suite con columnas verdes"),
    ratio: "332 / 590",
  },
  {
    title: "Aire acondicionado",
    text: "La temperatura a tu gusto, con nevera y minibar en la habitación.",
    image: photo("suite-01", "Suite con aire acondicionado sobre la cama y jacuzzi al lado"),
    ratio: "3 / 4",
  },
  {
    title: "Servicio a la habitación",
    text: "Pide del restaurante 24 horas sin salir.",
    image: photo("suite-09", "Sala con mesa de vidrio en una suite de piso ajedrezado"),
    ratio: "4 / 3",
  },
];

/* ---------- Servicios, tarifas e información ---------- */

export const INCLUDED: FeatureItem[] = [
  {
    title: "Jacuzzi con agua caliente",
    text: "En las cinco categorías; desde la Super, de lujo y grande.",
  },
  { title: "Garaje privado", text: "Llegas y estacionas en el garaje de tu habitación." },
  { title: "Silla del amor", text: "En todas las habitaciones, de la Suite a la Presidencial." },
  { title: "Equipo de sonido", text: "Tu música, a tu volumen, en cada habitación." },
  { title: "Televisor LED", text: "Con televisión por cable y canales para adultos." },
  { title: "Aire acondicionado", text: "La temperatura a tu gusto durante la estadía." },
  { title: "Nevera y minibar", text: "Dentro de la habitación, sin salir a buscar nada." },
  { title: "Servicio a la habitación", text: "Pide lo que necesites sin dejar la habitación." },
  { title: "Restaurante 24 horas", text: "Platos desde $16.500 hasta $51.700, a cualquier hora." },
];

export const STAY_INFO = [
  { label: "Horario", value: "Abierto 24/7" },
  { label: "Tarifa base", value: "Incluye 5 horas" },
  { label: "Edad", value: "Solo mayores de 18 años" },
  { label: "Pagos", value: "Efectivo, datáfono y transferencia" },
  { label: "Reservas", value: "Por WhatsApp o llamada" },
  { label: "Restaurante", value: "24 horas, con servicio a la habitación" },
];

export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

/**
 * Etiquetas de interfaz (navegación, accesibilidad, formularios y botones).
 * Cámbialas aquí al traducir o adaptar el sitio; los componentes no contienen texto propio.
 */
export const UI_LABELS = {
  skipToContent: "Saltar al contenido",
  mainNav: "Principal",
  footerNav: "Pie de página",
  menu: "Menú",
  checkAvailability: "Reservar por WhatsApp",
  headerCta: "Reservar",
  hours: "Horarios",
  contact: "Contacto",
  location: "Ubicación",
  whatsapp: "WhatsApp",
  whatsappFloat: "WhatsApp",
  whatsappFloatAria: "Reservar por WhatsApp (se abre en una pestaña nueva)",
  openAllHours: "Abierto 24/7",
  adultsOnly: "Solo mayores de 18 años",
  logoAlt: (name: string) => `${name} Motel`,
  homeLink: (name: string) => `${name}, inicio`,
  socialNames: { facebook: "Facebook", instagram: "Instagram", x: "X" } as Record<string, string>,
  reviews: "Reseñas",
  excellent: "Excelente",
  reviewsCount: (count: number) => `(${count} reseñas)`,
  basedOnReviews: (count: number) => `Basado en ${count} reseñas`,
  allRightsReserved: (year: number) => `© ${year}, todos los derechos reservados`,
  menuCtaTitle: "¿Reservamos?",
  menuCtaText: "Escríbenos por WhatsApp y pregunta qué habitación está disponible.",
  menuCta: "Escribir por WhatsApp",
  viewRooms: "Ver habitaciones",
  viewAllRooms: "Ver todas las habitaciones",
  roomsCarousel: "Habitaciones",
  carouselRole: "carrusel",
  previousRoom: "Habitación anterior",
  nextRoom: "Habitación siguiente",
  roomsCount: (count: number) => `${count} categorías`,
  price: (value: number) => `$${value.toLocaleString("es-CO")}`,
  priceFor: (value: number, hours: number) =>
    `$${value.toLocaleString("es-CO")} por ${hours} horas`,
  hoursIncluded: (hours: number) => `${hours} horas`,
  extraPerson: (value: number) => `Persona adicional: $${value.toLocaleString("es-CO")}`,
  extraHour: (value: number) => `Hora adicional: $${value.toLocaleString("es-CO")}`,
  roomNumber: (number: string) => `Categoría ${number}`,
  reserveRoom: "Reservar esta habitación",
  openInMaps: "Abrir en mapas",
  directions: "Cómo llegar",
  lastUpdated: "Última actualización:",
  gallery: "Galería",
  form: {
    name: "Nombre",
    namePlaceholder: "¿Cómo te llamamos?",
    enquiryType: "Tipo de consulta",
    selectOption: "Selecciona una opción",
    enquiryTypes: [
      "Reservar una habitación",
      "Tarifas",
      "Decoración para una ocasión",
      "Restaurante",
      "Otra consulta",
    ],
    when: "Fecha y hora (opcional)",
    whenPlaceholder: "Ej.: sábado a las 9 p. m.",
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos qué habitación te interesa o qué necesitas",
    submit: "Abrir WhatsApp",
    missingWhatsapp: "Configura el número de WhatsApp en src/config/site.ts.",
    opening: "Abriendo WhatsApp con tu mensaje…",
    whatsappMessage: (type: string, name: string, when: string, message: string) =>
      [`Hola, soy ${name}. Consulta: ${type}.`, when ? `Para: ${when}.` : "", message]
        .filter(Boolean)
        .join("\n"),
  },
  closingCta: {
    title: "Reserva tu jacuzzi",
    text: "Escríbenos por WhatsApp o pasa a conocernos en el km 2 vía Montenegro.",
    sideLeft: "Abierto 24/7",
    sideRight: "Armenia",
  },
} as const;

export interface LegalSectionCopy {
  title: string;
  paragraphs: string[];
  list?: string[];
}

/**
 * Textos de cada página. Las páginas solo componen estos bloques con imágenes y componentes.
 * Los textos legales son una base genérica: deben revisarlos los asesores legales del cliente.
 */
export const PAGES = {
  home: {
    hero: {
      label: "Motel en Armenia",
      title: "Jacuzzi caliente en cada habitación",
      sideLeft: "Abierto 24/7",
      sideRight: "Km 2 vía Montenegro",
      intro:
        "Cinco categorías con jacuzzi de agua caliente y garaje privado. Desde $115.000 por 5 horas.",
    },
    highlights: (roomCount: number) => [
      { label: "En todas", items: ["Jacuzzi con agua caliente", "Garaje privado"] },
      { label: "La Guaca", items: [UI_LABELS.roomsCount(roomCount), UI_LABELS.openAllHours] },
    ],
    intro: {
      title: "Cinco horas a tu manera",
      text: "La Guaca es un motel en el km 2 de la vía a Montenegro, en Armenia. Abre 24/7 y cada habitación tiene garaje privado, jacuzzi con agua caliente, silla del amor y servicio a la habitación. Ven en pareja o con amigos: la tarifa base incluye 5 horas.",
    },
    jacuzzi: {
      title: "El agua, siempre caliente",
      sideLeft: "Jacuzzi en las cinco",
      sideRight: "De lujo desde la Super",
      cta: "Ver experiencias",
    },
    rooms: {
      title: "Sube de categoría",
      text: "De la Suite a la Presidencial, cada una suma algo: turco, pista con luces, barra o columpio. Desde $115.000 por 5 horas.",
    },
    occasions: {
      label: "Ocasiones especiales",
      title: "Celebra en la habitación",
      text: "¿Aniversario, cumpleaños o una sorpresa? Pregunta por WhatsApp por la decoración de la habitación y sus condiciones.",
      cta: "Preguntar por la decoración",
    },
    experiences: { label: "Experiencias", title: "Agua, vapor y luces" },
    showcase: ["turco", "pista", "show"],
    ticker: ["Jacuzzi · Turco · Pista", "Armenia · Abierto 24/7"] as [string, string],
  },
  experience: {
    meta: {
      title: "Experiencias",
      description:
        "Jacuzzi con agua caliente, turco, pista de baile con luces, barra de striptease y restaurante 24 horas en La Guaca, Armenia.",
    },
    hero: {
      title: "Agua, vapor y luces",
      sideLeft: "Jacuzzi y turco",
      sideRight: "Pista y luces",
      text: "Todas las categorías tienen jacuzzi con agua caliente; las más altas suman turco, pista de baile, barra, columpio y domo.",
    },
    private: { label: "En todas las habitaciones", title: "Lo que nunca falta" },
  },
  contact: {
    meta: {
      title: "Contacto y ubicación",
      description: `Reserva por WhatsApp al ${siteConfig.contact.phone ?? ""} o visítanos en el km 2 vía Montenegro, Armenia. Abierto 24/7.`,
    },
    hero: {
      label: "Reservas y visitas",
      title: "Hablemos",
      sideLeft: "Abierto 24/7",
      sideRight: "Armenia",
    },
    form: {
      label: "Escríbenos por WhatsApp",
      title: "Arma tu mensaje",
      text: "Completa los datos y abrimos WhatsApp con el mensaje listo para enviar.",
    },
    reach: {
      title: "Contacto directo",
      whatsapp: {
        title: "WhatsApp",
        text: "Reservas y consultas sobre habitaciones, tarifas y decoración.",
        cta: "Abrir WhatsApp",
      },
      call: { title: "Llámanos", cta: "Llamar" },
      write: { title: "Correo", text: "Para temas que no sean reservas.", cta: "Enviar correo" },
    },
    faq: { label: "Preguntas frecuentes", title: "Antes de venir" },
    directions: {
      label: "Cómo llegar",
      title: "Km 2 vía Montenegro",
      text: "Pasa a conocernos y elige la habitación con calma: estamos en el km 2 de la vía a Montenegro, en Armenia.",
      cta: "Ver ruta en el mapa",
    },
  },
  faq: [
    {
      question: "¿Cuánto tiempo incluye la tarifa?",
      answer:
        "La tarifa base incluye 5 horas en todas las categorías. Cada hora adicional se cobra según la habitación, desde $23.000 en la Suite.",
    },
    {
      question: "¿Puedo ir con más personas?",
      answer:
        "Sí. Cada persona adicional tiene un valor según la habitación, desde $57.500 en la Suite. Pregunta por WhatsApp cuántas personas admite la que te interesa.",
      link: { label: "Preguntar por WhatsApp", href: whatsappUrl(WHATSAPP_MESSAGES.rates) },
    },
    {
      question: "¿Qué formas de pago aceptan?",
      answer: "Efectivo, datáfono y transferencia.",
    },
    {
      question: "¿Hay edad mínima?",
      answer: "Sí. La Guaca es solo para mayores de 18 años.",
    },
    {
      question: "¿Abren todos los días?",
      answer: "Sí, estamos abiertos 24 horas, los 7 días de la semana.",
    },
    {
      question: "¿Puedo pedir comida?",
      answer:
        "Sí. Hay restaurante 24 horas con servicio a la habitación y platos desde $16.500 hasta $51.700.",
      link: { label: "Pedir la carta", href: whatsappUrl(WHATSAPP_MESSAGES.menu) },
    },
    {
      question: "¿Todas las habitaciones de una categoría son iguales?",
      answer: `${ROOM_VERSIONS_NOTE} Domo y fuente de agua solo están en la Presidencial 46.`,
    },
    {
      question: "¿Cómo reservo?",
      answer:
        "Escríbenos por WhatsApp con la categoría y la hora que quieres, y te contamos qué hay disponible. También puedes llamar.",
      link: { label: "Escribir por WhatsApp", href: whatsappUrl() },
    },
  ] satisfies FaqItem[],
  rooms: {
    meta: {
      title: "Habitaciones y tarifas",
      description:
        "Suite, Especial, Super, Super Especial y Presidencial: todas con jacuzzi de agua caliente y garaje privado. Desde $115.000 por 5 horas en Armenia.",
    },
    hero: {
      label: "Habitaciones",
      title: "Elige tu categoría",
      sideRight: "5 horas incluidas",
    },
    overview: {
      label: "Antes de elegir",
      title: "Cada categoría tiene versiones",
      text: `${ROOM_VERSIONS_NOTE} Si quieres una en particular, pregúntanos por WhatsApp.`,
      cta: "Consultar disponibilidad",
    },
    included: { label: "En todas las habitaciones", title: "Siempre incluido" },
    rates: {
      label: "Tarifas",
      title: "Precios claros, 5 horas incluidas",
      cta: "Pedir tarifas por WhatsApp",
    },
    info: { label: "Antes de llegar", title: "Información útil" },
  },
  room: {
    details: {
      label: "Los detalles",
      title: "Qué incluye",
      text: "Lo propio de esta categoría, lo que trae toda habitación y lo que cuesta.",
    },
    groups: {
      own: "En esta habitación",
      common: "En todas",
      rates: "Tarifas",
      notes: "Ten en cuenta",
    },
    moreTitle: "Otras categorías",
  },
  notFound: {
    title: "Página no encontrada",
    label: "Error 404",
    heading: "Esta puerta no abre",
    text: "La página que buscas no existe o cambió de lugar. Las habitaciones siguen donde siempre.",
    cta: "Volver al inicio",
  },
  privacy: {
    meta: (name: string) => ({
      title: "Política de privacidad",
      description: `Cómo ${name} recopila, usa y protege tus datos personales.`,
    }),
    hero: { label: "Cómo usamos tus datos", title: "Privacidad" },
    updated: "octubre de 2026",
    intro: (name: string) =>
      `${name} respeta tu privacidad. Esta política explica qué información tratamos cuando visitas el sitio o nos escribes por WhatsApp, teléfono o correo para reservar.`,
    sections: (email?: string): LegalSectionCopy[] => [
      {
        title: "Datos que tratamos",
        paragraphs: [
          "Podemos tratar los datos que nos facilitas al contactarnos o reservar, como:",
        ],
        list: [
          "Nombre y número de teléfono o WhatsApp",
          "Correo electrónico, si nos escribes por ese medio",
          "Fecha, hora y habitación de tu reserva",
          "Datos técnicos básicos de navegación del sitio",
        ],
      },
      {
        title: "Para qué los usamos",
        paragraphs: [
          "Usamos tus datos solo para responder tus consultas, gestionar tu reserva y mejorar el sitio web.",
        ],
      },
      {
        title: "Con quién los compartimos",
        paragraphs: [
          "No vendemos tus datos. Solo los compartimos con proveedores necesarios para prestar el servicio (por ejemplo, WhatsApp o el alojamiento web) y cuando la ley lo exige.",
        ],
      },
      {
        title: "Conservación",
        paragraphs: [
          "Conservamos los datos durante el tiempo necesario para la finalidad indicada y los plazos legales aplicables en Colombia.",
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          `Puedes conocer, actualizar, rectificar o pedir la eliminación de tus datos escribiendo a ${email ?? "nuestro correo de contacto"}.`,
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
    updated: "octubre de 2026",
    intro: (name: string) =>
      `Estos términos regulan el uso del sitio web de ${name}. Te recomendamos leerlos antes de navegar o reservar.`,
    sections: [
      {
        title: "Solo para adultos",
        paragraphs: [
          "El sitio y el servicio están dirigidos solo a mayores de 18 años. Al usarlos confirmas que cumples esta condición.",
        ],
      },
      {
        title: "Uso del sitio",
        paragraphs: [
          "Este sitio ofrece información sobre las habitaciones, servicios y tarifas del motel. Al usarlo aceptas hacerlo de forma lícita y respetuosa.",
        ],
      },
      {
        title: "Reservas y tarifas",
        paragraphs: [
          "Las reservas se gestionan por WhatsApp o por teléfono y están sujetas a disponibilidad. Las tarifas publicadas pueden cambiar; la vigente es la que te confirmamos al reservar.",
        ],
      },
      {
        title: "Contenido",
        paragraphs: [
          "Textos, fotografías y diseño son propiedad del motel o se usan con autorización. Las habitaciones tienen varias versiones, por lo que el color y la distribución pueden variar respecto a las fotos.",
        ],
      },
      {
        title: "Enlaces externos",
        paragraphs: [
          "El sitio enlaza a servicios de terceros (WhatsApp, mapas y redes sociales). No somos responsables de su contenido ni de sus políticas.",
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
