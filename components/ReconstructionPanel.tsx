"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { problem } from "@/lib/copy";

/**
 * The "one reconstructed moment" panel (right side of the PROBLEM section).
 *
 * Interactive on purpose: the amber reconstruction trace DRAWS IN the first time
 * the panel scrolls into view (so the product metaphor is actually witnessed,
 * not finished off-screen), then REPLAYS on hover/focus — "play the
 * reconstruction." Reduced-motion shows the finished trace, statically.
 *
 * The path / node geometry is unchanged from the original static version; only
 * the draw is now driven by framer so it's seen and re-triggerable.
 */
const TRACE_D = "M70 232 C 150 210, 176 132, 250 116 S 372 96, 410 66";

export function ReconstructionPanel() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-12% 0px" });
  // Bumping this key remounts the animated nodes so the draw restarts on replay.
  const [replay, setReplay] = useState(0);

  const play = inView || reduce;
  const replayNow = () => {
    if (!reduce) setReplay((r) => r + 1);
  };

  return (
    <figure
      ref={ref}
      tabIndex={0}
      onMouseEnter={replayNow}
      onFocus={replayNow}
      aria-label="A reconstructed moment: an amber trajectory resolving into a grounded node"
      className="focus-ring group relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised shadow-glow-teal transition-colors duration-300 hover:border-teal/50"
    >
      <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
        <span className="eyebrow text-teal/80">{problem.panels.reconLabel}</span>
        <span className="font-mono text-[11px] text-ink-dim">{problem.panels.reconState}</span>
      </figcaption>

      <div className="relative h-72">
        {/* faint blueprint grid, masked — echoes the hero backdrop */}
        <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />

        {/* ambient amber + teal glow; intensifies a touch on hover */}
        <div
          className="pointer-events-none absolute right-[10%] top-[18%] h-40 w-40 rounded-full bg-amber/12 blur-[80px] transition-opacity duration-500 group-hover:opacity-70"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[8%] top-[12%] h-28 w-28 rounded-full bg-teal/10 blur-[70px] transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 480 288"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* soft halo under the trace */}
          <path d={TRACE_D} stroke="#FFB454" strokeOpacity={0.16} strokeWidth={8} strokeLinecap="round" fill="none" />

          {/* the grounded reconstructed trajectory — draws in on view / replay */}
          <motion.path
            key={`trace-${replay}`}
            d={TRACE_D}
            stroke="#FFB454"
            strokeWidth={2.25}
            strokeLinecap="round"
            fill="none"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={play ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
          />

          {/* origin marker — faint amber start of the reconstruction */}
          <circle cx={70} cy={232} r={3} fill="#FFB454" fillOpacity={0.55} />

          {/* teal grounded node where the moment resolves — fades+pops in after the draw */}
          <motion.g
            key={`node-${replay}`}
            initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            animate={play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ delay: reduce ? 0 : 1.45, duration: 0.45, ease: "backOut" }}
            style={{ transformOrigin: "410px 66px" }}
          >
            <circle cx={410} cy={66} r={5} fill="#16C79A" className={reduce ? "" : "animate-pulse-node"} style={{ transformOrigin: "410px 66px" }} />
            <circle cx={410} cy={66} r={11} fill="none" stroke="#16C79A" strokeOpacity={0.3} strokeWidth={1.5} />
            <circle cx={410} cy={66} r={18} fill="none" stroke="#16C79A" strokeOpacity={0.12} strokeWidth={1.5} />
          </motion.g>
        </svg>

        {/* the answer, named — the signature amber "why" */}
        <div className="absolute bottom-4 left-5 font-mono text-[11px] text-ink-dim">
          <span className="why">why</span>
          <span className="text-ink-dim">{problem.panels.captionAfter}</span>
        </div>

        {/* tiny replay affordance, revealed on hover/focus */}
        <span
          className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.18em] text-teal/0 transition-colors duration-300 group-hover:text-teal/70 group-focus-visible:text-teal/70"
          aria-hidden="true"
        >
          replay ↺
        </span>
      </div>
    </figure>
  );
}
