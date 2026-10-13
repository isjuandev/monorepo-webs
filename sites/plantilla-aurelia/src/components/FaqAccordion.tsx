import { useState } from "preact/hooks";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div class="faq-accordion-wrap">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const headerId = `faq-header-${idx}`;

        return (
          <div key={item.question} class={`faq-item ${isOpen ? "is-expanded" : ""}`}>
            <button
              type="button"
              id={headerId}
              class="faq-trigger"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span class="faq-question-text">{item.question}</span>
              <span class="faq-icon-indicator" aria-hidden="true">
                <svg
                  class={`plus-svg ${isOpen ? "is-rotated" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <title>Toggle question</title>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>

            <section
              id={panelId}
              aria-labelledby={headerId}
              class={`faq-content ${isOpen ? "content-open" : ""}`}
            >
              <div class="faq-answer-inner">
                <p>{item.answer}</p>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
