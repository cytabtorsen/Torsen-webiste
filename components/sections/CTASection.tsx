import { Section, Container } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ctaSection } from "@/lib/copy";

/** Closing CTA — repeat email capture. Nav "Request early access" anchors here. */
export function CTASection() {
  return (
    <Section
      id="early-access"
      className="relative overflow-hidden border-t border-ground-line py-36 sm:py-52"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.11] blur-[130px]"
        aria-hidden
      />
      <Container className="relative flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-balance font-display text-[2rem] font-semibold tracking-tight sm:text-[2.75rem]">
          {ctaSection.heading}
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink-dim">{ctaSection.sub}</p>
        <div className="mt-9 flex w-full justify-center">
          <WaitlistForm variant="footer" />
        </div>
      </Container>
    </Section>
  );
}
