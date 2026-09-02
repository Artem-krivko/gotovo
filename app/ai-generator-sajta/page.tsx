import type { Metadata } from "next";
import Image from "next/image";
import { EditorialServicePage } from "@/components/seo/editorial-service-page";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "AI-генератор концепций сайта", description: "Бесплатный AI-генератор создаёт три первые визуальные концепции сайта. Это начало разговора о дизайне, а не обещание готового проекта.", path: "/ai-generator-sajta" });

const conceptExamples = [
  { src: "/images/generator/dentist-editorial.webp", label: "Стоматология", tone: "bg-[#d9e7ff]" },
  { src: "/images/generator/tattoo-artbook.webp", label: "Тату-студия", tone: "bg-signal" },
  { src: "/images/generator/coffee-magazine.webp", label: "Кофейня", tone: "bg-acid" },
] as const;

function GeneratorProof() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-4 md:grid-cols-3">
          {conceptExamples.map((item, index) => (
            <figure key={item.label} className={`editorial-visual overflow-hidden p-3 sm:p-5 ${item.tone}`} data-reveal="image">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                <Image src={item.src} alt={`Демонстрационная AI-концепция сайта для ниши «${item.label}»`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
              </div>
              <figcaption className="flex items-center justify-between gap-4 pt-4 text-xs font-semibold uppercase tracking-[0.12em]">
                <span>{item.label}</span><span>0{index + 1} / концепция</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-5 text-ink/48">Демонстрационные результаты генератора. Это визуальные гипотезы, а не реализованные клиентские проекты.</p>
      </div>
    </section>
  );
}

export default function AiGeneratorPage(){return <EditorialServicePage breadcrumb="AI-генератор сайта" eyebrow="Бесплатная концепт-лаборатория" title={<>Увидеть направления.<br /><span className="editorial-serif font-normal italic text-signal">Не угадывать вслепую.</span></>} intro={<>Опишите бизнес и получите три визуально разные гипотезы. Сравните структуру, настроение и подачу до разговора о разработке.</>} note="Бесплатно · без регистрации · обычно до минуты" afterHero={<GeneratorProof />}
metrics={[{value:"3",label:"разных направления"},{value:"0 BYN",label:"стоимость генерации"},{value:"1 бриф",label:"контекст для всех вариантов"}]}
problemTitle={<>Зачем нужен <span className="editorial-serif font-normal italic text-cobalt">первый эскиз.</span></>} problemIntro={<>Слова «современно» и «дорого» каждый понимает по-своему. Концепции переводят разговор в конкретику.</>}
problems={[{title:"Сравнить характер",text:"Увидеть, как один и тот же бизнес может звучать спокойно, энергично или строго."},{title:"Уточнить приоритеты",text:"Понять, какая структура и какие акценты ближе к реальной задаче."},{title:"Подготовить разговор",text:"Прийти к обсуждению проекта с визуальной реакцией, а не только абстрактными пожеланиями."}]}
includedTitle={<>Что генератор делает.<br /><span className="editorial-serif font-normal italic text-acid">И чего не обещает.</span></>}
included={[{title:"Три гипотезы",text:"Разные композиционные направления на основе одного брифа."},{title:"Живой HTML",text:"Результат можно посмотреть как страницу на desktop и mobile."},{title:"Честные факты",text:"Цифры, отзывы и гарантии появляются только из ваших данных."},{title:"Не финальный дизайн",text:"Концепция остаётся открытой для исследования и профессиональной доработки."},{title:"Не клиентский кейс",text:"Пример не выдаётся за реализованный коммерческий проект."},{title:"Не автосайт",text:"Разработка, интеграции, QA и запуск выполняются отдельным этапом."}]}
faq={[{question:"Генератор создаёт готовый сайт?",answer:"Нет. Он создаёт первую визуальную концепцию в живом HTML. Финальная структура, контент, дизайн, интеграции и проверка требуют отдельной работы."},{question:"Можно использовать результат как основу?",answer:"Да. Можно развить одно направление, объединить удачные решения или начать заново после подробного брифа."},{question:"Почему получается три варианта?",answer:"Сравнение помогает увидеть не косметические цвета, а разные композиционные и смысловые подходы к одной задаче."},{question:"Будет ли AI придумывать отзывы и цифры?",answer:"Нет. Генератор использует подтверждённые факты из расширенного брифа. Если данных нет, соответствующие доказательства не показываются."}]}
ctaTitle="Попробуйте на своём бизнесе." ctaText="Опишите задачу обычными словами. Сравните три направления и решите, какое стоит обсуждать дальше." />}
