---
name: deploy-client
description: Prepare and validate the production deployment configuration for a client website under clientes/<slug-cliente> targeting a VPS (Coolify, Dokploy, or Docker + Nginx) without executing unauthorized live deployments.
---

# Deploy Client (`deploy-client`) — Diseño y Procedimiento

Prepara, verifica y documenta el empaquetado de producción de un sitio de cliente (`clientes/<slug-cliente>`) para su despliegue aislado en VPS (Coolify / Dokploy / Docker + Nginx), respetando [AGENTS.md](../../../AGENTS.md).

## 1. Propósito

Asegurar que un sitio de cliente cumpla todos los requisitos técnicos, de dominio y de compilación reproducible (`turbo prune` + `pnpm install --frozen-lockfile`) antes de ser desplegado en el VPS con su dominio propio.

## 2. Entradas

- **`slug-cliente`**: Nombre de la carpeta en `clientes/<slug-cliente>`.
- **`CLIENT_DOMAIN`**: Dominio de producción asignado al cliente (ej. `clientex.com`).
- **Plataforma de destino en VPS**: Coolify, Dokploy o Docker Engine + Nginx.

## 3. Procedimiento

1. **Pre-vuelo de Calidad y Aislamiento:**
   - Ejecutar:
     ```bash
     pnpm verify:isolation
     pnpm lint
     pnpm --filter @clientes/<slug-cliente> check
     pnpm --filter @clientes/<slug-cliente> build
     SITE_FOLDER=<slug-cliente> pnpm test:visual
     ```
2. **Validación de Poda del Monorepo (`turbo prune`):**
   - Verificar que el paquete `@clientes/<slug-cliente>` pueda ser podado limpiamente para Docker:
     ```bash
     pnpm dlx turbo@2.11.7 prune @clientes/<slug-cliente> --docker --out-dir /tmp/prune-<slug-cliente>
     rm -rf /tmp/prune-<slug-cliente>
     ```
3. **Verificación de Imagen Docker Local (cuando Docker esté disponible):**
   - Construir la imagen usando [`docker/Dockerfile`](../../../docker/Dockerfile):
     ```bash
     docker build -f docker/Dockerfile \
       --build-arg SITE_FOLDER=<slug-cliente> \
       --build-arg SITE_URL=https://<CLIENT_DOMAIN> \
       -t web-<slug-cliente>:latest .
     ```
4. **Generación de Ficha de Despliegue (Runbook para Coolify / Dokploy):**
   - Entregar al operador humano los parámetros exactos para configurar la aplicación en el panel del VPS:
     - **Repositorio:** `git@github.com:isjuandev/monorepo-webs.git`
     - **Rama:** `main`
     - **Build Pack:** Dockerfile (`/docker/Dockerfile`) o Nixpacks/Static
     - **Build Args:** `SITE_FOLDER=<slug-cliente>`, `SITE_URL=https://<CLIENT_DOMAIN>`
     - **Puerto expuesto (Dockerfile):** `80`
     - **Dominio en proxy inverso (Traefik/Caddy/Nginx):** `https://<CLIENT_DOMAIN>`

## 4. Herramientas

- [`docker/Dockerfile`](../../../docker/Dockerfile) y [`docker/nginx.conf`](../../../docker/nginx.conf)
- Turborepo (`turbo prune`)
- Verificadores del monorepo (`pnpm verify:isolation`, `pnpm check`, `pnpm build`, `pnpm test:visual`)

## 5. Límites

- **PROHIBIDO ejecutar despliegues en producción** o modificar servidores remotos sin autorización explícita del usuario.
- **PROHIBIDO almacenar claves SSH, tokens de API de Coolify/Dokploy o `.env` reales en Git.**

## 6. Criterios de Finalización

- Pre-vuelo (`verify:isolation`, `lint`, `check`, `build`, `test:visual`) y `turbo prune` superados sin errores.
- Ficha técnica de despliegue para el cliente entregada con los argumentos de compilación y configuración de dominio listos para aplicar en el VPS.
