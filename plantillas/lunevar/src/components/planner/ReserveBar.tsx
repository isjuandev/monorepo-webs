import { useEffect, useRef, useState } from "preact/hooks";
import { Calendar, type CalendarLabels } from "@/components/planner/Calendar";
import { fromIso, todayIso } from "@/lib/dates";
import { LOCALE } from "@/lib/format";
import { ICON_PATHS } from "@/lib/icons";

export interface ReserveBarProps {
  labels: {
    date: string;
    datePlaceholder: string;
    time: string;
    times: string[];
    guests: string;
    maxGuests: number;
    cta: string;
    subject: string;
    missingDate: string;
    sent: string;
  };
  calendar: CalendarLabels;
  contactEmail: string;
}

const dateText = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d={ICON_PATHS["chevron-down"]} />
    </svg>
  );
}

/**
 * Barra "Reservar puesto" de la mesa larga: fecha en un calendario emergente (Esc o clic fuera lo
 * cierran), hora y huéspedes. Al reservar se abre el correo con la petición lista para enviar.
 */
export function ReserveBar({ labels, calendar, contactEmail }: ReserveBarProps) {
  const [date, setDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(labels.times[0] ?? "");
  const [guests, setGuests] = useState("1");
  const [status, setStatus] = useState("");
  const [minDate, setMinDate] = useState(todayIso());
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setMinDate(todayIso()), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const reserve = () => {
    if (!date) {
      setStatus(labels.missingDate);
      setOpen(true);
      return;
    }
    const body = [
      `${labels.date}: ${dateText.format(fromIso(date))}`,
      `${labels.time}: ${time}`,
      `${labels.guests}: ${guests}`,
    ].join("\n");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(body)}`;
    setStatus(labels.sent);
  };

  return (
    <div class="reserve" ref={root}>
      <div class="reserve__bar">
        <div class="reserve__field">
          <span class="reserve__label">{labels.date}</span>
          <button
            ref={trigger}
            type="button"
            class="reserve__date"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(!open)}
          >
            {date ? dateText.format(fromIso(date)) : labels.datePlaceholder}
          </button>
        </div>
        <label class="reserve__field">
          <span class="reserve__label">{labels.time}</span>
          <span class="reserve__select">
            <select value={time} onChange={(event) => setTime(event.currentTarget.value)}>
              {labels.times.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Chevron />
          </span>
        </label>
        <label class="reserve__field">
          <span class="reserve__label">{labels.guests}</span>
          <span class="reserve__select">
            <select value={guests} onChange={(event) => setGuests(event.currentTarget.value)}>
              {Array.from({ length: labels.maxGuests }, (_, index) => String(index + 1)).map(
                (option) => (
                  <option key={option}>{option}</option>
                )
              )}
            </select>
            <Chevron />
          </span>
        </label>
        <button type="button" class="reserve__cta" onClick={reserve}>
          {labels.cta}
        </button>
      </div>
      {open && (
        <div class="reserve__popover" role="dialog" aria-label={labels.date}>
          <Calendar
            start={date}
            minDate={minDate}
            labels={calendar}
            onSelect={(iso) => {
              setDate(iso);
              setOpen(false);
              setStatus("");
              trigger.current?.focus();
            }}
          />
        </div>
      )}
      <p class="reserve__status" role="status">
        {status}
      </p>
    </div>
  );
}
