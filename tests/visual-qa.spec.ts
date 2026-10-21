import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { resolveQaSite } from "./site";

const site = resolveQaSite();

/** Rutas de todas las páginas HTML del build (`dist/`), sin la 404 */
function routesFromBuild(): string[] {
  const distDir = site.dist;
  if (!fs.existsSync(distDir)) {
    throw new Error(
      `QA_ROUTES=auto necesita el build de ${site.rel}: ejecuta antes pnpm --filter "./${site.rel}" build`
    );
  }
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith("_")) {
          walk(full);
        }
      } else if (entry.name.endsWith(".html")) {
        const relative = path.relative(distDir, full).split(path.sep).join("/");
        const route = `/${relative.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "")}`;
        if (!/^\/404\/?$/.test(route)) {
          found.push(route.replace(/\/$/, "") || "/");
        }
      }
    }
  };
  walk(distDir);
  return found.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
}

const routes =
  process.env.QA_ROUTES === "auto"
    ? routesFromBuild()
    : (process.env.QA_ROUTES || "/")
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

function routeToSlug(routePath: string): string {
  if (routePath === "/" || routePath === "") {
    return "home";
  }
  return routePath.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-_]/g, "-");
}

test.describe(`Visual QA & Functional Suite — ${site.rel}`, () => {
  for (const route of routes) {
    const routeSlug = routeToSlug(route);

    test(`Ruta "${route}": navegación, recursos, desbordamiento horizontal, interacciones y captura reproducible`, async ({
      page,
    }, testInfo) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedAssets: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        pageErrors.push(err.message);
      });

      page.on("response", (response) => {
        const status = response.status();
        const url = response.url();
        if (status >= 400 && !url.endsWith("/favicon.ico")) {
          failedAssets.push(`${status} ${url}`);
        }
      });

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `La ruta ${route} debe responder HTTP 200`).toBe(200);

      // Esperar carga de fuentes y recorrer la página para activar elementos lazy
      await page.evaluate(async () => {
        if ("fonts" in document) {
          await document.fonts.ready;
        }
        const totalHeight = document.body.scrollHeight;
        const step = Math.max(window.innerHeight, 400);
        for (let y = 0; y <= totalHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });

      // Verificar ausencia de errores de ejecución y activos rotos
      expect(consoleErrors, "No debe haber errores en console.error").toEqual([]);
      expect(pageErrors, "No debe haber excepciones JS no capturadas").toEqual([]);
      expect(failedAssets, "No debe haber recursos o imágenes con HTTP >= 400").toEqual([]);

      // Verificar SEO técnico básico en la ruta
      const title = await page.title();
      expect(title.trim().length, "El documento debe tener <title> no vacío").toBeGreaterThan(0);

      const metaDescription = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(
        metaDescription?.trim().length ?? 0,
        'Debe existir <meta name="description"> con contenido'
      ).toBeGreaterThan(0);

      const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(
        canonicalHref?.startsWith("http"),
        'Debe existir <link rel="canonical"> con URL absoluta'
      ).toBe(true);
      expect(
        new URL(canonicalHref ?? "http://invalido").host,
        `El canonical debe usar el dominio del sitio (${site.host})`
      ).toBe(site.host);

      // Compartir en redes: og:url con el dominio del sitio y og:image absoluta
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      expect(
        ogUrl ? new URL(ogUrl).host : "",
        `og:url debe usar el dominio del sitio (${site.host})`
      ).toBe(site.host);
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(
        ogImage?.startsWith("http"),
        'Debe existir <meta property="og:image"> con URL absoluta'
      ).toBe(true);

      // Jerarquía de encabezados: un único <h1> por página
      expect(await page.locator("h1").count(), "Cada página debe tener exactamente un <h1>").toBe(
        1
      );

      // Detectar desbordamiento horizontal (scrollWidth > innerWidth)
      const overflowInfo = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const overflowingSelectors: string[] = [];

        if (docWidth > winWidth) {
          const allElements = Array.from(document.querySelectorAll("*"));
          for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const cls =
                typeof el.className === "string" && el.className.trim()
                  ? `.${el.className.trim().split(/\s+/).join(".")}`
                  : "";
              overflowingSelectors.push(`${tag}${cls} (right=${Math.round(rect.right)}px)`);
            }
          }
        }

        return {
          docWidth,
          winWidth,
          hasOverflow: docWidth > winWidth,
          overflowingSelectors: overflowingSelectors.slice(0, 10),
        };
      });

      expect(
        overflowInfo.hasOverflow,
        `Desbordamiento horizontal detectado (${overflowInfo.docWidth}px > ${overflowInfo.winWidth}px). Elementos: ${overflowInfo.overflowingSelectors.join(", ")}`
      ).toBe(false);

      // Comprobar que los controles interactivos visibles sean accionables
      const buttons = page.locator("button:visible");
      const buttonCount = await buttons.count();
      for (let i = 0; i < buttonCount; i += 1) {
        const btn = buttons.nth(i);
        await expect(btn).toBeEnabled();
        await btn.hover();
      }

      // Guardar captura reproducible en <sitio>/docs/qa/ (ignorada por Git)
      const projectName = testInfo.project.name;
      fs.mkdirSync(site.qa, { recursive: true });

      const currentScreenshotPath = path.join(site.qa, `current-${projectName}-${routeSlug}.png`);
      await page.screenshot({
        path: currentScreenshotPath,
        fullPage: true,
        animations: "disabled",
      });

      // Si existe captura de referencia en snapshots/, ejecutar comparación visual estricta
      const snapshotBaselinePath = testInfo.snapshotPath(`${routeSlug}.png`);
      if (fs.existsSync(snapshotBaselinePath) || process.env.UPDATE_SNAPSHOTS === "true") {
        await expect(page).toHaveScreenshot(`${routeSlug}.png`, {
          fullPage: true,
          animations: "disabled",
          maxDiffPixelRatio: 0.02,
        });
      } else {
        testInfo.annotations.push({
          type: "visual-reference-status",
          description: `Sin captura de referencia previa en ${path.relative(process.cwd(), snapshotBaselinePath)}. Se guardó captura actual en ${path.relative(process.cwd(), currentScreenshotPath)}. No declarar réplica perfecta sin comparar contra referencia.`,
        });
      }
    });
  }

  test("Endpoints técnicos SEO (/robots.txt y /sitemap-index.xml)", async ({
    request,
  }, testInfo) => {
    // Ejecutar una sola vez en desktop para evitar duplicidad innecesaria
    test.skip(testInfo.project.name !== "desktop", "Validación de endpoints solo en desktop");

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain("User-agent: *");
    expect(robotsText).toContain(`https://${site.host}/sitemap-index.xml`);

    const sitemapRes = await request.get("/sitemap-index.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("<sitemapindex");

    // Cada sitemap y cada URL listada deben usar el dominio del sitio
    const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(sitemapUrls.length, "sitemap-index.xml debe listar al menos un sitemap").toBeGreaterThan(
      0
    );
    for (const sitemapUrl of sitemapUrls) {
      const parsed = new URL(sitemapUrl);
      expect(parsed.host, `El sitemap debe usar el dominio del sitio (${site.host})`).toBe(
        site.host
      );
      const childText = await (await request.get(parsed.pathname)).text();
      const pageUrls = [...childText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const foreign = pageUrls.filter((url) => new URL(url).host !== site.host);
      expect(foreign, "Todas las URL del sitemap deben usar el dominio del sitio").toEqual([]);
    }
  });
});
