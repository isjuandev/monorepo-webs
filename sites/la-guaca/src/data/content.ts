// Contenido de La Guaca Motel. Fuente: recursos/la-guaca/brief.md y la auditoría de copy y
// conversión (CRO) aprobada por el cliente: tono sensual, elegante y discreto, persona "tú".
// Guía de voz: docs/research/la-guaca/guia-de-voz.md

import { buildWhatsAppUrl } from "@repo/utils";
import { siteConfig } from "@/config/site";

const img = (name: string) => `/images/${name}.webp`;

export interface Photo {
  src: string;
  alt: string;
}

const photo = (name: string, alt: string): Photo => ({ src: img(name), alt });

const formatPrice = (value: number) => `$${value.toLocaleString("es-CO")}`;

/* ---------- WhatsApp ---------- */

export const WHATSAPP_MESSAGES = {
  general: "Hola La Guaca, ¿tienen habitaciones disponibles en este momento?",
  header: "Hola La Guaca, quiero consultar qué habitaciones tienen disponibles en este momento.",
  menuLive: "Hola, ¿me confirman disponibilidad y precios de habitaciones para ir hoy?",
  menuReserve: "Hola, quiero apartar una habitación en Motel La Guaca.",
  hero: "Hola La Guaca, quiero saber qué suites con jacuzzi están disponibles ahora mismo.",
  closing: "Hola La Guaca, voy en camino / quiero confirmar disponibilidad de habitación.",
  room: (name: string, price: number) =>
    `Hola, me interesa la habitación ${name} de ${formatPrice(price)}. ¿Está disponible?`,
  rates: "Hola, ¿me comparten las tarifas de las habitaciones?",
  versions: "Hola, quiero consultar qué versiones de habitaciones tienen disponibles hoy.",
  dawnOrDecoration:
    "Hola, vi las tarifas de 5 horas en la web y quiero consultar por amanecida / decoración.",
  dawn: "Hola La Guaca, ¿me comparten los horarios y tarifas de amanecida?",
  occasion: "Hola, quiero cotizar una habitación decorada para una ocasión especial.",
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
  homeFacade: img("fachada"),
  homeFacadeMobile: img("fachada-mobile"),
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

export interface FeatureItemWithLink extends FeatureItem {
  link?: { label: string; href: string };
}

/** Bloque de la vitrina de experiencias del inicio (enlaza a /experiencias#id) */
export interface ShowcaseItem {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
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
  /** Rasgo diferencial corto (cabecera de la página de la habitación) */
  highlight: string;
  /** Equipamiento acumulado que muestran las tarjetas y el carrusel */
  cardFeatures: string[];
  /** Frase de venta de la tarjeta en /habitaciones */
  cardPitch: string;
  tagline: string;
  /** Etiqueta superior de la cabecera; por defecto "Categoría NN" */
  badge?: string;
  /** Titular corto de la página: vende la sensación */
  headline: string;
  /** Párrafo introductorio con la tarifa */
  intro: string;
  /** Botón de reserva propio de la categoría y su mensaje de WhatsApp */
  reserveCta: string;
  reserveMessage: string;
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
  "Sonido envolvente",
  "Televisor LED con cable y canales para adultos",
  "Aire acondicionado",
  "Nevera y minibar",
  "Parqueadero privado con cortina",
  "Room service discreto 24/7",
  "Cocina y bar 24 horas",
];

export const ROOM_VERSIONS_NOTE =
  "Diseños únicos en cada suite: Contamos con diferentes ambientes e iluminación por categoría. ¿Tienes una favorita? Pídela por WhatsApp.";

export const DAWN_NOTE =
  "¿Buscas amanecida o estadía nocturna completa?: Consulta por WhatsApp nuestras condiciones y horarios de amanecida de domingo a jueves y fines de semana, o combina tu fracción de 5 horas con horas adicionales a tarifa preferencial.";

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
    cardFeatures: ["Jacuzzi caliente", "Silla del amor"],
    cardPitch: "El refugio ideal para desconectarse en pareja.",
    tagline: "Jacuzzi con agua caliente, silla del amor y equipo de sonido por 5 horas.",
    headline: "Suite Clásica: tu refugio íntimo con jacuzzi caliente y 5 horas sin afanes",
    intro:
      "Todo lo necesario para desconectarse en pareja con total discreción. Ingresa directo por tu garaje privado, sumérgete en el jacuzzi de agua caliente y disfruta 5 horas completas a tu propio ritmo por $115.000.",
    reserveCta: "Apartar Suite ($115.000) por WhatsApp",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible una habitación categoría SUITE ($115.000 por 5h)?",
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
      {
        title: "Jacuzzi climatizado",
        text: "Agua caliente garantizada e hidromasaje listo para dos dentro de la habitación.",
      },
      {
        title: "Silla del amor",
        text: "Ubicada a pocos pasos de la cama para salir de la rutina y probar nuevas sensaciones.",
      },
      {
        title: "Ambiente a tu medida",
        text: "Aire acondicionado, minibar, sonido para tu música y TV LED con canales para adultos.",
      },
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
    highlight: "Jacuzzi y baño turco privado",
    cardFeatures: ["Jacuzzi caliente", "Baño turco privado"],
    cardPitch: "Suma el calor del vapor para relajar todos los sentidos.",
    tagline: "Jacuzzi con agua caliente y turco en la misma habitación, por 5 horas.",
    headline: "Suite Especial: el contraste perfecto entre baño turco y jacuzzi caliente",
    intro:
      "Eleva la temperatura de tu encuentro. Empieza relajando los sentidos en tu baño turco privado, continúa en el jacuzzi con agua caliente y disfruta 5 horas de complicidad absoluta por $133.000.",
    reserveCta: "Apartar Especial con Turco ($133.000)",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible una habitación ESPECIAL con turco ($133.000 por 5h)?",
    image: photo("especial", "Habitación Especial con cama doble, columnas azules y jacuzzi"),
    gallery: [],
    features: [
      {
        title: "Baño turco privado",
        text: "Cabina de vapor caliente dentro de tu suite para desconectar el cuerpo antes de pasar al agua.",
      },
      {
        title: "Jacuzzi con agua caliente",
        text: "El complemento ideal después del vapor para compartir una copa en pareja.",
      },
      {
        title: "Silla del amor y confort",
        text: "Cama amplia, silla del amor, sonido envolvente y minibar sin salir de tu habitación.",
      },
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
    highlight: "Pista de baile y luces rítmicas",
    cardFeatures: ["Jacuzzi XL", "Turco", "Pista de baile y luces"],
    cardPitch: "Diseñada para encender la noche a tu propio ritmo.",
    tagline: "Jacuzzi de lujo grande, turco y pista de baile con luces profesionales por 5 horas.",
    headline: "Suite Super: jacuzzi XL de lujo, turco y tu propia pista de baile",
    intro:
      "Más amplitud, más agua y tu propia fiesta privada. Cuenta con jacuzzi de gran formato, baño turco y pista de baile con luces rítmicas profesionales. Ideal para parejas que quieren más espacio o para celebrar con amigos ($150.000 por 5 horas).",
    reserveCta: "Apartar Super con Pista ($150.000)",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible una habitación SUPER con jacuzzi grande y pista ($150.000)?",
    image: photo("super", "Habitación Super con jacuzzi tras un vidrio, cama doble y pared verde"),
    gallery: [],
    features: [
      {
        title: "Jacuzzi de lujo gran formato",
        text: "Mayor capacidad e hidromasaje profundo con agua siempre caliente.",
      },
      {
        title: "Pista de baile privada",
        text: "Espacio amplio integrado en la suite para bailar y disfrutar sin testigos.",
      },
      {
        title: "Iluminación escénica y sonido",
        text: "Juego de luces profesionales y sonido potente para transformar la atmósfera con un botón.",
      },
    ],
    amenities: [
      "Jacuzzi de lujo grande con agua caliente",
      "Turco",
      "Pista de baile privada con sonido envolvente",
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
    highlight: "Barra de pole dance",
    badge: "Super Especial · 5 horas · Pole dance y jacuzzi XL",
    cardFeatures: ["Jacuzzi XL", "Turco", "Pista", "Barra de Pole Dance"],
    cardPitch: "El escenario perfecto para un show privado inolvidable.",
    tagline: "Barra de pole dance, jacuzzi de lujo grande, turco y pista con luces por 5 horas.",
    headline: "El show lo pones tú; el escenario privado ya está listo",
    intro:
      "Diseñada para cumplir fantasías sin reservas. La Suite Super Especial reúne nuestro jacuzzi grande de lujo, baño turco, pista de baile con iluminación profesional y una barra de Pole Dance protagonista en el centro del espacio ($220.000 por 5 horas).",
    reserveCta: "Apartar Super Especial ($220.000)",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible la habitación SUPER ESPECIAL con barra de show ($220.000)?",
    image: photo(
      "super-especial",
      "Habitación Super Especial con barra, cama con luz inferior y mesa de centro"
    ),
    gallery: [],
    features: [
      {
        title: "Barra de show (Pole Dance)",
        text: "Ubicada en el corazón de la pista bajo luces escénicas para un espectáculo íntimo inolvidable.",
      },
      {
        title: "Jacuzzi XL y baño turco",
        text: "Relájate antes o después del show entre vapor caliente e hidromasaje de lujo.",
      },
      {
        title: "Sonido y luces de club privado",
        text: "Potencia musical y efectos de luz para que la noche tenga el ritmo que ustedes elijan.",
      },
    ],
    amenities: [
      "Barra de Pole Dance en el centro de la pista con luces escénicas",
      "Jacuzzi de lujo grande con agua caliente",
      "Turco",
      "Pista de baile privada con sonido envolvente",
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
    highlight: "Columpio erótico y muro de las caricias",
    cardFeatures: ["Jacuzzi XL", "Turco", "Barra", "Columpio y Muro de las Caricias"],
    cardPitch: "Nuestra suite insignia. Máxima amplitud para parejas o grupos.",
    tagline:
      "Nuestra suite insignia: columpio erótico, muro de las caricias, barra, turco y jacuzzi grande.",
    headline: "Suite Presidencial: nuestra experiencia cumbre de fantasía, lujo y amplitud",
    intro:
      "Sin límites y con todo incluido en un mismo escenario. Disfruta de jacuzzi grande de lujo, baño turco, pista con luces, barra de show y dos elementos exclusivos para despertar los sentidos: Columpio del Amor y Muro de las Caricias ($255.000 por 5 horas).",
    reserveCta: "Apartar Presidencial / Suite 46 ($255.000)",
    reserveMessage:
      "Hola La Guaca, quiero consultar disponibilidad de la habitación PRESIDENCIAL (o la Habitación 46 con domo).",
    image: photo(
      "presidencial",
      "Habitación Presidencial con barra, silla del amor y piso de vidrio iluminado"
    ),
    gallery: [],
    features: [
      {
        title: "Columpio y Muro de las Caricias",
        text: "Exclusivos de la categoría Presidencial para experimentar juegos de complicidad, entrega y nuevas sensaciones.",
      },
      {
        title: "Edición especial — Habitación 46",
        text: "Nuestra joya arquitectónica con domo y fuente de agua. Si quieres reservar específicamente la Suite 46, pídela por WhatsApp.",
      },
      {
        title: "Todo el lujo en un solo espacio",
        text: "Máxima capacidad para parejas o grupos con jacuzzi XL, turco, pista de baile, barra y garaje privado.",
      },
    ],
    amenities: [
      "Domo (solo habitación 46)",
      "Fuente de agua (solo habitación 46)",
      "Barra de Pole Dance en el centro de la pista con luces escénicas",
      "Jacuzzi grande de lujo con agua caliente",
      "Columpio del amor",
      "Turco",
      "Pista de baile privada con sonido envolvente",
      "Juego de luces profesionales",
      "Muro de las Caricias",
    ],
    notes: [
      "Edición Exclusiva — Suite 46: Equipada con domo corredizo al cielo y fuente de agua. Solicítala por WhatsApp.",
    ],
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
    text: "Super Especial y Presidencial suman barra de pole dance e iluminación escénica junto a la pista. Las luces ya están; el show privado lo pones tú.",
    cta: { label: "Ver la Super Especial", href: "/habitaciones/super-especial" },
    image: img("super-especial"),
    inset: img("hero-1"),
  },
  {
    id: "presidencial",
    label: "Presidencial",
    title: "Columpio, domo y fuente",
    text: "La Presidencial agrega columpio erótico y Muro de las Caricias para llevar la fantasía a otro nivel. Domo y fuente de agua: solo en la habitación 46.",
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
    text: "Hidromasaje climatizado en las 5 categorías (y formato XL de lujo desde la Super).",
  },
  {
    title: "Parqueadero privado",
    text: "Acceso directo en carro o moto a tu habitación con cierre independiente y total reserva.",
  },
  {
    title: "Silla del amor",
    text: "Presente en todas las suites para explorar nuevas posturas con total comodidad.",
  },
  {
    title: "Sonido envolvente",
    text: "Conecta tu propia música y controla el volumen para crear tu ambiente ideal.",
  },
  {
    title: "Televisor LED",
    text: "Pantalla plana con programación por cable y canales exclusivos para adultos.",
  },
  {
    title: "Climatización total",
    text: "Aire acondicionado regulable para equilibrar el calor del jacuzzi y el vapor.",
  },
  {
    title: "Minibar en la suite",
    text: "Bebidas frías, licores y snacks listos al alcance de la mano apenas entras.",
  },
  {
    title: "Room Service discreto",
    text: "Pide licores, platos o kits íntimos con entrega privada sin contacto visual.",
  },
  {
    title: "Cocina y Bar 24 horas",
    text: "Carta de platos recién preparados desde $16.500 hasta $51.700 a cualquier hora del día o la madrugada.",
  },
];

export const PAYMENT_METHODS =
  "Efectivo, transferencia (Nequi / Daviplata) y tarjetas débito y crédito con datáfono inalámbrico";

export const STAY_INFO = [
  { label: "Horario", value: "Abierto 24/7" },
  { label: "Tarifa base", value: "Incluye 5 horas" },
  { label: "Edad", value: "Solo mayores de 18 años" },
  { label: "Pagos", value: PAYMENT_METHODS },
  { label: "Reservas", value: "Por WhatsApp o llamada" },
  { label: "Restaurante", value: "24 horas, con servicio a la habitación" },
];

/** "Lo que debes saber" de /habitaciones y de cada habitación: protocolo de privacidad y pagos */
export const ROOMS_INFO = [
  { label: "Horario", value: "Abierto 24/7" },
  { label: "Tarifa base", value: "Incluye 5 horas" },
  { label: "Edad", value: "Solo mayores de 18 años" },
  {
    label: "Privacidad en recepción y pedidos",
    value:
      "Entrega de cuenta, datáfono y pedidos de restaurante a través de torno/ventanilla privada sin contacto visual.",
  },
  {
    label: "Ingreso en carro, moto o taxi",
    value:
      "Parqueadero individual privado con cortina en cada habitación; si llegas en taxi o plataforma, puedes ingresar con total discreción hasta el acceso interno.",
  },
  {
    label: "Medios de pago discretos",
    value:
      "Recibimos efectivo, transferencias inmediatas (Nequi, Daviplata, Bancolombia) y tarjetas débito/crédito directamente en tu habitación.",
  },
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
  checkAvailability: "Ver disponibilidad por WhatsApp",
  headerCta: "Disponibilidad hoy",
  hours: "Horarios",
  contact: "Contacto",
  location: "Ubicación",
  whatsapp: "WhatsApp",
  whatsappFloat: "¿Hay suite disponible? Escríbenos",
  whatsappFloatAria:
    "¿Hay suite disponible? Escríbenos por WhatsApp (se abre en una pestaña nueva)",
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
  menuCtaText:
    "Consulta disponibilidad en tiempo real por WhatsApp o reserva tu suite antes de salir.",
  menuCta: "Consultar disponibilidad en vivo",
  menuCtaSecondary: "Apartar una suite",
  viewRooms: "Explorar las 5 suites y precios",
  viewAllRooms: "Ver detalles y precios de las 5 suites",
  roomCardCta: "Quiero esta suite por WhatsApp",
  roomCardCtaAria: (name: string) =>
    `Quiero la habitación ${name} por WhatsApp (se abre en una pestaña nueva)`,
  roomsCarousel: "Habitaciones",
  carouselRole: "carrusel",
  previousRoom: "Habitación anterior",
  nextRoom: "Habitación siguiente",
  roomsCount: (count: number) => `${count} categorías`,
  price: formatPrice,
  priceFor: (value: number, hours: number) => `${formatPrice(value)} por ${hours} horas`,
  priceShort: (value: number, hours: number) => `${formatPrice(value)} / ${hours} horas`,
  hoursIncluded: (hours: number) => `${hours} horas`,
  roomFeatures: (features: string[]) => features.join(" + "),
  extraPerson: (value: number) => `Persona adicional: ${formatPrice(value)}`,
  extraHour: (value: number) => `Hora adicional: ${formatPrice(value)}`,
  roomNumber: (number: string) => `Categoría ${number}`,
  openInMaps: "Abrir en mapas",
  directions: "Iniciar ruta en Waze / Maps",
  openInWaze: "Abrir ruta directa en Waze",
  openInGoogleMaps: "Abrir ubicación en Google Maps",
  wazeShort: "Abrir en Waze",
  googleMapsShort: "Abrir en Google Maps",
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
    title: "¿Listos para escapar hoy? Tu suite te espera 24/7",
    text: "Confirma disponibilidad en segundos por WhatsApp o llega directo sin reserva previa al Km 2 vía Montenegro (a 5 minutos de Armenia). Ingreso 100% discreto.",
    cta: "Confirmar habitación por WhatsApp",
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
      label: "Armenia · Km 2 vía Montenegro",
      title: "Cinco horas de intimidad total con jacuzzi caliente en cada suite",
      sideLeft: "Abierto 24/7",
      sideRight: "Parqueadero privado",
      intro:
        "Escapa de la rutina a solo 5 minutos de Armenia. Cinco categorías de habitaciones con garaje privado independiente, agua caliente garantizada y total discreción. Rato de 5 horas desde $115.000.",
    },
    highlights: [
      {
        label: "En todas las suites",
        items: ["Jacuzzi de agua caliente", "Parqueadero privado con cortina", "Silla del amor"],
      },
      {
        label: "Experiencia La Guaca",
        items: ["Fracción amplia de 5 horas", "Room Service discreto 24/7", "Parejas o grupos"],
      },
    ],
    intro: {
      title: "Sin afanes ni interrupciones: 5 horas para desconectarse del mundo",
      text: "Mientras otros lugares limitan tu encuentro a 3 o 4 horas, en La Guaca cada tarifa base te da 5 horas completas para disfrutar a tu ritmo. Entra directo a tu garaje privado sin cruzar miradas, pide licores o snacks a la habitación con entrega reservada y vive una experiencia diseñada para parejas o encuentros entre amigos.",
      cta: "Comparar suites desde $115.000",
    },
    jacuzzi: {
      title: "El placer del agua caliente, listo apenas cierras la puerta",
      text: "Olvídate de esperar o de jacuzzis fríos. Todas nuestras habitaciones cuentan con hidromasaje de agua caliente constante, y desde la categoría Super disfrutas de jacuzzis de gran formato con iluminación envolvente.",
      sideLeft: "Hidromasaje en las 5 categorías",
      sideRight: "Climatización inmediata",
      cta: "Descubrir jacuzzi, turco y show",
    },
    rooms: {
      title: "Elige el nivel de tu fantasía",
      text: "Todas nuestras habitaciones incluyen 5 horas, garaje privado y jacuzzi con agua caliente. Sube de categoría para sumar baño turco privado, pista de baile con luces, barra de show o columpio erótico. Tarifas desde $115.000.",
    },
    rates: {
      label: "Tarifas transparentes",
      title: "Todo claro antes de entrar: fracción, amanecida y adicionales",
      text: "Disfruta con total tranquilidad. Todas nuestras tarifas estándar incluyen 5 horas completas de estadía.",
      items: [
        {
          title: "Fracción / Rato (5 horas)",
          text: "Disponible las 24 horas en nuestras 5 categorías (desde $115.000 hasta $255.000).",
        },
        {
          title: "Planes de amanecida",
          text: "Consulta por WhatsApp nuestros horarios y tarifas especiales de amanecida (domingo a jueves y fines de semana/festivos).",
          link: { label: "Consultar amanecida", href: whatsappUrl(WHATSAPP_MESSAGES.dawn) },
        },
        {
          title: "Hora adicional",
          text: "¿Quieren quedarse un rato más? Extiende tu estadía por fracción de hora adicional directamente desde la habitación.",
        },
        {
          title: "Parejas o amigos (persona adicional)",
          text: "Las tarifas base aplican para 2 personas. En nuestras suites amplias puedes ingresar con acompañantes adicionales pagando el suplemento por persona.",
        },
      ] satisfies FeatureItemWithLink[],
    },
    occasions: {
      label: "Noches especiales y aniversarios",
      title: "Sorprende con una suite decorada a tu medida",
      text: "¿Aniversario, cumpleaños o reconciliación? Preparamos tu habitación antes de que llegues con pétalos de rosa, velas aromáticas, globos y botella para brindar. Escríbenos por WhatsApp para elegir tu paquete y reservarla con anticipación.",
      cta: "Cotizar decoración romántica",
      items: [
        {
          title: "Toque romántico clásico",
          text: "Camino de pétalos naturales, velas tipo LED/aromáticas, bombas metalizadas o en helio y letrero temático (Feliz Aniversario, Feliz Cumpleaños o Te Amo).",
        },
        {
          title: "Brindis en el jacuzzi",
          text: "Opción de incluir botella de vino, champaña o licor de tu elección con dos copas listas junto al jacuzzi.",
        },
        {
          title: "¿Cómo funciona?",
          text: "Escríbenos con al menos 24 horas de anticipación, elige la categoría de tu suite y abona tu reserva por transferencia para tener todo listo a la hora exacta de tu llegada.",
        },
      ] satisfies FeatureItem[],
    },
    experiences: {
      id: "experiencias",
      label: "Experiencias sensoriales",
      title: "Vapor, música y fantasía a puerta cerrada",
    },
    showcase: [
      {
        id: "turco",
        label: "Baño turco privado",
        title: "Vapor envolvente desde la suite Especial",
        text: "Cierra la puerta, activa el vapor y deja que el calor desconecte el estrés antes de pasar al jacuzzi.",
        image: img("especial"),
      },
      {
        id: "pista",
        label: "Sonido y luces",
        title: "Tu propia pista de baile privada",
        text: "Iluminación ambiental y sonido envolvente desde la categoría Super para que la fiesta sea solo de ustedes.",
        image: img("super"),
      },
      {
        id: "show",
        label: "Fantasía y juego",
        title: "Barra de show, columpio y Muro de las Caricias",
        text: "Espacios diseñados para romper la timidez y explorar nuevas sensaciones en las suites Super Especial y Presidencial.",
        image: img("super-especial"),
      },
    ] satisfies ShowcaseItem[],
    privacy: {
      label: "Discreción garantizada",
      title: "Privacidad absoluta desde que entras hasta que sales",
      text: "Diseñamos cada detalle operativo para que nadie interrumpa tu momento ni tengas contacto visual innecesario.",
      items: [
        {
          title: "Garaje privado individual",
          text: "Ingresa con tu vehículo o moto directamente al parqueadero privado de tu suite y cierra la puerta antes de bajar.",
        },
        {
          title: "Llegada discreta en taxi o plataforma",
          text: "Si vienes en taxi, Uber o InDrive, el vehículo puede dejarte directamente en el acceso interno de tu habitación con total reserva.",
        },
        {
          title: "Atención sin contacto visual",
          text: "Recepción y entrega de pedidos a la habitación a través de ventanilla/torno privado.",
        },
        {
          title: "Múltiples medios de pago",
          text: `Paga cómodamente desde tu suite en efectivo, transferencia (Nequi / Daviplata) o tarjetas débito y crédito con datáfono inalámbrico.`,
        },
      ] satisfies FeatureItem[],
    },
    roomService: {
      label: "Room service 24 horas",
      title: "Licores, snacks y juguetería sin salir de la cama",
      text: "Pide desde el teléfono de tu habitación o por WhatsApp interno y recibe tu pedido en minutos por el torno privado.",
      items: [
        {
          title: "Licores y bebidas frías",
          text: "Cervezas nacionales e importadas, vinos, whisky, tequila, aguardiente, ron, hidratantes y energizantes.",
        },
        {
          title: "Snacks y comida 24/7",
          text: "Opciones rápidas y calientes para recargar energía a cualquier hora del día o la madrugada.",
        },
        {
          title: "Boutique íntima y bienestar",
          text: "Preservativos, lubricantes, aceites de masaje y kits de aseo personal adicionales siempre disponibles.",
        },
      ] satisfies FeatureItem[],
    },
    location: {
      label: "Ubicación estratégica en Armenia",
      title: "A solo 5 minutos de Armenia por la vía a Montenegro",
      text: "Encuéntranos en el Km 2 vía Montenegro (Armenia, Quindío), con entrada amplia, iluminada y de fácil acceso en ambos sentidos.",
    },
    ticker: [
      "5 horas incluidas · Jacuzzi de agua caliente · Turco privado",
      "Parqueadero discreto · Km 2 vía Montenegro · Abierto 24/7",
    ] as [string, string],
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
      text: "Llega directo y sin esperas: abre tu ruta en Waze o asegura tu suite por WhatsApp.",
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
      answer: `${PAYMENT_METHODS}. Pagas cómodamente desde tu suite.`,
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
      label: "Elige el escenario de tu próxima escapada",
      title: "Nuestras 5 suites: compara y elige tu experiencia",
      text: "Todas las tarifas incluyen fracción de 5 horas, parqueadero privado independiente y jacuzzi con agua caliente garantizada.",
      sideRight: "5 horas incluidas",
    },
    overview: {
      label: "Ambientes exclusivos",
      title: "Cada visita es distinta: diferentes diseños en cada categoría",
      text: "Dentro de cada categoría contamos con habitaciones de diferente ambientación cromática y distribución para que nunca repitas la misma experiencia. ¿Tienes un número de habitación favorito? Solicítalo por WhatsApp antes de llegar.",
      cta: "Elegir versión de habitación por WhatsApp",
    },
    included: { label: "En todas las habitaciones", title: "Siempre incluido" },
    rates: {
      label: "Tarifas",
      title: "Precios claros, 5 horas incluidas",
      dawn: { label: "Amanecida", value: DAWN_NOTE },
      cta: "Consultar amanecida o decoración",
    },
    dining: {
      label: "Gastronomía, bar y boutique 24/7",
      title: "Carta 24 horas, licores y kits íntimos directo a tu suite",
      text: "Platos recién preparados desde $16.500 hasta $51.700, licores nacionales e importados y productos de bienestar íntimo entregados sin contacto visual.",
      items: [
        {
          title: "Cocina abierta 24/7",
          text: "Picadas, platos fuertes, comidas rápidas y opciones para compartir a cualquier hora.",
        },
        {
          title: "Bar y minibar",
          text: "Cervezas, vinos, champaña, whisky, ron, tequila, aguardiente y bebidas energizantes.",
        },
        {
          title: "Kits íntimos y bienestar",
          text: "Preservativos, lubricantes, aceites cálidos y kits de aseo personal siempre disponibles.",
        },
      ] satisfies FeatureItem[],
      cta: "Pedir la carta de restaurante y licores",
    },
    info: { label: "Antes de llegar", title: "Lo que debes saber" },
    location: {
      label: "Cómo llegar",
      title: "Llega en 5 minutos desde Armenia (Km 2 vía Montenegro)",
    },
  },
  room: {
    details: {
      label: "Los detalles",
      title: "Qué incluye",
      text: "Revisa el equipamiento completo de esta suite y sus tarifas transparentes por 5 horas.",
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
