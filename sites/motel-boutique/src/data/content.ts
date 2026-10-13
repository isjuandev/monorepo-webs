export interface NavItem {
  label: string;
  href: string;
}

export interface Suite {
  name: string;
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
  { label: "Inicio", href: "#inicio" },
  { label: "Nuestras suites", href: "#suites" },
  { label: "Servicios", href: "#servicios" },
  { label: "Contáctanos", href: "#contacto" },
];

export const SUITES: Suite[] = [
  {
    name: "Suite",
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #3b1d4a, #c0457a)",
  },
  {
    name: "Suite especial",
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #3a2a1d, #c98a4b)",
  },
  {
    name: "Suite super especial",
    price: "$ 000.000 x 6 horas",
    extraHour: "$ 00.000",
    extraPerson: "$ 00.000",
    tone: "linear-gradient(135deg, #1d2f3a, #4b9cc9)",
  },
  {
    name: "Suite party (grupal)",
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
