# Dockerfile multi-stage reproducible con turbo prune y pnpm --frozen-lockfile
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Etapa 1: Podar el monorepo únicamente para el sitio objetivo con turbo prune
FROM base AS pruner
ARG SITE_FOLDER=_template
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY sites ./sites

RUN PKG_NAME=$(node -p "require('./sites/${SITE_FOLDER}/package.json').name") && \
    pnpm dlx turbo@2.11.7 prune "${PKG_NAME}" --docker

# Etapa 2: Instalar dependencias con lockfile congelado y compilar el sitio
FROM base AS builder
ARG SITE_FOLDER=_template
ARG SITE_URL=""
ENV SITE_URL=${SITE_URL}
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm --filter "./sites/${SITE_FOLDER}" build

# Etapa 3: Servidor ligero de producción con Nginx
FROM nginx:1.27-alpine AS runner
ARG SITE_FOLDER=_template

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/sites/${SITE_FOLDER}/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
