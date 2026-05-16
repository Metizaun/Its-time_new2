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
        const cards = gsap.utils.toArray<HTMLElement>("[data-motion-card]", wrapperElement);
        const linePaths = gsap.utils.toArray<SVGPathElement>(".feature-line-path", wrapperElement);

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

        gsap.set(cards, {
          autoAlpha: 0,
          y: 24,
        });

        linePaths.forEach((path) => {
          const length = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
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

        slides.forEach((slide, index) => {
          const segment = index;
          const slideCards = slide.querySelectorAll("[data-motion-card]");
          const slideLines = slide.querySelectorAll(".feature-line-path");
          const slidePixels = slide.querySelectorAll(".feature-pixel");

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

          if (slideCards.length > 0) {
            timeline.fromTo(
              slideCards,
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, duration: 0.55, stagger: 0.07, y: 0 },
              segment + 0.06,
            );
          }

          if (slideLines.length > 0) {
            timeline.to(
              slideLines,
              { duration: 0.7, strokeDashoffset: 0, stagger: 0.04 },
              segment + 0.18,
            );
          }

          if (slidePixels.length > 0) {
            timeline.fromTo(
              slidePixels,
              { autoAlpha: 0, scale: 0.7 },
              { autoAlpha: 1, duration: 0.5, scale: 1, stagger: 0.01 },
              segment + 0.12,
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
