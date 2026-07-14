import { memo, useEffect, useRef } from "react";
import { caseDemo as cd } from "@/lib/copy";
import {
  caseRecord as rec,
  fmtRel,
  valueAt,
  outOfBand,
  type CaseSignal,
  type CaseEventKind,
  type CaseFocus,
} from "@/lib/case-record";

/**
 * THE REPLAY VIEW — viewport · transport · time axis · four signal lanes, one
 * shared playhead. The lanes are small multiples: each owns its y-scale,
 * identity is carried by lane position + label (teal traces; amber only for
 * the lane the diagnosis leans on — the site's failure hue). The scale gutter
 * carries a live readout of each lane's value at the playhead.
 *
 * The viewport is poster-first: the rendered incident clip is generated
 * offline and dropped into public/case/ (build flag NEXT_PUBLIC_CASE_VIDEO —
 * same idiom as the head-to-head clip). Once it lands, the clip covers ONLY
 * the record's incident window around first divergence, scrub-synced; the
 * poster holds every other instant. The playhead line hides while it sits
 * exactly on the divergence marker — that instant belongs to the amber.
 */

const HAS_CLIP = process.env.NEXT_PUBLIC_CASE_VIDEO === "true";
const [W0, W1] = rec.timeline.clip.windowSeconds;

const [T0, T1] = rec.timeline.spanSeconds;
const SPAN = T1 - T0;
const fracOf = (t: number) => (t - T0) / SPAN;
const DIV_FRAC = fracOf(rec.timeline.divergenceAt);

// Axis ticks every 10 s across the span; 0 renders as the bag-relative 00:00.
const TICKS = Array.from({ length: SPAN / 10 + 1 }, (_, k) => T0 + k * 10);
const tickLabel = (t: number) => (t === 0 ? "00:00" : `${t > 0 ? "+" : "−"}${Math.abs(t)}s`);

// "HH:MM:SS.mmm" → ms since midnight (only offsets from it are displayed).
function clockToMs(s: string): number {
  const [h, m, rest] = s.split(":");
  const [sec, ms = "0"] = rest.split(".");
  return ((Number(h) * 60 + Number(m)) * 60 + Number(sec)) * 1000 + Number(ms.padEnd(3, "0"));
}
const BAG_DIV_MS = clockToMs(rec.timeline.bagClockAtDivergence);

