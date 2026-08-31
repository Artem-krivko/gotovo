import { MetadataRoute } from "next";
import { CITY_PAGES } from "@/content/seo/cities";
import { NICHE_PAGES } from "@/content/seo/niches";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityEntries: MetadataRoute.Sitemap = CITY_PAGES.map((city) => ({
    url: absoluteUrl(`/goroda/${city.slug}`),
    changeFrequency: "monthly",
    priority: city.isPrimary ? 0.85 : 0.75,
  }));

  const nicheEntries: MetadataRoute.Sitemap = NICHE_PAGES.map((niche) => ({
    url: absoluteUrl(`/uslugi/${niche.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    // Главные страницы
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/generator"), changeFrequency: "monthly", priority: 0.95 },

    // SEO-страницы (высокий приоритет)
    { url: absoluteUrl("/razrabotka-sajtov-minsk"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/lending-minsk"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/sozdanie-sajtov-dlya-biznesa"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/ai-generator-sajta"), changeFrequency: "monthly", priority: 0.85 },

    // Хабы городских и нишевых решений
    { url: absoluteUrl("/goroda"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/uslugi"), changeFrequency: "monthly", priority: 0.8 },

    // Динамические страницы городов (/goroda/[slug])
    ...cityEntries,

    // Динамические страницы ниш (/uslugi/[slug])
    ...nicheEntries,

    // Основные страницы
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/process"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contacts"), changeFrequency: "yearly", priority: 0.5 },
  ];
}
