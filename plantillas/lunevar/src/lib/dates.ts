/** Fechas de calendario sin zona horaria (AAAA-MM-DD) para los planificadores. */

export function toIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromIso(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(iso: string, days: number): string {
  const date = fromIso(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export function nightsBetween(start: string, end: string): number {
  return Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / 86_400_000);
}

export function todayIso(): string {
  return toIso(new Date());
}

const SYNODIC_MONTH = 29.530588853;
// Luna nueva de referencia: 6 de enero de 2000, 18:14 UTC.
const NEW_MOON_REFERENCE = Date.UTC(2000, 0, 6, 18, 14);

/** true si la luna está llena (±0,75 días) al mediodía de esa fecha. */
export function isFullMoon(iso: string): boolean {
  const days = (fromIso(iso).getTime() - NEW_MOON_REFERENCE) / 86_400_000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  return Math.abs(age - SYNODIC_MONTH / 2) < 0.75;
}

/** Celdas del mes (lunes primero): `null` para los huecos antes del día 1. */
export function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= days; day++) cells.push(toIso(new Date(year, month, day, 12)));
  return cells;
}
