"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { caseRecord, type CaseFocus, type CaseMoment, type CaseQuery } from "@/lib/case-record";
import { Rail, type RailView } from "./Rail";
import { CaseHeader, type CaseStatus } from "./CaseHeader";
import { AskBar, AnswerCard } from "./AskBar";
import { ReplayView } from "./ReplayView";
import { EventsView } from "./EventsView";
import { DiagnosisPanel } from "./DiagnosisPanel";

/**
 * THE INCIDENT REPLAY FRAME — rail · ask-the-record · replay/events ·
 * diagnosis, the deck's slide-3 layout on site tokens. Owns the shared state:
 * the playhead time t (seconds relative to first divergence — the record's
 * time base), play state, the active rail view, the open grounded answer, and
 * the lane focus (the amber projection a query or moment lights).
 *
 * Playback is real time (the chip says 1.0× and means it) and AUTO-PAUSES ON
 * THE FIRST DIVERGENCE when crossing it from before — the money moment lands
 * itself; pressing play again continues through recovery to the end. "Replay
 * the incident" restarts from the record's replayFrom beat. Space toggles
 * play from anywhere; every jump (answer, moment, event, scrub) pauses first.
 *
 * Everything rendered below comes from the case record (lib/case-record.ts) —
 * the page is a template over that JSON; only chrome copy lives in lib/copy.ts.
 */

const [, T1] = caseRecord.timeline.spanSeconds;
const DIV = caseRecord.timeline.divergenceAt;

export function CaseReplay() {
  const [t, setT] = useState(DIV);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<RailView>("replay");
  const [answer, setAnswer] = useState<CaseQuery | null>(null);
  const [focus, setFocus] = useState<CaseFocus | null>(null);
  // The action arc: assign → inspect (checklist) → bind the resolution.
  // Deliberately local state — a reload resets the booth demo to UNRESOLVED.
  const [assigned, setAssigned] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() =>
    caseRecord.workflow.checklist.map(() => false),
  );
  const [resolved, setResolved] = useState(false);
  const status: CaseStatus = resolved ? "resolved" : assigned ? "assigned" : "unresolved";
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const prev = tRef.current;
      let next = prev + (now - last) / 1000;
      last = now;
      let done = false;
      if (prev < DIV && next >= DIV) {
        next = DIV; // the money pause
        done = true;
      }
      if (next >= T1) {
        next = T1;
        done = true;
      }
      setT(next);
      if (done) setPlaying(false);
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const jump = useCallback((nt: number) => {
    setPlaying(false);
    setT(nt);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      // Play at the end of the window restarts the incident beat.
      if (!p && tRef.current >= T1 - 0.05) setT(caseRecord.timeline.replayFrom);
      return !p;
    });
  }, []);

  const replayIncident = useCallback(() => {
    setT(caseRecord.timeline.replayFrom);
    setPlaying(true);
  }, []);

  // Space toggles play from anywhere — except while typing in the ask bar or
  // on a focused button (native activation already handles those).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const owned =
        (el instanceof HTMLInputElement && el.type === "text") ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLButtonElement;
      if (e.key === " " && !owned) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const onAnswer = (q: CaseQuery) => {
    setView("replay");
    setAnswer(q);
    setFocus(q.highlight);
    jump(q.jumpTo);
  };
  const onMoment = (m: CaseMoment) => {
    setView("replay");
    setAnswer(null);
    setFocus({ signalId: m.signalId, window: m.window });
    jump(m.t);
  };
  const onDismiss = () => {
    setAnswer(null);
    setFocus(null);
  };
  /**
   * A cited piece of evidence is only a citation if you can GO to it. Clicking
   * one in the diagnosis panel drives the playhead to that instant and lights
   * the lane it rests on — so "the laser held at 0.42 m through both replans"
   * is a thing the reader can check in one click, not a sentence they have to
   * take on trust. Counter-evidence is navigable on exactly the same terms as
   * supporting evidence; that symmetry is the point.
   */
  const onEvidence = useCallback((et: number, signalId: string | null) => {
    setView("replay");
    setAnswer(null);
    setFocus(signalId ? { signalId, window: [et - 1.5, et + 1.5] } : null);
    jump(et);
  }, [jump]);

  return (
    <main className="flex min-h-dvh flex-col bg-ground text-ink lg:h-dvh lg:flex-row lg:overflow-hidden">
      <Rail view={view} onView={setView} />
      <section className="flex min-w-0 flex-1 flex-col gap-4 p-5 lg:overflow-y-auto">
        <CaseHeader status={status} onAssign={() => setAssigned(true)} />
        <AskBar onAnswer={onAnswer} onMoment={onMoment} />
        {view === "replay" ? (
          <>
            {answer && <AnswerCard query={answer} onJump={jump} onDismiss={onDismiss} />}
            <ReplayView
              t={t}
              playing={playing}
              focus={focus}
              onScrub={jump}
              onToggle={toggle}
              onReplay={replayIncident}
            />
          </>
        ) : (
          <EventsView
            onJump={(nt) => {
              jump(nt);
              setView("replay");
            }}
          />
        )}
      </section>
      <DiagnosisPanel
        checked={checked}
        onToggleItem={(i) => setChecked((c) => c.map((v, k) => (k === i ? !v : v)))}
        resolved={resolved}
        onResolve={() => setResolved(true)}
        onEvidence={onEvidence}
      />
    </main>
  );
}
