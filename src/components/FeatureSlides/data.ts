export type FeatureSlideId =
  | "intro"
  | "recovery"
  | "conversation"
  | "collections"
  | "handoff"
  | "performance"
  | "operation";

export type FeatureSlideVariant =
  | "intro"
  | "recovery"
  | "conversation"
  | "collections"
  | "handoff"
  | "performance"
  | "operation";

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
    kicker: "01",
    headline: ["Inteligência que opera.", "Estratégia que escala."],
    body: "Do primeiro \"oi\" ao cliente que volta: a IA atende, vende, organiza, encaminha e cuida do relacionamento, tudo conectado e rodando sozinho.",
    variant: "intro",
    elements: ["intro-grid", "intro-glow", "journey-hub", "journey-now"],
  },
  {
    id: "recovery",
    kicker: "02",
    headline: ["Orçamento parado", "vira receita."],
    body: "A IA descobre por que o lead não avançou e reativa com a abordagem certa, no momento certo. Dinheiro parado volta para o seu caixa.",
    variant: "recovery",
    elements: ["recovery-pipeline", "recovery-hub", "recovery-panel"],
  },
  {
    id: "conversation",
    kicker: "03",
    headline: ["Cada conversa", "caminha para a venda."],
    body: "A IA atende, lê a receita, indica a armação certa, salva cada informação no CRM, agenda a visita e ainda faz o acompanhamento na hora certa.",
    variant: "conversation",
    elements: ["chat-crm", "chat-hub"],
  },
  {
    id: "collections",
    kicker: "04",
    headline: ["Dinheiro que entra", "sozinho."],
    body: "A Sofia lembra, cobra, acompanha e chama de volta quem sumiu. Você ganha tempo, o caixa enche e ninguém precisa se lembrar de fazer o acompanhamento.",
    variant: "collections",
    elements: ["cc-lanes", "cc-hub"],
  },
  {
    id: "handoff",
    kicker: "05",
    headline: ["A IA não trabalha sozinha.", "Ela faz parte da sua equipe."],
    body: "Ela atende no WhatsApp, Instagram e site, sabe a hora de chamar uma pessoa e leva o lead para a unidade certa, com resumo pronto. A equipe assume sem repetir nada e a IA continua ao lado.",
    variant: "handoff",
    elements: ["handoff-inbox", "handoff-units", "handoff-hub"],
  },
  {
    id: "performance",
    kicker: "06",
    headline: ["Veja de onde vem o dinheiro.", "E onde ele ainda está parado."],
    body: "Receita, conversão e desempenho de cada unidade em um só painel. E o que ficou parado vira a próxima oportunidade.",
    variant: "performance",
    elements: ["perf-kpis", "perf-funnel", "perf-units", "perf-opportunity"],
  },
  {
    id: "operation",
    kicker: "07",
    headline: ["Enquanto você cuida dos clientes,", "a Its Time cuida da operação."],
    body: "Atendimento, cobrança e acompanhamento rodando o dia inteiro, dentro e fora do horário da sua equipe. Você só entra quando a decisão é sua.",
    variant: "operation",
    elements: ["operation-clock", "operation-now", "operation-counters", "operation-timeline"],
  },
];
