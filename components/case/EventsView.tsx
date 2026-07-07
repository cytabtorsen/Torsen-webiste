import { caseDemo as cd } from "@/lib/copy";
import { caseRecord as rec, fmtRel, type CaseEventKind } from "@/lib/case-record";

/**
 * THE EVENTS VIEW — the record's event log, flat and timestamped. Selecting a
 * row jumps the playhead there and returns to Replay (the row is an index into
 * the timeline, not a destination). Divergence/failure rows carry the amber
 * failure hue; the rest stay quiet.
 */

const KIND_CHIP: Record<CaseEventKind, string> = {
  info: "border-ground-line text-ink-faint",
  warn: "border-ground-line text-ink-dim",
  divergence: "border-amber/40 text-amber",
  failure: "border-amber/40 text-amber",
};

export function EventsView({ onJump }: { onJump: (t: number) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ground-line bg-ground-raised">
      <p className="eyebrow border-b border-ground-line px-5 py-3.5">{cd.events.heading}</p>
      <ul className="divide-y divide-ground-line/60 overflow-y-auto" data-lenis-prevent>
        {rec.events.map((e) => (
          <li key={`${e.t}-${e.label}`}>
            <button
              type="button"
              onClick={() => onJump(e.t)}
              className="focus-ring flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-ground"
            >
              <span className="w-14 shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                {fmtRel(e.t)}
              </span>
              <span
                className={`w-24 shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[9px] uppercase tracking-wider ${KIND_CHIP[e.kind]}`}
              >
                {e.kind}
              </span>
              <span className="text-[13px] text-ink-dim">{e.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
