/**
 * Textos, listas e imágenes del sitio (punto 3 de personalización).
 * Todo el contenido es de ejemplo: reemplázalo por el del cliente real.
 */

import type { IconName } from "@/lib/icons";

export interface ImageAsset {
  src: string;
  alt: string;
}

/** Título en dos partes: la segunda va en cursiva y color de acento */
export interface SplitTitle {
  lead: string;
  accent: string;
}

export interface Chip {
  icon: IconName;
  label: string;
}

export interface LinkAction {
  label: string;
  href: string;
}

export interface Fact {
  value: string;
  label: string;
}

export interface PageMeta {
  /** Título de la pestaña del navegador (se le añade el sufijo de marca) */
  seoTitle: string;
  description: string;
}

/** Momento del día: ordena los rituales y filtra las experiencias */
export type DayPhase = "dawn" | "day" | "dusk" | "night";

export type SuiteKind = "suite" | "house" | "villa";

export interface LightMoment {
  time: string;
  title: string;
  text: string;
}

export interface Suite {
  slug: string;
  name: string;
  kind: SuiteKind;
  /** Precio por noche, sin símbolo (se formatea con `currencySymbol` de site.ts) */
  price: number;
  /** Superficie en m² */
  area: number;
  guests: number;
  bedrooms: number;
  nightTemp: string;
  facing: string;
  /** Rasgo que aparece en la tabla comparativa */
  signature: string;
  /** Rasgo corto de la tarjeta (chip con chincheta) */
  feature: string;
  summary: string;
  image: ImageAsset;
  /** Imagen redonda superpuesta en la cabecera del detalle */
  inset: ImageAsset;
  /** Galería del detalle (se abre en el visor) */
  gallery: ImageAsset[];
  light: LightMoment[];
  amenities: string[];
  /** Slugs de las tres suites recomendadas al final del detalle */
  related: string[];
}

export interface Ritual {
  time: string;
  title: string;
  text: string;
  chips: Chip[];
  image: ImageAsset;
  phase: DayPhase;
}

export interface Experience {
  name: string;
  duration: string;
  moment: string;
  phase: DayPhase;
  image: ImageAsset;
}

export interface Program {
  slug: string;
  numeral: string;
  name: string;
  nights: number;
  pricePerson: number;
  pricePerCouple: number;
  tagline: string;
  description: string;
  highlights: string[];
  /** Una entrada por cada `PROGRAM_FEATURES`: si está incluida en el programa */
  includes: boolean[];
  image: ImageAsset;
  featured?: boolean;
}

export interface GuestNote {
  /** Cita en tres partes: la del medio va en cursiva */
  quote: [string, string, string];
  name: string;
  program: string;
  stay: string;
  avatar: ImageAsset;
}

export interface TeamMember {
  name: string;
  role: string;
  tags: string[];
  quote: string;
  image: ImageAsset;
}

export interface Faq {
  question: string;
  answer: string;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "h2"; text: string }
  | { type: "image"; image: ImageAsset; tall?: boolean };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  minutes: number;
  /** Fecha ISO (AAAA-MM-DD) */
  date: string;
  /** Índice en `LONGEVITY.team` del autor */
  author: number;
  cover: ImageAsset;
  caption: string;
  body: ArticleBlock[];
  tags: string[];
}

const IMG = {
  heroHome: "/images/hero/home.webp",
  heroSuites: "/images/hero/suites.webp",
  heroDining: "/images/hero/dining.webp",
  heroLongevity: "/images/hero/longevity.webp",
  moonrise: "/images/journal/moonrise.webp",
  suite1: "/images/suites/suite-1.webp",
  suite2: "/images/suites/suite-2.webp",
  suite3: "/images/suites/suite-3.webp",
  suite4: "/images/suites/suite-4.webp",
  suite5: "/images/suites/suite-5.webp",
  suite6: "/images/suites/suite-6.webp",
  stone: "/images/suites/stone-detail.webp",
  pool: "/images/places/reflecting-pool.webp",
  sand: "/images/places/sand-ripples.webp",
  thermal: "/images/places/thermal-oculus.webp",
  nightSky: "/images/places/night-sky.webp",
  firstLight: "/images/rituals/first-light.webp",
  breakfast: "/images/rituals/breakfast.webp",
  lab: "/images/rituals/longevity-lab.webp",
  shade: "/images/rituals/shade-hours.webp",
  soundBath: "/images/rituals/sound-bath.webp",
  longTable: "/images/rituals/long-table.webp",
  observatory: "/images/rituals/observatory.webp",
  sleep: "/images/rituals/sleep.webp",
  fire: "/images/rituals/fire-circle.webp",
  exp1: "/images/experiences/experience-1.webp",
  exp2: "/images/experiences/experience-2.webp",
  exp3: "/images/experiences/experience-3.webp",
  exp5: "/images/experiences/experience-5.webp",
  exp6: "/images/experiences/experience-6.webp",
  chef: "/images/people/chef.webp",
  team1: "/images/people/team-1.webp",
  team2: "/images/people/team-2.webp",
  team3: "/images/people/team-3.webp",
  guest1: "/images/people/guest-1.webp",
  guest2: "/images/people/guest-2.webp",
  guest3: "/images/people/guest-3.webp",
  guest4: "/images/people/guest-4.webp",
  guest5: "/images/people/guest-5.webp",
};

const PHOTOS = {
  sand: { src: IMG.sand, alt: "Ondas de arena dibujadas por el viento, de cerca." },
  firstLight: {
    src: IMG.firstLight,
    alt: "Una huésped con bata de rayas camina bajo una pérgola a la sombra al amanecer.",
  },
  shade: {
    src: IMG.shade,
    alt: "Suite en sombra con chimenea de barro y un diván bajo junto a la ventana.",
  },
  stone: { src: IMG.stone, alt: "Detalle de los muros de piedra de una de las casas." },
  pool: { src: IMG.pool, alt: "El retiro y su estanque reflectante al atardecer." },
  thermal: {
    src: IMG.thermal,
    alt: "Piscina termal bajo un haz de luz que entra por un óculo.",
  },
  sleep: {
    src: IMG.sleep,
    alt: "Dormitorio en penumbra con luz ámbar y cortinas gruesas de lana.",
  },
  breakfast: {
    src: IMG.breakfast,
    alt: "Desayuno mineral de dátiles, higos, labneh y tónicos.",
  },
  soundBath: {
    src: IMG.soundBath,
    alt: "Manos que sostienen un cuenco de agua con ramas de olivo.",
  },
} satisfies Record<string, ImageAsset>;

/** Horario solar de ejemplo: alimenta el reloj, el arco del sol y la cinta de la portada */
export const SUN = {
  sunrise: "05:48",
  solarNoon: "12:15",
  sunset: "18:42",
  moonrise: "20:04",
  starsVisible: "21:10",
  tomorrowSunrise: "05:49",
  /** Días de antelación de la fecha de llegada sugerida en los planificadores */
  defaultLeadDays: 30,
};

