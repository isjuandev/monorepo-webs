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
  homeHero: img("home-hero.jpg", "The hotel main view"),
  logoWhite: "/images/logo-white.png",
  logoBlack: "/images/logo-black.png",
  signature: "/images/signature.png",
  barEmber: img("bar-ember.jpg", "Ember - Main bar of the hotel"),
  restaurantGrove: img("restaurant-grove.jpg", "Grove & Grain resutaurant interior"),
};

export const HOME_HERO = {
  left: "A boutique hotel designed for slow living",
  right: "Life, Unhurried",
};

export const TICKER_OFFERS = [
  { title: "SUMMER ESCAPE", text: "Up to 30% off", href: "/offers/summer-escape" },
  { title: "SPRING SALE", text: "Up to 40% off", href: "/offers/summer-escape" },
  { title: "SPRING SALE", text: "Up to 40% off", href: "/offers/summer-escape" },
];

export const DINE_INTRO: SectionIntro = {
  title: "wine & dine",
  text: "Whether you're settling into Ember for an evening cocktail or sitting down to a full dinner at Grove & Grain, every visit is an occasion worth savouring.",
};

export const DINE_CARDS = [
  { title: "Bar menu", subtitle: "Ember", href: "/bar-menu", image: IMAGES.barEmber },
  {
    title: "Restaurant menu",
    subtitle: "Grove & Grain",
    href: "/restaurant-menu",
    image: IMAGES.restaurantGrove,
  },
];

export const EXPERIENCES_INTRO: SectionIntro = {
  title: "Total escape",
  text: "From intimate candlelit dinners to sun-drenched terrace breakfasts, our dining venues offer an unforgettable culinary journey crafted for every occasion.",
};

export const EXPERIENCES = [
  {
    title: "UNWIND",
    text: "Sink into pure relaxation with access to our spa, pool, and wellness amenities designed to melt the day away.",
    image: img("exp-unwind.jpg", "Exterior view of the hotel"),
  },
  {
    title: "FEAST",
    text: "Savor thoughtfully crafted dishes and seasonal menus that bring local flavors to your table, morning to night",
    image: img("exp-feast.jpg", "Outdoor cafe with sea view"),
  },
  {
    title: "EXPLORE",
    text: "Discover the best of the area with curated local tips, guided tours, and everything you need to venture out with confidence.",
    image: img("exp-explore.jpg", "Exterior of the hotel with main road"),
  },
  {
    title: "REST",
    text: "Experience the art of a perfect night's sleep with premium bedding, a serene atmosphere, and every comfort taken care of.",
    image: img("exp-rest.jpg", "Lounging area"),
  },
];

export const ROOMS_INTRO: SectionIntro = {
  title: "rooms",
  text: "Each room is a sanctuary — designed with care, finished with character, and made to feel like yours from the moment you arrive.",
};

