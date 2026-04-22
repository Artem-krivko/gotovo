import Link from "next/link";

interface CtaProps {
  title: string;
  subtitle: string;
  button: string;
}

export function Cta({ title, subtitle, button }: CtaProps) {
  return (
    <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 text-center sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.2), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-[#A1A1B5]">{subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5"
              >
                <span aria-hidden="true">✦</span>
                {button}
              </Link>
              <a
                href="mailto:hello@gotovo.studio"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Написать напрямую
              </a>
            </div>
            <p className="mt-4 text-xs text-[#6B6B80]">
              Бесплатно · Без регистрации · Ответ в течение нескольких часов
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
