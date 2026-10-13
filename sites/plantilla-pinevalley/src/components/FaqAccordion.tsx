import { UiIcon } from "@/components/UiIcon";
import type { FaqItem } from "@/data/content";
import { useState } from "preact/hooks";

export interface FaqAccordionProps {
  items: FaqItem[];
}

/** Acordeón: la fila abierta se encoge a 0.98 y el icono gira de + a ×. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul class="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `faq-answer-${i}`;
        return (
          <li key={item.question} class={`faq-row${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              class="faq-row__question"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <UiIcon name="plus" size={16} class="faq-row__icon" />
            </button>
            <div class="faq-row__answer" id={id} aria-hidden={!isOpen}>
              <div>
                <p>
                  {item.answer.split("\n").map((line, j) => (
                    <span key={line}>
                      {j > 0 && <br class="lb" />}
                      {j > 0 ? ` ${line}` : line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
