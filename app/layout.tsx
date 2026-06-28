import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/lib/copy";

/**
 * Display face for headlines only (the "one custom type choice"): a geometric
 * technical grotesque that rhymes with the mono labels and lifts the perceived
 * tier without going editorial. Body + labels stay Geist. Self-hosted at build
 * time (works with `output: export`); preloaded + size-adjusted fallback so it
 * doesn't cost the headline LCP.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  // Only the weights the headlines actually use: 500 (mission) + 600 (everything else).
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-space-grotesk",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  keywords: [
    "physical AI",
    "autonomous robots",
    "failure reconstruction",
    "robot black box",
    "incident reconstruction",
    "reliability engineering",
    "learned policy",
  ],
  authors: [{ name: "Torsen" }],
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-ground text-ink antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
