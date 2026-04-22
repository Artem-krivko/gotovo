import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";
const PAGE_URL = `${SITE_URL}/generator`;

export const metadata: Metadata = {
  title: "AI Генератор дизайна сайтов — бесплатно за 30 секунд",
  description:
    "Бесплатный AI генератор дизайна сайтов. Опишите свой бизнес и получите готовый дизайн за 30 секунд — без регистрации. Понравится — закажем разработку.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "AI Генератор дизайна сайтов — бесплатно",
    description:
      "Опишите бизнес — получите дизайн сайта за 30 секунд. Бесплатно и без регистрации.",
  },
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
