import { Section, Container } from "@/components/Section";
import { mission } from "@/lib/copy";

/**
 * MISSION — the north-star line. Larger and quiet: a single resonant statement
 * with generous breathing room and a very restrained ambient backdrop. The word
 * "why" carries the signature amber.
 */
export function Mission() {
  // Highlight the word "why" inside the line with the amber signature.
  const [before, after] = mission.line.split("why");
  return (
    <Section
      id="mission"
      className="relative overflow-hidden border-t border-ground-line py-32 sm:py-44"
    >
      {/* very restrained ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <Container className="relative">
        <p className="eyebrow">{mission.eyebrow}</p>
        <p className="mt-10 max-w-5xl text-balance text-[1.75rem] font-medium leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          {before}
          <span className="why">why</span>
          {after}
        </p>
      </Container>
    </Section>
  );
}
