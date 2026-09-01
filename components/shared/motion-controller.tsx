"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.classList.remove("motion-ready");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    const register = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("[data-reveal]")) observer.observe(node);
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));
    };

    register(document.body);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(register));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
