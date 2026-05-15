import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Закрываем API и служебные страницы от индексации
        disallow: ["/api/", "/thank-you"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
