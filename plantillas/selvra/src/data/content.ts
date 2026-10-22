/**
 * Textos, listas e imágenes del sitio (punto 3 de personalización).
 * Todo el contenido es de ejemplo: reemplázalo por el del cliente real.
 */

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface TextBlock {
  title: string;
  text: string;
}

export interface LinkAction {
  label: string;
  href: string;
}

export interface Stay {
  slug: string;
  name: string;
  guests: string;
  area: string;
  summary: string;
  amenities: string;
  image: ImageAsset;
  /** Dos bloques de texto del detalle (columna izquierda) */
  sections: [TextBlock, TextBlock];
  /** Segunda foto de la galería del detalle (la primera es `image`) */
  galleryImage: ImageAsset;
  /** Experiencia que se recomienda al final del detalle */
  relatedExperience: string;
}

export interface Experience {
  slug: string;
  name: string;
  duration: string;
  category: string;
  summary: string;
  /** Nota práctica del bloque "At a glance" */
  note: string;
  image: ImageAsset;
  sections: [TextBlock, TextBlock];
  galleryImage: ImageAsset;
  /** Estancia que se recomienda al final del detalle */
  relatedStay: string;
}

export interface PageIntro {
  label: string;
  title: string;
  text: string;
  /** Título de la pestaña del navegador (se le añade el sufijo de marca) */
  seoTitle: string;
  description: string;
}

export interface MaterialStep {
  label: string;
  title: string;
  text: string;
  image: ImageAsset;
}

export interface Faq {
  question: string;
  answer: string;
}

const IMAGES = {
  heroDay: "/images/hero-day.webp",
  heroEvening: "/images/hero-evening.webp",
  heroMask: "/images/hero-mask.svg",
  stone: "/images/material-stone.webp",
  place: "/images/place-hero.webp",
  stay1: "/images/stays/stay-1.webp",
  stay2: "/images/stays/stay-2.webp",
  stay3: "/images/stays/stay-3.webp",
  experience1: "/images/experiences/experience-1.webp",
  experience2: "/images/experiences/experience-2.webp",
  experience3: "/images/experiences/experience-3.webp",
};

const SHARED_PHOTOS = {
  pavilionDay: {
    src: IMAGES.heroDay,
    alt: "Un pabellón de piedra y madera sobre el lago, al que se llega por un sendero de grava con curvas a la luz del día.",
  },
  stoneDetail: {
    src: IMAGES.stone,
    alt: "Tablas de roble junto a un muro de piedra seca y un bloque de granito desgastado por el tiempo.",
  },
} satisfies Record<string, ImageAsset>;

