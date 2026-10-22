/**
 * Acordeones de una sola apertura (`[data-accordion]`): cada `[data-accordion-item]` tiene un botón
 * `[data-accordion-toggle]` (aria-expanded) y un panel `[data-accordion-panel]` que se despliega con
 * una transición de altura en CSS (grid-template-rows 0fr → 1fr).
 */
for (const accordion of document.querySelectorAll<HTMLElement>("[data-accordion]")) {
  const items = [...accordion.querySelectorAll<HTMLElement>("[data-accordion-item]")];

  const setOpen = (target: HTMLElement | null) => {
    for (const item of items) {
      const open = item === target;
      item.classList.toggle("is-open", open);
      const toggle = item.querySelector<HTMLButtonElement>("[data-accordion-toggle]");
      toggle?.setAttribute("aria-expanded", String(open));
      const label = open ? toggle?.dataset.labelClose : toggle?.dataset.labelOpen;
      if (label) toggle?.setAttribute("aria-label", label);
      item.querySelector<HTMLElement>("[data-accordion-panel]")?.toggleAttribute("inert", !open);
    }
  };

  for (const item of items) {
    item.querySelector("[data-accordion-toggle]")?.addEventListener("click", () => {
      setOpen(item.classList.contains("is-open") ? null : item);
    });
  }
  setOpen(items.find((item) => item.classList.contains("is-open")) ?? null);
}
