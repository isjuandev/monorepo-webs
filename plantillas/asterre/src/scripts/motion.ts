// Movimiento global de la plantilla: entradas al hacer scroll, parallax, ticker y fondos por hover.
// Todo es vanilla TS + CSS; respeta prefers-reduced-motion.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    for (const el of targets) el.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  for (const el of targets) observer.observe(el);
}

interface ScrollLayer {
  el: HTMLElement;
  update: (rect: DOMRect, viewport: number) => void;
}

function initScrollLayers(): void {
  if (reducedMotion) return;
  const layers: ScrollLayer[] = [];

  // Parallax: la capa (400px más alta que su sección) se desplaza de -0 a +400px de forma lineal.
  for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    const host = el.parentElement;
    if (!host) continue;
    const distance = Number(el.dataset.parallax) || 400;
    layers.push({
      el: host,
      update: (rect, viewport) => {
        const progress = (viewport - rect.top) / (viewport + rect.height);
        const clamped = Math.min(Math.max(progress, 0), 1);
        el.style.transform = `translate3d(0, ${clamped * distance}px, 0)`;
      },
    });
  }

  // Desplazamiento vertical por velocidad (galerías escalonadas).
  for (const el of document.querySelectorAll<HTMLElement>("[data-speed]")) {
    const speed = Number(el.dataset.speed) || 0;
    layers.push({
      el,
      update: (rect, viewport) => {
        const center = rect.top + rect.height / 2 - viewport / 2;
        el.style.transform = `translate3d(0, ${center * speed * -1}px, 0)`;
      },
    });
  }

  // Ticker: cada fila se desplaza horizontalmente en sentidos opuestos según el scroll.
  for (const row of document.querySelectorAll<HTMLElement>("[data-ticker-row]")) {
    const direction = row.dataset.tickerRow === "right" ? 1 : -1;
    const section = row.closest<HTMLElement>("section");
    if (!section) continue;
    layers.push({
      el: section,
      update: (rect, viewport) => {
        const progress = (viewport - rect.top) / (viewport + rect.height);
        const offset = (progress - 0.5) * 0.6 * row.scrollWidth * direction;
        row.style.transform = `translate3d(${offset}px, 0, 0)`;
      },
    });
  }

  if (layers.length === 0) return;

  let ticking = false;
  const render = () => {
    ticking = false;
    const viewport = window.innerHeight;
    for (const layer of layers) {
      const rect = layer.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewport + 200) continue;
      layer.update(rect, viewport);
    }
  };
  const requestRender = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  render();
}

function initHoverBackgrounds(): void {
  for (const group of document.querySelectorAll<HTMLElement>("[data-hover-group]")) {
    const images = group.querySelectorAll<HTMLElement>("[data-hover-image]");
    const triggers = group.querySelectorAll<HTMLElement>("[data-hover-trigger]");
    const show = (key: string) => {
      for (const img of images) img.classList.toggle("is-active", img.dataset.hoverImage === key);
    };
    for (const trigger of triggers) {
      const key = trigger.dataset.hoverTrigger ?? "default";
      trigger.addEventListener("mouseenter", () => show(key));
      trigger.addEventListener("focus", () => show(key));
      trigger.addEventListener("mouseleave", () => show("default"));
      trigger.addEventListener("blur", () => show("default"));
    }
  }
}

document.documentElement.classList.add("js");
initReveal();
initScrollLayers();
initHoverBackgrounds();
