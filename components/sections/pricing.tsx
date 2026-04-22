import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
};

type PricingProps = {
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
};

export function Pricing({ title, subtitle, plans }: PricingProps) {
  const includedItems = [
    "Проработка структуры сайта",
    "Адаптивная верстка",
    "Формы и точки захвата заявок",
    "Базовое SEO",
    "Согласование ключевых этапов",
    "Подготовка к запуску",
  ];

  return (
    <Section id="pricing">
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="-mx-4 overflow-x-auto px-4 pt-2 sm:mx-0 sm:px-0 sm:pt-3">
          <div className="flex gap-4 pb-2 pl-2 pr-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:pl-0 sm:pr-0">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`reveal-up min-w-[280px] rounded-[2rem] border p-5 shadow-sm transition sm:min-w-0 sm:p-6 ${
                  plan.featured
                    ? "hover-lift border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 text-zinc-950 sm:-translate-y-1"
                    : "hover-lift border-zinc-200 bg-white text-zinc-900"
                } ${index === 0 ? "delay-1" : index === 1 ? "delay-2" : "delay-3"}`}
              >
                <div className="flex min-h-full flex-col">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                          plan.featured
                            ? "border-violet-200 bg-white/80 text-violet-700"
                            : "border-zinc-200 bg-zinc-50 text-zinc-500"
                        }`}
                      >
                        {plan.featured ? "Рекомендуем" : "Пакет"}
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                        {plan.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {plan.price}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                      >
                        <span
                          className={`mt-2 h-2 w-2 rounded-full ${
                            plan.featured ? "bg-violet-600" : "bg-zinc-900"
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <a
                      href="#lead-form"
                      className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition ${
                        plan.featured
                          ? "bg-zinc-950 text-white hover:bg-zinc-800"
                          : "bg-black text-white hover:bg-zinc-800"
                      }`}
                    >
                      Обсудить проект
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-up delay-2 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                Что входит в стоимость
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Не только дизайн и код,
                <br className="hidden sm:block" /> а полный процесс подготовки и запуска
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                Каждый пакет собирается вокруг бизнес-задачи: от структуры и
                визуального решения до адаптива, заявок и запуска в работу.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {includedItems.map((item, index) => (
                <div
                  key={item}
                  className={`hover-lift reveal-up rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700 ${
                    index < 2 ? "delay-1" : index < 4 ? "delay-2" : "delay-3"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}