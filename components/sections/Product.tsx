import { Section, Container } from "@/components/Section";
import { product } from "@/lib/copy";

/**
 * PRODUCT — the tool, shown. Real screenshots of the /case replay and /fleet
 * board (public/product/*.png), framed. No section kicker (the audit flagged
 * repeated eyebrows as AI scaffolding); the headline carries it. The honesty
 * chip sits on the primary shot — representative/synthetic, site discipline.
 */
export function Product() {
  return (
    <Section id="product" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <h2 className="max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {product.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-dim">{product.sub}</p>

        <div className="mt-12 flex flex-col gap-8">
          {product.shots.map((shot, i) => (
            <figure key={shot.src} className="group">
              <div className="relative overflow-hidden rounded-xl border border-ground-line bg-ground-raised shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  className="block w-full"
                  width={1440}
                  height={900}
                />
                {i === 0 && (
                  <span className="pointer-events-none absolute right-3 top-3 rounded bg-ground/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-teal/90 backdrop-blur-sm">
                    {product.chip}
                  </span>
                )}
                {/* hairline top-edge sheen — reads as a screen, not a flat png */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2 text-[15px] text-ink">
                <span className="font-medium">{shot.title}</span>
                <span className="text-ink-dim">— {shot.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
