import { existsSync } from "node:fs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export -> deployable to GitHub Pages (and Vercel) with no backend.
  output: "export",
  // next/image optimization needs a server; static export must use unoptimized.
  images: { unoptimized: true },
  // Each route becomes /route/index.html — friendliest for static hosts.
  trailingSlash: true,
  // We run type-checking in CI; keep lint from blocking the static export build.
  eslint: { ignoreDuringBuilds: true },
  env: {
    // Build-time flag: the head-to-head clip is generated offline and dropped in
    // by hand (see torsen-planning/seedance-generation-pack.md). Until the mp4
    // exists, the stage renders the poster only — no <video>, no 404 per reveal.
    // Committing the mp4 and rebuilding flips this on; no code change needed.
    NEXT_PUBLIC_HH_VIDEO: String(existsSync("public/headtohead/reconstruction.mp4")),
    // Same drop-in flow for the /case incident clip (see the Seedance pack,
    // "Clip 2"). Until the mp4 exists, the /case viewport is poster-only.
    NEXT_PUBLIC_CASE_VIDEO: String(existsSync("public/case/incident.mp4")),
  },
};

export default nextConfig;
