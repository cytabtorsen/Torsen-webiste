"use client";

import { useState, type FormEvent } from "react";
import { waitlist } from "@/lib/copy";

type Status = "idle" | "submitting" | "success" | "error" | "invalid" | "unconfigured";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Single email capture -> Formspree (no backend; works with static export).
 * Set NEXT_PUBLIC_FORMSPREE_ID to your form id (e.g. "xbjnabcd") to go live.
 * Until then it validates + shows a graceful "not configured" state.
 */
export function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const busy = status === "submitting";
  const done = status === "success";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("invalid");
      return;
    }
    if (!FORMSPREE_ID) {
      setStatus("unconfigured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "torsen.ai waitlist" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success"
      ? waitlist.success
      : status === "error"
        ? waitlist.error
        : status === "invalid"
          ? waitlist.invalid
          : status === "unconfigured"
            ? waitlist.unconfigured
            : "";
  const isError = status === "error" || status === "invalid" || status === "unconfigured";
  const messageTone = status === "success" ? "text-teal" : "text-amber";

  const inputId = `waitlist-email-${variant}`;
  const statusId = `waitlist-status-${variant}`;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Work email address for the early-access waitlist
        </label>
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          disabled={busy || done}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={waitlist.placeholder}
          aria-invalid={status === "invalid"}
          aria-describedby={message ? statusId : undefined}
          className="h-12 flex-1 rounded-lg border border-ground-line bg-ground-raised px-4 text-[15px] text-ink placeholder:text-ink-dim outline-none transition-colors focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/50 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || done}
          className="focus-ring-amber h-12 shrink-0 rounded-lg bg-amber px-5 text-[15px] font-semibold text-ground shadow-glow transition-[transform,opacity] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? waitlist.sending : done ? waitlist.requested : waitlist.cta}
        </button>
      </div>

      {/* Status + privacy share one slot (no layout shift); the live region stays
          empty until a real status change, so SRs don't read the privacy note. */}
      <div className="relative mt-2 min-h-[1.25rem] text-[13px]">
        <p id={statusId} aria-live={isError ? "assertive" : "polite"} className={messageTone}>
          {message}
        </p>
        {!message && <p className="text-ink-dim">{waitlist.privacy}</p>}
      </div>
    </form>
  );
}
