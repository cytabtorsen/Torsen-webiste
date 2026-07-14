/**
 * Single source of truth for all site copy.
 *
 * POSITIONING GUARDRAIL — load-bearing. Torsen is the EYES & MEMORY of a
 * learned-policy fleet, never its HANDS. It is a read-only, independent witness:
 * it reconstructs, explains, grounds, and records the "why" behind a failure.
 * It never controls the robot, never prevents or fixes a failure, never acts.
 *   Words to USE:    witness, reconstruct, explain, evidence, record, independent,
 *                    grounded, legible, root cause, time-to-root-cause.
 *   Words to AVOID:  prevent, fix, control, guarantee safety, autonomous
 *                    correction, "replace the engineer," "Torsen acts/decides."
 *
 * HONESTY GUARDRAIL — do NOT claim the reader is "blind" or "has no
 * observability." Learned-policy teams already log everything (Foxglove, Rerun,
 * rosbags/ROS 2, MCAP). The gap Torsen closes is narrow and specific:
 *   1. The policy isn't on the bus — logs see inputs and output commands, never
 *      the decision. Every tool shows WHAT happened, not WHY.
 *   2. Detectors only flag, they don't explain — a red light, not a root cause.
 *   3. It's all self-reported and mutable — no independent, tamper-evident record.
 *
 * SCOPE GUARDRAIL (Phase 1) — positioning + CTA reframe only. NO regulation,
 * liability, or downtime-cost ($/hour) claims in any public field; those are a
 * later act. The CTA is the forensics-pilot front door, not a waitlist.
 *
 * STRUCTURAL INVARIANTS — components parse these; do not break:
 *   - hero.h1 = { whyWord: "Why", rest }; whyWord renders in amber italic.
 *   - audience.body MUST contain the exact lowercase substring
 *     `why did it do that?` exactly once (Audience splits on it to color "why").
 *   - every string in audience.roles MUST appear verbatim in audience.body.
 *   - mission.line MUST contain the lowercase word `why` (Mission splits to color it).
 *   - difference.rows[1] is the independence row (Difference lifts it to the amber
 *     lead position). Keep independence at index 1.
 *   - whatItDoes.cards ids stay "reconstruct" / "ground" / "independent" (glyph + style lookup).
 *   - problem.panels labels render in a tiny 2-panel visual — keep them ~1 word.
 */

export const site = {
  name: "Torsen",
  domain: "torsen.ai",
  title: "Torsen — independent incident reconstruction for physical AI",
  description:
    "You already log everything — Foxglove, Rerun, rosbags. None of it explains a learned policy’s decision. Torsen reconstructs the grounded “why” behind a failure, from camera and physical ground truth, and keeps it as an independent record.",
  url: "https://torsen.ai",
} as const;

export const hero = {
  // No eyebrow: the nav wordmark carries the name.
  // H1 is split so the leading word can carry the amber "why" signature.
  h1: { whyWord: "Why", rest: "did the robot do that?" },
  sub: "A robot stops on your line. Finding out why pulls your best engineer off the roadmap — hours of triage, often a trip to site, while the line stays down. Torsen reconstructs the incident, pinpoints where it first went wrong, and hands support a case they can act on.",
  cta: "Start a pilot",
  // Secondary text link beside the primary CTA — both scroll to the intake section.
  secondary: "or just keep me posted",
} as const;

export const problem = {
  eyebrow: "The gap",
  heading: "You can see what happened. You still can’t see why.",
  body: "Your stack already captures everything and replays it in 3D. But the policy was never on the bus — your logs see the inputs and the commands, never the decision in between. And the record you’re scrubbing is your own: self-reported and mutable. Every tool shows what happened. None reconstructs why.",
  panels: {
    logsLabel: "logs",
    logsState: "what",
    reconLabel: "reconstruction",
    reconState: "why",
    captionAfter: " — grounded, independent",
  },
} as const;

/**
 * COST — where a robot incident actually burns money. Four sourced channels,
 * big numbers, near-zero prose. This is the buyer's language (Head of Field
 * Ops / Reliability, COO), straight from the ICP research: the leak isn't
 * missing data, it's the human time to explain what happened.
 */
export const cost = {
  eyebrow: "Where the money goes",
  heading: "Every robot incident burns money in four places.",
  sub: "Not in missing data — you already log everything. In the human hours it takes to explain what happened.",
  stats: [
    { value: "$36k–$2.3M", unit: "per hour of downtime", note: "FMCG to automotive · Siemens 2024" },
    { value: "8h+", unit: "senior-engineer time per incident", note: "pulled off the roadmap" },
    { value: "$1.5k–$6k", unit: "per emergency site visit", note: "when remote triage can’t answer it" },
    { value: "$6.9M", unit: "service-ops loss, one RaaS vendor", note: "in a single year · Symbotic FY2025" },
  ],
  closer: "A 300-robot fleet leaks roughly $400k a year to this. Torsen is built to take back a third of it.",
} as const;

/**
 * PRODUCT — the tool, shown. Real screenshots of the /case replay and /fleet
 * board, not prose. The ICP research is explicit: prospects must grasp the value
 * in 30 seconds from the product image. Honesty chip stays (representative data).
 */
