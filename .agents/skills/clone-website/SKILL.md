---
name: clone-website
description: Rebuild existing web pages as working local code in this Astro + Preact monorepo, matching their real content, assets, responsive layout, and interactions. Use for website cloning, replication, or reverse engineering into a client site under plantillas/<slug-cliente>, including Framer sites and animated pages.
---

# Clone a website

Recreate the supplied pages as a working client site in `monorepo-webs`. Match the source before adding a new design direction. Deliver working, editable code: screenshots, iframes, and downloaded production bundles are references, not the implementation.

Always follow the common monorepo rules defined in [AGENTS.md](../../../AGENTS.md).

## Purpose & Inputs

- **Purpose:** Reverse-engineer one or more target URLs into an isolated Astro 7 + Preact client site under `plantillas/<slug-cliente>/`.
- **Inputs:**
  - `url(s)`: Target website URL(s) to clone.
  - `slug-cliente`: Kebab-case identifier for the client folder (`plantillas/<slug-cliente>`).
  - `domain` (optional): Production domain for the client (configured in `src/config/site.ts`).
  - `content mode` (optional): **A — Plantilla** (default: real structure, layout, styles and behavior, but placeholder text, prices, contact data and images) or **B — Fiel** (real text and assets, only when the user confirms they have the owner's permission).

**Mandatory reference:** read [the full clone checklist](./references/full-clone-checklist.md) before starting. It defines the complete inventory (routes, sections, measured styles, animations, assets, SEO), build rules, comparison, validation, Git delivery and the final verification list. Do not report the clone as complete until that list is satisfied with evidence.

## 1. Map the work

Read [AGENTS.md](../../../AGENTS.md), workspace packages (`@repo/ui`, `@repo/utils`), and existing sites under `plantillas/` and `clientes/`. Open the source URLs with the available browser. Prefer direct HTTP, asset tools, or APIs for extraction when practical; use the browser to establish appearance and behavior.

If `plantillas/<slug-cliente>/` does not exist yet, scaffold it using the official generator without modifying `plantillas/_base`:
```bash
pnpm cliente:nuevo <slug-cliente> --name "<Nombre>" --domain "<dominio.com>"
```

Discover **every** route before building: read the source `/sitemap.xml` and `/robots.txt`, and extract internal links from the menu, header, footer and body. Never assume a one-page site; subpages left out must be approved by the user and recorded in the brief.

Record a short source-to-local route map and the files each page owns:
- Target client folder: `plantillas/<slug-cliente>/`.
- Client domain & metadata: `plantillas/<slug-cliente>/src/config/site.ts`.
- Routes/Pages: `plantillas/<slug-cliente>/src/pages/`.
- Client-specific components & SVGs: `plantillas/<slug-cliente>/src/components/`.
- Static assets (images, fonts, videos): `plantillas/<slug-cliente>/public/`.
- Research & inspection notes: `plantillas/<slug-cliente>/docs/` and `plantillas/<slug-cliente>/docs/referencias/`.

Rules for mapping:
- Never modify `plantillas/_base` directly for a specific client clone.
- Preserve source pathnames for multiple pages from one origin. Query/fragment variations usually represent states of the same route; reproduce those states.
- Preserve existing technical routes (`robots.txt.ts`, `sitemap`).
- Use separate client folders (`plantillas/<cliente-a>`, `plantillas/<cliente-b>`) for different origins/clients. Never cross-import between client folders.
- Escape literal URL segments that conflict with Astro routing syntax (`_`, `[...]`) using supported mechanisms, then verify the actual requested URL.

Finish when every requested URL has a destination inside `plantillas/<slug-cliente>/` and file ownership is clear.

## 2. Observe before building

Inspect the whole page at desktop and mobile widths. Scroll top to bottom to load lazy media and reveal sticky/pinned scenes. Then exercise menus, tabs, accordions, carousels, hover states, and primary links. Distinguish changes driven by **scroll, click, hover, or time**; a click imitation of a scroll-driven section is a different product.

Build an **animation and interaction inventory** (one row each: element, trigger, changed properties, duration, easing, delay, repeat/reversible) covering load fades, scroll reveals, parallax/sticky, header behavior, menus, carousels, lightboxes, hovers, marquees (measure real speed) and background video. Read keyframes, transitions and `data-animation*` attributes rather than inferring from screenshots; mark inconclusive measurements as "no verificado". Every row must end up implemented or explicitly justified.

Treat each observation as one sample of a **rule**. Read declared values (computed styles, CSS variables, a library's live options) rather than inferring them from one rendering, and vary viewport width (including wider than the design), viewport height, input, and state until you know what drives each change. Drive the page with the inputs visitors use (wheel, touch, keyboard, pointer); scripted scrolling bypasses behavior attached to them, such as smooth scrolling.

Save source screenshots labeled with viewport, scroll position, and interaction state under `plantillas/<slug-cliente>/docs/referencias/` (and baseline snapshots under `clientes/<slug-cliente>/docs/referencias/snapshots/` when used for automated diffing). Capture alternate-state content/assets. Keep one compact page brief in `plantillas/<slug-cliente>/docs/`: section order, typography, layout measurements, asset mapping, and interactions.

Read [the inspection reference](./references/inspection-guide.md) for extraction and state comparison. For **Framer-generated pages, sticky scenes, reveal animations, or animated media**, read [Framer and motion](./references/framer-and-motion.md).

Use the source's real text and the files it actually loads: fonts, images, SVGs, and video. A same-named substitute from another provider or icon set has different metrics or shapes. Measure important geometry/computed styles. Inspect layered images and media elements before rebuilding a visual as HTML. Track source URL → local asset path (`plantillas/<slug-cliente>/public/...`) and verify content type/dimensions: a `.png` URL may return AVIF.

Finish when every section and meaningful state has enough evidence to build, with unavailable details identified. A large DOM dump does not replace looking at the page.

## 3. Build a complete first pass

Establish fonts, page width, colors/CSS variables (brand tokens and `@font-face` go in `plantillas/<slug-cliente>/src/styles/theme.css`, imported before `global.css`), assets, routes, page-wide behavior, and shared components first. Build each component with every observed state (hover, focus, breakpoints) so builders reuse it as-is. Reuse fitting primitives from `@repo/ui` and helpers from `@repo/utils`. Follow the customization layer from `AGENTS.md` §6: identity/contact in `src/config/site.ts`, every copy, label, alt text and list in `src/data/content.ts` (including a `UI_LABELS` object for buttons, ARIA labels and form text), assets in `public/`. Components and pages must not hardcode brand names, people, phones, emails or user-facing copy, so a client site can be produced by editing only those four points; write a `CUSTOMIZE.md` at the site root listing them and the image sizes. Prefer `.astro` components + CSS for layout/simple motion, and Preact (`.tsx`) islands (`client:load`, `client:visible`, `client:idle`) or an animation library when source behavior needs client-side state.

Build coherent sections with real content. Delegate independent pages/sections after shared files have an owner. Give builders screenshots, relevant measurements/state notes, asset paths, destination files, and a concrete finish line.

Recreate in-scope interactions. Preserve real outbound destinations. Rewrite links to local routes when those routes are included; leave out-of-scope destinations pointing to the source and disclose them. Visible controls must perform the behavior they promise.

Run the client site checks (`pnpm lint`, `pnpm --filter @plantillas/<slug-cliente> check`, `pnpm --filter @plantillas/<slug-cliente> build`) after an integrated slice. Finish this pass when every requested section/route renders with actual assets and important controls work.

## 4. Compare, repair, repeat

Open source/local pages at the **same viewport, scroll position, and state**. Let fonts, media, and reveal animations settle. Review the whole page wherever step 2 found a rule changing, plus a viewport wider than the design; judge scroll and pointer behavior with real input. A side-by-side montage locates drift; full-size sections establish detail.

Fix the largest visible differences first: geometry, missing sections/layers, typography/wrapping, asset crop, then spacing and motion. Recheck affected views. Compare animated regions in initial, active, and settled states, including reverse scroll when relevant.

Exercise the real local workflow and run the automated visual and functional QA suite:
```bash
pnpm verify:isolation
pnpm lint
pnpm --filter @plantillas/<slug-cliente> check
pnpm --filter @plantillas/<slug-cliente> build
SITE_FOLDER=<slug-cliente> pnpm test:visual
```
Run the QA suite over **all** cloned routes (`QA_ROUTES="/,/ruta-2,..."`), and test interactions and `prefers-reduced-motion` with Playwright.

Completion requires a successful build, passing isolation/lint/type checks, rendered comparison, **and** the final verification list in [the full clone checklist](./references/full-clone-checklist.md). State remaining differences precisely instead of calling an unchecked result pixel-perfect.

## Deliver

Run `pnpm cliente:check` against a throwaway copy made with `pnpm cliente:nuevo <slug> --from <this-site>` to confirm the leftovers list is limited to the four points, then add the site's brand strings (`marcas`) and placeholders to `plantillas/<slug>/plantilla.json`. Return, in the format defined by the checklist (route table, animation table, known differences, commands run with results, PR link): preview/run instructions (`pnpm --filter @plantillas/<slug-cliente> dev`, or `@clientes/<slug>` when cloning straight into a client), the source-to-local route map, configured client domain in `src/config/site.ts`, representative desktop/mobile comparisons, checks actually run, and remaining visual/functional gaps.
