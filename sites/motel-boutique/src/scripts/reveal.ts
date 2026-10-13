const REVEAL_SELECTOR = "[data-reveal]";

function revealAll(elements: NodeListOf<HTMLElement>): void {
  for (const element of elements) {
    element.classList.add("is-visible");
  }
}

function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll(elements);
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
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );

  for (const element of elements) {
    observer.observe(element);
  }
}

initReveal();
