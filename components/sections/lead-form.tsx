"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  // Вместо alert() — состояние прямо в форме: alert блокирует поток,
  // не виден на мобильных так, как ожидается, и скрывал реальную ошибку.
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // /api/lead ожидает поле `contact`, а форма собирала `phone` —
        // из-за несовпадения контракта КАЖДАЯ заявка отсюда возвращала 400
        // и терялась. Ошибку скрывал alert с общим текстом.
        body: JSON.stringify({
          contact: form.phone,
          name: form.name,
          message: form.message,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ошибка отправки");

      setStatus("success");
      setForm({
        name: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("[lead-form]", error);
      setErrorMsg(error instanceof Error ? error.message : "Попробуйте ещё раз");
      setStatus("error");
    }
  }

  return (
    <form
      id="lead-form"
      onSubmit={handleSubmit}
      className="mt-8 flex w-full max-w-md flex-col gap-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        value={form.name}
        onChange={handleChange}
        required
        className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handleChange}
        required
        className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
      />

      <textarea
        name="message"
        placeholder="Кратко о задаче"
        value={form.message}
        onChange={handleChange}
        rows={3}
        className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
      />

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      {status === "success" && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Заявка отправлена — свяжемся с вами.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}