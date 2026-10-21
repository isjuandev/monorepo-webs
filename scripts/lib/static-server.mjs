#!/usr/bin/env node

// Servidor estático mínimo para la QA: sirve el dist/ de un sitio como lo hace Nginx en
// producción (ruta → ruta/index.html, 404.html con estado 404). A diferencia de `astro preview`
// es un único proceso, así que Playwright lo detiene al terminar y no quedan servidores huérfanos.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const [distArg, portArg = "4599"] = process.argv.slice(2);
if (!distArg) {
  console.error("Uso: node scripts/lib/static-server.mjs <dist> [puerto]");
  process.exit(1);
}
const root = path.resolve(distArg);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".webmanifest": "application/manifest+json",
};

/** Archivo de dist/ para una ruta, o null (sin salir de root) */
function resolveFile(urlPath) {
  const clean = path
    .normalize(decodeURIComponent(urlPath.split("?")[0]))
    .replace(/^(\.\.[/\\])+/, "");
  const base = path.join(root, clean);
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, `${base}.html`, path.join(base, "index.html")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const server = http.createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");
  const notFound = path.join(root, "404.html");
  const target = file ?? (fs.existsSync(notFound) ? notFound : null);
  if (!target) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(file ? 200 : 404, {
    "Content-Type": TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
  });
  fs.createReadStream(target).pipe(response);
});

server.listen(Number(portArg), () => {
  console.log(`QA: sirviendo ${path.relative(process.cwd(), root)} en http://localhost:${portArg}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
