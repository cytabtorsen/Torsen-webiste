"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Section, Container } from "@/components/Section";
import { mission } from "@/lib/copy";

/**
 * MISSION — the north-star line. Larger and quiet, but no longer inert: the
 * ambient amber glow tracks the cursor across the statement (a soft "the page
 * is paying attention" feel), and the word "why" carries the signature amber.
 * Reduced-motion pins the glow centered and disables tracking.
 *
 * Two coda beats follow the line: the LIFECYCLE (act three — what the record
 * unlocks; roadmap, not shipped, and the candor line says so plainly) and the
 * spatial vision ladder. The lifecycle superseded the old corpus teaser.
 */
export function Mission() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position, normalized to [-0.5, 0.5] of the section, spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 20, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 50, damping: 20, mass: 0.7 });
  const glowX = useTransform(sx, [-0.5, 0.5], ["-30%", "30%"]);
  const glowY = useTransform(sy, [-0.5, 0.5], ["-40%", "40%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  // Highlight the word "why" inside the line with the amber signature.
  const [before, after] = mission.line.split("why");

  return (
    <Section
      id="mission"
      className="relative overflow-hidden border-t border-ground-line py-36 sm:py-52"
    >
      <div ref={ref} onMouseMove={onMove} className="absolute inset-0" aria-hidden="true">
        {/* amber glow that tracks the cursor (or stays centered for reduced-motion) */}
        <motion.div
          style={reduce ? undefined : { x: glowX, y: glowY }}
          // framer writes `transform` inline, which would clobber the Tailwind
          // -translate-x/y-1/2 centering — compose the centering back in here.
          transformTemplate={reduce ? undefined : ({ x, y }) => `translate(-50%, -50%) translate(${x}, ${y})`}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.07] blur-[130px]"
        />
      </div>

      <Container className="relative">
        <p className="eyebrow">{mission.eyebrow}</p>
        <p className="mt-10 max-w-5xl text-balance font-display text-[1.9rem] font-medium leading-[1.18] tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
          {before}
          <span className="why">why</span>
          {after}
        </p>

        {/* ── the coda, beat one: the lifecycle — what the record unlocks.
             ROADMAP, NOT SHIPPED: the candor line below is load-bearing. Every
             verb acts on the record, never on the robot. ── */}
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full max-w-4xl bg-gradient-to-r from-ground-line to-transparent"
        />
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          {mission.lifecycle.label}
        </p>
        <p className="mt-5 max-w-2xl text-[17px] font-medium leading-snug text-ink">
          {mission.lifecycle.positioning}
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
          {mission.lifecycle.intro}
        </p>
        <ol className="mt-9 grid max-w-5xl gap-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          {mission.lifecycle.steps.map((step, i) => {
            // `reopen` is the load-bearing step — the one no robotics tool
            // ships — so it alone carries the amber numeral.
            const isReopen = step.id === "reopen";
            return (
              <li key={step.id}>
                <span
                  className={[
                    "font-mono text-[11px] tabular-nums",
                    isReopen ? "text-amber/80" : "text-teal/70",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[15px] font-medium leading-snug text-ink">{step.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{step.body}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-9 flex max-w-2xl gap-3 text-[13px] leading-relaxed text-ink-faint">
          <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-teal/60" />
          <span>{mission.lifecycle.candor}</span>
        </p>

        {/* ── the coda, beat two: the spatial vision ladder ── */}
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full max-w-4xl bg-gradient-to-r from-ground-line to-transparent"
        />
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          {mission.spatialLadder.label}
        </p>
        <ol className="mt-6 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
          {mission.spatialLadder.rungs.map((rung, i) => {
            const isFuture = i === mission.spatialLadder.rungs.length - 1;
            return (
              <li key={rung}>
                <span
                  className={[
                    "font-mono text-[11px] tabular-nums",
                    isFuture ? "text-ink-faint" : "text-teal/70",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[15px] leading-snug text-ink-dim">{rung}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
