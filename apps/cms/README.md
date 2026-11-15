# @apps/cms

CMS interno de Nexobite. Astro en modo servidor (`@astrojs/node`, standalone). Solo se entra con usuario y contraseña; únicamente `/login`, `/api/sesion/iniciar`, `/healthz` y `/_astro/*` son públicas.

## Arrancar en local

1. Genera el hash de cada contraseña (mínimo 16 caracteres, se lee sin eco):

   ```bash
   pnpm --filter @apps/cms hash-password
   ```

2. Define estas variables de entorno (nunca en Git):

   | Variable | Contenido |
   | :-- | :-- |
   | `CMS_SESSION_SECRET` | Secreto aleatorio de al menos 32 caracteres |
   | `CMS_USER_1` | `<usuario>:<hash>` (usuario en kebab-case) |
   | `CMS_USER_2` | Opcional, mismo formato (máximo 2 usuarios) |
   | `CMS_REPO_DIR` | Ruta **absoluta** del repositorio |
   | `CMS_TRUST_PROXY` | `1` o `0` (por defecto `0`) |
   | `PORT`, `HOST` | Puerto y host del servidor |

3. Compila y arranca:

   ```bash
   pnpm --filter @apps/cms build
   node apps/cms/dist/server/entry.mjs
   ```

Con la configuración inválida el servidor arranca igualmente, pero `/healthz` responde 503 y el resto de rutas también; el motivo (sin valores secretos) queda en el log.

## Notas

- **CSP solo en build.** La cabecera `Content-Security-Policy` la genera Astro con los hashes de lo inline y no funciona en `astro dev`; compruébala con build y `node dist/server/entry.mjs`.
- **`CMS_TRUST_PROXY=1`** hace que la IP del cliente (límite de intentos) sea el último valor de `X-Forwarded-For`, el que añade nuestro proxy (Traefik de Coolify). Con `0` se usa la IP del socket. Actívalo solo detrás de un proxy propio.
- **`CMS_REPO_DIR` debe ser absoluta** y existir; si no, la configuración se rechaza.
- Las cookies son `__Host-` con `Secure`: los navegadores las aceptan también en `http://localhost`.
- Pruebas: `pnpm --filter @apps/cms test`.

## Riesgos aceptados y cabeceras en producción

- **Enumeración por bloqueo.** Un usuario real ve "bloqueado" tras 5 fallos y uno inventado no (el límite por usuario solo se aplica a usuarios existentes para no llenar la memoria con nombres falsos). Se acepta: solo hay 2 usuarios y los nombres no son secretos.
- **Respuestas previas al middleware.** Lo que Astro o el adaptador generan antes del middleware (`/_astro/*`, el 403 de `checkOrigin` en inglés y algunos 301) no lleva nuestras cabeceras de seguridad. En producción las cabeceras también deben ponerse en el proxy (Traefik/Coolify); la ficha de despliegue se hará en la 0.8.
- **Intentos de login.** El intento se reserva en el limitador antes de verificar la contraseña (sin carrera entre peticiones simultáneas). Un login correcto resetea el contador del usuario, pero deja el de la IP.
- **Cuerpos.** Los POST se limitan a 8 KiB (413 si se pasa, por `Content-Length` o cortando la lectura en streaming).
  - En la Fase 2 el tope pasará a ser por ruta: las subidas de imágenes tendrán su propio límite, leído en streaming y solo con sesión; el tope global de 8 KiB quedará para los formularios.
  - El plazo de los POST lentos es hoy el `requestTimeout` por defecto de Node (300 s); conviene acortarlo en el proxy (lo recogerá la ficha de la 0.8).

## Despliegue en Coolify (sin desplegar todavía)

Ficha para crear la app cuando se decida desplegar. La imagen está en `docker/Dockerfile.cms` y el arranque en `docker/cms-entrypoint.sh`. Nada de esto está desplegado ni se ha probado con Docker real (la máquina de desarrollo no lo tiene); la primera construcción en Coolify es la prueba definitiva.

| Campo | Valor |
| :-- | :-- |
| Repositorio · rama | `isjuandev/monorepo-webs` · `main` |
| Build Pack | `Dockerfile` · `/docker/Dockerfile.cms` · Base Directory `/` |
| Dominio | `https://cms.nexobite.com` (HTTPS activo) |
| Puerto · Health check | `4321` · `/healthz` (200 sano, 503 con la configuración inválida) |
| Usuario del contenedor | `cms` (uid 10001, sin privilegios) |

