import type { Metadata } from "next";
import { fleetBoard } from "@/lib/copy";
import { FleetBoard } from "@/components/fleet/FleetBoard";

/**
 * /fleet — the case-index board (the deck's slide-8 INCIDENTS panel, made real).
 * Screen two of the booth demo, drilling into /case. A hidden route:
 * noindex/nofollow, linked from nowhere on the site, shown at events from the
 * local static build. The page is a template over data/fleet-record.json.
 */
export const metadata: Metadata = {
  title: fleetBoard.meta.title,
  description: fleetBoard.meta.description,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function FleetPage() {
  return <FleetBoard />;
}
