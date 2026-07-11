import { Container } from "@/components/Section";
import { footer, nav, site } from "@/lib/copy";
import { LogoMark } from "@/components/Logo";

/**
 * Footer. Carries the legitimacy an enterprise buyer looks for before trusting
 * an "independent record": a one-line company descriptor, a real contact, a
 * privacy link (we collect emails via the waitlist), plus nav + copyright.
 */
export function Footer() {
  return (
    <footer className="border-t border-ground-line py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          {/* Brand + descriptor */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-6 w-6" />
              <span className="font-mono text-[15px] font-medium tracking-tight text-ink">{site.name}</span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{footer.descriptor}</p>
            <a
              href={footer.contactHref}
              className="focus-ring mt-4 inline-block font-mono text-[13px] text-ink-dim underline-offset-4 transition-colors hover:text-amber hover:underline"
            >
              {footer.contact}
            </a>
          </div>

          {/* Nav + privacy */}
          <nav aria-label="Footer" className="flex flex-col gap-3 md:items-end">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="focus-ring text-[14px] text-ink-dim transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
            <a
              href={footer.privacyHref}
              className="focus-ring text-[14px] text-ink-dim transition-colors hover:text-ink"
            >
              {footer.privacyLabel}
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ground-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[13px] text-ink-dim">{site.domain}</span>
          <p className="text-[13px] text-ink-dim">{footer.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
