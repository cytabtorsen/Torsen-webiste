"use client";

import { useState } from "react";
import { caseRecord, type CaseFocus, type CaseMoment, type CaseQuery } from "@/lib/case-record";
import { Rail } from "./Rail";
import { AskBar, AnswerCard } from "./AskBar";
import { ReplayView } from "./ReplayView";
import { DiagnosisPanel } from "./DiagnosisPanel";

/**
 * THE INCIDENT REPLAY FRAME — rail · ask-the-record · replay · diagnosis, the
 * deck's slide-3 layout on site tokens. Owns the shared state: the playhead
 * time t (seconds relative to first divergence — the record's time base), the
 * open grounded answer, and the lane focus (the amber projection a query or
 * moment lights on its grounding lane).
 *
 * Everything rendered below comes from the case record (lib/case-record.ts) —
 * the page is a template over that JSON; only chrome copy lives in lib/copy.ts.
 *
 * Play-to-divergence, the clip window, event-click jumps and per-lane
 * readouts land with the interactive phase.
 */
export function CaseReplay() {
  const [t, setT] = useState(caseRecord.timeline.divergenceAt);
  const [answer, setAnswer] = useState<CaseQuery | null>(null);
  const [focus, setFocus] = useState<CaseFocus | null>(null);

  const onAnswer = (q: CaseQuery) => {
    setAnswer(q);
    setFocus(q.highlight);
    setT(q.jumpTo);
  };
  const onMoment = (m: CaseMoment) => {
    setAnswer(null);
    setFocus({ signalId: m.signalId, window: m.window });
    setT(m.t);
  };
  const onDismiss = () => {
    setAnswer(null);
    setFocus(null);
  };

  return (
    <main className="flex min-h-dvh flex-col bg-ground text-ink lg:h-dvh lg:flex-row lg:overflow-hidden">
      <Rail />
      <section className="flex min-w-0 flex-1 flex-col gap-4 p-5 lg:overflow-y-auto">
        <AskBar onAnswer={onAnswer} onMoment={onMoment} />
        {answer && <AnswerCard query={answer} onJump={setT} onDismiss={onDismiss} />}
        <ReplayView t={t} onScrub={setT} focus={focus} />
      </section>
      <DiagnosisPanel />
    </main>
  );
}
