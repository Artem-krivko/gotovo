"use client";

import { useState } from "react";

export function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

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
  
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error("Ошибка отправки");
  
      alert("Заявка отправлена");
  
      setForm({
        name: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      alert("Ошибка. Попробуйте еще раз");
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

      <button
        type="submit"
        className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Отправить заявку
      </button>
    </form>
  );
}