export const ROOMS: Room[] = [
  {
    slug: "double-deluxe",
    name: "Double Deluxe",
    summary:
      "Warm light, garden stillness, and a queen bed dressed for long mornings. Your private patio awaits just beyond the door.",
    image: img("room-double-deluxe.jpg", "Double room bedroom view"),
    properties: [
      { icon: "bed", label: "Queen Bed" },
      { icon: "users", label: "2 Guests" },
      { icon: "area", label: "55 Sqm" },
    ],
    price: "$199",
    photos: [
      img("room-double-deluxe-bath.jpg", "Double room bathroom photo"),
      img("room-terrace.jpg", "Outdoor view of double room"),
    ],
    intro:
      "With sweeping views of the whitewashed village and shimmering Aegean Sea are ideal for couples or solo travellers seeking comfort and calm in the heart of Santorini.",
    highlights: [
      "55 sqm",
      "1 King Bed",
      "Caldera & Village View",
      "Private Terrace",
      "Complimentary WiFi",
      "Rainfall Shower",
    ],
    description:
      "The room features clean Cycladic design with whitewashed walls, stone accents, and a king bed dressed in crisp linen. A private terrace opens to uninterrupted views of the Aegean, while floor-to-ceiling glass doors flood the interior with natural light. The bathroom offers a rainfall shower with locally sourced ceramic finishes.",
  },
  {
    slug: "junior-suite",
    name: "Junior Suite",
    summary:
      "Generous space, a king bed, and a sitting area made for unhurried evenings. Comfort elevated to something quietly luxurious.",
    image: img("room-junior-suite.jpg", "Double room bedroom view"),
    properties: [
      { icon: "bed", label: "King Bed" },
      { icon: "users", label: "2 Guests" },
      { icon: "area", label: "76 sqm" },
    ],
    price: "$450",
    photos: [
      img("room-junior-suite-bath.jpg", "Double room bathroom photo"),
      img("room-terrace.jpg", "Outdoor view of double room"),
    ],
    intro:
      "These Junior Suites offer an elevated sense of space with panoramic views of the Caldera and the Aegean horizon, perfect for couples celebrating a special occasion or travellers who simply want more room to breathe.",
    highlights: [
      "76 sqm",
      "1 King Bed",
      "Caldera & Sea View",
      "Private Terrace",
      "Complimentary WiFi",
      "Rainfall Shower & Deep Soak Bathtub",
      "Seating Area",
    ],
    description:
      "The suite features an open-plan layout with Cycladic whitewashed walls, volcanic stone detailing, and a plush king bed facing the sea. A dedicated seating area with lounge chairs invites you to unwind indoors, while the private terrace extends the living space under the open Aegean sky. The bathroom is finished with handcrafted ceramic tiles and offers both a deep soak bathtub and a rainfall shower.",
  },
  {
    slug: "family-suite",
    name: "Family Suite",
    summary:
      "Two king bedrooms, a shared living space, and room to breathe. Everything a family needs, nothing they don't.",
    image: img("room-family-suite.jpg", "Double room bedroom view"),
    properties: [
      { icon: "bed", label: "2 King Beds" },
      { icon: "users", label: "4 Guests" },
      { icon: "area", label: "125 sqm" },
    ],
    price: "$799",
    photos: [
      img("room-family-suite-bath.jpg", "Double room bathroom photo"),
      img("room-family-suite-terrace.jpg", "Outdoor view of double room"),
    ],
    intro:
      "These generous Family Suites are designed for families who refuse to compromise on space or beauty. With separate sleeping areas and sweeping views of the Aegean, it's a home away from home perched on the edge of the caldera.",
    highlights: [
      "125 sqm",
      "2 King Beds",
      "Caldera & Village View",
      "Spacious Private Terrace",
      "Complimentary WiFi",
      "Rainfall Shower & Deep Soak Bathtub",
      "Separate Children's Sleeping Area",
      "Seating & Dining Area",
      "Room Allows Extra Bed",
    ],
    description:
      "The suite is arranged across a thoughtful open-plan layout with a distinct adult sleeping area and a separate nook for children, each finished in the signature Cycladic style — whitewashed walls, cool stone floors, and soft linen textures. A generous seating and dining area anchors the living space, while the expansive private terrace offers unobstructed Aegean views the whole family can enjoy together. The bathroom features both a rainfall shower and a deep soak bathtub.",
  },
];

export const OFFERS_INTRO: SectionIntro = {
  title: "OFFERS",
  text: "Exceptional stays, made even more rewarding. Our latest offers are waiting.",
};

