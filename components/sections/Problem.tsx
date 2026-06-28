import { Section, Container } from "@/components/Section";
import { problem } from "@/lib/copy";

/**
 * PROBLEM — "the bet".
 *
 * Squint test: noise -> clarity. Two panels side by side.
 *   LEFT  — "the log haystack": many dim, truncated, monospace decorative log
 *           lines that read as undifferentiated noise; the answer is lost and
 *           the whole stack fades toward the bottom.
 *   RIGHT — "one reconstructed moment": a single illuminated panel echoing the
 *           hero — an amber reconstructed motion-path trace ending in a teal
 *           grounded node, with a small mono "why" caption.
 *
 * Server component: no "use client". The <Section> wrapper supplies the
 * scroll-reveal; all panel motion is pure CSS (reduced-motion handled globally).
 * Copy is verbatim from copy.problem; the only added text is tiny functional
 * mono labels on the panels.
 */
export function Problem() {
  // Decorative pseudo-log lines — varied widths so the stack reads as a haystack
  // of recorded values rather than meaning. Purely visual (the parent is aria-hidden).
  const logLines: { ts: string; tag: string; width: string }[] = [
    { ts: "12:04:07.118", tag: "sensor.depth", width: "92%" },
    { ts: "12:04:07.119", tag: "tf.base_link", width: "74%" },
    { ts: "12:04:07.121", tag: "policy.act", width: "88%" },
    { ts: "12:04:07.124", tag: "joint.cmd", width: "61%" },
    { ts: "12:04:07.126", tag: "sensor.imu", width: "83%" },
    { ts: "12:04:07.129", tag: "grip.force", width: "70%" },
    { ts: "12:04:07.131", tag: "policy.act", width: "95%" },
    { ts: "12:04:07.134", tag: "tf.tool0", width: "57%" },
    { ts: "12:04:07.137", tag: "sensor.depth", width: "86%" },
    { ts: "12:04:07.139", tag: "joint.cmd", width: "66%" },
    { ts: "12:04:07.142", tag: "policy.act", width: "90%" },
    { ts: "12:04:07.145", tag: "grip.force", width: "52%" },
  ];

  return (
    <Section id="problem" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <p className="eyebrow">{problem.eyebrow}</p>
        <h2 className="mt-5 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {problem.heading}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">{problem.body}</p>

        {/* Two-panel contrast: noise (left) resolves into clarity (right). */}
        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2">
          {/* ── LEFT: the log haystack ── */}
          <figure className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised">
            <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
              <span className="eyebrow">{problem.panels.logsLabel}</span>
              <span className="font-mono text-[11px] text-ink-dim">{problem.panels.logsState}</span>
            </figcaption>

            <div className="relative h-72 px-5 pt-4">
              {/* The noise. Decorative only — read by no one, which is the point. */}
              <div className="space-y-[7px]" aria-hidden="true">
                {logLines.map((l, i) => (
                  <div key={i} className="flex items-center gap-3 font-mono text-[11px] leading-none">
                    <span className="shrink-0 text-ink-faint/60">{l.ts}</span>
                    <span className="shrink-0 text-ink-faint/45">{l.tag}</span>
                    {/* truncated value bar — the "answer" buried as an undifferentiated tick */}
                    <span
                      className="h-[6px] rounded-sm bg-ink-faint/15"
                      style={{ width: l.width }}
                    />
                  </div>
                ))}
              </div>

              {/* Fade the haystack out toward the bottom: the answer is lost in it. */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ground-raised via-ground-raised/85 to-transparent"
                aria-hidden="true"
              />
            </div>
          </figure>

          {/* ── RIGHT: one reconstructed moment ── */}
          <figure className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised shadow-glow-teal transition-colors duration-300 hover:border-teal/40">
            <figcaption className="flex items-center justify-between border-b border-ground-line px-5 py-3">
              <span className="eyebrow text-teal/80">{problem.panels.reconLabel}</span>
              <span className="font-mono text-[11px] text-ink-dim">{problem.panels.reconState}</span>
            </figcaption>

            <div className="relative h-72">
              {/* faint blueprint grid, masked — echoes the hero backdrop */}
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />

              {/* ambient amber + teal glow, very restrained */}
              <div
                className="pointer-events-none absolute right-[10%] top-[18%] h-40 w-40 rounded-full bg-amber/12 blur-[80px]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-[8%] top-[12%] h-28 w-28 rounded-full bg-teal/10 blur-[70px]"
                aria-hidden="true"
              />

              {/* The single reconstructed motion-path: amber trace -> teal grounded node. */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 480 288"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                {/* soft halo under the trace */}
                <path
                  d="M70 232 C 150 210, 176 132, 250 116 S 372 96, 410 66"
                  stroke="#FFB454"
                  strokeOpacity={0.16}
                  strokeWidth={8}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* the grounded reconstructed trajectory (amber, draws in once) */}
                <path
                  d="M70 232 C 150 210, 176 132, 250 116 S 372 96, 410 66"
                  stroke="#FFB454"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  className="animate-trace-draw"
                  style={{ "--trace-len": 1 } as React.CSSProperties}
                />

                {/* origin marker — faint amber start of the reconstruction */}
                <circle cx={70} cy={232} r={3} fill="#FFB454" fillOpacity={0.55} />

                {/* teal grounded node where the moment resolves */}
                <circle
                  cx={410}
                  cy={66}
                  r={5}
                  fill="#16C79A"
                  className="animate-pulse-node"
                  style={{ transformOrigin: "410px 66px" }}
                />
                <circle cx={410} cy={66} r={11} fill="none" stroke="#16C79A" strokeOpacity={0.3} strokeWidth={1.5} />
                <circle cx={410} cy={66} r={18} fill="none" stroke="#16C79A" strokeOpacity={0.12} strokeWidth={1.5} />
              </svg>

              {/* the answer, named — the signature amber "why" */}
              <div className="absolute bottom-4 left-5 font-mono text-[11px] text-ink-dim">
                <span className="why">why</span>
                <span className="text-ink-dim">{problem.panels.captionAfter}</span>
              </div>
            </div>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
