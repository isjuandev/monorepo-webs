/**
 * Filtros en píldora (`[data-filter-group]`): cada botón `[data-filter]` (aria-pressed) muestra solo
 * los `[data-filter-item]` cuyo `data-tags` contiene su valor ("all" muestra todos). Los elementos
 * que reaparecen entran con un fundido corto; si no queda ninguno se muestra `[data-filter-empty]`.
 */
for (const group of document.querySelectorAll<HTMLElement>("[data-filter-group]")) {
  const scope = group.closest<HTMLElement>("[data-filter-scope]") ?? document.body;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  const items = [...scope.querySelectorAll<HTMLElement>("[data-filter-item]")];
  const empty = scope.querySelector<HTMLElement>("[data-filter-empty]");

  const apply = (value: string) => {
    let visible = 0;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === value));
    }
    for (const item of items) {
      const show = value === "all" || (item.dataset.tags ?? "").split(" ").includes(value);
      item.hidden = !show;
      if (show) {
        visible++;
        item.animate?.(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 450,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      }
    }
    if (empty) empty.hidden = visible > 0;
  };

  for (const button of buttons) {
    button.addEventListener("click", () => apply(button.dataset.filter ?? "all"));
  }
}