### Volúmenes persistentes

Se montan **dentro** del clon a propósito: `ROOT_DIR/recursos` y `ROOT_DIR/.pipeline` (`scripts/lib/paths.mjs`) caen así en volúmenes propios y no se pierden al recrear el clon. Los montajes anidados son intencionados; créalos como volúmenes con nombre de Coolify (heredan el dueño `cms` de la imagen).

| Ruta en el contenedor | Contenido | Respaldo |
| :-- | :-- | :-- |
| `/data/repo` | Clon del monorepo (se reconstruye desde Git) | No |
| `/data/repo/recursos` | Material original de los clientes | **Sí** (único lugar donde viven) |
| `/data/repo/.pipeline` | Estado y logs del pipeline | No |
| `/data/pnpm-store` | Caché de pnpm | No |

### Variables de entorno

Solo nombres; los valores se escriben en Coolify, nunca en Git. `CMS_REPO_DIR`, `HOST`, `PORT`, `npm_config_store_dir` (almacén de pnpm), `COREPACK_HOME` y `PLAYWRIGHT_BROWSERS_PATH` ya van en la imagen.

| Variable | Secreta | Contenido |
| :-- | :-- | :-- |
| `CMS_SESSION_SECRET` | Sí | Secreto aleatorio de al menos 32 caracteres |
| `CMS_USER_1` | Sí | `<usuario>:<hash>` (`pnpm --filter @apps/cms hash-password`) |
| `CMS_USER_2` | Sí | Opcional, mismo formato |
| `CMS_TRUST_PROXY` | No | `1`: el CMS va detrás de Traefik |
| `CMS_REPO_URL` | No | URL `https` del repositorio (`https://github.com/isjuandev/monorepo-webs.git`), sin credenciales |
| `GH_TOKEN` | Sí | Token fine-grained **solo de este repositorio**, con *Contents* y *Pull requests* (decisión 9) |
| `ANTHROPIC_API_KEY` | Sí | Clave de la API de Anthropic |

Hoy el CMS no lanza el agente. En la Fase 2 el agente correrá con un entorno mínimo, sin `GH_TOKEN` ni el resto de secretos (§11.2 y §11.3 del documento de implementación).

El entrypoint comprueba que existen `node`, `git`, `gh` y `claude`, que `pnpm --version` funciona y que `CMS_REPO_DIR` es absoluta. Si el clon no tiene un `HEAD` válido (primer arranque, o uno anterior que falló), lo hace con `init`/`fetch`/`checkout` (con `GH_TOKEN`, `gh auth setup-git` hace de credential helper; el token nunca va en la URL; `GIT_TERMINAL_PROMPT=0`) y falla si no puede. Con un clon válido solo hace `git fetch --prune` (si falla, avisa y sigue) y no toca la rama ni el árbol de trabajo. El almacén de pnpm vive en otro volumen que el clon, así que pnpm copia los paquetes en lugar de usar hardlinks (más lento y con más disco).

### Watch Paths del CMS

```text
apps/cms/**
apps/cms-core/**
scripts/lib/**
packages/tsconfig/**
docker/Dockerfile.cms
docker/cms-entrypoint.sh
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
turbo.json
```

Las apps de los sitios **no** deben incluir `apps/**` ni `docker/**` en las suyas: la ficha de los clientes (sección 2 de `docs/guias/03-desplegar.md` y la que genera `scripts/client-run.mjs`) usa `docker/Dockerfile` y `docker/nginx.conf`, así que un cambio en `docker/Dockerfile.cms` o en `docker/cms-entrypoint.sh` no redespliega los clientes. Queda como aviso que las apps ya existentes en Coolify hay que actualizarlas a mano (cambiar `docker/**` por esas dos rutas). Los cambios en `pnpm-lock.yaml`, `package.json` o `turbo.json` siguen redesplegando los clientes (riesgo aceptado).

### Cabeceras y límites en el proxy (Traefik de Coolify)

Las respuestas que Astro o el adaptador generan antes del middleware (`/_astro/*`, el 403 de `checkOrigin`, algunos 301) no llevan las cabeceras de seguridad del CMS, y el plazo de los POST lentos es el de Node (300 s). Hay que ponerlas en el proxy, para **todas** las respuestas.