export const OFFERS: Offer[] = [
  {
    slug: "weekend-retreat",
    title: "Weekend Retreat — Complimentary Spa",
    summary:
      "Arrive Friday, leave refreshed on Sunday. Every weekend stay includes access to our spa and wellness facilities.",
    image: img("offer-weekend-retreat.jpg", "Spa area view"),
    heroAlt: "Spa area view",
    paragraphs: [
      "From the moment you check in on Friday afternoon, your time becomes your own. Settle into your beautifully appointed room, slip into plush robes and slippers, and begin your unwind ritual. Whether you choose to ease into the warmth of the sauna, drift in the heated indoor pool, or simply relax in the tranquil lounge with herbal tea in hand, every detail is designed to restore balance and calm.",
      "Each two-night stay includes luxury accommodation for Friday and Saturday evening, unlimited access to our spa facilities, daily wellness experiences such as guided yoga or stretching sessions, and late checkout on Sunday so your relaxation never feels rushed. Guests also enjoy a welcome drink upon arrival and exclusive savings on pre-booked spa treatments should you wish to enhance your stay with a massage, facial, or bespoke wellness ritual.",
      "Spend your Saturday morning starting slowly with breakfast and a peaceful swim, followed by a revitalizing steam session or a quiet moment on the sun terrace. In the evening, savor exceptional dining or retreat to your room for a cozy night in. However you choose to experience your weekend, the rhythm is entirely yours.",
    ],
  },
  {
    slug: "summer-escape",
    title: "Summer Escape — 30% Off",
    summary:
      "Book direct and save on stays of 3 nights or more. Includes daily breakfast and late checkout.",
    image: img("offer-summer-escape.jpg", ""),
    heroAlt: "Spa area view",
    paragraphs: [
      "Make this summer unforgettable with an exclusive offer designed for longer, more relaxed stays. Enjoy 30% off when you book direct and stay three nights or more — the perfect excuse to extend your getaway and truly settle into vacation mode.",
      "",
      "Wake slowly each morning to a freshly prepared daily breakfast, included with your stay. Spend sun-filled days exploring, lounging by the pool, or discovering local attractions, then return to the comfort of your beautifully appointed room. With late checkout included, there’s no rush on departure day — just one more morning to savor the moment.",
      "",
      "Whether you’re planning a romantic retreat, a friends’ getaway, or a well-deserved solo break, our Summer Escape gives you the time and space to unwind without watching the clock. Longer stays mean deeper relaxation, more experiences, and better value — all while enjoying the comfort, service, and atmosphere that make every stay special.",
      "",
      "Book direct to unlock this exclusive rate and make the most of your summer. Sunshine, savings, and unforgettable memories await.",
    ],
  },
];

export const REVIEWS_INTRO: SectionIntro = {
  title: "visitor reviews",
  text: "Don't just take our word for it — hear from the guests who've personally experienced every moment for themselves.",
};

export const REVIEWS_INTRO_SHORT: SectionIntro = {
  title: "visitor reviews",
  text: "Don't just take our word for it — hear from the guests who've experienced it for themselves.",
};

export const REVIEWS: Review[] = [
  {
    quote:
      '"From the moment we arrived, every detail was perfectly taken care of. The rooms are stunning, the service impeccable, and the views absolutely breathtaking. We will absolutely be returning."',
    author: "Sarah M. | TripAdvisor",
  },
  {
    quote:
      'A truly world-class experience. The spa alone is worth the stay — we left feeling completely renewed. The staff remembered our names from day one, which made all the difference."',
    author: "James & Clara R. | Google Reviews",
  },
  {
    quote:
      '"We celebrated our anniversary here and it exceeded every expectation. The attention to detail, the cuisine, the ambiance — everything felt curated just for us. Simply unforgettable."',
    author: "Elena V. | Booking.com",
  },
  {
    quote:
      '"I travel frequently for work and this property stands in a league of its own. The rooms are thoughtfully designed, the beds incredibly comfortable, and the breakfast exceptional."',
    author: "Michael T. | Hotels.com",
  },
  {
    quote:
      '"Peaceful, luxurious, and effortlessly elegant. The terrace restaurant at sunset is an experience I will never forget. If you are looking for the perfect escape, look no further."',
    author: "Nadia & Omar K. | Expedia",
  },
];

export const MANAGER_NOTE = {
  greeting: "DEAR GUEST,",
  paragraphs: [
    "Welcome to Hotellia. We are honoured to have you with us. This hotel was built around a single idea — that a great stay is felt in the details. From the thread count of your sheets to the view from your window, everything here has been chosen with one purpose: your complete comfort.",
    "Our team is available around the clock to assist with anything you may need — whether that is a dinner reservation, local recommendations, extra pillows, or simply a question. We are here, and we are glad you are here too.",
    "We hope your time with us feels like a genuine pause from the ordinary. Rest well, explore freely, and make yourself entirely at home.",
  ],
  signatureAlt: "Marco Delacroix signature",
  signedBy: "Marco Delacroix, General Manager",
};

