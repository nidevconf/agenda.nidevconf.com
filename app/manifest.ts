import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NIDC 2026 Agenda",
    short_name: "NIDC Agenda",
    description: "Build your day at NIDC 2026 and share it with a link.",
    start_url: "/agenda",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#EC008C",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
