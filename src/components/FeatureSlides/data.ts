export type FeatureSlideId =
  | "intro"
  | "memory"
  | "multiagents"
  | "execution"
  | "omnichannel"
  | "commercial-intel"
  | "scale"
  | "result";

export type FeatureSlideVariant =
  | "intro"
  | "context"
  | "agents"
  | "pipeline"
  | "channels"
  | "analytics"
  | "scale"
  | "result";

export type FeatureSlide = {
  id: FeatureSlideId;
  kicker: string;
  headline: string[];
  body: string;
  variant: FeatureSlideVariant;
  backgroundSrc?: string;
  elements: string[];
};

export const featureSlides: FeatureSlide[] = [
  {
    id: "intro",
    kicker: "FEATURES",
    headline: ["Inteligência que opera.", "Estratégia que escala."],
    body: "Uma infraestrutura de automação e IA construída para vender mais, com menos esforço e com mais previsibilidade.",
    variant: "intro",
    elements: ["intro-grid", "intro-particles", "intro-glow"],
  },
  {
    id: "memory",
    kicker: "02",
    headline: ["Memória contextual", "que entende tudo"],
    body: "A IA lembra, interpreta e conecta informações para personalizar cada interação e aumentar as chances de conversão.",
    variant: "context",
    backgroundSrc:
      "/assets/Scroll_slide/Referencias/REFERENCIA-FEATURE 2 REAL - BACKGROUND.png",
    elements: [
      "historico-lead",
      "contexto-empresa",
      "ultimas-conversas",
      "comportamento-engajamento",
      "preferencias-interesses",
      "core-cube",
    ],
  },
  {
    id: "multiagents",
    kicker: "03",
    headline: ["Multiagentes", "especializados"],
    body: "Agentes de IA que assumem funções, conversam, qualificam, agendam e conduzem negociações como um time de alta performance.",
    variant: "agents",
    elements: [
      "agente-sdr",
      "agente-qualificador",
      "agente-follow-up",
      "agente-nutricao",
      "agente-reativacao",
      "agente-closer",
      "core-cube",
    ],
  },
  {
    id: "execution",
    kicker: "04",
    headline: ["A IA não só responde.", "Ela movimenta a operação."],
    body: "Ações automáticas atualizam etapas, enviam propostas, agendam reuniões e mantêm o funil sempre em movimento.",
    variant: "pipeline",
    elements: [
      "lead-capturado",
      "qualificado",
      "proposta-enviada",
      "reuniao-agendada",
      "negocio-ganho",
    ],
  },
  {
    id: "omnichannel",
    kicker: "05",
    headline: ["WhatsApp.", "Instagram.", "Site.", "Tudo conectado."],
    body: "Todos os canais convergem para um núcleo operacional único, centralizando conversas, dados e oportunidades.",
    variant: "channels",
    backgroundSrc: "/assets/Scroll_slide/Referencias/Referencia_slide-4-background.png",
    elements: ["whatsapp", "instagram", "telegram", "site", "core-cube"],
  },
  {
    id: "commercial-intel",
    kicker: "06",
    headline: ["Conversas viram dados.", "Dados viram direção."],
    body: "Dashboards inteligentes revelam conversão, origem, lucro e desempenho por agente, campanha ou canal.",
    variant: "analytics",
    backgroundSrc: "/assets/Scroll_slide/Referencias/Referencia_slide-5-background.png",
    elements: ["conversao-pipeline", "origem-leads", "lucro-gerado", "heatmap-grid"],
  },
  {
    id: "scale",
    kicker: "07",
    headline: ["Crescimento sem", "caos operacional."],
    body: "Uma arquitetura sólida garante performance, rastreabilidade e governança para escalar com confiança.",
    variant: "scale",
    backgroundSrc: "/assets/Scroll_slide/Referencias/Referencia_slide-6-background.png",
    elements: [
      "infraestrutura-escalavel",
      "dados-seguros",
      "governanca-logs",
      "performance-tempo-real",
    ],
  },
  {
    id: "result",
    kicker: "RESULTADO",
    headline: ["Operação organizada.", "Crescimento previsível."],
    body: "A infraestrutura inteira estabiliza em um sistema comercial autônomo, conectado e pronto para transformar previsibilidade em escala.",
    variant: "result",
    backgroundSrc: "/assets/Scroll_slide/Referencias/Referencia_slide-Background..png",
    elements: ["rede-consolidada", "resultados", "cta-final"],
  },
];
