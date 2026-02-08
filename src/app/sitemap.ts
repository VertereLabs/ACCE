import type { MetadataRoute } from "next";

const BASE_URL = "https://accetutors.co.za";

const ROUTES = [
  "/",
  "/guides",
  "/guides/ifrs-15",
  "/guides/ifrs-15/part-1",
  "/guides/ifrs-15/part-2",
  "/guides/ifrs-15/part-3",
  "/guides/ifrs-15/part-4",
  "/guides/ifrs-15/part-5",
  "/guides/ifrs-16",
  "/guides/ifrs-16/part-1",
  "/guides/ifrs-16/part-2",
  "/guides/ifrs-16/part-3",
  "/guides/ifrs-16/part-4",
  "/guides/ifrs-16/part-5",
  "/guides/groups",
  "/guides/groups/part-1",
  "/guides/groups/part-2",
  "/guides/groups/part-3",
  "/guides/groups/part-4",
  "/guides/groups/part-5",
  "/guides/groups/part-6",
  "/guides/groups/part-7",
];

function getPriority(path: string): number {
  const depth = path.split("/").filter(Boolean).length;
  if (depth === 0) {
    return 1;
  }
  if (depth === 1) {
    return 0.8;
  }
  if (depth === 2) {
    return 0.7;
  }
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: getPriority(path),
  }));
}
