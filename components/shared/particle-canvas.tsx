"use client"

/**
 * ParticleCanvas — canvas с particle system для Hero секции
 * ──────────────────────────────────────────────────────────
 * Частицы при загрузке собираются в абстрактный UI (карточки + метрики).
 * При hover — лёгкое рассеивание, при уходе мыши — сборка обратно.
 * GSAP используется только для scrub анимации частиц.
 *
 * Целевая форма: абстрактный UI из второго референса —
 * стопка карточек с метриками (+248%, 6.8%, графики).
 */

import { useEffect, useRef, useCallback } from "react"

// ─── Типы ─────────────────────────────────────────────────────────────────────

interface Particle {
  x: number         // текущая X
  y: number         // текущая Y
  tx: number        // целевая X (форма UI)
  ty: number        // целевая Y (форма UI)
  ox: number        // исходная X (хаос)
  oy: number        // исходная Y (хаос)
  size: number      // размер точки
  opacity: number   // прозрачность
  color: string     // цвет (фиолетовый / синий / белый)
  speed: number     // скорость возврата
  char: string      // символ (точка или маленький знак)
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

// ─── Генерация целевых точек — абстрактный UI ─────────────────────────────────
// Рисуем wireframe UI программно: карточки, текст-строки, кнопка, график

function generateUITargets(w: number, h: number): Array<{ x: number; y: number; color: string }> {
  const targets: Array<{ x: number; y: number; color: string }> = []
  const scale = Math.min(w / 420, h / 520)

  // Центрирование UI
  const ox = w / 2 - (200 * scale) / 2
  const oy = h / 2 - (260 * scale) / 2

  function rect(
    rx: number, ry: number, rw: number, rh: number,
    color: string, density = 1, fill = false
  ) {
    const step = fill ? 4 / density : 1
    if (fill) {
      for (let x = rx; x < rx + rw; x += step) {
        for (let y = ry; y < ry + rh; y += step) {
          targets.push({ x: ox + x * scale, y: oy + y * scale, color })
        }
      }
    } else {
      // Только контур
      for (let x = rx; x <= rx + rw; x += step) {
        targets.push({ x: ox + x * scale, y: oy + ry * scale, color })
        targets.push({ x: ox + x * scale, y: oy + (ry + rh) * scale, color })
      }
      for (let y = ry; y <= ry + rh; y += step) {
        targets.push({ x: ox + rx * scale, y: oy + y * scale, color })
        targets.push({ x: ox + (rx + rw) * scale, y: oy + y * scale, color })
      }
    }
  }

  function line(x1: number, y1: number, x2: number, y2: number, color: string, step = 3) {
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const steps = dist / step
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      targets.push({
        x: ox + lerp(x1, x2, t) * scale,
        y: oy + lerp(y1, y2, t) * scale,
        color,
      })
    }
  }

  function textLine(x: number, y: number, len: number, color: string) {
    for (let i = 0; i < len; i += 3) {
      targets.push({ x: ox + (x + i) * scale, y: oy + y * scale, color })
    }
  }

  // ── КАРТОЧКА 1: основная (большая, сзади-справа) ──────────────────────────
  rect(110, 20, 190, 130, "rgba(124,58,237,0.6)")

  // Заголовок карточки 1 — строки текста
  textLine(118, 35, 80, "rgba(255,255,255,0.8)")
  textLine(118, 45, 60, "rgba(255,255,255,0.5)")

  // Большая метрика "+248%"
  // Рисуем "+248%" из отрезков
  line(118, 62, 118, 82, "rgba(167,139,250,1)")    // |
  line(112, 72, 124, 72, "rgba(167,139,250,1)")    // -
  // 2
  line(128, 62, 148, 62, "rgba(167,139,250,1)")
  line(148, 62, 148, 72, "rgba(167,139,250,1)")
  line(128, 72, 148, 72, "rgba(167,139,250,1)")
  line(128, 72, 128, 82, "rgba(167,139,250,1)")
  line(128, 82, 148, 82, "rgba(167,139,250,1)")
  // 4
  line(152, 62, 152, 72, "rgba(167,139,250,1)")
  line(152, 72, 162, 72, "rgba(167,139,250,1)")
  line(162, 62, 162, 82, "rgba(167,139,250,1)")
  // 8
  line(166, 62, 176, 62, "rgba(167,139,250,1)")
  line(166, 72, 176, 72, "rgba(167,139,250,1)")
  line(166, 82, 176, 82, "rgba(167,139,250,1)")
  line(166, 62, 166, 82, "rgba(167,139,250,1)")
  line(176, 62, 176, 82, "rgba(167,139,250,1)")

  // Подпись "Рост заявок"
  textLine(118, 92, 70, "rgba(161,161,181,0.7)")

  // Мини-график (линия роста)
  const chartPoints = [130, 118, 122, 108, 114, 100, 104, 96]
  for (let i = 0; i < chartPoints.length - 2; i += 2) {
    const xBase = 118 + i * 7
    line(xBase, chartPoints[i], xBase + 7, chartPoints[i + 2], "rgba(124,58,237,0.9)", 2)
  }

  // ── КАРТОЧКА 2: поверх первой (меньше, спереди-слева) ─────────────────────
  rect(10, 60, 170, 110, "rgba(19,19,26,1)")
  rect(10, 60, 170, 110, "rgba(124,58,237,0.3)")

