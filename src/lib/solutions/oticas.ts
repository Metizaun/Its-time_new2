/**
 * Copy of /oticas. Research and sources: docs/solucoes/oticas-pesquisa.md.
 *
 * Every capability named here is one the site already shows (home demo, the two óticas guides, the WhatsApp tutorial,
 * the Jornadas RB docs). No prices, client names, testimonials or result numbers. The times in the journey
 * (22h12, 2 h, 4 h, 1 h antes) are the product's own rules or the example times the guides already use.
 * Vocabulary: "acompanhamento"/"retomada", never "follow-up" or "perda"; no birthday messages.
 */
import { OPTICS_MESSAGE } from "@/lib/whatsapp";
import type { Solution } from "./types";

export const opticsSolution: Solution = {
  path: "/oticas",
  segment: "óticas",
  metaTitle: "IA de atendimento e CRM para óticas · Its Time",
  metaDescription:
    "IA que atende a ótica no WhatsApp a qualquer hora: lê a receita, indica a armação, monta o orçamento, agenda a visita e retoma o cliente. Uma ou várias lojas.",
  kicker: "PARA ÓTICAS",
  title: "IA de atendimento e CRM para óticas",
  lede:
    "A IA atende no WhatsApp, no site, no Instagram e no Messenger, a qualquer hora. Lê a receita, indica a armação pelo formato do rosto, monta o orçamento com a sua tabela, marca a visita e retoma quem levou o orçamento para pensar. Tudo cai no CRM, separado por loja.",
  message: OPTICS_MESSAGE,
  features: [],
  steps: [
    {
      title: "Conecte o WhatsApp oficial",
      text: "O número da ótica, ou um por loja, entra na API oficial da Meta. O tutorial mostra cada tela.",
    },
    {
      title: "Cadastre lentes, armações e regras",
      text: "Lentes, tratamentos, parâmetros de grau, parcelamento, endereço e horário de cada loja, e o que vai sempre para o vendedor. A IA responde com o que estiver cadastrado.",
    },
    {
      title: "Ligue a agenda e o sistema da loja",
      text: "A agenda mostra os horários livres de cada loja. Pelas Jornadas RB, pedidos e receitas do sistema da ótica entram no CRM e disparam mensagens.",
    },
    {
      title: "Acompanhe pelo CRM",
      text: "Cada conversa, orçamento e visita fica no painel, por etapa e por loja. A equipe assume a conversa quando quiser.",
    },
  ],
  links: [
    {
      href: "/blog/ia-de-atendimento-para-oticas",
      label: "Guia",
      text: "IA de atendimento para óticas: o guia completo",
    },
    {
      href: "/blog/black-friday-para-oticas",
      label: "Guia",
      text: "Black Friday para óticas: oferta, atendimento e retomada",
    },
    {
      href: "/tutoriais/whatsapp-oficial",
      label: "Tutorial",
      text: "Como conectar o WhatsApp oficial da ótica",
    },
    {
      href: "/dev/documentacao/jornadas-rb",
      label: "Integração",
      text: "Jornadas RB: pedidos e receitas do sistema da loja",
    },
  ],
  faq: [
    {
      question: "A IA pode errar o preço ou prometer prazo?",
      answer:
        "Ela responde com os valores, tratamentos e parcelamentos que a ótica cadastrou, e nada além disso. Desconto fora da regra, estoque sem confirmação, prazo que a loja não informou e preço fechado vão para o vendedor, com a conversa e a receita já registradas.",
    },
    {
      question: "E se a foto da receita estiver ruim?",
      answer:
        "O resumo com esférico, cilíndrico e eixo é um apoio para a equipe e para o cliente. A leitura depende da qualidade da foto, e quem fecha o orçamento confere a receita antes.",
    },
    {
      question: "A IA faz exame de vista ou indica grau?",
      answer:
        "Não. Ela lê a receita que o profissional escreveu e agenda o exame ou a visita nos horários que a ótica cadastrou. Diagnóstico e prescrição continuam com o profissional.",
    },
    {
      question: "Quem vê a receita do cliente?",
      answer:
        "A equipe que atende aquela conversa e o próprio cliente. O administrador define quais vendedores veem quais lojas.",
    },
    {
      question: "Funciona com várias lojas?",
      answer:
        "Sim. Cada loja pode ter o seu número de WhatsApp. A conversa que chega na loja errada vai para a unidade certa, e cada equipe vê só o que é dela, no mesmo CRM.",
    },
    {
      question: "Minha equipe atende tudo à mão. Serve?",
      answer:
        "Serve. O funil se organiza lendo as conversas, mesmo sem a IA respondendo, e a lista de clientes parados aparece no painel. A IA pode entrar depois, canal por canal.",
    },
    {
      question: "Quanto custa?",
      answer:
        "Depende do número de lojas e do volume de atendimento. O valor é apresentado na demonstração, pelo WhatsApp.",
    },
  ],
};

