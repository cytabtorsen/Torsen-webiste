"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth-scrolling (subtle, not floaty). Disabled entirely under
 * prefers-reduced-motion — native scroll + CSS scroll-padding take over there.
 * In-page anchor clicks (nav, footer, CTA, skip link) are routed through
 * lenis.scrollTo so they ease too, with an 80px offset to clear the fixed nav.
 *
 * Lenis smooths the real window scroll, so framer's useScroll (hero parallax)
 * keeps working unchanged.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const el = target as HTMLElement;
      lenis.scrollTo(el, { offset: -80 });
      // preventDefault cancels the browser's native fragment-focus, so move focus
      // to the target ourselves — keeps the skip-link and nav links accessible
      // (WCAG 2.4.1). tabindex=-1 makes non-interactive targets programmatically
      // focusable without becoming a tab stop; preventScroll lets Lenis own the scroll.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