export const product = {
  heading: "One reconstructed case. Not a log dump.",
  // The comparison IS the product — say it here, not just in the interface. A
  // "first divergence" with nothing to diverge FROM is an assertion; against the
  // known-good runs of the same task it is a crossing you can point at.
  sub: "Torsen finds the failure window in a recording you already have, lines the run up against the runs that worked, and marks the first moment it left them. Support gets a case they can read, act on, and hand to anyone.",
  chip: "representative · synthetic data",
  primary: {
    // 2x retina (2880x1800), displayed ~1.5x-density.
    src: "/product/case.webp",
    width: 2880,
    height: 1800,
    alt: "The Torsen incident replay: an AMR halted at a pick station, four synchronized signal lanes each shaded with the envelope of fourteen known-good runs, the trace turning amber where it leaves that envelope at the marked first divergence, and a diagnosis panel naming the likely cause.",
    bar: "Torsen · incident replay",
    ref: "AMR-12 · TSN-2026-0630-0417",
  },
  // INVARIANT — features[] is index-aligned to FEATURE_ICONS in Product.tsx
  // (envelope → divergence marker → document). Reorder here, reorder there.
  features: [
    { title: "Compared against known-good", desc: "The same task, run normally, is the baseline — the band each signal should have stayed inside." },
    { title: "First divergence", desc: "The earliest moment the run left that band — found before the stop anyone would notice." },
    { title: "A shareable case", desc: "Diagnosis, evidence, and next action — one record support can act on and hand to anyone." },
  ],
  secondary: {
    src: "/product/fleet.webp",
    width: 2880,
    height: 1800,
    alt: "The Torsen fleet case index: incidents-today stat, per-robot sparklines, and a table of open incidents across the fleet.",
    bar: "Torsen · case index",
    caption: "And across the fleet — every open incident, each drilling into its replay.",
  },
} as const;

/**
 * STACK — "where it fits", and the answer to the hardest objection we have.
 *
 * Sits after Product (the reader now knows what Torsen IS) and before ROI (the
 * "where does it fit / do I already have this?" objection is a buying objection).
 *
 * PROVENANCE — this section exists because of one comment in the r/ROS thread:
 * SOVD + ros2_medkit already give you freeze-frame capture, rolling buffers, and
 * cross-domain (ROS + PLC + OPC UA) assembly over HTTP on shipped robots — and,
 * quoting it, "the cross-domain context gets assembled by the architecture, not
 * by you during debugging." If that is free, a ROS engineer will ask what Torsen
 * is for. The answer is the section's closing line: assembly is not interpretation.
 *
 * BOUNDARY GUARDRAIL — name the STACK, never a rival. Everything in `theirs` is
 * something the reader already runs and should KEEP; the copy must read as
 * compatibility, not competition. No logos, no "vs", no funded-incumbent framing.
 * rosbag2/MCAP/SOVD/ros2_medkit/Foxglove appear here as the substrate we read.
 *
 * WITNESS GUARDRAIL — independence appears here as a PROPERTY (read-only, writes
 * nothing back), never as the headline claim. It earns its place by being the
 * reason you can drop Torsen in without touching the robot.
 */
export const stack = {
  heading: "Keep your recorder. Torsen begins where capture ends.",
  sub: "Your stack already holds the recording, freezes the buffer when the fault fires, and assembles ROS, PLC and safety state into one view. None of that tells you which signals mattered, or where the run first left nominal. That part is still done by hand — by your most expensive engineer.",
  theirs: {
    label: "Your stack captures",
    items: [
      { name: "rosbag2 · MCAP", desc: "The recording, already on disk." },
      { name: "Freeze-frame · rolling buffer", desc: "The fault doesn’t start the recording — it stops it." },
      { name: "SOVD · ros2_medkit", desc: "Faults, snapshots and PLC state, assembled and served over HTTP." },
      { name: "Foxglove · Rerun", desc: "Replay and visualization — once you know where to look." },
    ],
  },
  ours: {
    label: "Torsen investigates",
    items: [
      { name: "Finds the failure window", desc: "In the recording you already have — no new instrumentation." },
      { name: "Compares against known-good", desc: "The same task, executed normally, is the baseline." },
      { name: "Marks the first divergence", desc: "And separates the cause from the cascade that followed." },
      { name: "Hands back a case", desc: "Evidence, next action — and what was never recorded." },
    ],
  },
  // The load-bearing line. It is the whole section compressed, and it is the
  // sentence that answers the thread. Keep it short enough to quote.
  close: "Assembly is architecture. Interpretation is the work.",
  readOnly: "Read-only, start to finish — Torsen never writes to your bag, your robot, or your ticket.",
} as const;

/**
 * ROI — why the first buyer pays. Today vs With Torsen, then the OEM leak math
 * from the research (144 incidents/yr → ~$399k → cut 30% = ~$120k). This is the
 * conversion beat: less senior time, fewer trips, faster close.
 */
export const roi = {
  heading: "You pay because it closes more cases with fewer experts.",
  today: "Today",
  withTorsen: "With Torsen",
  rows: [
    { label: "Triage", today: "hours before a first useful hypothesis", torsen: "the case is already built when you open it" },
    { label: "Expert escalations", today: "your best engineer, pulled into every hard case", torsen: "support closes it from the record" },
    { label: "Site trips", today: "$1.5k–$6k when remote triage can’t answer", torsen: "the reconstruction answers remotely" },
    { label: "Recurrence", today: "the same failure comes back unnoticed", torsen: "a fix bound to a version, watched for regression" },
  ],
  exampleLabel: "OEM example",
  example: "144 incidents a year leak about $399k in senior hours, support, and trips. Cut that by 30% and Torsen returns roughly $120k a year — before churn or SLA credits.",
} as const;

export const whatItDoes = {
  eyebrow: "What Torsen does",
  heading: "Reconstruct the decision. Ground every claim. Keep an independent record.",
  cards: [
    {
      id: "reconstruct",
      title: "Reconstruct the decision, not just the telemetry.",
      body: "Torsen finds the failure window in a recording you already have and reconstructs what the policy perceived, believed, and intended — the legible why your logs and replays can’t show.",
    },
    {
      id: "ground",
      title: "Ground every claim in camera + physical signals.",
      body: "Camera and physical signals are ground truth; a policy explanation or a detector’s alarm is a hypothesis. Every claim Torsen makes is tied to a retrieved signal — never asserted, always shown.",
    },
    {
      id: "independent",
      title: "Keep an independent, tamper-evident record — a witness, never an actor.",
      body: "Torsen reads your stack; it never touches the control loop. The reconstruction is held as a replayable record independent of the machine that acted — so the account of the failure isn’t the failing system’s own.",
    },
  ],
} as const;

