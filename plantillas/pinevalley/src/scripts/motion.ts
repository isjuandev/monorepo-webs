import Lenis from "lenis";

/**
 * Movimiento global del sitio, medido en la fuente (Framer):
 * - Smooth scroll con Lenis (la fuente monta Lenis en <html>).
 * - `[data-appear]`: entrada al cargar (opacity 0, y 50 → 0) con retardo `data-appear` en s.
 * - `[data-reveal]`: aparición al entrar al 50 % en el viewport, una sola vez.
 * - `[data-scroll-speed]`: parallax del contenido del hero (se desplaza `factor` px por px de scroll).
 * - `[data-parallax]`: imagen interior más alta que su marco que se desplaza mientras el marco
 *   cruza el viewport (de -sobrante/2 a +sobrante/2).
 * - `[data-text-reveal]`: texto que se ilumina carácter a carácter (opacidad 0.2 → 1) entre el
 *   90 % y el 30 % del viewport.
 * - `[data-header]`: se oculta al bajar, reaparece al subir y cambia a variante oscura tras el hero.
 * - `[data-btn-fill]`: el relleno del botón nace en la posición del puntero.
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis: Lenis | null = null;

export function setScrollLocked(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function collect<T extends HTMLElement>(selector: string): T[] {
  return [...document.querySelectorAll<T>(selector)];
}

/* ---------- Texto revelado por caracteres ---------- */

interface TextReveal {
  el: HTMLElement;
  chars: HTMLElement[];
}

function splitChars(el: HTMLElement): TextReveal {
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const chars: HTMLElement[] = [];
  for (const word of text.split(/(\s+)/)) {
    if (/^\s+$/.test(word)) {
      el.append(document.createTextNode(" "));
      continue;
    }
    const wordEl = document.createElement("span");
    wordEl.className = "tr-word";
    wordEl.setAttribute("aria-hidden", "true");
    for (const ch of word) {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.opacity = "0.2";
      wordEl.append(span);
      chars.push(span);
    }
    el.append(wordEl);
  }
  return { el, chars };
}

/* ---------- Efectos ligados al scroll ---------- */

let textReveals: TextReveal[] = [];
let header: HTMLElement | null = null;
let heroEnd = 0;
let lastY = 0;

function measure(): void {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  heroEnd = hero ? hero.offsetTop + hero.offsetHeight : 0;
}

function applyScrollEffects(): void {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  updateHeader(scrollY);
  if (reduceMotion) return;

  for (const el of collect("[data-scroll-speed]")) {
    const factor = Number(el.dataset.scrollSpeed) || 0;
    el.style.setProperty("--scroll-shift", `${(scrollY * factor).toFixed(1)}px`);
  }

  for (const el of collect("[data-parallax]")) {
    const frame = el.parentElement?.getBoundingClientRect();
    if (!frame || frame.bottom < -200 || frame.top > vh + 200) continue;
    const spare = el.offsetHeight - frame.height;
    const progress = clamp((vh - frame.top) / (vh + frame.height), 0, 1);
    el.style.transform = `translate3d(0, ${(-spare + spare * progress).toFixed(1)}px, 0)`;
  }

  for (const { el, chars } of textReveals) {
    const box = el.getBoundingClientRect();
    if (box.bottom < 0 || box.top > vh) continue;
    // Progreso: 0 cuando el bloque está en el 90 % del viewport, 1 cuando llega al 30 %.
    const start = vh * 0.9;
    const end = vh * 0.3;
    const progress = clamp((start - box.top) / (start - end + box.height * 0.5), 0, 1);
    const lit = progress * chars.length;
    chars.forEach((span, i) => {
      span.style.opacity = String(clamp(0.2 + (lit - i) * 0.8, 0.2, 1));
    });
  }
}

function updateHeader(scrollY: number): void {
  if (header) {
    const goingDown = scrollY > lastY;
    const delta = Math.abs(scrollY - lastY);
    if (scrollY < 80) header.classList.remove("is-hidden");
    else if (delta > 2) header.classList.toggle("is-hidden", goingDown);
    if (heroEnd > 0) header.dataset.variant = scrollY + 65 >= heroEnd ? "dark" : "light";
    lastY = scrollY;
  }
}

/* ---------- Apariciones ---------- */

function initReveals(): void {
  const items = collect("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    for (const el of items) el.classList.add("is-visible");
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.2 }
  );
  for (const el of items) io.observe(el);

  for (const el of collect("[data-appear]")) {
    const delay = Number(el.dataset.appear) || 0;
    window.setTimeout(() => el.classList.add("is-visible"), delay * 1000);
  }
}

function initButtonFill(): void {
  for (const btn of collect("[data-btn-fill]")) {
    btn.addEventListener("pointerenter", (event) => {
      const box = btn.getBoundingClientRect();
      btn.style.setProperty("--fill-x", `${event.clientX - box.left}px`);
      btn.style.setProperty("--fill-y", `${event.clientY - box.top}px`);
    });
  }
}

function init(): void {
  header = document.querySelector<HTMLElement>("[data-header]");
  // Las islas (visor de galería) piden bloquear el scroll sin importar este módulo.
  document.addEventListener("scroll-lock", (event) => {
    setScrollLocked((event as CustomEvent<boolean>).detail);
  });
  initReveals();
  initButtonFill();
  measure();

  if (reduceMotion) {
    window.addEventListener("scroll", applyScrollEffects, { passive: true });
    applyScrollEffects();
    return;
  }

  textReveals = collect("[data-text-reveal]").map(splitChars);

  lenis = new Lenis({ duration: 1.2, anchors: true });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  lenis.on("scroll", applyScrollEffects);
  window.addEventListener(
    "resize",
    () => {
      measure();
      applyScrollEffects();
    },
    { passive: true }
  );
  applyScrollEffects();
}

init();
