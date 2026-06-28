import { Section, Container } from "@/components/Section";
import { PilotForm } from "@/components/PilotForm";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ctaSection, pilotForm } from "@/lib/copy";

/**
 * Closing CTA — the forensics-pilot front door. The primary action is the gated
 * intake form (PilotForm); the lightweight "keep me posted" email sits below it
 * as the secondary path. The hero's primary CTA scrolls to this section
 * (#early-access); its secondary link scrolls to the keep-me-posted block
 * (#keep-posted). Nav "Apply for a forensics pilot" anchors here too.
 */
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

        <div className="mt-12 w-full max-w-2xl">
          <PilotForm />

          {/* Secondary low-intent path — the lightweight "keep me posted" email. */}
          <div
            id="keep-posted"
            className="mt-12 scroll-mt-24 border-t border-ground-line pt-8 text-center"
          >
            <p className="text-[13px] text-ink-dim">{pilotForm.secondaryPrompt}</p>
            <div className="mt-4 flex justify-center">
              <WaitlistForm variant="footer" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