export const difference = {
  eyebrow: "Where it fits",
  heading: "Your tools show you the data. Torsen reconstructs why — independently.",
  // Generic category — deliberately no named/logoed competitor.
  colThem: "Logs, replay & detectors",
  colUs: "Torsen",
  caption: "How Torsen differs from the observability you already run",
  // Comparison strip: the status quo (which the reader already runs) vs. Torsen.
  // INVARIANT: rows[1] is the independence row — Difference.tsx lifts it to the
  // amber lead position so independence reads first. Keep it at index 1.
  rows: [
    { them: "Logs and replay see the inputs and the commands.", us: "Torsen reconstructs the decision in between — what the policy perceived, believed, and intended." },
    { them: "The record is the operator’s own log — self-reported and mutable.", us: "The record is held independently of the machine that acted — a witness, not the actor." },
    { them: "Detectors flag that something went wrong.", us: "Torsen explains why, grounded in camera + physical signals." },
  ],
} as const;

/**
 * HOW IT WORKS — the engine, in the open (brief §4 item 4 · Phase 4a).
 *
 * The 5-stage pipeline: Capture → Detect → Curate → Replay → Record. This
 * section earns the ROS engineer's trust by being legible — it speaks ROS 2 /
 * rosbag2 / MCAP and proves Torsen reads the stack they already run: read-only,
 * no rip-and-replace.
 *
 * POSITIONING GUARDRAIL — Torsen is the witness, never the actor. Capture is
 * read-only; Detect treats a detector's alarm as a pointer/hypothesis, not the
 * answer; Curate is THE product (agent-curation cuts dozens of topics to the
 * 3–5 grounded signals that mattered — the "legibility-per-human" thesis, echoing
 * the head-to-head); Replay is a replayable SPATIAL reconstruction (AR is a
 * future LENS, never "AR beats screens"); Record is independent + tamper-evident.
 *
 * HONESTY GUARDRAIL — never imply the reader is blind. They already run
 * Foxglove / Rerun / rosbags. `limits` is load-bearing candor: state plainly
 * that Torsen never controls, prevents, or fixes — it explains and records. For
 * the ROS crowd this candor reads as MORE credible, not less. (Those AVOID words
 * appear here ONLY in negation — the explicit "what it doesn't do.")
 *
 * SCOPE GUARDRAIL (Phase 4a) — engine + read-only candor ONLY. NO regulation
 * dates, liability, or downtime-cost ($/hour) claims — those are Phase 4b.
 *
 * STRUCTURAL INVARIANT — stages[] is index-aligned to the pipeline order the
 * component renders (capture → detect → curate → replay → record); stages[2] =
 * Curate is the load-bearing product stage the component lifts in amber. Keep
 * this order, and keep each stage's `id` (drives the glyph + accent lookup).
 */
export const howItWorks = {
  eyebrow: "How it works",
  heading: "The engine, in the open.",
  intro:
    "Torsen reads the recordings you already keep and reconstructs the grounded why behind one failure — five stages, no rip-and-replace.",
  // The standing promise for the engineer with Foxglove open in the next tab.
  readsYourStack:
    "Reads your stack — rosbag2 / MCAP, ROS 2 topics, camera + physical signals. Read-only, no rip-and-replace.",
  // Tiny amber marker under the Curate stage — the load-bearing step, labelled so
  // it reads as the product even in monochrome (not distinguished by colour alone).
  curateMarker: "the why is decided here",
  stages: [
    {
      id: "capture",
      title: "Capture",
      body: "Torsen ingests a recording of the failure window you already have — nothing new to instrument.",
      grounding:
        "Opens a rosbag2 / MCAP off disk — the topics, camera frames, and physical signals like /imu and /joint_states are already there. It reads the file; it never joins the live bus.",
    },
    {
      id: "detect",
      title: "Detect",
      body: "Torsen finds the failure window — and treats a detector’s alarm as a pointer to investigate, not the answer.",
      grounding:
        "A detector — /diagnostics, an e-stop, a FAIL-Detect-style monitor — is a red light: it flags that something went wrong, never why. Torsen takes the flag as a hypothesis and tests it against the camera + physical signals.",
    },
    {
      id: "curate",
      title: "Curate",
      body: "An agent narrows dozens of topics to the three-to-five grounded signals that actually mattered — what the policy perceived, believed, and intended.",
      grounding:
        "The product: legibility-per-human. Each surfaced signal is tied to a retrieved camera or physical measurement — shown, never asserted.",
    },
    {
      id: "replay",
      title: "Replay",
      body: "The curated signals become a replayable spatial reconstruction you can scrub and orbit — the failure in place, not on a flat timeline.",
      grounding:
        "Rebuilt from the camera + physical ground truth in the recording, each signal anchored in 3D. On your screen today; a tablet or glasses are later lenses on the same record, not a better truth.",
    },
    {
      id: "record",
      title: "Record",
      body: "The reconstruction is kept as an independent, tamper-evident record — held apart from the machine that acted.",
      grounding:
        "A witness, never an actor. The account of the failure isn’t the failing system’s own self-report — it’s an independent record you can revisit, share, and stand behind.",
    },
  ],
  // Candid "what it doesn't do (yet)" — credibility feature for the ROS crowd
  // (brief §7.5). The AVOID words appear here, in negation, on purpose.
  limits: {
    label: "What it doesn’t do (yet)",
    body: "Torsen is read-only. It never controls the robot, never prevents or fixes a failure, never touches the control loop. It explains what happened and records why — that’s the whole job, on purpose.",
  },
} as const;

