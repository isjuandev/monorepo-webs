#!/usr/bin/env node

import { generateSite, NewSiteError, parseArgs, runSiteChecks } from "./lib/new-site.mjs";
import { BASE_TEMPLATE, DEFAULT_TEMPLATE } from "./lib/paths.mjs";

function printUsage() {
  console.log(`
Uso:
  pnpm cliente:nuevo <slug-cliente> [opciones]

Crea clientes/<slug>/ copiando una plantilla de plantillas/ (con --plantilla, crea plantillas/<slug>/).

Ejemplos:
  pnpm cliente:nuevo cafe-aurora --name "Café Aurora" --domain "cafeaurora.co"
  pnpm cliente:nuevo hotel-sol --from hotellia --name "Hotel Sol" --domain "hotelsol.co"

Opciones:
  --slug <slug>              Identificador en kebab-case (ej: cafe-aurora)
  --from <plantilla>         Plantilla de plantillas/ a copiar (por defecto: ${DEFAULT_TEMPLATE};
                             con --plantilla: ${BASE_TEMPLATE}). Conserva diseño, páginas y contenido.
  --plantilla                Crea una plantilla nueva en plantillas/<slug>/ (lo usa plantilla:clonar)
  --name "<Nombre>"          Nombre comercial del cliente
  --domain "<dominio.com>"   Dominio del cliente (sin protocolo)
  --title "<Título SEO>"     Título SEO principal
  --description "<Texto>"    Descripción meta para SEO
  --locale "<locale>"        Configuración regional (por defecto: "es_CO")
  --phone "<teléfono>"       Teléfono de contacto real (opcional)
  --whatsapp "<número>"      Número de WhatsApp real (opcional)
  --email "<correo>"         Correo electrónico de contacto real (opcional)
  --address "<dirección>"    Dirección física real (opcional)
  --skip-checks              Omitir instalación y comprobación inicial (check + build)
  --help, -h                 Mostrar esta ayuda
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.slug) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

let result;
try {
  result = generateSite(args);
} catch (error) {
  if (!(error instanceof NewSiteError)) throw error;
  console.error(error.message);
  process.exit(1);
}

runSiteChecks(result, { skipChecks: args.skipChecks });

console.log(`
\x1b[32m✔ Sitio "${result.brandName}" (${result.packageName}) creado y verificado con éxito.\x1b[0m

Archivos principales:
  - Configuración de dominio y SEO: ${result.siteRel}/src/config/site.ts
  - Estilos y variables de marca:   ${result.siteRel}/src/styles/theme.css
  - Página de inicio:               ${result.siteRel}/src/pages/index.astro
  - Investigación / Referencias:    ${result.siteRel}/docs/

Comandos para trabajar en este cliente:
  pnpm --filter ${result.packageName} dev
  pnpm --filter ${result.packageName} check
  pnpm --filter ${result.packageName} build
`);
