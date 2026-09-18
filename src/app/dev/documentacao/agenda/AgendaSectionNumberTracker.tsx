"use client";

import { useEffect } from "react";

type AgendaSectionNumberTrackerProps = {
  sectionIds: readonly string[];
};

export function AgendaSectionNumberTracker({ sectionIds }: AgendaSectionNumberTrackerProps) {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('nav[aria-label="Nesta página"]');
    const numbers = nav ? Array.from(nav.querySelectorAll<HTMLElement>("ol > li > a > span:first-child")) : [];
    if (numbers.length === 0 || sectionIds.length === 0) return;

    let frameId = 0;

    const updateActiveNumber = () => {
      frameId = 0;

      const marker = window.scrollY + Math.min(220, Math.max(140, window.innerHeight * 0.28));
      let activeIndex = 0;

      sectionIds.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) activeIndex = index;
      });

      numbers.forEach((number, index) => {
        const isActive = index === activeIndex;
        number.style.color = isActive ? "var(--color-primary-600)" : "";
        number.style.fontWeight = isActive ? "700" : "";
      });
    };

    const scheduleUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateActiveNumber);
    };

    updateActiveNumber();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [sectionIds]);

  return null;
}
