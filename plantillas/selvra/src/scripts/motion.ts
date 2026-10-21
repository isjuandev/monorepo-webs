/**
 * Movimiento ligado al scroll, medido en la fuente (Framer, sin smooth scroll):
 * - `[data-parallax]`: desplaza el elemento `factor` px por px de scroll mientras el hero es visible
 *   (fotos del hero +0,1 · logotipo −0,15).
 * - `[data-materials]`: fundido de las fotos del escenario fijo según la posición de cada texto.
 *   Con movimiento reducido el cambio es instantáneo, como en la fuente.
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const FADE_START = 0.72;
const FADE_DISTANCE = 96;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function updateParallax(): void {
  const scrollY = window.scrollY;
  for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    if (reduceMotion.matches || scrollY > window.innerHeight * 1.5) {
      if (reduceMotion.matches) el.style.translate = "";
      continue;
    }
    const factor = Number(el.dataset.parallax) || 0;
    el.style.translate = `0 ${(scrollY * factor).toFixed(1)}px`;
  }
}

function updateMaterials(): void {
  const vh = window.innerHeight;
  for (const scene of document.querySelectorAll<HTMLElement>("[data-materials]")) {
    const steps = [...scene.querySelectorAll<HTMLElement>("[data-material-step]")];
    const photos = [...scene.querySelectorAll<HTMLElement>("[data-material-photo]")];
    const progress = steps.map((step, index) => {
      if (index === 0) return 1;
      const top = step.getBoundingClientRect().top;
      const raw = clamp((vh * FADE_START - top) / FADE_DISTANCE, 0, 1);
      return reduceMotion.matches ? Math.round(raw) : raw;
    });
    photos.forEach((photo, index) => {
      if (index === 0) return;
      const next = progress[index + 1] ?? 0;
      photo.style.opacity = String(progress[index] * (1 - next));
    });
  }
}

let ticking = false;
function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateParallax();
    updateMaterials();
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
reduceMotion.addEventListener("change", onScroll);
onScroll();
