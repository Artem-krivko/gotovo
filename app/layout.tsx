import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

// Sora не поддерживает cyrillic — используем latin-ext
// Кириллица рендерится системным шрифтом как фоллбек
const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
  display: "swap",
});

// ─── Метаданные ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gotovo — опишите бизнес, получите сайт за 30 секунд",
    template: "%s | gotovo",
  },
  description:
    "AI-генератор дизайна сайтов. Опишите бизнес — ИИ создаёт превью за 30 секунд бесплатно. Нравится — заказываете разработку. Лендинги от €500.",
  keywords: [
    "создание сайтов для бизнеса",
    "ai генератор сайтов",
    "заказать лендинг",
    "разработка сайта под ключ",
    "создать сайт с помощью ии",
    "веб студия",
    "сайт для малого бизнеса",
    "gotovo",
  ],
  authors: [{ name: "gotovo" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "gotovo",
    title: "gotovo — AI-генератор дизайна сайтов",
    description: "Опишите бизнес — ИИ создаёт дизайн за 30 секунд. Бесплатно. Лендинги от €500.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "gotovo — AI веб-агентство" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "gotovo — AI-генератор дизайна сайтов",
    description: "Превью дизайна за 30 секунд — бесплатно. Лендинги от €500.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── Schema.org ───────────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "gotovo",
  description: "AI-агентство по разработке сайтов. Генератор дизайна за 30 секунд бесплатно.",
  url: SITE_URL,
  serviceType: "Web Development",
  areaServed: "Worldwide",
  priceRange: "€€",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={sora.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-[#0A0A0F] text-white antialiased" suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
