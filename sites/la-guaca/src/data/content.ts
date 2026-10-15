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
  dawnOrDecoration: "Hola, vi las tarifas en la web y quiero consultar por amanecida / decoración.",
  dawn: "Hola La Guaca, ¿me comparten los horarios y tarifas de amanecida?",
  occasion: "Hola, quiero cotizar una habitación decorada para una ocasión especial.",
  menu: "Hola, ¿me comparten la carta del restaurante?",
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
    photo(
      "vip-love-decorada-01",
      "VIP Love Decorada: cama con dosel rojo y mensaje Te amo bajo bombas de corazón"
    ),
    photo(
      "vip-fetiche-decorada-02",
      "VIP Fetiche Decorada: cama con el mensaje Feliz aniversario mi amor bajo bombas rojas"
    ),
  ] as [Photo, Photo],
  homeExperiences: img("hero-3"),
  ticker: [img("presidencial-oro-03"), img("vip-love-03")] as [string, string],
  footer: img("hero-3"),
  roomsOverview: img("presidencial-oro-04"),
  roomsInfo: img("presidencial-oro-05"),
  experienceHero: img("vip-love-02"),
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
  /** Horas incluidas en la tarifa base (sin dato: se consulta por WhatsApp) */
  hours?: number;
  /** Valores adicionales; sin dato se muestran como "consulta por WhatsApp" */
  extraPerson?: number;
  extraHour?: number;
  /** Rasgo diferencial corto (cabecera de la página de la habitación) */
  highlight: string;
  /** Equipamiento que muestran las tarjetas y el carrusel */
  cardFeatures: string[];
  /** Frase de venta de la tarjeta en /habitaciones */
  cardPitch: string;
  /** Descripción para buscadores y redes */
  tagline: string;
  /** Etiqueta superior de la cabecera; por defecto "Categoría NN" */
  badge?: string;
  /** Titular corto de la página: vende la sensación */
  headline: string;
  /** Párrafo introductorio con la tarifa */
  intro: string;
  /** Botón de reserva propio de la habitación y su mensaje de WhatsApp */
  reserveCta: string;
  reserveMessage: string;
  /** Portada (tarjetas, carrusel y primera foto de la galería) */
  image: Photo;
  /** Resto de fotos de la galería, en orden */
  gallery: Photo[];
  features: FeatureItem[];
  /** Lo propio de esta habitación (lo común está en COMMON_AMENITIES) */
  amenities: string[];
  notes?: string[];
}

/** Lo que se repite en todas las habitaciones */
export const COMMON_AMENITIES = [
  "Jacuzzi",
  "Aire acondicionado y ventilador",
  "Televisor y equipo de sonido",
  "Nevera",
  "Parqueadero privado con cortina",
  "Room service discreto 24/7",
  "Cocina y bar 24 horas",
];

export const ROOM_VERSIONS_NOTE =
  "Cada habitación tiene su propio ambiente. ¿Tienes una favorita? Pídela por WhatsApp antes de llegar.";

export const DAWN_NOTE =
  "¿Buscas amanecida o estadía nocturna completa?: Consulta por WhatsApp nuestras condiciones y horarios de amanecida de domingo a jueves y fines de semana, o combina tu reserva con horas adicionales a tarifa preferencial.";

