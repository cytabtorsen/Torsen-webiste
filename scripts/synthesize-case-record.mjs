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

/**
 * THE TIME BASE — t = 0 is the FIRST DIVERGENCE, and the first divergence is
 * DEFINED as the earliest sample at which any execution lane leaves its
 * known-good envelope. It is not a moment we chose; it is a crossing we find.
 *
 * Three layers, and keeping them distinct is the whole point of the record:
 *
 *   −1.6 s  CAUSE (perception)   the obstruction enters the laser field
 *    0.0 s  FIRST DIVERGENCE     steering leaves the known-good envelope —
 *                                an avoidance arc no good run ever made
 *   +1.4 s  CASCADE (execution)  velocity leaves its envelope, braking short
 *   +2.4 s  SYMPTOM              velocity zero — the stop a human notices
 *
 * The old record anchored t = 0 on the STOP. That is the symptom: by the time
 * velocity is zero the run has been off-nominal for 2.4 s. Anchoring there
 * marks the cascade as the divergence — precisely the mistake the product
 * exists to prevent. The band is what makes the earlier crossing visible: a
 * 10° steering arc is unremarkable on its own, and obviously abnormal against
 * fourteen runs that never exceeded ±3°.
 */
const DIVERGENCE = 0; // by construction — see steering() / steeringBand()
const STOP = 2.4;     // velocity zero: what the human notices unaided

// ── NOMINAL (known-good): the mean profile across the 14 comparable runs. ──
// A good APPROACH_PICK cruises, caps at the corridor, and decelerates to zero
// AT the station (~+6 s). Note a good run also ends at zero velocity — what
// makes this one abnormal is that it stopped EARLY, 4.1 m short. You cannot see
// that from the velocity trace alone; you can only see it against the band.
const velNominal = (x) =>
  (1.18 + 0.05 * Math.sin(x * 0.35 + 1.2) - 0.23 * smoothstep(-7.4, -6.2, x)) *
  (1 - smoothstep(2.6, 6.0, x));
/**
 * The velocity envelope is not a constant width, and the shape is the physics:
 *   cruise    ±0.100 — free speed varies most between runs
 *   corridor  ±0.065 — the speed cap is enforced, so the runs converge
 *   decel     ±0.125 — arrival timing at the station varies again
 * It also has to stay narrow through the corridor for a second reason: the
 * crossing time is where the trace exits the band, so a wider band there would
 * push first-departure from +1.4 s to +1.5 s and quietly falsify every "+1.4"
 * in the events, the queries and the diagnosis. The assertions at the bottom of
 * this file exist to catch exactly that.
 */
const velHalf = (x) =>
  0.1 - 0.035 * smoothstep(-7.4, -5.0, x) + 0.06 * smoothstep(1.8, 5.0, x);

const strNominal = (x) => 1.4 * Math.sin(x * 0.19 + 0.4); // mild, consistent path curvature
const strHalf = () => 3.0; // ±3° between runs is the whole of known-good

/**
 * NOTE — the envelope half-width and the per-sample noise are DIFFERENT
 * quantities and must not be conflated. The band is the spread BETWEEN runs
 * (how much a healthy execution of this task legitimately varies, ±3° here);
 * the noise is jitter WITHIN one run (sensor + control, well under a degree).
 * Set them to the same order and the crossing time jitters by a sample or two —
 * i.e. the record would report a first-divergence timestamp it cannot actually
 * resolve. A baseline product that is sloppy about this is worse than none.
 */

const batNominal = (x) => 76.4 - 0.0042 * (x - T0);
const batHalf = () => 0.18;

// ── THE FAILED RUN ──

