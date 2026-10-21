---
description: Fabrica de punta a punta el sitio de un cliente nuevo (material crudo en recursos/<slug>/entrada/ → PR listo para producción) con el pipeline cliente:crear.
argument-hint: "<slug-cliente> [carpeta con el material del cliente] [--allow-pending]"
---

Fabrica el sitio del cliente indicado en `$ARGUMENTS` siguiendo `${CLAUDE_PROJECT_DIR}/docs/guias/01-crear-cliente.md`. Trabajas en la raíz del monorepo, solo con `pnpm`, y te detienes únicamente en los puntos marcados como **pregunta**.

1. **Slug y recursos.** El primer argumento es el slug (kebab-case).
   - Si no existe `recursos/<slug>/`, créala con `pnpm cliente:recursos <slug>`.
   - Si el usuario indicó una carpeta con material, copia su contenido (sin borrar el original) en `recursos/<slug>/entrada/`.
   - Si `entrada/` está vacía y el brief no tiene datos, **pregunta**: pide al usuario que deje ahí el material del cliente, y detente.
2. **Intake.** Ejecuta `pnpm cliente:crear <slug> --intake-only` (en segundo plano si tarda). Ordena `entrada/`, completa `brief.md` y escribe `preguntas.md`.
3. **Datos que faltan.** Si el brief no es válido o `preguntas.md` lista datos que bloquean la entrega, **pregunta** al usuario una sola vez, con todas las preguntas juntas y en el orden de `preguntas.md`.
   - Escribe las respuestas en `recursos/<slug>/brief.md`. Nunca inventes datos.
   - Si el usuario dice que siga sin ellos o pasó `--allow-pending`, continúa con `--allow-pending`. Los pendientes se listan en el PR.
   - Usa también `--allow-pending` si el dominio es temporal (`*.nexobite.com`).
4. **Pipeline completo.** Ejecuta `pnpm cliente:crear <slug> [--allow-pending]` en segundo plano. Cubre rama, generación desde la plantilla del brief, activos, personalización con el agente, compuertas (`cliente:check`, `pnpm verify`, `cliente:qa` con SEO) con reparación automática, commits y PR.
   - Si falla, lee el error, corrige solo lo que esté dentro de `clientes/<slug>/` o `recursos/<slug>/` y retoma con `pnpm cliente:crear <slug> --resume --from-step <paso>`. Nunca uses `--force`, stash, reset ni borrado de ramas.
5. **Informe final**, breve:
   - Enlace al PR y plantilla usada.
   - Datos pendientes y preguntas para el cliente, listas para reenviar.
   - La ficha de Coolify que trae el PR, para crear la app tras el merge.

No despliegues, no hagas merge y no crees apps en Coolify: el pipeline termina en el PR (ver `docs/guias/03-desplegar.md`).
