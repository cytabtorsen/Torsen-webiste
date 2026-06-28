import { Section, Container } from "@/components/Section";
import { LogPanel } from "@/components/LogPanel";
import { ReconstructionPanel } from "@/components/ReconstructionPanel";
import { problem } from "@/lib/copy";

/**
 * PROBLEM — the gap autonomy opens up.
 *
 * Squint test: noise -> clarity. Two panels side by side.
 *   LEFT  — "the log haystack" (LogPanel): dim, truncated, monospace log lines
 *           that stream in as undifferentiated noise; the answer is lost in it.
 *   RIGHT — "one reconstructed moment" (ReconstructionPanel): an amber trace that
 *           draws into a teal grounded node, with the signature "why" caption.
 *
 * Both panels are client components (their motion is scroll-triggered); this
 * section stays a server component and supplies the heading + scroll-reveal.
 */
export function Problem() {
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
          <LogPanel />
          <ReconstructionPanel />
        </div>
      </Container>
    </Section>
  );
}
