import { Container } from "@/components/Section";
import { footer, nav, site } from "@/lib/copy";

/** Thin legal footer below the CTA. The mission line lives in its own section. */
export function Footer() {
  return (
    <footer className="border-t border-ground-line py-10">
      <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={22} height={22} loading="lazy" decoding="async" className="h-[22px] w-[22px]" />
          <span className="font-mono text-[14px] text-ink-dim">{site.domain}</span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="focus-ring text-[13px] text-ink-dim transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <p className="max-w-xs text-[13px] text-ink-dim">{footer.copyright}</p>
      </Container>
    </footer>
  );
}
