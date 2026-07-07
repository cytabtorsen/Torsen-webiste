/**
 * Synthesizes data/case-record.json — the REPRESENTATIVE case record behind /case.
 *
 * HONESTY — this is authored synthetic data and the page labels it as such
 * in-frame. The record's SHAPE is the product contract: the witness pipeline
 * (recording → failure window → first divergence → curated signals → case
 * record) emits this same schema from real recordings; the page renders either
 * without change. Template over JSON is the point — fictive now, real later.
 *
 * Incident: the deck's fictive AMR case (task APPROACH_PICK, path blocked at
 * the pick approach). Time base: seconds relative to FIRST DIVERGENCE (t = 0),
 * spanning −30 … +30. Signals are uniformly sampled {t0, dt, values}.
 *
 * Deterministic (seeded PRNG) — regenerating must not churn the committed file.
 * Run: node scripts/synthesize-case-record.mjs
 */

import { writeFileSync } from "node:fs";

// mulberry32 — tiny deterministic PRNG; the seed is part of the record's identity.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const T0 = -30;
const T1 = 30;
const DT = 0.1;
const N = Math.round((T1 - T0) / DT) + 1; // 601 samples per lane
const t = (i) => T0 + i * DT;

const smoothstep = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
const gauss = (x, mu, sigma) => Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
const round = (v, p = 3) => Number(v.toFixed(p));

// One independent noise stream per lane keeps lanes visually uncorrelated.
const nz = { velocity: mulberry32(11), steering: mulberry32(23), laserMin: mulberry32(37), battery: mulberry32(53) };
const noise = (r, amp) => (r() * 2 - 1) * amp;

// ── Velocity (m/s): cruise → corridor slowdown → the divergence decel → stall,
//    with two small replan creep blips that fail.
function velocity(x, r) {
  let v = 1.18 + 0.05 * Math.sin(x * 0.35 + 1.2);
  v -= 0.23 * smoothstep(-8.6, -7.4, x); // corridor entry: 1.18 → ~0.95
  v *= 1 - smoothstep(0.0, 0.9, x);      // FIRST DIVERGENCE: decel to zero
  v += 0.14 * gauss(x, 8.7, 0.45) + 0.11 * gauss(x, 16.1, 0.4); // replan creep, blocked
  v += noise(r, x < 0.9 ? 0.018 : 0.006);
  return Math.max(0, v);
}

// ── Steering (deg): gentle wander → a late avoidance arc that never completes → flat.
function steering(x, r) {
  let s = 3.2 * Math.sin(x * 0.21 + 0.6) * (1 - smoothstep(0.4, 1.2, x));
  s += 9.5 * gauss(x, -1.4, 0.75); // the avoidance arc just before divergence
  s += 4.5 * gauss(x, 8.5, 0.5) - 3.5 * gauss(x, 16.0, 0.5); // replan wiggles
  s += noise(r, x < 0.9 ? 1.1 : 0.25);
  return s;
}

// ── Laser min. dist. (m): open aisle → the drop that precedes divergence → pinned
//    at the blocked distance. The lane the diagnosis leans on.
function laserMin(x, r) {
  const open = 3.15 + 0.45 * Math.sin(x * 0.13 + 2.1) + noise(r, 0.14);
  const blocked = 0.42 + noise(r, 0.015) + 0.1 * gauss(x, 8.7, 0.6) + 0.08 * gauss(x, 16.1, 0.6);
  const k = smoothstep(-3.0, -0.2, x); // the drop starts at −3.0 s
  return Math.max(0.35, open * (1 - k) + blocked * k);
}

// ── Battery (%): the honest lane — it never diverges. Slow drain, marginally
//    shallower once the base stalls.
function battery(x, r) {
  const drain = x < 0.9 ? 0.0042 : 0.0028;
  return 76.4 - drain * (x - T0) + noise(r, 0.012);
}

