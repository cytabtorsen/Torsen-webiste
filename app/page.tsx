import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { HeadToHead } from "@/components/sections/HeadToHead";
import { Problem } from "@/components/sections/Problem";
import { WhatItDoes } from "@/components/sections/WhatItDoes";
import { Difference } from "@/components/sections/Difference";
import { Audience } from "@/components/sections/Audience";
import { Mission } from "@/components/sections/Mission";
import { CTASection } from "@/components/sections/CTASection";

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
        <HeadToHead />
        <Problem />
        <WhatItDoes />
        <Difference />
        <Audience />
        <Mission />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
