import type { MetadataRoute } from "next";
import { SPEAKERS } from "./_lib/speakers";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agenda.nidevconf.com";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agenda`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/talks`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/workshops`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/villages`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/speakers`, changeFrequency: "weekly", priority: 0.8 },
    ...SPEAKERS.map((s) => ({
      url: `${baseUrl}/speakers/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
