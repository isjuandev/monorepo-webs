export interface NavItem {
  label: string;
  href: string;
}

export interface Suite {
  slug: string;
  name: string;
  description: string;
  twelveHours: string;
  features: string[];
  price: string;
  extraHour: string;
  extraPerson: string;
  tone: string;
}

export interface SpecialService {
  title: string;
  text: string;
  tone: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nuestras suites", href: "/nuestras-suites" },
  { label: "Restaurante", href: "/restaurante" },
  { label: "Contáctanos", href: "/contacto" },
];

export const SUITES: Suite[] = [
  {
    slug: "suite",
    name: "Suite",
    description:
      "Descripción breve de la categoría de suite: ambiente, tamaño y sensación que ofrece.",
    twelveHours: "$ 000.000",
    features: ["Cama king", "Ducha privada", "Aire acondicionado", "TV"],
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #3b1d4a, #c0457a)",
  },
  {
    slug: "suite-especial",
    name: "Suite especial",
    description: "Descripción de una categoría con más espacio y extras como jacuzzi o chimenea.",
    twelveHours: "$ 000.000",
    features: ["Jacuzzi", "Chimenea", "Turco", "Cama king"],
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #3a2a1d, #c98a4b)",
  },
  {
    slug: "suite-super-especial",
    name: "Suite super especial",
    description:
      "Descripción de la categoría más amplia, con todos los extras del establecimiento.",
    twelveHours: "$ 000.000",
    features: ["Jacuzzi doble", "Sala privada", "Turco", "Barra"],
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #1d2f3a, #4b9cc9)",
  },
  {
    slug: "suite-party",
    name: "Suite party (grupal)",
    description: "Descripción de la suite grupal para celebraciones y grupos pequeños.",
    twelveHours: "$ 000.000",
    features: ["Pista de baile", "Luces", "Sonido", "Jacuzzi"],
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #3a1d1d, #e8554e)",
  },
];

export const SPECIAL_SERVICES: SpecialService[] = [
  {
    title: "Celebraciones íntimas",
    text: "Decoración con velas, flores y detalles a medida para aniversarios y fechas especiales. Coordínalo con anticipación por WhatsApp.",
    tone: "linear-gradient(135deg, #5a1d2a, #e8554e)",
  },
  {
    title: "Juegos de seducción",
    text: "Accesorios, juegos y lencería disponibles para complementar la experiencia.",
    tone: "linear-gradient(135deg, #1d1d3a, #6b4bc9)",
  },
  {
    title: "Tienda",
    text: "Lleva a casa los accesorios de las suites o regala un bono con domicilio incluido.",
    tone: "linear-gradient(135deg, #1d3a2f, #4bc98a)",
  },
];

export const MARQUEE_TEXT = "Servicio de 12 horas disponible todos los días";

export interface MenuItem {
  name: string;
  description?: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    title: "Desayunos",
    items: [
      {
        name: "Desayuno de la casa",
        description: "Plato principal, fruta y bebida caliente.",
        price: "$ 00.000",
      },
    ],
  },
  {
    title: "Platos fuertes",
    items: [
      {
        name: "Picada para compartir",
        description: "Selección de carnes a la parrilla con acompañantes.",
        price: "$ 00.000",
      },
      {
        name: "Hamburguesa de la casa",
        description: "Carne a la parrilla, queso y papas.",
        price: "$ 00.000",
      },
      {
        name: "Pollo a la parrilla",
        description: "Filete con papas y ensalada.",
        price: "$ 00.000",
      },
      { name: "Ceviche", description: "Entrada fría con acompañantes.", price: "$ 00.000" },
    ],
  },
  {
    title: "Bebidas",
    items: [
      { name: "Jugos en agua", price: "$ 00.000" },
      { name: "Jugos en leche", price: "$ 00.000" },
      { name: "Limonada", price: "$ 00.000" },
    ],
  },
];

export const STAY_POLICY: string[] = [
  "Al llegar, informa el tiempo de estadía que deseas tomar (6 o 12 horas).",
  "Si no se especifica, se asumirá una estadía de 6 horas.",
  "Si el tiempo se excede, se generan cargos por horas adicionales que se pagan al salir.",
];
