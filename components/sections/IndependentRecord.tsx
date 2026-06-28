import { Section, Container } from "@/components/Section";
import { independentRecord as rec } from "@/lib/copy";

/**
 * THE INDEPENDENT RECORD — act two (brief §4 item 5 · Phase 4b).
 *
 * The page's broaden-to-any-fleet pivot. Deliberately NOT another card grid or
 * step row — an editorial split: left = statement + a quiet hairline ledger of
 * beats; right = a section-sized centerpiece that stages independence literally —
 * a sealed witness record (amber, eye-marked, slowly lifting) held APART from a
 * dimmed, grounded machine (teal), the tether between them visibly severed. It
 * scales the WhatItDoes "independent" eye-over-sealed-block glyph into the
 * section's whole argument.
 *
 * Server component: the only motion is two pure-CSS keyframes (float-lift on the
 * record, why-glow on its seal), both neutralised by the global reduced-motion
 * rule in globals.css — so no client boundary. The static state still carries the
 * meaning: the record sits detached above a fixed machine, the wire plainly cut.
 *
 * Accent grammar matches the rest of the page: amber = the load-bearing
 * independence "moat" (beats[0]); teal = grounded. Tokens only; SVG only (CLS-safe).
 */
export function IndependentRecord() {
  // Signature amber "why" — only if the statement contains it (cf. Mission).
  const parts = rec.statement.split("why");
  const statement =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <span className="why">why</span>
        {parts.slice(1).join("why")}
      </>
    ) : (
      rec.statement
    );

  return (
    <Section
      id="record"
      className="relative overflow-hidden border-t border-ground-line py-28 sm:py-40"
    >
      {/* faint ambient amber field behind the centerpiece (existing fade idiom) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-amber/[0.05] blur-[140px] lg:block"
      />

      <Container className="relative">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* ── LEFT — the statement + the ledger of beats ── */}
          <div className="lg:col-span-6">
            <p className="eyebrow">{rec.eyebrow}</p>
            <h2 className="mt-6 max-w-xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
              {rec.heading}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">{statement}</p>

            {/* the beats — a quiet hairline ledger, not cards */}
            <ul className="mt-12 max-w-xl divide-y divide-ground-line border-t border-ground-line">
              {rec.beats.map((beat, i) => {
                const isMoat = i === 0;
                return (
                  <li key={beat.id} className="flex gap-5 py-5">
                    <span
                      aria-hidden="true"
                      className={[
                        "mt-1 shrink-0 font-mono text-[11px] tabular-nums",
                        isMoat ? "text-amber/80" : "text-teal/70",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[15px] font-medium leading-snug text-ink">{beat.title}</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{beat.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── RIGHT — the centerpiece: the record, lifted out ── */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[27rem]">
              <RecordCenterpiece />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The record held apart from the machine. Decorative; all meaning is in the copy.
 * amber = the lifted, sealed witness record; teal = the dimmed, grounded machine.
 * The single tether is visibly severed across the central gap.
 */
function RecordCenterpiece() {
  return (
    <svg
      viewBox="0 0 320 360"
      className="h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* the machine that acted — abstract (grounded torso + sensor head node) */}
      <g className="text-teal/50">
        <line x1="56" y1="312" x2="264" y2="312" strokeOpacity="0.4" />
        <line x1="96" y1="312" x2="96" y2="306" strokeOpacity="0.3" />
        <line x1="160" y1="312" x2="160" y2="305" strokeOpacity="0.3" />
        <line x1="224" y1="312" x2="224" y2="306" strokeOpacity="0.3" />
        <rect x="132" y="258" width="56" height="54" rx="8" strokeOpacity="0.55" />
        <line x1="160" y1="258" x2="160" y2="242" strokeOpacity="0.55" />
        <circle cx="160" cy="232" r="10" strokeOpacity="0.55" />
        <path d="M150 226 a 14 14 0 0 1 20 0" strokeOpacity="0.4" />
      </g>

      {/* the severed tether — amber stub from the record · gap · teal stub at the machine */}
      <g>
        <path className="text-amber/70" d="M160 168 V 192" />
        <circle className="text-amber/80" cx="160" cy="192" r="3" fill="currentColor" stroke="none" />
        <path className="text-teal/45" d="M160 222 V 212" strokeDasharray="2 6" />
        <circle className="text-teal/50" cx="160" cy="212" r="3" fill="currentColor" stroke="none" />
      </g>

      {/* the lifted, sealed witness record — the hero (slow float) */}
      <g className="animate-float-lift text-amber">
        <rect x="80" y="58" width="160" height="110" rx="12" />
        {/* tamper seal — a padlock shackle over the top edge */}
        <path d="M148 58 v-10 a 12 12 0 0 1 24 0 v10" strokeOpacity="0.85" />
        {/* the witness eye on the card face (echoes the independent glyph) */}
        <path d="M120 104 C 134 90, 158 90, 172 104 C 158 118, 134 118, 120 104 Z" />
        <circle cx="140" cy="104" r="6" />
        {/* faint recorded ledger lines */}
        <line x1="102" y1="138" x2="182" y2="138" strokeOpacity="0.3" />
        <line x1="102" y1="150" x2="162" y2="150" strokeOpacity="0.3" />
        {/* the one glowing seal dot */}
        <circle className="animate-why-glow" cx="220" cy="146" r="4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
