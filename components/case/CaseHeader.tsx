import { caseDemo as cd } from "@/lib/copy";
import { caseRecord as rec } from "@/lib/case-record";

/**
 * THE CASE HEADER — the case as a work item, not a chart: identity on the
 * left, lifecycle on the right. Status walks UNRESOLVED → ASSIGNED →
 * RESOLVED IN <version> (the pack's lifecycle vocabulary); amber is the open
 * wound, teal the falsifiable fix. Assignment is the visitor's own click —
 * the team acts, Torsen records.
 */

export type CaseStatus = "unresolved" | "assigned" | "resolved";

export function CaseHeader({
  status,
  onAssign,
}: {
  status: CaseStatus;
  onAssign: () => void;
}) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-ground-line bg-ground-raised px-4 py-2.5">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] tracking-wide text-ink-faint">{rec.case.id}</span>
        <span aria-hidden="true" className="h-3 w-px bg-ground-line" />
        <span className="text-[13px] text-ink-dim">{rec.case.robot.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          {rec.case.task.id}
        </span>
        <span className="hidden font-mono text-[10px] text-ink-faint/70 md:inline">
          {rec.case.robot.policy}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {status === "resolved" ? (
          <span className="rounded border border-teal/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal">
            {cd.workflow.statusResolvedIn} {rec.workflow.resolveIn}
          </span>
        ) : status === "assigned" ? (
          <span className="rounded border border-ground-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
            {cd.workflow.statusAssigned} · {cd.workflow.assignedYou}
          </span>
        ) : (
          <>
            <span className="rounded border border-amber/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
              {cd.workflow.statusUnresolved}
            </span>
            <button
              type="button"
              onClick={onAssign}
              className="focus-ring rounded-lg border border-ground-line px-2.5 py-1 text-[12px] font-medium text-ink-dim transition-colors hover:border-teal/40 hover:text-teal"
            >
              {cd.workflow.assignCta}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