// Velocity: tracks nominal exactly (same cruise, same corridor cap) until the
// hard brake at +1.2 → zero by +2.4. It crosses the band's lower edge at +1.4.
function velocity(x, r) {
  const openLoop = 1.18 + 0.05 * Math.sin(x * 0.35 + 1.2) - 0.23 * smoothstep(-7.4, -6.2, x);
  let v = openLoop * (1 - smoothstep(1.2, 2.4, x)); // the brake — 4.1 m short
  v += 0.14 * gauss(x, 10.3, 0.45) + 0.11 * gauss(x, 17.7, 0.4); // replan creep, blocked
  v += noise(r, x < STOP ? 0.018 : 0.006);
  return Math.max(0, v);
}

// Steering: nominal wander until the avoidance arc — which crosses the +3°
// envelope edge at t = 0. THIS is the first divergence; everything else follows.
function steering(x, r) {
  let s = strNominal(x) * (1 - smoothstep(1.9, 2.7, x)); // wander, then held straight
  s += 10.5 * gauss(x, 0.95, 0.62); // the arc no good run made
  s += 4.5 * gauss(x, 10.1, 0.5) - 3.5 * gauss(x, 17.6, 0.5); // replan wiggles
  // Within-run jitter — NOT the band width. Kept well under the per-sample
  // margin at the crossing (≈0.25° at t=0, ≈0.50° at t=−0.1) so the first
  // departure lands on t=0 deterministically instead of being decided by noise.
  s += noise(r, x < STOP ? 0.12 : 0.06);
  return s;
}

// Laser min. dist. (m): PERCEPTION — no band (see NominalBand in lib/case-record.ts).
// Open aisle → the obstruction enters at −1.6 → pinned at the blocked distance.
// This is the CAUSE, and the evidence the diagnosis leans on. It is not the
// divergence: the world changing is not the robot departing from known-good.
function laserMin(x, r) {
  const open = 3.15 + 0.45 * Math.sin(x * 0.13 + 2.1) + noise(r, 0.14);
  const blocked = 0.42 + noise(r, 0.015) + 0.1 * gauss(x, 10.3, 0.6) + 0.08 * gauss(x, 17.7, 0.6);
  const k = smoothstep(-1.6, 0.6, x);
  return Math.max(0.35, open * (1 - k) + blocked * k);
}

// Battery (%): the honest lane — it never leaves the envelope. That is a RESULT,
// not filler: it is how the record rules the battery out with evidence instead
// of with an opinion.
function battery(x, r) {
  const drain = x < STOP ? 0.0042 : 0.0028;
  return 76.4 - drain * (x - T0) + noise(r, 0.012);
}

const lane = (fn, r, p) => Array.from({ length: N }, (_, i) => round(fn(t(i), r), p));

