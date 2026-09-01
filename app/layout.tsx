import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AnalyticsConsent } from "@/components/shared/analytics-consent";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionController } from "@/components/shared/motion-controller";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gotovo — разработка сайтов для бизнеса",
    template: "%s | gotovo",
  },
  description:
    "Проектируем и разрабатываем выразительные сайты для бизнеса. Бесплатная AI-концепция помогает увидеть первое направление до начала проекта.",
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
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
  name: SITE_NAME,
  description: "Независимая веб-студия: структура, дизайн, разработка и запуск сайтов для бизнеса.",
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
      {/* Consent Mode: по умолчанию аналитика запрещена и включается только
          после явного согласия (см. AnalyticsConsent). Раньше GA4 писал
          события сразу, без какого-либо согласия. */}
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{if(localStorage.getItem('analytics_consent')==='granted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}
gtag('js',new Date());gtag('config','G-MSXLMK8X5K',{anonymize_ip:true});`}
      </Script>
      <body
        className="bg-[#f2efe7] text-[#171712] antialiased"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <MotionController />
        <SiteHeader />
        <div className="h-16" aria-hidden="true" />
        {/* Обёртки <main> здесь быть не должно: каждая страница рендерит
            свой <main>, и получалась вложенность main в main — невалидная
            разметка, из-за которой скринридеры видят два main-landmark'а. */}
        {children}
        <SiteFooter />
        <AnalyticsConsent />
        <a
          href="https://t.me/Artem_k_r"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
          className="fixed bottom-5 right-5 z-40 hidden h-12 w-12 items-center justify-center bg-[#171712] text-white shadow-[4px_4px_0_#ff6542] transition-transform duration-200 hover:-translate-y-1 sm:flex"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.14 14.5l-2.95-.924c-.64-.203-.654-.64.136-.954l11.527-4.448c.537-.194 1.006.131.71.074z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