export const FAQ_INTRO: SectionIntro = {
  title: "GOT QUESTIONS?",
  text: "Everything you need to know, plan, and prepare before you arrive at your doorstep",
};

export const FAQ_INTRO_SHORT: SectionIntro = {
  title: "GOT QUESTIONS?",
  text: "Everything you need to know before you arrive",
};

export const FAQS: Faq[] = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is available from 3:00 PM, and check-out is by 11:00 AM. Early check-in or late check-out may be arranged upon request, subject to availability.",
  },
  {
    question: "Do you offer airport transfers?",
    answer:
      "Yes, we can arrange private airport transfers for a smooth and comfortable arrival or departure. Please contact us in advance to schedule this service.",
  },
  {
    question: "Is breakfast included in the stay?",
    answer:
      "Breakfast options vary depending on your reservation. Please refer to your booking details or contact our team for more information.",
  },
  {
    question: "Is the hotel suitable for families or children?",
    answer:
      "Our hotel warmly welcomes guests of all ages. If you’re traveling with children, feel free to reach out so we can help ensure a comfortable stay.",
  },
  {
    question: "Do you offer concierge or local experience services?",
    answer:
      "Yes, our team is happy to assist with restaurant reservations, local recommendations, and curated experiences to help you make the most of your stay.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation policies depend on the rate and dates of your reservation. Please review your booking confirmation or contact us directly for specific details.",
  },
];

export const FOOTER_TAGLINE =
  "Thoughtfully crafted spaces where every detail invites you to slow down and stay a little longer.";

const AMENITY_BASE: Amenity[] = [
  { icon: "bathtub", label: "Private Bath" },
  { icon: "wifi", label: "High-speed Wifi" },
  { icon: "clock", label: "24/7 Service" },
  { icon: "roomService", label: "Room Service" },
];

export const ROOMS_AMENITIES: Amenity[] = [
  ...AMENITY_BASE,
  { icon: "croissant", label: "Breakfast Available" },
  { icon: "flower", label: "Wellness Center" },
  { icon: "bicycle", label: "Bicycles" },
];

export const ROOM_AMENITIES: Amenity[] = [
  ...AMENITY_BASE,
  { icon: "parking", label: "Parking Space" },
  { icon: "car", label: "Shuttle Service" },
  { icon: "gym", label: "Gym & Spa" },
  { icon: "luggage", label: "Luggage Storage" },
];

const ROOMS_PAGE_TEXT =
  "From intimate candlelit dinners to sun-drenched terrace breakfasts, our dining venues offer an unforgettable culinary journey crafted for every occasion. From intimate candlelit dinners to sun-drenched terrace breakfasts, our dining venues offer an unforgettable culinary journey crafted for every occasion.";

export const ROOMS_PAGE = {
  intro: { title: "Make yourself at home", text: ROOMS_PAGE_TEXT },
  amenities: { title: "What’s Included", text: ROOMS_PAGE_TEXT },
};

export const ROOM_AMENITIES_INTRO: SectionIntro = {
  title: "Amenities",
  text: "We've thought of it all. From the essentials to the little extras, your comfort is at the heart of everything we provide.",
};

export const WINE_DINE_PAGE = {
  intro: {
    title: "FROM BAR TO TABLE",
    text: "From a morning espresso to a late-night digestif, our venues move with you through the day. Come hungry. Come thirsty. Come with no particular plans.",
  },
  slides: [
    img("gallery-events-3.jpg"),
    img("gallery-events-4.jpg"),
    img("restaurant-grove.jpg"),
    img("gallery-dine-2.jpg"),
  ],
  bar: {
    title: "Bar Ember",
    text: "Step into a world of hand-crafted cocktails, rare pours, and effortless conversation. Our bar blends the warmth of a neighborhood haunt with the refinement of a world-class hotel — whether you're winding down after a long journey or celebrating something worth toasting.",
    href: "/bar-menu",
    image: img("bar-ember.jpg"),
  },
  restaurant: {
    title: "restaurant Grove & Grain",
    text: "From intimate candlelit dinners to sun-drenched terrace breakfasts, our kitchen tells the story of local ingredients and global inspiration. Each dish is crafted to linger — in flavor, in memory, and in conversation.",
    href: "/restaurant-menu",
    image: img("gallery-dine-1.jpg"),
  },
};