/**
 * THE INDEPENDENT RECORD — act two (brief §4 item 5 · Phase 4b).
 *
 * The narrative pivot: broaden from "a debugging tool for learned-policy teams"
 * to "the independent account of why, for any fleet that has to answer for what
 * it did." Wedge sharp (learned policy, established above); vision wide.
 *
 * THE MOAT — this section's load-bearing idea: a system can't be the witness to
 * its own failure. The only account today is the operator's own log — self-
 * reported and mutable. Independence is the whitespace; it's also why Torsen must
 * stay a witness (the moment it acts, the independence is gone).
 *
 * SCOPE GUARDRAIL (Phase 4b, per the user's decisions) — NO regulation (no EU
 * Machinery Reg / AI Act / PLD, no dates, no "right to ship," no mandated-logging
 * framing); NO downtime-cost $ figures and NO savings framing; NO insurance
 * cost/discount claim; NO fabricated social proof (no logos, "trusted by," or
 * invented metrics). Frame stakes QUALITATIVELY — accountability, trust, who
 * answers for it.
 *
 * POSITIONING / HONESTY — witness, never actor (reads / reconstructs / records,
 * never touches the control loop). The reader isn't blind; they already log. The
 * gap is independence + the grounded why; this section is why that independence
 * matters BEYOND the engineering team.
 *
 * STRUCTURAL INVARIANTS — components parse these:
 *   - statement renders large/quiet (north-star register). If it contains the
 *     word `why`, the component colours it with the amber `.why` device (as
 *     Mission does) — keep exactly one `why` in it.
 *   - beats[] is ordered; beats[0] (id "notary") is THE moat and takes the amber
 *     lead in the ledger. Keep the order: notary → review → anyFleet → durable.
 */
export const independentRecord = {
  eyebrow: "The independent record",
  heading: "When someone outside the team asks what happened.",
  statement:
    "Sooner or later the question leaves engineering. A partner, a customer, a review after a near-miss — someone who wasn’t in the loop needs to know what the robot did and why. The account they can trust isn’t the one the robot kept on itself.",
  beats: [
    {
      id: "notary",
      title: "A system can’t be the witness to its own failure.",
      body: "Today the only account of what went wrong is the operator’s own log — self-reported, and editable after the fact. The moment the account comes from the system that failed, it’s testimony, not evidence. Torsen’s record is held apart from the machine that acted, so the why doesn’t rest on taking the failing system’s word for it.",
    },
    {
      id: "review",
      title: "An answer that holds up outside the room.",
      body: "Inside the team you trace a failure, retrain, and move on. But when the answer has to satisfy someone who wasn’t there — a partner reviewing an incident, a customer after a near-miss — “trust our logs” isn’t an answer. An independent, grounded reconstruction is: the same legible why, tied to camera and physical signals, that holds up to a reader who doesn’t own the robot.",
    },
    {
      id: "anyFleet",
      title: "Any fleet that has to answer for what it did.",
      body: "A grounded, independent account of why isn’t particular to learned policies — that’s only where the gap bites first, because there’s no line to read. Any robot that has to explain itself to someone outside the team that built it needs more than its own word for what happened.",
    },
    {
      id: "durable",
      title: "A record that outlives the run.",
      body: "Because it’s kept independently, the reconstruction doesn’t expire with the incident — it’s a replayable account you can revisit, compare against the next one, and stand behind long after the robot has moved on.",
    },
  ],
} as const;

export const audience = {
  eyebrow: "Who it's for",
  heading: "Built for the teams whose failures have no line to read.",
  // INVARIANT: must contain the exact lowercase substring `why did it do that?`
  // exactly once, and each `roles` phrase below must appear verbatim here.
  body: "VLA, imitation, RL — learned policies are becoming the standard for complex robots, and how they fail. When a learned-policy robot fails, there’s no stack trace, no line to read. The reliability and deployment engineers who own that failure get asked “why did it do that?” and have to answer it from a recording that never shows the decision. Torsen is the reconstruction for when they do.",
  // Role chips — each phrase appears verbatim in `body` above.
  roles: ["learned-policy robot", "reliability", "deployment engineers"],
  rolesLabel: "The people Torsen is built for",
} as const;

/**
 * WHERE THIS GOES — the vision closer (brief §4 item 7 · Phase 4c).
 *
 * `line` is the north-star — keep it large, quiet, and FIRST. INVARIANT: it must
 * contain the lowercase word `why` (Mission splits on it for the amber `.why`
 * device). Do not edit the line. Two beats render beneath it:
 *   - spatialLadder: the SAME replayable spatial reconstruction, on more lenses
 *     over time. Screen today → tablet → glasses LATER. AR is the final rung and
 *     a FUTURE lens — never "AR beats screens," never a better truth. rungs is
 *     ordered present → near → future (length 3); the component dims the last.
 *   - lifecycle: act three — what the record unlocks. ROADMAP, NOT SHIPPED.
 *     GUARDRAILS: every verb acts on the RECORD (recognize, link, hold, reopen
 *     an issue) — never on the robot; the fix is always the team's. Jira/Linear
 *     are named as the tracker the READER already runs, never as partners or a
 *     shipped integration. `candor` is load-bearing and must stay — it states
 *     plainly that this layer is roadmap, in the limits register. steps[] is
 *     ordered (fingerprint → tracker → resolve → reopen); keep the order. The
 *     old `corpus` teaser is superseded by this block — never render both.
 *     Understanding/legibility compounds, NOT prevention — never "prevent /
 *     fix / avoid future failures," and never the word "IDE."
 */
