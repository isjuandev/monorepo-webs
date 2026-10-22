/** Iconos de trazo de la fuente (Phosphor/Lucide de Framer), dibujados en una caja de 24 px. */
export const ICON_PATHS = {
  "arrow-right": "M4 12h16m-6-6 6 6-6 6",
  "arrow-left": "M20 12H4m6-6-6 6 6 6",
  "chevron-left": "m15 6-6 6 6 6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-down": "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12.5 4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M5 9h14M5 15h14",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  pin: "M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 1 1 13 0c0 5.6-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  bed: "M3 18V7m0 7h18v4m0-4v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5M7 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c0-3.3 2.7-6 6-6s6 2.7 6 6m1-16a3.5 3.5 0 0 1 0 7m2 3c2 .8 3 3 3 6",
  area: "M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5",
  sun: "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2.5v2m0 15v2M4.6 4.6l1.4 1.4m12 12 1.4 1.4M2.5 12h2m15 0h2M4.6 19.4 6 18M18 6l1.4-1.4",
  sunrise:
    "M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M12 8V4m0 0-2 2m2-2 2 2M5.6 11.6l1.4 1.4m11.4-1.4L17 13M3 21h18",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  tag: "M3 12.6V4.5A1.5 1.5 0 0 1 4.5 3h8.1a1.5 1.5 0 0 1 1.06.44l6.9 6.9a1.5 1.5 0 0 1 0 2.12l-8.1 8.1a1.5 1.5 0 0 1-2.12 0l-6.9-6.9A1.5 1.5 0 0 1 3 12.6ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  expand: "M4 9V4h5m6 0h5v5M9 20H4v-5m16 0v5h-5",
  plane: "M3 15.5 21 6l-2.5 9.5-5-1.5-2.5 4-1-5.5L3 15.5Z",
  car: "M5 16.5V12l2-5h10l2 5v4.5M5 16.5h14M5 16.5V19m14-2.5V19M8 13.5h.01M16 13.5h.01",
  helicopter:
    "M3 5h14m-7 0v3m-6 4h9a4 4 0 0 1 4 4v1H7a3 3 0 0 1-3-3v-2Zm15 1h3m-12 7v-2m6 2v-2M8 20h10",
  mail: "M3.5 6.5h17v11h-17v-11Zm0 0 8.5 7 8.5-7",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  message: "M4 5h16v11H8l-4 4V5Z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
} as const;

export type IconName = keyof typeof ICON_PATHS;