export const GALLERY_PAGE = {
  outdoors: {
    title: "Outdoors",
    text: "Where terracotta walls meet open skies — our outdoor spaces are as much a part of the experience as the food itself. Dine beneath ancient olive trees, linger over breakfast on sun-warmed stone, and let the garden set the mood.",
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
    title: "Wine & Dine",
    text: "Exposed timber beams, warm lantern light, and tables set with quiet intention — our dining rooms are spaces where time slows and conversation flows. Each venue carries its own character, united by a shared commitment to exceptional food and genuine hospitality.",
    images: [
      img("bar-ember.jpg"),
      img("gallery-dine-1.jpg"),
      img("restaurant-grove.jpg"),
      img("gallery-dine-2.jpg"),
    ],
  },
  events: {
    title: "events",
    text: "From sun-filled celebrations beneath the pergola to candlelit evenings in the courtyard, our estate provides an extraordinary setting for moments that matter. Every event is shaped around you — your guests, your vision, your story.",
    images: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => img(`gallery-events-${n}.jpg`)),
  },
};

export const RESERVE_PAGE = {
  intro: {
    title: "YOUR STAY STARTS HERE",
    text: "Whether you're planning a weekend escape or a longer retreat, securing your room is just the beginning. Fill in your details below and our team will ensure every aspect of your stay is taken care of.",
  },
  roomOptions: ["Double Deluxe", "Superior", "Family Suite"],
};

export const MENU: MenuCategory[] = [
  {
    title: "Starters",
    items: [
      { name: "CHEFS SOUP OF THE DAY", description: "Contains allergens", price: "12" },
      {
        name: "SPINACH AND ARTICHOKE DIP",
        description: "Tortilla chips | Salsa | Sour cream",
        price: "15",
      },
      {
        name: "STRACCIATELLA BREAD",
        description: "Warm ricotta dip | Extra virgin olive oil | Olive tapenade",
        price: "18",
      },
      {
        name: "HEARTS OF ROMAINE SALAD",
        description: "Romaine | Caesar dressing | Shaved parmesan | Ciabatta croutons",
        price: "11",
      },
      { name: "ADD PROTEIN", description: "Grilled shrimp | Grilled chicken", price: "22" },
      {
        name: "MOHONK HOUSE SALAD",
        description: "Artisan lettuce | Tomatoes | Carrots | Cucumbers | Lemon dijon dressing",
        price: "13",
      },
    ],
  },
  {
    title: "SANDWICHES",
    items: [
      {
        name: "HOUSE HALF POUND BEEF BURGER",
        description: "Cheese | House Burger sauce | Red onion jam",
        price: "32",
      },
      {
        name: "VEGETARIAN BURGER",
        description: "Cheese | Caramelized onions | Portobello mushroom",
        price: "29",
      },
      {
        name: "CRISPY KOREAN STYLE CHICKEN SANDWICH",
        description: "Kimchee coleslaw | Bread & butter pickles | Gochujang aioli",
        price: "27",
      },
      {
        name: "CHICKEN QUESADILLA",
        description: "Roasted chilies | Pepperjack cheese",
        price: "25",
      },
    ],
  },
  {
    title: "DESSERTS",
    items: [
      {
        name: "CHOCOLATE CRÉMEUX",
        description: "Vanilla sabayon | Apricots | Strawberries",
        price: "15",
      },
      { name: "BASQUE CHEESECAKE", description: "Sabayon | Orange syrup", price: "15" },
      {
        name: "TIRAMISU",
        description: "Espresso sabayon | Chocolate covered espresso beans",
        price: "15",
      },
      {
        name: "WARM CITRUS BREAD PUDDING",
        description: "Orange syrup | Vanilla ice cream",
        price: "15",
      },
      { name: "HOUSE MADE ICE CREAM", description: "Gluten-free", price: "9" },
    ],
  },
];

