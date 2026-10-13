"use client";

import { useEffect, useRef } from "react";

export function useFeatureScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const wrapperElement: HTMLDivElement = wrapper;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const usesCompactFlow = window.matchMedia("(max-width: 980px)").matches;

    if (prefersReducedMotion) {
      wrapperElement.dataset.reducedMotion = "true";
      return;
    }

    if (usesCompactFlow) {
      wrapperElement.dataset.compactFlow = "true";
      return;
    }

    let cleanup = () => {};
    let cancelled = false;

    async function setupScroll() {
      const [{ gsap }, { ScrollTrigger }, LenisModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const Lenis = LenisModule.default;
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.16,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      let animationFrame = 0;

      const raf = (time: number) => {
        lenis.raf(time);
        ScrollTrigger.update();
        animationFrame = requestAnimationFrame(raf);
      };

      animationFrame = requestAnimationFrame(raf);

      const context = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-feature-slide]", wrapperElement);
        const bars = gsap.utils.toArray<HTMLElement>("[data-progress-slide]", wrapperElement);

        // The side bar follows the timeline playhead (already smoothed by scrub), so it changes together with the crossfade.
        let activeBar = -1;
        const paintBars = (time: number) => {
          const active = Math.min(slides.length - 1, Math.max(0, Math.floor(time - 0.1)));
          if (active === activeBar) {
            return;
          }
          activeBar = active;
          bars.forEach((bar, index) => {
            bar.dataset.state = index === active ? "active" : index < active ? "done" : "idle";
          });
        };

        gsap.set(slides, {
          autoAlpha: 0,
          scale: 0.985,
          yPercent: 2,
          transformOrigin: "50% 50%",
        });

        gsap.set(slides[0], {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapperElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        });

        timeline.eventCallback("onUpdate", () => paintBars(timeline.time()));
        paintBars(0);

        slides.forEach((slide, index) => {
          const segment = index;
          if (index > 0) {
            timeline.to(
              slides[index - 1],
              {
                autoAlpha: 0,
                duration: 0.45,
                scale: 1.012,
                yPercent: -1.8,
              },
              segment - 0.14,
            );

            timeline.fromTo(
              slide,
              {
                autoAlpha: 0,
                scale: 0.985,
                yPercent: 2,
              },
              {
                autoAlpha: 1,
                duration: 0.55,
                scale: 1,
                yPercent: 0,
              },
              segment,
            );
          }
        });

        timeline.to(slides[slides.length - 1], { duration: 0.7, scale: 1, autoAlpha: 1 });
      }, wrapperElement);

      ScrollTrigger.refresh();

      cleanup = () => {
        context.revert();
        cancelAnimationFrame(animationFrame);
        lenis.destroy();
      };
    }

    void setupScroll();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return wrapperRef;
}
