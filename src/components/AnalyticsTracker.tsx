"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Behaviour tracking on top of Umami's automatic page views:
 *  - section_view   first time each part of the page becomes the one on screen (how far people get)
 *  - section_time   seconds spent on each part (the animated "como-funciona" block is split per slide)
 *  - scroll_depth   25 / 50 / 75 / 100 %
 *  - click events   cta_whatsapp, cta_email, link_external, click (with the part of the page it happened in)
 *  - exit           the part of the page and scroll depth where the visitor left
 */

const ZONES: ReadonlyArray<readonly [selector: string, name: string | ((el: Element) => string)]> = [
  [".hero-page", "hero"],
  ["[data-feature-section]", "como-funciona"],
  ["[data-crescer-section]", "crescer"],
  [".site-footer", "rodape"],
  [".blog-intro", "blog/intro"],
  [".blog-library", "blog/biblioteca"],
  [".blog-content-section[id]", (el) => `blog/${el.id}`],
  [".blog-related", "blog/relacionados"],
  [".blog-sources", "blog/fontes"],
];

const FLUSH_EVERY_MS = 20_000;
const MIN_SECONDS = 1;

function currentZone(): string {
  const probe = window.innerHeight / 2;
  for (const [selector, name] of ZONES) {
    for (const el of document.querySelectorAll(selector)) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom >= probe) {
        const base = typeof name === "function" ? name(el) : name;
        if (base !== "como-funciona") return base;
        // the animated block is pinned while it scrolls: the active slide is what the visitor is looking at
        const slide = el.querySelector('[data-progress-slide][data-state="active"]')?.getAttribute("data-progress-slide");
        return slide ? `como-funciona/${slide}` : base;
      }
    }
  }
  return "outro";
}

function labelOf(el: Element): string {
  const raw = el.getAttribute("aria-label") || el.textContent || "";
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new Set<string>();
    const pending = new Map<string, number>();
    const depthsSent = new Set<number>();
    let zone = currentZone();
    let exitSent = false;

    const scrollPercent = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100;
    };

    const enter = () => {
      zone = currentZone();
      if (!seen.has(zone)) {
        seen.add(zone);
        track("section_view", { section: zone });
      }
    };
    enter();

    const flush = () => {
      for (const [section, seconds] of pending) {
        if (seconds >= MIN_SECONDS) track("section_time", { section, seconds: Math.round(seconds) });
      }
      pending.clear();
    };

    let last = performance.now();
    const tick = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === "visible") {
        enter();
        pending.set(zone, (pending.get(zone) ?? 0) + (now - last) / 1000);
      }
      last = now;
    }, 1000);
    const flushTimer = window.setInterval(flush, FLUSH_EVERY_MS);

    const onScroll = () => {
      const pct = scrollPercent();
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !depthsSent.has(mark)) {
          depthsSent.add(mark);
          track("scroll_depth", { percent: mark });
        }
      }
    };

    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      flush();
      if (!exitSent) {
        exitSent = true;
        track("exit", { section: currentZone(), scroll: scrollPercent() });
      }
    };
    const onShow = () => {
      if (document.visibilityState === "visible") {
        last = performance.now();
        exitSent = false;
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a, button, [role='button']") : null;
      if (!target) return;
      const section = currentZone();
      const label = labelOf(target);
      const href = target instanceof HTMLAnchorElement ? target.href : "";

      if (href.startsWith("https://wa.me/")) track("cta_whatsapp", { section, label });
      else if (href.startsWith("mailto:")) track("cta_email", { section });
      else if (href && new URL(href, location.href).origin !== location.origin) {
        track("link_external", { section, host: new URL(href).host });
      } else track("click", { section, label });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("pagehide", onHide);
    document.addEventListener("click", onClick, true);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(flushTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("click", onClick, true);
      flush();
    };
  }, [pathname]);

  return null;
}
