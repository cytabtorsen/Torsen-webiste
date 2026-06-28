"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/copy";

/** Sticky, translucent nav. Hairline border + blur intensify after scroll. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-ground-line bg-ground/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-6 sm:px-8"
      >
        <a href="#top" className="focus-ring flex items-center gap-2.5" aria-label={`${site.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={26} height={26} decoding="async" className="h-[26px] w-[26px]" />
          <span className="font-mono text-[15px] font-medium tracking-tight text-ink">{site.name}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring text-[14px] text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#early-access"
          className="focus-ring-amber rounded-lg border border-ground-line bg-ground-raised px-4 py-2 text-[14px] font-medium text-ink transition-[border-color,color,transform] hover:-translate-y-px hover:border-amber/60 hover:text-amber active:translate-y-0"
        >
          {nav.cta}
        </a>
      </nav>
    </header>
  );
}
