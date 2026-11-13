"use client";

import dynamic from "next/dynamic";

// The animated stage (framer-motion, lenis, photos) only arrives after hydration, so the first load stays light.
const JourneyStage = dynamic(() => import("./JourneyStage").then((module) => module.JourneyStage), {
  ssr: false,
  loading: () => <div className="otc-stage-placeholder" aria-hidden="true" />,
});

export function JourneyStageLoader() {
  return <JourneyStage />;
}
