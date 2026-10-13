import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const OperationDay = dynamic(() => import("./OperationDay").then((module) => module.OperationDay), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 640" />,
});

const slide = featureSlides[6];

export function SlideOperation() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--operation">
      <OperationDay />
    </FeatureSlideFrame>
  );
}
