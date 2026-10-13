"use client";

import { useFeatureScroll } from "@/hooks/useFeatureScroll";
import { featureSlides } from "./data";
import { Intro } from "./Intro";
import { LeadFlow } from "./LeadFlow";
import { SlideCollections } from "./SlideCollections";
import { SlideConversation } from "./SlideConversation";
import { SlideHandoff } from "./SlideHandoff";
import { SlideOperation } from "./SlideOperation";
import { SlidePerformance } from "./SlidePerformance";
import { SlideRecovery } from "./SlideRecovery";

const slideComponents = [
  Intro,
  SlideRecovery,
  SlideConversation,
  SlideCollections,
  SlideHandoff,
  SlidePerformance,
  SlideOperation,
] as const;

export function FeatureSection() {
  const wrapperRef = useFeatureScroll();

  return (
    <section
      className="feature-section-wrapper"
      id="como-funciona"
      data-feature-section
      ref={wrapperRef}
      aria-label="Infraestrutura operacional de IA"
    >
      <div className="feature-sticky-container">
        <LeadFlow />
        <div className="feature-slide-progress" aria-hidden="true">
          {featureSlides.map((slide, index) => (
            <span data-progress-slide={slide.id} data-state={index === 0 ? "active" : "idle"} key={slide.id} />
          ))}
        </div>
        {slideComponents.map((Slide, index) => (
          <Slide key={featureSlides[index].id} />
        ))}
      </div>
    </section>
  );
}

