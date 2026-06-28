import type { ReactNode } from "react";
import { Section, Container } from "@/components/Section";
import { whatItDoes } from "@/lib/copy";

/**
 * WHAT TORSEN DOES — 3-card feature block.
 *
 * Server component: no hooks, no framer-motion. The scroll-reveal comes from
 * <Section>; card hover is pure CSS (border toward teal + slight lift).
 *
 * Each card opens with a minimal inline-SVG line glyph (teal stroke) that echoes
 * the hero's visual language — a reconstructed motion-path trace, a teal grounded
 * node on a baseline, and a detached witness mark. The "independent" card carries
 * a faint amber accent: it is the load-bearing differentiator (witness, not actor).
 */

// One glyph per card id. ~30px, 1.5–2px stroke, rounded caps. Decorative only.
const glyphs: Record<string, ReactNode> = {
  // reconstruct — a drawn motion-path / trajectory trace rising from log ticks
  reconstruct: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 24 C 9 22, 10 13, 15 12 S 22 9, 26 5" />
      <path d="M4 24 h3" strokeOpacity="0.35" />
      <path d="M4 19.5 h2" strokeOpacity="0.35" />
      <path d="M4 15 h2.5" strokeOpacity="0.35" />
      <circle cx="4" cy="24" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="26" cy="5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  // ground — a node anchored to a baseline (camera + signal)
  ground: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="25" x2="27" y2="25" />
      <line x1="6" y1="25" x2="6" y2="22.5" strokeOpacity="0.45" />
      <line x1="15" y1="25" x2="15" y2="22" strokeOpacity="0.45" />
      <line x1="24" y1="25" x2="24" y2="22.5" strokeOpacity="0.45" />
      <path d="M15 25 V 14" />
      <circle cx="15" cy="11" r="3.5" />
      <path d="M11 8 a 7 7 0 0 1 8 0" strokeOpacity="0.55" />
    </svg>
  ),
  // independent — a detached, sealed witness record (eye over a separated block)
  independent: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12 C 7 7, 14 7, 18 12 C 14 17, 7 17, 3 12 Z" />
      <circle cx="10.5" cy="12" r="2" />
      <rect x="18" y="18.5" width="9" height="7.5" rx="1.5" strokeOpacity="0.85" />
      <path d="M20 18.5 v-2 a 2.5 2.5 0 0 1 5 0 v2" strokeOpacity="0.85" />
    </svg>
  ),
};

export function WhatItDoes() {
  return (
    <Section id="what" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">{whatItDoes.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {whatItDoes.heading}
        </h2>

        <ul className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-3">
          {whatItDoes.cards.map((card) => {
            const isWitness = card.id === "independent";
            return (
              <li
                key={card.id}
                className={[
                  "group relative overflow-hidden rounded-xl border bg-ground-raised p-6 sm:p-7",
                  "transition duration-300 ease-out hover:-translate-y-1",
                  isWitness
                    ? "border-amber/25 hover:border-amber/50 hover:shadow-glow"
                    : "border-ground-line hover:border-teal/50 hover:shadow-glow-teal",
                ].join(" ")}
              >
                {/* hover sheen — a faint accent wash that fades in from the glyph corner */}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                    isWitness ? "bg-amber/15" : "bg-teal/12",
                  ].join(" ")}
                />
                <span
                  className={[
                    "relative inline-flex transition-transform duration-300 ease-out group-hover:scale-110",
                    isWitness
                      ? "text-amber/90 group-hover:text-amber"
                      : "text-teal/90 group-hover:text-teal",
                  ].join(" ")}
                >
                  {glyphs[card.id]}
                </span>

                <h3 className="mt-5 text-balance text-lg font-medium leading-snug text-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{card.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
