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
  trustedBy: "Trusted by +200 people",
  avatars: [
    { src: "/images/avatars/hero-1.webp", alt: "Guest 1" },
    { src: "/images/avatars/hero-2.webp", alt: "Guest 2" },
    { src: "/images/avatars/hero-3.webp", alt: "Guest 3" },
    { src: "/images/avatars/hero-4.webp", alt: "Guest 4" },
  ] satisfies ImageAsset[],
  title: "Your Next Getaway Starts Here",
  text: "Escape to a modern retreat where timeless design, premium\namenities, and peaceful surroundings create the perfect getaway.",
  cta: "Reserve Now",
  background: {
    src: "/images/hero-background.webp",
    alt: "Modern white villa with arches on a grassy hill under a clear blue sky",
  } satisfies ImageAsset,
  /** Recorte con transparencia de la casa: se superpone al título para crear profundidad */
  foreground: { src: "/images/hero-foreground.webp", alt: "" } satisfies ImageAsset,
};

export const OVERVIEW = {
  label: "Property Overview",
  statement:
    "Designed for travelers seeking comfort, breathtaking views, and unforgettable moments surrounded by nature.",
  image: {
    src: "/images/overview.webp",
    alt: "Living room with arched windows opening onto an infinity pool and rolling hills",
  } satisfies ImageAsset,
  features: [
    { icon: "users", label: "Up to 6 people" },
    { icon: "bed", label: "3 cozy rooms" },
    { icon: "bath", label: "2 modern baths" },
    { icon: "car", label: "Private parking" },
    { icon: "pet", label: "Pet Friendly" },
    { icon: "wifi", label: "High-Speed WiFi" },
    { icon: "utensils", label: "Fully Equipped Kitchen" },
    { icon: "trees", label: "Forest Views" },
  ] satisfies IconItem[],
};

export const GALLERY = {
  intro: {
    id: "gallery",
    label: "Gallery",
    title: "Explore Every Corner",
    text: "From cozy interiors to breathtaking outdoor spaces, discover\nevery detail designed to make your stay unforgettable.",
  } satisfies SectionIntro,
  cta: "View gallery",
  images: [
    {
      src: "/images/gallery/gallery-1.webp",
      alt: "White domed villa between olive trees",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-2.webp",
      alt: "Infinity pool with sun loungers in front of the villa",
      shape: "portrait",
    },
    {
      src: "/images/gallery/gallery-3.webp",
      alt: "Aerial view of the villa and its curved pool",
      shape: "portrait",
    },
    {
      src: "/images/gallery/gallery-4.webp",
      alt: "Outdoor lounge facing the pool and the hills",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-5.webp",
      alt: "Villa with arched terraces at sunset",
      shape: "landscape",
    },
    {
      src: "/images/gallery/gallery-6.webp",
      alt: "Villa lit up at dusk with the pool glowing",
      shape: "portrait",
    },
  ] satisfies GalleryImage[],
};

export const EXPERIENCE = {
  intro: {
    id: "experience",
    label: "The Experience",
    title: "More Than Just a Place to Stay",
    text: "Experience a destination designed to inspire\nrelaxation, connection, and unforgettable memories.",
  } satisfies SectionIntro,
  cards: [
    {
      title: "Explore Nature",
      image: {
        src: "/images/experience/experience-1.webp",
        alt: "Aerial view of a forested valley",
      },
    },
    {
      title: "Evenings by the Fire",
      image: { src: "/images/experience/experience-2.webp", alt: "Campfire in the garden at dusk" },
    },
    {
      title: "Under the Stars",
      image: { src: "/images/experience/experience-3.webp", alt: "Milky Way over the treeline" },
    },
  ] satisfies { title: string; image: ImageAsset }[],
};

