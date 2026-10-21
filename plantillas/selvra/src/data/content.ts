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
    alt: "A stone and timber pavilion above the lake, reached by a curving gravel path in daylight.",
  },
  stoneDetail: {
    src: IMAGES.stone,
    alt: "Oak boards meeting a dry-stone wall and a weathered granite boulder.",
  },
} satisfies Record<string, ImageAsset>;

export const STAYS: Stay[] = [
  {
    slug: "stone-suite",
    name: "Stone Suite",
    guests: "2 guests",
    area: "42 m²",
    summary: "A calm room set against the rock, with the lake filling the window.",
    amenities: "King bed · private terrace · walk-in shower",
    image: {
      src: IMAGES.stay1,
      alt: "A linen-dressed bed beside an oak wall and floor-to-ceiling glass facing the lake.",
    },
    sections: [
      {
        title: "Room to breathe",
        text: "Morning light travels slowly across the stone wall. An oak bed, soft linen and a covered terrace keep the room simple, so the view can do the talking.",
      },
      {
        title: "Shaped for two",
        text: "Sleeping and sitting areas share one level. A bathroom tucked behind the stone keeps things quiet, and the terrace opens straight onto the valley.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "morning-trail",
  },
  {
    slug: "forest-house",
    name: "Forest House",
    guests: "4 guests",
    area: "86 m²",
    summary: "A roomy house for long breakfasts and evenings around the fire.",
    amenities: "Two bedrooms · full kitchen · fireplace",
    image: {
      src: IMAGES.stay2,
      alt: "An oak living room with a stone fireplace and wide windows onto the woods.",
    },
    sections: [
      {
        title: "Space to spread out",
        text: "One open room for cooking, reading and settling by the fire. Warm oak and deep window seats frame a wide view of trees and water.",
      },
      {
        title: "Made for sharing",
        text: "Two separate bedrooms suit a small family or a few friends. The house has its own kitchen, one bathroom and a terrace for eating outside.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "fire-supper",
  },
  {
    slug: "courtyard-loft",
    name: "Courtyard Loft",
    guests: "2 guests",
    area: "58 m²",
    summary: "A bright two-level hideaway wrapped around a small walled garden.",
    amenities: "Mezzanine bed · courtyard · kitchenette",
    image: {
      src: IMAGES.stay3,
      alt: "A double-height oak interior opening onto a planted courtyard.",
    },
    sections: [
      {
        title: "A world apart",
        text: "Tall windows pour daylight onto oak floors. The planted courtyard offers a closer view, near enough to follow the seasons leaf by leaf.",
      },
      {
        title: "Two levels of light",
        text: "The sleeping mezzanine looks down over a living area with a kitchenette. A staircase links both floors, so the loft is not step-free.",
      },
    ],
    galleryImage: SHARED_PHOTOS.pavilionDay,
    relatedExperience: "clay-stillness",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    slug: "morning-trail",
    name: "Morning trail",
    duration: "90 minutes",
    category: "Outdoors · easy guided walk",
    summary: "Walk the stone paths above the water while the day is still waking up.",
    note: "Bring comfortable shoes, water and a light layer. The path has uneven steps and is not step-free. Weather can change the plan.",
    image: {
      src: IMAGES.experience1,
      alt: "Stone steps climbing a wooded slope above a still lake at sunrise.",
    },
    sections: [
      {
        title: "Set off gently",
        text: "Leave the terrace in the low early light and follow a short loop through woodland and bare rock, with time to pause, listen and look out over the lake.",
      },
      {
        title: "At an easy pace",
        text: "The route includes a few gentle climbs and some steps. Distance, meeting point and suitability are confirmed by the hosts before you book.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "stone-suite",
  },
  {
    slug: "clay-stillness",
    name: "Clay & stillness",
    duration: "2 hours",
    category: "Indoors · small-group workshop",
    summary: "Set the phone aside and let your hands shape something simple.",
    note: "No experience needed. Wear clothes that can handle a little clay. The hosts confirm firing, collection and access in advance.",
    image: {
      src: IMAGES.experience2,
      alt: "Handmade clay bowls and tools resting on an oak worktable.",
    },
    sections: [
      {
        title: "Shaped by hand",
        text: "Start with a lump of clay and a few tools. Feel the surface, form a small vessel and keep the marks your fingers leave behind.",
      },
      {
        title: "Room to play",
        text: "This is a slow, creative afternoon rather than a class with a finished piece to take home. The hosts arrange the practical details.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "courtyard-loft",
  },
  {
    slug: "fire-supper",
    name: "Fire supper",
    duration: "2½ hours",
    category: "Outdoors · shared seasonal table",
    summary: "Gather at a long table while the lake fades into the evening.",
    note: "Mention any dietary needs in your enquiry. The hosts confirm allergens, menu, weather plans and access before booking.",
    image: {
      src: IMAGES.experience3,
      alt: "A lantern-lit table set beside a small fire overlooking the lake at dusk.",
    },
    sections: [
      {
        title: "Linger into the evening",
        text: "A small fire, a few dishes from the season and plenty of time to talk. The terrace changes mood as the daylight goes and the lamps come on inside.",
      },
      {
        title: "No need to hurry",
        text: "Supper is served at one shared table. The photos show a possible setting rather than a fixed menu or a scheduled event.",
      },
    ],
    galleryImage: SHARED_PHOTOS.stoneDetail,
    relatedStay: "forest-house",
  },
];

export const HOME = {
  seo: {
    description:
      "Quiet architecture, three distinct stays and slow experiences above the lake. A sample retreat website.",
  },
  hero: {
    wordmark: "ARVENNA",
    title: "Room for a slower day.",
    cta: { label: "Explore stays", href: "/stays" },
    imageAlt: "A stone and timber pavilion above a lake, approached by a curving gravel path.",
    moodCaption: "One place. Two moods.",
    day: "Day",
    evening: "Evening",
    dayImage: IMAGES.heroDay,
    eveningImage: IMAGES.heroEvening,
    /** Silueta en blanco del primer plano (mismo encuadre que las fotos) */
    mask: IMAGES.heroMask,
  },
  materials: [
    {
      label: "01 / THE GROUND",
      title: "Stone.",
      text: "Set into the hillside rather than placed on top of it. Granite gives every room its quiet sense of belonging.",
      image: SHARED_PHOTOS.stoneDetail,
    },
    {
      label: "02 / THE WARMTH",
      title: "Wood.",
      text: "Oak, washed linen and the glow of a fire. Rooms made for mornings with nothing planned.",
      image: {
        src: IMAGES.stay2,
        alt: "An oak-lined living room opening to trees and distant hills.",
      },
    },
    {
      label: "03 / THE VIEW",
      title: "Open space.",
      text: "Past the glass, the lake pulls your eye towards the horizon. Stay a little longer.",
      image: {
        src: IMAGES.heroEvening,
        alt: "A low stone pavilion looking out across the lake at sunset.",
      },
    },
  ] satisfies MaterialStep[],
  stays: {
    label: "YOUR OWN RHYTHM",
    title: "Three ways to settle in.",
  },
  moments: {
    label: "SMALL MOMENTS",
    title: "A day with room in it.",
    featured: "fire-supper",
    others: ["morning-trail", "clay-stillness"],
  },
  faq: {
    title: "A few things to know.",
    items: [
      {
        question: "Can I book a stay?",
        answer:
          "This is a sample website: the rooms, rates and dates are placeholders. Replace this answer with how guests can book with you.",
      },
      {
        question: "What happens to my enquiry?",
        answer:
          "The enquiry page builds a draft in your browser that you can copy or send by email. Nothing is stored, and reloading the page clears it.",
      },
      {
        question: "How do I choose a space?",
        answer:
          "Compare guests, size and amenities on the Stays page. Each stay page describes its layout and suggests an experience to pair with it.",
      },
      {
        question: "Can this become a real hospitality website?",
        answer:
          "Yes. Swap the sample text and photos for your own, add your real contact details and connect the enquiry to your inbox or booking tool.",
      },
    ] satisfies Faq[],
  },
  cta: {
    title: "What would your slower day look like?",
    button: { label: "Create a draft", href: "/enquire" },
  },
};

export const PAGES = {
  stays: {
    label: "STAYS",
    title: "Room to slow down.",
    text: "Three distinct spaces, one considered place. Find the one that feels like yours.",
    seoTitle: "Stays",
    description:
      "Compare the Stone Suite, Forest House and Courtyard Loft by guests, size and amenities.",
  } satisfies PageIntro,
  experiences: {
    label: "EXPERIENCES",
    title: "Less on the agenda. More in the moment.",
    text: "A trail, a lump of clay, a table by the fire. Simple ways to spend a day well.",
    seoTitle: "Experiences",
    description:
      "A sunrise trail, a clay workshop and supper by the fire: three unhurried ways to spend the day.",
  } satisfies PageIntro,
  place: {
    label: "PLACE",
    title: "Built to belong.",
    text: "Stone, timber and daylight. A quiet conversation between building and landscape.",
    seoTitle: "The place",
    description: "The stone, oak and lakeside landscape that shape the retreat.",
    heroImage: {
      src: IMAGES.place,
      alt: "A glass and oak pavilion overlooking a wooded lake valley.",
    },
    story: {
      title: "Close to the landscape. Far from the rush.",
      paragraphs: [
        "The retreat sits on a wooded slope above a lake. A low pavilion meets the rock, a separate forest house looks out over long views, and a two-level loft turns inward to its own garden.",
        "Natural stone, warm oak and wide glazing tie the buildings together, leaving room for shifting light, slow mornings and ordinary moments that feel a little less rushed.",
      ],
      image: {
        src: IMAGES.stone,
        alt: "Close-up of oak, glass and stone in warm side light.",
      },
    },
    journey: {
      title: "The journey is part of the stay.",
      paragraphs: [
        "Use this space for clear directions: how to arrive, where to park, transfer options and realistic travel times from the nearest town or airport.",
        "The grounds include stone paths, steps and sloping terrain. Describe step-free routes and access to each room accurately, and invite guests to ask about their needs.",
      ],
      cta: { label: "Explore the stays", href: "/stays" },
    },
  },
  enquire: {
    label: "ENQUIRE",
    title: "Start with a little possibility.",
    text: "Pick a stay, picture a few days and put your plans into words.",
    seoTitle: "Enquiry",
    description:
      "Build an enquiry draft for a stay or experience, then copy it or send it by email.",
  } satisfies PageIntro,
  demo: {
    label: "ABOUT",
    title: "A place imagined. A website to make yours.",
    text: "This is a sample retreat. The site shows an editable hospitality website, not an operating hotel.",
    seoTitle: "About this website",
    description:
      "What this sample retreat website includes, how to adapt it and what to prepare before going live.",
    sections: [
      {
        title: "A sample place",
        text: "The retreat, its stays, experiences and photographs are illustrative. They do not describe a real hotel, operator, address or offer.",
      },
      {
        title: "What the website includes",
        text: "A home page, stay and experience listings with detail pages, a page about the place, an enquiry draft and two text pages like this one.",
      },
      {
        title: "Make it your own",
        text: "Replace the stays, experiences and photos with your own. Adjust the shared colours and fonts, and keep each stay's slug in sync with the enquiry options.",
      },
      {
        title: "Before going live",
        text: "Connect the enquiry to a real inbox or booking tool and test it. Add your business identity, legal and privacy information, access details and booking terms.",
      },
      {
        title: "Delivery",
        text: "Hosting, domain and analytics belong to the final owner. This page makes no claim of completed bookings or verified guest reviews.",
      },
    ] satisfies TextBlock[],
  },
  privacy: {
    label: "PRIVACY",
    title: "Your words stay with you.",
    text: "The enquiry page is a local drafting tool. It does not send what you type.",
    seoTitle: "Privacy",
    description: "How the enquiry draft uses temporary memory and your clipboard.",
    sections: [
      {
        title: "The enquiry draft",
        text: "Your entries stay in this tab's memory. They are not sent to a server and are not saved in browser storage. Creating a draft is not a booking.",
      },
      {
        title: "Copying and sending",
        text: "Copying places the draft on your clipboard at your request. Sending by email opens your own mail app with the draft ready. Reloading the page clears it.",
      },
      {
        title: "Website delivery",
        text: "Our hosting provider serves this website and its files. Visiting any page involves ordinary technical requests such as your IP address and browser type.",
      },
      {
        title: "For the operator",
        text: "Replace this text with the privacy information for your business, hosting, analytics and forms before welcoming real guests.",
      },
    ] satisfies TextBlock[],
  },
};

export const DETAIL = {
  stay: {
    kicker: "An Arvenna stay",
    relatedTitle: "Make a little time for this.",
    relatedText: "Keep exploring the retreat.",
  },
  experience: {
    kicker: "An Arvenna experience",
    relatedTitle: "A place to return to.",
    relatedText: "Keep exploring the retreat.",
  },
  glanceTitle: "At a glance",
  glanceNote: "Sample listing. No live availability or booking.",
};

export const FOOTER = {
  title: "Make space for a slower day.",
  note: "A sample place. A considered website. No stays or experiences can be booked here.",
  aboutLink: { label: "About this website", href: "/demo" },
};

export const NOT_FOUND = {
  label: "404",
  title: "This path leads nowhere.",
  text: "The page you are looking for has moved or never existed. Head back and start again.",
  seoTitle: "Page not found",
  cta: { label: "Back to home", href: "/" },
};

export const UI_LABELS = {
  skipToContent: "Skip to content",
  mainNav: "Main",
  footerNav: "Footer",
  homeLink: "Home",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  allStays: "All stays",
  allExperiences: "All experiences",
  exploreStay: "Explore this stay",
  exploreExperience: "Explore this experience",
  createEnquiry: "Create an enquiry draft",
  selected: "Selected",
  staySelector: "Choose a stay",
  moodGroup: "Light",
  checkmark: "✓",
  faq: "Questions and answers",
  form: {
    notice: "Sample form: create an enquiry draft. Nothing will be sent.",
    choice: "Stay or experience",
    choose: "Please choose",
    arrival: "Arrival",
    departure: "Departure",
    guests: "Guests",
    name: "Name",
    email: "Email",
    message: "Message (optional)",
    required: "*",
    submit: "Create enquiry draft",
    errorRequired: "Please complete this field.",
    errorEmail: "Please enter a valid email address.",
    errorGuests: "Please enter at least 1 guest.",
    errorDates: "Departure must be after arrival.",
    ready: "Your draft is ready. Nothing has been sent or booked.",
    draftLabel: "Your enquiry draft",
    copy: "Copy text",
    copied: "Copied to clipboard",
    copyFailed: "Copying is not available. Select the text and copy it manually.",
    copyHint: "You can also select and copy the draft below.",
    sendEmail: "Send by email",
    draftTitle: "Enquiry draft — not sent",
    draftChoice: "Stay or experience",
    draftDates: "Requested dates",
    draftGuests: "Guests",
    draftName: "Name",
    draftEmail: "Email",
    emailSubject: "Enquiry",
  },
};
