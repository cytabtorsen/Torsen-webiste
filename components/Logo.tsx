/**
 * The Torsen mark — a "T" whose crossbar is a timeline; its right end breaks
 * upward in amber: the first divergence. Teal = nominal/grounded, amber = the
 * "why". Two fixed brand hues (not theme tokens); scales to favicon size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {/* the T — teal timeline (crossbar) + stem */}
      <path d="M5 10.5 H21.5" stroke="#16C79A" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M13.25 10.5 V26" stroke="#16C79A" strokeWidth="3.4" strokeLinecap="round" />
      {/* first divergence — the timeline breaks upward in amber */}
      <path d="M21.5 10.5 L27 5" stroke="#FFB454" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
