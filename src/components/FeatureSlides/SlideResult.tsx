import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { featureSlides } from "./data";
import { FeatureSlideFrame, OrbitRings, PixelField } from "./shared";

const slide = featureSlides[7];

const results = [
  { value: "+2.8M", label: "conversas automatizadas" },
  { value: "+380K", label: "reuniões agendadas" },
  { value: "+97%", label: "aumento de pipeline" },
] as const;

export function SlideResult() {
  return (
    <FeatureSlideFrame slide={slide} className="feature-slide--result-final" visualClassName="feature-visual--result">
      <div className="result-system" data-required-element="rede-consolidada">
        <PixelField dense />
        <OrbitRings count={7} />
        <div className="result-network" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="result-panel" data-required-element="resultados">
          <span>Resultados</span>
          <div className="result-metrics">
            {results.map((result) => (
              <article key={result.value}>
                <strong>{result.value}</strong>
                <small>{result.label}</small>
              </article>
            ))}
          </div>
          <motion.a
            className="result-cta"
            data-required-element="cta-final"
            href="#"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            Agendar demonstração
            <ArrowUpRight size={18} strokeWidth={2.2} />
          </motion.a>
        </div>
      </div>
    </FeatureSlideFrame>
  );
}

