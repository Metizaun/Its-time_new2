"use client";

import { useEffect } from "react";

type LeadSectionTrackerProps = {
  sectionIds: readonly string[];
};

export function LeadSectionTracker({ sectionIds }: LeadSectionTrackerProps) {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('nav[aria-label="Nesta página"]');
    const links = nav ? Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[data-doc-section-id]")) : [];
    if (links.length === 0 || sectionIds.length === 0) return;

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const marker = window.scrollY + Math.min(220, Math.max(140, window.innerHeight * 0.28));
      let activeIndex = 0;

      sectionIds.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) activeIndex = index;
      });

      links.forEach((link, index) => {
        const isActive = index === activeIndex;
        link.setAttribute("aria-current", isActive ? "location" : "false");
        link.style.backgroundColor = isActive ? "var(--color-primary-50)" : "";
        link.style.color = isActive ? "var(--color-primary-700)" : "";
        const number = link.querySelector("span");
        if (number) {
          number.style.color = isActive ? "var(--color-primary-600)" : "";
          number.style.fontWeight = isActive ? "700" : "";
        }
      });
    };

    const scheduleUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
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
