import {
  CalendarCheck,
  CheckCircle2,
  FileText,
  Filter,
  UserRound,
} from "lucide-react";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";

const slide = featureSlides[3];

const pipelineStages = [
  {
    title: "Lead",
    subtitle: "capturado",
    marker: "lead-capturado",
    icon: <UserRound size={34} strokeWidth={1.65} />,
  },
  {
    title: "Qualificado",
    subtitle: "",
    marker: "qualificado",
    icon: <Filter size={34} strokeWidth={1.65} />,
  },
  {
    title: "Proposta",
    subtitle: "enviada",
    marker: "proposta-enviada",
    icon: <FileText size={34} strokeWidth={1.65} />,
  },
  {
    title: "Reunião",
    subtitle: "agendada",
    marker: "reuniao-agendada",
    icon: <CalendarCheck size={34} strokeWidth={1.65} />,
  },
  {
    title: "Negócio",
    subtitle: "ganho",
    marker: "negocio-ganho",
    icon: <CheckCircle2 size={36} strokeWidth={1.65} />,
  },
] as const;

export function SlideExecution() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--pipeline">
      <div className="pipeline-system">
        <div className="pipeline-line" aria-hidden="true">
          <span />
        </div>
        <div className="pipeline-noise" aria-hidden="true">
          {Array.from({ length: 44 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        {pipelineStages.map((stage, index) => (
          <article
            className={`pipeline-card pipeline-card--${index + 1}`}
            data-motion-card
            data-required-element={stage.marker}
            key={stage.marker}
          >
            <span className="pipeline-icon" aria-hidden="true">
              {stage.icon}
            </span>
            <strong>{stage.title}</strong>
            {stage.subtitle ? <small>{stage.subtitle}</small> : null}
            <span className="pipeline-node" aria-hidden="true" />
          </article>
        ))}
      </div>
    </FeatureSlideFrame>
  );
}
