"use client";

import { useEffect, useState } from "react";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Is this client a good fit for the WebGL reconstruction? Desktop width + WebGL,
 * decided AFTER mount — SSR / first paint return false (so the 2D fallback renders
 * and there is no hydration mismatch), then we upgrade to 3D if eligible. Keeping
 * this check in a three-free module means the heavy R3F chunk is only ever
 * referenced once this returns true. (Reduced-motion is gated separately by the
 * caller's existing `useReducedMotion`, to keep one source of truth.)
 */
export function useCanvasEligible(): boolean {
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const compute = () => setEligible(wide.matches && detectWebGL());
    compute();
    wide.addEventListener("change", compute);
    return () => wide.removeEventListener("change", compute);
  }, []);
  return eligible;
}
