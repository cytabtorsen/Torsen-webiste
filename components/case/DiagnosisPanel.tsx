import { useState } from "react";
import { caseDemo as cd } from "@/lib/copy";
import { caseRecord as rec, fmtRel } from "@/lib/case-record";

/**
 * THE DIAGNOSIS PANEL — likely cause, the evidence at divergence, and the
 * ACTION DOCK: a live inspection checklist that, once complete, unlocks
 * binding the resolution to a policy version — at which point Torsen's role
 * flips from explaining to WATCHING (the falsifiable-fix beat). Witness
 * discipline throughout: the team inspects, files, resolves — on its own
 * systems; Torsen records and watches, never acts on the robot.
 * The disclaimer footer is the page's honesty line — it stays.
 */
export function DiagnosisPanel({
  checked,
  onToggleItem,
  resolved,
  onResolve,
}: {
  checked: boolean[];
  onToggleItem: (i: number) => void;
  resolved: boolean;
  onResolve: () => void;
}) {
  const d = rec.diagnosis;
  // How far ahead of the unaided starting point the record lands you.
  const headStart = rec.baseline.noticed.t - rec.baseline.firstDeparture.t;
  const [listOpen, setListOpen] = useState(false);
  const done = checked.filter(Boolean).length;
  const allDone = done === rec.workflow.checklist.length;
  return (
    <aside className="flex shrink-0 flex-col border-t border-ground-line lg:w-80 lg:border-l lg:border-t-0">
      <div className="border-b border-ground-line px-5 py-4">
        <p className="eyebrow">{cd.diagnosis.heading}</p>
      </div>

      <div className="flex-1 px-5 py-5 lg:overflow-y-auto">
        <p className="text-[12px] text-ink-dim">{cd.diagnosis.likelyCause}</p>
        <p className="mt-1 font-display text-[26px] font-semibold leading-tight text-amber [text-shadow:0_0_18px_rgba(255,180,84,0.35)]">
          {d.likelyCause}
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
