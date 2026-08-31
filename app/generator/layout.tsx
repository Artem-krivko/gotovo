import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.usegotovo.by";
const PAGE_URL = `${SITE_URL}/generator`;

export const metadata: Metadata = {
  title: "AI-генератор концепций сайта — бесплатно",
  description:
    "Бесплатный AI-генератор концепций сайта. Опишите бизнес и получите первое визуальное направление — без регистрации.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "AI-генератор концепций сайта — бесплатно",
    description:
      "Опишите бизнес — получите первую концепцию сайта. Бесплатно и без регистрации.",
  },
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