export const AMENITIES = {
  intro: {
    id: "amenities",
    label: "Amenities",
    title: "Everything You Need\nfor a Comfortable Stay",
    text: "Enjoy thoughtfully selected amenities designed to make\nevery stay comfortable, convenient, and truly unforgettable.",
  } satisfies SectionIntro,
  items: [
    { icon: "flame", label: "Cozy Fireplace" },
    { icon: "pool", label: "Private Pool" },
    { icon: "bath", label: "Hot Tub" },
    { icon: "grill", label: "BBQ Area" },
    { icon: "coffee", label: "Coffee Station" },
    { icon: "tv", label: "Smart TV" },
    { icon: "washer", label: "Washer & Dryer" },
    { icon: "key", label: "Self Check-in" },
    { icon: "airVent", label: "Air Conditioning" },
    { icon: "sofa", label: "Outdoor Lounge" },
    { icon: "utensils", label: "Patio & Terrace" },
    { icon: "cctv", label: "Security Cameras" },
  ] satisfies IconItem[],
};

export const ROOMS = {
  intro: {
    id: "rooms",
    label: "Rooms",
    title: "More Than Just a Place to Stay",
    text: "Experience a destination designed to inspire\nrelaxation, connection, and unforgettable memories.",
  } satisfies SectionIntro,
  items: [
    {
      title: "Master Bedroom",
      image: { src: "/images/rooms/room-1.webp", alt: "Master bedroom with arched windows" },
    },
    {
      title: "Living Room",
      image: { src: "/images/rooms/room-2.webp", alt: "Living room with a curved sofa" },
    },
    {
      title: "Kitchen & Dining",
      image: { src: "/images/rooms/room-3.webp", alt: "Kitchen and dining area" },
    },
    {
      title: "Bathroom",
      image: { src: "/images/rooms/room-4.webp", alt: "Bathroom with natural light" },
    },
    {
      title: "Outdoor Terrace",
      image: { src: "/images/rooms/room-5.webp", alt: "Terrace with lounge chairs at sunset" },
    },
  ] satisfies { title: string; image: ImageAsset }[],
};

export const REVIEWS = {
  intro: {
    id: "reviews",
    label: "Guest Reviews",
    title: "Loved by Guests\nAround the World",
  } satisfies SectionIntro,
  items: [
    {
      name: "Emily Carter",
      stayed: "Stayed 2 days ago",
      quote:
        '"The cabin was even more beautiful than the photos.\nEverything was spotless, cozy, and surrounded by\nincredible scenery. We can\'t wait to come back."',
      rating: 5,
      avatar: { src: "/images/avatars/review-1.webp", alt: "Emily Carter" },
    },
    {
      name: "Sophie Martin",
      stayed: "Stayed 1 week ago",
      quote:
        '"Perfect for a weekend escape. The\nfireplace, peaceful atmosphere, and attention\nto detail made our stay unforgettable."',
      rating: 5,
      avatar: { src: "/images/avatars/review-2.webp", alt: "Sophie Martin" },
    },
    {
      name: "James Wilson",
      stayed: "Stayed 2 weeks ago",
      quote:
        '"A truly relaxing experience. The home was\nbeautifully designed, the kitchen had everything\nwe needed, and every sunset felt magical."',
      rating: 5,
      avatar: { src: "/images/avatars/review-3.webp", alt: "James Wilson" },
    },
    {
      name: "Olivia Thompson",
      stayed: "Stayed 1 months ago",
      quote:
        '"An unforgettable getaway with\nstunning views, thoughtful details,\nand everything we needed to relax."',
      rating: 5,
      avatar: { src: "/images/avatars/review-4.webp", alt: "Olivia Thompson" },
    },
    {
      name: "Lucas Oliveira",
      stayed: "Stayed 2 months ago",
      quote:
        '"The perfect place to disconnect from\nthe city. Quiet mornings, beautiful nature,\nand plenty of space for the whole family."',
      rating: 5,
      avatar: { src: "/images/avatars/review-5.webp", alt: "Lucas Oliveira" },
    },
    {
      name: "Leo Delane",
      stayed: "Stayed 3 months ago",
      quote:
        '"From the elegant interiors to the\nrelaxing outdoor areas, every detail was\nbeautifully curated for a perfect escape."',
      rating: 5,
      avatar: { src: "/images/avatars/review-6.webp", alt: "Leo Delane" },
    },
  ] satisfies Review[],
};

