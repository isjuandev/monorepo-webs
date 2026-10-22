/**
 * Movimiento ligado al scroll, medido en la fuente (Framer, sin smooth scroll):
 * - `[data-parallax]`: desplaza el elemento `factor` px por px de scroll mientras el hero es visible
 *   (fotos del hero +0,1 · logotipo −0,15).
 * - `[data-materials]`: cuando el centro de un paso cruza el 60 % del viewport, su foto entra en el escenario
 *   fijo con un fundido y zoom suaves (CSS); la saliente queda debajo hasta terminar. Con
 *   movimiento reducido el cambio es instantáneo. Cada texto aparece (fundido + desplazamiento) al entrar en vista.
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const MATERIAL_SWITCH_AT = 0.6;
const MATERIAL_REVEAL_AT = 0.85;
const MATERIAL_LEAVE_MS = 1100;

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

const leaveTimers = new WeakMap<HTMLElement, number>();

function setActivePhoto(photos: HTMLElement[], active: number): void {
  photos.forEach((photo, index) => {
    const isActive = index === active;
    if (isActive === photo.classList.contains("is-active")) return;
    window.clearTimeout(leaveTimers.get(photo));
    photo.classList.toggle("is-active", isActive);
    if (isActive) {
      photo.classList.remove("is-leaving");
      return;
    }
    // La foto saliente se queda debajo hasta que la entrante termina de aparecer.
    photo.classList.add("is-leaving");
    leaveTimers.set(
      photo,
      window.setTimeout(() => photo.classList.remove("is-leaving"), MATERIAL_LEAVE_MS)
    );
  });
}

function updateMaterials(): void {
  const threshold = window.innerHeight * MATERIAL_SWITCH_AT;
  for (const scene of document.querySelectorAll<HTMLElement>("[data-materials]")) {
    const steps = [...scene.querySelectorAll<HTMLElement>("[data-material-step]")];
    const photos = [...scene.querySelectorAll<HTMLElement>("[data-material-photo]")];
    let active = 0;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      if (center <= threshold) active = index;
      if (center <= window.innerHeight * MATERIAL_REVEAL_AT) step.classList.add("is-visible");
    });
    setActivePhoto(photos, active);
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
