// DRAFT: first pass of the /oticas copy. The optics session researches and rewrites it.
import { OPTICS_MESSAGE } from "@/lib/whatsapp";
import type { Solution } from "./types";

export const opticsSolution: Solution = {
  path: "/oticas",
  segment: "óticas",
  metaTitle: "IA de atendimento e CRM para óticas · Its Time",
  metaDescription:
    "A IA atende clientes da ótica no WhatsApp a qualquer hora, lê a receita, indica a armação, agenda o exame e retoma orçamentos parados, em uma ou várias lojas.",
  kicker: "PARA ÓTICAS",
  title: "IA de atendimento e CRM para óticas",
  lede:
    "A IA atende no WhatsApp, no site e no Instagram a qualquer hora, lê a receita, indica a armação, agenda o exame e retoma o orçamento que ficou parado. Em uma loja ou em várias.",
  message: OPTICS_MESSAGE,
  features: [
    {
      title: "Da pergunta de preço ao orçamento",
      text: "“Quanto custa uma lente?” vira uma conversa: a IA entende a necessidade, pede a receita e chega ao orçamento com as regras que a ótica cadastrou.",
    },
    {
      title: "Receita lida, armação indicada",
      text: "A IA lê a foto da receita, salva cada informação no CRM e indica armações que combinam com o cliente.",
    },
    {
      title: "Atendimento fora do horário",
      text: "A mensagem das 22h não espera até a loja abrir. A IA responde na hora e deixa tudo pronto para a equipe continuar de manhã.",
    },
    {
      title: "Várias lojas, um só atendimento",
      text: "Conversas de WhatsApp, site, Instagram e Messenger chegam separadas por loja, sem fila e sem celular perdido no balcão.",
    },
    {
      title: "Orçamento retomado com motivo",
      text: "Quem recebeu um orçamento é procurado de novo no momento certo, com o contexto da conversa, até decidir.",
    },
    {
      title: "Pedidos e aniversários no automático",
      text: "Integrada ao sistema da loja, a IA avisa sobre pedidos, lembra a renovação da receita e manda a mensagem de aniversário.",
    },
  ],
  steps: [
    {
      title: "Conecte o WhatsApp oficial",
      text: "O número da ótica, ou um por loja, é conectado à API oficial da Meta, com o passo a passo do nosso tutorial.",
    },
    {
      title: "Cadastre produtos e regras",
      text: "Lentes, tratamentos, faixas de preço, parcelamento e o que deve ir para o vendedor. A IA só promete o que estiver cadastrado.",
    },
    {
      title: "Ligue o sistema da loja",
      text: "Pedidos, receitas e aniversários entram pelas Jornadas RB; a agenda do exame pela Agenda Universal.",
    },
    {
      title: "Acompanhe pelo CRM",
      text: "A equipe vê cada conversa, orçamento e visita marcada, por loja, e assume quando quiser.",
    },
  ],
  links: [
    {
      href: "/blog/ia-de-atendimento-para-oticas",
      label: "Guia",
      text: "IA de atendimento para óticas: guia completo",
    },
    {
      href: "/blog/black-friday-para-oticas",
      label: "Guia",
      text: "Black Friday para óticas: oferta, atendimento e retomada",
    },
    {
      href: "/dev/documentacao/jornadas-rb",
      label: "Integração",
      text: "Jornadas RB: pedidos, receitas e aniversários",
    },
    {
      href: "/tutoriais/whatsapp-oficial",
      label: "Tutorial",
      text: "Como conectar o WhatsApp oficial",
    },
  ],
  faq: [
    {
      question: "A IA pode prometer preço ou prazo?",
      answer:
        "Só o que a ótica cadastrou. Condições fora das regras vão para o vendedor, com a conversa e a receita já registradas.",
    },
    {
      question: "Funciona com várias lojas?",
      answer: "Sim. Cada loja pode ter seu número de WhatsApp, e as conversas ficam separadas por unidade no mesmo CRM.",
    },
    {
      question: "Em quais canais a IA atende?",
      answer: "WhatsApp, site, Instagram e Messenger.",
    },
    {
      question: "Quanto custa?",
      answer: "O valor depende do número de lojas e do volume de atendimento e é apresentado na demonstração.",
    },
  ],
};
