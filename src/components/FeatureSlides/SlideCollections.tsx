import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const CashFlow = dynamic(() => import("./CashFlow").then((module) => module.CashFlow), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="2.35 / 1" />,
});

const slide = featureSlides[3];

export function SlideCollections() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--collections">
      <CashFlow />
    </FeatureSlideFrame>
  );
}