/** The known-good envelope, sampled on the same grid as the run. */
const band = (nom, half, p, floor = -Infinity) => ({
  lo: Array.from({ length: N }, (_, i) => round(Math.max(floor, nom(t(i)) - half(t(i))), p)),
  hi: Array.from({ length: N }, (_, i) => round(nom(t(i)) + half(t(i)), p)),
});

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
    divergenceAt: DIVERGENCE,
    // Where "replay the incident" starts: cruise → obstruction → divergence →
    // the stop, in one ~5 s beat, auto-pausing on the divergence.
    replayFrom: -5,
    bagClockAtDivergence: "00:13:40.710",
    bagDuration: "00:31:25",
    sampling: "curated 10 Hz",
    clip: {
      src: "/case/incident.mp4",
      poster: "/case/incident-poster.jpg",
      // The rendered clip covers only this window around first divergence;
      // outside it the viewport holds the poster frame. It is centred on the
      // STOP (the moment the render shows), so first divergence sits inside it.
      windowSeconds: [round(STOP - 2.9, 1), round(STOP + 2.1, 1)],
    },
  },
  // The known-good baseline this run was measured against. The comparison IS
  // the product: `firstDeparture` is what defines t = 0, and the distance from
  // it to `noticed` is the case for the whole thing existing.
  baseline: {
    runs: 14,
    matchedOn: ["task APPROACH_PICK", "policy warehouse-nav v2.4.1", "same pick station", "laden"],
    firstDeparture: {
      signalId: "steering",
      t: DIVERGENCE,
      text: "Steering leaves the known-good envelope — an avoidance arc none of the 14 runs made.",
    },
    cascade: [
      { signalId: "velocity", t: 1.4, text: "Velocity leaves the envelope — braking 4.1 m short of the station." },
    ],
    noticed: { t: STOP, text: "Velocity zero — the stop, and the first thing a human sees." },
    held: [
      { signalId: "battery", text: "Battery never left its envelope — ruled out, on evidence." },
    ],
  },
  signals: [
    // Scale [0, 1.35], not [0, 1.5]: the run peaks at ~1.25 m/s, so the old
    // domain spent 17% of the lane on empty headroom and squeezed the envelope.
    { id: "velocity", label: "Velocity", unit: "m/s", scale: [0, 1.35], decimals: 2, series: { t0: T0, dt: DT, values: lane(velocity, nz.velocity, 3) }, nominal: band(velNominal, velHalf, 3, 0) },
    { id: "steering", label: "Steering", unit: "deg", scale: [-15, 15], decimals: 1, series: { t0: T0, dt: DT, values: lane(steering, nz.steering, 2) }, nominal: band(strNominal, strHalf, 2) },
    { id: "laserMin", label: "Laser min. dist.", unit: "m", scale: [0, 5], decimals: 2, emphasis: true, series: { t0: T0, dt: DT, values: lane(laserMin, nz.laserMin, 3) } },
    // Scale tightened to [75.6, 77.0]: on the old [74, 78] the ±0.18 envelope
    // was 9% of the lane and rendered as a fuzzy line — meaning the record asked
    // you to accept "battery: ruled out" against a band you could not see. The
    // lane's y-domain is a display choice; the evidence has to be legible.
    { id: "battery", label: "Battery", unit: "%", scale: [75.6, 77.0], decimals: 1, series: { t0: T0, dt: DT, values: lane(battery, nz.battery, 3) }, nominal: band(batNominal, batHalf, 3) },
  ],
  events: [
    { t: -28.4, kind: "info", label: "Task APPROACH_PICK dispatched — pick station P-07" },
    { t: -16.8, kind: "info", label: "Waypoint W-3 reached, inside the known-good envelope" },
    { t: -6.6, kind: "info", label: "Entered pick-approach corridor, speed capped — still nominal" },
    { t: -1.6, kind: "warn", label: "Obstruction enters the laser field — min. distance falling" },
    { t: 0.0, kind: "divergence", label: "First divergence — steering leaves the known-good envelope" },
    { t: 1.4, kind: "warn", label: "Velocity leaves the envelope — braking 4.1 m short of the station" },
    { t: 2.4, kind: "warn", label: "Velocity zero — motion stalled short of pick" },
    { t: 3.1, kind: "warn", label: "Recovery behavior triggered — replan requested" },
    { t: 10.3, kind: "warn", label: "Replan attempt 1 — corridor still blocked" },
    { t: 17.7, kind: "warn", label: "Replan attempt 2 — corridor still blocked" },
    { t: 25.6, kind: "failure", label: "Task abandoned — HOLD, awaiting operator" },
  ],
  // Curated, searchable moments — the "visual search" index. Each grounds in
  // one signal over a window; selecting one jumps the playhead there.
  moments: [
    { t: -16.8, label: "Waypoint W-3 — inside the envelope", signalId: "velocity", window: [-20, -13] },
    { t: -6.6, label: "Corridor entry — speed capped, still nominal", signalId: "velocity", window: [-9, -4.5] },
    { t: -1.6, label: "Obstruction enters the laser field", signalId: "laserMin", window: [-3.5, 0.5] },
    { t: 0.0, label: "First divergence — steering leaves the envelope", signalId: "steering", window: [-1, 2.5] },
    { t: 1.4, label: "Velocity leaves the envelope — braking short", signalId: "velocity", window: [0.5, 3.5] },
    { t: 2.4, label: "The stop — what a human notices", signalId: "velocity", window: [1.5, 4] },
    { t: 3.1, label: "Recovery behavior — replan requested", signalId: "velocity", window: [2, 5.5] },
    { t: 10.3, label: "Replan creep — corridor still blocked", signalId: "laserMin", window: [8.5, 12.5] },
    { t: 25.6, label: "Task abandoned — HOLD", signalId: "velocity", window: [23, 28] },
  ],
  // The askable set — questions this record can answer, each grounded in
  // signals with timestamps. HONESTY: the demo answers ONLY from this set;
  // anything else gets the in-product "not in this record" fallback. The real
  // pipeline curates these the same way it curates signals.
  queries: [
    {
      id: "why-stop",
      q: "Why did the robot stop?",
      aliases: ["why did it stop", "why halt", "why stuck", "root cause", "what happened", "cause", "why blocked"],
      answer:
        "The path was blocked. An obstruction entered the laser field 1.6 s before first divergence and min. distance fell from ~3.2 m to 0.42 m. The robot swung into an avoidance arc none of the 14 known-good runs made, then braked 4.1 m short of the station and stopped.",
      grounding: [
        { t: -1.6, signalId: "laserMin", text: "Laser min. distance 3.2 m → 0.42 m" },
        { t: 0, signalId: "steering", text: "Steering leaves the known-good envelope" },
        { t: 2.4, signalId: "velocity", text: "Velocity 0 — motion stalled" },
      ],
      jumpTo: 0,
      highlight: { signalId: "laserMin", window: [-2.5, 1] },
    },
    {
      id: "obstacle-when",
      q: "When did the obstacle appear?",
      aliases: ["obstacle", "pallet", "blocked", "laser", "what blocked the path", "when blocked"],
      answer:
        "1.6 s before first divergence (bag clock 00:13:39.11) the laser field picked up an obstruction in the pick-approach corridor and min. distance began falling. That is the cause — but it is not the divergence: the world changing is not the robot leaving known-good.",
      grounding: [{ t: -1.6, signalId: "laserMin", text: "Min. distance begins falling" }],
      jumpTo: -1.6,
      highlight: { signalId: "laserMin", window: [-3, 0.5] },
    },
    {
      id: "battery",
      q: "Was the battery a factor?",
      aliases: ["battery", "power", "charge", "voltage", "energy"],
      answer:
        "No — and this is measured, not assumed. The battery lane stayed inside the envelope of all 14 known-good runs for the entire window: 76.4% at start, 76.2% at end, nominal drain throughout.",
      grounding: [{ t: 0, signalId: "battery", text: "Inside the known-good envelope, start to end" }],
      jumpTo: 0,
      highlight: { signalId: "battery", window: [-30, 30] },
    },
    {
      id: "first-divergence",
      q: "What was the first divergence?",
      aliases: ["divergence", "first divergence", "when did it diverge", "depart nominal", "where did it go wrong"],
      answer:
        "Steering, at 00:13:40.71 — the robot began an avoidance arc that none of the 14 comparable runs ever made. That is the earliest sample where its behavior left the known-good envelope. Every timestamp on this page is relative to it.",
      grounding: [{ t: 0, signalId: "steering", text: "Steering exceeds the ±3° known-good envelope" }],
      jumpTo: 0,
      highlight: { signalId: "steering", window: [-1, 2.5] },
    },
    {
      id: "baseline",
      q: "What are you comparing it against?",
      aliases: ["baseline", "known good", "nominal", "healthy runs", "compare", "comparison", "envelope", "band", "normal"],
      answer:
        "14 successful executions of the same task — APPROACH_PICK to the same station, same policy version (warehouse-nav v2.4.1), same laden state. The shaded band on each execution lane is their envelope. Laser min. distance carries no band on purpose: what sits in the aisle varies legitimately run to run, so it is evidence, never a baseline.",
      grounding: [
        { t: 0, signalId: "steering", text: "First lane to leave the envelope" },
        { t: 1.4, signalId: "velocity", text: "Second — the cascade, 1.4 s later" },
      ],
      jumpTo: 0,
      highlight: { signalId: "steering", window: [-1, 2.5] },
    },
    {
      id: "notice-gap",
      q: "How much earlier is this than the stop?",
      aliases: ["earlier", "gap", "how much sooner", "before the stop", "head start", "why does it matter"],
      answer:
        "2.4 s. The stop is what a human notices — velocity hits zero and the robot is visibly halted. By then the run had been outside the known-good envelope for 2.4 s, and the obstruction had been in the laser field for 4.0 s. Start at the stop and you are already investigating the cascade.",
      grounding: [
        { t: 0, signalId: "steering", text: "First divergence" },
        { t: 2.4, signalId: "velocity", text: "The stop — where a human starts" },
      ],
      jumpTo: 0,
      highlight: { signalId: "velocity", window: [0, 2.4] },
    },
    {
      // The question a sceptic actually asks. It must have an answer, and the
      // answer must be a real limit — not a humble-brag dressed as candour.
      id: "limits",
      q: "What can’t you tell me?",
      aliases: ["limits", "cant you tell", "what dont you know", "uncertain", "unknown", "missing", "not sure", "how confident", "confidence", "could you be wrong", "wrong"],
      answer:
        "What is in the aisle. The laser proves something was there and stayed there for 25 s; it cannot name it — there is no camera in this record. That is why the leading hypothesis sits at 68% and not higher, why two others stay open, and why 9% of this incident is accounted for by nothing at all. One camera frame at −1.6 s would close it.",
      grounding: [
        { t: -1.6, signalId: "laserMin", text: "Something is there — but not what" },
        { t: 17.7, signalId: "laserMin", text: "Still there 19 s later, unnamed" },
      ],
      jumpTo: -1.6,
      highlight: { signalId: "laserMin", window: [-3, 0.5] },
    },
    {
      id: "recovery",
      q: "Did the robot try to recover?",
      aliases: ["recover", "recovery", "replan", "retry", "try again", "self correct"],
      answer:
        "Yes — recovery behavior triggered 3.1 s after divergence and the planner attempted two replans (+10.3 s, +17.7 s). Both creep attempts stalled against the same obstruction.",
      grounding: [
        { t: 3.1, signalId: null, text: "Recovery behavior triggered" },
        { t: 10.3, signalId: "velocity", text: "Replan creep, blocked" },
        { t: 17.7, signalId: "velocity", text: "Replan creep, blocked" },
      ],
      jumpTo: 10.3,
      highlight: { signalId: "velocity", window: [8, 19] },
    },
    {
      id: "contact",
      q: "Did it hit the obstacle?",
      aliases: ["hit", "collision", "crash", "impact", "contact", "touch", "damage"],
      answer:
        "No contact. The stop completed 0.42 m short of the obstruction, and laser min. distance holds at that floor for the rest of the window.",
      grounding: [{ t: 2.4, signalId: "laserMin", text: "Min. distance floor 0.42 m, held" }],
      jumpTo: 2.4,
      highlight: { signalId: "laserMin", window: [1, 25] },
    },
    {
      id: "task",
      q: "What task was it running?",
      aliases: ["task", "mission", "job", "what was it doing", "pick", "approach"],
      answer:
        "APPROACH_PICK toward pick station P-07, dispatched 28.4 s before first divergence under policy warehouse-nav v2.4.1.",
      grounding: [{ t: -28.4, signalId: null, text: "Task dispatched" }],
      jumpTo: -28.4,
      highlight: null,
    },
    {
      id: "outcome",
      q: "How did the task end?",
      aliases: ["end", "outcome", "result", "abandoned", "hold", "operator", "resolution"],
      answer:
        "Abandoned 25.6 s after divergence — the robot entered HOLD awaiting an operator, with the corridor still blocked.",
      grounding: [{ t: 25.6, signalId: null, text: "HOLD — awaiting operator" }],
      jumpTo: 25.6,
      highlight: { signalId: "velocity", window: [23, 28] },
    },
  ],
  // The workflow face of the case — the docket that grows AROUND the sealed
  // evidence. Witness discipline: every action here is the TEAM acting on its
  // own systems (assign, inspect, ticket, resolve); none touches the robot.
  workflow: {
    status: "UNRESOLVED",
    ticket: { ref: "TOR-214", state: "synced" },
    // The version a resolution binds to — "fixed" as a falsifiable claim.
    resolveIn: "v2.4.2",
    checklist: [
      "Aisle clearance at the pick approach",
      "Pallet position at station P-07",
      "Load alignment on the inbound rack",
    ],
  },
  diagnosis: {
    likelyCause: "Path blocked",
    confidence: 0.68,
    evidence: [
      { t: -1.6, signalId: "laserMin", text: "Obstruction enters the laser field" },
      { t: 0.0, signalId: "steering", text: "Steering leaves the known-good envelope" },
      { t: 1.4, signalId: "velocity", text: "Velocity leaves it — braking short" },
      { t: 2.4, signalId: "velocity", text: "Velocity 0 — the stop" },
    ],
    /**
     * Ranked, and each one carries the case AGAINST itself. The confidences sum
     * to 0.91 — the missing 0.09 is not rounding, it is the part of this
     * incident the evidence does not explain, and the panel shows it.
     */
    hypotheses: [
      {
        id: "obstruction",
        claim: "A physical obstruction in the pick-approach corridor",
        status: "leading",
        confidence: 0.68,
        supporting: [
          { t: -1.6, signalId: "laserMin", text: "Min. distance falls 3.2 m → 0.42 m and stays there" },
          { t: 10.3, signalId: "laserMin", text: "Still 0.42 m at replan 1 — a person or a passing truck would have cleared" },
          { t: 17.7, signalId: "laserMin", text: "Still 0.42 m at replan 2, 19 s after the stop" },
        ],
        counter: [
          { t: 0, signalId: null, text: "No camera in the record — nothing confirms WHAT is there. The laser proves an obstacle, not a pallet." },
          { t: 2.4, signalId: "laserMin", text: "The 0.42 m floor is suspiciously flat (±0.015 m) for a physical object at a closing angle." },
        ],
        wouldMove: ["camera", "scan"],
      },
      {
        id: "localization",
        claim: "Localization drift — it braked for an obstacle that was not where it thought",
        status: "open",
        confidence: 0.14,
        supporting: [
          { t: 0, signalId: "steering", text: "Steering diverged BEFORE velocity — consistent with a planner reacting to a bad pose, not a reflex stop" },
        ],
        counter: [
          { t: -1.6, signalId: "laserMin", text: "Laser range is egocentric — it does not care where the robot thinks it is, and it still saw something at 0.42 m" },
        ],
        wouldMove: ["pose"],
      },
      {
        id: "phantom",
        claim: "Spurious laser returns — dust, steam, or a reflective surface",
        status: "open",
        confidence: 0.09,
        supporting: [
          { t: -1.6, signalId: "laserMin", text: "The floor value is unnaturally constant, which is more typical of a specular return than a solid" },
        ],
        counter: [
          { t: 17.7, signalId: "laserMin", text: "It held for 25 s across two replans. Dust disperses; steam moves. This did not." },
        ],
        wouldMove: ["camera", "scan"],
      },
      {
        id: "power",
        claim: "Power or battery fault",
        status: "ruled-out",
        confidence: 0,
        supporting: [],
        counter: [
          { t: 0, signalId: "battery", text: "Battery never left the envelope of the 14 known-good runs — not once, across the whole window" },
        ],
        ruledOutBy: "The battery lane stayed inside its known-good envelope for the entire window.",
      },
    ],
    /**
     * THE COVERAGE ADVISOR — what this record cannot answer, and the one signal
     * that would fix it next time. This is the section that makes the rest
     * believable: a tool that only ever tells you what it found is indistinguishable
     * from a tool that tells you what you want to hear.
     */
    coverage: {
      limit:
        "Torsen cannot tell you WHAT is in the aisle. The laser proves something was there and stayed there for 25 seconds; it cannot name it. Every hypothesis below the leading one is bounded by that, and no amount of reasoning over this record will settle it.",
      missing: [
        {
          id: "camera",
          signal: "Camera frame at the failure window",
          settles:
            "Separates the obstruction from a phantom return outright — one frame at −1.6 s ends the argument.",
          capture:
            "Key /camera/front into the same freeze-frame trigger the rosbag already uses: 5 Hz for the 5 s around the fault. ~12 MB per incident.",
        },
        {
          id: "scan",
          signal: "Full laser scan, not just the minimum",
          settles:
            "The record keeps min. distance — one number per sweep. The full scan shows the obstruction's WIDTH and shape: a pallet subtends an arc, a specular glint is one ray.",
          capture:
            "Keep /scan in the freeze-frame window at 10 Hz rather than reducing it to a minimum on the robot. ~2 MB per incident.",
        },
        {
          id: "pose",
          signal: "Localization covariance",
          settles: "Rules the drift hypothesis in or out — the only thing that can.",
          capture: "Record /amcl_pose covariance and the odom→map residual at 10 Hz. Kilobytes.",
        },
        {
          id: "policy",
          signal: "Policy action confidence / OOD score",
          settles:
            "Whether the avoidance arc was a deliberate manoeuvre or the policy going out-of-distribution. The record shows WHAT it steered; nothing here shows whether it meant to.",
          capture:
            "warehouse-nav v2.4.1 exposes neither. Publish /policy/action_confidence and /policy/ood_score at 10 Hz and the next case answers this in one pass.",
        },
      ],
    },
    nextAction: {
      title: "Inspect aisle clearance",
      body: "Check for pallet, debris, or misaligned load.",
      cta: "Open checklist",
    },
  },
};

