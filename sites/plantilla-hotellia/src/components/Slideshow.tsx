import type { ImageAsset } from "@/data/content";
import { useEffect, useRef, useState } from "preact/hooks";

export interface SlideshowProps {
  slides: ImageAsset[];
  prevIcon: string;
  nextIcon: string;
}

const GAP = 10;

/**
 * Carrusel infinito de Wine & Dine: avanza solo con las flechas (sin autoplay), como la fuente.
 * Se renderizan tres copias de las diapositivas y se recoloca el índice sin transición
 * al salir de la copia central.
 */
export function Slideshow({ slides, prevIcon, nextIcon }: SlideshowProps) {
  const count = slides.length;
  const [index, setIndex] = useState(count);
  const [animate, setAnimate] = useState(true);
  const trackRef = useRef<HTMLUListElement>(null);
  const items = [...slides, ...slides, ...slides];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onEnd = () => {
      if (index < count || index >= count * 2) {
        setAnimate(false);
        setIndex((((index % count) + count) % count) + count);
      }
    };
    track.addEventListener("transitionend", onEnd);
    return () => track.removeEventListener("transitionend", onEnd);
  }, [index, count]);

  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const go = (step: number) => {
    setAnimate(true);
    setIndex((value) => value + step);
  };

  const current = ((index % count) + count) % count;

  return (
    <div class="slideshow" aria-roledescription="carousel" aria-label="Wine & Dine">
      <ul
        ref={trackRef}
        class="slideshow__track"
        style={{
          transform: `translateX(calc(${-index * 100}% - ${index * GAP}px))`,
          transition: animate ? undefined : "none",
        }}
      >
        {items.map((slide, i) => (
          <li
            key={`${slide.src}-${i}`}
            class="slideshow__slide"
            aria-hidden={i !== index}
            aria-label={`${(i % count) + 1} / ${count}`}
          >
            <img src={slide.src} alt={slide.alt} width={1168} height={784} loading="lazy" />
          </li>
        ))}
      </ul>
      <div class="slideshow__controls">
        <button
          type="button"
          class="slideshow__button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <img src={prevIcon} alt="" width={40} height={40} />
        </button>
        <button
          type="button"
          class="slideshow__button"
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          <img src={nextIcon} alt="" width={40} height={40} />
        </button>
      </div>
      <p class="visually-hidden" aria-live="polite">{`Slide ${current + 1} of ${count}`}</p>
    </div>
  );
}
