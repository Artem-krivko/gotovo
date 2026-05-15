import { MetadataRoute } from "next";
import { CITY_PAGES } from "@/content/seo/cities";
import { NICHE_PAGES } from "@/content/seo/niches";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";
  const now = new Date();

  const cityEntries: MetadataRoute.Sitemap = CITY_PAGES.map((city) => ({
    url: `${baseUrl}/goroda/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: city.isPrimary ? 0.85 : 0.75,
  }));

  const nicheEntries: MetadataRoute.Sitemap = NICHE_PAGES.map((niche) => ({
    url: `${baseUrl}/uslugi/${niche.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    // Главные страницы
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/generator`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },

    // SEO-страницы (высокий приоритет)
    { url: `${baseUrl}/razrabotka-sajtov-minsk`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/lending-minsk`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sozdanie-sajtov-dlya-biznesa`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/razrabotka-sajtov-ceny`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/ai-generator-sajta`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },

    // Динамические страницы городов (/goroda/[slug])
    ...cityEntries,

    // Динамические страницы ниш (/uslugi/[slug])
    ...nicheEntries,

    // Основные страницы
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contacts`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
