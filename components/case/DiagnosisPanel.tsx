import { useState } from "react";
import { caseDemo as cd } from "@/lib/copy";
import {
  caseRecord as rec,
  fmtRel,
  unaccounted,
  type CaseEvidence,
  type Hypothesis,
} from "@/lib/case-record";

/**
 * THE DIAGNOSIS PANEL — likely cause, ranked hypotheses that argue against
 * themselves, what the record CANNOT settle, and the ACTION DOCK: a live
 * inspection checklist that, once complete, unlocks binding the resolution to a
 * policy version — at which point Torsen's role flips from explaining to
 * WATCHING (the falsifiable-fix beat). Witness discipline throughout: the team
 * inspects, files, resolves — on its own systems; Torsen records and watches,
 * never acts on the robot. The disclaimer footer is the page's honesty line.
 *
 * This panel used to show ONE flat "Likely cause: Path blocked" and nothing
 * else — no confidence, no alternatives, no counter-evidence, no admission of
 * what it couldn't see. That is precisely the artefact the r/ROS thread said it
 * would not trust, and it was right not to: an unhedged answer is unfalsifiable,
 * so it cannot be checked, so it cannot be believed. Every element below exists
 * to make the diagnosis CHECKABLE — including the parts that make it look less
 * certain, which are the parts that make it worth reading.
 */

/** Evidence line — clicking it drives the playhead to the moment it cites. */
function EvidenceLine({
  ev,
  tone,
  onEvidence,
}: {
  ev: CaseEvidence;
  tone: "for" | "against";
  onEvidence: (t: number, signalId: string | null) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onEvidence(ev.t, ev.signalId)}
        className="focus-ring flex w-full items-baseline gap-2 rounded text-left transition-colors hover:bg-ground/60"
      >
        <span
          aria-hidden="true"
          className={`shrink-0 font-mono text-[11px] ${tone === "for" ? "text-teal/80" : "text-amber/80"}`}
        >
          {tone === "for" ? "+" : "−"}
        </span>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-faint">
          {fmtRel(ev.t)}
        </span>
        <span className="text-[12px] leading-snug text-ink-dim">{ev.text}</span>
      </button>
    </li>
  );
}

