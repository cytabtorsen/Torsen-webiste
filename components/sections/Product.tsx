import { Section, Container } from "@/components/Section";
import { product } from "@/lib/copy";

/**
 * PRODUCT — the tool, shown, in a premium showcase. Real 2x-retina screenshots
 * (public/product/*.webp) sit in an app-window frame with elevation and a quiet
 * ambient glow — the interface reads as a real product, crisp on hi-DPI. No
 * section kicker; the headline carries it. Below the primary shot, three feature
 * callouts explain the frame without fragile pixel-pinned overlays.
 */

const FEATURE_ICONS = [
  // first divergence — a timeline marker
  <g key="d">
    <line x1="9" y1="3" x2="9" y2="15" />
    <circle cx="9" cy="9" r="2.2" />
    <line x1="3" y1="9" x2="6" y2="9" />
    <line x1="12" y1="9" x2="15" y2="9" />
  </g>,
  // four grounded signals — a waveform
  <polyline key="s" points="2 9 4.5 9 6.5 4 8.5 14 10.5 6 12.5 10 16 9" />,
  // a shareable case — a document
  <g key="c">
    <path d="M4.5 2.5h6l3 3v10h-9z" />
    <line x1="6.5" y1="8" x2="11.5" y2="8" />
    <line x1="6.5" y1="11" x2="11.5" y2="11" />
  </g>,
];

/** A minimal on-brand app window — not the macOS-traffic-light cliché. */
function AppWindow({
  bar,
  right,
  children,
}: {
  bar: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ground-line bg-ground-raised shadow-[0_40px_100px_-32px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/[0.04]">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-ground-line bg-ground/60 px-4">
        <span className="flex items-center gap-2 truncate">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal/80" />
          <span className="truncate font-mono text-[11px] tracking-wide text-ink-dim">{bar}</span>
        </span>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Product() {
  const { primary, secondary } = product;
  return (
    <Section id="product" className="border-t border-ground-line py-24 sm:py-32">
      <Container>
        <h2 className="max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {product.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-dim">{product.sub}</p>

        {/* ── primary showcase: the incident replay ── */}
        <div className="relative mt-14">
          {/* quiet ambient depth — static, low-opacity (per the motion budget) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(55%_60%_at_72%_38%,rgba(22,199,154,0.12),transparent_70%),radial-gradient(48%_52%_at_40%_78%,rgba(255,180,84,0.08),transparent_72%)] blur-2xl"
          />
          <AppWindow
            bar={primary.bar}
            right={
              <span className="flex shrink-0 items-center gap-2.5">
                <span className="hidden font-mono text-[11px] tracking-wide text-ink-faint sm:inline">{primary.ref}</span>
                <span className="rounded bg-ground/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-teal/90">
                  {product.chip}
                </span>
              </span>
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primary.src}
              alt={primary.alt}
              width={primary.width}
              height={primary.height}
              loading="lazy"
              className="block w-full"
            />
          </AppWindow>
        </div>

        {/* ── feature callouts ── */}
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {product.features.map((f, i) => (
            <div key={f.title} className="flex gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 18 18"
                className="mt-0.5 h-5 w-5 shrink-0 text-teal"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {FEATURE_ICONS[i]}
              </svg>
              <div>
                <p className="text-[15px] font-medium text-ink">{f.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-dim">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── secondary: the fleet index ── */}
        <div className="mt-16">
          <AppWindow bar={secondary.bar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondary.src}
              alt={secondary.alt}
              width={secondary.width}
              height={secondary.height}
              loading="lazy"
              className="block w-full"
            />
          </AppWindow>
          <p className="mt-3 text-[15px] text-ink-dim">{secondary.caption}</p>
        </div>
      </Container>
    </Section>
  );
}
