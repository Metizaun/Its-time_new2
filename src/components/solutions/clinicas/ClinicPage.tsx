import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Menu, MoveRight, UserRound } from "lucide-react";
import { AgentBotGlyph } from "@/components/FeatureSlides/AgentIcons";
import { clinicJourney, clinicLimits, clinicSegments, clinicSolution as copy } from "@/lib/solutions/clinicas";
import { whatsappLinkProps } from "@/lib/whatsapp";
import { HoursRing } from "./HoursRing";
import { JourneyStage, JourneyStepVisual } from "./JourneyStage";

const cta = () => whatsappLinkProps(copy.message);

const nav = [
  { label: "Como funciona", href: "#jornada" },
  { label: "Perguntas", href: "#perguntas" },
  { label: "Blog", href: "/blog" },
] as const;

export function ClinicPage() {
  return (
    <main className="cl-page">
      <Header />
      <Hero />
      <Journey />
      <Limits />
      <Segments />
      <Start />
      <Faq />
      <FinalCta />
    </main>
  );
}

function Header() {
  return (
    <header className="cl-header">
      <Link className="cl-brand" href="/" aria-label="Its Time: página inicial">
        <span className="cl-brand-mark" aria-hidden="true" />
        <span className="cl-brand-word">Its Time</span>
      </Link>
      <span className="cl-brand-scope" aria-hidden="true">
        / Clínicas
      </span>
      <nav className="cl-nav" aria-label="Navegação da página">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a className="cl-button cl-button--small" {...cta()}>
          Agendar demonstração
          <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </nav>
      <details className="cl-mobile-nav">
        <summary aria-label="Abrir menu">
          <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
        </summary>
        <nav aria-label="Menu">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a {...cta()}>Agendar demonstração</a>
        </nav>
      </details>
    </header>
  );
}

function Hero() {
  const [lead, highlight] = splitTitle(copy.title);
  return (
    <section className="cl-hero" aria-labelledby="cl-title">
      <div className="cl-hero-copy">
        <p className="cl-eyebrow">
          <span aria-hidden="true" />
          {copy.kicker}
        </p>
        <h1 id="cl-title">
          {lead} <span>{highlight}</span>
        </h1>
        <p className="cl-lede">{copy.lede}</p>
        <div className="cl-actions">
          <a className="cl-button" {...cta()}>
            Ver a IA na minha clínica
            <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <a className="cl-link" href="#jornada">
            Acompanhar a jornada do paciente
            <ChevronDown size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
        <ul className="cl-channels" aria-label="Canais atendidos">
          {["WhatsApp", "Instagram", "Site", "Messenger"].map((channel) => (
            <li key={channel}>{channel}</li>
          ))}
        </ul>
      </div>
      <HoursRing />
    </section>
  );
}

/** "A pergunta das 22h" → "consulta marcada": the second half of the title carries the brand gradient. */
function splitTitle(title: string) {
  const index = title.indexOf(" vira ");
  return index < 0 ? [title, ""] : [title.slice(0, index), title.slice(index + 1)];
}

function Journey() {
  return (
    <section className="cl-journey" id="jornada" aria-labelledby="cl-journey-title" data-journey>
      <div className="cl-journey-head">
        <p className="cl-kicker">A jornada do paciente</p>
        <h2 id="cl-journey-title">Do primeiro “oi” ao retorno, sem a conversa esfriar.</h2>
        <p>
          Role a página e acompanhe uma paciente de uma clínica de estética. É a mesma conversa que a sua recepção tem
          todo dia, só que agora ela continua quando a clínica fecha.
        </p>
      </div>

      <div className="cl-journey-grid">
        <ol className="cl-steps">
          <span className="cl-steps-rail" data-journey-progress aria-hidden="true" />
          {clinicJourney.map((step, index) => (
            <li key={step.id} className="cl-step" data-journey-step id={`jornada-${step.id}`}>
              <p className="cl-step-time">
                <span className="cl-step-dot" aria-hidden="true" />
                <time>{step.time}</time>
                <span>
                  {String(index + 1).padStart(2, "0")} · {step.label}
                </span>
              </p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <JourneyStepVisual step={index} />
            </li>
          ))}
        </ol>
        <JourneyStage count={clinicJourney.length} />
      </div>
    </section>
  );
}

