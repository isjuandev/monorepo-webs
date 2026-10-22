import { useEffect, useState } from "preact/hooks";
import { Calendar } from "@/components/planner/Calendar";
import type { PlannerLabels } from "@/data/content";
import { addDays, fromIso, nightsBetween, todayIso } from "@/lib/dates";
import { formatNumber, LOCALE } from "@/lib/format";
import { ICON_PATHS } from "@/lib/icons";

export interface PlannerHouse {
  slug: string;
  name: string;
  price: number;
  image: { src: string; alt: string };
}

export interface PlannerProgram {
  slug: string;
  name: string;
  nights: number;
  price: number;
}

export interface StayPlannerProps {
  /** "compact" = tarjeta de la portada que enlaza al planificador; "full" = página de reserva */
  variant: "compact" | "full";
  houses: PlannerHouse[];
  programs: PlannerProgram[];
  defaults: { house: string; program: string; nights: number; leadDays: number };
  booked: string[];
  sunrise: string;
  currencySymbol: string;
  contactEmail: string;
  planHref: string;
  labels: PlannerLabels;
}

const NO_PROGRAM = "none";
const shortDate = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function Icon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/**
 * Planificador de estancia de la fuente: el calendario elige llegada y salida (el primer clic fija
 * la llegada y conserva la duración; el segundo, la salida), y el resumen recalcula noches y total
 * (noches × precio de la casa + programa). En la página completa se elige además la casa, el
 * programa y los datos; al enviar se abre el correo con la solicitud lista.
 */
