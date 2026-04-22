import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Заявка отправлена | AI Web Studio",
  description: "Спасибо за заявку. Свяжемся с вами в течение нескольких часов.",
}

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">

        {/* Иконка успеха */}
        <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M10 21l7 7 13-14"
              stroke="#10b981" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Заявка отправлена!
        </h1>

        <p className="mt-4 text-base leading-7 text-zinc-500">
          Получили вашу заявку и свяжемся в течение нескольких часов.
          Пока можете попробовать генератор — он бесплатный.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/generator"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Попробовать генератор
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            На главную
          </Link>
        </div>

      </div>
    </main>
  )
}
