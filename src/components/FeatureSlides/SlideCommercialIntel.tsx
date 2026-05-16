import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { featureSlides } from "./data";
import { FeatureSlideFrame } from "./shared";

const slide = featureSlides[5];

export function SlideCommercialIntel() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--analytics">
      <div className="analytics-system">
        <article
          className="analytics-card analytics-card--conversion"
          data-motion-card
          data-required-element="conversao-pipeline"
        >
          <h3>Conversão de Pipeline</h3>
          <div className="analytics-value">
            26,7%
            <span>
              <ArrowUpRight size={18} />
              12%
            </span>
          </div>
          <div className="analytics-line-chart" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} style={{ "--bar-index": index } as CSSProperties} />
            ))}
          </div>
        </article>

        <article
          className="analytics-card analytics-card--source"
          data-motion-card
          data-required-element="origem-leads"
        >
          <h3>Origem de Leads</h3>
          <div className="analytics-source">
            <span className="analytics-donut" aria-hidden="true" />
            <ul>
              <li>
                <span className="source-dot source-dot--orange" />
                WhatsApp <strong>48%</strong>
              </li>
              <li>
                <span className="source-dot source-dot--amber" />
                Instagram <strong>21%</strong>
              </li>
              <li>
                <span className="source-dot source-dot--green" />
                Telegram <strong>15%</strong>
              </li>
              <li>
                <span className="source-dot source-dot--blue" />
                Site <strong>9%</strong>
              </li>
            </ul>
          </div>
        </article>

        <article
          className="analytics-card analytics-card--profit"
          data-motion-card
          data-required-element="lucro-gerado"
        >
          <h3>Lucro Gerado</h3>
          <div className="analytics-value">
            R$ 620.000
            <span>
              <ArrowUpRight size={18} />
              18%
            </span>
          </div>
          <div className="analytics-profit-line" aria-hidden="true" />
        </article>

        <div className="analytics-heatmap" data-required-element="heatmap-grid" aria-hidden="true">
          {Array.from({ length: 144 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
    </FeatureSlideFrame>
  );
}
