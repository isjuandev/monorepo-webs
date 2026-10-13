export type UiIconName = "chevronLeft" | "chevronRight" | "close" | "plus";

export interface UiIconProps {
  name: UiIconName;
  size?: number;
  class?: string;
}

/** Iconos de control de las islas Preact (mismos trazos que `src/data/icons.ts`). */
export function UiIcon({ name, size = 24, class: className }: UiIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  } as const;
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {name === "chevronLeft" && <polyline points="15 18 9 12 15 6" stroke-width="2" {...common} />}
      {name === "chevronRight" && <polyline points="9 18 15 12 9 6" stroke-width="2" {...common} />}
      {name === "close" && <path d="M18 6 6 18M6 6l12 12" stroke-width="2.5" {...common} />}
      {name === "plus" && (
        <path d="M18.75 5.25 5.25 18.75M18.75 18.75 5.25 5.25" stroke-width="1.5" {...common} />
      )}
    </svg>
  );
}
