import Link from "next/link";
import { fleetBoard as cd } from "@/lib/copy";
import { fleetRecord as rec, sparkPoints, type FleetCase, type FleetRobot } from "@/lib/fleet-record";

/**
 * THE FLEET CASE-INDEX — rail · stat row · today histogram · fleet roster ·
 * latest-incidents table, the deck's slide-8 INCIDENTS board on site tokens.
 * Screen two of the booth demo: the operator's cross-fleet view. One case
 * (AMR-12, path blocked) is reconstructed and links into /case; the siblings
 * are honestly mid-reconstruction (real elapsed) or resolved. Pure presentation
 * — a server component over data/fleet-record.json, no client state; the only
 * live affordance is the drill-down link into the replay.
 */

// Shared grid template for the case table — header and rows stay aligned. One
// fixed 7-column layout (ref · robot · task · cause · opened · status · arrow);
// below its min width the whole table scrolls-x rather than dropping columns.
const ROW = "grid min-w-[720px] grid-cols-[128px_84px_1fr_150px_92px_164px_16px] items-center gap-2";

const RAIL_GLYPHS: Record<string, React.ReactNode> = {
  overview: (
    <>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </>
  ),
  cases: (
    <>
      <line x1="3" y1="5" x2="13" y2="5" />
      <line x1="3" y1="8" x2="13" y2="8" />
      <line x1="3" y1="11" x2="13" y2="11" />
    </>
  ),
  fingerprints: <path d="M8 2.5a4 4 0 0 1 4 4v3M8 6.5v5M5 4.5a4 4 0 0 0-1 3v4M11 11v1" />,
  policies: (
    <>
      <path d="M4 2.5h6l2 2v9H4z" />
      <line x1="6" y1="7" x2="10" y2="7" />
      <line x1="6" y1="10" x2="10" y2="10" />
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

function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-ground-line bg-ground-raised px-4 py-3">
      <p className={`font-display text-2xl font-semibold tabular-nums ${accent ? "text-amber" : "text-ink"}`}>{value}</p>
      <p className="eyebrow mt-1">{label}</p>
    </div>
  );
}

