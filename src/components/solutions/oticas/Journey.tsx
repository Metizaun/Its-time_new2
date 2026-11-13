import { opticsJourney } from "@/lib/solutions/oticas";
import { AxisBadge } from "./glyphs";
import { JourneyStageLoader } from "./JourneyStageLoader";

/**
 * The customer's path, told by scroll. The text of every step is rendered on the server (it is the page's
 * content); the animated stage is loaded after hydration and either sits sticky beside the steps (desktop) or
 * drops one scene into each step's slot (≤ 980 px). With reduced motion the scenes show their final state.
 */
export function Journey() {
  return (
    <section className="otc-journey" id="jornada" aria-labelledby="otc-journey-title" data-otc-journey>
      <div className="otc-journey-grid" aria-hidden="true" />
      <header className="otc-journey-head">
        <span className="otc-kicker">A jornada do cliente</span>
        <h2 id="otc-journey-title">
          Da pergunta de preço <span>à venda no balcão.</span>
        </h2>
        <p>
          Uma cliente escreve às 22h12, depois que a loja fechou. Role a página e acompanhe a conversa e a ficha dela no
          CRM, passo a passo.
        </p>
      </header>

      <div className="otc-journey-body">
        <ol className="otc-steps">
          {opticsJourney.map((step, index) => (
            <li className="otc-step" key={step.id} data-otc-step={index} data-active={index === 0}>
              <div className="otc-step-copy">
                <div className="otc-step-meta">
                  <AxisBadge step={index} />
                  <span>
                    <b>{String(index + 1).padStart(2, "0")}</b> {step.label}
                  </span>
                  <time>{step.when}</time>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <p className="otc-step-saved">
                  <span>Salvo na ficha</span> {step.saved.field}: {step.saved.value}
                </p>
              </div>
              {/* ≤ 980 px: this step's scene is mounted here */}
              <div className="otc-step-slot" data-otc-slot={index} data-board={step.id === "lojas"} />
            </li>
          ))}
        </ol>

        <div className="otc-stage-column">
          <JourneyStageLoader />
        </div>
      </div>
    </section>
  );
}
