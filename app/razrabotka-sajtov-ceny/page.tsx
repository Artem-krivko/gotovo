import type { Metadata } from "next";
import PricingPage from "@/app/pricing/page";

export const metadata: Metadata = {
  title: "Цены на разработку сайтов в Беларуси",
  description: "Лендинг от 1 200 BYN, бизнес-сайт от 2 900 BYN, индивидуальный проект от 4 900 BYN. Оплата 30/40/30.",
  alternates: { canonical: "/pricing" },
};

export default PricingPage;
