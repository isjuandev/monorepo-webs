# Dockerfile multi-stage reproducible con turbo prune y pnpm --frozen-lockfile
#
# SITE_FOLDER es el slug del sitio (ej. "la-guaca" o "asterre"); se busca en clientes/ y luego en
# plantillas/. Acepta los nombres antiguos de sites/ ("plantilla-asterre", "_template") para que
# las apps de Coolify ya creadas sigan construyendo sin cambios.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Etapa 1: Resolver la carpeta del sitio y podar el monorepo únicamente para él con turbo prune
FROM base AS pruner
ARG SITE_FOLDER=_base
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY plantillas ./plantillas
COPY clientes ./clientes

RUN SLUG=$(echo "${SITE_FOLDER}" | sed -E -e 's#^(sites|clientes|plantillas)/##' -e 's#/+$##' \
      -e 's#^plantilla-##' -e 's#^_template$#_base#') && \
    for DIR in "clientes/${SLUG}" "plantillas/${SLUG}"; do \
      if [ -f "${DIR}/package.json" ]; then echo "${DIR}" > /app/site-dir; break; fi; \
    done && \
    if [ ! -s /app/site-dir ]; then \
      echo "SITE_FOLDER=${SITE_FOLDER} no existe en clientes/ ni en plantillas/" >&2; exit 1; \
    fi && \
    PKG_NAME=$(node -p "require('./$(cat /app/site-dir)/package.json').name") && \
    echo "Sitio: $(cat /app/site-dir) (${PKG_NAME})" && \
    pnpm dlx turbo@2.11.7 prune "${PKG_NAME}" --docker

# Etapa 2: Instalar dependencias con lockfile congelado y compilar el sitio
FROM base AS builder
ARG SITE_URL=""
ENV SITE_URL=${SITE_URL}
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/site-dir /app/site-dir
RUN SITE_DIR=$(cat /app/site-dir) && \
    pnpm --filter "./${SITE_DIR}" build && \
    cp -r "${SITE_DIR}/dist" /app/site-dist

# Etapa 3: Servidor ligero de producción con Nginx
FROM nginx:1.27-alpine AS runner

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/site-dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
