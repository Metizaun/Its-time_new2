"use client";

import { useFeatureScroll } from "@/hooks/useFeatureScroll";
import { featureSlides } from "./data";
import { Intro } from "./Intro";
import { SlideCommercialIntel } from "./SlideCommercialIntel";
import { SlideExecution } from "./SlideExecution";
import { SlideMemory } from "./SlideMemory";
import { SlideMultiAgents } from "./SlideMultiAgents";
import { SlideOmnichannel } from "./SlideOmnichannel";
import { SlideResult } from "./SlideResult";
import { SlideScale } from "./SlideScale";

const slideComponents = [
  Intro,
  SlideMemory,
  SlideMultiAgents,
  SlideExecution,
  SlideOmnichannel,
  SlideCommercialIntel,
  SlideScale,
  SlideResult,
] as const;

export function FeatureSection() {
  const wrapperRef = useFeatureScroll();

  return (
    <section
      className="feature-section-wrapper"
      data-feature-section
      ref={wrapperRef}
      aria-label="Infraestrutura operacional de IA"
    >
      <div className="feature-sticky-container">
        <div className="feature-slide-progress" aria-hidden="true">
          {featureSlides.map((slide) => (
            <span data-progress-slide={slide.id} key={slide.id} />
          ))}
        </div>
        {slideComponents.map((Slide, index) => (
          <Slide key={featureSlides[index].id} />
        ))}
      </div>
    </section>
  );
}

