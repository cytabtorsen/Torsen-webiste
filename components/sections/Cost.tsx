import { Section, Container } from "@/components/Section";
import { cost } from "@/lib/copy";

/**
 * COST — the money section. Four sourced numbers, near-zero prose: this is the
 * buyer's language straight from the ICP research (Head of Field Ops, COO).
 * The leak is human time to explain incidents, not missing data. The first
 * card carries the amber incident hue; the closer names the ROI wedge.
 */
export function Cost() {
  return (
    <Section id="cost" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <p className="eyebrow">{cost.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {cost.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim">{cost.sub}</p>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ground-line bg-ground-line lg:grid-cols-4">
          {cost.stats.map((s, i) => (
            <div key={s.unit} className="flex flex-col bg-ground-raised p-5 sm:p-6">
              <p
                className={`font-display text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[2.15rem] ${
                  i === 0 ? "text-amber" : "text-ink"
                }`}
              >
                {s.value}
              </p>
              <p className="mt-3 text-[15px] leading-snug text-ink">{s.unit}</p>
              <p className="mt-auto pt-4 font-mono text-[11px] leading-relaxed text-ink-faint">{s.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-dim">
          {cost.closer}
        </p>
      </Container>
    </Section>
  );
}