function HypothesisRow({
  h,
  defaultOpen,
  onEvidence,
}: {
  h: Hypothesis;
  defaultOpen: boolean;
  onEvidence: (t: number, signalId: string | null) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const out = h.status === "ruled-out";
  const pct = Math.round(h.confidence * 100);
  const missing = rec.diagnosis.coverage.missing.filter((m) => (h.wouldMove ?? []).includes(m.id));

  return (
    <li className="border-t border-ground-line/70 py-3 first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="focus-ring w-full rounded text-left"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span
            className={`text-[13px] leading-snug ${
              out ? "text-ink-faint line-through decoration-ink-faint/40" : "text-ink"
            }`}
          >
            {h.claim}
          </span>
          <span
            className={`shrink-0 font-mono text-[11px] tabular-nums ${
              h.status === "leading" ? "text-amber" : out ? "text-ink-faint" : "text-ink-dim"
            }`}
          >
            {out ? cd.hypotheses.ruledOut : `${pct}%`}
          </span>
        </span>
        {/* the confidence bar — same visual language as the unaccounted bar
            below it, so the shortfall reads as a peer, not as leftover space */}
        {!out && (
          <span
            aria-hidden="true"
            className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-ground"
          >
            <span
              className={`block h-full rounded-full ${
                h.status === "leading" ? "bg-amber" : "bg-teal/50"
              }`}
              style={{ width: `${pct}%` }}
            />
          </span>
        )}
      </button>

      {out && h.ruledOutBy && (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">{h.ruledOutBy}</p>
      )}

      {open && (
        <div className="mt-3 space-y-3">
          {h.supporting.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {cd.hypotheses.supporting}
              </p>
              <ul className="mt-1.5 space-y-1">
                {h.supporting.map((ev) => (
                  <EvidenceLine key={ev.text} ev={ev} tone="for" onEvidence={onEvidence} />
                ))}
              </ul>
            </div>
          )}
          {/* Never optional for a live hypothesis — the generator refuses to
              emit one without it. If you are reading only the row above, you
              are reading the half that flatters us. */}
          {h.counter.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber/70">
                {cd.hypotheses.counter}
              </p>
              <ul className="mt-1.5 space-y-1">
                {h.counter.map((ev) => (
                  <EvidenceLine key={ev.text} ev={ev} tone="against" onEvidence={onEvidence} />
                ))}
              </ul>
            </div>
          )}
          {missing.length > 0 && (
            <p className="text-[11px] leading-relaxed text-ink-faint">
              {cd.hypotheses.wouldMove}{" "}
              <span className="text-ink-dim">{missing.map((m) => m.signal).join(" · ")}</span>
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export function DiagnosisPanel({
  checked,
  onToggleItem,
  resolved,
  onResolve,
  onEvidence,
}: {
  checked: boolean[];
  onToggleItem: (i: number) => void;
  resolved: boolean;
  onResolve: () => void;
  onEvidence: (t: number, signalId: string | null) => void;
}) {
  const d = rec.diagnosis;
  // How far ahead of the unaided starting point the record lands you.
  const headStart = rec.baseline.noticed.t - rec.baseline.firstDeparture.t;
  const gap = unaccounted([...d.hypotheses]);
  const [listOpen, setListOpen] = useState(false);
  // Coverage is the densest block and reads as documentation, so the ceiling
  // statement shows always and the per-signal instrumentation detail is opt-in.
  // The limit is the honesty; the four capture recipes are the follow-through.
  const [coverageOpen, setCoverageOpen] = useState(false);
  const done = checked.filter(Boolean).length;
  const allDone = done === rec.workflow.checklist.length;
  return (
    <aside className="flex shrink-0 flex-col border-t border-ground-line lg:w-80 lg:border-l lg:border-t-0">
      <div className="border-b border-ground-line px-5 py-4">
        <p className="eyebrow">{cd.diagnosis.heading}</p>
      </div>

      <div className="flex-1 px-5 py-5 lg:overflow-y-auto">
        <p className="text-[12px] text-ink-dim">{cd.diagnosis.likelyCause}</p>
        {/* The confidence rides WITH the cause, never apart from it. "Path
            blocked" alone is a verdict; "Path blocked, 68%" is a claim you can
            argue with — and the hypotheses below are how you argue. */}
        <p className="mt-1 flex items-baseline gap-2.5 font-display text-[26px] font-semibold leading-tight text-amber [text-shadow:0_0_18px_rgba(255,180,84,0.35)]">
          {d.likelyCause}
          <span className="font-mono text-[13px] font-medium tabular-nums text-amber/70 [text-shadow:none]">
            {Math.round(d.confidence * 100)}%
          </span>
        </p>

        {/* The head start. This is the case for the baseline existing: the stop
            is where an engineer starts unaided, and by then the run had already
            been outside the known-good envelope for `gap` seconds. Computed
            from the record — never a typed-in number. */}
        <div className="mt-5 rounded-lg border border-ground-line bg-ground-raised px-3.5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {cd.diagnosis.headStart}
          </p>
          <p className="mt-1.5 font-display text-[22px] font-semibold leading-none text-teal">
            {headStart.toFixed(1)} s{" "}
            <span className="font-sans text-[12px] font-normal text-ink-dim">
              {cd.diagnosis.headStartUnit}
            </span>
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
            {rec.baseline.firstDeparture.text}
          </p>
        </div>

        <p className="mt-7 text-[12px] text-ink-dim">{cd.diagnosis.evidence}</p>
        <ul className="mt-3 space-y-3">
          {d.evidence.map((ev) => (
            <li key={ev.text} className="flex items-baseline gap-2.5">
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-faint">{fmtRel(ev.t)}</span>
              <span className="text-[13px] leading-snug text-ink-dim">{ev.text}</span>
            </li>
          ))}
        </ul>

        {/* ── HYPOTHESES — ranked, each carrying the case against itself ── */}
        <div className="mt-8 border-t border-ground-line pt-5">
          <p className="eyebrow">{cd.hypotheses.heading}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
            {cd.hypotheses.calibration}
          </p>

          <ul className="mt-3">
            {d.hypotheses.map((h) => (
              <HypothesisRow
                key={h.id}
                h={h}
                defaultOpen={h.status === "leading"}
                onEvidence={onEvidence}
              />
            ))}
          </ul>

          {/* The shortfall, rendered as a peer of the hypotheses rather than
              hidden. Confidences that sum to 1.00 are a tell, not a virtue. */}
          {gap > 0.005 && (
            <div className="mt-3 border-t border-dashed border-ground-line pt-3">
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-ink-dim">{cd.hypotheses.unaccounted}</span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-dim">
                  {Math.round(gap * 100)}%
                </span>
              </p>
              <span
                aria-hidden="true"
                className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-ground"
              >
                <span
                  className="block h-full rounded-full border border-dashed border-ink-faint/50"
                  style={{ width: `${Math.round(gap * 100)}%` }}
                />
              </span>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                {cd.hypotheses.unaccountedNote}
              </p>
            </div>
          )}
        </div>

        {/* ── COVERAGE — what it cannot settle, and the signal that would.
             The ceiling statement is always visible (that is the honesty); the
             four instrumentation recipes are opt-in behind a count. ── */}
        <div className="mt-8 border-t border-ground-line pt-5">
          <p className="eyebrow">{cd.coverage.heading}</p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-dim">{d.coverage.limit}</p>

          <button
            type="button"
            aria-expanded={coverageOpen}
            onClick={() => setCoverageOpen((o) => !o)}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-teal/50 px-4 py-2 text-[12px] font-medium text-teal transition-colors hover:bg-teal/10"
          >
            {cd.coverage.missingHeading}
            <span className="font-mono text-[10px] tabular-nums text-teal/70">
              {d.coverage.missing.length}
            </span>
          </button>

          {coverageOpen && (
            <ul className="mt-3 space-y-3">
              {d.coverage.missing.map((m) => (
                <li key={m.id} className="rounded-lg border border-ground-line bg-ground-raised p-3">
                  <p className="text-[13px] font-medium text-ink">{m.signal}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
                    <span className="text-ink-faint">{cd.coverage.settles} — </span>
                    {m.settles}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
                    <span className="font-mono">{cd.coverage.capture} — </span>
                    {m.capture}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 border-t border-ground-line pt-5">
          <p className="eyebrow">{cd.diagnosis.nextAction}</p>
          <p className="mt-3 text-[15px] font-semibold text-ink">{d.nextAction.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{d.nextAction.body}</p>

          <button
            type="button"
            aria-expanded={listOpen}
            onClick={() => setListOpen((o) => !o)}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-teal/50 px-4 py-2 text-[13px] font-medium text-teal transition-colors hover:bg-teal/10"
          >
            {listOpen ? cd.workflow.checklistHide : d.nextAction.cta}
            <span className="font-mono text-[10px] tabular-nums text-teal/70">
              {done}/{rec.workflow.checklist.length}
            </span>
          </button>

          {listOpen && (
            <ul className="mt-3 space-y-2">
              {rec.workflow.checklist.map((item, i) => (
                <li key={item}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked[i]}
                    onClick={() => onToggleItem(i)}
                    className="focus-ring flex w-full items-start gap-2.5 rounded text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        checked[i] ? "border-teal bg-teal" : "border-ground-line bg-ground"
                      }`}
                    >
                      {checked[i] && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-ground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2.5 6.5 5 9 9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`text-[13px] leading-snug transition-colors ${
                        checked[i] ? "text-ink-faint line-through decoration-ink-faint/40" : "text-ink-dim"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* the falsifiable fix: complete the inspection → bind the resolution
              to a version → Torsen's role flips from explaining to watching */}
          {resolved ? (
            <p className="mt-4 text-[12px] leading-relaxed text-teal">
              {cd.workflow.boundTo} {rec.workflow.resolveIn} — {cd.workflow.watched}
            </p>
          ) : (
            allDone && (
              <button
                type="button"
                onClick={onResolve}
                className="focus-ring mt-4 rounded-lg bg-teal px-4 py-2 text-[13px] font-semibold text-ground shadow-glow-teal transition-[transform,filter] hover:-translate-y-px hover:brightness-105 active:translate-y-0"
              >
                {cd.workflow.resolveCta} {rec.workflow.resolveIn}
              </button>
            )
          )}

          <div className="mt-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-ground-line px-2 py-1 font-mono text-[10px] text-ink-dim">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.6 2.5h4.9v4.9l-6 6-4.9-4.9z" />
                <circle cx="11" cy="5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
              {rec.workflow.ticket.ref} ·{" "}
              {resolved ? cd.workflow.ticketResolvedState : rec.workflow.ticket.state}
            </span>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-faint">
            {cd.workflow.ticketCaption}
          </p>
        </div>
      </div>

      <footer className="border-t border-ground-line px-5 py-3">
        <p className="text-[10px] leading-relaxed text-ink-faint">{cd.disclaimer}</p>
      </footer>
    </aside>
  );
}