/**
 * ── THE GUARD ────────────────────────────────────────────────────────────────
 * The record's prose — every "+1.4 s", the events, the queries, the diagnosis —
 * asserts WHERE each lane leaves its envelope. Those are claims about the
 * numbers in this same file, and nothing but this check keeps them true. Retune
 * a band half-width or a signal by a hair and the crossing slides a sample;
 * the copy then states a first-divergence timestamp the data does not support,
 * silently, and the whole product is a liar about the one thing it sells.
 *
 * So: derive the crossings from the emitted arrays and refuse to write the file
 * if they disagree with what the record says about itself.
 */
const crossings = {};
for (const s of record.signals) {
  if (!s.nominal) continue;
  const i = s.series.values.findIndex(
    (v, k) => v < s.nominal.lo[k] || v > s.nominal.hi[k],
  );
  crossings[s.id] = i === -1 ? null : round(T0 + i * DT, 1);
}

const expected = {
  [record.baseline.firstDeparture.signalId]: record.baseline.firstDeparture.t,
  ...Object.fromEntries(record.baseline.cascade.map((c) => [c.signalId, c.t])),
  ...Object.fromEntries(record.baseline.held.map((h) => [h.signalId, null])),
};

for (const [id, want] of Object.entries(expected)) {
  const got = crossings[id];
  if (got !== want) {
    throw new Error(
      `case-record: ${id} leaves its envelope at ${got === null ? "never" : `${got}s`}, ` +
        `but the record claims ${want === null ? "never" : `${want}s`}. ` +
        `Either retune the signal/band, or update baseline + events + queries + diagnosis to match. ` +
        `Do not ship a record that misstates its own first divergence.`,
    );
  }
}

