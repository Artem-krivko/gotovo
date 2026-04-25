"use client";

import { useEffect, useRef } from "react";

interface ParallaxMockupProps {
  children: React.ReactNode;
}

/**
 * Лёгкий parallax на Hero-мокапе: двигается за скроллом на ~30px.
 * Чистый CSS transform через requestAnimationFrame — нет GSAP, нет библиотек.
 * Автоматически отключается при prefers-reduced-motion.
 */
export function ParallaxMockup({ children }: ParallaxMockupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const scrollY = window.scrollY;
        const offset = Math.min(scrollY * 0.12, 40);
        el.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className="parallax-mockup">
      {children}
    </div>
  );
}
