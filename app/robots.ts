import type { MetadataRoute } from "next";

// Замени на реальный домен перед деплоем
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

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
