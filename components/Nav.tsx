"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site } from "@/lib/copy";
import { Wordmark } from "@/components/Logo";

/** Sticky, translucent nav. Hairline border + blur intensify after scroll.
 *  Mobile (<md) collapses the links into an accessible toggle menu. */
export function Nav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape; move focus into the menu when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // Return focus to the toggle synchronously — doing it here (not in a
        // close effect) beats AnimatePresence's exit timing. WCAG 2.4.3.
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-ground-line bg-ground/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-6 sm:px-8"
      >
        <a href="#top" className="focus-ring flex items-center" aria-label={`${site.name} home`}>
          <Wordmark className="text-[19px]" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring text-[14px] text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#early-access"
            className="focus-ring-amber hidden rounded-lg border border-ground-line bg-ground-raised px-4 py-2 text-[14px] font-medium text-ink transition-[border-color,color,transform,box-shadow] hover:-translate-y-px hover:border-amber/60 hover:text-amber hover:shadow-glow active:translate-y-0 md:inline-flex"
          >
            {nav.cta}
          </a>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? nav.menuClose : nav.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="focus-ring -mr-1.5 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:text-amber md:hidden"
          >
            <Burger open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-t border-ground-line bg-ground/95 backdrop-blur-md md:hidden"
          >
            <div className="mx-auto flex max-w-content flex-col gap-1 px-6 py-4">
              {nav.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-lg px-2 py-3 text-[16px] text-ink-dim transition-colors hover:bg-ground-raised hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#early-access"
                onClick={() => setOpen(false)}
                className="focus-ring-amber mt-2 rounded-lg bg-amber px-4 py-3 text-center text-[15px] font-semibold text-ground shadow-glow"
              >
                {nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Hamburger that morphs to an X. Decorative; the button carries the label. */
function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <span
        className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5"
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-[1.5px] w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0.5"
        }`}
      />
    </span>
  );
}
