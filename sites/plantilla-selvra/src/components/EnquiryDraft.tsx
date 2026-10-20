import { useEffect, useId, useRef, useState } from "preact/hooks";

export interface EnquiryOption {
  value: string;
  label: string;
}

export interface EnquiryLabels {
  notice: string;
  choice: string;
  choose: string;
  arrival: string;
  departure: string;
  guests: string;
  name: string;
  email: string;
  message: string;
  required: string;
  submit: string;
  errorRequired: string;
  errorEmail: string;
  errorGuests: string;
  errorDates: string;
  ready: string;
  draftLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  copyHint: string;
  sendEmail: string;
  draftTitle: string;
  draftChoice: string;
  draftDates: string;
  draftGuests: string;
  draftName: string;
  draftEmail: string;
  emailSubject: string;
}

export interface EnquiryDraftProps {
  options: EnquiryOption[];
  labels: EnquiryLabels;
  /** Correo de destino del botón "Send by email"; vacío lo oculta */
  recipient?: string;
}

type FieldName = "choice" | "arrival" | "departure" | "guests" | "name" | "email" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER: FieldName[] = ["choice", "arrival", "departure", "guests", "name", "email"];

/**
 * Borrador de consulta local (como el componente de la fuente): valida los campos, compone un
 * texto que se puede copiar o abrir en el correo y no envía nada a ningún servidor.
 */
export function EnquiryDraft({ options, labels, recipient }: EnquiryDraftProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({
    choice: "",
    arrival: "",
    departure: "",
    guests: "2",
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get("interest");
    if (interest && options.some((option) => option.value === interest)) {
      setValues((current) => ({ ...current, choice: interest }));
    }
  }, [options]);

  const update = (field: FieldName) => (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    setValues((current) => ({ ...current, [field]: target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    for (const field of FIELD_ORDER) {
      if (!values[field].trim()) next[field] = labels.errorRequired;
    }
    if (!next.guests && Number(values.guests) < 1) next.guests = labels.errorGuests;
    if (!next.email && !EMAIL_PATTERN.test(values.email.trim())) next.email = labels.errorEmail;
    if (!next.departure && !next.arrival && values.departure <= values.arrival) {
      next.departure = labels.errorDates;
    }
    return next;
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    const firstInvalid = FIELD_ORDER.find((field) => next[field]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-${firstInvalid}`)}`)
        ?.focus();
      setDraft("");
      return;
    }
    const choice = options.find((option) => option.value === values.choice)?.label ?? "";
    const lines = [
      labels.draftTitle,
      "",
      `${labels.draftChoice}: ${choice}`,
      `${labels.draftDates}: ${values.arrival} → ${values.departure}`,
      `${labels.draftGuests}: ${values.guests}`,
      `${labels.draftName}: ${values.name.trim()}`,
      `${labels.draftEmail}: ${values.email.trim()}`,
    ];
    if (values.message.trim()) lines.push("", values.message.trim());
    setDraft(lines.join("\n"));
    setCopyStatus("");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus(labels.copied);
    } catch {
      setCopyStatus(labels.copyFailed);
    }
  }

  const fieldProps = (field: FieldName) => ({
    id: `${id}-${field}`,
    value: values[field],
    onInput: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
  });

  const fieldError = (field: FieldName) =>
    errors[field] ? (
      <span class="enquiry__error" id={`${id}-${field}-error`}>
        {errors[field]}
      </span>
    ) : null;

  const requiredLabel = (text: string) => (
    <>
      {text} <span aria-hidden="true">{labels.required}</span>
    </>
  );

  const mailto = recipient
    ? `mailto:${recipient}?subject=${encodeURIComponent(labels.emailSubject)}&body=${encodeURIComponent(draft)}`
    : "";

  return (
    <section class="enquiry" aria-label={labels.submit}>
      <p class="enquiry__notice">{labels.notice}</p>
      <form ref={formRef} class="enquiry__grid" noValidate onSubmit={onSubmit}>
        <label class="enquiry__field enquiry__field--wide" for={`${id}-choice`}>
          {requiredLabel(labels.choice)}
          <select {...fieldProps("choice")} required onChange={update("choice")}>
            <option value="">{labels.choose}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError("choice")}
        </label>
        <label class="enquiry__field" for={`${id}-arrival`}>
          {requiredLabel(labels.arrival)}
          <input type="date" required {...fieldProps("arrival")} />
          {fieldError("arrival")}
        </label>
        <label class="enquiry__field" for={`${id}-departure`}>
          {requiredLabel(labels.departure)}
          <input
            type="date"
            required
            min={values.arrival || undefined}
            {...fieldProps("departure")}
          />
          {fieldError("departure")}
        </label>
        <label class="enquiry__field" for={`${id}-guests`}>
          {requiredLabel(labels.guests)}
          <input type="number" min="1" step="1" required {...fieldProps("guests")} />
          {fieldError("guests")}
        </label>
        <label class="enquiry__field" for={`${id}-name`}>
          {requiredLabel(labels.name)}
          <input type="text" maxLength={120} autoComplete="name" required {...fieldProps("name")} />
          {fieldError("name")}
        </label>
        <label class="enquiry__field" for={`${id}-email`}>
          {requiredLabel(labels.email)}
          <input
            type="email"
            maxLength={254}
            autoComplete="email"
            required
            {...fieldProps("email")}
          />
          {fieldError("email")}
        </label>
        <label class="enquiry__field enquiry__field--wide" for={`${id}-message`}>
          {labels.message}
          <textarea rows={5} maxLength={4000} {...fieldProps("message")} />
        </label>
        <div class="enquiry__field--wide">
          <button type="submit" class="enquiry__button surface">
            {labels.submit}
          </button>
        </div>
      </form>

      {draft && (
        <div class="enquiry__result">
          <p role="status">{labels.ready}</p>
          <label class="enquiry__field" for={`${id}-draft`}>
            {labels.draftLabel}
            <textarea id={`${id}-draft`} rows={10} readOnly value={draft} />
          </label>
          <div class="enquiry__actions">
            <button type="button" class="enquiry__button surface" onClick={copyDraft}>
              {labels.copy}
            </button>
            {mailto && (
              <a class="enquiry__button enquiry__button--ghost surface" href={mailto}>
                {labels.sendEmail}
              </a>
            )}
          </div>
          <p aria-live="polite">{copyStatus || labels.copyHint}</p>
        </div>
      )}
    </section>
  );
}
