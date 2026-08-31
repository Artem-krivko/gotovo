import type { ReactNode } from "react";
import { EditorialBreadcrumbs, EditorialCta, EditorialFaq, EditorialHero, EditorialMetrics, EditorialSectionHeader } from "@/components/shared/editorial";

export type EditorialServicePageProps = {
  breadcrumb: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  note?: string;
  afterHero?: ReactNode;
  metrics: { value: string; label: string }[];
  problemTitle: ReactNode;
  problemIntro?: ReactNode;
  problems: { title: string; text: string }[];
  includedTitle: ReactNode;
  included: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
};

export function EditorialServicePage(props: EditorialServicePageProps) {
  return <main className="bg-paper text-ink">
    <EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:props.breadcrumb}]} />
    <EditorialHero eyebrow={props.eyebrow} title={props.title} intro={props.intro} note={props.note} />
    {props.afterHero}
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-[1440px]"><EditorialMetrics items={props.metrics}/></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:pb-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="01" label="Задача" title={props.problemTitle} intro={props.problemIntro}/><div className="mt-10 grid border-l border-t border-ink/25 md:grid-cols-3">{props.problems.map((item,index)=><article key={item.title} className="min-h-64 border-b border-r border-ink/25 p-6 sm:p-8" data-reveal><p className="text-xs text-ink/40">0{index+1}</p><h2 className="mt-10 text-xl font-semibold tracking-[-0.03em]">{item.title}</h2><p className="mt-3 text-sm leading-6 text-ink/58">{item.text}</p></article>)}</div></div></section>
    <section className="bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="Состав" light title={props.includedTitle}/><div className="mt-10 grid border-l border-t border-white/25 sm:grid-cols-2 lg:grid-cols-3">{props.included.map((item,index)=><article key={item.title} className="min-h-52 border-b border-r border-white/25 p-6" data-reveal><p className="text-xs text-white/40">0{index+1}</p><h3 className="mt-9 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/62">{item.text}</p></article>)}</div></div></section>
    <section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-[1100px]"><EditorialSectionHeader index="03" label="Вопросы" title={<>До начала <span className="editorial-serif font-normal italic text-cobalt">работы.</span></>}/><div className="mt-9"><EditorialFaq items={props.faq}/></div></div></section>
    <EditorialCta title={props.ctaTitle} text={props.ctaText}/>
  </main>;
}
