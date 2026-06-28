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
};

export default nextConfig;
