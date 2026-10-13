# Flujo local → GitHub → Coolify

Un repositorio, **una aplicación de Coolify por cliente**. Cada app construye solo su sitio con `docker/Dockerfile` (`turbo prune` + Nginx).

## 1. Flujo diario

```bash
pnpm install
pnpm --filter @sites/<slug> dev        # desarrollo local
pnpm verify                            # isolation + lint + check + build (lo mismo que CI)
SITE_FOLDER=<slug> pnpm test:visual    # QA visual (opcional antes de entregar)
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
   sites/<slug-cliente>/**
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

Además, protege `main` en GitHub (ver [governance.md](./governance.md)) y trabaja con ramas + PR: solo lo que llega a `main` se despliega.

## 4. Checklist por cliente nuevo

- [ ] `pnpm new-client-site <slug> --name "..." --domain "..."`
- [ ] `pnpm verify` y `SITE_FOLDER=<slug> pnpm test:visual` en verde
- [ ] Push a `main` (vía PR)
- [ ] App creada en Coolify con los valores de la sección 2
- [ ] DNS apuntando al VPS y HTTPS activo
- [ ] `https://<dominio>/robots.txt` y `/sitemap-index.xml` responden con el dominio correcto
