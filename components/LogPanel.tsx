"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { problem } from "@/lib/copy";

/**
 * The "log haystack" (left of the PROBLEM section). The rows now STREAM IN with
 * a stagger the first time the panel enters view — it reads as a live recording
 * being captured, while staying undifferentiated noise (the point: the answer is
 * lost in it). Pairs with the reconstruction trace drawing on the right.
 *
 * Decorative: the parent is aria-hidden. Reduced-motion renders the rows static.
 */
const logLines: { ts: string; tag: string; width: string }[] = [
  { ts: "12:04:07.118", tag: "sensor.depth", width: "92%" },
  { ts: "12:04:07.119", tag: "tf.base_link", width: "74%" },
  { ts: "12:04:07.121", tag: "policy.act", width: "88%" },
  { ts: "12:04:07.124", tag: "joint.cmd", width: "61%" },
  { ts: "12:04:07.126", tag: "sensor.imu", width: "83%" },
  { ts: "12:04:07.129", tag: "grip.force", width: "70%" },
  { ts: "12:04:07.131", tag: "policy.act", width: "95%" },
  { ts: "12:04:07.134", tag: "tf.tool0", width: "57%" },
  { ts: "12:04:07.137", tag: "sensor.depth", width: "86%" },
  { ts: "12:04:07.139", tag: "joint.cmd", width: "66%" },
  { ts: "12:04:07.142", tag: "policy.act", width: "90%" },
  { ts: "12:04:07.145", tag: "grip.force", width: "52%" },
];

export function LogPanel() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const play = inView || reduce;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.055, delayChildren: 0.1 } },
  };
  const row: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: "easeOut" } },
  };

  return (
    <figure className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised">
      <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
        <span className="eyebrow">{problem.panels.logsLabel}</span>
        <span className="font-mono text-[11px] text-ink-dim">{problem.panels.logsState}</span>
      </figcaption>

      <div className="relative h-72 px-5 pt-4">
        <motion.div
          ref={ref}
          className="space-y-[7px]"
          aria-hidden="true"
          variants={container}
          initial="hidden"
          animate={play ? "show" : "hidden"}
        >
          {logLines.map((l, i) => (
            <motion.div key={i} variants={row} className="flex items-center gap-3 font-mono text-[11px] leading-none">
              <span className="shrink-0 text-ink-faint/60">{l.ts}</span>
              <span className="shrink-0 text-ink-faint/45">{l.tag}</span>
              <span className="h-[6px] rounded-sm bg-ink-faint/15" style={{ width: l.width }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Fade the haystack out toward the bottom: the answer is lost in it. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ground-raised via-ground-raised/85 to-transparent"
          aria-hidden="true"
        />
      </div>
    </figure>
  );
}
