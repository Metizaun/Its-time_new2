import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const CustomerJourney = dynamic(() => import("./CustomerJourney").then((module) => module.CustomerJourney), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 640" />,
});

const slide = featureSlides[0];

export function Intro() {
  return (
    <FeatureSlideFrame
      slide={slide}
      className="feature-slide--center"
      visualClassName="feature-visual--intro"
      background={<div className="intro-glow" data-required-element="intro-glow" aria-hidden="true" />}
    >
      <div className="intro-system" data-required-element="intro-grid">
        <CustomerJourney />
      </div>
    </FeatureSlideFrame>
  );
}
