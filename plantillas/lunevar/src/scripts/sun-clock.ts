/**
 * Reloj solar en vivo (cabecera, dial del hero y pie): toma la hora local del visitante y, con el
 * amanecer y el atardecer de `data-sunrise`/`data-sunset`, coloca el sol en su arco. Un mismo
 * marcado sirve para todos los diales: `[data-dial-fill]` (trazo con pathLength=1) y
 * `[data-dial-sun]` (círculo). De noche el arco queda punteado y el sol espera en el horizonte.
 */
import { arcPoint, sunProgress, toMinutes } from "@/lib/sun";

interface Phases {
  dawn: string;
  morning: string;
  noon: string;
  afternoon: string;
  dusk: string;
  night: string;
}

function phaseFor(minutes: number, sunrise: number, sunset: number, phases: Phases): string {
  if (minutes < sunrise - 30 || minutes >= sunset + 60) return phases.night;
  if (minutes < sunrise + 60) return phases.dawn;
  if (minutes < 11 * 60) return phases.morning;
  if (minutes < 14 * 60) return phases.noon;
  if (minutes < sunset - 60) return phases.afternoon;
  return phases.dusk;
}

function placeSun(root: Element, progress: number): void {
  const fill = root.querySelector<SVGPathElement>("[data-dial-fill]");
  const sun = root.querySelector<SVGCircleElement>("[data-dial-sun]");
  const svg = sun?.ownerSVGElement;
  const isDay = progress >= 0 && progress <= 1;
  root.classList.toggle("is-night", !isDay);
  if (fill) fill.style.strokeDashoffset = String(isDay ? 1 - progress : 1);
  if (!sun || !svg) return;
  const { cx, cy, r } = svg.dataset;
  const box = svg.viewBox.baseVal;
  const centerX = Number(cx ?? box.width / 2);
  const centerY = Number(cy ?? box.height - 1);
  const radius = Number(r ?? box.width / 2 - 3);
  const point = arcPoint(isDay ? progress : 0, centerX, centerY, radius);
  sun.setAttribute("cx", point.x.toFixed(2));
  sun.setAttribute("cy", point.y.toFixed(2));
}

function tick(): void {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  for (const clock of document.querySelectorAll<HTMLElement>("[data-sun-clock]")) {
    const { sunrise = "06:00", sunset = "18:00" } = clock.dataset;
    const phases = JSON.parse(clock.dataset.phases ?? "{}") as Phases;
    const timeEl = clock.querySelector("[data-clock-time]");
    const phaseEl = clock.querySelector("[data-clock-phase]");
    if (timeEl) timeEl.textContent = time;
    if (phaseEl)
      phaseEl.textContent = phaseFor(minutes, toMinutes(sunrise), toMinutes(sunset), phases);
    placeSun(clock, sunProgress(minutes, sunrise, sunset));
  }

  for (const dial of document.querySelectorAll<HTMLElement>("[data-live-dial]")) {
    const { sunrise = "06:00", sunset = "18:00" } = dial.dataset;
    placeSun(dial, sunProgress(minutes, sunrise, sunset));
  }
}

tick();
window.setInterval(tick, 30_000);
