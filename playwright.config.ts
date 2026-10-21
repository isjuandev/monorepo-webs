import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { resolveQaSite } from "./tests/site";

const site = resolveQaSite();
// Puerto propio de QA (no el 4321 de astro dev) para no mezclarse con un servidor de desarrollo
const port = Number(process.env.QA_PORT || 4599);
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  snapshotPathTemplate: path.join(site.snapshots, "{projectName}-{arg}{ext}"),
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: path.join(site.qa, "visual-qa-report.json"),
      },
    ],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 14"],
        defaultBrowserType: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // cliente:qa ya compiló el sitio (QA_SKIP_BUILD=1); test:visual compila aquí
        // Servidor estático propio (scripts/lib/static-server.mjs) en vez de `astro preview`, que
        // se relanza desacoplado y queda huérfano tras la QA
        command: `${process.env.QA_SKIP_BUILD ? "" : `pnpm --filter "./${site.rel}" build && `}exec node scripts/lib/static-server.mjs "${site.dist}" ${port}`,
        url: baseURL,
        // Nunca reutilizar: un servidor ya levantado puede ser de otro sitio y falsear la QA
        reuseExistingServer: false,
        timeout: 60000,
      },
});
