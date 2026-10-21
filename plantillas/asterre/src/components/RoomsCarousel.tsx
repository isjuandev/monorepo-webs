import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { UI_LABELS } from "@/data/content";

export interface CarouselRoom {
  slug: string;
  name: string;
  guests: number;
  size: number;
  view: string;
  price: number;
  image: string;
}

export interface RoomsCarouselProps {
  rooms: CarouselRoom[];
  /** Prefijo de los enlaces de detalle */
  basePath?: string;
  /** Índice inicial dentro de rooms */
  startIndex?: number;
}

interface Metrics {
  slide: number;
  step: number;
}

const DESKTOP: Metrics = { slide: 800, step: 852 };
const MOBILE: Metrics = { slide: 342, step: 320 };

function getMetrics(): Metrics {
  if (typeof window === "undefined") return DESKTOP;
  if (window.innerWidth < 810) return MOBILE;
  if (window.innerWidth < 1200) return { slide: 600, step: 640 };
  return DESKTOP;
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      {direction === "left" ? (
        <path d="M11 6H1M5 2 1 6l4 4" stroke="currentColor" stroke-width="1" />
      ) : (
        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1" />
      )}
    </svg>
  );
}

export function RoomsCarousel({ rooms, basePath = "/rooms", startIndex = 0 }: RoomsCarouselProps) {
  const count = rooms.length;
  // Se triplica la lista para simular un bucle infinito sin saltos visibles.
  const loop = [...rooms, ...rooms, ...rooms];
  const [index, setIndex] = useState(count + startIndex);
  const [animate, setAnimate] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>(DESKTOP);
  const [width, setWidth] = useState(1440);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const onResize = () => {
      setMetrics(getMetrics());
      setWidth(window.innerWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = useCallback((delta: number) => {
    setAnimate(true);
    setIndex((current) => current + delta);
  }, []);

  const onTransitionEnd = () => {
    if (index < count || index >= count * 2) {
      setAnimate(false);
      setIndex((((index % count) + count) % count) + count);
    }
  };

  useEffect(() => {
    if (!animate) {
      const frame = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [animate]);

  const onPointerDown = (event: PointerEvent) => {
    dragStart.current = event.clientX;
    dragged.current = false;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > 40) {
      dragged.current = true;
      go(delta < 0 ? 1 : -1);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  };

  const offset = width / 2 - (index * metrics.step + metrics.step / 2);
  const activeRoom = rooms[index % count];

  return (
    <section
      class="rc"
      aria-roledescription={UI_LABELS.carouselRole}
      aria-label={UI_LABELS.roomsCarousel}
      onKeyDown={onKeyDown}
    >
      <div
        class="rc__track"
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: animate ? "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget) onTransitionEnd();
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
      >
        {loop.map((room, i) => {
          const isActive = i === index;
          return (
            <div
              class={`rc__slot${isActive ? " is-active" : ""}`}
              style={{ width: `${metrics.step}px` }}
              key={`${room.slug}-${i}`}
              aria-hidden={!isActive}
            >
              <a
                href={`${basePath}/${room.slug}`}
                class="rc__slide"
                style={{
                  width: `${metrics.slide}px`,
                  transition: animate ? undefined : "none",
                }}
                tabIndex={isActive ? 0 : -1}
                draggable={false}
                onClick={(event) => {
                  if (dragged.current) {
                    event.preventDefault();
                    dragged.current = false;
                  } else if (!isActive) {
                    event.preventDefault();
                    go(i - index);
                  }
                }}
              >
                <img src={room.image} alt={room.name} loading="lazy" draggable={false} />
                <span class="rc__overlay" />
                <span class="rc__info">
                  <span class="rc__name-group">
                    <span class="t-h3 rc__name">{room.name}</span>
                    <span class="t-body rc__meta">
                      {UI_LABELS.guests(room.guests)} <i /> {UI_LABELS.squareMeters(room.size)}{" "}
                      <i /> {room.view}
                    </span>
                  </span>
                  <span class="t-lead rc__price">{UI_LABELS.fromPerNight(room.price)}</span>
                </span>
              </a>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        class="rc__arrow rc__arrow--prev"
        onClick={() => go(-1)}
        aria-label={UI_LABELS.previousRoom}
      >
        <Arrow direction="left" />
      </button>
      <button
        type="button"
        class="rc__arrow rc__arrow--next"
        onClick={() => go(1)}
        aria-label={UI_LABELS.nextRoom}
      >
        <Arrow direction="right" />
      </button>
      <p class="rc__status" aria-live="polite">
        {activeRoom ? activeRoom.name : ""}
      </p>
    </section>
  );
}
