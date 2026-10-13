export interface ImageAsset {
  src: string;
  alt: string;
}

export interface AmenityItem {
  icon: string;
  label: string;
}

export interface Room {
  slug: string;
  name: string;
  price: string;
  size: string;
  bed: string;
  guests: string;
  image: ImageAsset;
  gallery: ImageAsset[];
  description: string;
  extendedDescription?: string;
  summary: string;
  amenities: AmenityItem[];
}

export interface Service {
  slug: string;
  title: string;
  badge: string;
  description: string;
  hours: string;
  icon: string;
  imageMain: ImageAsset;
  imageSecondary: ImageAsset;
}

export interface Review {
  quote: string;
  author: string;
  source: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ROOMS", href: "/rooms" },
  { label: "SERVICES", href: "/services" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
];

export const hotelAmenities: AmenityItem[] = [
  { icon: "/icons/amenity-ac.svg", label: "Air Conditioning" },
  { icon: "/icons/amenity-breakfast.svg", label: "Breakfast Included" },
  { icon: "/icons/amenity-minibar.svg", label: "Minibar" },
  { icon: "/icons/amenity-wifi.svg", label: "High-Speed Wi-Fi" },
  { icon: "/icons/amenity-housekeeping.svg", label: "Daily Housekeeping" },
  { icon: "/icons/amenity-streaming.svg", label: "Streaming Services" },
  { icon: "/icons/amenity-access.svg", label: "Smart Room Access" },
  { icon: "/icons/amenity-safe.svg", label: "In-room Safe" },
];

export const allRooms: Room[] = [
  {
    slug: "tropical-garden-suite",
    name: "Tropical Garden Suite",
    price: "$239",
    size: "85m²",
    bed: "Kingsize Bed",
    guests: "6 guests",
    image: {
      src: "/images/dNhwkuhQvjJLcFWozN3isxp1I.jpg",
      alt: "Tropical Garden Suite bedroom with Mediterranean terrace",
    },
    gallery: [
      {
        src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
        alt: "Tropical Garden Suite spacious lounge and terrace",
      },
      {
        src: "/images/ITGrhDCMBNgkkfR59OBZUAzg.png",
        alt: "Tropical Garden Suite luxury bathroom",
      },
      {
        src: "/images/0rFLyij2JAVr2Po18j9ZvYXbPDU.png",
        alt: "Tropical Garden Suite garden view detail",
      },
    ],
    summary:
      "A serene sanctuary surrounded by lush Mediterranean flora with a spacious private terrace and elegant living space.",
    description:
      "Wake up to uninterrupted views of the tropical gardens from your private terrace. Designed with natural materials, warm tones and elegant finishes, the Tropical Garden Suite offers a peaceful retreat where luxury meets the beauty of Ibiza.",
    extendedDescription:
      "Floor-to-ceiling windows fill the suite with natural light, while the spacious bedroom and comfortable lounge area create the perfect setting for relaxation. Whether you're enjoying your morning coffee overlooking the lush landscape or enjoying sunset cocktails, every moment is curated for total serenity.",
    amenities: hotelAmenities,
  },
  {
    slug: "infinity-pool-villa",
    name: "Infinity Pool Villa",
    price: "$349",
    size: "120m²",
    bed: "Kingsize Bed",
    guests: "4 guests",
    image: {
      src: "/images/V5hcRscOTU3X8Mu6UoqNYt1BPM.jpg",
      alt: "Infinity Pool Villa with private oceanfront pool",
    },
    gallery: [
      {
        src: "/images/F69ommdMTt9Aqp4dz821ZCCc9Zg.jpg",
        alt: "Infinity Pool Villa terrace view over the sea",
      },
      {
        src: "/images/79c9RpRcduZ8DKrbp3PfX5zc7Tc.jpg",
        alt: "Infinity Pool Villa private infinity pool at sunset",
      },
      {
        src: "/images/ITGrhDCMBNgkkfR59OBZUAzg.png",
        alt: "Infinity Pool Villa en-suite master bathroom",
      },
    ],
    summary:
      "Ultimate privacy and seclusion featuring your own private infinity pool suspended above the turquoise sea.",
    description:
      "Experience the pinnacle of luxury in our Infinity Pool Villa. Set directly along the coast, this private haven features expansive indoor and outdoor living areas and an exclusive private infinity pool blending with the Mediterranean horizon.",
    extendedDescription:
      "Natural stone, bespoke timber furnishings, and minimalist architectural lines offer refined sophistication. Relax in your secluded sun deck or dine under the stars with our dedicated in-villa dining service.",
    amenities: hotelAmenities,
  },
  {
    slug: "sunset-premium-ocean-suite",
    name: "Sunset Premium Ocean Suite",
    price: "$289",
    size: "75m²",
    bed: "Kingsize Bed",
    guests: "2 guests",
    image: {
      src: "/images/UiMnvvw12oiURrYU7gfNkjsxtsE.jpg",
      alt: "Sunset Premium Ocean Suite with panoramic sea view",
    },
    gallery: [
      {
        src: "/images/B9TgZKFojhZcITmuAoyhovIoabg.jpg",
        alt: "Sunset Premium Ocean Suite balcony view",
      },
      {
        src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
        alt: "Sunset Premium Ocean Suite master bedroom",
      },
      {
        src: "/images/0rFLyij2JAVr2Po18j9ZvYXbPDU.png",
        alt: "Sunset Premium Ocean Suite interior details",
      },
    ],
    summary:
      "Unrivaled panoramic ocean panoramas and breathtaking sunset vistas from your private Mediterranean balcony.",
    description:
      "Wake up to uninterrupted views of the Mediterranean from your private terrace. Designed with natural materials, warm tones and elegant finishes, the Sunset Premium Ocean Suite offers a peaceful retreat where luxury meets the beauty of Ibiza.",
    extendedDescription:
      "Floor-to-ceiling windows fill the suite with golden island light, while the spacious bedroom and plush lounge area create the perfect setting for relaxation. Whether enjoying morning coffee or watching the iconic sunset, every detail is unforgettable.",
    amenities: hotelAmenities,
  },
  {
    slug: "sunset-premium-ocean-suite-copy",
    name: "Coastal Breeze Suite",
    price: "$229",
    size: "59m²",
    bed: "Double bed",
    guests: "2 guests",
    image: {
      src: "/images/Kg8MSA9BKOyXwapm5Zew3uN0CY.jpg",
      alt: "Coastal Breeze Suite stylish modern bedroom",
    },
    gallery: [
      {
        src: "/images/dNhwkuhQvjJLcFWozN3isxp1I.jpg",
        alt: "Coastal Breeze Suite sunny terrace",
      },
      {
        src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
        alt: "Coastal Breeze Suite relaxation area",
      },
      {
        src: "/images/ITGrhDCMBNgkkfR59OBZUAzg.png",
        alt: "Coastal Breeze Suite walk-in rainfall shower",
      },
    ],
    summary:
      "Wake up to sweeping Mediterranean views and a calming coastal atmosphere, thoughtfully crafted with warm natural materials.",
    description:
      "Wake up to sweeping Mediterranean views and a calming coastal atmosphere. Thoughtfully designed with warm natural materials, this elegant suite is perfect for couples seeking comfort and relaxation.",
    extendedDescription:
      "A harmonious blend of earthy textures, linen fabrics, and gentle sea breezes creates an idyllic coastal sanctuary for rejuvenation.",
    amenities: hotelAmenities,
  },
  {
    slug: "sunset-premium-ocean-suite-copy-copy",
    name: "Executive Ocean Residence",
    price: "$179",
    size: "64m²",
    bed: "Single bed",
    guests: "2 guests",
    image: {
      src: "/images/jlZNqN6EF160KcLI76Ky1PVMyUw.jpg",
      alt: "Executive Ocean Residence expansive coastal suite",
    },
    gallery: [
      {
        src: "/images/UiMnvvw12oiURrYU7gfNkjsxtsE.jpg",
        alt: "Executive Ocean Residence ocean view",
      },
      {
        src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
        alt: "Executive Ocean Residence living area",
      },
      {
        src: "/images/0rFLyij2JAVr2Po18j9ZvYXbPDU.png",
        alt: "Executive Ocean Residence architectural design",
      },
    ],
    summary:
      "Generous living space, panoramic sea views and refined contemporary interiors offering elevated privacy and comfort.",
    description:
      "Enjoy generous living space, panoramic sea views and refined contemporary interiors. A sophisticated retreat offering privacy, comfort and everything you need for an unforgettable stay.",
    extendedDescription:
      "Ideal for longer stays or remote work escapes with dedicated workspace, premium audio system, and full hotel services at your fingertips.",
    amenities: hotelAmenities,
  },
  {
    slug: "sunset-premium-ocean-suite-copy-copy-copy",
    name: "Private Garden Villa",
    price: "$189",
    size: "59m²",
    bed: "Queensize bed",
    guests: "4 guests",
    image: {
      src: "/images/LxVtj1eDwmnmWlIEFBqT6OF42uo.jpg",
      alt: "Private Garden Villa lush garden setting",
    },
    gallery: [
      {
        src: "/images/V5hcRscOTU3X8Mu6UoqNYt1BPM.jpg",
        alt: "Private Garden Villa outdoor terrace",
      },
      {
        src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
        alt: "Private Garden Villa bedroom sanctuary",
      },
      {
        src: "/images/ITGrhDCMBNgkkfR59OBZUAzg.png",
        alt: "Private Garden Villa bathroom amenities",
      },
    ],
    summary:
      "A secluded villa surrounded by private fragrant gardens, offering quiet intimacy and generous indoor-outdoor living.",
    description:
      "Nestled along the breathtaking coastline of Ibiza, Aurelia Resort offers a refined escape where contemporary elegance, exceptional hospitality and the beauty of nature come together to create unforgettable moments.",
    extendedDescription:
      "Stroll directly into your private garden enclosure or enjoy peaceful evenings under century-old olive trees with bespoke amenities.",
    amenities: hotelAmenities,
  },
];

export const homeServices = [
  {
    title: "Wellness & Spa",
    badge: "THE AURELIA EXPERIENCE",
    description:
      "Reconnect body and mind with holistic treatments, private yoga sessions and oceanfront wellness experiences.",
    icon: "/icons/service-wellness.svg",
  },
  {
    title: "Sunset Dining",
    badge: "THE AURELIA EXPERIENCE",
    description:
      "Enjoy Mediterranean cuisine and unforgettable evenings overlooking Ibiza’s breathtaking coastline.",
    icon: "/icons/service-dining.svg",
  },
  {
    title: "Private Experiences",
    badge: "THE AURELIA EXPERIENCE",
    description:
      "Discover hidden beaches, yacht charters and bespoke island adventures curated just for you.",
    icon: "/icons/service-experiences.svg",
  },
];

export const allServices: Service[] = [
  {
    slug: "sunset-dining",
    title: "Sunset Dining",
    badge: "A CULINARY EXPERIENCE",
    description:
      "Savor Mediterranean cuisine prepared with fresh local ingredients while overlooking the sea. As the sun sets over Ibiza, every dinner becomes an unforgettable experience.",
    hours: "DINNER: 6:30 PM – 10:30 PM\nSUNSET BAR: 5:00 PM – 11:00 PM",
    icon: "/icons/service-dining.svg",
    imageMain: {
      src: "/images/IL7I9spY07pzmieOaLrpBi15g.jpg",
      alt: "Sunset dining table overlooking the Mediterranean sea",
    },
    imageSecondary: {
      src: "/images/B9TgZKFojhZcITmuAoyhovIoabg.jpg",
      alt: "Chef prepared fresh Mediterranean cuisine at Aurelia",
    },
  },
  {
    slug: "private-experiences",
    title: "Private Experiences",
    badge: "CURATED JUST FOR YOU",
    description:
      "Create unforgettable memories with tailor-made experiences, from private yacht charters and hidden beach escapes to island tours and romantic sunset picnics.",
    hours: "PRIVATE BOOKINGS AVAILABLE DAILY",
    icon: "/icons/service-experiences.svg",
    imageMain: {
      src: "/images/Bh3TsL7T7O52JquoXgHDw3s3Ow.jpg",
      alt: "Exclusive yacht charter in turquoise Ibiza waters",
    },
    imageSecondary: {
      src: "/images/PT8D8xYWi0mjOCBpM6oAxZCvLA.jpg",
      alt: "Romantic sunset picnic setup on private coastal cliff",
    },
  },
  {
    slug: "wellness-and-spa",
    title: "Wellness & Spa",
    badge: "RELAX & REJUVENATE",
    description:
      "Discover a tranquil retreat where luxury meets wellbeing. Indulge in restorative massages, rejuvenating facials and bespoke wellness treatments, all surrounded by the calming atmosphere of the Mediterranean.",
    hours: "DAILY: 9:00 AM – 8:00 PM",
    icon: "/icons/service-wellness.svg",
    imageMain: {
      src: "/images/PT8D8xYWi0mjOCBpM6oAxZCvLA.jpg",
      alt: "Aurelia spa wellness treatment pavilion",
    },
    imageSecondary: {
      src: "/images/79c9RpRcduZ8DKrbp3PfX5zc7Tc.jpg",
      alt: "Tranquil outdoor hydrotherapy pool overlooking the sea",
    },
  },
];

export const galleryPhotos: ImageAsset[] = [
  {
    src: "/images/pUgvkQQTW7mHNTOMkNZNkVsmg.jpg",
    alt: "Aurelia Resort coastal architecture and Mediterranean garden",
  },
  {
    src: "/images/FYt5VkZQcN1hOCo6dvR5QXBUZCs.jpg",
    alt: "Private villa sun loungers overlooking clear sea",
  },
  {
    src: "/images/OxnRhyuk1fflUgDTkpIisbj3E6k.jpg",
    alt: "Warm wooden interior details and natural linen bedding",
  },
  {
    src: "/images/t7weLTGVyNL7xzOF9KriP8oMHjc.jpg",
    alt: "Infinity pool edge mirroring the blue sky",
  },
  {
    src: "/images/rPGiZzoWjPb5uwEqVyk2DYpHU.jpg",
    alt: "Al fresco dining terrace at twilight",
  },
  {
    src: "/images/ITGrhDCMBNgkkfR59OBZUAzg.png",
    alt: "Luxury marble bathroom with freestanding soaking tub",
  },
  {
    src: "/images/NrD2iMNyjCmyHeaew67vObiGS38.jpg",
    alt: "Spacious suite lounge area with panoramic ocean view",
  },
  {
    src: "/images/PT8D8xYWi0mjOCBpM6oAxZCvLA.jpg",
    alt: "Romantic sunset setup on private oceanfront terrace",
  },
  {
    src: "/images/aEzPtSmyulvvzrKdrPYZwF9X5R8.png",
    alt: "Peaceful holistic spa and relaxation pavilion",
  },
  {
    src: "/images/V5hcRscOTU3X8Mu6UoqNYt1BPM.jpg",
    alt: "Exclusive villa patio with private pool view",
  },
  {
    src: "/images/0rFLyij2JAVr2Po18j9ZvYXbPDU.png",
    alt: "Artisan pottery and organic Mediterranean decor",
  },
  {
    src: "/images/jlZNqN6EF160KcLI76Ky1PVMyUw.jpg",
    alt: "Sunlight casting geometric shadows across stone patio",
  },
  {
    src: "/images/F69ommdMTt9Aqp4dz821ZCCc9Zg.jpg",
    alt: "Sunset over Santa Eulària coastline viewed from the resort",
  },
  {
    src: "/images/oWJA0iz6yvn8OvIhxFQ2UQRM.jpg",
    alt: "Panoramic landscape of Aurelia Resort nestled in nature",
  },
];

export const reviews: Review[] = [
  {
    quote:
      "The attention to detail was outstanding. From the warm welcome to the peaceful atmosphere and stunning views, every moment felt thoughtfully curated. We can’t wait to return.",
    author: "Sophia Carter",
    source: "TripAdvisor",
  },
  {
    quote:
      "An unforgettable stay. Beautiful suites, exceptional service, incredible dining and breathtaking views. Aurelia truly captures the spirit of Ibiza in the most elegant way.",
    author: "Emily Parker",
    source: "Google Reviews",
  },
  {
    quote:
      "Aurelia exceeded every expectation. The infinity pool, sunset dinners and exceptional hospitality created one of the most relaxing holidays we’ve ever experienced. A true hidden gem in Ibiza.",
    author: "Daniel Morgan",
    source: "Booking.com",
  },
];

export const faqList: FaqItem[] = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is available from 3:00 PM, and check-out is until 11:00 AM. Early check-in and late check-out may be arranged upon request, subject to availability.",
  },
  {
    question: "Is airport transfer available?",
    answer:
      "Yes. We offer private airport transfers to and from Ibiza Airport. Simply let our concierge know your arrival details, and we’ll take care of the rest.",
  },
  {
    question: "Do you offer private parking?",
    answer:
      "Complimentary on-site parking is available for all guests. Valet parking is also offered for selected suites and villas.",
  },
  {
    question: "Are pets allowed at the resort?",
    answer:
      "Small pets are welcome in selected accommodations. Please contact us before your arrival so we can prepare everything for a comfortable stay.",
  },
  {
    question: "Can I book spa treatments in advance?",
    answer:
      "Absolutely. We recommend reserving your treatments before arrival to secure your preferred time. Our concierge will gladly assist with your booking.",
  },
  {
    question: "Is breakfast included with my stay?",
    answer:
      "Yes, an artisanal Mediterranean breakfast prepared with fresh organic ingredients is included with every stay, served daily at our restaurant or delivered to your suite.",
  },
];