export const mission = {
  eyebrow: "Where this goes",
  // North-star line. Keep large and quiet. INVARIANT: must contain lowercase "why".
  line: "Learned policies are becoming how every complex robot is built — and how they fail. Torsen is the independent record of why, for as long as they run.",
  spatialLadder: {
    label: "The same reconstruction, on more lenses over time",
    rungs: [
      "On your screen today — scrub and orbit the failure in place.",
      "On a tablet held up to the robot, the reconstruction anchored where it stood.",
      "Hands-free on glasses, later — standing inside the same grounded record, not a better truth.",
    ],
  },
  lifecycle: {
    label: "What the record unlocks",
    positioning: "The incident record your post-failure workflow runs through.",
    intro:
      "Held independently, reconstructions accumulate — and a record that accumulates can carry the work that comes after a failure. Software teams have closed this loop for a decade. Robotics observability hasn’t.",
    steps: [
      {
        id: "fingerprint",
        title: "Recurring failures become one issue.",
        body: "The same failure mode, recognized across runs, fingerprints into a single issue — keyed to task, policy version, and site — instead of ten separate reports nobody rereads.",
      },
      {
        id: "tracker",
        title: "Issues meet the tracker you already run.",
        body: "Each issue links both ways into Jira or Linear — the grounded reconstruction one click from the ticket, the ticket one click from the record.",
      },
      {
        id: "resolve",
        title: "Resolution binds to a policy version.",
        body: "When the team ships a fix, the issue closes against the checkpoint that carried it. The record holds which policy failed — and which one answered.",
      },
      {
        id: "reopen",
        title: "A regression reopens its own issue.",
        body: "If a resolved failure mode recurs under a new checkpoint, the issue reopens on its own. The record notices; the fix stays yours.",
      },
    ],
    candor:
      "None of this layer is shipped. Today Torsen reconstructs one failure and keeps the independent record; the workflow above is where that record goes — stated plainly, the same way we state what it doesn’t do.",
  },
} as const;

/**
 * CREDIBILITY — pre-product proof, zero logos (brief §7.2 + §7.3 · Phase 4c).
 *
 *   - groundedStance: the trust posture (§7.2). DEEPENS the whatItDoes "ground"
 *     card without repeating it — that card explains the mechanic; this makes it
 *     a discipline Torsen holds (and one the failing system can't hold about
 *     itself). The brief phrase "100% grounded" is allowed here as the stamp.
 *   - funded: EXTERNAL market validation (§7.3). These dollars belong to OTHER
 *     companies / the category — NEVER implied Torsen traction, NEVER ROI/savings.
 *     The ONLY dollars on the public site. Attributions stay conservative
 *     (amount + name); `caveat` flags that figures cite public reporting and that
 *     the companies named are the surrounding category, not partners/customers.
 *
 * Scarcity is NOT here — it already lives at ctaSection.sub / pilotForm.nextStep.
 * Reads FACTUAL, not boastful. figures.length === 3; render as a quiet stat strip
 * (ink values + teal "grounded" accent — amber stays reserved for the "why").
 */
export const credibility = {
  eyebrow: "Why trust this",
  groundedStance: {
    stamp: "100% grounded",
    title: "We don’t take the policy’s word for it. We don’t ask you to take ours.",
    body: "It’s a discipline, not a feature: nothing Torsen says about a failure stands on its own authority. A policy’s explanation and a detector’s alarm are hypotheses — useful pointers, never proof. The account holds only because every line of it is pinned to a camera or physical signal a reader can pull up and check — the posture an independent witness has to keep, and the one the failing system can’t keep about itself.",
  },
  funded: {
    label: "The category is funded",
    framing:
      "Serious capital is already validating every layer next door — the data layer, the replay layer, the observability layer. The independent, spatial, agent-curated record of why is the box still open.",
    figures: [
      { value: "$40M", label: "Foxglove", sub: "robotics observability" },
      { value: "$17M", label: "Rerun", sub: "the open data layer for physical AI" },
      { value: "~$23B", label: "physical AI", sub: "the field these robots ship in" },
    ],
    caveat:
      "Figures reference public reporting on other companies and the wider category — not Torsen’s own funding, traction, partners, or customers.",
  },
} as const;

export const ctaSection = {
  heading: "Bring us your hardest unexplained failure.",
  sub: "We take a handful of incidents at a time. Tell us about a failure your logs couldn’t explain — one you already have a recording of — and we’ll follow up to reconstruct the grounded why with you, founder-to-engineer.",
  cta: "Start a pilot",
} as const;

