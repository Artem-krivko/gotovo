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
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="text-lg font-semibold text-white">Заявка отправлена</p>
        <p className="mt-1 text-sm text-[#6B6B80]">Отвечу в течение нескольких часов</p>
      </div>
    </div>
  );
}

const inputClass = "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[#6B6B80] outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50";

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
        <label htmlFor="contact-name" className="text-sm font-medium text-[#A1A1B5]">Имя</label>
        <input id="contact-name" name="name" type="text" required
          placeholder="Как вас зовут" value={fields.name}
          onChange={handleChange} disabled={isLoading} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-contact" className="text-sm font-medium text-[#A1A1B5]">Email или Telegram</label>
        <input id="contact-contact" name="contact" type="text" required
          placeholder="Как с вами связаться" value={fields.contact}
          onChange={handleChange} disabled={isLoading} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-[#A1A1B5]">Задача</label>
        <textarea id="contact-message" name="message" required rows={4}
          placeholder="Коротко о бизнесе и что нужно сделать"
          value={fields.message} onChange={handleChange} disabled={isLoading}
          className={`${inputClass} resize-none`} />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit" disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <><SpinnerIcon /> Отправляю...</> : "Отправить заявку"}
      </button>

      <p className="text-center text-xs text-[#6B6B80]">Обычно отвечаю в течение нескольких часов</p>
    </form>
  );
}
