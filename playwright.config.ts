import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const siteFolder = process.env.SITE_FOLDER || "_template";
const port = Number(process.env.QA_PORT || 4321);
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  snapshotPathTemplate: path.join(
    __dirname,
    "docs",
    "design-references",
    siteFolder,
    "snapshots",
    "{projectName}-{arg}{ext}"
  ),
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: path.join(__dirname, "docs", "research", siteFolder, "visual-qa-report.json"),
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
        command: `pnpm --filter "./sites/${siteFolder}" build && pnpm --filter "./sites/${siteFolder}" preview --port ${port} --host`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});
