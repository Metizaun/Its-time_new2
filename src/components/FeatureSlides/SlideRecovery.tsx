import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const RevenueRecovery = dynamic(() => import("./RevenueRecovery").then((module) => module.RevenueRecovery), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 660" />,
});

const slide = featureSlides[1];

export function SlideRecovery() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--recovery">
      <RevenueRecovery />
    </FeatureSlideFrame>
  );
}
