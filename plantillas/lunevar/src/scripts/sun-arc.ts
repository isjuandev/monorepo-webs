/**
 * Arcos del sol ligados al scroll (componentes SunArc):
 * - driver "cards": la tarjeta `[data-arc-step]` que cruza el 55 % de la pantalla marca la hora; entre
 *   dos tarjetas el sol se interpola, así que avanza de forma continua y retrocede al subir.
 *   La tarjeta más cercana recibe `.is-active` (superficie sólida).
 * - driver "section": el avance del scroll dentro de la sección `[data-arc-scene]` (escena fija)
 *   lleva el sol del amanecer al atardecer.
 * Con movimiento reducido el sol salta a la tarjeta activa sin interpolar.
 */
import { arcPoint } from "@/lib/sun";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

function render(arc: HTMLElement, progress: number): void {
  const svg = arc.querySelector("svg");
  if (!svg) return;
  const cx = Number(svg.dataset.cx);
  const cy = Number(svg.dataset.cy);
  const r = Number(svg.dataset.r);
  const point = arcPoint(progress, cx, cy, r);
  for (const el of arc.querySelectorAll("[data-dial-sun], [data-dial-glow]")) {
    el.setAttribute("cx", point.x.toFixed(1));
    el.setAttribute("cy", point.y.toFixed(1));
  }
  const fill = arc.querySelector<SVGPathElement>("[data-dial-fill]");
  if (fill) fill.style.strokeDashoffset = (1 - progress).toFixed(4);
  const marks = [...arc.querySelectorAll<SVGGElement>("[data-arc-mark]")];
  let current: SVGGElement | undefined;
  for (const mark of marks) {
    const passed = Number(mark.dataset.arcMark) <= progress + 0.002;
    mark.classList.toggle("is-passed", passed);
    if (passed) current = mark;
    mark.classList.remove("is-current");
  }
  current?.classList.add("is-current");
}

function updateCards(arc: HTMLElement): void {
  const scope = arc.closest<HTMLElement>("[data-arc-scope]");
  const steps = [...(scope?.querySelectorAll<HTMLElement>("[data-arc-step]") ?? [])];
  if (steps.length === 0) return;
  const ref = window.innerHeight * 0.55;
  const centers = steps.map((step) => {
    const rect = step.getBoundingClientRect();
    return rect.top + rect.height / 2;
  });
  const values = steps.map((step) => Number(step.dataset.arcStep) || 0);
  let progress = values[0] ?? 0;
  let active = 0;
  centers.forEach((center, index) => {
    if (center <= ref) {
      active = index;
      const next = centers[index + 1];
      const from = values[index] ?? 0;
      const to = values[index + 1];
      progress =
        next === undefined || to === undefined || reduceMotion.matches
          ? from
          : from + (to - from) * clamp((ref - center) / (next - center));
    }
  });
  const nearest = centers.reduce(
    (best, center, index) =>
      Math.abs(center - ref) < Math.abs((centers[best] ?? 0) - ref) ? index : best,
    active
  );
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === nearest);
  });
  render(arc, progress);
}

function updateSection(arc: HTMLElement): void {
  const scene = arc.closest<HTMLElement>("[data-arc-scene]");
  if (!scene) return;
  const rect = scene.getBoundingClientRect();
  const distance = Math.max(rect.height - window.innerHeight, 1);
  render(arc, clamp(-rect.top / distance));
}

let ticking = false;
function update(): void {
  ticking = false;
  for (const arc of document.querySelectorAll<HTMLElement>("[data-sun-arc]")) {
    if (arc.dataset.driver === "section") updateSection(arc);
    else updateCards(arc);
  }
}

function schedule(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}

window.addEventListener("scroll", schedule, { passive: true });
window.addEventListener("resize", schedule, { passive: true });
update();
