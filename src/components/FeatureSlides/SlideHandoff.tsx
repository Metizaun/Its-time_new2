import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const HandoffMap = dynamic(() => import("./HandoffMap").then((module) => module.HandoffMap), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 640" />,
});

const slide = featureSlides[4];

export function SlideHandoff() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--handoff">
      <HandoffMap />
    </FeatureSlideFrame>
  );
}
