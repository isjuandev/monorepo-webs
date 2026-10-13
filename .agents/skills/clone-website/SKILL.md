---
name: clone-website
description: Rebuild existing web pages as working local code in this Astro + Preact monorepo, matching their real content, assets, responsive layout, and interactions. Use for website cloning, replication, or reverse engineering into a client site under sites/<slug-cliente>, including Framer sites and animated pages.
---

# Clone a website

Recreate the supplied pages as a working client site in `monorepo-webs`. Match the source before adding a new design direction. Deliver working, editable code: screenshots, iframes, and downloaded production bundles are references, not the implementation.

## 1. Map the work

Read project instructions (`AGENTS.md`), the monorepo workspace packages (`@repo/ui`, `@repo/utils`), and existing client sites under `sites/`. Open the source URLs with the available browser. Prefer direct HTTP, asset tools, or APIs for extraction when practical; use the browser to establish appearance and behavior.

Record a short source-to-local route map and the files each page owns. Follow the monorepo's conventions:
- Target client folder: `sites/<slug-cliente>/` (created by copying `sites/_template` if the client site does not exist yet, and setting `"name": "@sites/<slug-cliente>"` in `sites/<slug-cliente>/package.json`).
- Client domain & metadata: `sites/<slug-cliente>/src/config/site.ts` (`CLIENT_DOMAIN`, `name`, `title`, `description`, `contact`, `socials`).
- Routes/Pages: `sites/<slug-cliente>/src/pages/`.
- Client-specific components & SVGs: `sites/<slug-cliente>/src/components/` (use `.astro` by default for static structure/sections, and Preact `.tsx` islands only for client-side interactivity).
- Static assets (images, fonts, videos): `sites/<slug-cliente>/public/` (or `sites/<slug-cliente>/src/assets/`).
- Research & inspection notes: `docs/research/<slug-cliente>/` and `docs/design-references/<slug-cliente>/`.

Rules for mapping:
- Never modify `sites/_template` directly for a specific client clone; always work inside `sites/<slug-cliente>/`.
- A first root clone for a client replaces `sites/<slug-cliente>/src/pages/index.astro`.
- Preserve source pathnames for multiple pages from one origin. Query/fragment variations usually represent states of the same route; reproduce those states.
- Preserve existing authored routes/assets (`robots.txt.ts`, `sitemap`). Update them when requested; resolve unrequested route collisions before replacing anything.
- When adding pages to an existing client clone in `sites/<slug-cliente>/`, extend its layout and `src/styles/global.css` without breaking styles used by existing pages.
- Use separate client folders (`sites/<cliente-a>`, `sites/<cliente-b>`) for different origins/clients. Never cross-import between different client folders.
- Escape literal URL segments that conflict with Astro routing syntax (`_`, `[...]`) using supported mechanisms, then verify the actual requested URL.

Finish when every requested URL has a destination inside `sites/<slug-cliente>/` and file ownership is clear.

## 2. Observe before building

Inspect the whole page at desktop and mobile widths. Scroll top to bottom to load lazy media and reveal sticky/pinned scenes. Then exercise menus, tabs, accordions, carousels, hover states, and primary links. Distinguish changes driven by **scroll, click, hover, or time**; a click imitation of a scroll-driven section is a different product.

Treat each observation as one sample of a **rule**. Read declared values (computed styles, CSS variables, a library's live options) rather than inferring them from one rendering, and vary viewport width (including wider than the design), viewport height, input, and state until you know what drives each change. Drive the page with the inputs visitors use (wheel, touch, keyboard, pointer); scripted scrolling bypasses behavior attached to them, such as smooth scrolling.

Save source screenshots labeled with viewport, scroll position, and interaction state under `docs/design-references/<slug-cliente>/`. Capture alternate-state content/assets. Keep one compact page brief in `docs/research/<slug-cliente>/`: section order, typography, layout measurements, asset mapping, and interactions. Add section briefs only when they help independent builders.

Read [the inspection reference](./references/inspection-guide.md) for extraction and state comparison. For **Framer-generated pages, sticky scenes, reveal animations, or animated media**, read [Framer and motion](./references/framer-and-motion.md).

Use the source's real text and the files it actually loads: fonts, images, SVGs, and video. A same-named substitute from another provider or icon set has different metrics or shapes. Measure important geometry/computed styles. Inspect layered images and media elements before rebuilding a visual as HTML. Track source URL → local asset path (`sites/<slug-cliente>/public/...`) and verify content type/dimensions: a `.png` URL may return AVIF.

Finish when every section and meaningful state has enough evidence to build, with unavailable details identified. A large DOM dump does not replace looking at the page.

## 3. Build a complete first pass

Establish fonts, page width, colors/CSS variables (`sites/<slug-cliente>/src/styles/global.css`), assets, routes, page-wide behavior, and shared components first. Build each component with every observed state (hover, focus, breakpoints) so builders reuse it as-is. Reuse fitting primitives from `@repo/ui` and helpers from `@repo/utils`. Prefer `.astro` components + CSS for layout/simple motion, and Preact (`.tsx`) islands (`client:load`, `client:visible`, `client:idle`) or an animation library when source behavior needs client-side state.

Build coherent sections with real content. Delegate independent pages/sections after shared files have an owner. Give builders screenshots, relevant measurements/state notes, asset paths, destination files, and a concrete finish line. A concise brief with precise file references is enough; no fixed agent count or per-component paperwork is required.

Recreate in-scope interactions. Preserve real outbound destinations. Rewrite links to local routes when those routes are included; leave out-of-scope destinations pointing to the source and disclose them. Visible controls must perform the behavior they promise.

Run the client site check (`pnpm --filter @sites/<slug-cliente> check` and `pnpm --filter @sites/<slug-cliente> build`) after an integrated slice. Finish this pass when every requested section/route renders with actual assets and important controls work.

## 4. Compare, repair, repeat

Open source/local pages at the **same viewport, scroll position, and state**. Let fonts, media, and reveal animations settle. Review the whole page wherever step 2 found a rule changing, plus a viewport wider than the design; judge scroll and pointer behavior with real input. A side-by-side montage locates drift; full-size sections establish detail.

Fix the largest visible differences first: geometry, missing sections/layers, typography/wrapping, asset crop, then spacing and motion. Recheck affected views. Compare animated regions in initial, active, and settled states, including reverse scroll when relevant.

Exercise the real local workflow: navigation between cloned routes, mobile menu, tab/accordion states, carousel boundaries, primary actions, media controls, and observed scroll-linked transitions. Check runtime errors, missing assets, and horizontal overflow. When adding pages, verify existing routes still work. Use a few browser checks at these boundaries rather than assertions about class names.

Run the client site's production check:
```bash
pnpm --filter @sites/<slug-cliente> check
pnpm --filter @sites/<slug-cliente> build
```
Completion requires a successful build **and** rendered comparison. State remaining differences precisely instead of calling an unchecked result pixel-perfect.

## Deliver

Return preview/run instructions (`pnpm --filter @sites/<slug-cliente> dev`), the source-to-local route map, configured client domain in `src/config/site.ts`, representative desktop/mobile comparisons, checks actually run, and remaining visual/functional gaps.
