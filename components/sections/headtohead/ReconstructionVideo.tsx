"use client";

import { useState } from "react";
import { headToHead as hh } from "@/lib/copy";

/**
 * THE RECONSTRUCTION STAGE — a rendered clip (replaces the Phase-3a live WebGL
 * scene; brief §5a + the 2026-06 pivot to a generated video).
 *
 * HONESTY — the clip is a RENDER and is labelled as one on every frame: the
 * in-frame chip + the caption own it ("rendered — not real footage"), and the
 * truth surface stays the curated signals + grounded why BELOW the stage. Never
 * "generated / AI / <vendor>" in public copy — "rendered" is accurate and
 * doesn't collide with the grounded-not-generated positioning.
 *
 * Mounts only after the visitor reconstructs (client state), so it never SSRs
 * and never touches LCP. No heavy deps — a native <video>, muted looped inline.
 * Fallbacks: reduced-motion / data-saver / playback-error (including the mp4
 * not having been dropped in yet) → the static poster frame, same framing.
 */
// Build-time truth about whether the clip has been dropped in (next.config.mjs
// checks the file). While false, the stage is poster-only — no <video>, no 404.
const HAS_CLIP = process.env.NEXT_PUBLIC_HH_VIDEO === "true";

export function ReconstructionVideo({ reduce }: { reduce: boolean }) {
  const [failed, setFailed] = useState(false);
  // Never rendered during SSR (mounts post-reveal), so navigator is available;
  // read synchronously so a data-saver client never starts the fetch.
  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const still = !HAS_CLIP || reduce || saveData || failed;

  return (
    <figure className="mb-5">
      <div
        role="img"
        aria-label={hh.reconstruction.videoAlt}
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-ground-line bg-ground"
      >
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/headtohead/reconstruction-poster.png"
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            src="/headtohead/reconstruction.mp4"
            poster="/headtohead/reconstruction-poster.png"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
            onError={() => setFailed(true)}
          />
        )}
        {/* the honesty chip — pinned in-frame in every state */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2.5 top-2.5 rounded bg-ground/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-teal/90"
        >
          {hh.reconstruction.videoChip}
        </span>
      </div>
      <figcaption className="mt-2 text-[12px] leading-relaxed text-ink-dim">
        {hh.reconstruction.videoCaption}
      </figcaption>
    </figure>
  );
}
