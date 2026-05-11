import Image from "next/image";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Camera,
  CheckCircle2,
  Mail,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

const navItems = ["Recursos", "Soluções", "Preços", "Login"];

const leftEvents = [
  {
    title: "Novo lead",
    subtitle: "Site - Landing page",
    icon: Sparkles,
    tone: "orange",
    className: "event-card-one",
  },
  {
    title: "Mensagem recebida",
    subtitle: "WhatsApp",
    icon: MessageCircle,
    tone: "green",
    className: "event-card-two",
  },
  {
    title: "Interação",
    subtitle: "Instagram",
    icon: Camera,
    tone: "pink",
    className: "event-card-three",
  },
  {
    title: "E-mail aberto",
    subtitle: "Sequência 2",
    icon: Mail,
    tone: "soft",
    className: "event-card-four",
  },
] as const;

const bottomMetrics = [
  { value: "+2.8M", label: "Conversas automatizadas" },
  { value: "+380K", label: "Reuniões agendadas" },
  { value: "+97%", label: "Aumento de pipeline" },
] as const;

const companyLogos = ["Constructec", "InnovaCorp", "Appsul", "DataFlow", "Solutionx"];

const agents = [
  { name: "Agente Qualificador", icon: Target },
  { name: "Agente Follow-up", icon: Workflow },
  { name: "Agente Nutrição", icon: Bot },
  { name: "Agente Reativação", icon: Sparkles },
] as const;

const particles = [
  [7, 13, 12, "black"],
  [18, 16, 5, "soft"],
  [32, 19, 12, "black"],
  [37, 15, 5, "soft"],
  [28, 25, 7, "orange"],
  [35, 31, 5, "coral"],
  [44, 34, 6, "orange"],
  [40, 45, 4, "soft"],
  [48, 38, 4, "orange"],
  [52, 55, 5, "coral"],
  [91, 14, 4, "coral"],
  [94, 19, 4, "orange"],
  [93, 58, 9, "orange"],
  [97, 63, 5, "black"],
  [87, 87, 7, "orange"],
  [91, 89, 8, "black"],
  [95, 91, 11, "orange"],
  [82, 91, 5, "soft"],
  [77, 86, 8, "coral"],
  [12, 92, 7, "orange"],
  [18, 94, 4, "black"],
] as const;

