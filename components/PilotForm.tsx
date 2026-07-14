"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { pilotForm } from "@/lib/copy";

/**
 * The pilot intake form — THREE fields. Sibling to WaitlistForm (the lightweight
 * "keep me posted" path); the two share only design tokens + the Formspree POST.
 *
 * It asked nine. See the note on `pilotForm` in lib/copy.ts for why it no longer
 * does — the short version is that discovery data you never receive is worth
 * nothing, and the cut questions now get asked in the founder's reply, where
 * they cost the applicant nothing to answer.
 *
 * No form library — plain useState + an errors map (one form, static page, perf
 * budget). Static-export-safe: client fetch to Formspree, env var inlined via
 * NEXT_PUBLIC_, no server actions/API routes.
 */

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // identical to WaitlistForm

type FieldName = "incident" | "hasRecording" | "email";

type Values = Record<FieldName | "honeypot", string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "unconfigured";

const EMPTY: Values = {
  incident: "",
  hasRecording: "",
  email: "",
  honeypot: "",
};

// Visual order — drives the error-summary list so it matches the form.
const ORDER: FieldName[] = ["incident", "hasRecording", "email"];

const f = pilotForm.fields;

const inputClass =
  "w-full rounded-lg border border-ground-line bg-ground-raised px-4 py-3 text-[15px] text-ink " +
  "placeholder:text-ink-dim outline-none transition-colors focus-visible:border-teal " +
  "focus-visible:ring-2 focus-visible:ring-teal/50 disabled:opacity-60";

