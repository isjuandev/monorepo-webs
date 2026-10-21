import { useState } from "preact/hooks";

export interface StayOption {
  slug: string;
  name: string;
  guests: string;
  area: string;
  summary: string;
  image: { src: string; alt: string };
}

export interface StaySelectorProps {
  stays: StayOption[];
  labels: { group: string; selected: string };
}

/**
 * Selector "Three ways to settle in": cada botón (aria-pressed) cambia la foto, el texto y el
 * enlace al detalle. Las fotos se apilan y cambian con un fundido de 0,5 s.
 */
export function StaySelector({ stays, labels }: StaySelectorProps) {
  const [active, setActive] = useState(0);
  const current = stays[active];

  return (
    <div class="stay-selector">
      <fieldset class="stay-selector__options">
        <legend class="visually-hidden">{labels.group}</legend>
        {stays.map((stay, index) => (
          <button
            key={stay.slug}
            type="button"
            class="stay-selector__option surface"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            <span class="t-name">{stay.name}</span>
            <span class="stay-selector__facts t-small">
              <span>{stay.guests}</span>
              <span>{stay.area}</span>
            </span>
            {index === active && <span class="t-label">{labels.selected}</span>}
          </button>
        ))}
      </fieldset>
      <div class="stay-selector__preview">
        <div class="stay-selector__media">
          {stays.map((stay, index) => (
            <img
              key={stay.slug}
              src={stay.image.src}
              alt={index === active ? stay.image.alt : ""}
              aria-hidden={index !== active}
              class={index === active ? "is-active" : undefined}
              width={669}
              height={500}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <p class="t-body" aria-live="polite">
          {current.summary}
        </p>
        <a class="btn btn--secondary" href={`/stays/${current.slug}`}>
          {current.name}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
