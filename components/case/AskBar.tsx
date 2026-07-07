"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { caseDemo as cd } from "@/lib/copy";
import {
  caseRecord as rec,
  fmtRel,
  type CaseMoment,
  type CaseQuery,
} from "@/lib/case-record";

/**
 * ASK THE RECORD — the query surface over the case. Two result kinds from one
 * bar: ANSWERS (the record's curated, grounded question set) and MOMENTS (the
 * searchable timeline index, each with a signal-context spark). Picking either
 * jumps the playhead and lights the grounding lane amber.
 *
 * HONESTY — matching is plain token overlap against the record's own curated
 * set; nothing is generated. A miss says so in-product ("not in this record")
 * and re-offers the set — the graceful-fallback path is part of the demo.
 *
 * "/" focuses the bar from anywhere on the page (booth ergonomics).
 */

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

function score(needle: string[], hay: Set<string>): number {
  let n = 0;
  for (const w of needle) {
    if (hay.has(w)) n += 2;
    else if (w.length > 2 && [...hay].some((h) => h.startsWith(w))) n += 1;
  }
  return n;
}

const QUERY_INDEX = rec.queries.map((q) => ({
  q,
  hay: new Set([...tokens(q.q), ...q.aliases.flatMap(tokens)]),
}));
const MOMENT_INDEX = rec.moments.map((m) => ({ m, hay: new Set(tokens(m.label)) }));

/** Mini signal-context trace for a moment card — the lane slice, in the lane's hue. */
function MomentSpark({ moment }: { moment: CaseMoment }) {
  const signal = rec.signals.find((s) => s.id === moment.signalId);
  if (!signal) return null;
  const { t0, dt, values } = signal.series;
  const [lo, hi] = signal.scale;
  const i0 = Math.max(0, Math.round((moment.window[0] - t0) / dt));
  const i1 = Math.min(values.length - 1, Math.round((moment.window[1] - t0) / dt));
  const stride = Math.max(1, Math.floor((i1 - i0) / 48));
  const pts: string[] = [];
  for (let i = i0; i <= i1; i += stride) {
    const y = 100 - ((Math.min(hi, Math.max(lo, values[i])) - lo) / (hi - lo)) * 100;
    pts.push(`${i - i0},${y.toFixed(1)}`);
  }
  return (
    <svg
      viewBox={`0 0 ${i1 - i0} 100`}
      preserveAspectRatio="none"
      className="h-5 w-12 shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth={1.5}
        className={signal.emphasis ? "stroke-amber/90" : "stroke-teal/80"}
      />
    </svg>
  );
}

export function AskBar({
  onAnswer,
  onMoment,
}: {
  onAnswer: (q: CaseQuery) => void;
  onMoment: (m: CaseMoment) => void;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Booth ergonomics: "/" focuses the bar from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = useMemo(() => tokens(value), [value]);
  const answers = useMemo(() => {
    if (!needle.length) return [];
    return QUERY_INDEX.map(({ q, hay }) => ({ q, s: score(needle, hay) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((r) => r.q);
  }, [needle]);
  const moments = useMemo(() => {
    if (!needle.length) return rec.moments;
    return MOMENT_INDEX.map(({ m, hay }) => ({ m, s: score(needle, hay) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((r) => r.m);
  }, [needle]);
  const missed = needle.length > 0 && answers.length === 0 && moments.length === 0;

  const pickAnswer = (q: CaseQuery) => {
    setValue(q.q);
    setOpen(false);
    onAnswer(q);
  };
  const pickMoment = (m: CaseMoment) => {
    setOpen(false);
    onMoment(m);
  };

  return (
    <div className="relative shrink-0">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="7" cy="7" r="4.5" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-label={cd.ask.label}
        placeholder={cd.ask.placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && answers.length) pickAnswer(answers[0]);
        }}
        className="focus-ring w-full rounded-lg border border-ground-line bg-ground-raised py-2.5 pl-9 pr-10 text-[14px] text-ink placeholder:text-ink-faint"
      />
      <kbd
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-ground-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint"
      >
        /
      </kbd>

      {open && (
        // preventDefault keeps input focus so onBlur doesn't race the click
        <div
          role="listbox"
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-ground-line bg-ground-raised shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]"
        >
          {missed && <p className="px-4 pb-1 pt-3 text-[12px] text-ink-dim">{cd.ask.fallback}</p>}

          {(answers.length > 0 || missed || !needle.length) && (
            <div className="px-2 pb-1 pt-2">
              <p className="eyebrow px-2 pb-1.5 text-[0.62rem]">
                {needle.length && !missed ? cd.ask.answersHeading : cd.ask.suggestedHeading}
              </p>
              {(answers.length ? answers : rec.queries.slice(0, 4)).map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => pickAnswer(q)}
                  className="focus-ring flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] text-ink-dim transition-colors hover:bg-ground hover:text-ink"
                >
                  <span aria-hidden="true" className="font-mono text-[11px] text-teal/80">
                    ?
                  </span>
                  {q.q}
                </button>
              ))}
            </div>
          )}

          {moments.length > 0 && (
            <div className="border-t border-ground-line px-2 pb-2 pt-2">
              <p className="eyebrow px-2 pb-1.5 text-[0.62rem]">{cd.ask.momentsHeading}</p>
              {moments.map((m) => (
                <button
                  key={`${m.t}-${m.label}`}
                  type="button"
                  onClick={() => pickMoment(m)}
                  className="focus-ring flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-ground"
                >
                  <MomentSpark moment={m} />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-dim">{m.label}</span>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-faint">
                    {fmtRel(m.t)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * THE GROUNDED ANSWER — a claim the record can back, with its evidence rows.
 * Each grounding row jumps the playhead to its timestamp; the teal tag names
 * the register ("grounded"), the site's word for tied-to-a-retrieved-signal.
 */
export function AnswerCard({
  query,
  onJump,
  onDismiss,
}: {
  query: CaseQuery;
  onJump: (t: number) => void;
  onDismiss: () => void;
}) {
  return (
    <div className="shrink-0 rounded-lg border border-teal/25 bg-ground-raised px-4 py-3.5 shadow-glow-teal">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] text-ink-faint">{query.q}</p>
        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded bg-teal/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-teal/90">
            {cd.ask.groundedTag}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="focus-ring text-[11px] font-medium text-ink-faint underline decoration-ink-faint/40 underline-offset-2 transition-colors hover:text-ink-dim"
          >
            {cd.ask.dismiss}
          </button>
        </div>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{query.answer}</p>
      <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1">
        {query.grounding.map((g) => (
          <li key={`${g.t}-${g.text}`}>
            <button
              type="button"
              onClick={() => onJump(g.t)}
              className="focus-ring group flex items-baseline gap-1.5 text-left"
            >
              <span className="font-mono text-[10px] tabular-nums text-teal/90">{fmtRel(g.t)}</span>
              <span className="text-[12px] text-ink-dim transition-colors group-hover:text-ink">
                {g.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
