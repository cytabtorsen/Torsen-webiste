import { Section, Container } from "@/components/Section";
import { roi } from "@/lib/copy";

/**
 * ROI — the conversion beat. A Today-vs-With-Torsen comparison, then the OEM
 * leak math from the research ($399k → 30% → ~$120k). No kicker. Amber-free:
 * the win column carries the teal "grounded" hue; the pain stays neutral ink.
 */
export function ROI() {
  return (
    <Section id="roi" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <h2 className="max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {roi.heading}
        </h2>

        <div className="mt-10 overflow-hidden rounded-2xl border border-ground-line">
          <div className="hidden gap-6 border-b border-ground-line bg-ground-raised px-5 py-3 sm:grid sm:grid-cols-[168px_1fr_1fr]">
            <span />
            <span className="text-[13px] font-medium text-ink-dim">{roi.today}</span>
            <span className="text-[13px] font-medium text-teal">{roi.withTorsen}</span>
          </div>
          {roi.rows.map((r) => (
            <div
              key={r.label}
              className="grid gap-x-6 gap-y-1.5 border-b border-ground-line/60 px-5 py-4 last:border-0 sm:grid-cols-[168px_1fr_1fr] sm:items-baseline"
            >
              <p className="text-[14px] font-medium text-ink">{r.label}</p>
              <p className="text-[14px] leading-snug text-ink-dim">
                <span className="mr-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-faint sm:hidden">{roi.today}</span>
                {r.today}
              </p>
              <p className="text-[14px] leading-snug text-ink">
                <span className="mr-1.5 font-mono text-[11px] uppercase tracking-wide text-teal sm:hidden">Torsen</span>
                {r.torsen}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-2xl rounded-xl border border-teal/20 bg-teal/[0.06] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal">{roi.exampleLabel}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">{roi.example}</p>
        </div>
      </Container>
    </Section>
  );
}
