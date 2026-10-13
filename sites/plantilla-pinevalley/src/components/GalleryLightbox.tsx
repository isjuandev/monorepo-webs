import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { UiIcon } from "@/components/UiIcon";
import type { GalleryImage } from "@/data/content";

export interface GalleryLightboxLabels {
  cta: string;
  openImage: string;
  dialog: string;
  close: string;
  previous: string;
  next: string;
  counter: string;
}

export interface GalleryLightboxProps {
  images: GalleryImage[];
  labels: GalleryLightboxLabels;
}

const fill = (template: string, n: number, total: number) =>
  template.replace("{n}", String(n)).replace("{total}", String(total));

/** Cuadrícula masonry + visor a pantalla completa (contador, flechas, teclado y Esc). */
export function GalleryLightbox({ images, labels }: GalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = images.length;

  const open = (i: number, trigger: HTMLElement) => {
    opener.current = trigger;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total)),
    [total]
  );

  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    document.dispatchEvent(new CustomEvent<boolean>("scroll-lock", { detail: true }));
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.dispatchEvent(new CustomEvent<boolean>("scroll-lock", { detail: false }));
    };
  }, [isOpen, close, step]);

  useEffect(() => {
    if (!isOpen) opener.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const current = index === null ? null : images[index];

  return (
    <div class="gallery">
      <ul class="gallery__grid">
        {images.map((image, i) => (
          <li key={image.src} class={`gallery__item gallery__item--${image.shape}`}>
            <button
              type="button"
              class="gallery__thumb"
              aria-label={fill(labels.openImage, i + 1, total)}
              onClick={(event) => open(i, event.currentTarget)}
            >
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" class="gallery__cta" onClick={(event) => open(0, event.currentTarget)}>
        {labels.cta}
      </button>

      {current && index !== null && (
        <dialog class="lightbox" open aria-modal="true" aria-label={labels.dialog}>
          <p class="lightbox__counter" aria-live="polite">
            {fill(labels.counter, index + 1, total)}
          </p>
          <button
            ref={closeRef}
            type="button"
            class="lightbox__close"
            aria-label={labels.close}
            onClick={close}
          >
            <UiIcon name="close" />
          </button>
          <button
            type="button"
            class="lightbox__nav lightbox__nav--prev"
            aria-label={labels.previous}
            onClick={() => step(-1)}
          >
            <UiIcon name="chevronLeft" />
          </button>
          <img key={current.src} class="lightbox__image" src={current.src} alt={current.alt} />
          <button
            type="button"
            class="lightbox__nav lightbox__nav--next"
            aria-label={labels.next}
            onClick={() => step(1)}
          >
            <UiIcon name="chevronRight" />
          </button>
        </dialog>
      )}
    </div>
  );
}
