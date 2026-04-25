"use client";

import { useEffect, useRef } from "react";

interface ScrollGlowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Обёртка для секций — ambient glow плавно появляется когда секция входит во viewport.
 * Использует IntersectionObserver (нативный, без JS-библиотек).
 * Дочерние .glow-orb элементы получают opacity через CSS transition (globals.css).
 */
export function ScrollGlow({ children, className = "" }: ScrollGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("glow-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-glow="" className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
