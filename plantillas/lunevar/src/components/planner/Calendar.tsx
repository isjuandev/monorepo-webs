import { useEffect, useState } from "preact/hooks";
import { fromIso, isFullMoon, monthCells } from "@/lib/dates";
import { LOCALE } from "@/lib/format";
import { ICON_PATHS } from "@/lib/icons";

export interface CalendarLabels {
  weekdays: string[];
  previousMonth: string;
  nextMonth: string;
  fullMoon: string;
  booked: string;
}

export interface CalendarProps {
  start: string | null;
  end?: string | null;
  /** Fechas anteriores a esta (AAAA-MM-DD) no se pueden elegir */
  minDate: string;
  booked?: string[];
  labels: CalendarLabels;
  onSelect: (iso: string) => void;
}

const monthTitle = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" });
const dayLabel = new Intl.DateTimeFormat(LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Calendario de la fuente: mes con flechas, inicio y fin en círculo cobre y la banda del rango en
 * arena; las lunas llenas llevan un punto debajo y las fechas completas se atenúan.
 */
export function Calendar({
  start,
  end = null,
  minDate,
  booked = [],
  labels,
  onSelect,
}: CalendarProps) {
  const anchor = fromIso(start ?? minDate);
  const [view, setView] = useState({ year: anchor.getFullYear(), month: anchor.getMonth() });

  useEffect(() => {
    if (!start) return;
    const date = fromIso(start);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  }, [start]);

  const move = (delta: number) => {
    const date = new Date(view.year, view.month + delta, 1);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  };
  const minMonth = fromIso(minDate);
  const canGoBack =
    view.year > minMonth.getFullYear() ||
    (view.year === minMonth.getFullYear() && view.month > minMonth.getMonth());

  return (
    <div class="calendar">
      <div class="calendar__head">
        <p class="calendar__title">
          {capitalize(monthTitle.format(new Date(view.year, view.month, 1)))}
        </p>
        <div class="calendar__nav">
          <button
            type="button"
            class="calendar__arrow"
            aria-label={labels.previousMonth}
            disabled={!canGoBack}
            onClick={() => move(-1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICON_PATHS["chevron-left"]} />
            </svg>
          </button>
          <button
            type="button"
            class="calendar__arrow"
            aria-label={labels.nextMonth}
            onClick={() => move(1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICON_PATHS["chevron-right"]} />
            </svg>
          </button>
        </div>
      </div>
      <div class="calendar__grid">
        {labels.weekdays.map((day) => (
          <span key={day} class="calendar__weekday" aria-hidden="true">
            {day}
          </span>
        ))}
        {monthCells(view.year, view.month).map((iso, index) => {
          if (!iso) return <span key={`gap-${index}`} />;
          const disabled = iso < minDate || booked.includes(iso);
          const isStart = iso === start;
          const isEnd = iso === end;
          const inRange = Boolean(start && end && iso > start && iso < end);
          const moon = isFullMoon(iso);
          const classes = [
            "calendar__day",
            isStart && "is-start",
            isEnd && "is-end",
            inRange && "in-range",
            start && end && isStart && "has-range",
            booked.includes(iso) && "is-booked",
          ]
            .filter(Boolean)
            .join(" ");
          const description = [
            capitalize(dayLabel.format(fromIso(iso))),
            moon ? labels.fullMoon : "",
            booked.includes(iso) ? labels.booked : "",
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              key={iso}
              type="button"
              class={classes}
              disabled={disabled}
              aria-pressed={isStart || isEnd}
              aria-label={description}
              onClick={() => onSelect(iso)}
            >
              <span>{fromIso(iso).getDate()}</span>
              {moon && <i class="calendar__moon" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
