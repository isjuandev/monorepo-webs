# CMS interno: seguimiento de la implementación

> Lo mantiene el orquestador (ver [02-orquestacion.md](./02-orquestacion.md)). Estados:
> `pendiente` / `en curso` / `verificando` / `hecha` / `bloqueada`.

## Fase 0: cimientos (rama `feat/cms-fase-0`)

| Tarea | Descripción | Estado | Dictamen |
| :-- | :-- | :-- | :-- |
| 0.1 | Workspaces `apps/cms` (`@apps/cms`) y `apps/cms-core` (`@repo/cms-core`); `apps/*` en `pnpm-workspace.yaml`; comprobar `turbo prune` de `docker/Dockerfile` | hecha | APROBADO (1.ª). `@astrojs/node@11.1.13`. Prune y build de la-guaca simulados sin `apps/` (no hay Docker en local) |
| 0.2 | Regla nueva en `verify-isolation`: ningún sitio ni `packages/*` depende de `@apps/*` o `@repo/cms-core` ni importa desde `apps/` | hecha | APROBADO (1.ª). Cubre deps (3 claves) e imports estáticos, dinámicos y relativos; sin falsos positivos con `webapps/` |
| 0.3 | Extraer `optimize-assets` a `scripts/lib/assets.mjs` (el script queda como envoltorio) | hecha | CAMBIOS (1.ª): `rejectSvg` no cubría `favicon.svg`/`apple-touch-icon.svg` → APROBADO (2.ª). CLI idéntico byte a byte a HEAD. Cambio menor: un error inesperado ahora sale como `✖ Error` con código 1 |
| 0.4–0.5 | Exponer `paths` (→ `sitios`), `brief` (→ `markdown`) y `assets` (→ `activos`) desde `@repo/cms-core` con `.d.mts` tipados | hecha | 2.ª vuelta abierta por el orquestador: en el bundle, ROOT_DIR apuntaba a `apps/cms/dist` → `CMS_REPO_DIR`; sharp declarado; sin `allowImportingTsExtensions` en cms-core → APROBADO (2.ª). No se exponen `listSiteFolders`, `toWebp` ni `toOgImage` |
| 0.6 | Extraer `new-client-site` a `scripts/lib/new-site.mjs` (sin efectos al importar) | hecha | APROBADO (1.ª). Equivalencia idéntica, también en el camino completo y en `plantilla:probe`. `execFileSync` con arrays y comprobación de rutas (§11.6) |
| 0.7a | Autenticación, lógica pura con `node:test`: entorno, `scrypt`, sesiones, firma, CSRF y límite de intentos | hecha | CAMBIOS (1.ª): la cota de lectura del hash no cuadraba con `maxmem` → APROBADO (2.ª), con endurecimientos (hash ficticio constante, máx. 2 usuarios, trim, NFC, tope del limitador) |
| 0.7b | Autenticación, integración HTTP: middleware, `/login`, endpoints de sesión, CSP y cabeceras, `/healthz` | hecha | CAMBIOS (1.ª): login roto en navegador (favicon → cookie CSRF), carrera TOCTOU en el limitador y sin tope de cuerpo → APROBADO (2.ª). 63 pruebas; E2E en Chrome; sin bypass con 40 POST paralelos; 400 MB → 413 |
| 0.8 | `docker/Dockerfile.cms`, `docker/cms-entrypoint.sh` y ficha de Coolify (sin desplegar) | hecha | CAMBIOS (1.ª): un clon fallido dejaba el repo sin HEAD; pnpm en la caché de corepack de root → APROBADO (2.ª). Sin build real (no hay Docker): simulación y stubs |
| 0.9 | Watch Paths de los clientes: `docker/**` → `docker/Dockerfile` + `docker/nginx.conf` (ficha de `client-run.mjs`, guía 03, README del CMS) | hecha | APROBADO (1.ª). Ya no queda `docker/**` como Watch Path de sitios |
| 0.10 | Pruebas de apps/cms en turbo (`pnpm test`), en `pnpm verify` y en CI | hecha | CAMBIOS (1.ª): un cambio en `apps/cms-core/src` no invalidaba la caché de `@apps/cms#test` (lo mismo en `#build`) → APROBADO (2.ª). Riesgo Node 22: sin sintaxis problemática; el symlink se resuelve por realpath, aún sin probar con Node 22 |

Criterios de la fase (§15): login funcional con 2 usuarios; `/healthz` verde; `pnpm cliente:*` sigue igual;
un cambio en `apps/` no redespliega ningún cliente; `docker/Dockerfile` sigue construyendo un sitio.

### Punto de control de la Fase 0 (2026-11-15), decisiones del usuario

- Watch Paths: afinar `docker/**` (0.9). El usuario actualizará a mano las apps que ya existen en Coolify.
  Los cambios en `pnpm-lock.yaml`, `package.json` y `turbo.json` siguen redesplegando los clientes (riesgo aceptado).
- Pruebas: integrarlas en turbo y CI (0.10).
- Git: commit y PR de `feat/cms-fase-0` contra `main`.

### Pendientes que pasan a fases siguientes

- Probar con Node 22 (CI) y hacer el primer build real de `Dockerfile.cms` en Coolify.
- Identidad git (`user.name`/`user.email`) en el contenedor antes de la Fase 2.
- Fase 2: tope de cuerpo por ruta para las subidas (hoy 8 KiB global; en multipart, CSRF solo por cabecera);
  `log` de `generateSite` no captura la salida de los subprocesos; aislamiento real del agente (§11.3).
- Cabeceras de seguridad y timeouts también en Traefik (las respuestas previas al middleware no las llevan).
- Con Cloudflare en modo proxy delante del CMS, revisar `resolveClientIp` (CF-Connecting-IP).

### Notas de investigación (Haiku)

- `scripts/lib/paths.mjs` y `scripts/lib/brief.mjs` ya eran importables y no tenían efectos al importarse.
- `scripts/optimize-assets.mjs` y `scripts/new-client-site.mjs` ejecutaban su lógica al cargarse; ahora son envoltorios.
- `verify-isolation.mjs` recorre `packages/` y los sitios; ahora también vigila las dependencias hacia `apps/`.
