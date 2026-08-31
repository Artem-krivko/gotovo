import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "AI-генератор концепций сайта — бесплатно",
  description:
    "Бесплатный AI-генератор концепций сайта. Опишите бизнес и получите первое визуальное направление — без регистрации.",
  path: "/generator",
  openGraphDescription:
    "Опишите бизнес — получите первую концепцию сайта. Бесплатно и без регистрации.",
});

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
