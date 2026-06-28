import { Section, Container } from "@/components/Section";
import { difference } from "@/lib/copy";

/**
 * DIFFERENCE — the comparison strip (status quo vs. Torsen).
 *
 * Intent: "Visualizers show you the data. Torsen tells you why — independently."
 * Independence is the one thing a robot-maker cannot self-provide, so it leads:
 * the independence row (copy.difference.rows[1]) is rendered first as an amber-lit
 * lead row; the rest follow.
 *
 * Built as a real <table>: a comparison of paired claims is tabular data, so this
 * gives assistive tech the column headers + row pairing (each "them" associated
 * with its "us"). Left column = a GENERIC category ("Visualizers & dashboards");
 * no real competitor is named or logoed. Squint test: left muted, right lit with
 * a teal tick on every grounded Torsen claim.
 *
 * Server component: no hooks/motion. Scroll-reveal comes from <Section>.
 */

// Small tick — marks every grounded Torsen claim. Decorative; the text carries meaning.
function Tick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-1 shrink-0"
    >
      <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" />
    </svg>
  );
}

export function Difference() {
  // Lead with independence, then keep the remaining rows in copy order.
  const leadRow = difference.rows[1];
  const rows = [leadRow, ...difference.rows.filter((_, i) => i !== 1)];

  return (
    <Section id="difference" className="border-t border-ground-line py-28 sm:py-40">
      <Container>
        <p className="eyebrow">{difference.eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {difference.heading}
        </h2>

        <div className="mt-14 overflow-hidden rounded-xl border border-ground-line bg-ground-raised sm:mt-16">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">{difference.caption}</caption>
            <thead>
              <tr className="border-b border-ground-line">
                <th
                  scope="col"
                  className="w-1/2 border-r border-ground-line px-4 py-4 font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-ink-dim sm:px-7"
                >
                  {difference.colThem}
                </th>
                <th
                  scope="col"
                  className="w-1/2 px-4 py-4 font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-teal/80 sm:px-7"
                >
                  {difference.colUs}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const lead = i === 0;
                return (
                  <tr
                    key={row.us}
                    className={[
                      "group border-t border-ground-line align-top transition-colors duration-300",
                      lead ? "bg-amber/[0.04] hover:bg-amber/[0.07]" : "hover:bg-ground/40",
                    ].join(" ")}
                  >
                    <td
                      className={[
                        "border-r border-ground-line px-4 py-6 text-[15px] leading-relaxed text-ink-dim sm:px-7",
                        lead ? "border-l-2 border-l-amber/50" : "",
                      ].join(" ")}
                    >
                      {row.them}
                    </td>
                    <td className="px-4 py-6 sm:px-7">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={[
                            "inline-flex transition-transform duration-300 ease-out group-hover:scale-125",
                            lead ? "text-amber/90" : "text-teal/90",
                          ].join(" ")}
                        >
                          <Tick />
                        </span>
                        <p className="text-[15px] font-medium leading-relaxed text-ink">{row.us}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
