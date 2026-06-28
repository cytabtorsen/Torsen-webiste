import { Section, Container } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ctaSection } from "@/lib/copy";

/** Closing CTA — repeat email capture. Nav "Request early access" anchors here. */
export function CTASection() {
  return (
    <Section
      id="early-access"
      className="relative overflow-hidden border-t border-ground-line py-32 sm:py-44"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/10 blur-[120px]"
        aria-hidden
      />
      <Container className="relative flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
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
