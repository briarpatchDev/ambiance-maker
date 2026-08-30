import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/login",
          "/drafts",
          "/favorites",
          "/settings",
          "/share",
          "/api/",
        ],
      },
    ],
    sitemap: "https://ambiancemaker.com/sitemap.xml",
  };
}
