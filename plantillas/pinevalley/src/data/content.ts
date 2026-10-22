import type { IconName } from "@/data/icons";

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface SectionIntro {
  /** Ancla de la sección (debe coincidir con MENU_LINKS en site.ts) */
  id: string;
  label: string;
  title: string;
  text?: string;
}

export interface IconItem {
  icon: IconName;
  label: string;
}

export interface GalleryImage extends ImageAsset {
  /** Proporción de la tarjeta en la cuadrícula masonry */
  shape: "landscape" | "portrait";
}

export interface Review {
  name: string;
  stayed: string;
  quote: string;
  rating: number;
  avatar: ImageAsset;
}

export interface NearbyPlace {
  icon: IconName;
  name: string;
  time: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const HERO = {
  id: "home",
  trustedBy: "Con la confianza de más de 200 personas",
  avatars: [
    { src: "/images/avatars/hero-1.webp", alt: "Huésped 1" },
    { src: "/images/avatars/hero-2.webp", alt: "Huésped 2" },
    { src: "/images/avatars/hero-3.webp", alt: "Huésped 3" },
    { src: "/images/avatars/hero-4.webp", alt: "Huésped 4" },
  ] satisfies ImageAsset[],
  title: "Tu próxima escapada empieza aquí",
  text: "Escápate a un refugio moderno donde el diseño atemporal, las comodidades premium\ny los alrededores tranquilos crean la escapada perfecta.",
  cta: "Reservar ahora",
  background: {
    src: "/images/hero-background.webp",
    alt: "Villa blanca moderna con arcos en una colina cubierta de hierba bajo un cielo azul despejado",
  } satisfies ImageAsset,
  /** Recorte con transparencia de la casa: se superpone al título para crear profundidad */
  foreground: { src: "/images/hero-foreground.webp", alt: "" } satisfies ImageAsset,
};

export const OVERVIEW = {
  label: "Descripción de la propiedad",
  statement:
    "Diseñada para viajeros que buscan confort, vistas impresionantes y momentos inolvidables rodeados de naturaleza.",
  image: {
    src: "/images/overview.webp",
    alt: "Sala de estar con ventanas arqueadas que se abren a una piscina infinita y a colinas ondulantes",
  } satisfies ImageAsset,
  features: [
    { icon: "users", label: "Hasta 6 personas" },
    { icon: "bed", label: "3 habitaciones acogedoras" },
    { icon: "bath", label: "2 baños modernos" },
    { icon: "car", label: "Estacionamiento privado" },
    { icon: "pet", label: "Admite mascotas" },
    { icon: "wifi", label: "WiFi de alta velocidad" },
    { icon: "utensils", label: "Cocina totalmente equipada" },
    { icon: "trees", label: "Vistas al bosque" },
  ] satisfies IconItem[],
};

export const GALLERY = {
  intro: {
    id: "gallery",
    label: "Galería",
    title: "Explora cada rincón",
    text: "Desde interiores acogedores hasta espacios exteriores impresionantes, descubre\ncada detalle pensado para que tu estancia sea inolvidable.",
  } satisfies SectionIntro,
  cta: "Ver galería",
  images: [
    {
      src: "/images/gallery/gallery-1.webp",
      alt: "Villa blanca con cúpula entre olivos",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-2.webp",
      alt: "Piscina infinita con tumbonas frente a la villa",
      shape: "portrait",
    },
    {
      src: "/images/gallery/gallery-3.webp",
      alt: "Vista aérea de la villa y de su piscina curva",
      shape: "portrait",
    },
    {
      src: "/images/gallery/gallery-4.webp",
      alt: "Zona de descanso exterior frente a la piscina y las colinas",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-5.webp",
      alt: "Villa con terrazas arqueadas al atardecer",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-6.webp",
      alt: "Villa iluminada al anochecer con la piscina brillando",
      shape: "portrait",
    },
  ] satisfies GalleryImage[],
};

export const EXPERIENCE = {
  intro: {
    id: "experience",
    label: "La experiencia",
    title: "Mucho más que un lugar para dormir",
    text: "Vive un destino diseñado para inspirar\nrelajación, conexión y recuerdos inolvidables.",
  } satisfies SectionIntro,
  cards: [
    {
      title: "Explora la naturaleza",
      image: {
        src: "/images/experience/experience-1.webp",
        alt: "Vista aérea de un valle boscoso",
      },
    },
    {
      title: "Noches junto al fuego",
      image: {
        src: "/images/experience/experience-2.webp",
        alt: "Fogata en el jardín al anochecer",
      },
    },
    {
      title: "Bajo las estrellas",
      image: {
        src: "/images/experience/experience-3.webp",
        alt: "La Vía Láctea sobre la línea de los árboles",
      },
    },
  ] satisfies { title: string; image: ImageAsset }[],
};

export const AMENITIES = {
  intro: {
    id: "amenities",
    label: "Comodidades",
    title: "Todo lo que necesitas\npara una estancia cómoda",
    text: "Disfruta de comodidades cuidadosamente seleccionadas, pensadas para que\ncada estancia sea cómoda, práctica y realmente inolvidable.",
  } satisfies SectionIntro,
  items: [
    { icon: "flame", label: "Chimenea acogedora" },
    { icon: "pool", label: "Piscina privada" },
    { icon: "bath", label: "Jacuzzi" },
    { icon: "grill", label: "Zona de parrilla" },
    { icon: "coffee", label: "Estación de café" },
    { icon: "tv", label: "Smart TV" },
    { icon: "washer", label: "Lavadora y secadora" },
    { icon: "key", label: "Entrada autónoma" },
    { icon: "airVent", label: "Aire acondicionado" },
    { icon: "sofa", label: "Zona de descanso exterior" },
    { icon: "utensils", label: "Patio y terraza" },
    { icon: "cctv", label: "Cámaras de seguridad" },
  ] satisfies IconItem[],
};

export const ROOMS = {
  intro: {
    id: "rooms",
    label: "Habitaciones",
    title: "Mucho más que un lugar para dormir",
    text: "Vive un destino diseñado para inspirar\nrelajación, conexión y recuerdos inolvidables.",
  } satisfies SectionIntro,
  items: [
    {
      title: "Dormitorio principal",
      image: {
        src: "/images/rooms/room-1.webp",
        alt: "Dormitorio principal con ventanas arqueadas",
      },
    },
    {
      title: "Sala de estar",
      image: { src: "/images/rooms/room-2.webp", alt: "Sala de estar con un sofá curvo" },
    },
    {
      title: "Cocina y comedor",
      image: { src: "/images/rooms/room-3.webp", alt: "Zona de cocina y comedor" },
    },
    {
      title: "Baño",
      image: { src: "/images/rooms/room-4.webp", alt: "Baño con luz natural" },
    },
    {
      title: "Terraza exterior",
      image: { src: "/images/rooms/room-5.webp", alt: "Terraza con sillones al atardecer" },
    },
  ] satisfies { title: string; image: ImageAsset }[],
};

export const REVIEWS = {
  intro: {
    id: "reviews",
    label: "Opiniones de huéspedes",
    title: "Queridos por huéspedes\nde todo el mundo",
  } satisfies SectionIntro,
  items: [
    {
      name: "Emily Carter",
      stayed: "Estuvo hace 2 días",
      quote:
        '"La cabaña fue aún más hermosa que en las fotos.\nTodo estaba impecable, acogedor y rodeado de\nun paisaje increíble. Ya tenemos ganas de volver."',
      rating: 5,
      avatar: { src: "/images/avatars/review-1.webp", alt: "Emily Carter" },
    },
    {
      name: "Sophie Martin",
      stayed: "Estuvo hace 1 semana",
      quote:
        '"Perfecta para una escapada de fin de semana. La\nchimenea, el ambiente tranquilo y la atención\na los detalles hicieron inolvidable nuestra estancia."',
      rating: 5,
      avatar: { src: "/images/avatars/review-2.webp", alt: "Sophie Martin" },
    },
    {
      name: "James Wilson",
      stayed: "Estuvo hace 2 semanas",
      quote:
        '"Una experiencia realmente relajante. La casa estaba\nmuy bien diseñada, la cocina tenía todo lo que\nnecesitábamos y cada atardecer fue mágico."',
      rating: 5,
      avatar: { src: "/images/avatars/review-3.webp", alt: "James Wilson" },
    },
    {
      name: "Olivia Thompson",
      stayed: "Estuvo hace 1 mes",
      quote:
        '"Una escapada inolvidable, con vistas\nespectaculares, detalles bien pensados\ny todo lo necesario para relajarnos."',
      rating: 5,
      avatar: { src: "/images/avatars/review-4.webp", alt: "Olivia Thompson" },
    },
    {
      name: "Lucas Oliveira",
      stayed: "Estuvo hace 2 meses",
      quote:
        '"El lugar perfecto para desconectarse de la\nciudad. Mañanas tranquilas, naturaleza hermosa\ny mucho espacio para toda la familia."',
      rating: 5,
      avatar: { src: "/images/avatars/review-5.webp", alt: "Lucas Oliveira" },
    },
    {
      name: "Leo Delane",
      stayed: "Estuvo hace 3 meses",
      quote:
        '"Desde los interiores elegantes hasta las zonas\nexteriores relajantes, cada detalle estaba\nmuy bien cuidado para una escapada perfecta."',
      rating: 5,
      avatar: { src: "/images/avatars/review-6.webp", alt: "Leo Delane" },
    },
  ] satisfies Review[],
};

export const LOCATION = {
  intro: {
    id: "location",
    label: "Ubicación",
    title: "Descubre los alrededores",
    text: "Ubicación perfecta para ofrecer privacidad, vistas impresionantes y\nacceso fácil a atractivos locales y servicios cotidianos.",
  } satisfies SectionIntro,
  nearby: [
    { icon: "coffee", name: "Estación de café", time: "5 min" },
    { icon: "waves", name: "Lago", time: "2 min" },
    { icon: "cart", name: "Supermercado", time: "10 min" },
    { icon: "fuel", name: "Gasolinera", time: "10 min" },
    { icon: "mountain", name: "Senderos para caminar", time: "15 min" },
    { icon: "utensils", name: "Restaurante local", time: "8 min" },
  ] satisfies NearbyPlace[],
};

export const BOOKING = {
  intro: {
    id: "booking",
    label: "Reservas",
    title: "¿Listo para tu próxima escapada?",
    text: "Reserva tu estancia hoy y vive el equilibrio perfecto entre\ncomodidad, naturaleza y momentos inolvidables.",
  } satisfies SectionIntro,
  price: "Desde $420 / noche",
  rating: "4.9 (248 opiniones)",
  stars: 5,
  text: "Reserva tu estancia hoy y vive el equilibrio perfecto\nentre comodidad y naturaleza.",
  cta: "Reservar ahora",
  background: {
    src: "/images/booking.webp",
    alt: "La villa al atardecer con las luces cálidas encendidas",
  } satisfies ImageAsset,
};

export const FAQ = {
  intro: {
    id: "faq",
    label: "FAQ",
    title: "Preguntas frecuentes",
    text: "Encuentra respuestas a las preguntas más comunes sobre\ntu estancia, el proceso de reserva y las políticas de la propiedad.",
  } satisfies SectionIntro,
  items: [
    {
      question: "¿A qué hora son la entrada y la salida?",
      answer:
        "La entrada es a partir de las 3:00 p. m. y la salida es hasta las 11:00 a. m. Bajo solicitud, puede haber disponibilidad para entrada anticipada o salida tardía.",
    },
    {
      question: "¿Se admiten mascotas?",
      answer:
        "Sí, las mascotas son bienvenidas. Avísanos con antelación\npara preparar todo y garantizar una estancia cómoda.",
    },
    {
      question: "¿Hay estacionamiento gratuito?",
      answer:
        "Sí, la propiedad incluye estacionamiento privado gratuito para todos los huéspedes durante su estancia.",
    },
    {
      question: "¿Incluye WiFi?",
      answer: "Por supuesto. Hay WiFi de alta velocidad en toda la propiedad, sin costo adicional.",
    },
    {
      question: "¿Cómo hago una reserva?",
      answer:
        "Solo haz clic en el botón Reservar ahora para consultar disponibilidad y completar tu reserva a través de nuestra plataforma de reservas preferida.",
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer:
        "Las políticas de cancelación pueden variar según la plataforma de reservas. Revisa los términos de cancelación antes de confirmar tu reserva.",
    },
    {
      question: "¿La cocina está totalmente equipada?",
      answer:
        "Sí, la cocina incluye todo lo necesario para preparar comidas, desde utensilios y vajilla hasta electrodomésticos modernos.",
    },
    {
      question: "¿Cuántos huéspedes puede alojar la propiedad?",
      answer:
        "La propiedad aloja cómodamente hasta 6 huéspedes, ideal para familias, parejas o grupos pequeños.",
    },
  ] satisfies FaqItem[],
};

export const FOOTER = {
  text: "Vive una escapada tranquila rodeado de\ncomodidad, naturaleza y momentos inolvidables.",
  cta: "Reservar ahora",
  logoMark: { src: "/images/logo-mark.webp", alt: "" } satisfies ImageAsset,
  background: { src: "/images/footer.webp", alt: "" } satisfies ImageAsset,
  navigationTitle: "Navegación",
  contactTitle: "Contacto",
  followTitle: "Síguenos",
  copyright: "© {year} Pine Valley Retreat",
  available: "Disponible para reservar",
};

export const NOT_FOUND = {
  title: "Página no encontrada",
  label: "404",
  text: "La página que buscas no existe o ha sido movida.",
  cta: "Volver al inicio",
};

export const UI_LABELS = {
  skipToContent: "Ir al contenido",
  mainNav: "Principal",
  footerNav: "Pie de página",
  home: "inicio",
  headerCta: "Reserva tu estancia",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  rating: "{n} de 5 estrellas",
  openImage: "Abrir imagen {n} de {total}",
  lightbox: "Galería de fotos",
  closeLightbox: "Cerrar galería",
  previousImage: "Imagen anterior",
  nextImage: "Imagen siguiente",
  imageCounter: "{n} / {total}",
  rooms: "Habitaciones",
  previousRoom: "Habitación anterior",
  nextRoom: "Habitación siguiente",
  mapTitle: "Mapa de ubicación de la propiedad",
  address: "Dirección",
  phone: "Teléfono",
};

/** Sustituye `{clave}` en las etiquetas de interfaz. */
export function fillLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
