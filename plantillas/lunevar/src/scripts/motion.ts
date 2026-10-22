/**
 * Movimiento de toda la web (medido en la fuente de Framer, sin smooth scroll):
 * - `[data-reveal]`: fundido + subida de 28 px al entrar en vista (una vez; `--reveal-delay` escalona).
 * - `[data-count]`: contadores que suben de 0 a su valor en 1,6 s al entrar en vista.
 * - `[data-words]`: manifiesto palabra a palabra; cada palabra pasa de borrosa a nítida según el
 *   scroll (reversible), como en la fuente.
 * - `[data-parallax]`: desplaza el elemento `factor` px por px de scroll respecto al centro.
 * - `[data-fit-text]`: ajusta el tamaño del logotipo gigante al ancho de su contenedor.
 * Con `prefers-reduced-motion` todo queda en su estado final.
 */
import { formatNumber } from "@/lib/format";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function countUp(el: HTMLElement): void {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix ?? "";
  if (reduceMotion.matches || target === 0) {
    el.textContent = `${formatNumber(target)}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 1600;
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = `${formatNumber(Math.round(target * eased))}${suffix}`;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      if (el.hasAttribute("data-count")) countUp(el);
      el.classList.add("is-visible");
      observer.unobserve(el);
    }
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
);

for (const el of document.querySelectorAll<HTMLElement>("[data-reveal], [data-count]")) {
  observer.observe(el);
}

function updateWords(): void {
  const vh = window.innerHeight;
  for (const word of document.querySelectorAll<HTMLElement>("[data-words] [data-word]")) {
    if (reduceMotion.matches) {
      word.style.opacity = "";
      word.style.filter = "";
      continue;
    }
    const rect = word.getBoundingClientRect();
    const position = rect.top + rect.left * 0.12;
    const progress = Math.min(Math.max((vh * 0.92 - position) / (vh * 0.32), 0), 1);
    word.style.opacity = (0.12 + progress * 0.88).toFixed(3);
    word.style.filter = progress >= 1 ? "" : `blur(${((1 - progress) * 10).toFixed(1)}px)`;
  }
}

function updateParallax(): void {
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    if (reduceMotion.matches) {
      el.style.translate = "";
      continue;
    }
    const parent = el.parentElement ?? el;
    const rect = parent.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > vh + 200) continue;
    const offset = rect.top + rect.height / 2 - vh / 2;
    el.style.translate = `0 ${(offset * (Number(el.dataset.parallax) || 0)).toFixed(1)}px`;
  }
}

function fitText(): void {
  for (const el of document.querySelectorAll<HTMLElement>("[data-fit-text]")) {
    const parent = el.parentElement;
    if (!parent) continue;
    el.style.fontSize = "";
    const available = parent.clientWidth;
    const current = Number.parseFloat(getComputedStyle(el).fontSize);
    const width = el.getBoundingClientRect().width;
    if (width > 0) el.style.fontSize = `${((current * available) / width).toFixed(2)}px`;
  }
}

let ticking = false;
function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateWords();
    updateParallax();
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener(
  "resize",
  () => {
    fitText();
    onScroll();
  },
  { passive: true }
);
reduceMotion.addEventListener("change", onScroll);
document.fonts?.ready.then(fitText);
fitText();
onScroll();
