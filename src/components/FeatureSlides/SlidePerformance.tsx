import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const PerformancePanel = dynamic(() => import("./PerformancePanel").then((module) => module.PerformancePanel), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 660" />,
});

const slide = featureSlides[5];

export function SlidePerformance() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--performance">
      <PerformancePanel />
    </FeatureSlideFrame>
  );
}
