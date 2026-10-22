/**
 * Carriles horizontales arrastrables (`[data-drag-scroll]`): con ratón se arrastran como el "Drag
 * track" de Framer; con táctil, rueda o teclado usan el scroll nativo. Un arrastre de más de 6 px
 * cancela el clic para no abrir enlaces por accidente.
 */
for (const track of document.querySelectorAll<HTMLElement>("[data-drag-scroll]")) {
  let startX = 0;
  let startScroll = 0;
  let dragging = false;
  let moved = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 6) moved = true;
    track.scrollLeft = startScroll - delta;
  });

  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener(
    "click",
    (event) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    },
    true
  );

  track.addEventListener("dragstart", (event) => event.preventDefault());
}
