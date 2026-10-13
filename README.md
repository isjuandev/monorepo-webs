# Monorepo Webs — Nexobite

Monorepo para desarrollar, mantener y desplegar múltiples sitios web estáticos/frontend para clientes (cada uno con su propio dominio) usando **Astro + Preact**, **pnpm workspaces** y **Turborepo**.

---

## Arquitectura y Estructura del Monorepo

```text
monorepo-webs/
├── sites/                          # Sitios web individuales de cada cliente
│   └── _template/                  # Plantilla base lista para duplicar por cada nuevo cliente
│       ├── public/                 # Archivos estáticos públicos (favicon, imágenes OG, etc.)
│       ├── src/
│       │   ├── assets/             # Imágenes y recursos optimizados por Astro
│       │   ├── components/         # Componentes exclusivos del cliente
│       │   ├── config/
│       │   │   └── site.ts         # Dominio del cliente, SEO, contacto y redes sociales
│       │   ├── layouts/
│       │   │   └── BaseLayout.astro
│       │   ├── pages/
│       │   │   ├── index.astro     # Página principal
│       │   │   └── robots.txt.ts   # Generador automático de robots.txt con el dominio del cliente
│       │   └── styles/
│       │       └── global.css      # Variables CSS y estilos del tema del cliente
│       ├── astro.config.mjs        # Configura Astro site URL + Sitemap + Preact
│       ├── package.json
│       └── tsconfig.json
├── packages/                       # Paquetes compartidos entre todos los sitios
│   ├── ui/                         # Componentes compartidos (@repo/ui)
│   │   └── src/
│   │       ├── astro/              # Componentes Astro (SEO, Section, Footer)
│   │       └── preact/             # Islas interactivas en Preact (Button, etc.)
│   ├── utils/                      # Helpers de dominio, SEO, WhatsApp y utilidades (@repo/utils)
│   └── tsconfig/                   # Configuraciones base de TypeScript (@repo/tsconfig)
├── docker/                         # Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)
│   ├── Dockerfile                  # Dockerfile multi-stage parametrizable por sitio
│   └── nginx.conf                  # Configuración Nginx optimizada para sitios estáticos Astro
├── .dockerignore
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Cómo Crear un Nuevo Sitio para un Cliente

1. **Duplica la plantilla base** en `sites/` con el identificador del cliente:
   ```bash
   cp -R sites/_template sites/cliente-x
   ```

2. **Actualiza el nombre del paquete** en `sites/cliente-x/package.json`:
   ```json
   {
     "name": "@sites/cliente-x"
   }
   ```

3. **Configura el dominio y datos del cliente** en `sites/cliente-x/src/config/site.ts`:
   ```ts
   const CLIENT_DOMAIN = "clientex.com";

   export const siteConfig: ClientSiteConfig = {
     name: "Cliente X",
     domain: CLIENT_DOMAIN,
     url: normalizeSiteUrl(CLIENT_DOMAIN),
     title: "Cliente X | Sitio Web Oficial",
     description: "Descripción oficial optimizada para motores de búsqueda.",
     locale: "es_CO",
     contact: {
       phone: "+57 300 000 0000",
       whatsapp: "573000000000",
       email: "contacto@clientex.com",
     },
   };
   ```

4. **Instala dependencias y ejecuta el entorno de desarrollo**:
   ```bash
   pnpm install
   pnpm --filter @sites/cliente-x dev
   ```

---

## Uso de Paquetes Compartidos

### `@repo/ui` (Componentes Astro y Preact)
```astro
---
import SEO from "@repo/ui/astro/SEO.astro";
import Section from "@repo/ui/astro/Section.astro";
import Footer from "@repo/ui/astro/Footer.astro";
import { Button } from "@repo/ui";
---

<Section>
  <Button client:load variant="primary">Contáctanos</Button>
</Section>
```

### `@repo/utils` (Helpers compartidos)
```ts
import { buildWhatsAppUrl, cn, normalizeSiteUrl } from "@repo/utils";

const waLink = buildWhatsAppUrl("573000000000", "Hola, quiero más información");
```

---

## Configuración Multi-Dominio y SEO Automático

Al definir `CLIENT_DOMAIN` en `src/config/site.ts` (o la variable de entorno `SITE_URL` al compilar), cada sitio genera automáticamente:
- **URLs Canónicas (`<link rel="canonical">`)** y **OpenGraph (`og:url`, `og:image`)** resueltas con el dominio propio del cliente.
- **Sitemap XML (`/sitemap-index.xml` y `/sitemap-0.xml`)** con `@astrojs/sitemap`.
- **`/robots.txt` dinámico** apuntando a `https://<dominio-del-cliente>/sitemap-index.xml`.

---

## Despliegue en VPS (Coolify / Dokploy / Docker + Nginx)

Cada sitio del monorepo se despliega como una aplicación estática independiente conectada al dominio del cliente:

### Opción A: Usando el Dockerfile incluido (`docker/Dockerfile`)
Configura la aplicación en Coolify o Dokploy apuntando a este repositorio:
- **Dockerfile Location:** `/docker/Dockerfile`
- **Build Argument:** `SITE_FOLDER=cliente-x` (nombre de la carpeta dentro de `sites/`)
- **Build Argument opcional:** `SITE_URL=https://clientex.com`
- **Dominio asignado:** `https://clientex.com`

Para construir y probar localmente con Docker:
```bash
docker build -f docker/Dockerfile --build-arg SITE_FOLDER=_template -t web-cliente .
docker run -p 8080:80 web-cliente
```

### Opción B: Usando Nixpacks / Static Buildpack
- **Install Command:** `pnpm install`
- **Build Command:** `pnpm --filter @sites/cliente-x build`
- **Publish Directory:** `sites/cliente-x/dist`
- **Dominio asignado:** `https://clientex.com`

---

## Comandos Principales

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia todos los sitios en modo desarrollo |
| `pnpm --filter @sites/<cliente> dev` | Inicia únicamente el sitio de un cliente específico |
| `pnpm build` | Compila todos los sitios para producción |
| `pnpm --filter @sites/<cliente> build` | Compila únicamente el sitio de un cliente específico |
| `pnpm check` | Ejecuta validación de tipos (`astro check`) en todos los sitios |
| `pnpm clean` | Limpia las carpetas `dist`, `.astro`, `.turbo` y `node_modules` |
