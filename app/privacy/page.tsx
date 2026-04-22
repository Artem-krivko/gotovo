import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Кратко о том, какие данные собираются через сайт и как они используются.",
};

import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        title="Политика конфиденциальности"
        subtitle="Кратко о том, какие данные собираются через сайт и как они используются."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-lg font-semibold text-black">
              1. Какие данные собираются
            </h2>
            <p className="mt-2">
              Через формы на сайте могут собираться данные, которые вы
              указываете добровольно: имя, телефон, email, описание задачи и
              другие сведения, которые вы оставляете в заявке.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black">
              2. Зачем используются данные
            </h2>
            <p className="mt-2">
              Данные используются только для связи с вами, уточнения задачи,
              подготовки предложения и ведения коммуникации по вашему проекту.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black">
              3. Как обрабатываются данные
            </h2>
            <p className="mt-2">
              Данные из формы могут передаваться во внутренние сервисы
              автоматизации, уведомлений и обработки заявок, которые
              используются для организации процесса работы с клиентами.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black">
              4. Передача третьим лицам
            </h2>
            <p className="mt-2">
              Данные не используются для перепродажи и не передаются третьим
              лицам без необходимости, кроме случаев, когда это требуется для
              обработки заявки, связи с вами или технической работы сайта.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black">
              5. Связь по вопросам данных
            </h2>
            <p className="mt-2">
              Если у вас есть вопросы по поводу обработки данных, вы можете
              связаться через указанные на сайте контакты:
            </p>

            <div className="mt-3 space-y-1">
              <div>Telegram: @YOUR_TELEGRAM</div>
              <div>Email: your@email.com</div>
              <div>Телефон: +000000000</div>
            </div>
          </section>
        </div>
      </Section>
    </main>
  );
}