import record from "@/data/case-record.json";

/**
 * The case-record contract behind /case — the page renders ONLY what this file
 * types, and data/case-record.json is the single instance. The record shape is
 * the product: the witness pipeline (recording → failure window → first
 * divergence → curated signals → case record) emits this same schema from a
 * real recording, and the page fills identically. Regenerate the committed
 * instance with `node scripts/synthesize-case-record.mjs`.
 *
 * Time base: seconds relative to FIRST DIVERGENCE (t = 0). Signals sample
 * uniformly ({ t0, dt, values }); events / evidence carry explicit t.
 */

export type SignalSeries = { t0: number; dt: number; values: number[] };

export type CaseSignal = {
  id: string;
  label: string;
  unit: string;
  /** Lane y-domain [min, max] — each lane owns its scale (small multiples). */
  scale: [number, number];
  /** Display precision for the live playhead readout. */
  decimals: number;
  /** The lane the diagnosis leans on — rendered in amber, the failure hue. */
  emphasis?: boolean;
  series: SignalSeries;
};

export type CaseEventKind = "info" | "warn" | "divergence" | "failure";
export type CaseEvent = { t: number; kind: CaseEventKind; label: string };

export type CaseEvidence = { t: number; signalId: string | null; text: string };

/** An amber projection onto one lane — what a query or moment lights up. */
export type CaseFocus = { signalId: string; window: [number, number] };

/** A curated, searchable moment — the "visual search" index entry. */
export type CaseMoment = { t: number; label: string; signalId: string; window: [number, number] };

/**
 * An askable question: the record answers ONLY from this curated set, each
 * answer grounded in signals with timestamps (honesty — no open-ended
 * generation in the demo, and none claimed).
 */
export type CaseQuery = {
  id: string;
  q: string;
  aliases: string[];
  answer: string;
  grounding: CaseEvidence[];
  jumpTo: number;
  highlight: CaseFocus | null;
};

export type CaseRecord = {
  schema: string;
  case: {
    id: string;
    title: string;
    robot: { name: string; class: string; policy: string };
    task: { id: string; label: string };
    recordedAt: string;
    provenance: { mode: string; bytesWrittenToOrigin: number; source: string };
  };
  timeline: {
    spanSeconds: [number, number];
    divergenceAt: number;
    /** Where "replay the incident" starts (auto-pauses on the divergence). */
    replayFrom: number;
    bagClockAtDivergence: string;
    bagDuration: string;
    sampling: string;
    clip: {
      src: string;
      poster: string;
      /** The rendered clip covers only this window around first divergence. */
      windowSeconds: [number, number];
    };
  };
  signals: CaseSignal[];
  events: CaseEvent[];
  moments: CaseMoment[];
  queries: CaseQuery[];
  diagnosis: {
    likelyCause: string;
    evidence: CaseEvidence[];
    nextAction: { title: string; body: string; cta: string };
  };
};

export const caseRecord = record as unknown as CaseRecord;

/** Offset from first divergence for display — "−3.0 s" / "+0.9 s" (true minus sign). */
export function fmtRel(t: number): string {
  return `${t < 0 ? "−" : "+"}${Math.abs(t).toFixed(1)} s`;
}

/** Sampled value at time t (nearest sample — display, not interpolation). */
export function valueAt(series: SignalSeries, t: number): number {
  const i = Math.round((t - series.t0) / series.dt);
  return series.values[Math.min(series.values.length - 1, Math.max(0, i))];
}