function Histogram() {
  const { bars } = rec.histogram;
  const max = Math.max(1, ...bars);
  return (
    <div className="flex h-full min-h-[180px] flex-col rounded-xl border border-ground-line bg-ground-raised p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-medium text-ink">{cd.histogram.heading}</p>
        <p className="font-mono text-[10px] text-ink-faint">{cd.histogram.axisNote}</p>
      </div>
      <div className="mt-3 flex flex-1 items-end gap-[3px]" aria-hidden="true">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-[2px] bg-teal/70" style={{ height: `${Math.max(2, (v / max) * 100)}%` }} title={`${v}`} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-ink-faint/70">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

function RobotCard({ robot }: { robot: FleetRobot }) {
  const hue = robot.status === "open" ? "stroke-amber" : robot.status === "resolved" ? "stroke-teal/70" : "stroke-ink-faint";
  const dot = robot.status === "open" ? "bg-amber" : robot.status === "resolved" ? "bg-teal" : "bg-ink-faint";
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ground-line bg-ground px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <p className="truncate font-mono text-[12px] text-ink">{robot.id}</p>
        </div>
        <p className="mt-0.5 truncate text-[10px] text-ink-faint">{robot.class}</p>
      </div>
      <svg viewBox="0 0 60 20" preserveAspectRatio="none" className="h-6 w-16 shrink-0" aria-hidden="true">
        <polyline points={sparkPoints(robot.spark, 60, 20)} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className={hue} />
      </svg>
      <span className="w-8 shrink-0 text-right font-mono text-[12px] tabular-nums text-ink-dim">{robot.incidents}</span>
    </div>
  );
}

function StatusCell({ c }: { c: FleetCase }) {
  if (c.status === "unresolved")
    return <span className="rounded bg-amber/12 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber">{cd.table.statusUnresolved}</span>;
  if (c.status === "reconstructing")
    return (
      <span className="inline-flex items-center gap-1.5 truncate font-mono text-[11px] text-ink-dim">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-ink-faint" />
        <span className="truncate">{c.stage} · {c.elapsed}</span>
      </span>
    );
  return (
    <span className="truncate font-mono text-[11px] text-teal/90">
      {cd.table.statusResolvedIn} {c.resolvedIn} <span className="text-ink-faint">✓</span>
    </span>
  );
}

/** One case row — the drillable case is a full-row Link; the rest are static. */
function CaseCells({ c }: { c: FleetCase }) {
  return (
    <>
      <span className="truncate font-mono text-[11px] text-ink-dim">{c.ref}</span>
      <span className="font-mono text-[12px] text-ink">{c.robotId}</span>
      <span className="truncate text-[12px] text-ink-dim">{c.task}</span>
      <span className="truncate text-[12px]">
        {c.status === "reconstructing" ? <span className="italic text-ink-faint">reconstructing…</span> : <span className="text-ink">{c.firstDivergence}</span>}
      </span>
      <span className="font-mono text-[11px] text-ink-faint">{c.openedAt}</span>
      <StatusCell c={c} />
      <span className="text-teal transition-transform group-hover:translate-x-0.5" aria-hidden="true">{c.href ? "→" : ""}</span>
    </>
  );
}

function CaseRow({ c }: { c: FleetCase }) {
  if (c.href)
    return (
      <Link href={c.href} aria-label={`${cd.table.openCase} — ${c.ref} ${c.robotId}`} className={`group focus-ring border-t border-ground-line/70 px-4 py-3 transition-colors hover:bg-ground/60 ${ROW}`}>
        <CaseCells c={c} />
      </Link>
    );
  return (
    <div className={`border-t border-ground-line/70 px-4 py-3 ${ROW}`}>
      <CaseCells c={c} />
    </div>
  );
}

export function FleetBoard() {
  return (
    <main className="flex min-h-dvh flex-col bg-ground text-ink lg:h-dvh lg:flex-row lg:overflow-hidden">
      {/* ── left rail — brand + tool nav + provenance ── */}
      <aside className="flex shrink-0 flex-col border-b border-ground-line lg:w-56 lg:border-b-0 lg:border-r">
        <div className="px-5 pb-4 pt-5">
          <p className="font-display text-[15px] font-semibold tracking-[0.18em] text-ink">TORSEN</p>
          <p className="eyebrow mt-1">{cd.rail.product}</p>
        </div>
        <nav aria-label={cd.rail.product} className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {cd.rail.items.map((item, i) => {
            const active = i === 0;
            const cls = `focus-ring flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
              active ? "bg-ground-raised text-ink" : item.live ? "text-ink-dim hover:bg-ground-raised/60 hover:text-ink" : "cursor-default text-ink-faint/60"
            }`;
            const glyph = (
              <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-4 w-4 ${active ? "text-teal" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {RAIL_GLYPHS[item.id]}
              </svg>
            );
            return item.live ? (
              <a key={item.id} href={i === 0 ? "#top" : "#cases"} aria-current={active ? "page" : undefined} className={cls}>
                {glyph}
                {item.label}
              </a>
            ) : (
              <span key={item.id} aria-disabled="true" className={cls}>
                {glyph}
                {item.label}
              </span>
            );
          })}
        </nav>
        <footer className="hidden border-t border-ground-line px-5 py-4 lg:block">
          <p className="font-mono text-[10px] tracking-wide text-ink-faint">{rec.site.id}</p>
          <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-ink-faint/70">{cd.rail.provenance}</p>
        </footer>
      </aside>

      {/* ── the board ── */}
      <section id="top" className="flex min-w-0 flex-1 flex-col gap-5 p-5 lg:overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[15px] font-medium text-ink">{rec.site.label}</h1>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{rec.site.robotsMonitored} robots monitored</p>
          </div>
          <span className="rounded bg-ground-raised px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-teal/90">{cd.chipRepresentative}</span>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label={cd.stats.incidentsToday} value={String(rec.stats.incidentsToday)} accent />
          <StatTile label={cd.stats.openCases} value={String(rec.stats.openCases)} />
          <StatTile label={cd.stats.reconstructing} value={String(rec.stats.reconstructing)} />
          <StatTile label={cd.stats.medianTtrc} value={rec.stats.medianTtrc} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Histogram />
          <div className="rounded-xl border border-ground-line bg-ground-raised p-4">
            <p className="text-[13px] font-medium text-ink">{cd.roster.heading}</p>
            <div className="mt-3 flex flex-col gap-2">
              {rec.robots.map((r) => (
                <RobotCard key={r.id} robot={r} />
              ))}
            </div>
          </div>
        </div>

        {/* latest incidents table */}
        <div id="cases" className="overflow-hidden rounded-xl border border-ground-line bg-ground-raised">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[13px] font-medium text-ink">{cd.table.heading}</p>
            <p className="hidden font-mono text-[10px] text-ink-faint sm:block">{cd.table.reconstructingNote}</p>
          </div>
          <div className="overflow-x-auto">
            <div className={`border-t border-ground-line px-4 py-2 ${ROW}`}>
              <span className="eyebrow">{cd.table.cols.ref}</span>
              <span className="eyebrow">{cd.table.cols.robot}</span>
              <span className="eyebrow">{cd.table.cols.task}</span>
              <span className="eyebrow">{cd.table.cols.cause}</span>
              <span className="eyebrow">{cd.table.cols.opened}</span>
              <span className="eyebrow">{cd.table.cols.status}</span>
              <span />
            </div>
            {rec.cases.map((c) => (
              <CaseRow key={c.ref} c={c} />
            ))}
          </div>
        </div>

        <p className="pb-2 text-[11px] leading-relaxed text-ink-faint">{cd.disclaimer}</p>
      </section>
    </main>
  );
}