const lane = (fn, r, p) => Array.from({ length: N }, (_, i) => round(fn(t(i), r), p));

const record = {
  schema: "torsen.case-record/1",
  case: {
    id: "TSN-2026-0630-0417",
    title: "AMR-12 halted mid-task — path blocked at pick approach",
    robot: { name: "AMR-12", class: "AMR", policy: "warehouse-nav v2.4.1" },
    task: { id: "APPROACH_PICK", label: "Approach pick station P-07" },
    recordedAt: "2026-06-30T04:17:09Z",
    provenance: { mode: "read-only", bytesWrittenToOrigin: 0, source: "rosbag2 · mcap" },
  },
  timeline: {
    spanSeconds: [T0, T1],
    divergenceAt: 0,
    bagClockAtDivergence: "00:13:42.310",
    bagDuration: "00:31:25",
    sampling: "curated 10 Hz",
    clip: {
      src: "/case/incident.mp4",
      poster: "/case/incident-poster.jpg",
      // The rendered clip covers only this window around first divergence;
      // outside it the viewport holds the poster frame.
      windowSeconds: [-2, 3],
    },
  },
  signals: [
    { id: "velocity", label: "Velocity", unit: "m/s", scale: [0, 1.5], series: { t0: T0, dt: DT, values: lane(velocity, nz.velocity, 3) } },
    { id: "steering", label: "Steering", unit: "deg", scale: [-15, 15], series: { t0: T0, dt: DT, values: lane(steering, nz.steering, 2) } },
    { id: "laserMin", label: "Laser min. dist.", unit: "m", scale: [0, 5], emphasis: true, series: { t0: T0, dt: DT, values: lane(laserMin, nz.laserMin, 3) } },
    { id: "battery", label: "Battery", unit: "%", scale: [74, 78], series: { t0: T0, dt: DT, values: lane(battery, nz.battery, 3) } },
  ],
  events: [
    { t: -30.0, kind: "info", label: "Task APPROACH_PICK dispatched — pick station P-07" },
    { t: -18.4, kind: "info", label: "Waypoint W-3 reached, nominal profile" },
    { t: -8.2, kind: "info", label: "Entered pick-approach corridor, speed capped" },
    { t: -3.0, kind: "warn", label: "Obstacle in laser field — min. distance falling" },
    { t: 0.0, kind: "divergence", label: "First divergence — velocity departs the nominal profile" },
    { t: 0.9, kind: "warn", label: "Velocity zero — motion stalled short of pick" },
    { t: 1.6, kind: "warn", label: "Recovery behavior triggered — replan requested" },
    { t: 8.7, kind: "warn", label: "Replan attempt 1 — corridor still blocked" },
    { t: 16.1, kind: "warn", label: "Replan attempt 2 — corridor still blocked" },
    { t: 24.0, kind: "failure", label: "Task abandoned — HOLD, awaiting operator" },
  ],
  diagnosis: {
    likelyCause: "Path blocked",
    evidence: [
      { t: -3.0, signalId: "laserMin", text: "Laser min. distance drops" },
      { t: 0.9, signalId: "velocity", text: "Velocity decelerates to 0" },
      { t: 1.6, signalId: null, text: "Recovery behavior triggered" },
    ],
    nextAction: {
      title: "Inspect aisle clearance",
      body: "Check for pallet, debris, or misaligned load.",
      cta: "Open checklist",
    },
  },
};

// Pretty-print, but keep each numeric values array on one line.
const json = JSON.stringify(record, null, 2).replace(
  /\[\n\s+(-?[\d.]+(?:,\n\s+-?[\d.]+)+)\n\s+\]/g,
  (m, body) => `[${body.replace(/,\n\s+/g, ", ")}]`,
);
writeFileSync(new URL("../data/case-record.json", import.meta.url), json + "\n");
console.log(`wrote data/case-record.json — ${N} samples × 4 lanes`);
