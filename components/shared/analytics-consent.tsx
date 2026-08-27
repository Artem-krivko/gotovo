"use client"

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
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#13131A] p-4 shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4"
    >
      <p className="text-sm text-[#A1A1B5]">
        Мы используем аналитику, чтобы понимать, какие страницы полезны.
        Без вашего согласия статистика не собирается.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => decide(true)}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Разрешить
        </button>
        <button
          type="button"
          onClick={() => decide(false)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Отклонить
        </button>
      </div>
    </div>
  )
}
