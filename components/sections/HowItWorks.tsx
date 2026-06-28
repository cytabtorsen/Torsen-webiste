import type { ReactNode } from "react";
import { Section, Container } from "@/components/Section";
import { howItWorks } from "@/lib/copy";

/**
 * HOW IT WORKS — the engine as a 5-stage legibility funnel:
 * Capture → Detect → Curate → Replay → Record (brief §4 item 4 · Phase 4a).
 *
 * Server component: no hooks, no framer-motion. Scroll-reveal comes from
 * <Section>; the only motion is CSS hover (lift + glyph scale), so it is
 * reduced-motion-safe via globals. The pipeline narrows many raw topics to the
 * few curated signals + one independent record — echoing HeadToHead's
 * flat-many vs. curated-few, and WhatItDoes's teal-grounded / amber-load-bearing
 * accent grammar. CURATE is the load-bearing stage (amber); the rest are teal.
 *
 * INVARIANT: glyphs + accents are keyed on each stage's `id`; copy.ts keeps
 * stages[] in pipeline order (capture → detect → curate → replay → record).
 */

// ~30px line glyphs — same spec as WhatItDoes (1.5–1.75 stroke, rounded, currentColor).
const glyphs: Record<string, ReactNode> = {
  // capture — many parallel topic traces (the raw rosbag) gathered into one node
  capture: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8 h16" strokeOpacity="0.5" />
      <path d="M3 13 h20" strokeOpacity="0.7" />
      <path d="M3 18 h13" strokeOpacity="0.4" />
      <path d="M3 23 h18" strokeOpacity="0.55" />
      <circle cx="25" cy="15" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  // detect — an anomaly spike on a baseline; the flagged event marked
  detect: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="20" x2="27" y2="20" strokeOpacity="0.45" />
      <path d="M3 20 H10 L13 9 L16 20 H27" />
      <circle cx="13" cy="9" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  // curate — the funnel: a wide many-input mouth narrowing to the curated few
  curate: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 6 H21" strokeOpacity="0.4" />
      <path d="M4 6 L14 15 L14 24" />
      <path d="M24 6 L14 15" />
      <circle cx="14" cy="24" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  // replay — a play head framed, with a faint reconstructed trajectory behind it
  replay: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="7" width="22" height="16" rx="2.5" strokeOpacity="0.55" />
      <path d="M13 12.5 L19 15.5 L13 18.5 Z" fill="currentColor" stroke="none" />
      <path d="M6 22 C 10 20, 14 16, 18 17" strokeOpacity="0.3" />
    </svg>
  ),
  // record — the detached, sealed witness record (rhymes with the WhatItDoes "independent" glyph)
  record: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="13" width="16" height="11" rx="2" />
      <path d="M11 13 v-3 a 4 4 0 0 1 8 0 v3" strokeOpacity="0.85" />
      <circle cx="15" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/** Hairline connector that lands on the next stage (desktop only). Amber when it
 *  arrives at Curate (the load-bearing stage), teal otherwise. Decorative. */
function Arrow({ accent }: { accent: "teal" | "amber" }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "pointer-events-none absolute right-[-1.05rem] top-1/2 z-10 hidden -translate-y-1/2 lg:block",
        accent === "amber" ? "text-amber/55" : "text-teal/35",
      ].join(" ")}
    >
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 6 H17" />
        <path d="M13 2 L17 6 L13 10" />
      </svg>
    </span>
  );
}

export function HowItWorks() {
  const stages = howItWorks.stages;

  return (
    <Section id="how" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">{howItWorks.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {howItWorks.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim">{howItWorks.intro}</p>
        <p className="mt-4 max-w-2xl font-mono text-[12px] leading-relaxed text-ink-dim">
          {howItWorks.readsYourStack}
        </p>

        {/* The pipeline — an ordered list; the funnel narrows many → few left→right. */}
        <ol className="mt-14 flex flex-col gap-4 sm:mt-16 lg:flex-row lg:items-stretch lg:gap-9">
          {stages.map((stage, i) => {
            const isCurate = stage.id === "curate";
            const isLast = i === stages.length - 1;
            // The arrow OWNED by this stage lands on the next one; colour it amber
            // when the next stage is Curate, so the accent "arrives" on the product.
            const arrowIntoCurate = stages[i + 1]?.id === "curate";
            return (
              <li key={stage.id} className="group relative flex-1">
                {/* Card chrome lives on an inner wrapper so its overflow-hidden
                    (which clips the hover sheen) does NOT clip the connector
                    arrow, which bleeds into the gutter as a sibling below. */}
                <div
                  className={[
                    "relative flex h-full flex-col overflow-hidden rounded-xl border bg-ground-raised p-6 sm:p-7",
                    "transition duration-300 ease-out group-hover:-translate-y-1",
                    isCurate
                      ? "border-amber/25 group-hover:border-amber/50 group-hover:shadow-glow"
                      : "border-ground-line group-hover:border-teal/50 group-hover:shadow-glow-teal",
                  ].join(" ")}
                >
                  {/* hover sheen from the glyph corner */}
                  <span
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                      isCurate ? "bg-amber/15" : "bg-teal/12",
                    ].join(" ")}
                  />

                  <span aria-hidden="true" className="relative font-mono text-[11px] tabular-nums text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={[
                      "relative mt-3 inline-flex transition-transform duration-300 ease-out group-hover:scale-110",
                      isCurate ? "text-amber/90 group-hover:text-amber" : "text-teal/90 group-hover:text-teal",
                    ].join(" ")}
                  >
                    {glyphs[stage.id]}
                  </span>

                  <h3 className="mt-5 text-balance text-base font-medium leading-snug text-ink">
                    {stage.title}
                  </h3>
                  {isCurate && (
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber/80">
                      {howItWorks.curateMarker}
                    </p>
                  )}

                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-dim">{stage.body}</p>
                  <p
                    className={[
                      "mt-3 font-mono text-[11px] leading-relaxed",
                      isCurate ? "text-amber/70" : "text-teal/70",
                    ].join(" ")}
                  >
                    {stage.grounding}
                  </p>
                </div>

                {!isLast && <Arrow accent={arrowIntoCurate ? "amber" : "teal"} />}
              </li>
            );
          })}
        </ol>

        {/* candor — quiet, subordinate, witness-not-actor. */}
        <div className="mt-10 max-w-2xl rounded-lg border border-ground-line/70 bg-ground-raised/40 px-5 py-4 sm:mt-12">
          <p className="eyebrow text-ink-faint">{howItWorks.limits.label}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{howItWorks.limits.body}</p>
        </div>
      </Container>
    </Section>
  );
}
