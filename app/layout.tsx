import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gotovo — опишите бизнес, получите сайт за 30 секунд",
    template: "%s | gotovo",
  },
  description:
    "AI-генератор дизайна сайтов. Опишите бизнес — ИИ создаёт превью за 30 секунд бесплатно. Нравится — заказываете разработку. Лендинги от 500$.",
  keywords: [
    "создание сайтов для бизнеса",
    "ai генератор сайтов",
    "заказать лендинг",
    "разработка сайта под ключ",
    "разработка сайтов минск",
    "веб студия беларусь",
    "gotovo",
  ],
  authors: [{ name: "gotovo" }],
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "gotovo",
    title: "gotovo — AI-генератор дизайна сайтов",
    description: "Опишите бизнес — ИИ создаёт дизайн за 30 секунд. Бесплатно. От 500$.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "gotovo — AI веб-агентство" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "gotovo — AI-генератор дизайна сайтов",
    description: "Превью дизайна за 30 секунд — бесплатно. От 500$.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "gotovo",
  description: "AI-агентство по разработке сайтов. Генератор дизайна за 30 секунд бесплатно.",
  url: SITE_URL,
  serviceType: "Web Development",
  areaServed: [
    { "@type": "City", name: "Минск", addressCountry: "BY" },
    { "@type": "Country", name: "Беларусь" },
  ],
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={spaceGrotesk.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-MSXLMK8X5K"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MSXLMK8X5K');`}
      </Script>
      <body
        className="bg-[#0A0A0F] text-white antialiased"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <SiteHeader />
        <div className="h-16" aria-hidden="true" />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
