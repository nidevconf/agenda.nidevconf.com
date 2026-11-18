import type { NextConfig } from "next";

// Static export: agenda.nidevconf.com deploys as plain files (GitHub Pages),
// same as the main site. No server, so no per-request OG images — see
// app/opengraph-image.png/route.tsx and app/speakers/[slug]/og.png/route.tsx
// for the build-time alternative.
const nextConfig: NextConfig = {
  output: "export",
  // Dev only: let a phone on the same Wi-Fi load the dev server's scripts. Without this,
  // opening http://<this Mac's IP>:3000 renders the page but every script is refused
  // (403), so nothing is interactive — no + buttons, no links, no sheets.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  images: { unoptimized: true },
};

export default nextConfig;
