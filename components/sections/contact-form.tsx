"use client";

import { useState, useCallback } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormFields {
  name: string;
  contact: string;
  message: string;
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" opacity="0.3" />
      <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center bg-acid text-ink" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="text-lg font-semibold text-ink">Заявка отправлена</p>
        <p className="mt-1 text-sm text-ink/55">Ответим в течение рабочего дня</p>
      </div>
    </div>
  );
}

const inputClass = "min-h-13 border border-ink/30 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/38 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 disabled:opacity-50";

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Ошибка отправки");
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Не удалось отправить. Напишите напрямую.");
      setStatus("error");
    }
  }, [fields]);

  if (status === "success") return <SuccessState />;

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-semibold text-ink/70">Имя</label>
        <input id="contact-name" name="name" type="text" required
          placeholder="Как вас зовут" value={fields.name}
          onChange={handleChange} disabled={isLoading} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-contact" className="text-sm font-semibold text-ink/70">Email или Telegram</label>
        <input id="contact-contact" name="contact" type="text" required
          placeholder="Как с вами связаться" value={fields.contact}
          onChange={handleChange} disabled={isLoading} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-semibold text-ink/70">Задача</label>
        <textarea id="contact-message" name="message" required rows={4}
          placeholder="Коротко о бизнесе и что нужно сделать"
          value={fields.message} onChange={handleChange} disabled={isLoading}
          className={`${inputClass} resize-none`} />
      </div>

      {status === "error" && (
        <p role="alert" className="border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>
      )}

      <button
        type="submit" disabled={isLoading}
        className="inline-flex min-h-13 items-center justify-center gap-2 bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <><SpinnerIcon /> Отправляю...</> : "Отправить заявку"}
      </button>

      <p className="text-center text-xs text-ink/45">Ответим в течение рабочего дня</p>
    </form>
  );
}
