# Dockerfile universal para desplegar cualquier sitio del monorepo en Coolify / Dokploy / VPS
FROM node:22-alpine AS builder

# Nombre de la carpeta dentro de sites/ (ej: SITE_FOLDER=cliente-restaurante)
ARG SITE_FOLDER=_template
# Opcional: sobreescribir el dominio en tiempo de build (ej: SITE_URL=https://mirestaurante.com)
ARG SITE_URL=""
ENV SITE_URL=${SITE_URL}

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copiar manifiestos del workspace para aprovechar caché de capas de Docker
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY sites/${SITE_FOLDER} ./sites/${SITE_FOLDER}

# Instalar dependencias y compilar únicamente el sitio del cliente indicado
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter "./sites/${SITE_FOLDER}" build

# Etapa de producción: servidor ligero Nginx
FROM nginx:1.27-alpine AS runner

ARG SITE_FOLDER=_template

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/sites/${SITE_FOLDER}/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