export const SUITES: Suite[] = [
  {
    slug: "canyon-room",
    name: "Habitación Cañón",
    kind: "suite",
    price: 1180,
    area: 58,
    guests: 2,
    bedrooms: 1,
    nightTemp: "17°",
    facing: "Este",
    signature: "Muro de cristal hacia el cañón",
    feature: "Muro de cristal",
    summary:
      "Un muro entero de cristal frente a un cañón estrecho: la luz entra de lado y la roca cambia de color cada hora.",
    image: {
      src: IMG.suite1,
      alt: "Habitación con un muro completo de cristal frente a un cañón estrecho.",
    },
    inset: PHOTOS.sand,
    gallery: [
      { src: IMG.suite1, alt: "Vista del cañón desde la cama de la habitación." },
      PHOTOS.shade,
      PHOTOS.sand,
    ],
    light: [
      {
        time: "05:48",
        title: "El cañón despierta",
        text: "La primera luz baja por la roca hasta la cama.",
      },
      {
        time: "09:00",
        title: "Café en el umbral",
        text: "El cristal se abre y entra el aire todavía fresco.",
      },
      {
        time: "13:00",
        title: "Sombra profunda",
        text: "El cañón protege la habitación del sol del mediodía.",
      },
      {
        time: "17:30",
        title: "Roca encendida",
        text: "Las paredes del cañón pasan del ocre al cobre.",
      },
      {
        time: "21:00",
        title: "Una franja de cielo",
        text: "Entre las dos paredes asoma una banda de estrellas.",
      },
    ],
    amenities: [
      "Muro de cristal al cañón",
      "Cama king de látex natural",
      "Ducha de lluvia",
      "Iluminación circadiana",
      "Cortinas opacas de lana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["dune-suite", "mesa-suite", "shadow-house"],
  },
  {
    slug: "dune-suite",
    name: "Suite Duna",
    kind: "suite",
    price: 1280,
    area: 68,
    guests: 2,
    bedrooms: 1,
    nightTemp: "18°",
    facing: "Este",
    signature: "Terraza al amanecer",
    feature: "Terraza este",
    summary:
      "Mira al este, así que la primera luz encuentra la cama antes que tú. Una terraza baja se abre directamente a las dunas.",
    image: {
      src: IMG.suite2,
      alt: "Dormitorio de la Suite Duna con una ventana en arco y luz de mañana.",
    },
    inset: PHOTOS.sand,
    gallery: [
      { src: IMG.suite2, alt: "Cama baja junto a la ventana en arco de la Suite Duna." },
      PHOTOS.sand,
      PHOTOS.firstLight,
    ],
    light: [
      {
        time: "05:48",
        title: "Primera luz en la cama",
        text: "El sol supera la meseta y cae sobre la almohada: sin alarma.",
      },
      {
        time: "09:00",
        title: "Desayuno en la terraza",
        text: "Higos y tónico en la terraza este mientras la arena sigue fresca.",
      },
      {
        time: "13:00",
        title: "Cortinas corridas",
        text: "Las cortinas de lana se cierran y la habitación guarda el fresco de la noche.",
      },
      { time: "17:30", title: "Sombras largas", text: "Las dunas rayan el suelo de oro y gris." },
      {
        time: "21:00",
        title: "Se enciende el cielo",
        text: "Las luces bajan a ámbar y las estrellas toman el relevo.",
      },
    ],
    amenities: [
      "Terraza del amanecer",
      "Cama king de látex natural",
      "Ducha de lluvia",
      "Iluminación circadiana",
      "Cortinas opacas de lana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["shadow-house", "courtyard-villa", "mesa-suite"],
  },
  {
    slug: "mesa-suite",
    name: "Suite Meseta",
    kind: "suite",
    price: 1560,
    area: 84,
    guests: 2,
    bedrooms: 1,
    nightTemp: "17°",
    facing: "Oeste",
    signature: "Excavada en la roca",
    feature: "Excavada en roca",
    summary:
      "Excavada en la roca roja de la meseta: muros de un metro, una escalera de piedra y una ventana que mira al poniente.",
    image: {
      src: IMG.suite3,
      alt: "Suite excavada en roca roja, iluminada por dentro al anochecer.",
    },
    inset: PHOTOS.thermal,
    gallery: [
      { src: IMG.suite3, alt: "Fachada de la Suite Meseta al anochecer." },
      PHOTOS.thermal,
      PHOTOS.sand,
    ],
    light: [
      {
        time: "05:48",
        title: "Roca fría",
        text: "La piedra conserva el frescor de la noche hasta media mañana.",
      },
      {
        time: "09:00",
        title: "Escalera al sol",
        text: "El desayuno sube por la escalera de piedra hasta el mirador.",
      },
      {
        time: "13:00",
        title: "Dentro de la montaña",
        text: "Un metro de roca separa la habitación del calor.",
      },
      {
        time: "17:30",
        title: "Poniente rojo",
        text: "La ventana oeste se llena de cobre y polvo dorado.",
      },
      {
        time: "21:00",
        title: "Lámparas bajas",
        text: "La meseta se apaga y solo quedan las ventanas encendidas.",
      },
    ],
    amenities: [
      "Mirador privado",
      "Cama king de látex natural",
      "Baño de piedra",
      "Iluminación circadiana",
      "Cortinas opacas de lana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["canyon-room", "star-loft", "shadow-house"],
  },
  {
    slug: "shadow-house",
    name: "Casa Sombra",
    kind: "house",
    price: 1940,
    area: 110,
    guests: 2,
    bedrooms: 1,
    nightTemp: "16°",
    facing: "Norte",
    signature: "Bañera monolítica de piedra",
    feature: "Bañera de piedra",
    summary:
      "Mira al norte y se mantiene fresca hasta el atardecer. Una bañera tallada en un solo bloque recibe una rendija de luz.",
    image: {
      src: IMG.suite4,
      alt: "Bañera de piedra tallada en la Casa Sombra bajo una rendija de luz.",
    },
    inset: PHOTOS.stone,
    gallery: [
      { src: IMG.suite4, alt: "Bañera de piedra de la Casa Sombra." },
      PHOTOS.stone,
      PHOTOS.shade,
    ],
    light: [
      {
        time: "05:48",
        title: "Luz indirecta",
        text: "El norte trae una luz pareja, sin sombras duras.",
      },
      {
        time: "09:00",
        title: "Patio en sombra",
        text: "El patio interior sigue fresco para leer al aire libre.",
      },
      {
        time: "13:00",
        title: "La rendija",
        text: "A mediodía, un haz de sol cruza la bañera durante once minutos.",
      },
      {
        time: "17:30",
        title: "Piedra tibia",
        text: "Los muros devuelven despacio el calor de la tarde.",
      },
      {
        time: "21:00",
        title: "Baño de estrellas",
        text: "Se abre la trampilla del techo sobre la bañera.",
      },
    ],
    amenities: [
      "Bañera monolítica de piedra",
      "Patio interior en sombra",
      "Cama king de látex natural",
      "Iluminación circadiana",
      "Cortinas opacas de lana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["dune-suite", "courtyard-villa", "star-loft"],
  },
  {
    slug: "star-loft",
    name: "Loft Estelar",
    kind: "suite",
    price: 2200,
    area: 96,
    guests: 2,
    bedrooms: 1,
    nightTemp: "16°",
    facing: "Cielo",
    signature: "Óculo sobre la cama",
    feature: "Ventana al cielo",
    summary:
      "Un óculo redondo sobre la cama enmarca el cielo más oscuro de la región. Se duerme mirando la Vía Láctea.",
    image: {
      src: IMG.suite5,
      alt: "Cama del Loft Estelar bajo una ventana redonda llena de estrellas.",
    },
    inset: PHOTOS.soundBath,
    gallery: [
      { src: IMG.suite5, alt: "Óculo sobre la cama del Loft Estelar." },
      PHOTOS.sleep,
      PHOTOS.soundBath,
    ],
    light: [
      {
        time: "05:48",
        title: "El óculo se aclara",
        text: "El círculo pasa del azul tinta al rosa.",
      },
      {
        time: "09:00",
        title: "Desayuno arriba",
        text: "La bandeja llega a la terraza del altillo.",
      },
      {
        time: "13:00",
        title: "Toldo cerrado",
        text: "Un toldo de lino cubre el óculo en las horas fuertes.",
      },
      { time: "17:30", title: "Cielo malva", text: "El óculo vuelve a abrirse para el atardecer." },
      {
        time: "21:00",
        title: "Vía Láctea",
        text: "Las luces se apagan del todo: el techo es el cielo.",
      },
    ],
    amenities: [
      "Óculo sobre la cama",
      "Telescopio de mano",
      "Cama king de látex natural",
      "Iluminación circadiana",
      "Cortinas opacas de lana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["shadow-house", "mesa-suite", "courtyard-villa"],
  },
  {
    slug: "courtyard-villa",
    name: "Villa Patio",
    kind: "villa",
    price: 3600,
    area: 240,
    guests: 4,
    bedrooms: 2,
    nightTemp: "18°",
    facing: "Oeste",
    signature: "Piscina privada de inmersión",
    feature: "Piscina privada",
    summary:
      "Dos dormitorios alrededor de un patio con olivo y piscina de inmersión, orientada al oeste para la larga hora cobriza.",
    image: {
      src: IMG.suite6,
      alt: "Villa Patio con su piscina de inmersión al anochecer.",
    },
    inset: PHOTOS.pool,
    gallery: [
      { src: IMG.suite6, alt: "Patio y piscina de la Villa Patio." },
      PHOTOS.pool,
      PHOTOS.breakfast,
    ],
    light: [
      {
        time: "05:48",
        title: "Patio azul",
        text: "El agua de la piscina refleja el cielo antes del sol.",
      },
      {
        time: "09:00",
        title: "Mesa bajo el olivo",
        text: "El desayuno se sirve a la sombra del árbol.",
      },
      {
        time: "13:00",
        title: "Siesta en la galería",
        text: "Las galerías cubiertas mantienen la casa fresca.",
      },
      { time: "17:30", title: "Hora cobriza", text: "El oeste tiñe los muros y el agua de cobre." },
      {
        time: "21:00",
        title: "Cena en casa",
        text: "La mesa larga del patio se ilumina con velas.",
      },
    ],
    amenities: [
      "Piscina privada de inmersión",
      "Dos dormitorios en suite",
      "Patio con olivo",
      "Cocina para chef privado",
      "Iluminación circadiana",
      "Bar mineral y ritual de té",
      "Sin televisión, por diseño",
      "Mayordomo de guardia, 24 h",
    ],
    related: ["shadow-house", "dune-suite", "star-loft"],
  },
];

export const RITUALS: Ritual[] = [
  {
    time: "05:48",
    title: "Paseo de la primera luz",
    text: "Una caminata en silencio hasta el borde este mientras el sol supera la meseta.",
    chips: [
      { icon: "clock", label: "45 min" },
      { icon: "pin", label: "Borde este" },
    ],
    image: PHOTOS.firstLight,
    phase: "dawn",
  },
  {
    time: "07:30",
    title: "Desayuno mineral",
    text: "Dátiles, higos, labneh y tónicos de hierbas en la terraza del sol.",
    chips: [
      { icon: "sun", label: "Toda la mañana" },
      { icon: "pin", label: "Terraza del sol" },
    ],
    image: PHOTOS.breakfast,
    phase: "dawn",
  },
  {
    time: "10:00",
    title: "Laboratorio de longevidad",
    text: "Tu hora diaria con el médico: primero los números, luego el movimiento.",
    chips: [
      { icon: "clock", label: "60 min" },
      { icon: "bed", label: "Casa de longevidad" },
    ],
    image: { src: IMG.lab, alt: "Camilla del laboratorio de longevidad bajo un tragaluz redondo." },
    phase: "day",
  },
  {
    time: "13:00",
    title: "Horas de sombra",
    text: "El desierto se queda quieto. Nosotros también: siesta, libros y el fresco de la kiva.",
    chips: [
      { icon: "clock", label: "13:00–15:30" },
      { icon: "bed", label: "Tu suite" },
    ],
    image: PHOTOS.shade,
    phase: "day",
  },
  {
    time: "16:00",
    title: "Circuito termal",
    text: "Piscina del óculo, gruta de sal, sauna de enebro, inmersión fría. Repetir.",
    chips: [
      { icon: "clock", label: "90 min" },
      { icon: "bed", label: "Casa termal" },
    ],
    image: PHOTOS.thermal,
    phase: "day",
  },
  {
    time: "18:42",
    title: "Baño de sonido en la hora dorada",
    text: "Cuencos de cristal en la terraza oeste, mientras la piedra se vuelve cobre.",
    chips: [
      { icon: "clock", label: "45 min" },
      { icon: "pin", label: "Terraza oeste" },
    ],
    image: PHOTOS.soundBath,
    phase: "dusk",
  },
  {
    time: "19:30",
    title: "Cena en la mesa larga",
    text: "Un solo turno, catorce puestos, todo cocinado al fuego.",
    chips: [
      { icon: "clock", label: "2 h" },
      { icon: "pin", label: "La mesa larga" },
    ],
    image: {
      src: IMG.longTable,
      alt: "Mesa larga iluminada con velas sobre la arena al anochecer.",
    },
    phase: "dusk",
  },
  {
    time: "21:30",
    title: "El observatorio",
    text: "Un telescopio de 24 pulgadas y una astrónoma residente.",
    chips: [
      { icon: "moon", label: "Cada noche" },
      { icon: "pin", label: "La meseta" },
    ],
    image: { src: IMG.observatory, alt: "Cúpula del observatorio bajo la Vía Láctea." },
    phase: "night",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    name: "Caminata por el cañón",
    duration: "3 h",
    moment: "Alba",
    phase: "dawn",
    image: { src: IMG.exp1, alt: "Luz de sol que cae dentro de un cañón estrecho." },
  },
  {
    name: "Cabalgar la sombra larga",
    duration: "2 h",
    moment: "Hora dorada",
    phase: "dusk",
    image: { src: IMG.exp2, alt: "Jinete a caballo cruzando el desierto en la hora dorada." },
  },
  {
    name: "Cena del horno de tierra",
    duration: "4 h",
    moment: "Anochecer",
    phase: "dusk",
    image: { src: IMG.exp3, alt: "Pan plano que sale de un horno de tierra humeante." },
  },
  {
    name: "Respiración en las dunas",
    duration: "1 h",
    moment: "Amanecer",
    phase: "dawn",
    image: { src: IMG.sand, alt: "Dunas onduladas por el viento, de cerca." },
  },
  {
    name: "Barro con la familia del taller",
    duration: "3 h",
    moment: "Mañana",
    phase: "day",
    image: { src: IMG.exp5, alt: "Alfarero modelando barro en el torno del taller." },
  },
  {
    name: "Paseo por el jardín del desierto",
    duration: "1 h",
    moment: "Mediodía",
    phase: "day",
    image: { src: IMG.exp6, alt: "Jardín de agaves y palmeras junto a un canal de agua." },
  },
];

export const THERMAL_CIRCUIT: Fact[] = [
  { value: "34°", label: "Piscina del óculo" },
  { value: "41°", label: "Gruta de sal y barro" },
  { value: "9°", label: "Inmersión fría" },
  { value: "62°", label: "Sauna de enebro" },
  { value: "∞", label: "Sala de flotación" },
];

/** Lo que puede incluir un programa (tabla de precios de /longevity) */
export const PROGRAM_FEATURES = [
  "Panel de biomarcadores (92)",
  "Estudio de arquitectura del sueño",
  "VO₂ máx. y DEXA",
  "Monitor continuo de glucosa",
  "Sesión diaria con el médico",
  "Circuito termal y de frío",
  "Entrenador de movimiento privado",
  "Seguimiento de 12 meses",
];

export const PROGRAMS: Program[] = [
  {
    slug: "reset",
    numeral: "I",
    name: "Reinicio",
    nights: 3,
    pricePerson: 4900,
    pricePerCouple: 7800,
    tagline: "Un reinicio del sistema nervioso",
    description: "Un reinicio del sistema nervioso: sueño, calor, frío y una página en blanco.",
    highlights: [
      "Panel de biomarcadores — 92 marcadores",
      "Sesión diaria con el médico",
      "Circuito termal y de frío, dos veces al día",
      "Reinicio de la higiene del sueño",
      "Respiración con la primera luz",
      "Un plan de una página para llevar a casa",
    ],
    includes: [true, false, false, false, true, true, false, false],
    image: PHOTOS.thermal,
  },
  {
    slug: "restore",
    numeral: "II",
    name: "Restauración",
    nights: 5,
    pricePerson: 8400,
    pricePerCouple: 13600,
    tagline: "Nuestro programa insignia",
    description:
      "Nuestro programa insignia. Una imagen completa de biomarcadores, un sueño reconstruido y un plan que te acompaña a casa.",
    highlights: [
      "Panel de biomarcadores — 92 marcadores",
      "Estudio de sueño de dos noches",
      "VO₂ máx. y DEXA",
      "Sesión diaria con el médico",
      "Circuito termal y de frío, dos veces al día",
      "Un plan escrito y seis meses de seguimiento",
    ],
    includes: [true, true, true, true, true, true, false, false],
    image: { src: IMG.lab, alt: "Camilla del laboratorio de longevidad bajo un tragaluz ovalado." },
    featured: true,
  },
  {
    slug: "renew",
    numeral: "III",
    name: "Renovación",
    nights: 7,
    pricePerson: 12600,
    pricePerCouple: 20400,
    tagline: "Diagnóstico profundo y un año de cuidado",
    description:
      "Diagnóstico profundo, trabajo metabólico y cardiovascular, y un año de seguimiento.",
    highlights: [
      "Todo lo de Restauración",
      "Trabajo metabólico y cardiovascular",
      "Entrenador de movimiento privado",
      "Monitor continuo de glucosa",
      "Suplementación si hace falta",
      "Doce meses con tu médico",
    ],
    includes: [true, true, true, true, true, true, true, true],
    image: PHOTOS.sleep,
  },
];

export const GUEST_NOTES: GuestNote[] = [
  {
    quote: [
      "“Vine por el estudio del sueño y me fui con mis tardes de vuelta. Es el lugar ",
      "más tranquilo",
      " en el que he estado.”",
    ],
    name: "Aiko T., Kioto",
    program: "Renovación",
    stay: "4 noches, Casa Sombra",
    avatar: { src: IMG.guest1, alt: "Retrato de huésped" },
  },
  {
    quote: [
      "“Dejamos de mirar la hora el segundo día. El ",
      "sol",
      " nos decía cuándo comer, nadar y dormir.”",
    ],
    name: "Sofía y Dan M., Lisboa",
    program: "Restauración",
    stay: "7 noches, Villa Patio",
    avatar: { src: IMG.guest2, alt: "Retrato de huésped" },
  },
  {
    quote: [
      "“El circuito termal a mediodía, el fuego por la noche. Nunca había dormido tan ",
      "profundo",
      ".”",
    ],
    name: "James O., Londres",
    program: "Reinicio",
    stay: "5 noches, Loft Estelar",
    avatar: { src: IMG.guest3, alt: "Retrato de huésped" },
  },
  {
    quote: [
      "“Cada detalle es silencioso y no falta nada. Sabían lo que necesitábamos ",
      "antes que",
      " nosotros.”",
    ],
    name: "Hanna L., Copenhague",
    program: "Restauración",
    stay: "5 noches, Casa Sombra",
    avatar: { src: IMG.guest4, alt: "Retrato de huésped" },
  },
  {
    quote: ["“Abrimos la trampilla del techo y nos dormimos bajo la ", "Vía Láctea", ".”"],
    name: "Marco y Elisa R., Milán",
    program: "Reinicio",
    stay: "3 noches, Suite Duna",
    avatar: { src: IMG.guest5, alt: "Retrato de huésped" },
  },
];

/** Logotipos de prensa en texto; `style` elige una de las variantes tipográficas de global.css */
export const PRESS: {
  name: string;
  style: "serif-italic" | "wide" | "serif" | "bold" | "classic";
}[] = [
  { name: "Errancia", style: "serif-italic" },
  { name: "ATLAS TRIMESTRAL", style: "wide" },
  { name: "Maison", style: "serif" },
  { name: "LENTO/DIARIO", style: "bold" },
  { name: "Revista Mediodía", style: "classic" },
];

export const HOME = {
  hero: {
    title: { lead: "Vive al ritmo", accent: "de la luz." } satisfies SplitTitle,
    text: "Un retiro de piedra, sombra y silencio. Veinticuatro suites orientadas según el camino del sol, y el descanso que habías olvidado que necesitabas.",
    image: {
      src: IMG.heroHome,
      alt: "Una mujer con vestido de lino camina descalza por las dunas al amanecer.",
    },
    planner: {
      fields: [
        { label: "Llegada", value: "" },
        { label: "Noches", value: "5 noches" },
        { label: "Huéspedes", value: "2 adultos" },
        { label: "Programa", value: "Restauración" },
      ],
      cta: "Ver disponibilidad",
      ctaShort: "Ver fechas",
    },
  },
  manifesto: {
    /** Cada línea es una lista de fragmentos; `image` intercala una foto en forma de píldora */
    lines: [
      [{ text: "Creamos Almara" }, { image: PHOTOS.pool }, { text: "para las" }],
      [{ text: "horas intermedias, cuando" }, { image: PHOTOS.sand }],
      [{ text: "la piedra guarda el fresco" }],
      [{ text: "de la noche y el día" }, { image: PHOTOS.firstLight }, { text: "aún" }],
      [{ text: "no te pide nada.", accent: true }],
    ] as { text?: string; image?: ImageAsset; accent?: boolean }[][],
    stats: [
      { value: 24, suffix: "", label: "Suites y villas en el desierto" },
      { value: 1400, suffix: "", label: "Hectáreas de tierra protegida" },
      { value: 2100, suffix: " m", label: "Sobre el mar, más cerca de las estrellas" },
      { value: 0, suffix: "", label: "Pantallas tras la puesta de sol" },
    ],
  },
  sunPath: {
    title: { lead: "Un día, medido", accent: "por el sol." } satisfies SplitTitle,
    text: "Aquí nada funciona con reloj. Cada ritual sigue la luz, para que tu cuerpo recuerde el ritmo para el que fue hecho.",
  },
  suites: {
    title: { lead: "Habitaciones que", accent: "guardan la sombra." } satisfies SplitTitle,
    text: "Veinticuatro suites y villas, cada una orientada al sol: al este para despertar con él, al oeste para verlo marchar. Muros de medio metro mantienen el mediodía a raya.",
    link: { label: "Ver todas las suites", href: "/suites" } satisfies LinkAction,
    featured: ["dune-suite", "shadow-house", "courtyard-villa"],
  },
  ticker: [
    `Amanecer ${SUN.sunrise}`,
    `Mediodía solar ${SUN.solarNoon}`,
    `Atardecer ${SUN.sunset}`,
    `Salida de la luna ${SUN.moonrise}`,
    `Estrellas visibles ${SUN.starsVisible}`,
  ],
  thermal: {
    title: { lead: "El mediodía es", accent: "para el agua." } satisfies SplitTitle,
    text: "Cuando el desierto suena más fuerte, baja. Una casa termal excavada en la meseta, iluminada por un solo círculo de cielo.",
    image: { src: IMG.thermal, alt: "Piscina termal abovedada iluminada por un único óculo." },
  },
  programs: {
    title: { lead: "Quédate más.", accent: "Envejece despacio." } satisfies SplitTitle,
    text: "Nuestra casa de longevidad une médicos y científicos del sueño con la medicina más antigua que existe: sol, calor, frío y silencio. Cada programa empieza con una imagen completa de ti y termina con un plan para llevar a casa.",
    image: {
      src: IMG.lab,
      alt: "Camilla bajo un tragaluz ovalado en la casa de longevidad.",
    },
    doctor: {
      label: "Directora médica",
      name: "Dra. Inés Moreno",
      role: "Medicina de longevidad y sueño",
    },
    primaryCta: "Empezar",
    secondaryCta: { label: "Ver qué incluye", href: "/longevity#compare" } satisfies LinkAction,
  },
  land: {
    title: { lead: "La tierra es", accent: "el programa." } satisfies SplitTitle,
    text: "1.400 hectáreas de cañón, duna y meseta, recorridas con la gente que siempre ha vivido aquí. Treinta y dos experiencias guiadas, ninguna con prisa.",
  },
  supper: {
    title: ["La cena, entre", "velas", "y brasas."],
    text: "Una mesa larga bajo las primeras estrellas. El chef Tomás Arenal cocina con lo que permite el desierto —fuego, humo, dátiles, hierbas silvestres— y nunca repite menú.",
    chips: [
      { icon: "moon", label: "Esta noche" },
      { icon: "clock", label: "19:30" },
    ] satisfies Chip[],
    courses: [
      "Remolacha asada en brasa, zumaque y labneh",
      "Cordero ahumado con enebro, hierbas del desierto",
      "Pastel de dátil y aceite de oliva, helado de cabra",
    ],
    cta: { label: "Reserva un puesto en la mesa", href: "/dining" } satisfies LinkAction,
    image: {
      src: IMG.longTable,
      alt: "Mesa larga iluminada con velas en el desierto al anochecer.",
    },
  },
  afterDark: {
    title: { lead: "Al anochecer, el cielo", accent: "es el techo." } satisfies SplitTitle,
    image: {
      src: IMG.nightSky,
      alt: "La Vía Láctea sobre un macizo rocoso y cabañas iluminadas.",
    },
    features: [
      {
        title: "Sueño, diseñado",
        text: "Luz ámbar circadiana, dormitorios a 16°, lana opaca y ni una pantalla. La mayoría duerme una hora más a la tercera noche.",
        chips: [
          { icon: "moon", label: "Todas las suites" },
          { icon: "clock", label: "Desde las 21:00" },
        ] satisfies Chip[],
        image: PHOTOS.sleep,
      },
      {
        title: "El observatorio",
        text: "Un telescopio de 24 pulgadas, una astrónoma residente y la carta del cielo sobre tu lugar de nacimiento, la noche en que naciste.",
        chips: [
          { icon: "moon", label: "Cada noche" },
          { icon: "clock", label: "21:30" },
        ] satisfies Chip[],
        image: { src: IMG.observatory, alt: "Cúpula del observatorio bajo la Vía Láctea." },
      },
      {
        title: "El círculo de fuego",
        text: "Té de enebro, voces bajas e historias de la tierra contadas por las familias que la cuidan desde hace nueve generaciones.",
        chips: [
          { icon: "moon", label: "Cada noche" },
          { icon: "clock", label: "22:30" },
        ] satisfies Chip[],
        image: { src: IMG.fire, alt: "Círculo de fuego con cojines bajo un cielo estrellado." },
      },
    ],
  },
  press: { label: "Aparecimos en" },
  plan: {
    title: { lead: "Tu estancia empieza", accent: "al amanecer." } satisfies SplitTitle,
  },
};

export const SUITES_PAGE = {
  meta: {
    seoTitle: "Suites, casas y villas",
    description:
      "Veinticuatro maneras de guardar la sombra: suites, casas y villas orientadas al sol. Compara tamaños, orientación y precios.",
  } satisfies PageMeta,
  hero: {
    title: { lead: "Veinticuatro maneras", accent: "de guardar la sombra." } satisfies SplitTitle,
    image: {
      src: IMG.heroSuites,
      alt: "Un diván en sombra bajo una pérgola frente a la meseta.",
    },
    counts: [
      { value: "14", label: "Suites" },
      { value: "6", label: "Casas" },
      { value: "4", label: "Villas" },
    ],
  },
  filters: [
    { value: "all", label: "Todas" },
    { value: "suite", label: "Suites" },
    { value: "house", label: "Casas" },
    { value: "villa", label: "Villas" },
  ],
  compare: {
    title: { lead: "Compara,", accent: "en calma." } satisfies SplitTitle,
    columns: ["Tamaño", "Huéspedes", "Orientación", "Rasgo", "Desde / noche"],
  },
  cta: {
    title: { lead: "¿No sabes cuál?", accent: "Un anfitrión te ayuda." } satisfies SplitTitle,
    button: { label: "Habla con un anfitrión", href: "/plan-your-stay" } satisfies LinkAction,
  },
};

export const SUITE_DETAIL = {
  facts: {
    area: "Interior",
    guests: "Huéspedes",
    bedrooms: "Dormitorios",
    nightTemp: "Temp. nocturna",
  },
  galleryHint: "Toca cualquier imagen para abrir la galería",
  lightTitle: (name: string): SplitTitle => ({
    lead: "Cómo se mueve la luz",
    accent: `en ${name}.`,
  }),
  amenitiesTitle: "En la casa",
  booking: {
    rows: [
      { label: "Rituales del sol", value: "Incluidos" },
      { label: "Traslados desde la pista Mesa Alta", value: "Incluidos" },
      { label: "Impuestos y tasas", value: "Antes de confirmar" },
    ],
    reserve: (name: string) => `Reservar ${name}`,
    note: "Cancelación gratuita hasta 30 días antes de la llegada.",
  },
  relatedTitle: "Otras maneras de guardar la sombra",
  relatedLink: "Ver",
};

export const DAY_PAGE = {
  meta: {
    seoTitle: "Un día aquí — de la primera luz a la última estrella",
    description:
      "Un día en el retiro, medido por el sol: rituales de la primera luz a la última estrella y seis maneras de pasar la luz.",
  } satisfies PageMeta,
  hero: {
    title: { lead: "De la primera luz", accent: "a la última estrella." } satisfies SplitTitle,
    text: "Haz scroll para mover el sol.",
    scroll: "Scroll",
    marks: ["05:48", "07:30", "10:00", "13:00", "16:00", "18:42"],
  },
  experiences: {
    title: { lead: "Seis maneras de", accent: "pasar la luz." } satisfies SplitTitle,
    filters: [
      { value: "all", label: "Todas" },
      { value: "dawn", label: "Alba" },
      { value: "day", label: "Día" },
      { value: "dusk", label: "Ocaso" },
      { value: "night", label: "Noche" },
    ],
    empty: "Ninguna experiencia en este momento del día. Prueba con otro filtro.",
  },
};

export const LONGEVITY = {
  meta: {
    seoTitle: "Programas de longevidad",
    description:
      "Médicos, científicos del sueño y entrenadores de movimiento: programas de longevidad de 3, 5 y 7 noches con sol, calor, frío y silencio.",
  } satisfies PageMeta,
  hero: {
    title: ["La ciencia", "de ir", "más despacio."],
    text: "Médicos, científicos del sueño y entrenadores de movimiento, trabajando con la medicina más antigua que existe: sol, calor, frío y silencio.",
    primary: { label: "Comparar programas", href: "#compare" } satisfies LinkAction,
    secondary: { label: "Habla con un médico", href: "/plan-your-stay" } satisfies LinkAction,
    image: {
      src: IMG.heroLongevity,
      alt: "Una huésped descansa en una bañera de piedra dentro de una sala de tierra apisonada.",
    },
    badge: { label: "VFC", value: "72 ms" },
  },
  stats: [
    { value: "92", label: "Biomarcadores medidos" },
    { value: "2", label: "Noches de estudio del sueño" },
    { value: "12", label: "Meses de seguimiento" },
    { value: "1:1", label: "Médico, cada día" },
  ] satisfies Fact[],
  movements: {
    title: { lead: "Cuatro movimientos,", accent: "como un día." } satisfies SplitTitle,
    steps: [
      {
        numeral: "I",
        name: "Medir",
        moment: "Alba",
        text: "Analítica, DEXA, VO₂ máx., glucosa continua y un estudio de sueño de dos noches construyen tu punto de partida.",
      },
      {
        numeral: "II",
        name: "Reiniciar",
        moment: "Mediodía",
        text: "Calor, frío, ventanas de ayuno y días sin pantallas calman el sistema nervioso.",
      },
      {
        numeral: "III",
        name: "Reconstruir",
        moment: "Ocaso",
        text: "Fuerza, movilidad, respiración y nutrición, ajustadas cada día a tus números.",
      },
      {
        numeral: "IV",
        name: "Llevar a casa",
        moment: "Noche",
        text: "Un plan escrito, suplementos si hacen falta y doce meses con tu médico.",
      },
    ],
  },
  pricing: {
    title: { lead: "Elige la duración", accent: "de tu calma." } satisfies SplitTitle,
    toggleLabel: "Mostrar precios",
    perPerson: "Por persona",
    perCouple: "Por pareja",
    featured: "El más elegido",
    nightsSuffix: (nights: number) => `/ ${nights} noches`,
    cta: (name: string) => `Empezar ${name}`,
  },
  team: [
    {
      name: "Dra. Inés Moreno",
      role: "Directora médica",
      tags: ["Directora médica", "Longevidad"],
      quote: "“Lo medimos todo y después te quitamos el reloj.”",
      image: { src: IMG.team1, alt: "Retrato de la directora médica." },
    },
    {
      name: "Dr. Camilo Reyes",
      role: "Científico del sueño",
      tags: ["Científico del sueño", "Sueño"],
      quote: "“Casi todos estamos a una semana tranquila de nuestro mejor sueño.”",
      image: { src: IMG.team2, alt: "Retrato del científico del sueño." },
    },
    {
      name: "Amara Solís",
      role: "Jefa de movimiento",
      tags: ["Jefa de movimiento", "Movimiento"],
      quote: "“La fuerza es el fármaco de longevidad más honesto que tenemos.”",
      image: { src: IMG.team3, alt: "Retrato de la jefa de movimiento." },
    },
  ] satisfies TeamMember[],
  teamTitle: { lead: "Las personas que", accent: "marcan el tiempo." } satisfies SplitTitle,
  faq: {
    title: ["Preguntas,", "respondidas."],
    text: "¿Algo más? Nuestro equipo médico responde en menos de un día.",
    items: [
      {
        question: "¿Necesito una remisión o historia clínica?",
        answer:
          "No. Comparte tus análisis recientes si los tienes; si no, lo medimos todo el primer día. Nuestros médicos revisan tu formulario de ingreso antes de que llegues.",
      },
      {
        question: "¿Es una clínica médica o un retiro?",
        answer:
          "Las dos cosas, en silencio. El diagnóstico se hace en la casa de longevidad con médicos en plantilla; todo lo demás —sueño, comida, calor y frío— sigue el ritmo del retiro.",
      },
      {
        question: "¿Mi pareja puede venir sin programa?",
        answer:
          "Sí. Comparte la suite, los rituales del sol y la mesa larga; puede sumarse a sesiones sueltas cuando quiera.",
      },
      {
        question: "¿Qué pasa cuando me voy?",
        answer:
          "Te llevas un plan de una página y, según el programa, entre seis y doce meses de seguimiento con tu médico.",
      },
      {
        question: "¿Los programas los cubre el seguro?",
        answer:
          "Normalmente no. Te damos un informe detallado por si tu aseguradora reembolsa parte del diagnóstico.",
      },
    ] satisfies Faq[],
  },
};

export const DINING = {
  meta: {
    seoTitle: "Gastronomía",
    description:
      "Cocinado al fuego, comido bajo las estrellas: tres mesas a tres luces y un menú que se escribe cada mediodía.",
  } satisfies PageMeta,
  hero: {
    title: {
      lead: "Cocinado al fuego,",
      accent: "comido bajo las estrellas.",
    } satisfies SplitTitle,
    image: {
      src: IMG.heroDining,
      alt: "Huéspedes compartiendo la cena en una mesa larga con velas en el desierto.",
    },
  },
  tables: {
    title: { lead: "Tres mesas,", accent: "tres luces." } satisfies SplitTitle,
    items: [
      {
        name: "El bar mineral",
        hours: "07:00 — 11:00",
        note: "",
        text: "Dátiles, higos, tónicos y huevos lentos en la terraza del sol.",
        image: PHOTOS.breakfast,
      },
      {
        name: "La sala de sombra",
        hours: "12:30 — 15:00",
        note: "",
        text: "Sopas frías y platos del huerto en la sala más fresca que tenemos.",
        image: { src: IMG.exp6, alt: "Jardín de agaves y palmeras junto a un canal de agua." },
      },
      {
        name: "La mesa larga",
        hours: "19:30",
        note: "Un solo turno",
        text: "Catorce puestos, un fuego y un menú que cambia cada noche.",
        image: { src: IMG.exp3, alt: "Pan plano que sale de un horno de tierra humeante." },
      },
    ],
  },
  chef: {
    quote: ["“El desierto decide el menú. Yo solo", "escucho al fuego.”"],
    text: "Tomás Arenal creció a cuarenta kilómetros del retiro. Cocina con fuego, humo y lo que dan el desierto y nuestro huerto: dátiles, hierbas silvestres, granos, cabra y cordero de las familias que cuidan la tierra.",
    signature: "Tomás Arenal — Chef de cocina",
    image: { src: IMG.chef, alt: "El chef emplatando junto a un fuego abierto." },
  },
  menu: {
    chips: [
      { icon: "moon", label: "Esta noche en la mesa larga" },
      { icon: "clock", label: "19:30" },
    ] satisfies Chip[],
    title: "El menú, escrito a mediodía.",
    courses: [
      {
        numeral: "I",
        name: "Remolacha asada en brasa",
        detail: "zumaque, labneh, tomillo del desierto",
      },
      {
        numeral: "II",
        name: "Pan del horno de tierra",
        detail: "mantequilla ahumada, melaza de dátil",
      },
      {
        numeral: "III",
        name: "Cordero ahumado con enebro",
        detail: "hierbas silvestres, freekeh tostado",
      },
      {
        numeral: "IV",
        name: "Pastel de dátil y aceite de oliva",
        detail: "helado de cabra, miel quemada",
      },
    ],
  },
  reserve: {
    date: "Fecha",
    datePlaceholder: "Elige una fecha",
    time: "Hora",
    times: ["19:30", "20:00", "20:30"],
    guests: "Huéspedes",
    maxGuests: 6,
    cta: "Reservar puesto",
    subject: "Reserva en la mesa larga",
    missingDate: "Elige una fecha para reservar.",
    sent: "Abrimos tu correo con la reserva lista para enviar.",
  },
};

export const JOURNAL = {
  meta: {
    seoTitle: "Diario",
    description:
      "Cartas desde el desierto: arquitectura, longevidad, cocina, la tierra y el cielo nocturno del retiro.",
  } satisfies PageMeta,
  title: { lead: "Cartas desde", accent: "el desierto." } satisfies SplitTitle,
  featuredLabel: "Destacado",
  readLetter: "Leer la carta",
  allLabel: "Todas",
  minutes: (minutes: number) => `${minutes} min`,
  minutesRead: (minutes: number) => `${minutes} min de lectura`,
  empty: "Aún no hay cartas en esta categoría.",
  newsletter: {
    title: { lead: "Una carta", accent: "por estación." } satisfies SplitTitle,
    text: "Calendarios lunares, recetas del fuego y las fechas nuevas antes que nadie. Nada más.",
  },
  keepReading: "Sigue leyendo",
  share: "Compartir",
  shareEmail: "Correo",
  shareSubject: "Una carta del desierto",
};

export const ARTICLES: Article[] = [
  {
    slug: "why-we-built-a-hotel-without-clocks",
    title: "Por qué construimos un hotel sin relojes",
    excerpt:
      "Sobre diseño circadiano, muros de medio metro y el extraño alivio de no saber qué hora es.",
    category: "Arquitectura",
    minutes: 8,
    date: "2026-02-12",
    author: 0,
    cover: {
      src: IMG.moonrise,
      alt: "Luna llena saliendo sobre una meseta del desierto al anochecer.",
    },
    caption: "El ala este a las 06:10, veinte minutos después del amanecer.",
    body: [
      {
        type: "p",
        text: "Lo primero que notan los huéspedes no es la vista. Es que nada en la suite les dice la hora. Ni reloj en la mesilla, ni pantalla en el horno, ni televisión encendida en un rincón. Al cabo de un día, casi todos dejan de preguntar.",
      },
      {
        type: "p",
        text: "No quitamos los relojes por capricho. Los quitamos porque el cuerpo ya tiene uno, y marca mejor el tiempo cuando la única señal que recibe es el sol. Nuestro laboratorio del sueño lo ha visto cuatrocientas veces: a la tercera noche, los huéspedes se duermen cuarenta minutos antes y despiertan sin alarma.",
      },
      {
        type: "quote",
        text: "“La casa es el reloj. Los muros te dicen cuándo despertar, cuándo esconderte y cuándo volver a salir.”",
      },
      { type: "h2", text: "Diseñar con la luz, no contra ella" },
      {
        type: "p",
        text: "Cada suite está orientada a una sola hora. Las suites Duna miran al este para que la primera luz caiga sobre la cama. La Casa Sombra mira al norte y se mantiene fresca hasta la tarde. Las villas miran al oeste, hacia la larga hora cobriza antes de la cena.",
      },
      { type: "image", image: PHOTOS.shade, tall: true },
      { type: "image", image: PHOTOS.sand },
      {
        type: "p",
        text: "Los muros son medio metro de tierra apisonada: beben el calor de la tarde y lo devuelven de noche. La luz entra por rendijas estrechas y un óculo por casa, suficiente para saber la hora y nunca tanta como para deslumbrar.",
      },
    ],
    tags: ["Arquitectura", "Sueño", "Diseño circadiano"],
  },
  {
    slug: "clay-water-patience-a-morning-with-the-nahat-family",
    title: "Barro, agua, paciencia: una mañana con la familia del taller",
    excerpt: "Tres generaciones de alfareros, un torno de pie y la tierra roja de la meseta.",
    category: "Tierra y gente",
    minutes: 6,
    date: "2026-01-28",
    author: 2,
    cover: { src: IMG.exp5, alt: "Alfarero modelando barro en el torno del taller." },
    caption: "El taller a las 09:30, cuando el barro todavía está fresco.",
    body: [
      {
        type: "p",
        text: "El taller abre cuando el sol supera el muro del patio. Antes, el barro está demasiado frío; después del mediodía, se seca en las manos. La familia trabaja en esa ventana desde hace tres generaciones.",
      },
      {
        type: "p",
        text: "Los huéspedes llegan sin saber nada y se van con un cuenco torcido y una idea nueva de la paciencia. Nadie corrige la forma: se corrige el ritmo.",
      },
      { type: "quote", text: "“El barro no se apura. Si lo apuras, se raja en el horno.”" },
      { type: "h2", text: "La tierra de la meseta" },
      {
        type: "p",
        text: "La arcilla sale de una veta a media hora a pie. Se tamiza, se mezcla con agua del pozo y descansa una semana. Todo lo que servimos en la mesa larga pasó por este torno.",
      },
      { type: "image", image: { src: IMG.exp5, alt: "Manos de alfarero sobre el torno." } },
    ],
    tags: ["Tierra y gente", "Oficio"],
  },
  {
    slug: "what-two-nights-in-our-sleep-lab-taught-400-guests",
    title: "Lo que dos noches en nuestro laboratorio del sueño enseñaron a 400 huéspedes",
    excerpt:
      "Datos de cuatrocientos estudios de sueño y tres hábitos que casi todos se llevan a casa.",
    category: "Longevidad",
    minutes: 9,
    date: "2026-01-15",
    author: 1,
    cover: PHOTOS.sleep,
    caption: "Un dormitorio del laboratorio a 16°, con luz ámbar.",
    body: [
      {
        type: "p",
        text: "Medimos el sueño de cada huésped de los programas durante dos noches: la primera con sus hábitos, la segunda con los nuestros. La diferencia, casi siempre, aparece antes de que llegue la tecnología.",
      },
      {
        type: "p",
        text: "Oscuridad total, una habitación fresca y ninguna pantalla después del atardecer. Tres cambios sencillos que mueven más el sueño profundo que cualquier suplemento.",
      },
      {
        type: "quote",
        text: "“Casi todos estamos a una semana tranquila de nuestro mejor sueño.”",
      },
      { type: "h2", text: "Tres hábitos que viajan bien" },
      {
        type: "p",
        text: "Luz del sol en los ojos durante la primera hora, cena temprana y un dormitorio por debajo de los 18°. Son los tres hábitos que más huéspedes mantienen seis meses después.",
      },
      { type: "image", image: PHOTOS.sleep, tall: true },
    ],
    tags: ["Longevidad", "Sueño"],
  },
  {
    slug: "the-mineral-breakfast-explained",
    title: "El desayuno mineral, explicado",
    excerpt: "Dátiles, higos, labneh y tónicos: por qué la primera comida del día es así.",
    category: "Cocina",
    minutes: 4,
    date: "2025-12-20",
    author: 0,
    cover: PHOTOS.breakfast,
    caption: "La terraza del sol a las 07:30.",
    body: [
      {
        type: "p",
        text: "El desayuno mineral nació de una pregunta sencilla: qué come alguien que se ha despertado con el sol y caminará antes del calor. La respuesta cabe en una bandeja.",
      },
      {
        type: "p",
        text: "Fruta seca y fresca para el azúcar lento, labneh y huevos para la proteína, y tónicos de hierbas con sal del desierto para reponer lo que se pierde en la caminata.",
      },
      { type: "quote", text: "“Primero agua y sal; después, todo lo demás.”" },
      { type: "h2", text: "Del huerto a la terraza" },
      {
        type: "p",
        text: "Los higos y las hierbas salen del huerto del retiro; los dátiles, de un palmar vecino. El menú cambia con la estación, el principio no.",
      },
      { type: "image", image: PHOTOS.breakfast },
    ],
    tags: ["Cocina", "Rituales"],
  },
  {
    slug: "a-field-guide-to-a-bortle-1-sky",
    title: "Guía de campo para un cielo Bortle 1",
    excerpt: "Qué ver a simple vista en uno de los cielos más oscuros del mundo, mes a mes.",
    category: "Cielo nocturno",
    minutes: 7,
    date: "2025-11-30",
    author: 1,
    cover: { src: IMG.observatory, alt: "Cúpula del observatorio bajo la Vía Láctea." },
    caption: "El observatorio a las 22:40, con la Vía Láctea en el cénit.",
    body: [
      {
        type: "p",
        text: "En la escala de Bortle, el 1 es el cielo más oscuro posible: la Vía Láctea proyecta sombra y la luz zodiacal se ve a simple vista. Aquí lo tenemos casi todas las noches sin luna.",
      },
      {
        type: "p",
        text: "No hace falta telescopio para empezar. Veinte minutos sin linternas y los ojos se adaptan lo suficiente para ver nebulosas como manchas de humo.",
      },
      {
        type: "quote",
        text: "“El primer regalo de un cielo oscuro es la escala: de pronto, todo es más grande que tú.”",
      },
      { type: "h2", text: "Cuándo mirar" },
      {
        type: "p",
        text: "Las mejores noches caen a ambos lados de la luna nueva. Con luna llena, el observatorio cambia el programa a la propia luna y a los planetas.",
      },
      { type: "image", image: { src: IMG.nightSky, alt: "La Vía Láctea sobre la meseta." } },
    ],
    tags: ["Cielo nocturno", "Astronomía"],
  },
  {
    slug: "growing-food-where-it-almost-never-rains",
    title: "Cultivar donde casi nunca llueve",
    excerpt:
      "Canales de agua, sombra de palmera y lo que aprendimos de los huertos antiguos del valle.",
    category: "Tierra y gente",
    minutes: 5,
    date: "2025-11-12",
    author: 2,
    cover: { src: IMG.exp6, alt: "Jardín de agaves y palmeras junto a un canal de agua." },
    caption: "El huerto a mediodía, bajo tres pisos de sombra.",
    body: [
      {
        type: "p",
        text: "El huerto del retiro sigue un diseño de hace siglos: palmeras arriba, frutales en medio y hortalizas abajo. Cada piso da sombra al siguiente y el agua corre por un canal de piedra.",
      },
      {
        type: "p",
        text: "Regamos al amanecer y al anochecer, nunca al sol. Una sola acequia alimenta todo el huerto y termina en el estanque reflectante.",
      },
      {
        type: "quote",
        text: "“En el desierto no se cultiva contra el sol; se cultiva debajo de él.”",
      },
      { type: "h2", text: "Lo que llega a la mesa" },
      {
        type: "p",
        text: "Hierbas, higos, granadas y verduras de hoja para la sala de sombra; dátiles y aceitunas para todo el año.",
      },
      { type: "image", image: { src: IMG.exp6, alt: "Canal de riego entre agaves." } },
    ],
    tags: ["Tierra y gente", "Huerto"],
  },
  {
    slug: "eleven-minutes-of-noon-designing-the-slit-of-light",
    title: "Once minutos de mediodía: diseñar la rendija de luz",
    excerpt: "Cómo calculamos la abertura que cruza la bañera de piedra una sola vez al día.",
    category: "Arquitectura",
    minutes: 6,
    date: "2025-10-28",
    author: 0,
    cover: { src: IMG.suite4, alt: "Bañera de piedra bajo una rendija de luz." },
    caption: "La rendija a las 12:15, en el mediodía solar.",
    body: [
      {
        type: "p",
        text: "En la Casa Sombra, una abertura de doce centímetros deja pasar el sol durante once minutos al día. Ni uno más. Durante ese tiempo, el haz cruza la bañera de piedra de un extremo al otro.",
      },
      {
        type: "p",
        text: "Calcularla llevó un año de maquetas y un verano entero de pruebas a escala real. El ángulo cambia con las estaciones; la rendija también se abre un poco más en invierno.",
      },
      {
        type: "quote",
        text: "“Queríamos que el mediodía fuera un acontecimiento, no un castigo.”",
      },
      { type: "h2", text: "Un reloj de sol habitable" },
      {
        type: "p",
        text: "Los huéspedes aprenden pronto a esperar ese momento. Muchos lo convierten en su ritual: un baño a mediodía, en silencio, mientras la luz avanza.",
      },
      { type: "image", image: PHOTOS.stone, tall: true },
    ],
    tags: ["Arquitectura", "Luz"],
  },
];

export const JOURNAL_FEATURED = "why-we-built-a-hotel-without-clocks";

export const PLAN = {
  meta: {
    seoTitle: "Planea tu estancia",
    description:
      "Cuatro pasos tranquilos: fechas, casa, programa y tus datos. Sin pago hoy: un anfitrión responde en menos de una hora.",
  } satisfies PageMeta,
  hero: {
    title: { lead: "Planea", accent: "tu estancia." } satisfies SplitTitle,
    text: "Cuatro pasos tranquilos. Sin pago hoy: un anfitrión responde en menos de una hora.",
  },
  steps: {
    stepDates: "Elige tus fechas",
    stepHouse: "Elige tu casa",
    stepProgram: "Añade un programa",
    stepDetails: "Tus datos",
  },
  /** Suites que se ofrecen en el paso "Elige tu casa" */
  houses: ["dune-suite", "shadow-house", "courtyard-villa"],
  defaults: { house: "shadow-house", program: "restore", nights: 5 },
  noProgram: "Sin programa — solo descansar",
  noProgramShort: "Solo descansar",
  guests: "2 adultos",
  checkIn: "14:00",
  checkOut: "11:00",
  legend: {
    fullMoon: "Luna llena — mejor para mirar estrellas a ambos lados",
    booked: "Las fechas atenuadas están completas",
  },
  /** Fechas completas de ejemplo (AAAA-MM-DD); se muestran atenuadas y no se pueden elegir */
  bookedDates: [] as string[],
  form: {
    name: { label: "Nombre completo", placeholder: "p. ej. Ana Larsen" },
    email: { label: "Correo", placeholder: "p. ej. ana@correo.com" },
    phone: { label: "Teléfono", placeholder: "p. ej. +57 300 000 0000" },
    arriving: {
      label: "Llegas en",
      options: [
        "Avioneta privada — pista Mesa Alta",
        "Carretera — te enviamos conductor",
        "Helicóptero — bajo petición",
      ],
    },
    notes: {
      label: "Algo que debamos saber",
      placeholder: "p. ej. dieta, un cumpleaños, el motivo del viaje",
    },
  },
  summary: {
    /** {nights} y {house} se sustituyen ("Cinco noches en Casa Sombra.") */
    titleTemplate: "{nights} en {house}.",
    nightWords: [
      "",
      "Una noche",
      "Dos noches",
      "Tres noches",
      "Cuatro noches",
      "Cinco noches",
      "Seis noches",
      "Siete noches",
      "Ocho noches",
      "Nueve noches",
      "Diez noches",
    ],
    nightOne: "noche",
    nightMany: "noches",
    fromTime: "desde las",
    byTime: "antes de las",
    arrive: "Llegada",
    depart: "Salida",
    house: "Casa",
    suite: "Suite",
    program: "Programa",
    guests: "Huéspedes",
    sunrise: "Amanecer al llegar",
    total: "Total estimado",
    from: "Desde",
    yourStay: "Tu estancia",
    send: "Enviar solicitud",
    request: "Solicitar esta estancia",
    note: "Sin pago hoy. Un anfitrión responde en menos de una hora, de 05:00 a 23:00 hora del desierto.",
    noteShort: "Sin pago hoy. Un anfitrión responde en menos de una hora.",
    sent: "Abrimos tu correo con la solicitud lista para enviar. Si no se abre, escríbenos a la dirección de abajo.",
    subject: "Solicitud de estancia",
  },
  travel: {
    title: { lead: "Lo bastante lejos", accent: "para importar." } satisfies SplitTitle,
    modes: [
      {
        icon: "plane",
        label: "En avioneta",
        title: "Pista Mesa Alta — 25 min",
        text: "Traslados privados incluidos en cada estancia.",
      },
      {
        icon: "car",
        label: "Por carretera",
        title: "3 h 40 desde la ciudad",
        text: "Los últimos 40 km son sin asfaltar: te enviamos conductor.",
      },
      {
        icon: "helicopter",
        label: "En helicóptero",
        title: "Bajo petición",
        text: "Helipuerto en la meseta norte.",
      },
    ] satisfies { icon: IconName; label: string; title: string; text: string }[],
    map: {
      chips: [
        { icon: "arrow-left", label: "a la ciudad" },
        { icon: "clock", label: "3 h 40" },
      ] satisfies Chip[],
      city: "Ciudad",
      retreat: "Retiro",
      airstrip: "Pista Mesa Alta",
      label: "Ver la ruta en Google Maps",
    },
  },
  contact: {
    write: "Escríbenos",
    call: "Llámanos",
    message: "Mensaje",
    press: "Prensa",
    whatsapp: "WhatsApp",
  },
};

export const FOOTER = {
  title: { lead: "Cartas desde", accent: "el desierto." } satisfies SplitTitle,
  text: "Una por estación. Calendarios lunares, recetas del fuego y las fechas nuevas antes que nadie.",
  tomorrowSunrise: `Amanecer de mañana ${SUN.tomorrowSunrise}`,
  instagram: "Instagram",
};

export const NOT_FOUND = {
  meta: {
    seoTitle: "Página no encontrada",
    description: "La página que buscas no existe.",
  } satisfies PageMeta,
  kicker: "404",
  title: { lead: "Esta senda", accent: "se perdió en la arena." } satisfies SplitTitle,
  text: "La página que buscas no existe o cambió de lugar. Vuelve al inicio y sigue el sol.",
  button: { label: "Volver al inicio", href: "/" } satisfies LinkAction,
};

/** Etiquetas de interfaz: botones, ARIA, formularios y estados */
export const UI_LABELS = {
  skipToContent: "Saltar al contenido",
  mainNav: "Navegación principal",
  homeLink: "inicio",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  planStay: "Planea tu estancia",
  clockLabel: "Hora local y momento del día",
  phases: {
    dawn: "Amanecer",
    morning: "Mañana",
    noon: "Mediodía",
    afternoon: "Tarde",
    dusk: "Atardecer",
    night: "Noche",
  },
  sunrise: "Amanecer",
  sunset: "Atardecer",
  chooseDate: "Elige fecha",
  nights: (count: number) => (count === 1 ? "1 noche" : `${count} noches`),
  from: "Desde",
  perNight: "/ noche",
  perNightLong: (price: string) => `Desde ${price} / noche`,
  guests: (count: number) => `${count} huéspedes`,
  checkDates: "Ver fechas",
  filterLabel: "Filtrar",
  suiteColumn: "Suite",
  suitesKicker: "Suites",
  addToDay: "Añadir a mi día",
  addedToDay: "Añadido",
  openProgram: "Abrir programa",
  closeProgram: "Cerrar programa",
  carouselLabel: "Experiencias",
  guestNotesLabel: "Notas de huéspedes",
  showNote: (index: number) => `Mostrar nota ${index}`,
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  gallery: "Galería",
  galleryOpen: (index: number) => `Abrir la imagen ${index} en la galería`,
  galleryClose: "Cerrar galería",
  galleryPrev: "Imagen anterior",
  galleryNext: "Imagen siguiente",
  newsletterEmail: "Tu correo",
  newsletterSubmit: "Suscribirme",
  newsletterSubject: "Suscripción a las cartas",
  newsletterSent: "Gracias: abrimos tu correo para confirmar la suscripción.",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  fullMoon: "Luna llena",
  booked: "Completo",
  selectedArrive: "Llegada elegida",
  selectedDepart: "Salida elegida",
  required: "Obligatorio",
};

/** Etiquetas de los planificadores (islas Preact): solo texto, se pasan como props. */
export const PLANNER_LABELS = {
  ...PLAN.summary,
  ...PLAN.steps,
  legendFullMoon: PLAN.legend.fullMoon,
  legendBooked: PLAN.legend.booked,
  noProgram: PLAN.noProgram,
  noProgramShort: PLAN.noProgramShort,
  guestsValue: PLAN.guests,
  checkIn: PLAN.checkIn,
  checkOut: PLAN.checkOut,
  weekdays: UI_LABELS.weekdays,
  previousMonth: UI_LABELS.previousMonth,
  nextMonth: UI_LABELS.nextMonth,
  fullMoon: UI_LABELS.fullMoon,
  booked: UI_LABELS.booked,
  perNight: UI_LABELS.perNight,
  form: PLAN.form,
};

export type PlannerLabels = typeof PLANNER_LABELS;
