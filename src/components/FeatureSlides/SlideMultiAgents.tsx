import {
  Bot,
  Handshake,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Workflow,
} from "lucide-react";
import { featureSlides } from "./data";
import {
  ConnectorLines,
  CoreCube,
  FeatureSlideFrame,
  OrbitRings,
  PixelField,
  TechCard,
} from "./shared";

const slide = featureSlides[2];

const agentCards = [
  {
    className: "agent-card--sdr",
    title: "Agente SDR",
    marker: "agente-sdr",
    icon: <UserRound size={30} strokeWidth={1.7} />,
  },
  {
    className: "agent-card--qualifier",
    title: "Agente Qualificador",
    marker: "agente-qualificador",
    icon: <Target size={30} strokeWidth={1.7} />,
  },
  {
    className: "agent-card--follow",
    title: "Agente Follow-up",
    marker: "agente-follow-up",
    icon: <Workflow size={30} strokeWidth={1.7} />,
  },
  {
    className: "agent-card--nutrition",
    title: "Agente Nutrição",
    marker: "agente-nutricao",
    icon: <ShieldCheck size={30} strokeWidth={1.7} />,
  },
  {
    className: "agent-card--reactivation",
    title: "Agente Reativação",
    marker: "agente-reativacao",
    icon: <RotateCcw size={30} strokeWidth={1.7} />,
  },
  {
    className: "agent-card--closer",
    title: "Agente Closer",
    marker: "agente-closer",
    icon: <Handshake size={30} strokeWidth={1.7} />,
  },
] as const;

export function SlideMultiAgents() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--agents">
      <div className="agent-system">
        <PixelField />
        <OrbitRings count={6} />
        <ConnectorLines variant="radial" />
        <CoreCube className="agent-core" />
        <div className="agent-core-badge" aria-hidden="true">
          <Bot size={16} />
          <Sparkles size={15} />
        </div>
        {agentCards.map((agent) => (
          <TechCard
            className={`agent-card ${agent.className}`}
            icon={agent.icon}
            key={agent.marker}
            marker={agent.marker}
            online
            title={agent.title}
          />
        ))}
      </div>
    </FeatureSlideFrame>
  );
}

