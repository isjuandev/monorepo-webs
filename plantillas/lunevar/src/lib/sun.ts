/**
 * Geometría del arco solar compartida por los diales (portada, "Un día aquí", reloj de la cabecera):
 * convierte horas "HH:MM" en progreso 0–1 entre el amanecer y el atardecer, y el progreso en un
 * punto del semicírculo (0 = horizonte izquierdo, 1 = horizonte derecho).
 */

export function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Progreso del sol entre `sunrise` y `sunset` (puede salir de 0–1 de noche). */
export function sunProgress(time: string | number, sunrise: string, sunset: string): number {
  const now = typeof time === "number" ? time : toMinutes(time);
  const start = toMinutes(sunrise);
  return (now - start) / (toMinutes(sunset) - start);
}

export interface ArcPoint {
  x: number;
  y: number;
}

/** Punto del semicírculo de centro (cx, cy) y radio r para un progreso 0–1. */
export function arcPoint(progress: number, cx: number, cy: number, r: number): ArcPoint {
  const angle = Math.PI * (1 - Math.min(Math.max(progress, 0), 1));
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

/** Trazado SVG del semicírculo completo (de izquierda a derecha). */
export function arcPath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}
