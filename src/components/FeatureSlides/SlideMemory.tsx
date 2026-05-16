import {
  BarChart3,
  Building2,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import { featureSlides } from "./data";
import {
  ConnectorLines,
  CoreCube,
  FeatureSlideFrame,
  OrbitRings,
  TechCard,
} from "./shared";

const slide = featureSlides[1];

export function SlideMemory() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--context">
      <div className="context-system">
        <OrbitRings count={5} />
        <ConnectorLines variant="context" />
        <CoreCube className="context-core" />
        <TechCard
          className="context-card context-card--lead"
          icon={<Clock size={31} strokeWidth={1.7} />}
          title="Histórico"
          subtitle="do lead"
          marker="historico-lead"
        />
        <TechCard
          className="context-card context-card--company"
          icon={<Building2 size={33} strokeWidth={1.65} />}
          title="Contexto da"
          subtitle="empresa"
          marker="contexto-empresa"
        />
        <TechCard
          className="context-card context-card--talks"
          icon={<MessageCircle size={34} strokeWidth={1.65} />}
          title="Últimas"
          subtitle="conversas"
          marker="ultimas-conversas"
        />
        <TechCard
          className="context-card context-card--behavior"
          icon={<BarChart3 size={33} strokeWidth={1.65} />}
          title="Comportamento"
          subtitle="e engajamento"
          marker="comportamento-engajamento"
        />
        <TechCard
          className="context-card context-card--prefs"
          icon={<Heart size={34} strokeWidth={1.65} />}
          title="Preferências"
          subtitle="e interesses"
          marker="preferencias-interesses"
        />
      </div>
    </FeatureSlideFrame>
  );
}

