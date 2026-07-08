import record from "@/data/fleet-record.json";

/**
 * The fleet-record contract behind /fleet — the case-index "home" of the tool,
 * the deck's slide-8 INCIDENTS board made real. Same discipline as the case
 * record: the page renders ONLY what this file types, data/fleet-record.json is
 * the single instance, and the witness pipeline would emit this same shape from
 * a real site. One case (AMR-12, path blocked) is reconstructed and drills into
 * /case; the siblings are honestly mid-reconstruction (real elapsed, never a
 * fake instant answer) or already resolved.
 */

export type CaseStatus = "unresolved" | "reconstructing" | "resolved";
export type RobotStatus = "open" | "reconstructing" | "resolved";

export type FleetRobot = {
  id: string;
  class: string;
  incidents: number;
  status: RobotStatus;
  /** Sparkline of recent incident load — small multiple, no axis. */
  spark: number[];
};

export type FleetCase = {
  ref: string;
  robotId: string;
  policy: string;
  task: string;
  /** The curated cause once reconstructed; the string "reconstructing" until then. */
  firstDivergence: string;
  openedAt: string;
  status: CaseStatus;
  /** Present while status === "reconstructing" — honest in-progress state. */
  stage?: string;
  elapsed?: string;
  /** Present when resolved — the version a resolution is bound to. */
  resolvedIn?: string;
  /** Time-to-root-cause, once known. */
  ttrc: string | null;
  /** Where a ready case drills to (the replay). null = not yet openable. */
  href: string | null;
};

export type FleetRecord = {
  schema: string;
  site: { id: string; label: string; robotsMonitored: number };
  recordedAt: string;
  stats: {
    incidentsToday: number;
    openCases: number;
    reconstructing: number;
    medianTtrc: string;
  };
  histogram: {
    /** Incidents-per-hour bars across the day; the label lives in copy. */
    bars: number[];
  };
  robots: FleetRobot[];
  cases: FleetCase[];
};

export const fleetRecord = record as unknown as FleetRecord;

/** A tiny sparkline path (0..1 normalized) for an N-point series in a WxH box. */
export function sparkPoints(values: number[], w: number, h: number): string {
  const max = Math.max(1, ...values);
  const dx = values.length > 1 ? w / (values.length - 1) : 0;
  return values
    .map((v, i) => `${(i * dx).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");
}
