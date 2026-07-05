"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section, Container } from "@/components/Section";
import { headToHead as hh } from "@/lib/copy";
import { ReconstructionVideo } from "./headtohead/ReconstructionVideo";

/**
 * THE HEAD-TO-HEAD (brief §5 — the centerpiece). A flat rosbag timeline the
 * visitor scrubs (status quo) vs. a curated Torsen reconstruction, racing on
 * time-to-root-cause. The revealed right panel carries a rendered-clip stage
 * (ReconstructionVideo) atop the curated 2D payload — the 2D signals + grounded
 * why remain the truth surface; the stage can be swapped (video / live 3D)
 * without touching this state machine.
 *
 * Honesty: the left "you" clock is the visitor's OWN real scrub time (starts on
 * their first scrub, not on scroll-in — counting passive time would rig the
 * stopwatch). The right Torsen figure is a fixed representative number, and the
 * whole demo is labelled a representative reconstruction.
 */

// "HH:MM:SS.mmm" -> ms since midnight (only differences are used, so the base is moot)
function tsMs(t: string): number {
  const [h, m, sRest] = t.split(":");
  const [s, ms = "0"] = sRest.split(".");
  return ((Number(h) * 60 + Number(m)) * 60 + Number(s)) * 1000 + Number(ms.padEnd(3, "0"));
}
const SPAN0 = tsMs(hh.rosbag.spanStart);
const SPAN1 = tsMs(hh.rosbag.spanEnd);
const frac = (t: string) => (tsMs(t) - SPAN0) / (SPAN1 - SPAN0); // 0..1 within the log span
const FAILURE_FRAC = frac(hh.rosbag.failureAt);