// The earliest crossing of ANY execution lane must be the first divergence,
// and the first divergence must be t = 0 — that is what the time base means.
const earliest = Math.min(...Object.values(crossings).filter((v) => v !== null));
if (earliest !== record.timeline.divergenceAt) {
  throw new Error(
    `case-record: earliest departure is ${earliest}s but divergenceAt is ${record.timeline.divergenceAt}s. ` +
      `t = 0 IS the first divergence; re-anchor the time base.`,
  );
}

/**
 * ── THE HYPOTHESIS GUARD ─────────────────────────────────────────────────────
 * The panel's whole claim on an engineer's trust is that it argues against
 * itself and admits what it cannot see. That is a property of the DATA, so it
 * gets enforced here rather than left to whoever next edits the record.
 */
const H = record.diagnosis.hypotheses;
const leading = H.filter((h) => h.status === "leading");

if (leading.length !== 1) {
  throw new Error(`case-record: expected exactly one "leading" hypothesis, found ${leading.length}.`);
}
if (Math.max(...H.map((h) => h.confidence)) !== leading[0].confidence) {
  throw new Error(`case-record: the leading hypothesis does not hold the highest confidence.`);
}
if (record.diagnosis.likelyCause && record.diagnosis.confidence !== leading[0].confidence) {
  throw new Error(
    `case-record: diagnosis.confidence (${record.diagnosis.confidence}) must equal the leading hypothesis's (${leading[0].confidence}).`,
  );
}

