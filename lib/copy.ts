/**
 * Single source of truth for all site copy (guardrail-safe, verbatim from the
 * approved §8 copy block).
 *
 * POSITIONING GUARDRAIL — load-bearing. Torsen is the accountability / witness
 * layer: it witnesses, reconstructs, explains, records — independently. It is
 * NOT a safety mechanism and NOT the robot's "hands."
 *   Words to use:   witness, reconstruct, explain, evidence, record, independent
 *   Words to avoid: prevent, fix, control, guarantee safety, autonomous correction
 * Copy must never imply Torsen prevents or controls anything.
 */

export const site = {
  name: "Torsen",
  domain: "torsen.ai",
  title: "Torsen — the independent black box for physical AI",
  description:
    "Torsen is the independent black box for physical AI — it reconstructs the grounded “why” behind an autonomous failure, from physical ground truth, not guesswork.",
  url: "https://torsen.ai",
} as const;

export const hero = {
  eyebrow: "Independent reconstruction for physical AI",
  // H1 is split so the leading word can carry the amber "why" signature.
  h1: { whyWord: "Why", rest: "did the robot do that?" },
  sub: "Torsen is the independent black box for physical AI — it reconstructs the grounded “why” behind an autonomous failure, from physical ground truth, not guesswork.",
  cta: "Request early access",
} as const;

export const problem = {
  eyebrow: "The bet",
  heading: "As robots leave the human loop, the answer to why disappears.",
  body: "Autonomy removes the human who used to explain what happened. The machine keeps acting; the answer to “why” disappears. Logs show what was recorded — not why the policy chose it.",
  panels: {
    logsLabel: "logs",
    logsState: "recorded",
    reconLabel: "reconstruction",
    reconState: "grounded",
    captionAfter: " > reconstructed",
  },
} as const;

export const whatItDoes = {
  eyebrow: "What Torsen does",
  heading: "Reconstruct the moment. Ground every claim. Keep an independent record.",
  cards: [
    {
      id: "reconstruct",
      title: "Reconstruct the failure window.",
      body: "Rebuild the moment things went wrong — the window around the failure and the grounded “why” behind it.",
    },
    {
      id: "ground",
      title: "Ground every claim in camera + physical signals.",
      body: "Camera and physical signals are truth; testimony is hypothesis. Every claim is anchored to physical ground truth, not guesswork.",
    },
    {
      id: "independent",
      title: "Keep an independent, tamper-evident record — a witness, never an actor.",
      body: "An incident bundle held independently of the machine. Torsen witnesses; it never acts.",
    },
  ],
} as const;

export const difference = {
  eyebrow: "How it's different",
  heading: "Visualizers show you the data. Torsen tells you why — independently.",
  // Generic category — deliberately no named/logoed competitor.
  colThem: "Visualizers & dashboards",
  colUs: "Torsen",
  caption: "How Torsen differs from visualizers and dashboards",
  // Comparison strip: the status quo vs. Torsen. Lead with independence.
  rows: [
    { them: "Viewers and dashboards show you the data.", us: "Torsen reconstructs why the policy chose it." },
    { them: "The record lives inside the machine that acted.", us: "The record is kept independently — a witness, not the actor." },
    { them: "Answers rest on logs and testimony.", us: "Answers are grounded in camera + physical signals." },
  ],
} as const;

export const audience = {
  eyebrow: "Who it's for",
  heading: "Built for the people who have to answer for the machine.",
  body: "Reliability and failure-analysis engineers shipping learned-policy robots — the people who get asked “why did it do that?” and need a grounded answer.",
  // Role chips — each phrase appears verbatim in `body` above.
  roles: ["reliability", "failure-analysis", "learned-policy robots"],
  rolesLabel: "The people Torsen is built for",
} as const;

export const mission = {
  eyebrow: "Mission",
  // North-star line. Keep large and quiet.
  line: "Make every autonomous machine able to answer “why did you do that?” — independently, for as long as it runs.",
} as const;

export const ctaSection = {
  heading: "Request early access.",
  sub: "Built for the people who have to answer for the machine.",
  cta: "Request early access",
} as const;

export const nav = {
  links: [
    { label: "Problem", href: "#problem" },
    { label: "What it does", href: "#what" },
    { label: "Difference", href: "#difference" },
    { label: "Mission", href: "#mission" },
  ],
  cta: "Request early access",
} as const;

export const footer = {
  tagline: "Built for the people who have to answer for the machine.",
  copyright: `© ${"2026"} Torsen. All rights reserved.`,
} as const;

export const waitlist = {
  placeholder: "you@company.com",
  cta: "Request early access",
  sending: "Sending…",
  requested: "Requested ✓",
  success: "You’re on the list. We’ll be in touch.",
  error: "Something went wrong. Please try again.",
  invalid: "Enter a valid email address.",
  // Shown when no Formspree endpoint is configured yet.
  unconfigured: "Waitlist endpoint not configured yet.",
  privacy: "No spam. One email when early access opens.",
} as const;