const fmt = (ms: number) => {
  const total = Math.floor(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

// Deterministic per-row "message" ticks (NO Math.random — would break SSR/export hydration).
function tickPositions(seed: number, texture: string): number[] {
  const n = texture === "noisy" ? 17 : texture === "steady" ? 10 : 5;
  return Array.from({ length: n }, (_, k) => ((k * 53 + seed * 37 + 11) % 97) + 1.5);
}

// rAF wall-clock: start once (on first scrub), freeze on reconstruct, reset on re-run.
function useWallClock() {
  const [displayMs, setDisplayMs] = useState(0);
  const startRef = useRef<number | null>(null);
  const frozenRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current == null || frozenRef.current) return;
    setDisplayMs(performance.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (startRef.current != null) return;
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const freeze = useCallback(() => {
    frozenRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (startRef.current != null) setDisplayMs(performance.now() - startRef.current);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    frozenRef.current = false;
    setDisplayMs(0);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return { displayMs, start, freeze, reset };
}

type Phase = "idle" | "hunting" | "reconstructed";

export function HeadToHead() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [scrub, setScrub] = useState(0); // 0..1000
  const clock = useWallClock();
  const resultRef = useRef<HTMLDivElement>(null);
  const pct = scrub / 1000;
  const revealed = phase === "reconstructed";

  const onScrubStart = useCallback(() => {
    setPhase((p) => (p === "idle" ? "hunting" : p));
    clock.start();
  }, [clock]);

  const onReconstruct = useCallback(() => {
    clock.freeze();
    setScrub(Math.round(FAILURE_FRAC * 1000)); // snap the playhead to the failure
    setPhase("reconstructed");
  }, [clock]);

  const onReset = useCallback(() => {
    clock.reset();
    setScrub(0);
    setPhase("idle");
  }, [clock]);

  // Move focus to the result so keyboard / SR users land on the answer.
  useEffect(() => {
    if (!revealed) return;
    const id = requestAnimationFrame(() => resultRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [revealed]);

  const list: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.08 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
  };

  return (
    <Section id="head-to-head" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">{hh.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {hh.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim">{hh.intro}</p>

        {/* The question over both panels */}
        <p className="mt-8 font-display text-lg text-ink">
          <span className="why">Why</span> did it fall toward the operator?
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* ── LEFT — the flat rosbag the visitor scrubs ── */}
          <figure className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised">
            <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
              <span>
                <span className="eyebrow">{hh.rosbag.label}</span>
                <span className="ml-2 font-mono text-[11px] text-ink-faint/70">{hh.rosbag.sublabel}</span>
              </span>
              {/* the live "you" clock — visual only; SR hears it once, on freeze (below) */}
              <span aria-hidden="true" className="font-mono text-[12px] tabular-nums text-ink-dim">
                {hh.stopwatch.youName} {fmt(clock.displayMs)}
              </span>
            </figcaption>

            <div className="relative h-72" data-lenis-prevent>
              {/* gutter of topic names + aligned activity rows */}
              <div className="flex h-full">
                <div className="flex w-[7.5rem] shrink-0 flex-col py-2">
                  {hh.rosbag.topics.map((t) => (
                    <div
                      key={t.topic}
                      className="flex flex-1 items-center truncate pl-4 pr-2 font-mono text-[10px] text-ink-faint/55"
                    >
                      {t.topic}
                    </div>
                  ))}
                </div>
                <div className="relative flex-1 border-l border-ground-line">
                  <div className="flex h-full flex-col py-2">
                    {hh.rosbag.topics.map((t, i) => (
                      <div key={t.topic} className="relative flex flex-1 items-center px-3">
                        {tickPositions(i, t.texture).map((x, k) => (
                          <span
                            key={k}
                            className="absolute h-[5px] w-[2px] rounded-sm bg-ink-faint/20"
                            style={{ left: `${x}%` }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* trigger + failure markers — only after reconstruct (the "there it was" beat) */}
                  {revealed && (
                    <>
                      {hh.signals.map((s) => (
                        <span
                          key={s.id}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 w-px bg-teal/45"
                          style={{ left: `${frac(s.trigger) * 100}%` }}
                        />
                      ))}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 w-[2px] bg-amber shadow-[0_0_10px_rgba(255,180,84,0.7)]"
                        style={{ left: `${FAILURE_FRAC * 100}%` }}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -translate-x-full whitespace-nowrap rounded bg-amber/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber"
                        style={{ left: `calc(${FAILURE_FRAC * 100}% - 4px)`, top: "6px" }}
                      >
                        {hh.rosbag.failureLabel}
                      </span>
                    </>
                  )}

                  {/* the playhead */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-px bg-teal/70 shadow-[0_0_8px_rgba(22,199,154,0.55)]"
                    style={{ left: `${pct * 100}%` }}
                  />

                  {/* the scrub control — transparent strip over the rows (native = a11y for free) */}
                  <label htmlFor="hh-scrub" className="sr-only">
                    {hh.rosbag.scrubHint}
                  </label>
                  <input
                    id="hh-scrub"
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={scrub}
                    disabled={revealed}
                    aria-valuetext={`${Math.round(pct * 100)} percent through the recording`}
                    onPointerDown={onScrubStart}
                    onKeyDown={onScrubStart}
                    onChange={(e) => setScrub(Number(e.target.value))}
                    className="hh-scrub focus-ring absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent disabled:cursor-default"
                  />
                </div>
              </div>

              {/* bottom fade — the answer is lost in the haystack */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ground-raised to-transparent"
                aria-hidden="true"
              />
            </div>
            <figcaption className="border-t border-ground-line px-5 py-2.5 font-mono text-[10px] text-ink-faint/70">
              {hh.rosbag.caption}
            </figcaption>
          </figure>

          {/* ── RIGHT — Torsen: idle button -> curated reconstruction ── */}
          <figure className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised shadow-glow-teal">
            <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
              <span>
                <span className="eyebrow text-teal/80">{hh.reconstruction.label}</span>
                <span className="ml-2 font-mono text-[11px] text-ink-faint/70">
                  {hh.reconstruction.sublabel}
                </span>
              </span>
            </figcaption>

            <div className="relative min-h-72 p-5">
              {!revealed ? (
                <div className="flex h-72 flex-col items-center justify-center text-center">
                  <button
                    type="button"
                    onClick={onReconstruct}
                    className="focus-ring-amber rounded-lg bg-amber px-6 py-3 text-[15px] font-semibold text-ground shadow-glow transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_0_48px_-6px_rgba(255,180,84,0.6)] hover:brightness-105 active:translate-y-0"
                  >
                    {hh.reconstruction.button}
                  </button>
                  <p className="mt-4 max-w-xs text-[13px] text-ink-faint">
                    Freezes your clock, jumps to the failure window, surfaces the few signals that mattered.
                  </p>
                </div>
              ) : (
                <motion.div
                  ref={resultRef}
                  tabIndex={-1}
                  role="group"
                  aria-label="Torsen reconstruction result"
                  aria-describedby="hh-disclaimer"
                  className="focus-ring rounded outline-none"
                  variants={list}
                  initial="hidden"
                  animate="show"
                >
                  {/* The rendered-clip stage; the signals + why below stay the truth surface. */}
                  <ReconstructionVideo reduce={!!reduce} />

                  <motion.p variants={item} className="font-mono text-[11px] text-ink-faint">
                    {hh.reconstruction.caption}
                  </motion.p>

                  <ul className="mt-4 space-y-3.5">
                    {hh.signals.map((s) => (
                      <motion.li key={s.id} variants={item}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-[12px] text-teal">{s.label}</span>
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-dim">
                            {s.value}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] leading-snug text-ink-dim">{s.shows}</p>
                      </motion.li>
                    ))}
                  </ul>

                  {/* the grounded why — the signature amber device */}
                  <motion.p variants={item} className="mt-5 text-[15px] leading-relaxed text-ink">
                    <span className="why">Why</span>: {hh.why.line}
                  </motion.p>
                  <motion.p variants={item} className="mt-2 text-[12px] italic text-ink-faint">
                    {hh.why.groundedNote}
                  </motion.p>

                  {/* the stopwatch gap */}
                  <motion.div
                    variants={item}
                    className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-ground-line pt-4 font-mono text-[13px] tabular-nums"
                  >
                    <span className="text-ink-dim">
                      {hh.stopwatch.youName}:{" "}
                      <span className="text-ink">{fmt(clock.displayMs)}</span>{" "}
                      <span className="text-ink-faint">{hh.stopwatch.youSuffix}</span>
                    </span>
                    <span className="text-teal">
                      {hh.stopwatch.torsenName}: {hh.stopwatch.torsenValue}
                    </span>
                  </motion.div>

                  <motion.button
                    type="button"
                    variants={item}
                    onClick={onReset}
                    className="focus-ring mt-5 rounded text-[12px] font-medium text-ink-faint underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-ink-dim"
                  >
                    {hh.reconstruction.reset}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </figure>
        </div>

        {/* honesty: representative reconstruction + the stopwatch framing */}
        <p id="hh-disclaimer" className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-faint">
          {hh.disclaimer} {hh.stopwatch.caption}
        </p>
      </Container>
    </Section>
  );
}
