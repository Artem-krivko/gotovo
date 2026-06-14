"use client"

import { useState } from "react"

type QuickState = "idle" | "loading" | "success" | "error"

export function QuickContact() {
  const [phone, setPhone] = useState("")
  const [state, setState] = useState<QuickState>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: phone, message: "Быстрая заявка с главной страницы" }),
      })
      const data = await res.json() as { success?: boolean }
      setState(res.ok && data.success ? "success" : "error")
    } catch {
      setState("error")
    }
  }

  return (
    <section className="bg-[#0A0A0F] px-4 pb-6 pt-2 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-[#13131A] px-6 py-5 sm:px-8">
          {state === "success" ? (
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Отлично! Перезвоним в течение часа</p>
                <p className="text-xs text-[#6B6B80]">Ожидайте звонка</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="shrink-0">
                <p className="text-sm font-semibold text-white">Не хотите пробовать генератор?</p>
                <p className="text-xs text-[#6B6B80]">Просто оставьте номер — обсудим проект по телефону</p>
              </div>
              <div className="flex flex-col gap-2">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+375 (29) 000-00-00"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[#6B6B80] outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 sm:w-[220px] sm:flex-none"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 disabled:opacity-60"
                  >
                    {state === "loading" ? "..." : "Перезвонить"}
                  </button>
                </form>
                {state === "error" && (
                  <p className="text-xs text-red-400">Ошибка отправки. Попробуйте ещё раз.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
