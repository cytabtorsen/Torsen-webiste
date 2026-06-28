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
        {/* very restrained ambient backdrop */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
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
      </Container>
    </Section>
  );
}
