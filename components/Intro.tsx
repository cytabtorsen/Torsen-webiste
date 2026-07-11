"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hero, site } from "@/lib/copy";
import { LogoMark } from "@/components/Logo";

/**
 * Branded entrance. On the first load of a browser session, the amber
 * reconstruction arc draws itself into the teal grounded node beneath the
 * wordmark, holds a beat, then wipes up to reveal the hero — the literal
 * "we reconstruct the moment" thesis as the opening ritual.
 *
 * - Once per session (sessionStorage), never on repeat navigations.
 * - Skippable: click / scroll / touch / Escape dismisses immediately.
 * - prefers-reduced-motion: skipped entirely (no overlay, no scroll lock).
 * - Decorative: aria-hidden; content underneath is the real page for SRs.
 */
const SEEN_KEY = "torsen-intro-seen";
const ARC_D = "M22 74 C 110 64, 150 30, 214 26 S 286 20, 300 16";

export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduce) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private mode / storage blocked — just play it this once.
    }
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setLeaving(true), 1350);
    return () => {
      clearTimeout(t);
      // Symmetric restore: guarantees scroll is never left locked if the
      // component unmounts before the exit animation's onExitComplete fires.
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  const dismiss = useCallback(() => setLeaving(true), []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
      {!leaving && (
        <motion.div
          aria-hidden="true"
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ground"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* soft amber breath behind the mark */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.06] blur-[120px]" />

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LogoMark className="h-[30px] w-[30px]" />
            <span className="font-display text-3xl font-semibold tracking-tight text-ink">{site.name}</span>
          </motion.div>

          {/* the arc reconstructs itself into the grounded node */}
          <svg width="320" height="90" viewBox="0 0 320 90" fill="none" className="mt-6">
            <path d={ARC_D} stroke="#FFB454" strokeOpacity={0.16} strokeWidth={7} strokeLinecap="round" fill="none" />
            <motion.path
              d={ARC_D}
              stroke="#FFB454"
              strokeWidth={2.25}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            />
            <circle cx={22} cy={74} r={3} fill="#FFB454" fillOpacity={0.55} />
            <motion.g
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4, ease: "backOut" }}
              style={{ transformOrigin: "300px 16px" }}
            >
              <circle cx={300} cy={16} r={5} fill="#16C79A" />
              <circle cx={300} cy={16} r={11} fill="none" stroke="#16C79A" strokeOpacity={0.3} strokeWidth={1.5} />
            </motion.g>
          </svg>

          <motion.p
            className="eyebrow mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            {hero.eyebrow}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
