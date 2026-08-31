import type { Metadata } from "next";
import { EditorialBreadcrumbs, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";

export const metadata: Metadata = { title: "Политика конфиденциальности", description: "Как gotovo обрабатывает данные из форм сайта и использует аналитику." };

const sections=[
  ["Какие данные собираем","Имя, контакт и описание задачи, которые вы добровольно отправляете через форму. Также после согласия может собираться обезличенная аналитика посещений."],
  ["Зачем используем","Чтобы ответить на обращение, обсудить проект, улучшать понятность сайта и измерять работу страниц."],
  ["Кому передаём","Не продаём персональные данные. Для технической работы могут использоваться поставщики хостинга, аналитики и отправки уведомлений в объёме, необходимом для работы сервиса."],
  ["Срок хранения","Храним данные столько, сколько требуется для ответа и ведения деловой переписки, либо до обоснованного запроса на удаление."],
  ["Ваши права","Можно запросить уточнение или удаление отправленных данных, написав на info@usegotovo.by."],
  ["Cookie и аналитика","Аналитика включается только после явного согласия в баннере. Необязательные данные можно запретить или удалить через настройки браузера."],
] as const;

export default function PrivacyPage(){return <main className="bg-paper text-ink"><EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:"Политика конфиденциальности"}]}/><EditorialHero eyebrow="Документ" title={<>Политика<br /><span className="editorial-serif font-normal italic text-cobalt">конфиденциаль&shy;ности.</span></>} intro={<>Коротко и понятным языком: какие данные получает сайт, зачем они нужны и как связаться по вопросу удаления.</>} primary={null} secondary={null}/><section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-[1100px]"><EditorialSectionHeader index="01" label="Условия" title={<>Данные только <span className="editorial-serif font-normal italic text-signal">для работы с запросом.</span></>}/><div className="mt-10 border-t border-ink">{sections.map(([title,text],index)=><section key={title} className="grid gap-4 border-b border-ink/25 py-7 sm:grid-cols-12"><span className="text-xs text-ink/40 sm:col-span-1">0{index+1}</span><h2 className="text-xl font-semibold sm:col-span-4">{title}</h2><p className="text-sm leading-7 text-ink/62 sm:col-span-7">{text}</p></section>)}</div><p className="mt-8 text-xs text-ink/42">Актуально с 31 августа 2026 года.</p></div></section></main>}