function Limits() {
  return (
    <section className="cl-section cl-limits" aria-labelledby="cl-limits-title">
      <div className="cl-section-head">
        <p className="cl-kicker">Limites claros</p>
        <h2 id="cl-limits-title">A IA responde o que a clínica cadastrou. O resto vai para uma pessoa.</h2>
        <p>
          O medo de quem tem clínica é a IA inventar uma resposta ou deixar o paciente sem falar com ninguém. Por isso a
          regra é simples: você define o que ela pode responder e o que é da equipe. Quando passa a conversa, ela leva o
          histórico, e ninguém precisa perguntar tudo de novo.
        </p>
      </div>
      <div className="cl-limits-grid">
        <article className="cl-card">
          <h3>
            <span className="cl-card-icon" aria-hidden="true">
              <AgentBotGlyph />
            </span>
            A IA cuida
          </h3>
          <ul className="cl-list">
            {clinicLimits.ai.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
        <div className="cl-handoff" aria-hidden="true">
          <span className="cl-handoff-line" />
          <span className="cl-handoff-label">com o histórico</span>
          <MoveRight size={18} strokeWidth={2.2} />
        </div>
        <article className="cl-card">
          <h3>
            <span className="cl-card-icon cl-card-icon--team" aria-hidden="true">
              <UserRound size={18} strokeWidth={2.2} />
            </span>
            A equipe assume
          </h3>
          <ul className="cl-list cl-list--team">
            {clinicLimits.team.map((item) => (
              <li key={item}>
                <MoveRight size={16} strokeWidth={2.4} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function Segments() {
  return (
    <section className="cl-section cl-segments" aria-labelledby="cl-segments-title">
      <div className="cl-section-head">
        <p className="cl-kicker">Para cada tipo de clínica</p>
        <h2 id="cl-segments-title">A pergunta muda. O caminho até a agenda é o mesmo.</h2>
        <p>
          Estética, odontologia, dermatologia, fisioterapia, psicologia ou nutrição: cada clínica cadastra as respostas
          que fazem sentido para ela, e a IA usa essas respostas para levar o paciente até o horário marcado.
        </p>
      </div>
      <ul className="cl-segment-grid">
        {clinicSegments.map((segment) => (
          <li key={segment.name} className="cl-segment">
            <h3>{segment.name}</h3>
            <p className="cl-bubble">{segment.question}</p>
            <p className="cl-segment-path" aria-label="Caminho da conversa">
              <span>Resposta da clínica</span>
              <i aria-hidden="true" />
              <span>Horário marcado</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="cl-features">
        {copy.features.map((feature) => (
          <article key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Start() {
  const stepLinks: Record<number, { href: string; label: string }> = {
    0: { href: "/tutoriais/whatsapp-oficial", label: "Ver o tutorial do WhatsApp oficial" },
    2: { href: "/dev/documentacao/agenda", label: "Ver a documentação da Agenda Universal" },
  };
  return (
    <section className="cl-section cl-start" aria-labelledby="cl-start-title">
      <div className="cl-section-head">
        <p className="cl-kicker">Como começar</p>
        <h2 id="cl-start-title">Quatro passos até a IA atender os seus pacientes.</h2>
      </div>
      <ol className="cl-start-list">
        {copy.steps.map((step, index) => (
          <li key={step.title}>
            <span className="cl-start-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {stepLinks[index] ? (
              <Link className="cl-inline-link" href={stepLinks[index].href}>
                {stepLinks[index].label}
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="cl-reading" aria-labelledby="cl-reading-title">
        <h3 id="cl-reading-title">Para ler antes da demonstração</h3>
        <ul>
          {copy.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <span className="cl-reading-label">{link.label}</span>
                <span>{link.text}</span>
                <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="cl-section cl-faq" id="perguntas" aria-labelledby="cl-faq-title">
      <div className="cl-section-head">
        <p className="cl-kicker">Perguntas frequentes</p>
        <h2 id="cl-faq-title">O que as clínicas perguntam antes de começar.</h2>
      </div>
      <div className="cl-faq-list">
        {copy.faq.map((item) => (
          <details key={item.question}>
            <summary>
              <h3>{item.question}</h3>
              <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="cl-final" aria-labelledby="cl-final-title">
      <p className="cl-kicker">Demonstração</p>
      <h2 id="cl-final-title">Veja a IA respondendo os pacientes da sua clínica.</h2>
      <p>
        Na demonstração, montamos a conversa com os procedimentos e as regras da sua clínica e mostramos a agenda e o CRM
        funcionando. A mensagem no WhatsApp já vai pronta: é só completar e enviar.
      </p>
      <a className="cl-button cl-button--light" {...cta()}>
        Agendar demonstração pelo WhatsApp
        <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </a>
    </section>
  );
}
