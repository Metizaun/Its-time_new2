import { AgentEcosystem } from "./AgentEcosystem";
import { featureSlides } from "./data";
import { FeatureSlideFrame, PixelField } from "./shared";

const slide = featureSlides[0];

export function Intro() {
  return (
    <FeatureSlideFrame slide={slide} className="feature-slide--center" visualClassName="feature-visual--intro">
      <div className="intro-system" data-required-element="intro-grid">
        <PixelField dense />
        <div className="intro-glow" data-required-element="intro-glow" aria-hidden="true" />
        <div className="intro-grid-lines" aria-hidden="true" />
        <AgentEcosystem />
      </div>
    </FeatureSlideFrame>
  );
}
