"use client";

import { useState } from "react";
import { caseRecord } from "@/lib/case-record";
import { Rail } from "./Rail";
import { ReplayView } from "./ReplayView";
import { DiagnosisPanel } from "./DiagnosisPanel";

/**
 * THE INCIDENT REPLAY FRAME — rail · replay · diagnosis, the deck's slide-3
 * layout on site tokens. Owns the one piece of shared state: the playhead
 * time t, in seconds relative to first divergence (the record's time base).
 *
 * Everything rendered below comes from the case record (lib/case-record.ts) —
 * the page is a template over that JSON; only chrome copy lives in lib/copy.ts.
 *
 * Phase A: skeleton + live scrub. Play-to-divergence, the clip window,
 * event-click jumps and per-lane readouts land with the interactive phase.
 */
export function CaseReplay() {
  const [t, setT] = useState(caseRecord.timeline.divergenceAt);

  return (
    <main className="flex min-h-dvh flex-col bg-ground text-ink lg:h-dvh lg:flex-row lg:overflow-hidden">
      <Rail />
      <ReplayView t={t} onScrub={setT} />
      <DiagnosisPanel />
    </main>
  );
}