const total = H.reduce((s, h) => s + h.confidence, 0);
if (total > 1 + 1e-9) {
  throw new Error(
    `case-record: hypothesis confidences sum to ${total.toFixed(2)} — they are competing explanations and cannot exceed 1. ` +
      `Padding them until they close is how a diagnosis tool starts lying.`,
  );
}

for (const h of H) {
  // A live hypothesis with nothing against it means nobody looked.
  if (h.status !== "ruled-out" && h.counter.length === 0) {
    throw new Error(
      `case-record: hypothesis "${h.id}" is live but carries no counter-evidence. ` +
        `If nothing argues against it, you have not looked — and a panel that only ever shows support ` +
        `is exactly the confidently-wrong machine this product exists to not be.`,
    );
  }
  if (h.status === "ruled-out" && (!h.ruledOutBy || h.confidence !== 0)) {
    throw new Error(
      `case-record: hypothesis "${h.id}" is ruled-out and must carry ruledOutBy and confidence 0. ` +
        `A negative result is a finding; evidence it like one.`,
    );
  }
  // Every evidence pointer must actually resolve, or the citation is decorative.
  for (const e of [...h.supporting, ...h.counter]) {
    if (e.signalId !== null && !record.signals.some((s) => s.id === e.signalId)) {
      throw new Error(`case-record: hypothesis "${h.id}" cites unknown signal "${e.signalId}".`);
    }
    if (e.t < T0 || e.t > T1) {
      throw new Error(`case-record: hypothesis "${h.id}" cites t=${e.t}s, outside the recorded window.`);
    }
  }
  // "This signal would move it" is only meaningful if the signal is one we name.
  for (const id of h.wouldMove ?? []) {
    if (!record.diagnosis.coverage.missing.some((m) => m.id === id)) {
      throw new Error(`case-record: hypothesis "${h.id}" points at missing signal "${id}", which is not in coverage.missing.`);
    }
  }
}

// Pretty-print, but keep each numeric values array on one line.
const json = JSON.stringify(record, null, 2).replace(
  /\[\n\s+(-?[\d.]+(?:,\n\s+-?[\d.]+)+)\n\s+\]/g,
  (m, body) => `[${body.replace(/,\n\s+/g, ", ")}]`,
);
writeFileSync(new URL("../data/case-record.json", import.meta.url), json + "\n");
console.log(`wrote data/case-record.json — ${N} samples × 4 lanes`);