export default function Home() {
  return (
    <main className="hero-page">
      <Image
        className="hero-background"
        src="/assets/hero/background.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />

      <div className="ambient-gradient" aria-hidden="true" />
      <div className="particle-field" aria-hidden="true">
        {particles.map(([left, top, size, tone], index) => (
          <span
            className={`particle particle-${tone}`}
            key={`${left}-${top}-${index}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${index * 0.45}s`,
            }}
          />
        ))}
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Síntese">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand-word">SÍNTESE</span>
        </a>

        <div className="brand-divider" aria-hidden="true" />
        <p className="brand-tagline">IA QUE ORGANIZA. ESTRATÉGIA QUE MULTIPLICA.</p>

        <nav className="main-nav" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
          <a className="demo-button demo-button-header" href="#">
            Agendar Demo
            <ArrowUpRight size={17} strokeWidth={2.2} />
          </a>
        </nav>
      </header>

      <section className="hero-grid" aria-label="Automacao de SDR com IA">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            AUTOMAÇÃO DE SDR COM IA
          </div>

          <h1>
            IA não
            <br />
            responde leads.
            <br />
            <span>Direção responde.</span>
          </h1>

          <p className="hero-subtitle">
            Agentes de IA, funis inteligentes e automações que constroem
            pipeline, geram reuniões e multiplicam resultados.
          </p>

          <div className="hero-actions">
            <a className="primary-cta" href="#">
              Agendar uma demonstração
              <ArrowUpRight size={18} strokeWidth={2.2} />
            </a>
            <a className="secondary-cta" href="#">
              <Play size={15} fill="currentColor" strokeWidth={0} />
              Ver como funciona
            </a>
          </div>

          <div className="hero-metrics" aria-label="Metricas de resultado">
            {bottomMetrics.map((metric) => (
              <div className="metric" key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-system">
          <svg
            className="connection-lines left-lines"
            viewBox="0 0 500 520"
            fill="none"
            aria-hidden="true"
          >
            <path d="M30 90 C150 88 165 150 285 170 C345 180 380 184 470 205" />
            <path d="M55 190 C175 192 186 238 300 248 C360 254 394 270 472 305" />
            <path d="M15 305 C130 305 175 350 292 360 C360 367 404 390 470 430" />
            <path d="M130 30 C165 130 136 315 178 505" />
          </svg>

          <svg
            className="connection-lines right-lines"
            viewBox="0 0 600 560"
            fill="none"
            aria-hidden="true"
          >
            <path d="M30 120 C150 110 155 66 270 70 C365 73 410 92 560 82" />
            <path d="M48 235 C150 214 198 248 290 236 C390 224 430 205 565 232" />
            <path d="M35 360 C175 342 170 438 320 426 C410 418 460 445 570 486" />
          </svg>

          <div className="event-stack" aria-label="Eventos de entrada">
            {leftEvents.map((event, index) => {
              const Icon = event.icon;

              return (
                <article
                  className={`event-card ${event.className}`}
                  key={event.title}
                  style={{ animationDelay: `${index * 0.8}s` }}
                >
                  <span className={`event-icon event-icon-${event.tone}`}>
                    <Icon size={22} strokeWidth={2.35} />
                  </span>
                  <span>
                    <strong>{event.title}</strong>
                    <small>{event.subtitle}</small>
                  </span>
                </article>
              );
            })}
          </div>

          <div className="phone-stage">
            <Image
              className="phone-image"
              src="/assets/hero/mockup-cutout.png"
              alt="Mockup de conversa com agente SDR IA"
              width={622}
              height={1203}
              priority
              sizes="(max-width: 768px) 78vw, 36vw"
            />
            <div className="phone-shadow" aria-hidden="true" />
          </div>

          <div className="dashboard-stack" aria-label="Dashboard comercial">
            <div className="dashboard-grid">
              <article className="dashboard-card funnel-card float-card">
                <CardHeading title="Funil Inteligente" subtitle="Pipeline ativo" />
                <div className="bar-chart" aria-hidden="true">
                  {[72, 60, 78, 54, 82, 42].map((height, index) => (
                    <span
                      key={height + index}
                      style={{ height: `${height}%` }}
                      className={index < 4 ? "accent-bar" : "dark-bar"}
                    />
                  ))}
                </div>
                <div className="chart-base" aria-hidden="true" />
              </article>

              <article className="dashboard-card metric-card float-card">
                <CardHeading title="Reuniões Agendadas" subtitle="Esta semana" />
                <div className="value-row">
                  <strong>32</strong>
                  <span>+24%</span>
                </div>
                <small>vs semana anterior</small>
                <TrendLine />
              </article>

              <article className="dashboard-card metric-card float-card">
                <CardHeading title="Pipeline Gerado" subtitle="Este mês" />
                <div className="value-row wide-value">
                  <strong>R$ 620.000</strong>
                  <span>+18%</span>
                </div>
                <small>vs mês anterior</small>
                <TrendLine />
              </article>

              <article className="dashboard-card metric-card float-card">
                <CardHeading title="Taxa de Conversão" subtitle="Qualificados -> Reunião" />
                <div className="value-row">
                  <strong>26,7%</strong>
                  <span>+12%</span>
                </div>
                <small>vs mês anterior</small>
                <DotStrip />
              </article>
            </div>

            <article className="dashboard-card agents-card float-card">
              <CardHeading title="Automações Ativas" subtitle="Agentes trabalhando 24/7" />
              <div className="agent-list">
                {agents.map((agent) => {
                  const Icon = agent.icon;

                  return (
                    <div className="agent-row" key={agent.name}>
                      <span className="agent-icon">
                        <Icon size={13} strokeWidth={2.4} />
                      </span>
                      <strong>{agent.name}</strong>
                      <small>Ativo</small>
                    </div>
                  );
                })}
              </div>
              <div className="agent-matrix" aria-hidden="true">
                {Array.from({ length: 70 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
            </article>

            <div className="spark-card" aria-hidden="true">
              <Sparkles size={40} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </section>

      <section className="trusted-strip" aria-label="Empresas que escalam com a Síntese">
        <p>EMPRESAS QUE ESCALAM COM A SÍNTESE</p>
        <div className="company-row">
          {companyLogos.map((logo, index) => (
            <span key={logo}>
              {index % 2 === 0 ? (
                <BarChart3 size={28} strokeWidth={2.4} />
              ) : (
                <CheckCircle2 size={28} strokeWidth={2.4} />
              )}
              {logo}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

function CardHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="card-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function TrendLine() {
  return (
    <svg className="trend-line" viewBox="0 0 210 44" fill="none" aria-hidden="true">
      <path
        d="M2 31 C18 20 31 33 47 28 C62 23 75 31 90 24 C106 16 121 34 137 22 C151 11 166 12 181 18 C193 23 201 19 208 11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotStrip() {
  return (
    <div className="dot-strip" aria-hidden="true">
      {Array.from({ length: 78 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}
