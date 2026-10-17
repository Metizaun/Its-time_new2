import { editorialText } from "./blog-editorial";

export type BlogBlock =
  | {
      type: "text";
      id: string;
      title: string;
      paragraphs: string[];
      subsections?: { title: string; paragraphs: string[] }[];
    }
  | { type: "checklist"; id: string; title: string; items: string[] }
  | {
      type: "steps";
      id: string;
      title: string;
      items: { title: string; text: string }[];
    }
  | { type: "quote"; text: string; caption: string }
  | { type: "cta"; title: string; text: string; label: string }
  | ({ type: "image" } & BlogCover)
  | {
      type: "table";
      id: string;
      title: string;
      columns: string[];
      rows: string[][];
      caption?: string;
    }
  | {
      type: "callout";
      title: string;
      text: string;
      tone?: "note" | "attention";
    }
  | {
      type: "verdict";
      id: string;
      title: string;
      label: string;
      price?: string;
      pros: string[];
      cons: string[];
      recommendation: string;
    }
  | { type: "related"; title?: string; slugs: string[] }
  | {
      type: "faq";
      id: string;
      title: string;
      items: { question: string; answer: string }[];
    };

/** Foto do artigo: `src` e um caminho do proprio site (public/blog/<slug>/...) ou https. */
export type BlogCover = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover";
};

export type BlogAuthor = {
  name: string;
  role?: string;
  bio?: string;
  url?: string;
  kind?: "Person" | "Organization";
};
export const BLOG_ARCHETYPES = [
  "noticia",
  "explicador",
  "analise",
  "guia-ofertas",
  "guia-pratico",
] as const;

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorProfile?: BlogAuthor;
  updated?: string;
  archetype?: (typeof BLOG_ARCHETYPES)[number];
  tags?: string[];
  relatedSlugs?: string[];
  sources?: { label: string; url: string; note?: string }[];
  editorialNote?: string;
  finalCta?: { title: string; text: string; label: string };
  art: "conversation" | "journey" | "schedule";
  takeaway: string;
  /** Foto de capa (listagem, destaque, topo do artigo e compartilhamento). Sem ela, vale a `art` em CSS. */
  cover?: BlogCover;
  blocks: BlogBlock[];
};

