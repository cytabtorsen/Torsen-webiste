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
  eyebrow: "Independent incident reconstruction for physical AI",
  // H1 is split so the leading word can carry the amber "why" signature.
  h1: { whyWord: "Why", rest: "did the robot do that?" },
  sub: "You already log everything — Foxglove, Rerun, rosbags. None of it explains a learned policy’s decision. Torsen reconstructs the grounded “why” — from camera and physical ground truth, curated to the few signals that matter, kept as an independent record.",
  cta: "Apply for a forensics pilot",
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

export const mission = {
  eyebrow: "Where this goes",
  // North-star line. Keep large and quiet. INVARIANT: must contain lowercase "why".
  line: "Learned policies are becoming how every complex robot is built — and how they fail. Torsen is the independent record of why, for as long as they run.",
} as const;

export const ctaSection = {
  heading: "Bring us your hardest unexplained failure.",
  sub: "We take a handful of incidents at a time. Tell us about a failure your logs couldn’t explain — one you already have a recording of — and we’ll follow up to reconstruct the grounded why with you, founder-to-engineer.",
  cta: "Apply for a forensics pilot",
} as const;

export const nav = {
  links: [
    // Labels match the section eyebrows so the vocabulary stays consistent.
    { label: "The gap", href: "#problem" },
    { label: "What it does", href: "#what" },
    { label: "Where it fits", href: "#difference" },
    { label: "Where this goes", href: "#mission" },
  ],
  cta: "Apply for a forensics pilot",
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
  // Honest + minimal. Matches what the form actually does (single email field,
  // handled by Formspree) under the reframed forensics-pilot / keep-me-posted intent.
  body: [
    "Torsen collects only the email address you submit — whether you’re applying for a forensics pilot or just asking to be kept posted. We use it for one thing: to reply to you about reconstructing a failure, or to update you when there’s something worth sharing.",
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
 * The forensics-pilot intake form (Phase 2a). The gated application that doubles
 * as a discovery instrument + willingness-to-pay probe. Sits under
 * ctaSection.heading / ctaSection.sub; the lightweight "keep me posted" path
 * keeps using the `waitlist` object above. Guardrail-safe: founder-led,
 * limited-slot framing — never promises instant turnaround or an automated
 * product, never implies Torsen prevents/fixes/controls anything. The WTP probe
 * reads as research, not a sell (a friction-free "no" is a first-class option;
 * any amount is explicitly optional and ballpark).
 */
export const pilotForm = {
  source: "torsen.ai forensics-pilot",
  submit: "Send us the failure",
  sending: "Sending…",
  error: "Something went wrong sending that. Please try again.",
  unconfigured: "Form endpoint not configured yet.",
  errorSummaryTitle: "Please correct a few things:",
  // Founder-led, limited-slot expectation — sits under the submit button.
  nextStep:
    "We take a handful of incidents at a time — a founder reads every application and replies in person.",
  // Single Formspree endpoint; honest + minimal.
  privacy: "Your answers go to one inbox via Formspree — no marketing, never shared.",
  // Replaces the form on success (founder-to-engineer voice).
  success: {
    title: "Received.",
    body: "We read every one of these ourselves — expect a reply, founder-to-engineer, about reconstructing this failure with you.",
  },
  // Fieldset legends — chunk the form so 8 inputs don't read as a wall.
  legends: { incident: "The failure", you: "You & your stack" },
  // Divider into the secondary low-intent path (renders <WaitlistForm/>).
  secondaryPrompt: "Not ready to bring a failure yet?",
  fields: {
    companyRole: {
      label: "Company & your role",
      placeholder: "Figure — reliability lead · Agility — field engineer",
      help: "We work with the engineer who owns the failure, not central IT.",
      error: "Tell us who you are and what you own — the failure-owner, not central IT.",
    },
    policyStack: {
      label: "Primary policy stack",
      placeholder: "Select the policy in control —",
      options: [
        { value: "vla", label: "VLA — vision-language-action" },
        { value: "il", label: "Imitation learning" },
        { value: "rl", label: "Reinforcement learning" },
        { value: "hybrid", label: "Hybrid / multiple" },
        { value: "other", label: "Other learned policy" },
      ],
      error: "Pick the policy that was in control when it failed.",
    },
    robotModel: {
      label: "Robot type & model family",
      placeholder: "e.g. humanoid, π0 · wheeled manipulator, in-house IL",
      help: "Hardware and the model family it runs — as specific as you can share.",
      error: "Name the robot and the model family — even roughly.",
    },
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
    timeToRootCause: {
      label: "Time from incident to confirmed root cause — today",
      placeholder: "How long it takes you now —",
      help: "Roughly, for a failure like this one — from when it happened to a root cause you’d stand behind.",
      options: [
        { value: "lt1h", label: "Under an hour" },
        { value: "1to8h", label: "1–8 hours" },
        { value: "1to3d", label: "1–3 days" },
        { value: "gt3d", label: "More than 3 days" },
        { value: "unresolved", label: "Still open — we never confirmed it" },
      ],
      error: "Pick the range that’s closest — a rough honest answer beats a precise guess.",
    },
    wtp: {
      label:
        "If a scoped forensics pilot reconstructed this failure, would a token fee be worth it to you?",
      help: "Honest answers help us scope this fairly — there’s no wrong one, and no commitment here.",
      options: [
        { value: "yes", label: "Yes — that’d be worth paying for" },
        { value: "maybe", label: "Maybe — depends what it surfaced" },
        { value: "no", label: "No — I’d only want it free" },
      ],
      error: "Pick the one that’s most honest — yes, maybe, or no.",
    },
    wtpAmount: {
      // Conditional: shown only when wtp is "yes" or "maybe". Always optional.
      label: "A ballpark, if one comes to mind",
      placeholder: "e.g. a few hundred to scope it — only if a figure’s in your head",
    },
    email: {
      label: "Work email",
      placeholder: "you@company.com",
      error: "Enter a valid work email so we can follow up.",
    },
  },
} as const;