  // Метрика карточки 2 — "Конверсия"
  textLine(22, 75, 60, "rgba(255,255,255,0.6)")

  // "6.8%"
  line(22, 90, 22, 108, "rgba(96,165,250,1)")
  line(22, 90, 36, 90, "rgba(96,165,250,1)")
  line(22, 99, 36, 99, "rgba(96,165,250,1)")
  line(36, 99, 36, 108, "rgba(96,165,250,1)")
  line(22, 108, 36, 108, "rgba(96,165,250,1)")

  // Мини-бар чарт
  const bars = [55, 45, 60, 48, 65, 52, 68]
  bars.forEach((barH, i) => {
    const bx = 60 + i * 12
    const barScaled = barH * 0.22
    line(bx, 108, bx, 108 - barScaled, "rgba(96,165,250,0.7)", 1)
    line(bx + 2, 108, bx + 2, 108 - barScaled, "rgba(96,165,250,0.7)", 1)
    line(bx + 4, 108, bx + 4, 108 - barScaled, "rgba(96,165,250,0.7)", 1)
  })

  textLine(22, 118, 80, "rgba(107,107,128,0.6)")
  textLine(22, 126, 50, "rgba(107,107,128,0.4)")
  textLine(22, 134, 40, "rgba(107,107,128,0.4)")

  // ── КАРТОЧКА 3: снизу (кнопка + форма) ────────────────────────────────────
  rect(30, 190, 200, 90, "rgba(13,13,22,1)")
  rect(30, 190, 200, 90, "rgba(255,255,255,0.08)")

  // Поля формы
  rect(42, 202, 176, 14, "rgba(255,255,255,0.06)")
  textLine(48, 212, 60, "rgba(107,107,128,0.5)")
  rect(42, 222, 176, 14, "rgba(255,255,255,0.06)")
  textLine(48, 232, 80, "rgba(107,107,128,0.5)")

  // Кнопка CTA
  rect(42, 244, 176, 22, "rgba(124,58,237,0.9)", 1, true)
  textLine(90, 258, 60, "rgba(255,255,255,0.9)")

  // ── НАВБАР (верхняя полоска) ───────────────────────────────────────────────
  rect(0, 0, 380, 14, "rgba(13,13,22,0.9)", 1, true)
  textLine(8, 10, 40, "rgba(124,58,237,0.8)")     // лого
  textLine(80, 10, 20, "rgba(161,161,181,0.5)")   // nav item
  textLine(108, 10, 20, "rgba(161,161,181,0.5)")
  textLine(136, 10, 20, "rgba(161,161,181,0.5)")
  rect(310, 2, 60, 10, "rgba(124,58,237,0.6)")    // кнопка в навбаре
  textLine(315, 9, 50, "rgba(255,255,255,0.7)")

  return targets
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const progressRef = useRef(0)       // 0 = хаос, 1 = форма UI
  const isHoverRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  const COLORS = [
    "rgba(167,139,250,",   // violet-400
    "rgba(96,165,250,",    // blue-400
    "rgba(248,248,255,",   // white
    "rgba(217,70,239,",    // fuchsia-500
  ]

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const w = canvas.width
    const h = canvas.height
    const targets = generateUITargets(w, h)
    const count = Math.min(targets.length, 1800)

    particlesRef.current = targets.slice(0, count).map((t, i) => {
      const colorBase = COLORS[i % COLORS.length]
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        tx: t.x,
        ty: t.y,
        ox: Math.random() * w,
        oy: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        color: colorBase,
        speed: Math.random() * 0.04 + 0.02,
        char: "•",
      }
    })
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    // Целевое значение progress
    const targetProgress = isHoverRef.current ? 0.6 : 1.0

    // Плавная интерполяция progress
    progressRef.current = lerp(progressRef.current, targetProgress, 0.025)

    const eased = easeOutQuart(progressRef.current)

    particlesRef.current.forEach((p) => {
      // Интерполяция между хаосом и формой
      const tx = lerp(p.ox, p.tx, eased)
      const ty = lerp(p.oy, p.ty, eased)

      // При hover — лёгкое отталкивание от мыши
      if (isHoverRef.current) {
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          const force = (80 - dist) / 80
          p.x += dx * force * 0.08
          p.y += dy * force * 0.08
        }
      }

      // Движение к цели
      p.x = lerp(p.x, tx, p.speed)
      p.y = lerp(p.y, ty, p.speed)

      // Рисуем точку
      const alpha = p.opacity * Math.min(progressRef.current * 2, 1)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `${p.color}${alpha})`
      ctx.fill()
    })

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver(() => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      initParticles(canvas)
    })

    const parent = canvas.parentElement
    if (parent) {
      resizeObserver.observe(parent)
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    initParticles(canvas)
    rafRef.current = requestAnimationFrame(draw)

    // Mouse events для hover эффекта
    function handleMouseEnter() { isHoverRef.current = true }
    function handleMouseLeave() { isHoverRef.current = false }
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(rafRef.current)
      resizeObserver.disconnect()
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [initParticles, draw])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden="true"
      style={{ display: "block" }}
    />
  )
}