> **Comprobar con la versión de Coolify/Traefik instalada.** Estos ejemplos no se han podido probar aquí; los nombres de los middlewares y el modo de añadir labels (campo *Custom Labels* de la app) pueden variar. Verifica con `curl -sI https://cms.nexobite.com/_astro/<archivo>.js` tras desplegar.

Labels de ejemplo. **Ojo:** la label `traefik.http.routers.<router>.middlewares=...` sustituye a la lista de middlewares que Coolify ya haya puesto en ese router (por ejemplo `gzip` o `redirect-to-https`), no se suma: copia los existentes y AÑADE `cms-seg` y `cms-lim` al final.

```text
traefik.http.middlewares.cms-seg.headers.customResponseHeaders.X-Frame-Options=DENY
traefik.http.middlewares.cms-seg.headers.customResponseHeaders.X-Robots-Tag=noindex, nofollow
traefik.http.middlewares.cms-seg.headers.contentTypeNosniff=true
traefik.http.middlewares.cms-seg.headers.referrerPolicy=no-referrer
traefik.http.middlewares.cms-seg.headers.stsSeconds=31536000
traefik.http.middlewares.cms-seg.headers.stsIncludeSubdomains=false
traefik.http.middlewares.cms-lim.buffering.maxRequestBodyBytes=16384
traefik.http.routers.<router-https>.middlewares=cms-seg,cms-lim
```

- **Límite de cuerpo:** `maxRequestBodyBytes=16384` (16 KiB) cubre los formularios (el CMS ya corta a 8 KiB). Cuando lleguen las subidas de imágenes (Fase 2) habrá que subirlo o dar una ruta aparte.
- **Plazo de lectura del cuerpo:** en el entrypoint de Traefik `entryPoints.<nombre>.transport.respondingTimeouts.readTimeout=30s`. Es configuración **global** del proxy de Coolify (no por app): comprueba si se puede cambiar en *Servers → Proxy → Configuration* y que no afecta a las demás apps.
- `stsIncludeSubdomains` queda en `false` para que HSTS no afecte a los sitios de clientes ni a las vistas previas `*.nexobite.com`.

### Cookie de sesión

La cookie de sesión es `__Host-` y **no lleva el atributo `Domain`**, para que no viaje a las vistas previas `*.nexobite.com` (§12.2). No lo cambies al configurar el proxy.

### Respaldo

Programa un respaldo periódico de `/data/repo/recursos`: los originales de los clientes no están en Git (solo lo que el pipeline sube con `git add -f` en la rama del cliente). Todo lo demás se reconstruye desde Git (§12.3).

### Versiones fijadas en la imagen

Node 22.23.5 (`bookworm-slim`), pnpm 9.15.0, turbo 2.11.7, `@anthropic-ai/claude-code` 2.1.325, Playwright 1.64.0 (debe coincidir con `pnpm-lock.yaml`; al actualizarlo, cambia `PLAYWRIGHT_VERSION` en `docker/Dockerfile.cms`) y `gh` 2.104.0 con el keyring verificado por SHA-256. El repositorio apt de `gh` solo conserva versiones recientes: si la construcción falla por `gh=...`, actualiza `GH_VERSION` (y `GH_KEYRING_SHA256` si GitHub rota la clave).

Más notas de la imagen:

- **Chromium ligado a Playwright.** El Chromium instalado en `/ms-playwright` corresponde a `PLAYWRIGHT_VERSION`. Si el clon en `/data/repo` actualiza `@playwright/test` en el lockfile, el QA no encontrará su navegador hasta que se cambie `PLAYWRIGHT_VERSION` y se reconstruya la imagen.
- **claude-code con pnpm 10.** Con pnpm 10 los scripts de `postinstall` de las dependencias quedan bloqueados; si se sube pnpm, habrá que aprobar el de `@anthropic-ai/claude-code` (`onlyBuiltDependencies` o `pnpm approve-builds`). Con pnpm 9.15 se ejecutan.
- **pnpm sin red.** `COREPACK_HOME=/opt/corepack` (legible por el usuario `cms`) y `COREPACK_ENABLE_NETWORK=0` evitan que corepack intente descargar pnpm en ejecución.
- **Primer arranque lento.** El `HEALTHCHECK` tiene `start-period` de 300 s por el primer clon.
