# 3. Desplegar en Coolify

Un repositorio, **una aplicación de Coolify por cliente**. Cada app construye solo su sitio con `docker/Dockerfile` (`turbo prune` + Nginx).

## 1. Flujo diario

```bash
pnpm install
pnpm --filter @clientes/<slug> dev        # desarrollo local
pnpm verify                            # isolation + lint + check + build (lo mismo que CI)
pnpm cliente:qa <slug>                 # QA visual de todas las rutas (opcional antes de entregar)
git push                               # el hook pre-push ejecuta pnpm verify
```

Activa el hook una sola vez por clon:

```bash
git config core.hooksPath .githooks
```

Opcional (requiere Docker Desktop/OrbStack) para probar la imagen exacta de producción:

```bash
docker build -f docker/Dockerfile --build-arg SITE_FOLDER=<slug> -t web-<slug> .
docker run --rm -p 8080:80 web-<slug>   # http://localhost:8080  y /healthz
```

## 2. Crear la aplicación en Coolify (una por cliente)

1. **Projects → New Resource → Public/Private Repository (GitHub App o Deploy Key)** → `isjuandev/monorepo-webs`, rama `main`.
2. **Build Pack:** `Dockerfile`.
3. **Base Directory:** `/` (la raíz; el contexto de build necesita todo el monorepo).
4. **Dockerfile Location:** `/docker/Dockerfile`.
5. **Ports Exposes:** `80`.
6. **Build Variables / Build Args** (marcadas como *Build Variable*):
   - `SITE_FOLDER=<slug-cliente>`
   - `SITE_URL=https://<dominio-cliente>` (debe coincidir con `CLIENT_DOMAIN` en `src/config/site.ts`)
7. **Domains:** `https://<dominio-cliente>` (Coolify emite el certificado Let's Encrypt). Apunta el registro DNS `A` al IP del VPS.
8. **Health Check:** path `/healthz`, puerto `80`.
9. **Watch Paths** (Advanced → *Watch Paths*), para que un push a otro cliente no redespliegue este:
   ```
   clientes/<slug-cliente>/**
   packages/**
   docker/**
   pnpm-lock.yaml
   package.json
   turbo.json
   ```
10. **Auto Deploy:** ver sección 3.

## 3. Cómo evitar desplegar código sin validar

Coolify despliega en cuanto llega el push, sin esperar a GitHub Actions. Dos opciones:

- **Simple (recomendada para empezar):** Auto Deploy activo + `pnpm verify` obligatorio en `pre-push`. Si CI falla, corriges y vuelves a empujar.
- **Estricta:** desactiva *Auto Deploy*, y en Coolify copia el *Deploy Webhook* de cada app. Guarda la URL y el token de la API como *secrets* de GitHub y llama al webhook desde un job que dependa del job de CI (`needs: quality-and-build`, solo en `main`). Nunca guardes tokens en el repo.

Además, protege `main` en GitHub (ver [04-reglas.md](./04-reglas.md)) y trabaja con ramas + PR: solo lo que llega a `main` se despliega.

## 4. Checklist por cliente nuevo

El PR que abre `pnpm cliente:crear <slug>` trae una **ficha de Coolify** con estos valores ya rellenos.

- [ ] PR del cliente revisado y mergeado en `main` (compuertas en verde: `cliente:check`, `verify`, `cliente:qa`)
- [ ] App creada en Coolify con los valores de la sección 2 (`SITE_FOLDER=<slug>`, `SITE_URL=https://<dominio>`)
- [ ] DNS apuntando al VPS y HTTPS activo
- [ ] `https://<dominio>/healthz`, `/robots.txt` y `/sitemap-index.xml` responden con el dominio correcto
- [ ] `clientes/<slug>/cliente.json`: `estado` → `produccion` y `coolify` → nombre de la app

## 5. Apps existentes y nombres antiguos

`SITE_FOLDER` es el **slug** del sitio: el Dockerfile lo busca primero en `clientes/` y después en `plantillas/`. También acepta los nombres de la antigua carpeta `sites/` (`plantilla-asterre` → `asterre`, `_template` → `_base`), así que las apps creadas antes de la reorganización siguen construyendo sin tocar sus variables.

Lo único recomendable en esas apps es poner los **Watch Paths** de la sección 2 (`clientes/<slug>/**` o `plantillas/<slug>/**`). Si no los tienen, cada push a `main` redespliega todas las apps del repositorio.

| App de Coolify | Carpeta | Watch Paths propios |
| :-- | :-- | :-- |
| `cliente/la-guaca` | `clientes/la-guaca` | `clientes/la-guaca/**` |
| `casa-serena-template-#1` | `plantillas/asterre` | `plantillas/asterre/**` |
| `hotellia-template-#2` | `plantillas/hotellia` | `plantillas/hotellia/**` |
| `pinevalley-template-#3` | `plantillas/pinevalley` | `plantillas/pinevalley/**` |
