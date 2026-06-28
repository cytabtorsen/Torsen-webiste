import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Section";
import { privacy, site } from "@/lib/copy";

export const metadata: Metadata = {
  title: `${privacy.title} — ${site.name}`,
  description: "How Torsen handles the email address you submit to the early-access waitlist.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${site.url}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="min-h-[100svh]">
      <Container className="py-28 sm:py-36">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {privacy.title}
          </h1>
          <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-dim">
            {privacy.updated}
          </p>

          <div className="mt-10 space-y-5">
            {privacy.body.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-dim">
                {para}
              </p>
            ))}
          </div>

          <Link
            href="/"
            className="focus-ring mt-12 inline-flex items-center gap-2 text-[15px] text-ink-dim transition-colors hover:text-amber"
          >
            <span aria-hidden="true">←</span> {privacy.back}
          </Link>
        </div>
      </Container>
    </main>
  );
}
