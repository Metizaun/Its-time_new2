"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Client islands of the patient journey. The step texts are server HTML (they carry the SEO copy); these islands only
 * add the animated scene, which is loaded after hydration (ssr: false) so it never competes with the LCP.
 *
 * Wide screens with motion: one sticky stage follows the steps as they scroll by.
 * Phones and reduced motion: no pin; each step shows its own still of the scene.
 */
const JourneyScene = dynamic(() => import("./JourneyScene"), {
  ssr: false,
  loading: () => <div className="cl-scene-placeholder" aria-hidden="true" />,
});

type Mode = "pending" | "stage" | "stack";

const STAGE_QUERY = "(min-width: 981px) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(STAGE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useJourneyMode(): Mode {
  return useSyncExternalStore<Mode>(
    subscribe,
    () => (window.matchMedia(STAGE_QUERY).matches ? "stage" : "stack"),
    () => "pending",
  );
}

/** Sticky stage (desktop). Watches the server-rendered steps and shows the one crossing the middle of the screen. */
export function JourneyStage({ count }: { count: number }) {
  const mode = useJourneyMode();
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "stage") return;
    const section = rootRef.current?.closest<HTMLElement>("[data-journey]");
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-step]"));
    const rail = section.querySelector<HTMLElement>("[data-journey-progress]");

    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight * 0.52;
      let active = 0;
      steps.forEach((element, index) => {
        if (element.getBoundingClientRect().top <= middle) active = index;
      });
      if (active !== last) {
        last = active;
        setStep(active);
        steps.forEach((element, index) => {
          element.dataset.state = index === active ? "active" : index < active ? "done" : "idle";
        });
      }
      // The timeline fill is the patient's time passing: it follows the scroll continuously, not step by step.
      if (rail && steps.length) {
        const first = steps[0].getBoundingClientRect();
        const lastRect = steps[steps.length - 1].getBoundingClientRect();
        const span = lastRect.top - first.top || 1;
        const progress = Math.min(1, Math.max(0, (middle - first.top) / span));
        rail.style.setProperty("--progress", progress.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    section.dataset.mode = "stage";
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete section.dataset.mode;
      steps.forEach((element) => delete element.dataset.state);
    };
  }, [mode, count]);

  if (mode !== "stage") return <div ref={rootRef} className="cl-stage-slot" aria-hidden="true" />;

  return (
    <div ref={rootRef} className="cl-stage-slot">
      <div className="cl-stage-sticky">
        <JourneyScene step={step} />
      </div>
    </div>
  );
}

/** Still of one step (phones and reduced motion). Mounts the scene only when the step is close to the screen. */
export function JourneyStepVisual({ step }: { step: number }) {
  const mode = useJourneyMode();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (mode !== "stack" || near) return;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [mode, near]);

  if (mode === "stage") return null;

  return (
    <div ref={ref} className="cl-step-visual">
      {mode === "stack" && near ? <JourneyScene step={step} solo /> : <div className="cl-scene-placeholder" aria-hidden="true" />}
    </div>
  );
}
