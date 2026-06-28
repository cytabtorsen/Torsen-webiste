import { Section, Container } from "@/components/Section";
import { credibility as cred } from "@/lib/copy";

/**
 * CREDIBILITY — pre-product proof, zero logos (brief §7.2 + §7.3 · Phase 4c).
 *
 * Deliberately distinct from the card grids / comparison / pipeline: an
 * asymmetric statement (left = the grounded-truth STANCE, the loud thing) paired
 * with a quiet horizontal NUMERIC STAT STRIP (right = the category's external
 * funding, the supporting evidence) — the observability-site idiom.
 *
 * The figures are EXTERNAL market validation (other companies / the category),
 * never implied Torsen traction and never ROI/savings — so they read factual,
 * not boastful: ink values with a teal "grounded/verified" accent (amber stays
 * reserved for the "why"). Server component, no interactivity.
 */
export function Credibility() {
  return (
    <Section id="credibility" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* ── LEFT — the grounded-truth stance ── */}
          <div className="lg:col-span-5">
            <p className="eyebrow">{cred.eyebrow}</p>
            <h2 className="mt-6 max-w-md text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
              {cred.groundedStance.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              {cred.groundedStance.body}
            </p>
            {/* the verified stamp — teal = grounded */}
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-teal/80">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal" />
              {cred.groundedStance.stamp}
            </p>
          </div>

          {/* ── RIGHT — the category is funded: framing + stat strip + caveat ── */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {cred.funded.label}
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-dim">
              {cred.funded.framing}
            </p>

            <ul
              role="list"
              className="mt-8 grid grid-cols-1 divide-y divide-ground-line border-y border-ground-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {cred.funded.figures.map((f) => (
                <li key={f.label} className="px-0 py-6 sm:px-6 sm:py-2 sm:first:pl-0">
                  <p className="font-display text-[2rem] font-semibold tracking-tight text-ink tabular-nums">
                    {f.value}
                  </p>
                  {/* teal "grounded category" accent — decorative */}
                  <span aria-hidden="true" className="mt-3 block h-px w-8 bg-teal/50" />
                  <p className="mt-3 text-[13px] font-medium text-ink-dim">{f.label}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-ink-faint">{f.sub}</p>
                </li>
              ))}
            </ul>

            {/* label-tier caveat — figures cite public reporting, clearly external */}
            <p className="mt-5 max-w-xl text-[12px] leading-relaxed text-ink-faint">
              {cred.funded.caveat}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
