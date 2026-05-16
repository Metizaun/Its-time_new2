import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function CrescerSection() {
  return (
    <section
      className="crescer-section"
      data-crescer-section
      aria-label="Crescer com estrutura operacional"
    >
      <Image
        className="crescer-background"
        src="/assets/Crescer/Crescer-Background.png"
        alt=""
        fill
        sizes="100vw"
      />

      <div className="crescer-background-soften" aria-hidden="true" />
      <div className="crescer-editorial-mark" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="crescer-copy">
        <p className="crescer-kicker">Como a Its Time faz sua empresa crescer</p>

        <h2 className="crescer-title" data-crescer-headline>
          Crescer <span>errado</span> pode custar caro
        </h2>

        <p className="crescer-subtext">
          Processos frágeis não quebram de repente. Eles desgastam resultados,
          aumentam retrabalho e transformam crescimento em sobrecarga. A Its Time
          reorganiza a operação antes que o caos vire custo invisível.
        </p>

        <a className="crescer-cta" href="#">
          Agendar demonstração
          <ArrowUpRight size={18} strokeWidth={2.2} />
        </a>
      </div>
    </section>
  );
}
