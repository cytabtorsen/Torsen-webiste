import { Section, Container } from "@/components/Section";
import { stack } from "@/lib/copy";

/**
 * STACK — where Torsen fits, and the answer to the SOVD/medkit objection.
 *
 * Two columns separated by a seam: what the reader's stack already captures
 * (left, muted — they keep all of it) and what Torsen does with it (right,
 * teal). The seam carries the first-divergence marker from the product UI, so
 * the boundary between capture and investigation is drawn with the same glyph
 * the product uses to mark the moment a run left nominal.
 *
 * No named rivals — see the BOUNDARY GUARDRAIL on `stack` in lib/copy.ts.
 * No motion beyond the Section scroll-reveal; the motion budget is spent.
 */

/** The first-divergence glyph — a marked instant on a line. */
function DivergenceMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 18"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <line x1="9" y1="3" x2="9" y2="15" />
      <circle cx="9" cy="9" r="2.2" />
      <line x1="3" y1="9" x2="6" y2="9" />
      <line x1="12" y1="9" x2="15" y2="9" />
    </svg>
  );
}

function Column({
  label,
  items,
  tone,
}: {
  label: string;
  items: readonly { readonly name: string; readonly desc: string }[];
  tone: "theirs" | "ours";
}) {
  const isOurs = tone === "ours";
  return (
    <div className="sm:flex-1">
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
          isOurs ? "text-teal" : "text-ink-dim"
        }`}
      >
        {label}
      </p>
      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.name} className="flex gap-3">
            <span
              aria-hidden="true"
              className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                isOurs ? "bg-teal" : "bg-ink-dim/45"
              }`}
            />
            <div>
              <p className={`text-[15px] font-medium ${isOurs ? "text-ink" : "text-ink-dim"}`}>
                {item.name}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-dim">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Stack() {
  return (
    <Section id="stack" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <h2 className="max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {stack.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-dim">{stack.sub}</p>

        {/* ── the boundary: capture (left, kept) | investigation (right, ours) ── */}
        <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:gap-12">
          <Column label={stack.theirs.label} items={stack.theirs.items} tone="theirs" />

          {/* the seam — vertical on desktop, horizontal on mobile; the mark sits
              on it, the same glyph the timeline uses for the first divergence */}
          <div
            aria-hidden="true"
            className="relative flex shrink-0 items-center justify-center sm:w-px"
          >
            <div className="h-px w-full bg-ground-line sm:h-full sm:w-px" />
            <span className="absolute flex h-7 w-7 items-center justify-center rounded-full border border-ground-line bg-ground">
              <DivergenceMark className="h-4 w-4 text-amber" />
            </span>
          </div>

          <Column label={stack.ours.label} items={stack.ours.items} tone="ours" />
        </div>

        {/* ── the line that answers the objection ── */}
        <div className="mt-14 border-t border-ground-line pt-8">
          <p className="text-balance font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-amber sm:text-[1.6rem]">
            {stack.close}
          </p>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-dim">{stack.readOnly}</p>
        </div>
      </Container>
    </Section>
  );
}
