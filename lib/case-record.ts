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

/**
 * The known-good envelope for one lane — the spread across N successful
 * executions of the SAME task, on the same grid as `series`. This is the thing
 * a divergence is measured AGAINST: without it, "the run left nominal" is an
 * assertion; with it, it is a crossing you can point at.
 *
 * WHICH LANES GET A BAND — only EXECUTION lanes: what the robot itself did
 * (velocity, steering, battery). Perception lanes do NOT (see `laserMin`):
 * minimum distance to whatever happens to be in the aisle varies legitimately
 * from run to run, so it has no meaningful known-good envelope. A pallet parked
 * legally in aisle 4 on run 7 would blow the band open and mean nothing.
 * Perception is EVIDENCE for a divergence; it never defines one. Getting this
 * backwards is how you end up marking the symptom as the cause.
 */
export type NominalBand = { lo: number[]; hi: number[] };

export type CaseSignal = {
  id: string;
  label: string;
  unit: string;
  /** Lane y-domain [min, max] — each lane owns its scale (small multiples). */
  scale: [number, number];
  /** Display precision for the live playhead readout. */
  decimals: number;
  /**
   * The lane the diagnosis leans on. NOTE its narrowed scope: it tints the
   * AskBar's grounding sparkline only. It must NOT tint the trace in the main
   * lanes, where amber is reserved for "outside the known-good envelope" — a
   * lane with no envelope cannot be outside one, and painting it amber there
   * says it diverged when it did not.
   */
  emphasis?: boolean;
  series: SignalSeries;
  /** Absent on perception lanes — see NominalBand. */
  nominal?: NominalBand;
};

/**
 * The known-good baseline this case was measured against — the comparison IS
 * the product. `firstDeparture` is not an annotation on the timeline; it is
 * what DEFINES t = 0: the earliest sample at which any execution lane leaves
 * its envelope. Everything after it is cascade.
 */
export type CaseBaseline = {
  runs: number;
  /** Same task, and what else had to match for a run to count as comparable. */
  matchedOn: string[];
  /** Earliest execution lane to leave its band. This is t = 0, by construction. */
  firstDeparture: { signalId: string; t: number; text: string };
  /** Later departures — the cascade, in order. */
  cascade: { signalId: string; t: number; text: string }[];
  /** What a human would have noticed unaided, and when. The gap is the pitch. */
  noticed: { t: number; text: string };
  /** Lanes that never left their envelope — a ruled-out cause, with evidence. */
  held: { signalId: string; text: string }[];
};

export type CaseEventKind = "info" | "warn" | "divergence" | "failure";
export type CaseEvent = { t: number; kind: CaseEventKind; label: string };

export type EvidenceKind = "frame" | "bbox" | "signal" | "attn" | "trajectory" | "sim_state";
export type CaseEvidence = {
  t: number;
  signalId: string | null;
  /** UI-readable form of the grounded Claim. */
  text: string;
  /**
   * The Verdict Claim and its retrievable raw-data pointer. OPTIONAL until the
   * record actually carries them — the instance is cast (`as unknown as`), so a
   * required field here would be a type that lies and a `.ev.ref` that throws.
   * Phase 3 (evidence-cited hypotheses) populates these and tightens the type.
   */
  claim?: string;
  ev?: { kind: EvidenceKind; ref: string };
};

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
  baseline: CaseBaseline;
  signals: CaseSignal[];
  events: CaseEvent[];
  moments: CaseMoment[];
  queries: CaseQuery[];
  /**
   * The workflow face of the case — the docket around the sealed evidence.
   * Every action is the team acting on its own systems; none touches the robot.
   */
  workflow: {
    status: "UNRESOLVED";
    ticket: { ref: string; state: string };
    /** The version a resolution binds to — "fixed" as a falsifiable claim. */
    resolveIn: string;
    checklist: string[];
  };
  diagnosis: {
    likelyCause: string;
    evidence: CaseEvidence[];
    nextAction: { title: string; body: string; cta: string };
    /**
     * Phase 3 (ranked hypotheses, calibrated confidence, counter-evidence).
     * Optional until the record carries them — see the note on CaseEvidence.
     */
    narrative?: string;
    confidence?: number;
    alternatives?: string[];
    contradictions?: string[];
  };
};

export const caseRecord = record as unknown as CaseRecord;

/** Offset from first divergence for display — "−3.0 s" / "+0.9 s" (true minus sign). */
export function fmtRel(t: number): string {
  return `${t < 0 ? "−" : "+"}${Math.abs(t).toFixed(1)} s`;
}

/**
 * Is the run outside its known-good envelope at sample i? Perception lanes have
 * no envelope, so they are never "out of band" — they are evidence, not a test.
 */
export function outOfBand(signal: CaseSignal, i: number): boolean {
  const n = signal.nominal;
  if (!n) return false;
  const v = signal.series.values[i];
  return v < n.lo[i] || v > n.hi[i];
}

/** Sampled value at time t (nearest sample — display, not interpolation). */
export function valueAt(series: SignalSeries, t: number): number {
  const i = Math.round((t - series.t0) / series.dt);
  return series.values[Math.min(series.values.length - 1, Math.max(0, i))];
}
