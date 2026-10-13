import { useState } from "preact/hooks";
import { UiIcon } from "@/components/UiIcon";
import type { ImageAsset } from "@/data/content";

export interface RoomSlide {
  title: string;
  image: ImageAsset;
}

export interface RoomsCarouselProps {
  slides: RoomSlide[];
  labels: { region: string; previous: string; next: string };
}

/** Escala y desplazamiento de cada tarjeta según su distancia a la activa (medidos en la fuente). */
const LAYOUT: Record<number, { scale: number; shift: number; z: number }> = {
  0: { scale: 0.95, shift: 0, z: 10 },
  1: { scale: 0.765, shift: 357.5, z: 9 },
  2: { scale: 0.63, shift: 357.5, z: 8 },
};

/** Carrusel coverflow: en desktop muestra 5 tarjetas escalonadas; en tablet y mobile, una. */
export function RoomsCarousel({ slides, labels }: RoomsCarouselProps) {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const go = (delta: number) => setActive((i) => (i + delta + total) % total);
  const half = Math.floor(total / 2);

  return (
    <section class="rooms-carousel" aria-roledescription="carousel" aria-label={labels.region}>
      <div class="rooms-carousel__stage">
        {slides.map((slide, i) => {
          const offset = ((i - active + total + half) % total) - half;
          const layout = LAYOUT[Math.min(Math.abs(offset), 2)];
          const dir = Math.sign(offset);
          const isActive = offset === 0;
          return (
            <figure
              key={slide.image.src}
              class={`rooms-carousel__card${isActive ? " is-active" : ""}`}
              style={{
                "--shift": `${dir * layout.shift}px`,
                "--scale": layout.scale,
                zIndex: layout.z,
              }}
              aria-hidden={!isActive}
              aria-label={`${i + 1} / ${total}`}
            >
              <img src={slide.image.src} alt={slide.image.alt} loading="lazy" decoding="async" />
              <figcaption>{slide.title}</figcaption>
            </figure>
          );
        })}
      </div>
      <div class="rooms-carousel__arrows">
        <button type="button" aria-label={labels.previous} onClick={() => go(-1)}>
          <UiIcon name="chevronLeft" size={20} />
        </button>
        <button type="button" aria-label={labels.next} onClick={() => go(1)}>
          <UiIcon name="chevronRight" size={20} />
        </button>
      </div>
    </section>
  );
}
