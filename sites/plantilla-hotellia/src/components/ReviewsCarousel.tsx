import type { Review } from "@/data/content";
import { useState } from "preact/hooks";

export interface ReviewsCarouselProps {
  reviews: Review[];
}

/**
 * Testimonios con navegación por puntos. Como en la fuente, el cambio es inmediato
 * y solo la primera reseña usa la tipografía display; el resto usa Inter.
 */
export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [active, setActive] = useState(0);
  const review = reviews[active];

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") setActive((active + 1) % reviews.length);
    if (event.key === "ArrowLeft") setActive((active - 1 + reviews.length) % reviews.length);
  };

  return (
    <div class="reviews-card" aria-roledescription="carousel" aria-label="Visitor reviews">
      <div class="reviews-card__review" aria-live="polite">
        <p class={active === 0 ? "reviews-card__quote is-display" : "reviews-card__quote"}>
          {review.quote}
        </p>
        <p class="reviews-card__author">{review.author}</p>
      </div>
      <div
        class="reviews-card__dots"
        role="tablist"
        aria-label="Select review"
        onKeyDown={onKeyDown}
      >
        {reviews.map((item, index) => (
          <button
            key={item.author}
            type="button"
            role="tab"
            class={index === active ? "reviews-card__dot is-active" : "reviews-card__dot"}
            aria-selected={index === active}
            aria-label={`Review ${index + 1}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}
