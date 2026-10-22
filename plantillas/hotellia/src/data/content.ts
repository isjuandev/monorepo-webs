import type { IconName } from "@/data/icons";

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface SectionIntro {
  title: string;
  text: string;
}

export interface Room {
  slug: string;
  name: string;
  summary: string;
  image: ImageAsset;
  properties: { icon: IconName; label: string }[];
  price: string;
  photos: [ImageAsset, ImageAsset];
  intro: string;
  highlights: string[];
  description: string;
}

export interface Offer {
  slug: string;
  title: string;
  summary: string;
  image: ImageAsset;
  heroAlt: string;
  /** Párrafos del detalle; una cadena vacía es una línea en blanco, como en la fuente. */
  paragraphs: string[];
}

export interface Review {
  quote: string;
  author: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Amenity {
  icon: IconName;
  label: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface LegalBlock {
  title: string;
  paragraphs?: string[];
  list?: string[];
  contact?: { label: string; value: string; href: string }[];
}

const img = (file: string, alt = ""): ImageAsset => ({ src: `/images/${file}`, alt });

export const IMAGES = {
  homeHero: img("home-hero.jpg", "Vista principal del hotel"),
  logoWhite: "/images/logo-white.png",
  logoBlack: "/images/logo-black.png",
  signature: "/images/signature.png",
  barEmber: img("bar-ember.jpg", "Ember - Bar principal del hotel"),
  restaurantGrove: img("restaurant-grove.jpg", "Interior del restaurante Grove & Grain"),
};

export const HOME_HERO = {
  left: "Un hotel boutique diseñado para vivir despacio",
  right: "La vida, sin prisa",
};

export const TICKER_OFFERS = [
  { title: "ESCAPADA DE VERANO", text: "Hasta 30% de descuento", href: "/offers/summer-escape" },
  { title: "OFERTA DE PRIMAVERA", text: "Hasta 40% de descuento", href: "/offers/summer-escape" },
  { title: "OFERTA DE PRIMAVERA", text: "Hasta 40% de descuento", href: "/offers/summer-escape" },
];

export const DINE_INTRO: SectionIntro = {
  title: "vinos y cenas",
  text: "Ya sea que te instales en Ember para un cóctel al atardecer o que te sientes a cenar en Grove & Grain, cada visita es una ocasión que vale la pena saborear.",
};

export const DINE_CARDS = [
  { title: "Menú del bar", subtitle: "Ember", href: "/bar-menu", image: IMAGES.barEmber },
  {
    title: "Menú del restaurante",
    subtitle: "Grove & Grain",
    href: "/restaurant-menu",
    image: IMAGES.restaurantGrove,
  },
];

export const EXPERIENCES_INTRO: SectionIntro = {
  title: "Escape total",
  text: "Desde cenas íntimas a la luz de las velas hasta desayunos en terrazas bañadas por el sol, nuestros espacios gastronómicos ofrecen un recorrido culinario inolvidable, pensado para cada ocasión.",
};

export const EXPERIENCES = [
  {
    title: "DESCANSO",
    text: "Relájate por completo con acceso a nuestro spa, piscina y servicios de bienestar, pensados para disolver el día.",
    image: img("exp-unwind.jpg", "Vista exterior del hotel"),
  },
  {
    title: "BANQUETE",
    text: "Saborea platos cuidadosamente elaborados y menús de temporada que llevan los sabores locales a tu mesa, de la mañana a la noche",
    image: img("exp-feast.jpg", "Cafetería al aire libre con vista al mar"),
  },
  {
    title: "EXPLORA",
    text: "Descubre lo mejor de la zona con recomendaciones locales seleccionadas, visitas guiadas y todo lo que necesitas para salir con confianza.",
    image: img("exp-explore.jpg", "Fachada del hotel con la calle principal"),
  },
  {
    title: "REPOSO",
    text: "Vive el arte de una noche de sueño perfecta, con ropa de cama premium, un ambiente sereno y todas las comodidades cuidadas.",
    image: img("exp-rest.jpg", "Zona de descanso"),
  },
];

export const ROOMS_INTRO: SectionIntro = {
  title: "habitaciones",
  text: "Cada habitación es un santuario: diseñada con cuidado, terminada con carácter y pensada para que se sienta tuya desde el momento en que llegas.",
};

export const ROOMS: Room[] = [
  {
    slug: "double-deluxe",
    name: "Doble Deluxe",
    summary:
      "Luz cálida, quietud de jardín y una cama queen preparada para mañanas largas. Tu patio privado te espera al otro lado de la puerta.",
    image: img("room-double-deluxe.jpg", "Vista del dormitorio de la habitación doble"),
    properties: [
      { icon: "bed", label: "Cama queen" },
      { icon: "users", label: "2 huéspedes" },
      { icon: "area", label: "55 m²" },
    ],
    price: "$199",
    photos: [
      img("room-double-deluxe-bath.jpg", "Foto del baño de la habitación doble"),
      img("room-terrace.jpg", "Vista exterior de la habitación doble"),
    ],
    intro:
      "Con vistas panorámicas al pueblo blanco encalado y al mar Egeo, que brilla bajo el sol, es ideal para parejas o viajeros solos que buscan confort y calma en el corazón de Santorini.",
    highlights: [
      "55 m²",
      "1 cama king",
      "Vista a la caldera y al pueblo",
      "Terraza privada",
      "WiFi gratuito",
      "Ducha de lluvia",
    ],
    description:
      "La habitación tiene un diseño cicládico limpio, con paredes encaladas, detalles de piedra y una cama king vestida con lino fresco. Una terraza privada se abre a vistas sin interrupciones del Egeo, mientras que las puertas de cristal de suelo a techo inundan el interior de luz natural. El baño cuenta con ducha de lluvia y acabados cerámicos de origen local.",
  },
  {
    slug: "junior-suite",
    name: "Junior Suite",
    summary:
      "Amplio espacio, cama king y una zona de estar pensada para tardes sin prisa. Confort elevado a algo discretamente lujoso.",
    image: img("room-junior-suite.jpg", "Vista del dormitorio de la habitación doble"),
    properties: [
      { icon: "bed", label: "Cama king" },
      { icon: "users", label: "2 huéspedes" },
      { icon: "area", label: "76 m²" },
    ],
    price: "$450",
    photos: [
      img("room-junior-suite-bath.jpg", "Foto del baño de la habitación doble"),
      img("room-terrace.jpg", "Vista exterior de la habitación doble"),
    ],
    intro:
      "Estas Junior Suites ofrecen una sensación de espacio elevada, con vistas panorámicas a la caldera y al horizonte del Egeo, perfectas para parejas que celebran una ocasión especial o viajeros que simplemente quieren más espacio para respirar.",
    highlights: [
      "76 m²",
      "1 cama king",
      "Vista a la caldera y al mar",
      "Terraza privada",
      "WiFi gratuito",
      "Ducha de lluvia y bañera de inmersión profunda",
      "Zona de estar",
    ],
    description:
      "La suite tiene una distribución abierta, con paredes encaladas de estilo cicládico, detalles en piedra volcánica y una cama king mullida frente al mar. Una zona de estar con sillones invita a relajarse en el interior, mientras que la terraza privada extiende el espacio bajo el cielo abierto del Egeo. El baño combina azulejos cerámicos artesanales e incluye una bañera de inmersión profunda y una ducha de lluvia.",
  },
  {
    slug: "family-suite",
    name: "Suite familiar",
    summary:
      "Dos dormitorios king, un espacio común y mucho lugar para respirar. Todo lo que necesita una familia, nada de lo que no.",
    image: img("room-family-suite.jpg", "Vista del dormitorio de la habitación doble"),
    properties: [
      { icon: "bed", label: "2 camas king" },
      { icon: "users", label: "4 huéspedes" },
      { icon: "area", label: "125 m²" },
    ],
    price: "$799",
    photos: [
      img("room-family-suite-bath.jpg", "Foto del baño de la habitación doble"),
      img("room-family-suite-terrace.jpg", "Vista exterior de la habitación doble"),
    ],
    intro:
      "Estas amplias Suites familiares están pensadas para familias que no quieren renunciar ni al espacio ni a la belleza. Con zonas de descanso separadas y vistas panorámicas al Egeo, es un hogar lejos de casa sobre el borde de la caldera.",
    highlights: [
      "125 m²",
      "2 camas king",
      "Vista a la caldera y al pueblo",
      "Terraza privada amplia",
      "WiFi gratuito",
      "Ducha de lluvia y bañera de inmersión profunda",
      "Zona de descanso separada para niños",
      "Zona de estar y comedor",
      "La habitación permite una cama extra",
    ],
    description:
      "La suite se distribuye en un diseño abierto y bien pensado, con una zona de dormitorio para adultos y un rincón separado para los niños, ambos con el estilo cicládico característico: paredes encaladas, suelos de piedra fresca y texturas suaves de lino. Una amplia zona de estar y comedor ancla el espacio común, mientras que la gran terraza privada ofrece vistas sin obstáculos al Egeo que toda la familia puede disfrutar junta. El baño incluye ducha de lluvia y bañera de inmersión profunda.",
  },
];

export const OFFERS_INTRO: SectionIntro = {
  title: "OFERTAS",
  text: "Estancias excepcionales, aún más gratificantes. Nuestras últimas ofertas te esperan.",
};

export const OFFERS: Offer[] = [
  {
    slug: "weekend-retreat",
    title: "Escapada de fin de semana — Spa de cortesía",
    summary:
      "Llega el viernes y vete renovado el domingo. Cada estancia de fin de semana incluye acceso a nuestro spa y a las instalaciones de bienestar.",
    image: img("offer-weekend-retreat.jpg", "Vista del área del spa"),
    heroAlt: "Vista del área del spa",
    paragraphs: [
      "Desde el momento en que te registras el viernes por la tarde, tu tiempo es solo tuyo. Instálate en tu habitación, ponte batas y pantuflas suaves, y comienza tu ritual de descanso. Ya sea que decidas relajarte en el calor de la sauna, flotar en la piscina climatizada interior o simplemente descansar en el tranquilo salón con una infusión en la mano, cada detalle está pensado para restaurar el equilibrio y la calma.",
      "Cada estancia de dos noches incluye alojamiento de lujo para las noches del viernes y el sábado, acceso ilimitado a nuestras instalaciones del spa, experiencias diarias de bienestar como sesiones guiadas de yoga o de estiramientos, y salida tardía el domingo para que tu relajación nunca se sienta apresurada. Los huéspedes también disfrutan de una bebida de bienvenida al llegar y de descuentos exclusivos en tratamientos de spa reservados con antelación, por si quieres complementar tu estancia con un masaje, un facial o un ritual de bienestar a medida.",
      "Pasa tu sábado por la mañana empezando despacio, con el desayuno y un baño tranquilo, seguido de una sesión de vapor revitalizante o de un momento de calma en la terraza solárium. Por la noche, disfruta de una cena excepcional o retírate a tu habitación para una velada acogedora. Como elijas vivir tu fin de semana, el ritmo es completamente tuyo.",
    ],
  },
  {
    slug: "summer-escape",
    title: "Escapada de verano — 30% de descuento",
    summary:
      "Reserva directamente y ahorra en estancias de 3 noches o más. Incluye desayuno diario y salida tardía.",
    image: img("offer-summer-escape.jpg", ""),
    heroAlt: "Vista del área del spa",
    paragraphs: [
      "Haz de este verano algo inolvidable con una oferta exclusiva pensada para estancias más largas y relajadas. Disfruta de un 30% de descuento al reservar directamente y quedarte tres noches o más: la excusa perfecta para extender tu escapada y entrar de lleno en modo vacaciones.",
      "",
      "Despierta despacio cada mañana con un desayuno recién preparado, incluido en tu estancia. Dedica los días soleados a explorar, a descansar junto a la piscina o a descubrir los atractivos de la zona, y luego regresa a la comodidad de tu habitación. Con la salida tardía incluida, no hay prisa el día de partida: una mañana más para saborear el momento.",
      "",
      "Ya sea que planees una escapada romántica, un viaje con amigos o una merecida pausa en solitario, nuestra Escapada de verano te da tiempo y espacio para desconectar sin mirar el reloj. Las estancias más largas significan una relajación más profunda, más experiencias y mejor valor, todo mientras disfrutas de la comodidad, el servicio y el ambiente que hacen especial cada estancia.",
      "",
      "Reserva directamente para acceder a esta tarifa exclusiva y aprovechar al máximo tu verano. Sol, ahorro y recuerdos inolvidables te esperan.",
    ],
  },
];

export const REVIEWS_INTRO: SectionIntro = {
  title: "opiniones de huéspedes",
  text: "No te fíes solo de nuestra palabra: escucha a los huéspedes que vivieron cada momento en carne propia.",
};

export const REVIEWS_INTRO_SHORT: SectionIntro = {
  title: "opiniones de huéspedes",
  text: "No te fíes solo de nuestra palabra: escucha a los huéspedes que lo vivieron en carne propia.",
};

export const REVIEWS: Review[] = [
  {
    quote:
      '"Desde que llegamos, cada detalle estuvo perfectamente cuidado. Las habitaciones son espectaculares, el servicio impecable y las vistas absolutamente impresionantes. Sin duda volveremos."',
    author: "Sarah M. | TripAdvisor",
  },
  {
    quote:
      '"Una experiencia de primer nivel. Solo el spa vale la estancia: nos fuimos sintiéndonos completamente renovados. El personal recordó nuestros nombres desde el primer día, y eso marcó toda la diferencia."',
    author: "James & Clara R. | Google Reviews",
  },
  {
    quote:
      '"Celebramos nuestro aniversario aquí y superó todas nuestras expectativas. La atención al detalle, la gastronomía, el ambiente: todo se sintió diseñado solo para nosotros. Simplemente inolvidable."',
    author: "Elena V. | Booking.com",
  },
  {
    quote:
      '"Viajo con frecuencia por trabajo y esta propiedad está en una liga aparte. Las habitaciones están pensadas con mucho cuidado, las camas son increíblemente cómodas y el desayuno, excepcional."',
    author: "Michael T. | Hotels.com",
  },
  {
    quote:
      '"Tranquilo, lujoso y con una elegancia sin esfuerzo. La terraza del restaurante al atardecer es una experiencia que nunca olvidaré. Si buscas la escapada perfecta, no busques más."',
    author: "Nadia & Omar K. | Expedia",
  },
];

export const MANAGER_NOTE = {
  greeting: "ESTIMADO HUÉSPED,",
  paragraphs: [
    "Bienvenido a Hotellia. Nos honra tenerte con nosotros. Este hotel nació de una sola idea: que una gran estancia se siente en los detalles. Desde el número de hilos de tus sábanas hasta la vista desde tu ventana, todo aquí se ha elegido con un único propósito: tu confort absoluto.",
    "Nuestro equipo está disponible las 24 horas para ayudarte con lo que necesites, ya sea una reserva para cenar, recomendaciones locales, almohadas extra o simplemente una pregunta. Estamos aquí, y nos alegra que tú también estés aquí.",
    "Esperamos que tu tiempo con nosotros se sienta como una pausa genuina de lo cotidiano. Descansa bien, explora con libertad y siéntete como en casa.",
  ],
  signatureAlt: "Firma de Marco Delacroix",
  signedBy: "Marco Delacroix, gerente general",
};

export const FAQ_INTRO: SectionIntro = {
  title: "¿TIENES PREGUNTAS?",
  text: "Todo lo que necesitas saber, planificar y preparar antes de llegar",
};

export const FAQ_INTRO_SHORT: SectionIntro = {
  title: "¿TIENES PREGUNTAS?",
  text: "Todo lo que necesitas saber antes de llegar",
};

export const FAQS: Faq[] = [
  {
    question: "¿A qué hora son la llegada y la salida?",
    answer:
      "La llegada es a partir de las 3:00 p. m. y la salida es hasta las 11:00 a. m. Se puede coordinar un check-in anticipado o un check-out tardío bajo solicitud, sujeto a disponibilidad.",
  },
  {
    question: "¿Ofrecen traslados desde el aeropuerto?",
    answer:
      "Sí, podemos organizar traslados privados desde y hacia el aeropuerto para una llegada o salida cómoda y sin contratiempos. Contáctanos con antelación para programar este servicio.",
  },
  {
    question: "¿El desayuno está incluido en la estancia?",
    answer:
      "Las opciones de desayuno varían según tu reserva. Consulta los detalles de tu reserva o contacta a nuestro equipo para más información.",
  },
  {
    question: "¿El hotel es apto para familias o niños?",
    answer:
      "Nuestro hotel da una cálida bienvenida a huéspedes de todas las edades. Si viajas con niños, escríbenos para ayudarte a garantizar una estancia cómoda.",
  },
  {
    question: "¿Ofrecen servicios de conserjería o experiencias locales?",
    answer:
      "Sí, nuestro equipo puede ayudarte con reservas en restaurantes, recomendaciones locales y experiencias seleccionadas para aprovechar al máximo tu estancia.",
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer:
      "Las políticas de cancelación dependen de la tarifa y las fechas de tu reserva. Revisa la confirmación de tu reserva o contáctanos directamente para conocer los detalles específicos.",
  },
];

export const FOOTER_TAGLINE =
  "Espacios cuidadosamente diseñados, donde cada detalle te invita a bajar el ritmo y quedarte un poco más.";

const AMENITY_BASE: Amenity[] = [
  { icon: "bathtub", label: "Baño privado" },
  { icon: "wifi", label: "WiFi de alta velocidad" },
  { icon: "clock", label: "Servicio 24/7" },
  { icon: "roomService", label: "Servicio a la habitación" },
];

export const ROOMS_AMENITIES: Amenity[] = [
  ...AMENITY_BASE,
  { icon: "croissant", label: "Desayuno disponible" },
  { icon: "flower", label: "Centro de bienestar" },
  { icon: "bicycle", label: "Bicicletas" },
];

export const ROOM_AMENITIES: Amenity[] = [
  ...AMENITY_BASE,
  { icon: "parking", label: "Estacionamiento" },
  { icon: "car", label: "Servicio de traslado" },
  { icon: "gym", label: "Gimnasio y spa" },
  { icon: "luggage", label: "Depósito de equipaje" },
];

const ROOMS_PAGE_TEXT =
  "Desde cenas íntimas a la luz de las velas hasta desayunos en terrazas bañadas por el sol, nuestros espacios gastronómicos ofrecen un recorrido culinario inolvidable, pensado para cada ocasión. Desde cenas íntimas a la luz de las velas hasta desayunos en terrazas bañadas por el sol, nuestros espacios gastronómicos ofrecen un recorrido culinario inolvidable, pensado para cada ocasión.";

export const ROOMS_PAGE = {
  intro: { title: "Siéntete como en casa", text: ROOMS_PAGE_TEXT },
  amenities: { title: "Lo que incluye", text: ROOMS_PAGE_TEXT },
};

export const ROOM_AMENITIES_INTRO: SectionIntro = {
  title: "Comodidades",
  text: "Lo hemos pensado todo. Desde lo esencial hasta los pequeños extras, tu confort está en el centro de todo lo que ofrecemos.",
};

export const WINE_DINE_PAGE = {
  intro: {
    title: "DE LA BARRA A LA MESA",
    text: "Desde un espresso matutino hasta un digestivo a medianoche, nuestros espacios te acompañan durante todo el día. Ven con hambre. Ven con sed. Ven sin planes particulares.",
  },
  slides: [
    img("gallery-events-3.jpg"),
    img("gallery-events-4.jpg"),
    img("restaurant-grove.jpg"),
    img("gallery-dine-2.jpg"),
  ],
  bar: {
    title: "Bar Ember",
    text: "Entra en un mundo de cócteles de autor, licores selectos y conversación sin esfuerzo. Nuestro bar combina la calidez de un lugar de barrio con la elegancia de un hotel de primer nivel, ya sea que estés descansando tras un largo viaje o celebrando algo que merezca un brindis.",
    href: "/bar-menu",
    image: img("bar-ember.jpg"),
  },
  restaurant: {
    title: "restaurante Grove & Grain",
    text: "Desde cenas íntimas a la luz de las velas hasta desayunos en terrazas bañadas por el sol, nuestra cocina cuenta la historia de los ingredientes locales y las inspiraciones globales. Cada plato está hecho para perdurar: en el sabor, en la memoria y en la conversación.",
    href: "/restaurant-menu",
    image: img("gallery-dine-1.jpg"),
  },
};

export const GALLERY_PAGE = {
  outdoors: {
    title: "Exteriores",
    text: "Donde los muros de terracota se encuentran con cielos abiertos: nuestros espacios al aire libre son parte de la experiencia tanto como la comida. Cena bajo olivos centenarios, disfruta del desayuno sobre piedra cálida por el sol y deja que el jardín marque el ambiente.",
    feature: img("exp-explore.jpg"),
    images: [
      img("gallery-outdoors-1.jpg"),
      img("offer-summer-escape.jpg"),
      img("exp-unwind.jpg"),
      img("gallery-outdoors-2.jpg"),
      img("gallery-outdoors-3.jpg"),
      img("exp-rest.jpg"),
    ],
  },
  dine: {
    title: "Vinos y cenas",
    text: "Vigas de madera expuestas, luz cálida de faroles y mesas dispuestas con intención tranquila: nuestros comedores son espacios donde el tiempo se detiene y la conversación fluye. Cada espacio tiene su propio carácter, unidos por un compromiso compartido con la excelente comida y la hospitalidad genuina.",
    images: [
      img("bar-ember.jpg"),
      img("gallery-dine-1.jpg"),
      img("restaurant-grove.jpg"),
      img("gallery-dine-2.jpg"),
    ],
  },
  events: {
    title: "eventos",
    text: "Desde celebraciones llenas de sol bajo la pérgola hasta veladas a la luz de las velas en el patio, nuestra finca ofrece un escenario extraordinario para los momentos que importan. Cada evento se diseña a tu medida: tus invitados, tu visión, tu historia.",
    images: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => img(`gallery-events-${n}.jpg`)),
  },
};

export const RESERVE_PAGE = {
  intro: {
    title: "TU ESTANCIA EMPIEZA AQUÍ",
    text: "Ya sea que planees una escapada de fin de semana o una pausa más larga, asegurar tu habitación es solo el comienzo. Completa tus datos a continuación y nuestro equipo se encargará de cada detalle de tu estancia.",
  },
  roomOptions: ["Doble Deluxe", "Superior", "Suite familiar"],
};

export const MENU: MenuCategory[] = [
  {
    title: "Entrantes",
    items: [
      { name: "SOPA DEL DÍA DEL CHEF", description: "Contiene alérgenos", price: "12" },
      {
        name: "SALSA DE ESPINACA Y ALCACHOFA",
        description: "Totopos | Salsa | Crema agria",
        price: "15",
      },
      {
        name: "PAN CON STRACCIATELLA",
        description:
          "Salsa de ricota caliente | Aceite de oliva extra virgen | Tapenade de aceitunas",
        price: "18",
      },
      {
        name: "ENSALADA DE CORAZONES DE ROMANA",
        description: "Romana | Aderezo César | Parmesano en lascas | Croutons de ciabatta",
        price: "11",
      },
      {
        name: "AGREGAR PROTEÍNA",
        description: "Camarones a la plancha | Pollo a la plancha",
        price: "22",
      },
      {
        name: "ENSALADA DE LA CASA MOHONK",
        description:
          "Lechuga artesanal | Tomates | Zanahorias | Pepinos | Aderezo de limón y mostaza dijon",
        price: "13",
      },
    ],
  },
  {
    title: "SÁNDWICHES",
    items: [
      {
        name: "HAMBURGUESA DE RES DE LA CASA (MEDIA LIBRA)",
        description: "Queso | Salsa de la casa | Mermelada de cebolla morada",
        price: "32",
      },
      {
        name: "HAMBURGUESA VEGETARIANA",
        description: "Queso | Cebolla caramelizada | Champiñón portobello",
        price: "29",
      },
      {
        name: "SÁNDWICH CRUJIENTE DE POLLO ESTILO COREANO",
        description: "Ensalada de repollo kimchi | Pepinillos agridulces | Alioli de gochujang",
        price: "27",
      },
      {
        name: "QUESADILLA DE POLLO",
        description: "Chiles asados | Queso pepperjack",
        price: "25",
      },
    ],
  },
  {
    title: "POSTRES",
    items: [
      {
        name: "CREMOSO DE CHOCOLATE",
        description: "Sabayón de vainilla | Albaricoques | Fresas",
        price: "15",
      },
      { name: "CHEESECAKE VASCO", description: "Sabayón | Jarabe de naranja", price: "15" },
      {
        name: "TIRAMISÚ",
        description: "Sabayón de espresso | Granos de café cubiertos de chocolate",
        price: "15",
      },
      {
        name: "PUDÍN DE PAN CÍTRICO CALIENTE",
        description: "Jarabe de naranja | Helado de vainilla",
        price: "15",
      },
      { name: "HELADO ARTESANAL DE LA CASA", description: "Sin gluten", price: "9" },
    ],
  },
];

export const LEGAL_UPDATED = "Última actualización: febrero de 2026";

export const TERMS: LegalBlock[] = [
  {
    title: "Reservas y pago",
    paragraphs: [
      "Todas las reservas se confirman al recibir un correo electrónico de confirmación. El pago se exige en el momento de reservar con tarjeta de crédito u otros métodos aceptados. Las tarifas están sujetas a disponibilidad e impuestos aplicables.",
    ],
  },
  {
    title: "Entrada y salida",
    paragraphs: [
      "Entrada: 3:00 p. m. Salida: 11:00 a. m. Se requiere un documento de identidad con foto y una tarjeta de crédito válidos al momento de la entrada. Los huéspedes deben tener 18 años o más.",
    ],
  },
  {
    title: "Política de cancelación",
    paragraphs: [
      "Cancelación gratuita hasta 48 horas antes de la llegada. Las cancelaciones realizadas dentro de las 48 horas o las no presentaciones se cobrarán con una noche de alojamiento. Las tarifas no reembolsables no son elegibles para cancelación.",
    ],
  },
  {
    title: "Responsabilidades del huésped",
    paragraphs: [
      "Los huéspedes se comprometen a respetar a otros visitantes y a la propiedad del hotel. Está prohibido fumar en interiores. Los daños a habitaciones o instalaciones se cargarán a la cuenta del huésped. Las mascotas solo se admiten en habitaciones designadas para ellas.",
    ],
  },
  {
    title: "Responsabilidad",
    paragraphs: [
      "El hotel no se hace responsable de pertenencias perdidas o robadas. Recomendamos usar las cajas fuertes de las habitaciones para los objetos de valor. Nuestra responsabilidad se limita al monto total de la reserva.",
    ],
  },
  {
    title: "Privacidad",
    paragraphs: [
      "Tu información personal se recopila y utiliza de acuerdo con nuestra Política de privacidad y las leyes de protección de datos aplicables.",
    ],
  },
  {
    title: "Contáctanos",
    paragraphs: ["Para preguntas sobre estos términos, contáctanos en:"],
    contact: [
      { label: "Correo:", value: "info@hotellia.com", href: "mailto:info@hotellia.com" },
      { label: "Teléfono:", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
    ],
  },
];

export const PRIVACY: LegalBlock[] = [
  {
    title: "Información que recopilamos",
    paragraphs: [
      "Recopilamos la información que nos proporcionas al hacer una reserva, incluido tu nombre, correo electrónico, número de teléfono, datos de pago y cualquier solicitud o preferencia especial. También podemos recopilar información sobre tu estancia y el uso de nuestras instalaciones.",
    ],
  },
  {
    title: "Cómo usamos tu información",
    paragraphs: ["Tu información se utiliza para:"],
    list: [
      "Procesar y gestionar tus reservas",
      "Comunicarnos contigo sobre tu reserva",
      "Ofrecer servicios personalizados durante tu estancia",
      "Procesar pagos y prevenir fraudes",
      "Enviar ofertas promocionales (con tu consentimiento)",
      "Mejorar nuestros servicios y la experiencia de los huéspedes",
    ],
  },
  {
    title: "Intercambio de información",
    paragraphs: [
      "No vendemos tu información personal. Podemos compartir tus datos con proveedores de servicios de confianza que nos ayudan a operar el hotel (procesadores de pago, plataformas de reserva, etc.). También podemos divulgar información cuando la ley lo requiera.",
    ],
  },
  {
    title: "Seguridad de los datos",
    paragraphs: [
      "Implementamos medidas de seguridad adecuadas para proteger tu información personal contra el acceso, la alteración o la divulgación no autorizados. La información de pago se cifra y se procesa a través de canales seguros.",
    ],
  },
  {
    title: "Tus derechos",
    paragraphs: ["Tienes derecho a:"],
    list: [
      "Acceder a los datos personales que tenemos sobre ti",
      "Solicitar correcciones de información inexacta",
      "Solicitar la eliminación de tus datos (sujeto a requisitos legales)",
      "Darte de baja de las comunicaciones de marketing en cualquier momento",
      "Oponerte a ciertos tratamientos de tus datos",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "Nuestro sitio web utiliza cookies para mejorar tu experiencia de navegación y analizar el uso del sitio. Puedes controlar la configuración de cookies desde las preferencias de tu navegador.",
    ],
  },
  {
    title: "Retención de datos",
    paragraphs: [
      "Conservamos tu información solo durante el tiempo necesario para cumplir los fines descritos en esta política o según lo exija la ley.",
    ],
  },
];

/** Títulos "fit text" de los heroes: viewBox medido en la fuente. */
export const HERO_TITLES = {
  rooms: { text: "HABITACIONES", width: 1200, height: 274 },
  gallery: { text: "GALERÍA", width: 1200, height: 227 },
  reserve: { text: "RESERVAR", width: 1200, height: 234 },
  wineDine: { text: "VINOS Y CENAS", width: 2076, height: 274 },
  barMenu: { text: "MENÚ DEL BAR", width: 1200, height: 195 },
  restaurantMenu: { text: "MENÚ DEL RESTAURANTE", width: 1200, height: 104 },
  terms: { text: "TÉRMINOS Y CONDICIONES", width: 1200, height: 92 },
  privacy: { text: "POLÍTICA DE PRIVACIDAD", width: 1200, height: 127 },
  brand: { text: "HOTELLIA", width: 1408, height: 234 },
};

/**
 * Etiquetas de interfaz (navegación, accesibilidad, formularios y botones).
 * Cámbialas aquí al traducir o adaptar el sitio; los componentes no contienen texto propio.
 */
export const UI_LABELS = {
  skipToContent: "Ir al contenido",
  mainNav: "Principal",
  footerNav: "Pie de página",
  menu: "Menú",
  close: "Cerrar",
  home: "inicio",
  reserve: "Reservar",
  offers: "Ofertas",
  perNight: "/noche",
  viewMenu: "Ver menú",
  readMore: "Leer más",
  followFacebook: "Síguenos en Facebook",
  followInstagram: "Nuestro Instagram",
  reviews: "Opiniones de huéspedes",
  selectReview: "Seleccionar opinión",
  slideshow: "Vinos y cenas",
  slideCounter: "Diapositiva",
  previousSlide: "Diapositiva anterior",
  nextSlide: "Diapositiva siguiente",
  form: {
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Correo electrónico",
    phone: "Teléfono",
    roomType: "Tipo de habitación",
    checkIn: "Llegada",
    checkOut: "Salida",
    firstNamePlaceholder: "María",
    lastNamePlaceholder: "Pérez",
    emailPlaceholder: "maria@ejemplo.com",
    phonePlaceholder: "+00 000 000 000",
    select: "Seleccionar…",
    submit: "Enviar",
    subject: "Solicitud de reserva",
    sent: "¡Gracias! Se abrirá tu aplicación de correo para enviar la solicitud.",
  },
} as const;

/** Página 404. */
export const NOT_FOUND = {
  title: "¡Vaya!",
  text: "Parece que esta página no existe.",
  cta: "INICIO",
} as const;
