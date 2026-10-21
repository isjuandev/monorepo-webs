import Lenis from "lenis";

/**
 * Movimiento global del sitio, medido en la fuente (Framer):
 * - Smooth scroll con Lenis (`duration: 1.5`, intensidad 15 del componente de Framer).
 * - `[data-scroll-shift]`: desplaza el elemento hacia arriba en proporción al scroll
 *   (`factor` px por px de scroll, con tope `data-scroll-max`).
 * - `[data-fold]`: hoja que se despliega (rotateX -90° → 0°) mientras su borde superior
 *   pasa del 100 % al 33 % del viewport.
 * - `[data-parallax-y]`: imagen interior que sube hasta N px mientras el contenedor cruza el viewport.
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

function applyScrollEffects(): void {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;

  for (const el of collect("[data-scroll-shift]")) {
    const factor = Number(el.dataset.scrollShift) || 0;
    const max = Number(el.dataset.scrollMax) || Number.POSITIVE_INFINITY;
    el.style.transform = `translate3d(0, ${-Math.min(scrollY * factor, max)}px, 0)`;
  }

  for (const el of collect("[data-fold]")) {
    const anchor = el.parentElement ?? el;
    const top = anchor.getBoundingClientRect().top + el.offsetTop;
    const progress = clamp((vh - top) / (vh * (2 / 3)), 0, 1);
    el.style.transform = `perspective(1200px) rotateX(${(-90 * (1 - progress)).toFixed(2)}deg)`;
  }

  for (const el of collect("[data-parallax-y]")) {
    const box = el.parentElement?.getBoundingClientRect();
    if (!box) continue;
    const distance = Number(el.dataset.parallaxY) || 0;
    const progress = clamp((vh - box.top) / vh, 0, 1);
    el.style.transform = `translate3d(0, ${(-distance * progress).toFixed(2)}px, 0)`;
  }
}

function init(): void {
  if (reduceMotion) {
    for (const el of collect("[data-fold]")) el.style.transform = "none";
    return;
  }

  lenis = new Lenis({ duration: 1.5 });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  lenis.on("scroll", applyScrollEffects);
  window.addEventListener("resize", applyScrollEffects, { passive: true });
  applyScrollEffects();
}

init();