export function PilotForm() {
  // useId() returns colon-delimited ids (":r0:"); strip the colons so every id —
  // and the error-summary anchors built from them — is a valid CSS selector. The
  // global Lenis smooth-scroll handler resolves in-page anchors via querySelector,
  // which throws on a leading ":".
  const baseId = useId().replace(/:/g, "");
  const fid = (name: string) => `${baseId}-${name}`;
  const errId = (name: string) => `${baseId}-${name}-err`;
  const hintId = (name: string) => `${baseId}-${name}-hint`;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitting";

  // On success the whole form is replaced; move focus to the confirmation so
  // keyboard / screen-reader users aren't dropped to <body>.
  useEffect(() => {
    if (status === "success") requestAnimationFrame(() => successRef.current?.focus());
  }, [status]);

  function set(name: FieldName | "honeypot", v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (name !== "honeypot" && errors[name as FieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as FieldName];
        return next;
      });
    }
    if (status === "error" || status === "unconfigured") setStatus("idle");
  }

  function validate(v: Values): Errors {
    const e: Errors = {};
    if (v.incident.trim().length < 20) e.incident = f.incident.error;
    if (!v.hasRecording) e.hasRecording = f.hasRecording.error;
    if (!EMAIL_RE.test(v.email)) e.email = f.email.error;
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    // Honeypot: a filled hidden field means a bot. Fake-succeed, no network call.
    if (values.honeypot) {
      setStatus("success");
      return;
    }
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    if (!FORMSPREE_ID) {
      setStatus("unconfigured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // The email is the only identity we now collect — subject off that.
          _subject: `Pilot — ${values.email || "new applicant"}`,
          source: pilotForm.source,
          incident: values.incident,
          has_recording: values.hasRecording,
          email: values.email,
          _gotcha: values.honeypot,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-teal/30 bg-ground-raised p-8 text-center shadow-glow-teal outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
      >
        <p className="font-display text-xl font-semibold text-ink">{pilotForm.success.title}</p>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-dim">
          {pilotForm.success.body}
        </p>
      </div>
    );
  }

  const errorList = ORDER.filter((name) => errors[name]);
  const formMsg =
    status === "error" ? pilotForm.error : status === "unconfigured" ? pilotForm.unconfigured : "";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full text-left">
      {/* Error summary — assertive, focus-managed, links jump to each field. */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-7 rounded-lg border border-amber/40 bg-amber/[0.06] p-4 outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
        >
          <p className="text-[13px] font-semibold text-amber">{pilotForm.errorSummaryTitle}</p>
          <ul className="mt-2 space-y-1 text-[13px] text-ink-dim">
            {errorList.map((name) => (
              <li key={name}>
                <a
                  href={`#${fid(name)}`}
                  className="focus-ring underline decoration-amber/50 underline-offset-2 hover:text-ink"
                >
                  {errors[name]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Three fields, no fieldsets — at this length, chunking is just more chrome
          to read. The failure first: it is the only one they came here to answer. */}
      <div className="flex flex-col gap-6">
        <Field name="incident" label={f.incident.label} hint={f.incident.help} required error={errors.incident} fid={fid} errId={errId} hintId={hintId}>
          {(ids) => (
            <textarea
              {...ids}
              rows={4}
              maxLength={1200}
              value={values.incident}
              disabled={busy}
              onChange={(e) => set("incident", e.target.value)}
              placeholder={f.incident.placeholder}
              aria-invalid={!!errors.incident}
              className={inputClass}
            />
          )}
        </Field>

        <RadioGroup
          name="hasRecording"
          legend={f.hasRecording.label}
          hint={f.hasRecording.help}
          options={f.hasRecording.options}
          value={values.hasRecording}
          error={errors.hasRecording}
          disabled={busy}
          onChange={(v) => set("hasRecording", v)}
          fid={fid}
          errId={errId}
          hintId={hintId}
        />

        <Field name="email" label={f.email.label} required error={errors.email} fid={fid} errId={errId} hintId={hintId}>
          {(ids) => (
            <input
              {...ids}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              disabled={busy}
              onChange={(e) => set("email", e.target.value)}
              placeholder={f.email.placeholder}
              aria-invalid={!!errors.email}
              className={inputClass}
            />
          )}
        </Field>
      </div>

      {/* anti-spam honeypot — off-screen, never reached by keyboard/SR */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={fid("honeypot")}>Leave this field empty</label>
        <input
          id={fid("honeypot")}
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => set("honeypot", e.target.value)}
        />
      </div>

      <div className="mt-9">
        <button
          type="submit"
          disabled={busy}
          className="focus-ring-amber w-full rounded-lg bg-amber px-5 py-3.5 text-[15px] font-semibold text-ground shadow-glow transition-[transform,box-shadow,filter,opacity] duration-200 hover:-translate-y-px hover:shadow-[0_0_48px_-6px_rgba(255,180,84,0.6)] hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {busy ? pilotForm.sending : pilotForm.submit}
        </button>

        {/* form-level status (error/unconfigured) shares the slot with the reassurance */}
        <div className="relative mt-3 min-h-[1.25rem] text-[13px]">
          <p aria-live="assertive" className="text-amber">
            {formMsg}
          </p>
          {!formMsg && <p className="text-ink-dim">{pilotForm.nextStep}</p>}
        </div>
        <p className="mt-1 text-[12px] text-ink-faint">{pilotForm.privacy}</p>
      </div>
    </form>
  );
}

// ── Field wrapper: label + optional hint + render-prop control + no-CLS error slot ──
type Ids = { id: string; "aria-describedby": string | undefined };

function Field({
  name,
  label,
  hint,
  required,
  error,
  children,
  fid,
  errId,
  hintId,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: (ids: Ids) => ReactNode;
  fid: (n: string) => string;
  errId: (n: string) => string;
  hintId: (n: string) => string;
}) {
  const describedBy = [error ? errId(name) : null, hint ? hintId(name) : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fid(name)} className="text-[13px] font-medium text-ink">
        {label}
        {required && (
          <>
            <span className="ml-1 text-amber" aria-hidden>
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {hint && (
        <p id={hintId(name)} className="text-[12px] leading-snug text-ink-faint">
          {hint}
        </p>
      )}
      {children({ id: fid(name), "aria-describedby": describedBy || undefined })}
      <p id={errId(name)} className="min-h-[1rem] text-[12px] text-amber">
        {error}
      </p>
    </div>
  );
}

// ── Radio group: <fieldset>/<legend> with native radios (free keyboard a11y) ──
function RadioGroup({
  name,
  legend,
  hint,
  options,
  value,
  error,
  disabled,
  onChange,
  fid,
  errId,
  hintId,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: readonly { value: string; label: string }[];
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  fid: (n: string) => string;
  errId: (n: string) => string;
  hintId: (n: string) => string;
}) {
  const describedBy = [error ? errId(name) : null, hint ? hintId(name) : null]
    .filter(Boolean)
    .join(" ");
  return (
    // The error summary links to `#${fid(name)}`, and a <fieldset> has no id of
    // its own — so that link pointed at nothing and clicking the radio group's
    // error did nothing at all. The id lands here (the radios are suffixed
    // -yes/-no/-unsure and none of them owns the group's name), and tabIndex=-1
    // makes the fragment actually MOVE FOCUS rather than merely scroll.
    <fieldset
      id={fid(name)}
      tabIndex={-1}
      className="flex flex-col gap-2 outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
      aria-describedby={describedBy || undefined}
    >
      <legend className="text-[13px] font-medium text-ink">
        {legend}
        <span className="ml-1 text-amber" aria-hidden>
          *
        </span>
        <span className="sr-only"> (required)</span>
      </legend>
      {hint && (
        <p id={hintId(name)} className="text-[12px] leading-snug text-ink-faint">
          {hint}
        </p>
      )}
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {options.map((opt) => {
          const optId = `${fid(name)}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-ink-dim"
            >
              <input
                id={optId}
                type="radio"
                name={fid(name)}
                value={opt.value}
                checked={value === opt.value}
                disabled={disabled}
                onChange={() => onChange(opt.value)}
                className="h-4 w-4 accent-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      <p id={errId(name)} className="min-h-[1rem] text-[12px] text-amber">
        {error}
      </p>
    </fieldset>
  );
}
