import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Cost } from "@/components/sections/Cost";
import { HeadToHead } from "@/components/sections/HeadToHead";
import { Product } from "@/components/sections/Product";
import { ROI } from "@/components/sections/ROI";
import { CTASection } from "@/components/sections/CTASection";

/**
 * The marketing page — deliberately tight (audit-driven: the old 11-section
 * narrative read as verbose AI editorial). Six beats, ICP-first (OEM/RaaS):
 * hook → the money → the reconstruction demo → the product, shown → ROI → pilot.
 * The cut sections (WhatItDoes, Difference, HowItWorks, IndependentRecord,
 * Audience, Credibility, Mission) still exist as components if we need them.
 */
export default function Home() {
  return (
    <>
      <Intro />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ground-raised focus:px-4 focus:py-2 focus:text-ink focus:outline-none focus:ring-2 focus:ring-teal"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Cost />
        <HeadToHead />
        <Product />
        <ROI />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
