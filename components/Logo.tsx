/**
 * The Torsen identity — the NAME is the logo (no letter monogram).
 *
 * Wordmark: the "o" of Torsen is the grounded node (teal ring, amber core), and
 * the name is underscored by a path that runs teal, then breaks away in amber —
 * the first divergence. The rule is deliberately lighter than the node so the
 * two divergence cues support each other instead of competing.
 *
 * Everything is sized in `em`, so one component scales from the 15px nav to the
 * 30px intro just by setting font-size.
 *
 * LogoGlyph is the compact, abstract stand-in (node + breaking trace, no letter)
 * used where a wordmark can't survive — the favicon and app icons.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="sr-only">Torsen</span>

      {/* the name, with the "o" as the grounded node */}
      <span
        aria-hidden="true"
        className="inline-flex items-center font-display font-semibold leading-none tracking-[-0.02em] text-ink"
      >
        T
        <svg viewBox="0 0 30 30" fill="none" className="mx-[0.02em] h-[0.74em] w-[0.74em] translate-y-[0.03em]">
          <circle cx="15" cy="16" r="10.2" stroke="#16C79A" strokeWidth="3.4" />
          <circle cx="15" cy="16" r="3.7" fill="#FFB454" />
        </svg>
        rsen
      </span>

      {/* the divergence rule — nominal teal, then the amber break */}
      <span aria-hidden="true" className="mt-[0.17em] flex items-end">
        <span className="h-[0.06em] min-w-0 flex-1 rounded-full bg-teal/85" />
        <svg viewBox="0 0 26 15" fill="none" className="h-[0.24em] w-[0.44em] shrink-0">
          <path d="M1.5 13 L24 2.5" stroke="#FFB454" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}

/** Abstract compact mark (favicon / app icon) — the divergence, standalone. */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M4 23 H15" stroke="#16C79A" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M15 23 L28 8" stroke="#FFB454" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="15" cy="23" r="3.2" fill="#0B0E14" stroke="#E6EAF2" strokeWidth="1.7" />
    </svg>
  );
}
