import { Box, ClipboardList, LockKeyhole, Zap } from "lucide-react";
import { featureSlides } from "./data";
import { FeatureSlideFrame, TechCard } from "./shared";

const slide = featureSlides[6];

const scaleCards = [
  {
    title: "Infraestrutura",
    subtitle: "escalável",
    marker: "infraestrutura-escalavel",
    className: "scale-card--infra",
    icon: <Box size={42} strokeWidth={1.45} />,
  },
  {
    title: "Dados seguros",
    subtitle: "e criptografados",
    marker: "dados-seguros",
    className: "scale-card--security",
    icon: <LockKeyhole size={42} strokeWidth={1.45} />,
  },
  {
    title: "Governança",
    subtitle: "e logs completos",
    marker: "governanca-logs",
    className: "scale-card--logs",
    icon: <ClipboardList size={42} strokeWidth={1.45} />,
  },
  {
    title: "Performance",
    subtitle: "em tempo real",
    marker: "performance-tempo-real",
    className: "scale-card--perf",
    icon: <Zap size={44} strokeWidth={1.55} />,
  },
] as const;

export function SlideScale() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--scale">
      <div className="scale-system">
        <div className="scale-cube-glow" aria-hidden="true" />
        <div className="scale-card-list">
          {scaleCards.map((card) => (
            <TechCard
              className={`scale-card ${card.className}`}
              icon={card.icon}
              key={card.marker}
              marker={card.marker}
              subtitle={card.subtitle}
              title={card.title}
            />
          ))}
        </div>
      </div>
    </FeatureSlideFrame>
  );
}