/** One moment of the customer's path. `when` is the clock on the stage; `saved` is what lands in the CRM. */
export type OpticsStep = {
  id: string;
  when: string;
  label: string;
  title: string;
  text: string;
  saved: { field: string; value: string };
};

export const opticsJourney: OpticsStep[] = [
  {
    id: "pergunta",
    when: "22h12",
    label: "Pergunta de preço",
    title: "“Quanto custa uma lente?” vira conversa",
    text: "A loja fechou às 19h, e a resposta sai em segundos. Antes de falar em valor, a IA pergunta se é óculos de grau ou de sol e pede o que falta: a receita ou a foto do modelo.",
    saved: { field: "Interesse", value: "Óculos de grau" },
  },
  {
    id: "receita",
    when: "22h14",
    label: "Receita lida",
    title: "A receita é lida, não digitada",
    text: "Da foto saem esférico, cilíndrico e eixo de cada olho, num resumo para o cliente e para a equipe. Ninguém redigita grau às pressas, e quem fecha o orçamento confere.",
    saved: { field: "Receita", value: "OD −1,50 −0,50 180° · OE −1,25 −0,25 170°" },
  },
  {
    id: "armacao",
    when: "22h17",
    label: "Armação indicada",
    title: "A armação pelo formato do rosto",
    text: "Com uma selfie de frente, a IA identifica o formato do rosto, indica modelos do seu catálogo que combinam e mostra como ficam no cliente.",
    saved: { field: "Armação", value: "Gatinho · metal rose gold" },
  },
  {
    id: "orcamento",
    when: "22h20",
    label: "Orçamento",
    title: "O orçamento segue a sua tabela",
    text: "Lente, tratamento e parcelamento saem dos parâmetros que a ótica cadastrou. Desconto fora da regra, estoque sem confirmação e preço fechado vão para o vendedor, que abre a conversa já pronta.",
    saved: { field: "Orçamento", value: "Enviado · tabela da loja" },
  },
  {
    id: "visita",
    when: "22h23",
    label: "Visita marcada",
    title: "Exame ou visita marcados, com lembrete",
    text: "A IA confere os horários livres da loja, marca a visita ou o exame com o profissional da agenda e lembra o cliente pelo WhatsApp 1 hora antes.",
    saved: { field: "Visita", value: "Qui · 10h30 · Loja Centro" },
  },
  {
    id: "retomada",
    when: "Quinta",
    label: "Orçamento retomado",
    title: "Quem levou o orçamento para pensar é retomado",
    text: "Depois da visita, o cliente foi pensar. A lembrança sai 2 horas depois e o reforço 4 horas depois, com o nome dele e o que foi combinado. Quando ele responde, a sequência para e o vendedor assume.",
    saved: { field: "Acompanhamento", value: "Respondeu · com o vendedor" },
  },
  {
    id: "lojas",
    when: "Sexta · 9h",
    label: "Várias lojas",
    title: "Várias lojas, um só CRM",
    text: "Cada conversa chega na unidade certa, com o histórico inteiro. A equipe de cada loja vê só o que é dela, e o dono acompanha todas no mesmo painel.",
    saved: { field: "Loja", value: "Centro · etapa Venda" },
  },
];

/** The fears an owner brings to the demo, answered with what the product does and does not do. */
export const opticsGuardrails = [
  {
    title: "Não dá desconto por conta própria",
    text: "Só oferece as condições que a ótica cadastrou. Qualquer outra vai para o vendedor.",
  },
  {
    title: "Não confirma estoque nem prazo sem fonte",
    text: "Estoque e data de entrega só são confirmados com uma fonte válida da loja.",
  },
  {
    title: "Não fecha preço nem valida pagamento",
    text: "Preço fechado e comprovante ficam com o vendedor, que entra com a receita e a conversa prontas.",
  },
  {
    title: "Não diagnostica nem indica grau",
    text: "Lê a receita que o profissional escreveu. Exame e prescrição continuam com quem é habilitado.",
  },
] as const;

/** Post-sale journeys fed by the store system (Jornadas RB triggers, see /dev/documentacao/jornadas-rb). */
export const opticsAfterSale = [
  { event: "Venda convertida", message: "Confirmação do pedido, com os itens e a receita registrados." },
  { event: "Mercadoria liberada", message: "“Seus óculos estão prontos”, sem o cliente precisar ligar." },
  { event: "Venda entregue", message: "Acompanhamento depois da entrega, no intervalo que você escolher." },
  { event: "Receita vencida", message: "Lembrete na data de validade da receita para marcar uma nova consulta." },
] as const;
