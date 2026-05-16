import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const lowerItems = [
  {
    title: "CAOS",
    body: "Informações dispersas e processos manuais.",
  },
  {
    title: "ATRITO",
    body: "Perda de tempo, erros e retrabalho.",
  },
  {
    title: "SISTEMA",
    body: "Automação inteligente e padronização.",
  },
  {
    title: "ESCALA",
    body: "Operação previsível e crescimento contínuo.",
  },
] as const;

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

      <div className="crescer-lower-grid" aria-label="Evolução operacional">
        {lowerItems.map((item) => (
          <article className="crescer-lower-item" key={item.title}>
            <span aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