export const STAYS: Stay[] = [
  {
    slug: "stone-suite",
    name: "Suite de piedra",
    guests: "2 huéspedes",
    area: "42 m²",
    summary: "Una habitación tranquila apoyada en la roca, con el lago llenando la ventana.",
    amenities: "Cama king · terraza privada · ducha amplia",
    image: {
      src: IMAGES.stay1,
      alt: "Una cama vestida de lino junto a un muro de roble y un ventanal de suelo a techo que mira al lago.",
    },
    sections: [
      {
        title: "Espacio para respirar",
        text: "La luz de la mañana recorre despacio el muro de piedra. Una cama de roble, lino suave y una terraza cubierta mantienen la habitación sencilla, para que la vista sea la que hable.",
      },
      {
        title: "Pensada para dos",
        text: "Las zonas de dormir y de estar comparten un mismo nivel. Un baño escondido detrás de la piedra mantiene todo en calma, y la terraza se abre directamente al valle.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "morning-trail",
  },
  {
    slug: "forest-house",
    name: "Casa del bosque",
    guests: "4 huéspedes",
    area: "86 m²",
    summary: "Una casa amplia para desayunos largos y noches alrededor del fuego.",
    amenities: "Dos dormitorios · cocina completa · chimenea",
    image: {
      src: IMAGES.stay2,
      alt: "Una sala de roble con chimenea de piedra y amplias ventanas que dan al bosque.",
    },
    sections: [
      {
        title: "Espacio para extenderse",
        text: "Una sola sala abierta para cocinar, leer y acomodarse junto al fuego. El roble cálido y los amplios asientos junto a la ventana enmarcan una vista generosa de árboles y agua.",
      },
      {
        title: "Hecha para compartir",
        text: "Dos dormitorios independientes son ideales para una familia pequeña o unos amigos. La casa tiene cocina propia, un baño y una terraza para comer al aire libre.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "fire-supper",
  },
  {
    slug: "courtyard-loft",
    name: "Loft del patio",
    guests: "2 huéspedes",
    area: "58 m²",
    summary: "Un refugio luminoso de dos niveles que rodea un pequeño jardín amurallado.",
    amenities: "Cama en altillo · patio · cocina pequeña",
    image: {
      src: IMAGES.stay3,
      alt: "Un interior de roble de doble altura que se abre a un patio ajardinado.",
    },
    sections: [
      {
        title: "Un mundo aparte",
        text: "Las ventanas altas derraman la luz del día sobre los suelos de roble. El patio ajardinado ofrece una vista más cercana, lo bastante próxima para seguir las estaciones hoja a hoja.",
      },
      {
        title: "Dos niveles de luz",
        text: "El altillo para dormir mira hacia abajo, sobre una zona de estar con cocina pequeña. Una escalera une ambos pisos, así que el loft no es accesible sin escalones.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "clay-stillness",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    slug: "morning-trail",
    name: "Sendero de la mañana",
    duration: "90 minutos",
    category: "Al aire libre · paseo guiado y fácil",
    summary: "Camina por los senderos de piedra sobre el agua mientras el día todavía despierta.",
    note: "Lleva calzado cómodo, agua y una capa ligera. El camino tiene escalones irregulares y no es accesible sin escalones. El clima puede cambiar los planes.",
    image: {
      src: IMAGES.experience1,
      alt: "Escalones de piedra que suben por una ladera arbolada sobre un lago en calma al amanecer.",
    },
    sections: [
      {
        title: "Sal con calma",
        text: "Deja la terraza con la luz tenue de la mañana temprano y sigue un circuito corto entre bosque y roca desnuda, con tiempo para detenerte, escuchar y mirar el lago.",
      },
      {
        title: "A ritmo fácil",
        text: "La ruta incluye algunas subidas suaves y varios escalones. Los anfitriones confirman la distancia, el punto de encuentro y la idoneidad antes de reservar.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "stone-suite",
  },
  {
    slug: "clay-stillness",
    name: "Arcilla y quietud",
    duration: "2 horas",
    category: "Interior · taller en grupo pequeño",
    summary: "Deja el teléfono a un lado y deja que tus manos den forma a algo sencillo.",
    note: "No se necesita experiencia previa. Usa ropa que aguante un poco de arcilla. Los anfitriones confirman con antelación la cocción, la recogida y el acceso.",
    image: {
      src: IMAGES.experience2,
      alt: "Cuencos de arcilla hechos a mano y herramientas sobre una mesa de trabajo de roble.",
    },
    sections: [
      {
        title: "Dada forma a mano",
        text: "Empieza con un trozo de arcilla y unas pocas herramientas. Siente la superficie, forma una pequeña vasija y conserva las marcas que dejan tus dedos.",
      },
      {
        title: "Espacio para jugar",
        text: "Es una tarde creativa y pausada, no una clase con una pieza terminada para llevar a casa. Los anfitriones se encargan de los detalles prácticos.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "courtyard-loft",
  },
  {
    slug: "fire-supper",
    name: "Cena junto al fuego",
    duration: "2½ horas",
    category: "Al aire libre · mesa compartida de temporada",
    summary: "Reúnete en una mesa larga mientras el lago se desvanece en la noche.",
    note: "Indica cualquier necesidad alimentaria en tu solicitud. Los anfitriones confirman alérgenos, menú, planes según el clima y acceso antes de reservar.",
    image: {
      src: IMAGES.experience3,
      alt: "Una mesa iluminada con faroles junto a un pequeño fuego con vistas al lago al anochecer.",
    },
    sections: [
      {
        title: "Quédate hasta la noche",
        text: "Un pequeño fuego, algunos platos de temporada y mucho tiempo para conversar. La terraza cambia de ambiente a medida que se va la luz del día y se encienden las lámparas del interior.",
      },
      {
        title: "Sin prisa",
        text: "La cena se sirve en una mesa compartida. Las fotos muestran un posible escenario, no un menú fijo ni un evento programado.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "forest-house",
  },
];

export const HOME = {
  seo: {
    description:
      "Arquitectura silenciosa, tres estancias distintas y experiencias pausadas sobre el lago. Un sitio de retiro de ejemplo.",
  },
  hero: {
    wordmark: "ARVENNA",
    title: "Espacio para un día más pausado.",
    cta: { label: "Explorar estancias", href: "/stays" },
    imageAlt:
      "Un pabellón de piedra y madera sobre un lago, al que se llega por un sendero de grava con curvas.",
    moodCaption: "Un lugar. Dos ambientes.",
    day: "Día",
    evening: "Noche",
    dayImage: IMAGES.heroDay,
    eveningImage: IMAGES.heroEvening,
    /** Silueta en blanco del primer plano (mismo encuadre que las fotos) */
    mask: IMAGES.heroMask,
  },
  materials: [
    {
      label: "01 / EL SUELO",
      title: "Piedra.",
      text: "Asentada en la ladera en lugar de colocada encima de ella. El granito da a cada habitación su sensación tranquila de pertenencia.",
      image: SHARED_PHOTOS.stoneDetail,
    },
    {
      label: "02 / EL CALOR",
      title: "Madera.",
      text: "Roble, lino lavado y el resplandor de una chimenea. Habitaciones pensadas para mañanas sin nada planeado.",
      image: {
        src: IMAGES.stay2,
        alt: "Una sala forrada de roble que se abre a los árboles y a las colinas lejanas.",
      },
    },
    {
      label: "03 / LA VISTA",
      title: "Espacio abierto.",
      text: "Más allá del cristal, el lago atrae la mirada hacia el horizonte. Quédate un poco más.",
      image: {
        src: IMAGES.heroEvening,
        alt: "Un pabellón bajo de piedra que mira al lago al atardecer.",
      },
    },
  ] satisfies MaterialStep[],
  stays: {
    label: "TU PROPIO RITMO",
    title: "Tres formas de instalarte.",
  },
  moments: {
    label: "PEQUEÑOS MOMENTOS",
    title: "Un día con espacio.",
    featured: "fire-supper",
    others: ["morning-trail", "clay-stillness"],
  },
  faq: {
    title: "Algunas cosas que conviene saber.",
    items: [
      {
        question: "¿Puedo reservar una estancia?",
        answer:
          "Este es un sitio de ejemplo: las habitaciones, las tarifas y las fechas son marcadores de posición. Sustituye esta respuesta por la forma en que los huéspedes pueden reservar contigo.",
      },
      {
        question: "¿Qué pasa con mi solicitud?",
        answer:
          "La página de solicitud crea un borrador en tu navegador que puedes copiar o enviar por correo electrónico. No se guarda nada, y al recargar la página se borra.",
      },
      {
        question: "¿Cómo elijo un espacio?",
        answer:
          "Compara huéspedes, tamaño y comodidades en la página de Estancias. Cada página de estancia describe su distribución y sugiere una experiencia para combinar con ella.",
      },
      {
        question: "¿Puede convertirse en un sitio de hospitalidad real?",
        answer:
          "Sí. Cambia el texto y las fotos de ejemplo por los tuyos, añade tus datos de contacto reales y conecta la solicitud a tu bandeja de entrada o a tu herramienta de reservas.",
      },
    ] satisfies Faq[],
  },
  cta: {
    title: "¿Cómo sería tu día más pausado?",
    button: { label: "Crear un borrador", href: "/enquire" },
  },
};

export const PAGES = {
  stays: {
    label: "ESTANCIAS",
    title: "Espacio para bajar el ritmo.",
    text: "Tres espacios distintos, un lugar pensado con cuidado. Encuentra el que sientas como tuyo.",
    seoTitle: "Estancias",
    description:
      "Compara la Suite de piedra, la Casa del bosque y el Loft del patio por huéspedes, tamaño y comodidades.",
  } satisfies PageIntro,
  experiences: {
    label: "EXPERIENCIAS",
    title: "Menos en la agenda. Más en el momento.",
    text: "Un sendero, un trozo de arcilla, una mesa junto al fuego. Formas sencillas de aprovechar bien un día.",
    seoTitle: "Experiencias",
    description:
      "Un sendero al amanecer, un taller de arcilla y una cena junto al fuego: tres formas tranquilas de pasar el día.",
  } satisfies PageIntro,
  place: {
    label: "EL LUGAR",
    title: "Construido para pertenecer.",
    text: "Piedra, madera y luz del día. Una conversación tranquila entre el edificio y el paisaje.",
    seoTitle: "El lugar",
    description: "La piedra, el roble y el paisaje junto al lago que dan forma al retiro.",
    heroImage: {
      src: IMAGES.place,
      alt: "Un pabellón de cristal y roble con vistas a un valle boscoso junto al lago.",
    },
    story: {
      title: "Cerca del paisaje. Lejos del ajetreo.",
      paragraphs: [
        "El retiro se asienta en una ladera boscosa sobre un lago. Un pabellón bajo se encuentra con la roca, una casa independiente mira a largas vistas y un loft de dos niveles se vuelca hacia su propio jardín.",
        "La piedra natural, el roble cálido y los amplios cristales unen los edificios y dejan espacio para la luz cambiante, las mañanas lentas y los momentos cotidianos que se sienten un poco menos apresurados.",
      ],
      image: {
        src: IMAGES.stone,
        alt: "Primer plano de roble, cristal y piedra con luz lateral cálida.",
      },
    },
    journey: {
      title: "El trayecto también es parte de la estancia.",
      paragraphs: [
        "Usa este espacio para indicaciones claras: cómo llegar, dónde estacionar, opciones de traslado y tiempos de viaje realistas desde el pueblo o el aeropuerto más cercano.",
        "El terreno incluye senderos de piedra, escalones y pendientes. Describe con precisión las rutas sin escalones y el acceso a cada habitación, e invita a los huéspedes a preguntar por sus necesidades.",
      ],
      cta: { label: "Explorar las estancias", href: "/stays" },
    },
  },
  enquire: {
    label: "SOLICITUD",
    title: "Empieza con una pequeña posibilidad.",
    text: "Elige una estancia, imagina unos días y pon tus planes en palabras.",
    seoTitle: "Solicitud",
    description:
      "Crea un borrador de solicitud para una estancia o experiencia y luego cópialo o envíalo por correo electrónico.",
  } satisfies PageIntro,
  demo: {
    label: "ACERCA DE",
    title: "Un lugar imaginado. Un sitio web para hacerlo tuyo.",
    text: "Este es un retiro de ejemplo. El sitio muestra un sitio web de hospitalidad editable, no un hotel en funcionamiento.",
    seoTitle: "Acerca de este sitio web",
    description:
      "Qué incluye este sitio de retiro de ejemplo, cómo adaptarlo y qué preparar antes de publicarlo.",
    sections: [
      {
        title: "Un lugar de ejemplo",
        text: "El retiro, sus estancias, experiencias y fotografías son ilustrativos. No describen un hotel real, un operador, una dirección ni una oferta.",
      },
      {
        title: "Lo que incluye el sitio web",
        text: "Una página de inicio, listados de estancias y experiencias con páginas de detalle, una página sobre el lugar, un borrador de solicitud y dos páginas de texto como esta.",
      },
      {
        title: "Hazlo tuyo",
        text: "Reemplaza las estancias, experiencias y fotos por las tuyas. Ajusta los colores y las tipografías compartidas, y mantén el slug de cada estancia sincronizado con las opciones de la solicitud.",
      },
      {
        title: "Antes de publicarlo",
        text: "Conecta la solicitud a una bandeja de entrada real o a una herramienta de reservas y pruébala. Añade la identidad de tu negocio, la información legal y de privacidad, los datos de acceso y las condiciones de reserva.",
      },
      {
        title: "Entrega",
        text: "El alojamiento, el dominio y la analítica pertenecen a la persona propietaria final. Esta página no afirma reservas completadas ni opiniones de huéspedes verificadas.",
      },
    ] satisfies TextBlock[],
  },
  privacy: {
    label: "PRIVACIDAD",
    title: "Tus palabras quedan contigo.",
    text: "La página de solicitud es una herramienta local de redacción. No envía lo que escribes.",
    seoTitle: "Privacidad",
    description: "Cómo usa el borrador de solicitud la memoria temporal y tu portapapeles.",
    sections: [
      {
        title: "El borrador de solicitud",
        text: "Tus datos permanecen en la memoria de esta pestaña. No se envían a ningún servidor ni se guardan en el almacenamiento del navegador. Crear un borrador no es una reserva.",
      },
      {
        title: "Copiar y enviar",
        text: "Copiar coloca el borrador en tu portapapeles cuando tú lo pides. Enviar por correo abre tu propia aplicación de correo con el borrador listo. Al recargar la página se borra.",
      },
      {
        title: "Entrega del sitio web",
        text: "Nuestro proveedor de alojamiento sirve este sitio web y sus archivos. Visitar cualquier página implica solicitudes técnicas habituales, como tu dirección IP y el tipo de navegador.",
      },
      {
        title: "Para la persona operadora",
        text: "Sustituye este texto por la información de privacidad de tu negocio, del alojamiento, la analítica y los formularios antes de recibir huéspedes reales.",
      },
    ] satisfies TextBlock[],
  },
};

export const DETAIL = {
  stay: {
    kicker: "Una estancia de Arvenna",
    relatedTitle: "Reserva un poco de tiempo para esto.",
    relatedText: "Sigue explorando el retiro.",
  },
  experience: {
    kicker: "Una experiencia de Arvenna",
    relatedTitle: "Un lugar al que volver.",
    relatedText: "Sigue explorando el retiro.",
  },
  glanceTitle: "De un vistazo",
  glanceNote: "Ficha de ejemplo. Sin disponibilidad en vivo ni reservas.",
};

export const FOOTER = {
  title: "Haz espacio para un día más pausado.",
  note: "Un lugar de ejemplo. Un sitio web cuidado. Aquí no se pueden reservar estancias ni experiencias.",
  aboutLink: { label: "Acerca de este sitio web", href: "/demo" },
};

export const NOT_FOUND = {
  label: "404",
  title: "Este camino no lleva a ninguna parte.",
  text: "La página que buscas se ha movido o nunca existió. Vuelve atrás y empieza de nuevo.",
  seoTitle: "Página no encontrada",
  cta: { label: "Volver al inicio", href: "/" },
};

export const UI_LABELS = {
  skipToContent: "Ir al contenido",
  mainNav: "Principal",
  footerNav: "Pie de página",
  homeLink: "Inicio",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  allStays: "Todas las estancias",
  allExperiences: "Todas las experiencias",
  exploreStay: "Explorar esta estancia",
  exploreExperience: "Explorar esta experiencia",
  createEnquiry: "Crear un borrador de solicitud",
  selected: "Seleccionada",
  staySelector: "Elige una estancia",
  moodGroup: "Luz",
  checkmark: "✓",
  faq: "Preguntas y respuestas",
  form: {
    notice: "Formulario de ejemplo: crea un borrador de solicitud. No se enviará nada.",
    choice: "Estancia o experiencia",
    choose: "Por favor, elige una opción",
    arrival: "Llegada",
    departure: "Salida",
    guests: "Huéspedes",
    name: "Nombre",
    email: "Correo electrónico",
    message: "Mensaje (opcional)",
    required: "*",
    submit: "Crear borrador de solicitud",
    errorRequired: "Por favor, completa este campo.",
    errorEmail: "Introduce una dirección de correo electrónico válida.",
    errorGuests: "Introduce al menos 1 huésped.",
    errorDates: "La salida debe ser posterior a la llegada.",
    ready: "Tu borrador está listo. No se ha enviado ni reservado nada.",
    draftLabel: "Tu borrador de solicitud",
    copy: "Copiar texto",
    copied: "Copiado al portapapeles",
    copyFailed: "Copiar no está disponible. Selecciona el texto y cópialo manualmente.",
    copyHint: "También puedes seleccionar y copiar el borrador de abajo.",
    sendEmail: "Enviar por correo",
    draftTitle: "Borrador de solicitud — no enviado",
    draftChoice: "Estancia o experiencia",
    draftDates: "Fechas solicitadas",
    draftGuests: "Huéspedes",
    draftName: "Nombre",
    draftEmail: "Correo electrónico",
    emailSubject: "Solicitud",
  },
};