// Conteúdo editorial local: novas entradas reutilizam os mesmos blocos e rotas.
export const posts: BlogPost[] = [
  {
    slug: "como-transformar-conversas-em-vendas",
    title: "Como conduzir uma conversa do primeiro contato ao encaminhamento",
    excerpt:
      "Defina o que registrar no CRM, qual próximo passo oferecer e quando passar o atendimento para a equipe. Veja uma estrutura de jornada para aplicar na sua operação.",
    category: "Estratégia comercial",
    date: "2026-10-15",
    author: "Equipe Its Time",
    authorProfile: {
      name: "Equipe Its Time",
      kind: "Organization",
      role: "Conteúdo de produto e operação comercial",
      bio: "Conteúdo institucional sobre atendimento, CRM e jornadas comerciais com a Its Time.",
      url: "/",
    },
    updated: "2026-10-16",
    archetype: "guia-pratico",
    tags: ["crm", "atendimento", "acompanhamento"],
    relatedSlugs: ["acompanhamento-de-orcamentos", "agendamento-com-ia"],
    editorialNote:
      "Este guia propõe uma estrutura de operação. As funções citadas estão apresentadas na demonstração do produto; os critérios de atendimento devem ser definidos pelo seu negócio.",
    sources: [
      {
        label: "Its Time — demonstração das jornadas de atendimento e operação",
        url: "/#como-funciona",
        note: "Referência de produto para CRM, agenda, acompanhamento e encaminhamento citados neste guia.",
      },
    ],
    finalCta: {
      title: "Veja como conectar a conversa à sua operação.",
      text: "Traga uma jornada de atendimento do seu negócio para conhecer o fluxo de CRM e encaminhamento na Its Time.",
      label: "Ver o fluxo em uma demonstração",
    },
    art: "conversation",
    takeaway:
      "Uma boa conversa tem contexto, uma próxima ação e alguém responsável por dar continuidade.",
    blocks: [
      {
        type: "text",
        id: "conversa-com-direcao",
        title: "Atender é o começo. Dar direção é o próximo passo.",
        paragraphs: [
          "Para conduzir um atendimento, registre a necessidade do cliente no CRM, defina a próxima ação e estabeleça o critério de encaminhamento para a equipe. Esses três elementos permitem retomar a conversa com contexto e acompanhar seu avanço.",
          "A [demonstração da Its Time](/#como-funciona) apresenta atendimento, organização no CRM, agenda e passagem para a equipe. A estrutura abaixo é uma proposta de uso dessas funções: ajuste perguntas e critérios ao serviço que sua empresa oferece.",
        ],
        subsections: [
          {
            title: "O que registrar antes de avançar",
            paragraphs: [
              "Registre o serviço ou produto de interesse, a dúvida que ainda precisa de resposta e o próximo passo combinado. Na passagem para outra pessoa, inclua o motivo do encaminhamento e o que já foi tratado.",
            ],
          },
        ],
      },
      {
        type: "image",
        src: "/blog/editorial/jornada-comercial.svg",
        alt: "Fluxo em quatro etapas: contato, contexto no CRM, próxima ação e encaminhamento para a equipe.",
        caption:
          "Uma proposta de fluxo: cada passagem leva o contexto necessário para o próximo atendimento.",
        credit: "Its Time — diagrama editorial",
        width: 1200,
        height: 400,
        fit: "contain",
      },
      {
        type: "steps",
        id: "jornada-na-pratica",
        title: "Uma jornada simples, do contato à decisão.",
        items: [
          {
            title: "Entenda antes de oferecer",
            text: "Identifique o que o cliente procura e qual informação ajuda a conversa a avançar. Perguntas curtas e relevantes dão contexto ao atendimento.",
          },
          {
            title: "Transforme contexto em organização",
            text: "Registre a necessidade e a etapa da conversa no CRM. Assim, a equipe consegue retomar o atendimento sem pedir tudo de novo.",
          },
          {
            title: "Combine uma próxima ação",
            text: "Apresente o próximo passo com clareza: escolher um horário, avaliar um orçamento ou conversar com um especialista.",
          },
          {
            title: "Continue no momento adequado",
            text: "Configure o acompanhamento conforme o evento, o status ou o tempo na etapa. Considere também a última mensagem para manter a conversa relevante.",
          },
        ],
      },
      {
        type: "table",
        id: "responsabilidade-por-etapa",
        title: "O que precisa acompanhar cada etapa",
        columns: ["Situação", "Informação no CRM", "Próxima ação"],
        rows: [
          [
            "Primeiro contato",
            "Necessidade e serviço de interesse",
            "Esclarecer a dúvida inicial",
          ],
          [
            "Cliente avaliando uma opção",
            "Condição discutida e dúvida pendente",
            "Combinar a continuidade",
          ],
          [
            "Pedido de agendamento",
            "Serviço e unidade adequada",
            "Consultar a agenda",
          ],
          [
            "Negociação ou exceção",
            "Histórico e motivo do encaminhamento",
            "Passar para a equipe responsável",
          ],
        ],
        caption:
          "Estrutura sugerida para organizar a jornada; os nomes das etapas dependem do seu processo.",
      },
      {
        type: "callout",
        title: "O que esse fluxo não garante",
        text: "Organizar a jornada não garante uma venda nem define sozinho o melhor momento de contato. Disponibilidade, condições comerciais, interesse do cliente e atuação da equipe continuam fazendo parte da decisão.",
        tone: "attention",
      },
      {
        type: "cta",
        title: "Como isso funcionaria no seu negócio?",
        text: "Converse com a Its Time sobre sua jornada de atendimento e veja uma demonstração aplicada à sua operação.",
        label: "Quero ver na prática",
      },
      {
        type: "text",
        id: "ia-e-equipe",
        title: "IA e equipe, na mesma conversa.",
        paragraphs: [
          "A automação pode organizar as primeiras informações e conduzir etapas da jornada. A equipe entra quando o atendimento pede negociação, análise ou uma decisão específica. Para essa passagem funcionar, o contexto precisa acompanhar o cliente.",
          "Na Its Time, atendimento, CRM, agenda e encaminhamento fazem parte da operação. Defina quais situações a IA pode conduzir e quais devem chegar à sua equipe, respeitando as regras do seu negócio.",
        ],
      },
      {
        type: "checklist",
        id: "por-onde-comecar",
        title: "Seu primeiro passo pode ser pequeno.",
        items: [
          "Escolha uma jornada frequente, como pedido de orçamento ou agendamento.",
          "Mapeie as informações necessárias para conduzir esse atendimento.",
          "Defina quando encaminhar a conversa para uma pessoa da equipe.",
          "Estabeleça a próxima ação em cada etapa do CRM.",
          "Acompanhe agendamentos e avanços de etapa para ajustar o processo.",
        ],
      },
      {
        type: "related",
        title: "Aprofunde o acompanhamento",
        slugs: ["acompanhamento-de-orcamentos"],
      },
      {
        type: "faq",
        id: "perguntas-frequentes",
        title: "Antes de colocar em prática.",
        items: [
          {
            question: "Preciso automatizar todo o atendimento de uma vez?",
            answer:
              "Você pode começar por uma jornada específica. Isso ajuda a definir as regras, observar como a equipe trabalha com a automação e ajustar o processo antes de ampliar.",
          },
          {
            question: "Quando a equipe humana participa?",
            answer:
              "Os critérios de encaminhamento devem acompanhar a sua operação. Negociações, exceções e situações que exigem avaliação da equipe podem ter uma passagem com contexto.",
          },
          {
            question: "O que vale acompanhar no CRM?",
            answer:
              "Observe de onde vêm os contatos, como avançam entre etapas e quais ações resultam em agendamentos ou vendas. Use os dados da sua operação para orientar os ajustes.",
          },
        ],
      },
    ],
  },
  {
    slug: "acompanhamento-de-orcamentos",
    tags: ["crm", "acompanhamento"],
    archetype: "guia-pratico",
    finalCta: {
      title: "Organize a próxima etapa dos seus orçamentos.",
      text: "Conheça o acompanhamento por etapa, status e última mensagem em uma demonstração da Its Time.",
      label: "Ver o acompanhamento na prática",
    },
    title: "Orçamento enviado. Conversa em movimento.",
    excerpt:
      "Como estruturar o acompanhamento de orçamentos com contexto e um próximo passo que faça sentido para o cliente.",
    category: "Acompanhamento",
    date: "2026-10-15",
    author: "Equipe Its Time",
    art: "journey",
    takeaway:
      "Um orçamento é uma etapa da conversa. O acompanhamento ajuda o cliente a tomar a próxima decisão.",
    blocks: [
      {
        type: "text",
        id: "contexto",
        title: "Comece pelo que o cliente precisa decidir.",
        paragraphs: [
          "Depois de receber um orçamento, o cliente pode precisar comparar opções, esclarecer uma condição ou combinar uma data. Um acompanhamento útil parte dessa necessidade, em vez de repetir a mesma mensagem para todos.",
          "Registre o produto ou serviço de interesse, o que já foi explicado e o próximo passo combinado. Esse contexto ajuda tanto a automação quanto a equipe a manter uma conversa coerente.",
        ],
      },
      {
        type: "steps",
        id: "organizar",
        title: "Três movimentos para dar continuidade.",
        items: [
          {
            title: "Organize a etapa",
            text: "Mantenha os orçamentos em uma etapa identificável do CRM e defina quem acompanha cada oportunidade.",
          },
          {
            title: "Defina o momento",
            text: "Use o tempo na etapa, o status e a última mensagem para configurar a jornada de acompanhamento.",
          },
          {
            title: "Abra espaço para uma resposta",
            text: "Pergunte se há alguma dúvida específica e ofereça um próximo passo possível, como conversar com a equipe.",
          },
        ],
      },
      {
        type: "cta",
        title: "Dê continuidade às suas oportunidades.",
        text: "Veja como organizar o acompanhamento de orçamentos na Its Time.",
        label: "Conhecer o acompanhamento",
      },
      {
        type: "checklist",
        id: "revisao",
        title: "Antes de ativar sua jornada.",
        items: [
          "Confirme a etapa que inicia o acompanhamento.",
          "Revise os intervalos e o contexto das mensagens.",
          "Defina quando encerrar a jornada ou encaminhar para a equipe.",
          "Acompanhe respostas e avanços no CRM.",
        ],
      },
    ],
  },
  {
    slug: "agendamento-com-ia",
    tags: ["atendimento", "agenda"],
    archetype: "guia-pratico",
    finalCta: {
      title: "Conecte atendimento e agenda.",
      text: "Veja como conduzir o cliente do interesse ao agendamento na operação do seu negócio.",
      label: "Conhecer o fluxo de agendamento",
    },
    title: "Da intenção ao horário marcado.",
    excerpt:
      "Conecte atendimento e agenda para tornar o agendamento uma continuação natural da conversa.",
    category: "Atendimento com IA",
    date: "2026-10-15",
    author: "Equipe Its Time",
    art: "schedule",
    takeaway:
      "Agendar fica mais simples quando a conversa reúne as informações certas e leva a uma escolha clara.",
    blocks: [
      {
        type: "text",
        id: "intencao",
        title: "Entenda a intenção antes de buscar um horário.",
        paragraphs: [
          "Um pedido de agendamento começa com uma necessidade. Entender o serviço desejado e a unidade adequada ajuda a conduzir a conversa até uma opção que faça sentido para o cliente.",
          "Defina quais informações são necessárias para consultar a agenda e em quais situações a equipe deve participar. Um fluxo claro dá continuidade ao atendimento e facilita o trabalho de quem recebe o agendamento.",
        ],
      },
      {
        type: "steps",
        id: "fluxo",
        title: "Do atendimento à agenda, em três etapas.",
        items: [
          {
            title: "Identifique o serviço",
            text: "Reúna as informações necessárias para orientar a busca por disponibilidade.",
          },
          {
            title: "Encontre a unidade adequada",
            text: "Quando houver mais de uma unidade, direcione o contato conforme as regras da operação.",
          },
          {
            title: "Conduza a escolha do horário",
            text: "Conecte a consulta à agenda com uma confirmação clara do próximo passo.",
          },
        ],
      },
      {
        type: "cta",
        title: "Sua agenda pode começar na conversa.",
        text: "Veja o fluxo de atendimento e agendamento em uma demonstração da Its Time.",
        label: "Ver uma demonstração",
      },
      {
        type: "checklist",
        id: "preparar",
        title: "Prepare sua operação.",
        items: [
          "Organize serviços e unidades disponíveis.",
          "Defina as informações necessárias ao agendamento.",
          "Estabeleça os critérios de encaminhamento para a equipe.",
          "Revise como os agendamentos aparecem na rotina da operação.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) =>
  posts.find((post) => post.slug === slug);
export const postDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
export function readingMinutes(post: BlogPost) {
  return Math.max(1, Math.ceil(editorialText(post).split(/\s+/).length / 200));
}
