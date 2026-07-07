import { caseDemo as cd } from "@/lib/copy";
import { caseRecord } from "@/lib/case-record";

/**
 * THE LEFT RAIL — brand, the tool's views, and the quiet provenance footer.
 * Glyphs are keyed by copy's rail.items ids (structural invariant). Non-live
 * views render present-but-disabled: visible so the tool reads whole, inert so
 * nothing dead-clicks at a booth.
 */

const GLYPHS: Record<string, React.ReactNode> = {
  replay: <polygon points="6 4 13 8 6 12" />,
  timeline: (
    <>
      <line x1="3" y1="5" x2="13" y2="5" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="3" y1="11" x2="13" y2="11" />
    </>
  ),
  signals: <polyline points="2 8 5 8 7 4 9 12 11 8 14 8" />,
  events: (
    <>
      <line x1="4" y1="2.5" x2="4" y2="13.5" />
      <path d="M4 3.5h8l-2 2.5 2 2.5H4" />
    </>
  ),
  export: (
    <>
      <line x1="8" y1="3" x2="8" y2="10" />
      <polyline points="5 7.5 8 10.5 11 7.5" />
      <path d="M3 12.5h10" />
    </>
  ),
};

export function Rail() {
  return (
    <aside className="flex shrink-0 flex-col border-b border-ground-line lg:w-56 lg:border-b-0 lg:border-r">
      <div className="px-5 pb-4 pt-5">
        <p className="font-display text-[15px] font-semibold tracking-[0.18em] text-ink">TORSEN</p>
        <p className="eyebrow mt-1">{cd.rail.product}</p>
      </div>

      <nav aria-label={cd.rail.product} className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {cd.rail.items.map((item) => {
          const active = item.id === "replay";
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.live}
              aria-current={active ? "page" : undefined}
              className={`focus-ring flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                active
                  ? "bg-ground-raised text-ink"
                  : item.live
                    ? "text-ink-dim hover:bg-ground-raised/60 hover:text-ink"
                    : "cursor-default text-ink-faint/60"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className={`h-4 w-4 ${active ? "text-teal" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {GLYPHS[item.id]}
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      <footer className="hidden border-t border-ground-line px-5 py-4 lg:block">
        <p className="font-mono text-[10px] tracking-wide text-ink-faint">{caseRecord.case.id}</p>
        <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-ink-faint/70">
          {cd.rail.provenance}
        </p>
      </footer>
    </aside>
  );
}