// Playhead position on the bag clock, centisecond precision — the viewport chip.
function fmtBag(t: number): string {
  const ms = Math.max(0, BAG_DIV_MS + t * 1000);
  const total = Math.floor(ms / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(total / 3600))}:${p(Math.floor((total % 3600) / 60))}:${p(total % 60)}.${p(
    Math.floor((ms % 1000) / 10),
  )}`;
}

const EVENT_DOT: Record<CaseEventKind, string> = {
  info: "bg-ink-faint/40",
  warn: "bg-ink-faint",
  divergence: "bg-amber",
  failure: "bg-amber",
};

// Memoized: the trace never changes; the playhead re-renders 60×/s around it.
//
// Each lane draws, back to front: the KNOWN-GOOD BAND (the envelope of the 14
// comparable runs), the run's trace, and then — in amber — only the stretches
// where the trace is OUTSIDE the band. The colour change is not decoration: it
// is the measurement. The first amber pixel on the steering lane is t = 0, and
// t = 0 is first divergence by definition, not by annotation.
//
// AMBER MEANS EXACTLY ONE THING HERE: outside the known-good envelope. Nothing
// else may claim it. An earlier version painted the whole laser lane amber
// (it is the lane the diagnosis leans on) — which read as "this lane diverged"
// when the lane has no envelope to diverge from, and quietly cost the chart its
// only rule. Perception lanes are teal like everything else; their weight comes
// from the diagnosis panel and the events, not from the colour.
const Lane = memo(function Lane({ signal }: { signal: CaseSignal }) {
  const { values } = signal.series;
  const [lo, hi] = signal.scale;
  const y = (v: number) => 100 - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * 100;
  /** Points for values[a..b] inclusive, keeping each sample's true x index. */
  const pts = (vals: readonly number[], a = 0, b = vals.length - 1) => {
    const out: string[] = [];
    for (let i = a; i <= b; i++) out.push(`${i},${y(vals[i]).toFixed(2)}`);
    return out.join(" ");
  };

  const n = signal.nominal;
  // Closed polygon: the lo edge forward, the hi edge back.
  let bandPts: string | null = null;
  if (n) {
    const back: string[] = [];
    for (let i = n.hi.length - 1; i >= 0; i--) back.push(`${i},${y(n.hi[i]).toFixed(2)}`);
    bandPts = `${pts(n.lo)} ${back.join(" ")}`;
  }

  // Contiguous runs of out-of-band samples, each extended by one sample at both
  // ends so the amber joins the teal trace instead of floating off it.
  const breaches: string[] = [];
  if (n) {
    let start: number | null = null;
    for (let i = 0; i <= values.length; i++) {
      const out = i < values.length && (values[i] < n.lo[i] || values[i] > n.hi[i]);
      if (out && start === null) start = i;
      if (!out && start !== null) {
        breaches.push(pts(values, Math.max(0, start - 1), Math.min(values.length - 1, i)));
        start = null;
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${values.length - 1} 100`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {bandPts && (
        <polygon
          points={bandPts}
          className="fill-ink-faint/20 stroke-ink-faint/40"
          vectorEffect="non-scaling-stroke"
          strokeWidth={0.75}
        />
      )}
      {/* 1.5 rather than 1.75: on the narrow bands the trace and its antialiasing
          ate most of the channel, which is why the envelope read as a fuzzy line. */}
      <polyline
        points={pts(values)}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth={1.5}
        className="stroke-teal/80"
      />
      {breaches.map((b) => (
        <polyline
          key={b.slice(0, 24)}
          points={b}
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="stroke-amber"
        />
      ))}
    </svg>
  );
});

