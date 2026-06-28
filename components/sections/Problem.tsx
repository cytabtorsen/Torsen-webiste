import { Section, Container } from "@/components/Section";
import { ReconstructionPanel } from "@/components/ReconstructionPanel";
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
    <Section id="problem" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">{problem.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {problem.heading}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">{problem.body}</p>

        {/* Two-panel contrast: noise (left) resolves into clarity (right). */}
        <div className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2">
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

          {/* ── RIGHT: one reconstructed moment (interactive: draws on view, replays on hover) ── */}
          <ReconstructionPanel />
        </div>
      </Container>
    </Section>
  );
}
