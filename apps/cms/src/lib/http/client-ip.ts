export const UNKNOWN_IP = "desconocida";

/**
 * IP del cliente para el límite de intentos.
 * Con trustProxy toma el valor MÁS A LA DERECHA de X-Forwarded-For: es el que añadió nuestro
 * proxy (Traefik de Coolify); los de la izquierda los controla el cliente.
 * Si algún día hay Cloudflare en modo proxy delante, X-Forwarded-For llevará más saltos y la IP
 * real vendrá en CF-Connecting-IP: habrá que revisar esta función.
 * Nunca devuelve una cadena vacía.
 */
export function resolveClientIp(
  clientAddress: string | undefined,
  headers: Pick<Headers, "get">,
  trustProxy: boolean
): string {
  if (trustProxy) {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
      const last = forwarded.split(",").at(-1)?.trim();
      if (last) return last;
    }
  }
  const direct = clientAddress?.trim();
  return direct ? direct : UNKNOWN_IP;
}