export const LEGAL_UPDATED = "Last Updated: February 2026";

export const TERMS: LegalBlock[] = [
  {
    title: "Reservations & Payment",
    paragraphs: [
      "All bookings are confirmed upon receipt of a confirmation email. Payment is required at the time of booking via credit card or other accepted methods. Rates are subject to availability and applicable taxes.",
    ],
  },
  {
    title: "Check-In & Check-Out",
    paragraphs: [
      "Check-in: 3:00 PM Check-out: 11:00 AM Valid photo ID and credit card required at check-in Guests must be 18 years or older",
    ],
  },
  {
    title: "Cancellation Policy",
    paragraphs: [
      "Free cancellation up to 48 hours before arrival. Cancellations made within 48 hours or no-shows will be charged one night's accommodation. Non-refundable rates are not eligible for cancellation.",
    ],
  },
  {
    title: "Guest Responsibilities",
    paragraphs: [
      "Guests agree to respect other visitors and hotel property. Smoking is prohibited indoors. Any damages to rooms or facilities will be charged to the guest's account. Pets are allowed only in designated pet-friendly rooms.",
    ],
  },
  {
    title: "Liability",
    paragraphs: [
      "The hotel is not responsible for lost or stolen personal belongings. We recommend using in-room safes for valuables. Our liability is limited to the total booking amount.",
    ],
  },
  {
    title: "Privacy",
    paragraphs: [
      "Your personal information is collected and used in accordance with our Privacy Policy and applicable data protection laws.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: ["For questions about these terms, please contact us at:"],
    contact: [
      { label: "Email:", value: "info@hotellia.com", href: "mailto:info@hotellia.com" },
      { label: "Phone:", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
    ],
  },
];

export const PRIVACY: LegalBlock[] = [
  {
    title: "Information We Collect",
    paragraphs: [
      "We collect information you provide when making a reservation, including your name, email address, phone number, payment details, and any special requests or preferences. We may also collect information about your stay and use of our facilities.",
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: ["Your information is used to:"],
    list: [
      "Process and manage your reservations",
      "Communicate with you about your booking",
      "Provide personalized services during your stay",
      "Process payments and prevent fraud",
      "Send promotional offers (with your consent)",
      "Improve our services and guest experience",
    ],
  },
  {
    title: "Information Sharing",
    paragraphs: [
      "We do not sell your personal information. We may share your data with trusted third-party service providers who assist in operating our hotel (payment processors, booking platforms, etc.). We may also disclose information when required by law.",
    ],
  },
  {
    title: "Data Security",
    paragraphs: [
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Payment information is encrypted and processed through secure channels.",
    ],
  },
  {
    title: "Your Rights",
    paragraphs: ["You have the right to:"],
    list: [
      "Access the personal data we hold about you",
      "Request corrections to inaccurate information",
      "Request deletion of your data (subject to legal requirements)",
      "Opt out of marketing communications at any time",
      "Object to certain processing of your data",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "Our website uses cookies to enhance your browsing experience and analyze site usage. You can control cookie settings through your browser preferences.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We retain your information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.",
    ],
  },
];

/** Títulos "fit text" de los heroes: viewBox medido en la fuente. */
export const HERO_TITLES = {
  rooms: { text: "ROOMS", width: 1200, height: 274 },
  gallery: { text: "GALLERY", width: 1200, height: 227 },
  reserve: { text: "RESERVE", width: 1200, height: 234 },
  wineDine: { text: "WINE & DINE", width: 2076, height: 274 },
  barMenu: { text: "BAR MENU", width: 1200, height: 195 },
  restaurantMenu: { text: "RESTAURANT MENU", width: 1200, height: 104 },
  terms: { text: "TERMS & CONDITIONS", width: 1200, height: 92 },
  privacy: { text: "PRIVACY POLICY", width: 1200, height: 127 },
  brand: { text: "HOTELLIA", width: 1408, height: 234 },
};
