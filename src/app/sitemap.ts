import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms/store";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const lastMod = content.updatedAt
    ? new Date(content.updatedAt)
    : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/perspectives`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/subscribe`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/work-with-me`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const articles: MetadataRoute.Sitemap = content.articles
    .filter((a) => a.published)
    .map((a) => ({
      url: `${SITE_URL}/perspectives/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : lastMod,
      changeFrequency: "monthly" as const,
      priority: a.featured ? 0.85 : 0.75,
    }));

  return [...staticRoutes, ...articles];
}
