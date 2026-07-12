/**
 * The Torsen identity — the NAME is the logo.
 *
 * The wordmark (public/logo-wordmark.png) was generated with Ideogram v3
 * (Design mode) and then cleaned: recoloured to the exact brand hex, background
 * knocked out with the anti-aliasing preserved, and tight-cropped. Bold angled
 * letterforms, underscored by a teal bar that breaks into an amber slab — the
 * first divergence.
 *
 * Sized by HEIGHT (the art has a fixed 705x199 aspect), so callers pass an
 * `h-*` class. The app icon uses the companion mark (teal ring, amber core with
 * a line leaving it) — a wordmark can't survive 16px.
 */
export function Wordmark({ className = "h-7" }: { className?: string }) {
  return (
    <>
      <span className="sr-only">Torsen</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-wordmark.png"
        alt=""
        aria-hidden="true"
        width={705}
        height={199}
        decoding="async"
        className={`w-auto ${className}`}
      />
    </>
  );
}
