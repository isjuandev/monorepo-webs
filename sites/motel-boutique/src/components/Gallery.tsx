import { useEffect, useRef, useState } from "preact/hooks";

export interface GalleryItem {
  label: string;
  tone: string;
}

export interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastTrigger.current?.focus();
    };
  }, [active, items.length]);

  const current = active === null ? null : items[active];

  return (
    <div class="gallery">
      <ul class="gallery__grid">
        {items.map((item, index) => (
          <li key={item.label}>
            <button
              type="button"
              class="gallery__thumb"
              style={{ background: item.tone }}
              aria-label={`Ver ${item.label} en tamaño completo`}
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                setActive(index);
              }}
            />
          </li>
        ))}
      </ul>
      {current && (
        <dialog open class="gallery__lightbox" aria-modal="true" aria-label={current.label}>
          <button
            type="button"
            class="gallery__backdrop"
            aria-label="Cerrar"
            onClick={() => setActive(null)}
          />
          <div class="gallery__image" style={{ background: current.tone }} />
          <button
            ref={closeRef}
            type="button"
            class="gallery__close"
            aria-label="Cerrar"
            onClick={() => setActive(null)}
          >
            &times;
          </button>
        </dialog>
      )}
      <style>{`
        .gallery__grid { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
        .gallery__thumb { display: block; width: 100%; aspect-ratio: 1; border: 0; cursor: zoom-in; transition: opacity 0.2s ease; }
        .gallery__thumb:hover, .gallery__thumb:focus-visible { opacity: 0.8; }
        .gallery__lightbox { position: fixed; inset: 0; z-index: 50; width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; color: #fff; background: rgb(0 0 0 / 0.92); display: grid; place-items: center; animation: lb-fade 0.25s ease-out both; }
        .gallery__backdrop { position: absolute; inset: 0; border: 0; background: transparent; cursor: zoom-out; }
        .gallery__image { position: relative; pointer-events: none; }
        .gallery__image { width: min(90vw, 900px); aspect-ratio: 4 / 3; }
        .gallery__close { position: absolute; top: 1rem; right: 1.25rem; background: none; border: 0; color: #fff; font-size: 2.5rem; line-height: 1; cursor: pointer; }
        @keyframes lb-fade { from { opacity: 0; } }
        @media (max-width: 760px) { .gallery__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (prefers-reduced-motion: reduce) { .gallery__lightbox { animation: none; } .gallery__thumb { transition: none; } }
      `}</style>
    </div>
  );
}
