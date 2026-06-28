"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/Section";
import { hero } from "@/lib/copy";

/**
 * HERO MEDIA SEAM.
 * The poster is the LCP; the looping video lazy-plays on top after load.
 * prefers-reduced-motion shows the poster only. The code-native visual below
 * is the interim backdrop AND stays available as the reduced-motion fallback.
 */
const HAS_HERO_MEDIA = true;
const HAS_HERO_VIDEO = true; // public/hero/hero-loop.{webm,mp4} (seamless boomerang loop)
const HERO_POSTER = "/hero/hero-poster.jpg";
const HERO_POSTER_WEBP = "/hero/hero-poster.webp";
const HERO_LOOP_MP4 = "/hero/hero-loop.mp4";
const HERO_LOOP_WEBM = "/hero/hero-loop.webm";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Defer the hero video until AFTER first load so it never competes with the
  // LCP (the poster stays the backdrop until then). Skip it on data-saver / 2G.
  const [playVideo, setPlayVideo] = useState(false);
  useEffect(() => {
    if (!HAS_HERO_VIDEO || reduce) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && conn.effectiveType.includes("2g"))) return;
    let t: ReturnType<typeof setTimeout>;
    const start = () => {
      t = setTimeout(() => setPlayVideo(true), 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", start);
    };
  }, [reduce]);

  // ── Interaction: cursor parallax + a cursor-tracked "probe light". ──
  const [probing, setProbing] = useState(false);
  const mx = useMotionValue(0); // normalized -0.5..0.5
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // Raw cursor position in px (for the probe light), spring-smoothed.
  const lx = useMotionValue(-9999);
  const ly = useMotionValue(-9999);
  const probeX = useSpring(lx, { stiffness: 220, damping: 28, mass: 0.4 });
  const probeY = useSpring(ly, { stiffness: 220, damping: 28, mass: 0.4 });

  // Parallax: media drifts one way, the code-native trace/foreground the other.
  const mediaX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const mediaY = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const glowX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const glowY = useTransform(sy, [-0.5, 0.5], [18, -18]);
  const traceX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const traceY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  // Scroll parallax: the scene sinks + zooms slightly as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
    if (!probing) setProbing(true);
  }

  const interactive = HAS_HERO_MEDIA && !reduce;

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setProbing(false)}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* ── Backdrop layer (video seam OR code-native visual) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {HAS_HERO_MEDIA ? (
          <>
            {/* Parallax media: scroll layer (y + scale) wraps the cursor layer (x/y drift). */}
            <motion.div
              style={interactive ? { y: scrollY, scale: scrollScale } : undefined}
              className="absolute inset-0"
            >
              <motion.div
                style={interactive ? { x: mediaX, y: mediaY, scale: 1.08 } : undefined}
                className="absolute inset-0"
              >
                <picture>
                  <source srcSet={HERO_POSTER_WEBP} type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={HERO_POSTER}
                    alt=""
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
                  />
                </picture>
                {HAS_HERO_VIDEO && !reduce && playVideo && (
                  <video
                    className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
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
              </motion.div>
            </motion.div>

            {/* Cursor "probe light": brightens the scene where you point — as if
                you're shining an investigative light to reconstruct the moment.
                Sits BELOW the readability scrim so the headline stays legible. */}
            {interactive && (
              <motion.div
                style={{ x: probeX, y: probeY }}
                // Center the 560px glow on the cursor: framer's inline transform
                // would otherwise drop Tailwind's -translate-1/2 centering, leaving
                // the light ~280px off the pointer.
                transformTemplate={({ x, y }) => `translate(-50%, -50%) translate(${x}, ${y})`}
                className="absolute left-0 top-0 h-[560px] w-[560px] rounded-full mix-blend-plus-lighter transition-opacity duration-500"
                animate={{ opacity: probing ? 1 : 0 }}
              >
                <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,180,84,0.20)_0%,rgba(22,199,154,0.10)_38%,transparent_68%)] blur-[6px]" />
              </motion.div>
            )}

            {/* readability scrim: dark on the left for the headline, clearing to the
                right so the humanoid + reconstruction trace stay visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ground to-transparent" />
          </>
        ) : (
          <CodeNativeBackdrop glowX={glowX} glowY={glowY} traceX={traceX} traceY={traceY} reduce={!!reduce} />
        )}
      </div>

      {/* ── Foreground content ── */}
      <Container className="relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
          >
            <span className="why animate-why-glow">{hero.h1.whyWord}</span> {hero.h1.rest}
          </motion.h1>

          <motion.p
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-9"
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href="#early-access"
                className="focus-ring-amber inline-flex h-12 items-center justify-center rounded-lg bg-amber px-6 text-[15px] font-semibold text-ground shadow-glow transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_0_48px_-6px_rgba(255,180,84,0.6)] hover:brightness-105 active:translate-y-0"
              >
                {hero.cta}
              </a>
              <a
                href="#keep-posted"
                className="focus-ring inline-flex items-center rounded text-[14px] text-ink-dim underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-ink"
              >
                {hero.secondary}
              </a>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* quiet scroll cue — the page invites you down */}
      {interactive && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="h-9 w-[22px] rounded-full border border-ink-faint/50"
            initial={false}
          >
            <motion.span
              className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-amber/80"
              animate={{ y: [0, 9, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
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
