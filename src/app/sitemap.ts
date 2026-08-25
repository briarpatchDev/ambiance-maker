import { MetadataRoute } from "next";
import { categories } from "@/app/lib/categories";

const baseUrl = "https://ambiancemaker.com";

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "-");
}

function buildCategoryRoutes(
  tree: Record<string, any>,
  prefix: string,
): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  for (const [name, subtree] of Object.entries(tree)) {
    const path = `${prefix}/${nameToSlug(name)}`;
    const hasChildren = Object.keys(subtree).length > 0;
    routes.push({
      url: `${baseUrl}${path}`,
      changeFrequency: hasChildren ? "monthly" : "weekly",
      lastModified: new Date(),
    });
    if (hasChildren) {
      routes.push(...buildCategoryRoutes(subtree, path));
    }
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", lastModified: new Date() },
    ...(["/create", "/categories"] as const).map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "monthly" as const,
      lastModified: new Date(),
    })),
  ];

  const categoryRoutes = buildCategoryRoutes(categories, "/categories");

  return [...staticRoutes, ...categoryRoutes];
}