export function StayPlanner(props: StayPlannerProps) {
  const { variant, houses, programs, defaults, booked, labels } = props;
  const initialStart = addDays(todayIso(), defaults.leadDays);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(addDays(initialStart, defaults.nights));
  const [pickingEnd, setPickingEnd] = useState(false);
  const [houseSlug, setHouseSlug] = useState(defaults.house);
  const [programSlug, setProgramSlug] = useState(defaults.program);
  const [status, setStatus] = useState("");
  const [minDate, setMinDate] = useState(todayIso());

  // Fechas reales del visitante y, en la página completa, la selección que llega por la URL.
  useEffect(() => {
    const today = todayIso();
    setMinDate(today);
    const params = new URLSearchParams(window.location.search);
    const arrive = params.get("arrive");
    const depart = params.get("depart");
    const nextStart = arrive && arrive >= today ? arrive : addDays(today, defaults.leadDays);
    setStart(nextStart);
    setEnd(depart && depart > nextStart ? depart : addDays(nextStart, defaults.nights));
    const house = params.get("house");
    if (house && houses.some((item) => item.slug === house)) setHouseSlug(house);
    const program = params.get("program");
    if (program && (program === NO_PROGRAM || programs.some((item) => item.slug === program))) {
      setProgramSlug(program);
    }
  }, [defaults.leadDays, defaults.nights, houses, programs]);

  const house = houses.find((item) => item.slug === houseSlug) ?? houses[0];
  const program = programs.find((item) => item.slug === programSlug);
  const nights = Math.max(nightsBetween(start, end), 1);
  const total = nights * (house?.price ?? 0) + (program?.price ?? 0);
  const price = (value: number) => `${props.currencySymbol}${formatNumber(value)}`;
  const nightsText = (count: number) =>
    `${count} ${count === 1 ? labels.nightOne : labels.nightMany}`;
  const nightsWords = labels.nightWords[nights] || nightsText(nights);
  const programText = program ? program.name : labels.noProgramShort;

  const select = (iso: string) => {
    if (pickingEnd && iso > start) {
      setEnd(iso);
      setPickingEnd(false);
      return;
    }
    setStart(iso);
    setEnd(addDays(iso, nights));
    setPickingEnd(true);
  };

  const query = new URLSearchParams({
    arrive: start,
    depart: end,
    house: houseSlug,
    program: programSlug,
  }).toString();

  const calendar = (
    <Calendar
      start={start}
      end={end}
      minDate={minDate}
      booked={booked}
      labels={labels}
      onSelect={select}
    />
  );

  if (variant === "compact") {
    return (
      <div class="planner-card">
        <div class="planner-card__calendar">
          {calendar}
          <p class="planner-card__legend">
            {labels.legendBooked}. {labels.legendFullMoon}.
          </p>
        </div>
        <div class="planner-card__summary">
          <p class="planner-card__eyebrow">{labels.yourStay}</p>
          <dl class="planner-rows">
            <div>
              <dt>{labels.arrive}</dt>
              <dd>
                {shortDate.format(fromIso(start))} — {labels.fromTime} {labels.checkIn}
              </dd>
            </div>
            <div>
              <dt>{labels.depart}</dt>
              <dd>
                {shortDate.format(fromIso(end))} — {labels.byTime} {labels.checkOut}
              </dd>
            </div>
            <div>
              <dt>{labels.suite}</dt>
              <dd>{house?.name}</dd>
            </div>
            <div>
              <dt>{labels.program}</dt>
              <dd>
                {programText} — {nightsText(nights)}
              </dd>
            </div>
            <div>
              <dt>{labels.guests}</dt>
              <dd>{labels.guestsValue}</dd>
            </div>
          </dl>
          <div class="planner-total">
            <span>{labels.from}</span>
            <strong>{price(total)}</strong>
          </div>
          <a class="btn btn--accent btn--block" href={`${props.planHref}?${query}`}>
            {labels.request}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d={ICON_PATHS["arrow-right"]} />
            </svg>
          </a>
          <p class="planner-card__note">{labels.noteShort}</p>
        </div>
      </div>
    );
  }

  const submit = (event: Event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const lines = [
      `${labels.arrive}: ${shortDate.format(fromIso(start))} (${labels.checkIn})`,
      `${labels.depart}: ${shortDate.format(fromIso(end))} (${labels.checkOut})`,
      `${labels.house}: ${house?.name}`,
      `${labels.program}: ${programText}`,
      `${labels.guests}: ${labels.guestsValue}`,
      `${labels.total}: ${price(total)}`,
      "",
      `${labels.form.name.label}: ${data.get("name")}`,
      `${labels.form.email.label}: ${data.get("email")}`,
      `${labels.form.phone.label}: ${data.get("phone")}`,
      `${labels.form.arriving.label}: ${data.get("arriving")}`,
      `${labels.form.notes.label}: ${data.get("notes")}`,
    ];
    window.location.href = `mailto:${props.contactEmail}?subject=${encodeURIComponent(
      `${labels.subject} — ${house?.name}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setStatus(labels.sent);
  };

  return (
    <form class="planner" onSubmit={submit} noValidate>
      <div class="planner__steps">
        <section class="planner__step">
          <h2 class="planner__heading">{labels.stepDates}</h2>
          <div class="planner__calendar">{calendar}</div>
          <p class="planner__legend">
            <span class="planner__moon" aria-hidden="true" />
            {labels.legendFullMoon}
            <span class="planner__legend-gap">{labels.legendBooked}</span>
          </p>
        </section>

        <fieldset class="planner__step">
          <legend class="planner__heading">{labels.stepHouse}</legend>
          <div class="planner__houses">
            {houses.map((item) => (
              <label key={item.slug} class="house-option">
                <input
                  type="radio"
                  name="house"
                  value={item.slug}
                  checked={item.slug === houseSlug}
                  onChange={() => setHouseSlug(item.slug)}
                />
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={262}
                  height={180}
                  loading="lazy"
                />
                <span class="house-option__name">{item.name}</span>
                <span class="house-option__price">
                  {price(item.price)} {labels.perNight}
                </span>
                <span class="house-option__radio" aria-hidden="true" />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset class="planner__step">
          <legend class="planner__heading">{labels.stepProgram}</legend>
          <div class="planner__programs">
            <label class="program-option">
              <input
                type="radio"
                name="program"
                value={NO_PROGRAM}
                checked={programSlug === NO_PROGRAM}
                onChange={() => setProgramSlug(NO_PROGRAM)}
              />
              <span>{labels.noProgram}</span>
            </label>
            {programs.map((item) => (
              <label key={item.slug} class="program-option">
                <input
                  type="radio"
                  name="program"
                  value={item.slug}
                  checked={item.slug === programSlug}
                  onChange={() => setProgramSlug(item.slug)}
                />
                <span class="program-option__name">{item.name}</span>
                <span class="program-option__nights">
                  <Icon name="moon" />
                  {nightsText(item.nights)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset class="planner__step">
          <legend class="planner__heading">{labels.stepDetails}</legend>
          <div class="planner__fields">
            <label class="field">
              <span>{labels.form.name.label}</span>
              <input
                name="name"
                required
                autocomplete="name"
                placeholder={labels.form.name.placeholder}
              />
            </label>
            <label class="field">
              <span>{labels.form.email.label}</span>
              <input
                name="email"
                type="email"
                required
                autocomplete="email"
                placeholder={labels.form.email.placeholder}
              />
            </label>
            <label class="field">
              <span>{labels.form.phone.label}</span>
              <input
                name="phone"
                type="tel"
                autocomplete="tel"
                placeholder={labels.form.phone.placeholder}
              />
            </label>
            <label class="field field--select">
              <span>{labels.form.arriving.label}</span>
              <select name="arriving">
                {labels.form.arriving.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <Icon name="chevron-down" />
            </label>
            <label class="field field--wide">
              <span>{labels.form.notes.label}</span>
              <textarea name="notes" rows={3} placeholder={labels.form.notes.placeholder} />
            </label>
          </div>
        </fieldset>
      </div>

      <aside class="planner__summary" aria-live="polite">
        <p class="planner__title">
          {labels.titleTemplate
            .replace("{nights}", nightsWords)
            .replace("{house}", house?.name ?? "")}
        </p>
        <dl class="planner-rows planner-rows--dark">
          <div>
            <dt>{labels.arrive}</dt>
            <dd class="planner-rows__chips">
              <span class="chip chip--dark">{shortDate.format(fromIso(start))}</span>
              <span class="chip chip--dark">
                <Icon name="clock" />
                {labels.checkIn}
              </span>
            </dd>
          </div>
          <div>
            <dt>{labels.depart}</dt>
            <dd class="planner-rows__chips">
              <span class="chip chip--dark">{shortDate.format(fromIso(end))}</span>
              <span class="chip chip--dark">
                <Icon name="clock" />
                {labels.checkOut}
              </span>
            </dd>
          </div>
          <div>
            <dt>{labels.house}</dt>
            <dd>{house?.name}</dd>
          </div>
          <div>
            <dt>{labels.program}</dt>
            <dd>{programText}</dd>
          </div>
          <div>
            <dt>{labels.guests}</dt>
            <dd>{labels.guestsValue}</dd>
          </div>
          <div>
            <dt>{labels.sunrise}</dt>
            <dd>{props.sunrise}</dd>
          </div>
        </dl>
        <div class="planner-total planner-total--dark">
          <span>{labels.total}</span>
          <strong>{price(total)}</strong>
        </div>
        <button type="submit" class="btn btn--accent btn--block">
          {labels.send}
        </button>
        <p class="planner__note">{status || labels.note}</p>
      </aside>
    </form>
  );
}
