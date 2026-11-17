import type { NextConfig } from "next";

// Static export: agenda.nidevconf.com deploys as plain files (GitHub Pages),
// same as the main site. No server, so no per-request OG images — see
// app/opengraph-image.png/route.tsx and app/speakers/[slug]/og.png/route.tsx
// for the build-time alternative.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
