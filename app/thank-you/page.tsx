import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Заявка отправлена", robots: { index: false, follow: false } };

export default function ThankYouPage(){return <main className="flex min-h-[calc(100vh-64px)] items-center bg-acid px-4 py-16 text-ink sm:px-6"><div className="mx-auto w-full max-w-[1000px] border border-ink bg-paper p-7 shadow-[10px_10px_0_#171712] sm:p-12"><p className="section-index text-ink/45">Заявка отправлена</p><h1 className="mt-8 text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.065em]">Спасибо.<br /><span className="editorial-serif font-normal italic text-signal">Контекст уже у нас.</span></h1><p className="mt-8 max-w-xl text-lg leading-8 text-ink/65">Ответим в течение рабочего дня. Если вопрос срочный, можно написать напрямую в Telegram.</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/" className="editorial-button editorial-button--dark">На главную →</Link><a href="https://t.me/Artem_k_r" target="_blank" rel="noopener noreferrer" className="editorial-button editorial-button--line">Telegram ↗</a></div></div></main>}