export const ROOMS: Room[] = [
  {
    slug: "junior",
    number: "01",
    name: "Junior",
    price: 75000,
    hours: 5,
    highlight: "Jacuzzi, silla del amor y mini sala",
    cardFeatures: ["Jacuzzi", "Silla del amor", "Mini sala"],
    cardPitch: "Todo lo esencial para dos, listo apenas cierras la puerta.",
    tagline:
      "Habitación Junior en La Guaca, Armenia: jacuzzi, silla del amor, mini sala, wifi y parqueadero privado por $75.000 las 5 horas.",
    headline: "Junior: lo esencial para dos, con jacuzzi y 5 horas sin afanes",
    intro:
      "Cómoda, completa y lista apenas cierras la puerta. Entras por tu parqueadero privado, el jacuzzi te espera junto a la mini sala y tienes 5 horas para disfrutar a tu ritmo por $75.000.",
    reserveCta: "Apartar Junior ($75.000) por WhatsApp",
    reserveMessage: "Hola La Guaca, ¿tienen disponible una habitación JUNIOR ($75.000 por 5h)?",
    image: photo(
      "junior-01",
      "Habitación Junior con cama doble, cabecero de madera y cuadro sobre la cama"
    ),
    gallery: [
      photo("junior-02", "Jacuzzi esquinero de la Junior frente a un espejo grande"),
      photo("junior-03", "Silla del amor junto a la pared, con televisor y ventilador"),
      photo("junior-04", "Mini sala con sofá en L, mesa redonda y nevera"),
      photo("junior-05", "Silla del amor en primer plano y la cama de la Junior al fondo"),
      photo("junior-06", "Baño con ducha de vidrio y lavamanos junto a la habitación"),
      photo("junior-07", "Parqueadero privado cubierto con acceso a la habitación"),
    ],
    features: [
      {
        title: "Jacuzzi privado",
        text: "Listo para dos dentro de la habitación, para empezar o cerrar la noche.",
      },
      {
        title: "Silla del amor",
        text: "Para salir de la rutina y probar nuevas posiciones con total comodidad.",
      },
      {
        title: "Mini sala y wifi",
        text: "Un rincón para conversar y brindar, con televisor, equipo de sonido y conexión.",
      },
    ],
    amenities: ["Jacuzzi", "Silla del amor", "Mini sala", "Wifi", "Baño con ducha"],
  },
  {
    slug: "vip-love",
    number: "02",
    name: "VIP Love",
    price: 90000,
    hours: 5,
    highlight: "Columpio del amor y comedor de lujo",
    cardFeatures: ["Jacuzzi", "Columpio del amor", "Comedor de lujo"],
    cardPitch: "Pensada para el romance: cena para dos, juego de luces y columpio.",
    tagline:
      "VIP Love en La Guaca, Armenia: columpio del amor, comedor de lujo, jacuzzi, silla del amor y juego de luces por $90.000 las 5 horas.",
    headline: "VIP Love: romance a puerta cerrada, con columpio del amor y jacuzzi",
    intro:
      "Una habitación hecha para enamorar. Brinden en el comedor de lujo, enciendan el juego de luces y dejen que el columpio del amor y el jacuzzi hagan el resto: 5 horas por $90.000.",
    reserveCta: "Apartar VIP Love ($90.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la habitación VIP LOVE ($90.000 por 5h)?",
    image: photo(
      "vip-love-01",
      "Cama con dosel rojo y cisnes de toalla bajo luz azul en la VIP Love"
    ),
    gallery: [
      photo(
        "vip-love-02",
        "Columpio del amor rojo junto a la pared y globos de corazón en el piso"
      ),
      photo("vip-love-03", "Jacuzzi con pétalos de rosa y globos rojos reflejados en el espejo"),
      photo(
        "vip-love-04",
        "Comedor para dos con sillas tapizadas bajo un techo en forma de corazón"
      ),
      photo("vip-love-05", "Letras LOVE iluminadas en azul sobre una pared con relieve"),
      photo("vip-love-06", "Vista general con columpio, comedor y techo de corazón iluminado"),
      photo("vip-love-07", "Cama con dosel rojo, techo decorado y espejo en la VIP Love"),
    ],
    features: [
      {
        title: "Columpio del amor",
        text: "Suspendido junto a la cama para mecerse, jugar y descubrirse sin prisa.",
      },
      {
        title: "Comedor de lujo",
        text: "Una mesa para dos para brindar o cenar antes de pasar al jacuzzi.",
      },
      {
        title: "Luces y jacuzzi",
        text: "Juego de luces, silla del amor y jacuzzi para crear la atmósfera que quieran.",
      },
    ],
    amenities: [
      "Columpio del amor",
      "Comedor de lujo",
      "Jacuzzi",
      "Silla del amor",
      "Juego de luces",
      "Baño con ducha",
    ],
  },
  {
    slug: "vip-fetiche",
    number: "03",
    name: "VIP Fetiche",
    price: 90000,
    hours: 5,
    highlight: "Guillotina y columpio del amor",
    cardFeatures: ["Jacuzzi", "Guillotina", "Columpio del amor"],
    cardPitch: "Estilo, lujo e imaginación para que tú tengas el control.",
    tagline:
      "VIP Fetiche en La Guaca, Armenia: guillotina, columpio del amor y jacuzzi en un ambiente negro y rojo por $90.000 las 5 horas.",
    headline: "VIP Fetiche: estilo, lujo e imaginación para que tú tengas el control",
    intro:
      "Una habitación para dejar volar la imaginación. Guillotina, columpio del amor y jacuzzi en un ambiente negro y rojo, con todo listo para que tú pongas las reglas: 5 horas por $90.000.",
    reserveCta: "Apartar VIP Fetiche ($90.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la habitación VIP FETICHE ($90.000 por 5h)?",
    image: photo(
      "vip-fetiche-01",
      "Cama roja dentro de una estructura negra con cadenas y guillotina al pie"
    ),
    gallery: [
      photo("vip-fetiche-02", "Jacuzzi frente a un mural de labios rojos y un espejo"),
      photo("vip-fetiche-03", "Cruz en X tapizada en rojo con accesorios colgados en la pared"),
      photo("vip-fetiche-04", "Cama roja con estructura de barrotes y guillotina en primer plano"),
      photo("vip-fetiche-05", "Cama con luz roja bajo una estructura de cadenas"),
      photo("vip-fetiche-06", "Pasillo con mural rojo y negro y cadenas colgantes"),
      photo("vip-fetiche-07", "Sofá rojo en L con mesa alta junto a la cama"),
      photo(
        "vip-fetiche-08",
        "Columpio de cadenas frente a una pared texturizada en negro y plata"
      ),
    ],
    features: [
      {
        title: "Guillotina",
        text: "La pieza protagonista para los juegos de rol, al pie de la cama.",
      },
      {
        title: "Columpio del amor",
        text: "Suspendido con cadenas para explorar nuevas sensaciones.",
      },
      {
        title: "Jacuzzi en clave roja",
        text: "Hidromasaje bajo un mural de labios rojos para cambiar de ritmo.",
      },
    ],
    amenities: ["Guillotina", "Columpio del amor", "Jacuzzi"],
    notes: ["Y más elementos para tu imaginación: pregunta por ellos al reservar."],
  },
  {
    slug: "vip-guillotina",
    number: "04",
    name: "VIP Guillotina",
    price: 90000,
    hours: 5,
    highlight: "Guillotina, jacuzzi grande y tubo de pole dance",
    cardFeatures: ["Jacuzzi grande", "Guillotina", "Tubo de pole dance"],
    cardPitch: "Sensual de principio a fin: guillotina, cama con esposas y tubo para tu show.",
    tagline:
      "VIP Guillotina en La Guaca, Armenia: guillotina, cama con esposas, jacuzzi grande, silla del amor y tubo de pole dance por $90.000 las 5 horas.",
    headline: "VIP Guillotina: una pieza protagonista para despertar todos tus deseos",
    intro:
      "Sensual desde que entras. La guillotina preside la cama con esposas, el tubo de pole dance espera junto al jacuzzi grande y la silla del amor completa el juego: 5 horas por $90.000.",
    reserveCta: "Apartar VIP Guillotina ($90.000)",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible la habitación VIP GUILLOTINA ($90.000 por 5h)?",
    image: photo(
      "vip-guillotina-01",
      "Guillotina metálica al pie de una cama con luz rosada en la base"
    ),
    gallery: [
      photo(
        "vip-guillotina-02",
        "Jacuzzi grande con tubo de pole dance bajo una claraboya iluminada"
      ),
      photo("vip-guillotina-03", "Jacuzzi grande enchapado junto a un espejo y un televisor"),
      photo("vip-guillotina-04", "Guillotina frente a la cama y cuadro sobre el cabecero"),
      photo("vip-guillotina-05", "Silla del amor gris junto a la pared con espejo y televisor"),
      photo("vip-guillotina-06", "Cama doble con luz rosada en la base y toallas dobladas"),
      photo("vip-guillotina-07", "Sofá negro y mesa de centro junto a la entrada"),
    ],
    features: [
      {
        title: "Guillotina y cama con esposas",
        text: "Dos elementos pensados para el juego de roles y la entrega, a puerta cerrada.",
      },
      {
        title: "Jacuzzi grande",
        text: "Hidromasaje amplio bajo una claraboya iluminada, para relajarse después del juego.",
      },
      {
        title: "Tubo de pole dance",
        text: "Junto al jacuzzi, listo para un show privado con tu música.",
      },
    ],
    amenities: [
      "Guillotina",
      "Cama con esposas",
      "Jacuzzi grande",
      "Tubo de pole dance",
      "Silla del amor",
      "Baño con ducha",
    ],
  },
  {
    slug: "vip-fetiche-decorada",
    number: "05",
    name: "VIP Fetiche Decorada",
    price: 180000,
    hours: 6,
    highlight: "Bombas, pétalos, champaña y picada para dos",
    cardFeatures: ["Decoración", "Champaña", "Picada para dos"],
    cardPitch: "La VIP Fetiche lista para celebrar: luces, pétalos y un brindis esperándote.",
    tagline:
      "VIP Fetiche Decorada en La Guaca, Armenia: bombas, pétalos, botella de champaña, picada de carne para dos y luces por $180.000 las 6 horas.",
    headline: "VIP Fetiche Decorada: la fantasía, lista para celebrar apenas llegas",
    intro:
      "La VIP Fetiche con todo preparado para una noche especial. Bombas, pétalos y luces rojas, una botella de champaña y una picada de carne para dos te esperan: 6 horas por $180.000.",
    reserveCta: "Apartar Fetiche Decorada ($180.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la VIP FETICHE DECORADA ($180.000 por 6h)?",
    image: photo(
      "vip-fetiche-decorada-01",
      "Cama roja de la VIP Fetiche con bombas rojas en el techo y mesa con velas"
    ),
    gallery: [
      photo(
        "vip-fetiche-decorada-02",
        "Cama con el mensaje Feliz aniversario mi amor bajo bombas rojas"
      ),
      photo("vip-fetiche-decorada-03", "Vista general con bombas de corazón y pétalos en el piso"),
      photo("vip-fetiche-decorada-04", "Mesa con mantel rojo y velas junto a la cama decorada"),
      photo("vip-fetiche-decorada-05", "Sofá rojo, mesa con champaña y bombas Te amo"),
    ],
    features: [
      {
        title: "Decoración lista",
        text: "Bombas, pétalos y luces rojas preparados antes de que llegues.",
      },
      {
        title: "Champaña para brindar",
        text: "Una botella esperándote en la mesa para abrir la noche.",
      },
      {
        title: "Picada para dos",
        text: "Picada de carne para compartir sin salir de la habitación.",
      },
    ],
    amenities: [
      "Decoración con bombas y pétalos",
      "Botella de champaña",
      "Picada de carne para dos personas",
      "Juego de luces",
    ],
    notes: [
      "Es la VIP Fetiche, con su guillotina, columpio del amor y jacuzzi.",
      "Y más detalles sorpresa: pregunta por ellos al reservar.",
    ],
  },
  {
    slug: "vip-love-decorada",
    number: "06",
    name: "VIP Love Decorada",
    price: 180000,
    hours: 6,
    highlight: "Champaña, picada para dos y jacuzzi",
    cardFeatures: ["Decoración", "Champaña", "Picada para dos", "Jacuzzi"],
    cardPitch: "La VIP Love decorada para sorprender: pétalos, bombas y un brindis para dos.",
    tagline:
      "VIP Love Decorada en La Guaca, Armenia: champaña, picada de carne para dos, pétalos, bombas y jacuzzi por $180.000 las 6 horas.",
    headline: "VIP Love Decorada: la sorpresa perfecta, lista antes de que llegues",
    intro:
      "Para aniversarios, cumpleaños o simplemente porque sí. La VIP Love te recibe con pétalos, bombas de corazón, una botella de champaña y una picada de carne para dos, con el jacuzzi listo: 6 horas por $180.000.",
    reserveCta: "Apartar Love Decorada ($180.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la VIP LOVE DECORADA ($180.000 por 6h)?",
    image: photo(
      "vip-love-decorada-01",
      "Cama con dosel rojo, cisnes de toalla y mensaje Te amo bajo bombas de corazón"
    ),
    gallery: [
      photo("vip-love-decorada-02", "Cama decorada con pétalos y bombas rojas bajo luz azul"),
      photo("vip-love-decorada-03", "Cama con dosel y bombas de corazón flotando en el techo"),
      photo("vip-love-decorada-04", "Jacuzzi con letras LOVE y bombas Te amo en el piso"),
      photo("vip-love-decorada-05", "Comedor y columpio del amor con pétalos y bombas en el piso"),
      photo("vip-love-decorada-06", "Comedor para dos con bombas de corazón bajo luz morada"),
      photo("vip-love-decorada-07", "Comedor de vidrio y columpio con bombas rojas"),
    ],
    features: [
      {
        title: "Pétalos y bombas",
        text: "Corazones en el techo y pétalos en la cama y el piso desde que abres la puerta.",
      },
      {
        title: "Champaña y picada",
        text: "Una botella para brindar y una picada de carne para dos personas.",
      },
      {
        title: "Jacuzzi para dos",
        text: "Rodeado de pétalos, para cerrar la sorpresa a tu ritmo.",
      },
    ],
    amenities: [
      "Decoración con pétalos y bombas",
      "Botella de champaña",
      "Picada de carne para dos personas",
      "Jacuzzi",
    ],
    notes: ["Es la VIP Love, con su columpio del amor y su comedor de lujo."],
  },
  {
    slug: "presidencial-plata",
    number: "07",
    name: "Presidencial Plata",
    price: 200000,
    hours: 6,
    highlight: "Jacuzzi para 10 personas y techo corredizo",
    cardFeatures: ["Jacuzzi para 10", "Turco", "Techo corredizo", "2 habitaciones"],
    cardPitch: "Espacio para celebrar en grupo, con dos habitaciones independientes.",
    tagline:
      "Presidencial Plata en La Guaca, Armenia: jacuzzi para 10 personas, techo corredizo, turco y dos habitaciones independientes por $200.000 las 6 horas.",
    headline: "Presidencial Plata: un jacuzzi para 10 y el cielo abierto sobre tu celebración",
    intro:
      "Para celebrar en grande sin perder la intimidad. Un jacuzzi para 10 personas, techo corredizo, turco y dos habitaciones independientes con sus propios baños: 6 horas por $200.000.",
    reserveCta: "Apartar Presidencial Plata ($200.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la PRESIDENCIAL PLATA ($200.000 por 6h)?",
    image: photo(
      "presidencial-plata-01",
      "Cama con base iluminada y mural de árbol en la Presidencial Plata"
    ),
    gallery: [
      photo("presidencial-plata-02", "Jacuzzi grande enchapado en piedra con luz azul"),
      photo("presidencial-plata-03", "Mini barra con butacos metálicos bajo luz rosada"),
      photo(
        "presidencial-plata-04",
        "Habitación amplia con cama, sofá y techo con líneas iluminadas"
      ),
      photo(
        "presidencial-plata-05",
        "Segunda habitación con cama doble y columnas en negro y plata"
      ),
      photo("presidencial-plata-06", "Entrada con letrero Plata y paredes en negro y plata"),
      photo("presidencial-plata-07", "Mini sala con sofá y mesa alta junto al televisor"),
      photo("presidencial-plata-08", "Banca con luz verde frente a una ventana de arco"),
      photo("presidencial-plata-09", "Cruz en X decorativa en negro y plata junto al televisor"),
    ],
    features: [
      {
        title: "Jacuzzi para 10 personas",
        text: "Gran formato para compartir con tu grupo, con el techo corredizo abierto al cielo.",
      },
      {
        title: "Turco y zona social",
        text: "Vapor, mini barra, mini sala y juego de luces para que la noche fluya.",
      },
      {
        title: "Dos habitaciones independientes",
        text: "Cada una con su baño y ducha, para que cada pareja tenga su espacio.",
      },
    ],
    amenities: [
      "Jacuzzi grande para 10 personas",
      "Techo corredizo",
      "Turco",
      "2 habitaciones independientes",
      "2 baños con ducha",
      "Mini sala y mini barra",
      "Zona social",
      "Juego de luces",
      "Tubo de pole dance",
    ],
  },
  {
    slug: "presidencial-playboy",
    number: "08",
    name: "Presidencial Playboy",
    price: 240000,
    highlight: "Zona DJ, video beam y jacuzzi grande",
    cardFeatures: ["Jacuzzi grande", "Zona DJ", "Video beam", "2 habitaciones"],
    cardPitch: "Tu fiesta privada más exclusiva: tú pones la música y las luces.",
    tagline:
      "Presidencial Playboy en La Guaca, Armenia: zona DJ con consola, video beam, jacuzzi grande y dos habitaciones por $240.000.",
    headline: "Presidencial Playboy: tu propia fiesta exclusiva, con zona DJ y jacuzzi grande",
    intro:
      "La más exclusiva para celebrar a tu manera. Zona DJ con consola de música, video beam, juego de luces, jacuzzi grande y dos habitaciones con sus propios baños, todo a puerta cerrada por $240.000.",
    reserveCta: "Apartar Presidencial Playboy ($240.000)",
    reserveMessage:
      "Hola La Guaca, ¿tienen disponible la PRESIDENCIAL PLAYBOY ($240.000)? ¿Cuántas horas incluye?",
    image: photo(
      "presidencial-playboy-01",
      "Barra y tubo de pole dance con luces de colores y la cama al fondo"
    ),
    gallery: [
      photo("presidencial-playboy-02", "Jacuzzi grande con luz azul y paredes de piedra"),
      photo("presidencial-playboy-03", "Cama rosada con corazones y cuadro sobre el cabecero"),
      photo("presidencial-playboy-04", "Cama con cojines rosados y techo con corazones rojos"),
      photo("presidencial-playboy-05", "Sofá rosado y letrero Playboy iluminado"),
      photo("presidencial-playboy-06", "Conejo de Playboy iluminado en rojo sobre la pared"),
      photo("presidencial-playboy-07", "Entrada con letrero Playboy en neón y luces rosadas"),
      photo("presidencial-playboy-08", "Ruleta de juegos para pareja en la pared rosada"),
    ],
    features: [
      {
        title: "Zona DJ y consola",
        text: "Conecta tu música y toma el control de la noche con el juego de luces.",
      },
      {
        title: "Jacuzzi grande",
        text: "Hidromasaje amplio entre luces de colores para compartir con tu grupo.",
      },
      {
        title: "Dos habitaciones y video beam",
        text: "Cada habitación con su baño y ducha, y video beam para ver lo que quieran.",
      },
    ],
    amenities: [
      "Zona DJ con consola de música",
      "Jacuzzi grande",
      "2 habitaciones",
      "2 baños con ducha",
      "Video beam",
      "Juego de luces",
    ],
  },
  {
    slug: "presidencial-oro",
    number: "09",
    name: "Presidencial Oro",
    price: 280000,
    hours: 6,
    highlight: "Piscina privada, jacuzzi grande y turco",
    cardFeatures: ["Piscina", "Jacuzzi grande", "Turco", "Zona DJ"],
    cardPitch: "Nuestra joya: piscina privada y espacio para celebrar sin límites.",
    tagline:
      "Presidencial Oro en La Guaca, Armenia: piscina privada, jacuzzi grande, turco, zona DJ y dos habitaciones de lujo por $280.000 las 6 horas.",
    headline: "Presidencial Oro: piscina privada y todo el lujo de La Guaca en un solo lugar",
    intro:
      "Nuestra experiencia más completa. Una espectacular piscina privada, jacuzzi grande, turco, zona DJ y dos habitaciones de lujo con tres baños para celebrar en grande: 6 horas por $280.000.",
    reserveCta: "Apartar Presidencial Oro ($280.000)",
    reserveMessage: "Hola La Guaca, ¿tienen disponible la PRESIDENCIAL ORO ($280.000 por 6h)?",
    image: photo(
      "presidencial-oro-01",
      "Piscina con cascada y palmera frente a la fachada de dos pisos"
    ),
    gallery: [
      photo("presidencial-oro-02", "Piscina privada con borde rojo junto a la habitación"),
      photo("presidencial-oro-03", "Habitación de lujo con cama, silla del amor y sala de bambú"),
      photo("presidencial-oro-04", "Cama con base iluminada en azul y sofá junto a la ventana"),
      photo("presidencial-oro-05", "Zona DJ con mural, mesa y escalera a la segunda planta"),
      photo("presidencial-oro-06", "Terraza con sillas de bambú junto a la piscina"),
      photo("presidencial-oro-07", "Pasillo con puerta de vidrio hacia la piscina"),
      photo("presidencial-oro-08", "Piscina y palmera vistas desde la terraza"),
    ],
    features: [
      {
        title: "Piscina privada",
        text: "Agua al aire libre dentro de tu reserva, rodeados de palmas y total privacidad.",
      },
      {
        title: "Jacuzzi grande y turco",
        text: "Para alternar entre el vapor, el hidromasaje y la piscina a tu ritmo.",
      },
      {
        title: "Zona DJ y zona social",
        text: "Juego de luces, mini sala y dos habitaciones de lujo con tres baños.",
      },
    ],
    amenities: [
      "Piscina",
      "Jacuzzi grande",
      "Turco",
      "2 habitaciones de lujo",
      "3 baños con ducha",
      "Zona DJ",
      "Mini sala y zona social",
      "Juego de luces",
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
    title: "Jacuzzi en las nueve",
    text: "Todas las habitaciones tienen jacuzzi privado. En la VIP Guillotina y las presidenciales es de gran formato, y en la Presidencial Plata caben hasta 10 personas.",
    cta: { label: "Ver la Presidencial Plata", href: "/habitaciones/presidencial-plata" },
    image: img("presidencial-plata-02"),
    inset: img("junior-02"),
  },
  {
    id: "romance",
    label: "Romance",
    title: "Un columpio para dos",
    text: "La VIP Love suma columpio del amor, comedor de lujo y juego de luces para una noche romántica a puerta cerrada.",
    cta: { label: "Ver la VIP Love", href: "/habitaciones/vip-love" },
    image: img("vip-love-02"),
    inset: img("vip-love-04"),
  },
  {
    id: "fetiche",
    label: "Fantasía y juego",
    title: "Tú pones las reglas",
    text: "La VIP Fetiche y la VIP Guillotina reúnen guillotina, columpio del amor, cama con esposas y tubo de pole dance para los juegos de rol.",
    cta: { label: "Ver la VIP Fetiche", href: "/habitaciones/vip-fetiche" },
    image: img("vip-fetiche-01"),
    inset: img("vip-guillotina-04"),
  },
  {
    id: "celebracion",
    label: "Celebraciones",
    title: "Zona DJ y techo abierto",
    text: "La Presidencial Playboy tiene zona DJ con consola, video beam y juego de luces; la Plata suma techo corredizo, turco y mini barra. Las dos tienen dos habitaciones independientes.",
    cta: { label: "Ver la Presidencial Playboy", href: "/habitaciones/presidencial-playboy" },
    image: img("presidencial-playboy-01"),
    inset: img("presidencial-plata-03"),
  },
  {
    id: "piscina",
    label: "Piscina privada",
    title: "Agua al aire libre",
    text: "La Presidencial Oro tiene piscina privada, además de jacuzzi grande, turco, zona DJ y dos habitaciones de lujo con tres baños.",
    cta: { label: "Ver la Presidencial Oro", href: "/habitaciones/presidencial-oro" },
    image: img("presidencial-oro-02"),
    inset: img("presidencial-oro-06"),
  },
  {
    id: "restaurante",
    label: "Restaurante 24 horas",
    title: "Pide sin salir",
    text: "Servicio a la habitación y restaurante abierto las 24 horas, con platos desde $16.500 hasta $51.700.",
    cta: { label: "Pedir la carta", href: whatsappUrl(WHATSAPP_MESSAGES.menu) },
    image: img("vip-love-04"),
    inset: img("junior-04"),
  },
];

export const PRIVATE_EXPERIENCES = [
  {
    title: "Jacuzzi privado",
    text: "En las nueve habitaciones, de la Junior a la Presidencial Oro.",
    image: photo("junior-02", "Jacuzzi esquinero de la Junior frente a un espejo grande"),
    ratio: "3 / 4",
  },
  {
    title: "Música y TV",
    text: "Equipo de sonido y televisor en cada habitación.",
    image: photo("junior-03", "Silla del amor bajo un televisor y un ventilador de pared"),
    ratio: "332 / 590",
  },
  {
    title: "Aire y ventilador",
    text: "La temperatura a tu gusto, con nevera en la habitación.",
    image: photo("junior-04", "Mini sala con sofá en L, mesa redonda y nevera"),
    ratio: "3 / 4",
  },
  {
    title: "Servicio a la habitación",
    text: "Pide de la cocina y el bar 24 horas sin salir.",
    image: photo("vip-love-04", "Comedor para dos con sillas tapizadas en la VIP Love"),
    ratio: "4 / 5",
  },
];

/* ---------- Servicios, tarifas e información ---------- */

export const INCLUDED: FeatureItem[] = [
  {
    title: "Jacuzzi privado",
    text: "Hidromasaje en las 9 habitaciones, de gran formato en la VIP Guillotina y las presidenciales.",
  },
  {
    title: "Parqueadero privado",
    text: "Acceso directo en carro o moto a tu habitación con cierre independiente y total reserva.",
  },
  {
    title: "Abierto 24/7",
    text: "Llega a cualquier hora, cualquier día, y aparta tu habitación por WhatsApp.",
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
    text: "Aire acondicionado y ventilador para equilibrar el calor del jacuzzi a tu gusto.",
  },
  {
    title: "Nevera en la habitación",
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
  viewRooms: "Explorar las 9 habitaciones y precios",
  viewAllRooms: "Ver detalles y precios de las 9 habitaciones",
  roomCardCta: "Quiero esta habitación por WhatsApp",
  roomCardCtaAria: (name: string) =>
    `Quiero la habitación ${name} por WhatsApp (se abre en una pestaña nueva)`,
  roomsCarousel: "Habitaciones",
  carouselRole: "carrusel",
  previousRoom: "Habitación anterior",
  nextRoom: "Habitación siguiente",
  roomsCount: (count: number) => `${count} categorías`,
  price: formatPrice,
  priceFor: (value: number, hours?: number) =>
    hours ? `${formatPrice(value)} por ${hours} horas` : formatPrice(value),
  priceShort: (value: number, hours?: number) =>
    hours ? `${formatPrice(value)} / ${hours} horas` : formatPrice(value),
  hoursIncluded: (hours?: number) => (hours ? `${hours} horas` : "Horas: consulta por WhatsApp"),
  roomFeatures: (features: string[]) => features.join(" + "),
  extraPerson: (value: number) => `Persona adicional: ${formatPrice(value)}`,
  extraHour: (value: number) => `Hora adicional: ${formatPrice(value)}`,
  extrasOnRequest: "Persona y hora adicional: consulta por WhatsApp",
  swipeHint: "Desliza para ver más fotos",
  galleryCtaTitle: "¿Te gusta lo que ves?",
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

/** Persona y hora adicional de una habitación; sin dato confirmado se consulta por WhatsApp */
export const roomExtras = (room: Pick<Room, "extraPerson" | "extraHour">): string[] => {
  const extras = [
    room.extraPerson ? UI_LABELS.extraPerson(room.extraPerson) : "",
    room.extraHour ? UI_LABELS.extraHour(room.extraHour) : "",
  ].filter(Boolean);
  return extras.length > 0 ? extras : [UI_LABELS.extrasOnRequest];
};

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
        "Escapa de la rutina a solo 5 minutos de Armenia. Nueve habitaciones con jacuzzi, garaje privado independiente y total discreción. Rato de 5 horas desde $75.000.",
    },
    highlights: [
      {
        label: "En todas las habitaciones",
        items: ["Jacuzzi privado", "Parqueadero privado con cortina", "Room Service discreto 24/7"],
      },
      {
        label: "Experiencia La Guaca",
        items: [
          "Desde 5 horas por reserva",
          "Habitaciones VIP temáticas",
          "Presidenciales para grupos",
        ],
      },
    ],
    intro: {
      title: "Sin afanes ni interrupciones: 5 horas para desconectarse del mundo",
      text: "Mientras otros lugares limitan tu encuentro a 3 o 4 horas, en La Guaca la tarifa base te da 5 horas completas (6 en las decoradas y en las presidenciales Plata y Oro) para disfrutar a tu ritmo. Entra directo a tu garaje privado sin cruzar miradas, pide licores o snacks a la habitación con entrega reservada y vive una experiencia diseñada para parejas o encuentros entre amigos.",
      cta: "Comparar habitaciones desde $75.000",
    },
    jacuzzi: {
      title: "El placer del agua caliente, listo apenas cierras la puerta",
      text: "Olvídate de esperar o de jacuzzis fríos. Las nueve habitaciones tienen hidromasaje privado; en la VIP Guillotina y las presidenciales es de gran formato, y en la Presidencial Plata caben hasta 10 personas.",
      sideLeft: "Jacuzzi en las 9 habitaciones",
      sideRight: "Para 10 en la Plata",
      cta: "Descubrir las experiencias",
    },
    rooms: {
      title: "Elige el nivel de tu fantasía",
      text: "Del jacuzzi para dos de la Junior a la piscina privada de la Presidencial Oro: VIP temáticas para el romance y el juego, dos de ellas decoradas para sorprender, y tres presidenciales para celebrar en grupo. Tarifas desde $75.000.",
    },
    rates: {
      label: "Tarifas transparentes",
      title: "Todo claro antes de entrar: fracción, amanecida y adicionales",
      text: "Disfruta con total tranquilidad. La Junior y las VIP incluyen 5 horas completas; las VIP decoradas y las presidenciales Plata y Oro, 6 horas.",
      items: [
        {
          title: "Fracción / Rato (5 o 6 horas)",
          text: "Disponible las 24 horas en nuestras 9 habitaciones (desde $75.000 hasta $280.000).",
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
      text: "¿Aniversario, cumpleaños o reconciliación? La VIP Love y la VIP Fetiche también vienen decoradas: pétalos, bombas, una botella de champaña y una picada de carne para dos te esperan al llegar. 6 horas por $180.000.",
      cta: "Cotizar decoración romántica",
      items: [
        {
          title: "VIP Love Decorada",
          text: "Pétalos, bombas de corazón, champaña, picada de carne para dos y jacuzzi listo para la sorpresa.",
          link: { label: "Ver la VIP Love Decorada", href: "/habitaciones/vip-love-decorada" },
        },
        {
          title: "VIP Fetiche Decorada",
          text: "La fantasía con bombas, pétalos, luces rojas, champaña y picada de carne para dos.",
          link: {
            label: "Ver la VIP Fetiche Decorada",
            href: "/habitaciones/vip-fetiche-decorada",
          },
        },
        {
          title: "¿Cómo funciona?",
          text: "Escríbenos con al menos 24 horas de anticipación, elige la categoría de tu suite y abona tu reserva por transferencia para tener todo listo a la hora exacta de tu llegada.",
        },
      ] satisfies FeatureItemWithLink[],
    },
    experiences: {
      id: "experiencias",
      label: "Experiencias sensoriales",
      title: "Vapor, música y fantasía a puerta cerrada",
    },
    showcase: [
      {
        id: "romance",
        label: "Romance",
        title: "Columpio del amor y cena para dos",
        text: "En la VIP Love brindan en el comedor de lujo, encienden las luces y el columpio hace el resto.",
        image: img("vip-love-03"),
      },
      {
        id: "fetiche",
        label: "Fantasía y juego",
        title: "Guillotina, esposas y pole dance",
        text: "La VIP Fetiche y la VIP Guillotina están hechas para romper la timidez y que tú pongas las reglas.",
        image: img("vip-guillotina-01"),
      },
      {
        id: "celebracion",
        label: "Celebraciones",
        title: "Jacuzzi para 10, zona DJ y piscina",
        text: "Las presidenciales Plata, Playboy y Oro tienen dos habitaciones y espacio para celebrar en grupo.",
        image: img("presidencial-oro-01"),
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
      "Desde 5 horas · Jacuzzi en cada habitación · Piscina privada",
      "Parqueadero discreto · Km 2 vía Montenegro · Abierto 24/7",
    ] as [string, string],
  },
  experience: {
    meta: {
      title: "Experiencias",
      description:
        "Jacuzzi en las nueve habitaciones, columpio del amor, guillotina, pole dance, zona DJ, piscina privada y restaurante 24 horas en La Guaca, Armenia.",
    },
    hero: {
      title: "Romance, juego y celebración",
      sideLeft: "Jacuzzi en las 9",
      sideRight: "Piscina en la Oro",
      text: "Todas las habitaciones tienen jacuzzi; las VIP suman columpio, guillotina y pole dance, y las presidenciales, turco, zona DJ y piscina.",
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
        "La tarifa base incluye 5 horas en la Junior y las VIP, y 6 horas en las VIP decoradas y las presidenciales Plata y Oro. Pregunta por WhatsApp el valor de la hora adicional.",
    },
    {
      question: "¿Puedo ir con más personas?",
      answer:
        "Sí. Cada persona adicional tiene un valor según la habitación, y las presidenciales tienen espacio para grupos (en la Plata el jacuzzi es para 10). Pregunta por WhatsApp cuántas personas admite la que te interesa.",
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
      question: "¿Qué diferencia hay entre las habitaciones?",
      answer: `La Junior tiene lo esencial para dos; las VIP son temáticas (Love, Fetiche y Guillotina), la Love y la Fetiche también vienen decoradas, y las presidenciales tienen dos habitaciones para grupos. ${ROOM_VERSIONS_NOTE}`,
    },
    {
      question: "¿Cómo reservo?",
      answer:
        "Escríbenos por WhatsApp con la habitación y la hora que quieres, y te contamos qué hay disponible. También puedes llamar.",
      link: { label: "Escribir por WhatsApp", href: whatsappUrl() },
    },
  ] satisfies FaqItem[],
  rooms: {
    meta: {
      title: "Habitaciones y tarifas",
      description:
        "Junior, VIP Love, VIP Fetiche, VIP Guillotina y presidenciales Plata, Playboy y Oro: todas con jacuzzi y parqueadero privado. Desde $75.000 en Armenia.",
    },
    hero: {
      label: "Elige el escenario de tu próxima escapada",
      title: "Nuestras 9 habitaciones: compara y elige tu experiencia",
      text: "Todas tienen jacuzzi privado y parqueadero independiente, con 5 horas en la Junior y las VIP y 6 en las VIP decoradas y las presidenciales Plata y Oro.",
      sideRight: "Desde 5 horas",
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
      title: "Precios claros, desde 5 horas",
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
      text: "Revisa todo lo que incluye esta habitación y sus tarifas transparentes.",
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
