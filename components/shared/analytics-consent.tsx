"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { setConsent } from "@/lib/analytics"

const CONSENT_KEY = "analytics_consent"

/**
 * Запрос согласия на аналитику.
 *
 * Показывается один раз и только если выбор ещё не сделан. До согласия
 * GA4 работает в режиме denied (см. Consent Mode в app/layout.tsx),
 * а события воронки копятся в очереди и никуда не уходят.
 */
export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Читать localStorage можно только на клиенте, поэтому решение
    // откладываем в микротаску: это не синхронный setState в теле эффекта,
    // а реакция на результат чтения внешнего хранилища.
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      try {
        if (!window.localStorage.getItem(CONSENT_KEY)) setVisible(true)
      } catch {
        // localStorage недоступен — баннер не показываем и аналитику не собираем.
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!visible) return null

  const decide = (granted: boolean) => {
    setConsent(granted)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Согласие на аналитику"
      aria-describedby="analytics-consent-description"
      className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[60] mx-auto max-w-[920px] border border-ink bg-paper shadow-[5px_5px_0_#171712] sm:inset-x-4 sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:shadow-[7px_7px_0_#171712]"
    >
      <div className="h-1 bg-cobalt" aria-hidden="true" />
      <div className="grid gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:p-4">
        <div className="hidden h-10 w-10 items-center justify-center bg-acid text-xs font-semibold sm:flex" aria-hidden="true">
          01
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink/48">
              Аналитика / ваш выбор
            </p>
            <Link
              href="/privacy"
              className="shrink-0 text-[0.7rem] font-semibold text-ink/55 underline decoration-ink/30 underline-offset-4 transition hover:text-cobalt focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cobalt sm:hidden"
            >
              Подробнее
            </Link>
          </div>
          <p id="analytics-consent-description" className="mt-1.5 text-xs leading-5 text-ink/68 sm:text-sm sm:leading-6">
            Обезличенная аналитика помогает улучшать сайт. До вашего выбора используются только ограниченные сигналы без рекламной персонализации.
          </p>
          <Link
            href="/privacy"
            className="mt-1 hidden w-fit text-xs font-semibold text-ink/48 underline decoration-ink/25 underline-offset-4 transition hover:text-cobalt focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cobalt sm:block"
          >
            Как используем данные →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <button
            type="button"
            onClick={() => decide(false)}
            className="inline-flex min-h-11 items-center justify-center border border-ink bg-transparent px-3 text-xs font-semibold text-ink transition hover:bg-acid focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cobalt sm:px-4 sm:text-sm"
          >
            Не разрешать
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="inline-flex min-h-11 items-center justify-center bg-ink px-3 text-xs font-semibold text-paper transition hover:bg-cobalt focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cobalt sm:px-5 sm:text-sm"
          >
            Разрешить
          </button>
        </div>
      </div>
    </div>
  )
}
