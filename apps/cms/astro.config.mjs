import node from "@astrojs/node";
import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [preact()],
  // Sesiones propias en memoria (src/lib/security/sessions.ts); se apaga el driver en disco.
  session: false,
  // checkOrigin queda activo por defecto en output "server": no desactivar.
  security: {
    // Astro añade los hashes de los scripts y estilos inline. Solo se emite en build/preview.
    csp: {
      algorithm: "SHA-256",
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "base-uri 'none'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
});
