import dynamic from "next/dynamic";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";
import { StagePlaceholder } from "./StagePlaceholder";

// Loaded after hydration so the pinned scroll section stays light on first load.
const ChatJourney = dynamic(() => import("./ChatJourney").then((module) => module.ChatJourney), {
  ssr: false,
  loading: () => <StagePlaceholder ratio="760 / 660" />,
});

const slide = featureSlides[2];

export function SlideConversation() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--conversation">
      <ChatJourney />
    </FeatureSlideFrame>
  );
}
