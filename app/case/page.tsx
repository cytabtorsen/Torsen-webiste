import type { Metadata } from "next";
import { caseDemo } from "@/lib/copy";
import { CaseReplay } from "@/components/case/CaseReplay";

/**
 * /case — the incident-replay demo (the deck's product UI, made real).
 * A hidden route: noindex/nofollow, linked from nowhere on the site, shown at
 * events from the local static build. The page is a template over
 * data/case-record.json — the witness pipeline fills the same shape from a
 * real recording.
 */
export const metadata: Metadata = {
  title: caseDemo.meta.title,
  description: caseDemo.meta.description,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function CasePage() {
  return <CaseReplay />;
}
