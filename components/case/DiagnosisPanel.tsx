import { caseDemo as cd } from "@/lib/copy";
import { caseRecord as rec, fmtRel } from "@/lib/case-record";

/**
 * THE DIAGNOSIS PANEL — likely cause, the evidence at divergence, and the next
 * action. Witness discipline: the next action is an INSPECTION the team
 * performs, never a fix Torsen performs. Every evidence row carries its offset
 * from first divergence; clicking one will jump the playhead (interactive
 * phase). The disclaimer footer is the page's honesty line — it stays.
 */
export function DiagnosisPanel() {
  const d = rec.diagnosis;
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
            className="focus-ring mt-4 rounded-lg border border-teal/50 px-4 py-2 text-[13px] font-medium text-teal transition-colors hover:bg-teal/10"
          >
            {d.nextAction.cta}
          </button>
        </div>
      </div>

      <footer className="border-t border-ground-line px-5 py-3">
        <p className="text-[10px] leading-relaxed text-ink-faint">{cd.disclaimer}</p>
      </footer>
    </aside>
  );
}