export const LOCATION = {
  intro: {
    id: "location",
    label: "Location",
    title: "Discover the Surroundings",
    text: "Perfectly located to offer privacy, breathtaking views, and\neasy access to local attractions and everyday essentials.",
  } satisfies SectionIntro,
  nearby: [
    { icon: "coffee", name: "Coffee Station", time: "5 min" },
    { icon: "waves", name: "Lake", time: "2 min" },
    { icon: "cart", name: "Grocery Store", time: "10 min" },
    { icon: "fuel", name: "Gas Station", time: "10 min" },
    { icon: "mountain", name: "Hiking Trails", time: "15 min" },
    { icon: "utensils", name: "Local Restaurant", time: "8 min" },
  ] satisfies NearbyPlace[],
};

export const BOOKING = {
  intro: {
    id: "booking",
    label: "Booking",
    title: "Ready for Your Next Escape?",
    text: "Book your stay today and experience the perfect\nbalance of comfort, nature, and unforgettable moments.",
  } satisfies SectionIntro,
  price: "From $420 / night",
  rating: "4.9 (248 Reviews)",
  stars: 5,
  text: "Reserve your stay today and experience\nthe perfect balance of comfort and nature.",
  cta: "Reserve Now",
  background: {
    src: "/images/booking.webp",
    alt: "The villa at dusk with warm lights on",
  } satisfies ImageAsset,
};

export const FAQ = {
  intro: {
    id: "faq",
    label: "FAQ",
    title: "Frequently Asked Questions",
    text: "Find answers to the most common questions about\nyour stay, booking process, and property policies.",
  } satisfies SectionIntro,
  items: [
    {
      question: "What time is check-in and check-out?",
      answer:
        "Check-in begins at 3:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out may be available upon request.",
    },
    {
      question: "Are pets allowed?",
      answer:
        "Yes, pets are welcome. Please let us know in advance\nso we can prepare everything for a comfortable stay.",
    },
    {
      question: "Is free parking available?",
      answer: "Yes, the property includes free private parking for all guests during their stay.",
    },
    {
      question: "Is WiFi included?",
      answer:
        "Absolutely. High-speed WiFi is available throughout the entire property at no additional cost.",
    },
    {
      question: "How do I make a reservation?",
      answer:
        "Simply click the Reserve Now button to check availability and complete your booking through our preferred reservation platform.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Cancellation policies may vary depending on your booking platform. Please review the cancellation terms before confirming your reservation.",
    },
    {
      question: "Is the kitchen fully equipped?",
      answer:
        "Yes, the kitchen includes everything you need to prepare meals, from cookware and utensils to modern appliances.",
    },
    {
      question: "How many guests can the property accommodate?",
      answer:
        "The property comfortably accommodates up to 6 guests, making it perfect for families, couples, or small groups.",
    },
  ] satisfies FaqItem[],
};

export const FOOTER = {
  text: "Experience a peaceful escape surrounded by\ncomfort, nature, and unforgettable moments.",
  cta: "Reserve Now",
  logoMark: { src: "/images/logo-mark.webp", alt: "" } satisfies ImageAsset,
  background: { src: "/images/footer.webp", alt: "" } satisfies ImageAsset,
  navigationTitle: "Navigation",
  contactTitle: "Contact",
  followTitle: "Follow",
  copyright: "© {year} Pine Valley Retreat",
  available: "Available for Booking",
};

export const NOT_FOUND = {
  title: "Page not found",
  label: "404",
  text: "The page you are looking for doesn't exist or has been moved.",
  cta: "Back to home",
};

export const UI_LABELS = {
  skipToContent: "Skip to content",
  mainNav: "Main",
  footerNav: "Footer",
  home: "home",
  headerCta: "Book Your Stay",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  rating: "{n} out of 5 stars",
  openImage: "Open image {n} of {total}",
  lightbox: "Photo gallery",
  closeLightbox: "Close gallery",
  previousImage: "Previous image",
  nextImage: "Next image",
  imageCounter: "{n} / {total}",
  rooms: "Rooms",
  previousRoom: "Previous room",
  nextRoom: "Next room",
  mapTitle: "Property location map",
  address: "Address",
  phone: "Phone",
};

/** Sustituye `{clave}` en las etiquetas de interfaz. */
export function fillLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