export function ReplayView({
  t,
  playing,
  focus,
  onScrub,
  onToggle,
  onReplay,
}: {
  t: number;
  playing: boolean;
  /** The amber projection a query/moment lights on its grounding lane. */
  focus: CaseFocus | null;
  onScrub: (t: number) => void;
  onToggle: () => void;
  onReplay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inWindow = HAS_CLIP && t >= W0 && t <= W1;
  const atDivergence = Math.abs(t - rec.timeline.divergenceAt) < 0.05;

  // Keep the clip glued to the scrubber inside its window: seek when scrubbed,
  // play when playing, poster everywhere else (the `hidden` toggle below).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const target = Math.min(Math.max(t - W0, 0), W1 - W0);
    if (playing && inWindow) {
      if (Math.abs(v.currentTime - target) > 0.35) v.currentTime = target;
      if (v.paused) v.play().catch(() => {});
    } else {
      if (!v.paused) v.pause();
      if (Math.abs(v.currentTime - target) > 0.05) v.currentTime = target;
    }
  }, [t, playing, inWindow]);

  return (
    // The chart holds its minimum; when the shell is shorter than the content
    // (short laptop, answer card open, phone), this column scrolls rather than
    // letting the lanes collapse or paint over the legend.
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-y-auto">
      {/* ── The viewport — the rendered incident stage ── */}
      <figure
        role="img"
        aria-label={rec.case.title}
        className="relative shrink-0 overflow-hidden rounded-xl border border-ground-line bg-ground-raised"
      >
        <div className="relative h-36 sm:h-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rec.timeline.clip.poster} alt="" className="h-full w-full object-cover" />
          {HAS_CLIP && (
            <video
              ref={videoRef}
              src={rec.timeline.clip.src}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              // Cold-load insurance: the effect above seeks on mount, but a set
              // before the media is seekable is dropped — so re-apply the seek
              // the moment data arrives, or the divergence frame flashes the
              // pre-incident approach instead of the halt.
              onLoadedData={() => {
                const v = videoRef.current;
                if (!v || playing) return;
                const target = Math.min(Math.max(t - W0, 0), W1 - W0);
                if (Math.abs(v.currentTime - target) > 0.05) v.currentTime = target;
              }}
              className={`absolute inset-0 h-full w-full object-cover ${inWindow ? "" : "hidden"}`}
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ground/80 to-transparent"
          />
          <div className="absolute left-2.5 top-2.5 flex gap-1.5">
            <span className="rounded bg-ground/85 px-2 py-1 font-mono text-[11px] tabular-nums text-ink">
              {fmtBag(t)} <span className="text-ink-faint">/ {rec.timeline.bagDuration}</span>
            </span>
            <span className="rounded bg-ground/85 px-2 py-1 font-mono text-[11px] text-ink-dim">
              {cd.viewport.speed}
            </span>
          </div>
          {/* the honesty chip — in-frame in every viewport state */}
          <span className="pointer-events-none absolute right-2.5 top-2.5 rounded bg-ground/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-teal/90">
            {cd.viewport.chipRender}
          </span>
        </div>
      </figure>

      {/* ── Time axis + signal lanes, one shared playhead ──
          Every column stacks a fixed axis spacer + four flex-1 basis-0 cells,
          so the lanes stretch to fill the frame and the gutters stay aligned.

          The lane cells keep a 56px floor (min-h-14) and the stack keeps a hard
          minimum, so the chart can never be squeezed out of existence — on a
          1280×720 laptop with the answer card open, or on a phone, flex would
          otherwise happily collapse all four lanes to zero and leave the legend
          describing a band that isn't there. When the column genuinely runs out
          of room the ROOT scrolls (see the wrapper) instead of the lanes
          overprinting whatever sits below them. */}
      <div className="flex min-h-[272px] flex-1">
        {/* label gutter — the axis spacer carries the transport */}
        <div className="hidden w-40 shrink-0 flex-col sm:flex">
          <div className="flex h-12 shrink-0 items-center gap-1.5 pr-3">
            <button
              type="button"
              onClick={onToggle}
              aria-label={playing ? cd.transport.pause : cd.transport.play}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-ground-line bg-ground-raised text-ink transition-colors hover:border-teal/40 hover:text-teal"
            >
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="4" x2="6" y2="12" />
                  <line x1="10" y1="4" x2="10" y2="12" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                  <polygon points="5.5 3.5 13 8 5.5 12.5" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={onReplay}
              aria-label={cd.transport.replay}
              title={cd.transport.replay}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-ground-line bg-ground-raised text-ink-dim transition-colors hover:border-amber/40 hover:text-amber"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="3.5" x2="4" y2="12.5" />
                <polygon points="12.5 4 6.8 8 12.5 12" fill="currentColor" stroke="none" />
              </svg>
            </button>
          </div>
          {rec.signals.map((s) => (
            <div key={s.id} className="flex min-h-14 flex-1 basis-0 items-center pr-3">
              <span className="font-mono text-[11px] leading-tight text-teal/90">
                {s.label} <span className="text-ink-faint">({s.unit})</span>
                {/* no envelope to leave — say so on the lane, not just in the legend */}
                {!s.nominal && (
                  <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                    {cd.baseline.evidenceLane}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* chart column — axis, lanes, markers, and the scrub control */}
        <div className="relative flex min-w-0 flex-1 flex-col" data-lenis-prevent>
          <div className="relative h-12 shrink-0">
            {/* the first-divergence flag */}
            <span
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-amber/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber"
              style={{ left: `${DIV_FRAC * 100}%` }}
            >
              {cd.scrubber.divergenceLabel}
            </span>
            {/* the track, its event dots, and the tick labels */}
            <div aria-hidden="true" className="absolute inset-x-0 top-[30px] h-px bg-ground-line" />
            {rec.events.map((e) => (
              <span
                key={`${e.t}-${e.label}`}
                aria-hidden="true"
                title={e.label}
                className={`absolute top-[28.5px] h-1 w-1 -translate-x-1/2 rounded-full ${EVENT_DOT[e.kind]}`}
                style={{ left: `${fracOf(e.t) * 100}%` }}
              />
            ))}
            {TICKS.map((tick) => (
              <span
                key={tick}
                aria-hidden="true"
                className="absolute bottom-0 z-10 -translate-x-1/2 rounded-sm bg-ground px-0.5 font-mono text-[9px] tabular-nums text-ink-faint"
                style={{ left: `${fracOf(tick) * 100}%` }}
              >
                {tickLabel(tick)}
              </span>
            ))}
          </div>

          {rec.signals.map((s) => (
            <div key={s.id} className="relative min-h-14 flex-1 basis-0 border-t border-ground-line/70">
              <Lane signal={s} />
              {focus?.signalId === s.id && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 border-x border-amber/30 bg-amber/[0.07]"
                  style={{
                    left: `${fracOf(Math.max(T0, focus.window[0])) * 100}%`,
                    width: `${((Math.min(T1, focus.window[1]) - Math.max(T0, focus.window[0])) / SPAN) * 100}%`,
                  }}
                />
              )}
            </div>
          ))}

          {/* first divergence — the amber vertical through axis and lanes */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 top-6 w-[2px] -translate-x-1/2 bg-amber/90 shadow-[0_0_10px_rgba(255,180,84,0.7)]"
            style={{ left: `${DIV_FRAC * 100}%` }}
          />
          {/* the playhead — hidden while it sits exactly on the divergence
              marker: that instant belongs to the amber */}
          {!atDivergence && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-px bg-teal/70 shadow-[0_0_8px_rgba(22,199,154,0.55)]"
              style={{ left: `${fracOf(t) * 100}%` }}
            />
          )}

          <label htmlFor="case-scrub" className="sr-only">
            {cd.scrubber.hint}
          </label>
          <input
            id="case-scrub"
            type="range"
            min={0}
            max={1000}
            step={1}
            value={Math.round(fracOf(t) * 1000)}
            aria-valuetext={`${fmtRel(t)} relative to first divergence`}
            onChange={(e) => onScrub(Math.round((T0 + (SPAN * Number(e.target.value)) / 1000) * 10) / 10)}
            className="hh-scrub focus-ring absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent"
          />
        </div>

        {/* per-lane scale gutter: max / LIVE READOUT at the playhead / min */}
        <div className="flex w-12 shrink-0 flex-col">
          <div className="h-12 shrink-0" />
          {rec.signals.map((s) => (
            <div
              key={s.id}
              className="flex min-h-14 flex-1 basis-0 flex-col items-end justify-between py-1 pl-2 font-mono text-[9px] tabular-nums text-ink-faint/80"
            >
              <span>{s.scale[1]}</span>
              {/* the readout goes amber exactly while the run is outside its
                  envelope — the band's verdict, live, without reading the trace */}
              <span
                className={`text-[10px] ${
                  outOfBand(s, Math.round((t - s.series.t0) / s.series.dt)) ? "text-amber" : "text-ink"
                }`}
              >
                {valueAt(s.series, t).toFixed(s.decimals)}
              </span>
              <span>{s.scale[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── The baseline legend — what the band IS, and which lane has none.
           The run count and matched dimensions come from the record, never from
           copy: the comparison is data, and it has to be able to change. ── */}
      <div className="shrink-0 border-t border-ground-line pt-3 sm:pl-40">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-4 shrink-0 rounded-[2px] border border-ink-faint/25 bg-ink-faint/[0.12]"
            />
            <span className="font-mono text-[10px] text-ink-dim">
              {cd.baseline.band} — {rec.baseline.runs} known-good runs
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-[2px] w-4 shrink-0 rounded-full bg-amber" />
            <span className="font-mono text-[10px] text-ink-dim">{cd.baseline.breach}</span>
          </span>
          <span className="font-mono text-[10px] text-ink-faint">
            {cd.baseline.matchedPrefix} {rec.baseline.matchedOn.join(" · ")}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-ink-faint">
          {cd.baseline.noBand}
        </p>
      </div>
    </div>
  );
}