export const nav = {
  links: [
    // Labels anchor to the tightened section set (audit-driven cut).
    { label: "The cost", href: "#cost" },
    { label: "The product", href: "#product" },
    { label: "ROI", href: "#roi" },
  ],
  cta: "Start a pilot",
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const footer = {
  // One-line company descriptor — legitimacy for the reliability engineer being
  // asked to trust an "independent record". Guardrail-safe: witness / reconstruct
  // / grounded / independent.
  descriptor:
    "Independent incident reconstruction for physical AI — a read-only witness that reconstructs the grounded why behind a learned policy’s failure, and keeps it as an independent record.",
  contact: "cyrilletabe@torsen.ai",
  contactHref: "mailto:cyrilletabe@torsen.ai",
  privacyLabel: "Privacy",
  privacyHref: "/privacy/",
  copyright: "© 2026 Torsen. All rights reserved.",
} as const;

export const privacy = {
  title: "Privacy",
  updated: "Last updated June 2026.",
  // Must describe what the forms ACTUALLY send. The pilot form posts three
  // things (incident description, whether a recording exists, email); the
  // keep-me-posted path posts one (email). Saying "only the email address" was
  // wrong — if we ask people to trust us with an evidence record, the privacy
  // page is a strange place to be careless.
  body: [
    "If you apply for a pilot, Torsen collects three things: the description of the failure you write, whether you have a recording of it, and your email address. If you only ask to be kept posted, we collect your email address and nothing else. We use them for one thing: to reply to you about reconstructing a failure, or to update you when there’s something worth sharing.",
    "Submissions are handled by Formspree, our form provider, which processes the email on our behalf. We do not sell, rent, or share your address, and we send no marketing.",
    "Want off the list? Email cyrilletabe@torsen.ai and we’ll delete your address.",
  ],
  back: "Back to torsen.ai",
} as const;

// The lightweight "keep me posted" path (secondary to the forensics-pilot intake
// form). Single email -> Formspree. The primary application is `pilotForm`.
export const waitlist = {
  placeholder: "you@company.com",
  cta: "Keep me posted",
  sending: "Sending…",
  requested: "Added ✓",
  success: "You’re on the list — we’ll reach out when there’s something worth sharing.",
  error: "Something went wrong. Please try again.",
  invalid: "Enter a valid email address.",
  // Shown when no Formspree endpoint is configured yet.
  unconfigured: "Form endpoint not configured yet.",
  // Low-intent capture: one email, no spam.
  privacy: "One email when there’s news. No spam.",
} as const;

/**
 * The pilot intake form. THREE fields — the failure, whether a recording exists,
 * and an email. Nothing else.
 *
 * It used to ask nine (company+role, policy stack, robot model, current
 * time-to-root-cause, a willingness-to-pay probe and its amount, on top of these
 * three). Every one of those was a real question worth an answer — and asking
 * them all of a cold visitor, before Torsen has done anything for them, is how
 * you get a beautifully-instrumented form that nobody finishes. Discovery data
 * you never receive is worth nothing.
 *
 * The cut questions are not abandoned, they are DEFERRED to the founder's reply,
 * where the person is already engaged and answering costs them nothing. A short
 * form plus a live thread yields strictly more signal than a long form plus an
 * abandonment. If you re-add a field here, be able to say which of those three
 * it outranks.
 *
 * Guardrail-safe: founder-led, limited-slot framing — never promises instant
 * turnaround or an automated product, never implies Torsen prevents/fixes/
 * controls anything.
 */
export const pilotForm = {
  source: "torsen.ai pilot",
  submit: "Send us the failure",
  sending: "Sending…",
  error: "Something went wrong sending that. Please try again.",
  unconfigured: "Form endpoint not configured yet.",
  errorSummaryTitle: "Please correct a few things:",
  // Founder-led, limited-slot expectation — sits under the submit button. It
  // also sets the expectation that the REST of the conversation happens by reply.
  nextStep:
    "Three questions, then a founder reads it and replies in person — we’ll ask about your stack there, not here.",
  privacy: "Your answers go to one inbox via Formspree — no marketing, never shared.",
  success: {
    title: "Received.",
    body: "We read every one of these ourselves — expect a reply, founder-to-engineer, about reconstructing this failure with you.",
  },
  // Divider into the secondary low-intent path (renders <WaitlistForm/>).
  secondaryPrompt: "Not ready to bring a failure yet?",
  fields: {
    incident: {
      label: "The incident",
      placeholder: "What did the robot do, and what couldn’t your logs explain about why?",
      help: "One failure your recordings show, but never explain. No customer names needed.",
      error: "Give us a couple of sentences — the failure your logs couldn’t explain.",
    },
    hasRecording: {
      label: "Do you have a recording of it?",
      help: "A rosbag/MCAP of the failure window is ideal, but not required to apply.",
      options: [
        { value: "yes", label: "Yes — a rosbag or MCAP I can share" },
        { value: "no", label: "No recording of this one" },
        { value: "unsure", label: "Not sure / would have to check" },
      ],
      error: "Let us know if there’s a recording — yes, no, or not sure.",
    },
    email: {
      label: "Work email",
      placeholder: "you@company.com",
      error: "Enter a valid work email so we can follow up.",
    },
  },
} as const;

/**
 * The head-to-head demo (brief §5 — the centerpiece). A flat rosbag timeline the
 * visitor scrubs (status quo) vs. a curated Torsen reconstruction, racing on
 * time-to-root-cause.
 *
 * HONESTY — this is a REPRESENTATIVE reconstruction: synthetic, clearly labeled,
 * no real customer data. The left "you" timer is the visitor's OWN real scrub
 * time (wall-clock); the right Torsen figure is a fixed representative number.
 *
 * GUARDRAIL — Torsen reconstructs/explains/records; it never prevented, fixed,
 * controlled, or should-have-prevented anything. Every signal below is a grounded
 * claim tied to a retrieved camera/physical signal — what HAPPENED and why, never
 * a Torsen intervention. "Out-of-distribution" is always glossed in plain language.
 *
 * STRUCTURAL NOTES for the component:
 *   - rosbag.topics renders as the flat, undifferentiated left timeline — none is
 *     flagged; the point is density. texture ∈ {"noisy","steady","sparse"}.
 *   - signals[] is the curated right panel (4 signals). Each is one grounded claim.
 *   - signals order is the causal chain: operator dropped -> surface OOD -> balance
 *     margin collapses -> contact breaks. Keep this order.
 *   - the component derives playhead/marker positions from spanStart/spanEnd and the
 *     failureAt / signal trigger timestamps; the left "you" clock is wall-clock.
 */
export const headToHead = {
  eyebrow: "Time-to-root-cause",
  heading: "Same failure. Two ways to find out why.",
  question: "Why did it fall toward the operator?",
  intro:
    "A learned-policy humanoid lost its footing in a shared workcell and toppled toward an operator; the e-stop fired. Nobody was hurt. Scrub the raw log to find out why — then reconstruct it with Torsen.",
  disclaimer:
    "Representative reconstruction, rendered — synthetic data, not a real customer incident. Built to show what a Torsen reconstruction looks like.",

  rosbag: {
    label: "Raw rosbag timeline",
    sublabel: "What you’d scrub today",
    caption: "A real recording, replayed flat — dozens of topics, no culprit marked.",
    scrubHint: "Scrub to hunt for the failure",
    spanStart: "12:03:50.000",
    spanEnd: "12:04:12.400",
    failureAt: "12:04:07.131",
    failureLabel: "topple · e-stop",
    topics: [
      { topic: "/tf", type: "tf2_msgs/TFMessage", rate: 200, texture: "noisy" },
      { topic: "/tf_static", type: "tf2_msgs/TFMessage", rate: 1, texture: "sparse" },
      { topic: "/joint_states", type: "sensor_msgs/JointState", rate: 500, texture: "noisy" },
      { topic: "/imu/data", type: "sensor_msgs/Imu", rate: 400, texture: "noisy" },
      { topic: "/odom", type: "nav_msgs/Odometry", rate: 200, texture: "steady" },
      { topic: "/cmd_vel", type: "geometry_msgs/Twist", rate: 100, texture: "steady" },
      { topic: "/policy/action", type: "std_msgs/Float32MultiArray", rate: 50, texture: "steady" },
      { topic: "/policy/value", type: "std_msgs/Float32", rate: 50, texture: "noisy" },
      { topic: "/footstep_plan", type: "humanoid_msgs/FootstepArray", rate: 10, texture: "sparse" },
      { topic: "/com_state", type: "humanoid_msgs/CoMState", rate: 200, texture: "noisy" },
      { topic: "/foot_contacts", type: "humanoid_msgs/ContactState", rate: 200, texture: "steady" },
      { topic: "/camera/color/image_raw", type: "sensor_msgs/Image", rate: 30, texture: "steady" },
      { topic: "/camera/depth/image_rect", type: "sensor_msgs/Image", rate: 30, texture: "steady" },
      { topic: "/perception/tracks", type: "vision_msgs/Detection3DArray", rate: 20, texture: "noisy" },
      { topic: "/scan", type: "sensor_msgs/LaserScan", rate: 15, texture: "sparse" },
      { topic: "/diagnostics", type: "diagnostic_msgs/DiagnosticArray", rate: 5, texture: "sparse" },
      { topic: "/estop", type: "std_msgs/Bool", rate: 1, texture: "sparse" },
      { topic: "/clock", type: "rosgraph_msgs/Clock", rate: 1000, texture: "steady" },
    ],
  },

  reconstruction: {
    label: "Torsen reconstruction",
    sublabel: "The few signals that mattered",
    button: "Reconstruct with Torsen →",
    caption: "Jumped to the failure window. Four grounded signals, in the order they failed.",
    groundedTag: "tied to a retrieved signal",
    reset: "Run it again",
    // The rendered-clip stage (replaces the live 3D). HONESTY — the clip is a
    // RENDER: labelled in-frame (chip) and owned in the caption; never
    // "generated / AI / vendor" wording, never passed off as footage. The truth
    // surface stays the signals + grounded why below the stage.
    videoChip: "render · representative",
    videoCaption:
      "A representative reconstruction, rendered — not real footage, not customer data. The grounded why below is tied to retrieved signals.",
    videoAlt:
      "Rendered reconstruction: the humanoid loses its footing on the novel surface patch and topples toward the operator as the e-stop fires.",
  },

  signals: [
    {
      id: "operatorTrack",
      label: "Operator-track confidence",
      value: "0.91 → 0.12",
      trigger: "12:04:05.880",
      shows: "A beat before the fall, the operator passed behind a workcell fixture and the world-model dropped the track — so the space it fell into was no longer held as a person.",
    },
    {
      id: "surfaceNovelty",
      label: "Surface-novelty score",
      value: "0.08 → 0.86",
      trigger: "12:04:06.620",
      shows: "The lead foot met a wet grating unlike anything in the policy’s training — out-of-distribution, i.e. off the edge of what it had ever seen — and its footing response stopped being reliable.",
    },
    {
      id: "stabilityMargin",
      label: "CoM / ZMP stability margin",
      value: "62 mm → −18 mm",
      trigger: "12:04:06.890",
      shows: "Balance headroom went negative and the body’s momentum carried right — into the floor space the operator had just dropped out of, so the trajectory was never raised as a human-proximity event.",
    },
    {
      id: "footContact",
      label: "Foot-contact symmetry",
      value: "0.97 → 0.04",
      trigger: "12:04:07.131",
      shows: "The right foot lost purchase on the grating, load dumped onto a foot that couldn’t hold it, both feet broke contact — the topple — and the e-stop fired.",
    },
  ],

  why: {
    line: "It went off the edge of its training on a surface it had never seen, and lost its balance toward a space it had stopped seeing the operator in.",
    groundedNote: "Every line above is tied to a signal in the record — reconstructed, not inferred.",
  },

  stopwatch: {
    youName: "You",
    youSuffix: "and counting",
    torsenName: "Torsen",
    torsenValue: "3.2s",
    caption: "The left clock is your own time, scrubbing right now. The right is a representative Torsen reconstruction time.",
  },
} as const;

/**
 * /case — THE INCIDENT REPLAY (the pitch deck’s product UI, made real).
 * A hidden route: noindex, linked from nowhere, shown at events from the local
 * static build. This block is CHROME copy only — everything case-specific
 * (signals, events, evidence, diagnosis) lives in data/case-record.json, the
 * same record shape the witness pipeline will emit from a real recording.
 * Template over JSON is load-bearing: fictive record now, real record later,
 * no redesign.
 *
 * HONESTY — the page is labelled representative/synthetic in-frame, and the
 * viewport clip is a RENDER (never “generated / AI / vendor” in public copy).
 * Witness discipline: the panel recommends a next INSPECTION, never a fix;
 * Torsen shows, the team acts.
 *
 * STRUCTURAL INVARIANTS — components parse these; do not break:
 *   - rail.items ids stay "replay" / "timeline" / "signals" / "events" /
 *     "export" (glyph lookup); `live` marks the tabs that respond.
 *   - viewport.chipRender is the in-frame honesty chip — it stays in-frame in
 *     every viewport state (poster and clip alike).
 *   - ask.* is CHROME only — the askable questions, answers and searchable
 *     moments live in the case record (they are curated content, not copy).
 */
export const caseDemo = {
  meta: {
    title: "Incident replay — representative case",
    description:
      "A representative Torsen incident replay — synthetic data, labelled as such.",
  },
  rail: {
    product: "Incident replay",
    items: [
      { id: "replay", label: "Replay", live: true },
      { id: "timeline", label: "Timeline", live: false },
      { id: "signals", label: "Signals", live: false },
      { id: "events", label: "Events", live: true },
      { id: "export", label: "Export", live: false },
    ],
    provenance: "source opened read-only · 0 bytes written to origin",
  },
  viewport: {
    chipRender: "render · representative",
    speed: "1.0×",
  },
  scrubber: {
    divergenceLabel: "First divergence",
    hint: "Scrub the incident timeline",
  },
  // The baseline legend — CHROME only; the run count, the matched dimensions and
  // every timestamp come from the record. This is the honesty layer of the
  // comparison: it states what the band IS, and — just as load-bearing — which
  // lane deliberately has none and why.
  baseline: {
    band: "Nominal band",
    breach: "Outside the envelope",
    matchedPrefix: "matched on",
    evidenceLane: "evidence · no band",
    noBand:
      "Laser min. distance carries no band: what sits in the aisle varies legitimately from run to run. It is evidence for a divergence, never the definition of one.",
  },
  ask: {
    placeholder: "Ask the record…",
    label: "Ask the record",
    answersHeading: "Answers",
    momentsHeading: "Moments",
    suggestedHeading: "This record answers",
    groundedTag: "grounded",
    // The honest miss — the demo answers only from the curated set, and says so.
    fallback: "Not in this record — the curated set answers these:",
    dismiss: "Clear",
  },
  events: { heading: "Events" },
  transport: {
    play: "Play",
    pause: "Pause",
    replay: "Replay the incident",
  },
  // The action layer — the case as a work item. Witness discipline: every
  // verb here is the TEAM acting on its own systems (assign, inspect, file,
  // resolve); Torsen only records and watches. Never robot-control language.
  workflow: {
    statusUnresolved: "Unresolved",
    statusAssigned: "Assigned",
    statusResolvedIn: "Resolved in",
    assignCta: "Assign to me",
    assignedYou: "you",
    checklistShow: "Open checklist",
    checklistHide: "Hide checklist",
    resolveCta: "Mark resolved in",
    boundTo: "Resolution bound to",
    watched: "Torsen watches every future policy version for recurrence.",
    ticketCaption: "Synced to your tracker — Torsen never writes your ticket text.",
    ticketResolvedState: "resolved",
  },
  diagnosis: {
    heading: "Diagnosis",
    likelyCause: "Likely cause:",
    evidence: "Evidence at divergence:",
    nextAction: "Next action",
    // The head start — the whole argument for the baseline, in one number. The
    // gap is COMPUTED from the record (noticed − firstDeparture), never typed
    // here: if the comparison changes, the claim has to change with it.
    headStart: "Found ahead of the stop",
    headStartUnit: "earlier than the stop",
  },
  /**
   * HYPOTHESES + COVERAGE — the honesty layer, and the answer to the r/ROS
   * thread's real objection ("an LLM reads the logs and confidently tells you
   * the wrong root cause"). Three rules the copy must never soften:
   *   · every hypothesis shows what argues AGAINST it, not only for
   *   · the confidences do not sum to 1, and the shortfall is named out loud
   *   · the record states what it CANNOT settle, before anyone has to ask
   */
  hypotheses: {
    heading: "Hypotheses",
    // Confidence is a ranking over evidence, not a feeling. Say so where it's shown.
    calibration:
      "Ranked on the evidence in this record. Not a model’s certainty — and not padded to 100%.",
    supporting: "What supports it",
    counter: "What argues against it",
    ruledOut: "Ruled out",
    unaccounted: "Unaccounted",
    unaccountedNote: "No hypothesis the evidence in this record supports.",
    expand: "Show the evidence",
    collapse: "Hide the evidence",
    wouldMove: "Would be settled by:",
  },
  coverage: {
    heading: "What this record can’t settle",
    limitLabel: "The ceiling",
    missingHeading: "Log this and the next one answers it",
    settles: "Settles",
    capture: "Capture",
  },
  disclaimer:
    "Representative case — synthetic data, rendered reconstruction; not a real customer incident.",
} as const;

/**
 * /fleet — the case-index board (the deck's slide-8 INCIDENTS panel, made real).
 * Screen two of the booth demo: the operator's view across the fleet, drilling
 * into the single reconstructed case (/case). Witness discipline holds — the
 * board records and watches; it never acts on a robot. Honest in-progress:
 * sibling cases are still reconstructing (real elapsed), not fake-instant.
 */
export const fleetBoard = {
  meta: {
    title: "Fleet incidents — representative site",
    description:
      "A representative Torsen fleet case-index — synthetic data, labelled as such.",
  },
  rail: {
    product: "Case index",
    items: [
      { id: "overview", label: "Overview", live: true },
      { id: "cases", label: "Cases", live: true },
      { id: "fingerprints", label: "Fingerprints", live: false },
      { id: "policies", label: "Policies", live: false },
      { id: "export", label: "Export", live: false },
    ],
    provenance: "source opened read-only · 0 bytes written to origin",
  },
  stats: {
    incidentsToday: "Incidents today",
    openCases: "Open cases",
    reconstructing: "Reconstructing",
    medianTtrc: "Median time to root cause",
  },
  histogram: { heading: "Today", axisNote: "incidents / hour" },
  roster: { heading: "Fleet", incidentsSuffix: "open" },
  table: {
    heading: "Latest incidents",
    cols: {
      ref: "Case",
      robot: "Robot",
      task: "Task",
      cause: "First divergence",
      opened: "Opened",
      status: "Status",
    },
    openCase: "Open replay",
    reconstructingNote: "Reconstruction takes minutes — Torsen curates, it never guesses.",
    statusUnresolved: "Unresolved",
    statusResolvedIn: "Resolved in",
    statusReconstructing: "Reconstructing",
  },
  chipRepresentative: "representative · synthetic",
  disclaimer:
    "Representative site — synthetic data; not a real customer fleet. One case is reconstructed; the rest are shown mid-reconstruction or resolved.",
} as const;
