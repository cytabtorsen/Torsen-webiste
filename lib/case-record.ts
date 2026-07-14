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

/**
 * ── HYPOTHESES ───────────────────────────────────────────────────────────────
 * The product's whole credibility rests here. The r/ROS thread's sharpest fear
 * was not "the AI is wrong" — it was "the AI is confidently wrong and I can't
 * tell." So a hypothesis is not a sentence; it is a claim carrying the evidence
 * FOR it, the evidence AGAINST it, and a confidence that means something.
 *
 * INVARIANTS (enforced at generation — see the guard in the synth script):
 *   · exactly one `leading`, and it must hold the highest confidence
 *   · confidences are competing explanations, so they SUM TO ≤ 1. The shortfall
 *     is not slack to be padded out — it is the part of the incident no
 *     hypothesis accounts for, and the UI shows it as exactly that.
 *   · every live hypothesis carries at least one piece of COUNTER-evidence. If
 *     nothing argues against your leading theory, you have not looked; a panel
 *     that only ever shows support is the confident-wrong-answer machine the
 *     thread was afraid of.
 *   · `ruled-out` requires `ruledOutBy` and confidence 0 — a negative result is
 *     a finding, and it has to be evidenced like any other.
 */
export type HypothesisStatus = "leading" | "open" | "ruled-out";

export type Hypothesis = {
  id: string;
  claim: string;
  status: HypothesisStatus;
  /** 0–1, calibrated against resolved cases — not a model's felt certainty. */
  confidence: number;
  supporting: CaseEvidence[];
  counter: CaseEvidence[];
  /** The single fact that killed it. Required when status is "ruled-out". */
  ruledOutBy?: string;
  /** Ids of the missing signals that would actually move this one. */
  wouldMove?: string[];
};

/**
 * A signal the record does NOT have — and, crucially, what it would SETTLE.
 * "Here is what I could not conclude, and the one thing you'd need to log to
 * conclude it next time" is the opposite of overclaiming, and it is the part of
 * the product a mature team can check us on. A missing-signal entry that does
 * not name the hypothesis it separates is a wish list, not an advisor.
 */
export type MissingSignal = {
  id: string;
  signal: string;
  /** Which hypotheses it would separate, and how. */
  settles: string;
  /** The instrumentation ask, concretely enough to action before the next run. */
  capture: string;
};

export type CaseCoverage = {
  /** The ceiling. What this record cannot tell you, however hard you ask it. */
  limit: string;
  missing: MissingSignal[];
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
    /** The leading hypothesis's claim, restated for the headline. */
    likelyCause: string;
    /** The leading hypothesis's confidence. Never presented without `hypotheses`. */
    confidence: number;
    /** Ranked. Exactly one `leading`; see the invariants on Hypothesis. */
    hypotheses: Hypothesis[];
    /** What the record could NOT settle, and the signal that would. */
    coverage: CaseCoverage;
    /** The at-divergence summary — the short evidence spine of the case. */
    evidence: CaseEvidence[];
    nextAction: { title: string; body: string; cta: string };
  };
};

export const caseRecord = record as unknown as CaseRecord;

/** Offset from first divergence for display — "−3.0 s" / "+0.9 s" (true minus sign). */
export function fmtRel(t: number): string {
  return `${t < 0 ? "−" : "+"}${Math.abs(t).toFixed(1)} s`;
}

/**
 * The share of the incident that NO hypothesis accounts for (1 − Σ confidence).
 *
 * This is the number a diagnosis tool is most tempted to hide. Confidences that
 * sum to 1.00 look authoritative and are almost always a lie — they mean the
 * hypothesis set was padded until it closed, rather than left honestly open. The
 * panel renders this shortfall as its own bar, in the same visual language as
 * the hypotheses, because "we cannot account for 9% of this" is a finding the
 * engineer is entitled to see before they act on the other 91%.
 */
export function unaccounted(hypotheses: Hypothesis[]): number {
  const claimed = hypotheses.reduce((s, h) => s + h.confidence, 0);
  return Math.max(0, 1 - claimed);
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
