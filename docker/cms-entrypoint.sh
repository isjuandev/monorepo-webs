#!/bin/sh
# Arranque del CMS: valida herramientas, sincroniza el clon del monorepo y lanza el servidor.
# No imprime valores de variables secretas.
#
# Fase 2: cuando el CMS lance el agente (claude), correrá con un entorno mínimo, sin GH_TOKEN
# ni el resto de secretos del contenedor (§11.2 y §11.3 de docs/cms/01-implementacion.md).
# Hoy el CMS no lanza el agente; GH_TOKEN y ANTHROPIC_API_KEY solo viven en este entorno.
set -eu

log() { printf '[cms-entrypoint] %s\n' "$*"; }
fail() { printf '[cms-entrypoint] ERROR: %s\n' "$*" >&2; exit 1; }

# Git nunca debe pedir credenciales por terminal (no hay TTY en el contenedor)
export GIT_TERMINAL_PROMPT=0

# a) Herramientas necesarias (pnpm se valida ejecutándolo: corepack puede tener el shim sin la versión)
for tool in node git gh claude; do
  command -v "$tool" >/dev/null 2>&1 || fail "falta la herramienta '$tool' en el PATH"
done
pnpm --version >/dev/null 2>&1 || fail "pnpm no funciona (corepack sin la versión preparada)"

# b) CMS_REPO_DIR debe existir como variable y ser absoluta
REPO_DIR="${CMS_REPO_DIR:-}"
[ -n "$REPO_DIR" ] || fail "CMS_REPO_DIR no está definida"
case "$REPO_DIR" in
  /*) ;;
  *) fail "CMS_REPO_DIR debe ser una ruta absoluta" ;;
esac
mkdir -p "$REPO_DIR"

# c) Sincronizar el clon. La autenticación nunca va en la URL: con GH_TOKEN, gh actúa
#    como credential helper de git.
if [ -n "${GH_TOKEN:-}" ]; then
  gh auth setup-git || log "aviso: no se pudo configurar gh como credential helper"
fi

# El clon se considera hecho solo si HEAD es válido (un primer clon fallido deja un .git vacío)
if ! git -C "$REPO_DIR" rev-parse --verify -q HEAD >/dev/null 2>&1; then
  [ -n "${CMS_REPO_URL:-}" ] || fail "$REPO_DIR no tiene un clon válido y CMS_REPO_URL no está definida"
  # /data/repo no está vacío (contiene los puntos de montaje recursos/ y .pipeline/), así que
  # 'git clone' se negaría: se inicializa en sitio y se trae la rama por defecto.
  log "clonando el repositorio en $REPO_DIR"
  [ -e "$REPO_DIR/.git" ] || git -C "$REPO_DIR" init -q
  if git -C "$REPO_DIR" remote get-url origin >/dev/null 2>&1; then
    git -C "$REPO_DIR" remote set-url origin "$CMS_REPO_URL"
  else
    git -C "$REPO_DIR" remote add origin "$CMS_REPO_URL"
  fi
  git -C "$REPO_DIR" fetch --prune -q origin || fail "no se pudo clonar (git fetch falló)"
  git -C "$REPO_DIR" remote set-head origin --auto >/dev/null 2>&1 || true
  BRANCH="$(git -C "$REPO_DIR" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)"
  BRANCH="${BRANCH#origin/}"
  BRANCH="${BRANCH:-main}"
  git -C "$REPO_DIR" checkout -q -f -B "$BRANCH" "origin/$BRANCH" \
    || fail "no se pudo extraer la rama '$BRANCH'"
else
  log "sincronizando el clon existente (git fetch)"
  git -C "$REPO_DIR" fetch --prune -q \
    || log "aviso: git fetch falló; se sigue con el clon actual"
fi

log "arrancando el servidor en ${HOST:-0.0.0.0}:${PORT:-4321}"
exec node /app/apps/cms/dist/server/entry.mjs
