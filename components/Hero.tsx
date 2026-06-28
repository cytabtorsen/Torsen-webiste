"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { hero } from "@/lib/copy";

/**
 * HERO MEDIA SEAM.
 * When your GPT Image 2 still + animated video are ready, drop them in
 * public/hero/ as hero-poster.jpg + hero-loop.mp4 (+ optional hero-loop.webm)
 * and flip HAS_HERO_MEDIA to true. The poster is the LCP; the video lazy-plays
 * on top; prefers-reduced-motion shows the poster only. The code-native visual
 * below is the interim backdrop AND stays available as the reduced-motion case.
 */
const HAS_HERO_MEDIA = false;
const HERO_POSTER = "/hero/hero-poster.jpg";
const HERO_LOOP_MP4 = "/hero/hero-loop.mp4";
const HERO_LOOP_WEBM = "/hero/hero-loop.webm";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Subtle cursor parallax — the "one signature hero motion".
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  const glowX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const glowY = useTransform(sy, [-0.5, 0.5], [18, -18]);
  const traceX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const traceY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* ── Backdrop layer (video seam OR code-native visual) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {HAS_HERO_MEDIA ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {!reduce && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster={HERO_POSTER}
              >
                <source src={HERO_LOOP_WEBM} type="video/webm" />
                <source src={HERO_LOOP_MP4} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/70 to-ground/30" />
          </>
        ) : (
          <CodeNativeBackdrop glowX={glowX} glowY={glowY} traceX={traceX} traceY={traceY} reduce={!!reduce} />
        )}
      </div>

      {/* ── Foreground content ── */}
      <Container className="relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="mt-5 text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="why animate-why-glow">{hero.h1.whyWord}</span> {hero.h1.rest}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-9"
          >
            <WaitlistForm variant="hero" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function CodeNativeBackdrop({
  glowX,
  glowY,
  traceX,
  traceY,
  reduce,
}: {
  glowX: ReturnType<typeof useTransform<number, number>>;
  glowY: ReturnType<typeof useTransform<number, number>>;
  traceX: ReturnType<typeof useTransform<number, number>>;
  traceY: ReturnType<typeof useTransform<number, number>>;
  reduce: boolean;
}) {
  return (
    <>
      <div className="absolute inset-0 grid-bg opacity-70" />

      {/* amber "why" glow, parallaxed */}
      <motion.div
        style={reduce ? undefined : { x: glowX, y: glowY }}
        className="absolute right-[6%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-amber/15 blur-[120px]"
      />
      <div className="absolute right-[18%] top-1/2 h-[20rem] w-[20rem] -translate-y-1/2 rounded-full bg-teal/10 blur-[110px]" />

      {/* reconstructed motion-path trace */}
      <motion.svg
        style={reduce ? undefined : { x: traceX, y: traceY }}
        className="absolute right-0 top-0 h-full w-[62%] min-w-[420px]"
        viewBox="0 0 600 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* faint "log haystack" ticks dissolving into the reconstructed path */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1={70}
            x2={150 + (i % 3) * 18}
            y1={150 + i * 42}
            y2={150 + i * 42}
            stroke="#1B2230"
            strokeWidth={2}
          />
        ))}

        {/* the grounded reconstructed trajectory (amber, draws in) */}
        <path
          d="M120 470 C 220 430, 250 300, 330 280 S 470 250, 520 120"
          stroke="#FFB454"
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          className={reduce ? "" : "animate-trace-draw"}
          style={reduce ? undefined : ({ "--trace-len": 1 } as React.CSSProperties)}
        />
        <path
          d="M120 470 C 220 430, 250 300, 330 280 S 470 250, 520 120"
          stroke="#FFB454"
          strokeOpacity={0.18}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
        />

        {/* teal grounded nodes pulsing along the path */}
        {[
          [120, 470],
          [330, 280],
          [520, 120],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={5} fill="#16C79A" className={reduce ? "" : "animate-pulse-node"} style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={cx} cy={cy} r={11} fill="none" stroke="#16C79A" strokeOpacity={0.25} strokeWidth={1.5} />
          </g>
        ))}
      </motion.svg>

      {/* left-edge readability wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/60 to-transparent" />
      {/* bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ground to-transparent" />
    </>
  );
}
