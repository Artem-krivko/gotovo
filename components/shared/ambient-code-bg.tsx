/**
 * AmbientCodeBg — фоновые символы кода на всю страницу
 * ─────────────────────────────────────────────────────
 * Фиксированный слой под всем контентом (z-0).
 * Чисто CSS анимация — нулевая нагрузка на CPU/GPU.
 * Opacity 3–4% — подсознательный ambient эффект.
 */

// Server Component — директива не нужна

const SYMBOLS = [
  "const", "=>", "<div>", "{}", "return", "async",
  "await", "function", ".hero", "px-6", "flex",
  "grid", "import", "export", "type", "interface",
  "сайт", "заявка", "дизайн", "результат",
  "</nav>", "<section>", "z-index:", "transform:",
  "opacity:", "border:", "useState", "useEffect",
  "null", "true", "class=", "href=", "~/",
]

// Фиксированные позиции и параметры — без Math.random() для SSR
const ITEMS = [
  { symbol: "const",      top:  4, left:  3, size: 11, duration: 22, delay:  0, opacity: 0.035 },
  { symbol: "=>",         top:  8, left: 88, size: 13, duration: 28, delay:  3, opacity: 0.030 },
  { symbol: "<div>",      top: 14, left: 22, size: 10, duration: 18, delay:  1, opacity: 0.040 },
  { symbol: "{}",         top: 18, left: 67, size: 14, duration: 32, delay:  5, opacity: 0.025 },
  { symbol: "return",     top: 23, left: 45, size: 11, duration: 25, delay:  2, opacity: 0.035 },
  { symbol: "async",      top: 28, left:  8, size: 12, duration: 20, delay:  7, opacity: 0.030 },
  { symbol: "сайт",       top: 31, left: 78, size: 13, duration: 30, delay:  4, opacity: 0.040 },
  { symbol: "function",   top: 37, left: 33, size: 10, duration: 24, delay:  9, opacity: 0.025 },
  { symbol: ".hero",      top: 42, left: 91, size: 11, duration: 19, delay:  1, opacity: 0.035 },
  { symbol: "import",     top: 46, left: 15, size: 12, duration: 27, delay:  6, opacity: 0.030 },
  { symbol: "заявка",     top: 51, left: 55, size: 13, duration: 22, delay:  3, opacity: 0.040 },
  { symbol: "flex",       top: 55, left: 72, size: 10, duration: 31, delay:  8, opacity: 0.025 },
  { symbol: "grid",       top: 59, left:  2, size: 11, duration: 17, delay:  2, opacity: 0.035 },
  { symbol: "interface",  top: 63, left: 38, size: 10, duration: 26, delay:  5, opacity: 0.030 },
  { symbol: "дизайн",     top: 67, left: 84, size: 13, duration: 23, delay: 10, opacity: 0.040 },
  { symbol: "opacity:",   top: 71, left: 20, size: 11, duration: 29, delay:  4, opacity: 0.025 },
  { symbol: "useState",   top: 75, left: 60, size: 12, duration: 21, delay:  7, opacity: 0.035 },
  { symbol: "результат",  top: 79, left: 10, size: 13, duration: 33, delay:  1, opacity: 0.030 },
  { symbol: "export",     top: 83, left: 48, size: 10, duration: 18, delay:  6, opacity: 0.040 },
  { symbol: "transform:", top: 87, left: 77, size: 11, duration: 25, delay:  3, opacity: 0.025 },
  { symbol: "await",      top: 91, left: 30, size: 12, duration: 28, delay:  9, opacity: 0.035 },
  { symbol: "border:",    top: 95, left: 65, size: 10, duration: 20, delay:  2, opacity: 0.030 },
  { symbol: "</nav>",     top:  6, left: 50, size: 11, duration: 24, delay:  5, opacity: 0.025 },
  { symbol: "href=",      top: 35, left: 97, size: 12, duration: 30, delay:  8, opacity: 0.035 },
  { symbol: "type",       top: 48, left:  0, size: 13, duration: 22, delay:  4, opacity: 0.040 },
  { symbol: "class=",     top: 72, left: 93, size: 10, duration: 27, delay:  7, opacity: 0.025 },
  { symbol: "true",       top: 20, left: 58, size: 11, duration: 19, delay:  0, opacity: 0.030 },
  { symbol: "null",       top: 88, left: 42, size: 12, duration: 31, delay:  6, opacity: 0.035 },
]

export function AmbientCodeBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="absolute font-mono text-violet-300 select-none"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animation: `ambient-drift ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
            willChange: "transform",
          }}
        >
          {item.symbol}
        </span>
      ))}

      {/* Keyframes через style tag — нельзя в Tailwind без плагина */}
      <style>{`
        @keyframes ambient-drift {
          0%   { transform: translateY(0px) translateX(0px); }
          33%  { transform: translateY(-12px) translateX(6px); }
          66%  { transform: translateY(8px) translateX(-4px); }
          100% { transform: translateY(-6px) translateX(10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ambient-drift {
            0%, 100% { transform: none; }
          }
        }
      `}</style>
    </div>
  )
}
