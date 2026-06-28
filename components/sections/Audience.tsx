import { Section, Container } from "@/components/Section";
import { audience } from "@/lib/copy";

/**
 * WHO IT'S FOR — a quiet, confident statement for the people accountable for
 * the machine (reliability / failure-analysis engineers shipping learned-policy
 * robots).
 *
 * Composition over prose: an asymmetric 2-column block — the heading anchors the
 * left; the body and a small set of mono "role" chips sit right, set off by a
 * hairline rule and a lot of negative space. The restraint is the point.
 *
 * The chips are DERIVED ONLY from the existing body copy — the three audience
 * fragments it already names ("reliability", "failure-analysis", "learned-policy
 * robots"). No new claims, personas, stats, or logos are introduced.
 *
 * Server component: no "use client". Scroll-reveal comes from <Section>; the only
 * motion is pure-CSS chip hover. The body's quoted question carries the signature
 * amber "why" so this section rhymes with the hero and mission lines.
 */

// Sourced from copy.ts; each phrase appears verbatim in audience.body.
const roles = audience.roles;

export function Audience() {
  // Lift the signature amber "why" out of the body's quoted question without
  // altering the copy: split on the exact phrase and re-assemble around it.
  const quoted = "why did it do that?";
  const [bodyBefore, bodyAfter] = audience.body.split(quoted);

  return (
    <Section id="audience" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
          {/* ── Left: the claim ── */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="eyebrow">{audience.eyebrow}</p>
            <h2 className="mt-6 text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
              {audience.heading}
            </h2>
          </div>

          {/* ── Right: the body + the people it names ── */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            {/* hairline rule echoes the engineering, ledger-like restraint */}
            <div
              className="mb-7 hidden h-px w-full bg-gradient-to-r from-ground-line to-transparent md:block"
              aria-hidden="true"
            />

            <p className="max-w-xl text-lg leading-relaxed text-ink-dim">
              {bodyBefore}
              <span className="why">why</span>
              {quoted.slice(quoted.indexOf(" "))}
              {bodyAfter}
            </p>

            {/* Role chips — derived only from the body above. */}
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label={audience.rolesLabel}>
              {roles.map((role) => (
                <li
                  key={role}
                  className="group inline-flex items-center gap-2 rounded-md border border-ground-line bg-ground-raised px-3 py-1.5 font-mono text-[11px] tracking-tight text-ink-dim transition-colors duration-300 hover:border-teal/40 hover:text-ink"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-teal/60 transition-colors duration-300 group-hover:bg-teal"
                    aria-hidden="true"
                  />
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
