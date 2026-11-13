// DRAFT: first pass of the /clinicas copy. The clinics session researches and rewrites it.
import { CLINIC_MESSAGE } from "@/lib/whatsapp";
import type { Solution } from "./types";

export const clinicSolution: Solution = {
  path: "/clinicas",
  segment: "clínicas",
  metaTitle: "IA de atendimento e CRM para clínicas · Its Time",
  metaDescription:
    "A IA atende pacientes no WhatsApp a qualquer hora, tira dúvidas sobre procedimentos, agenda a consulta e retoma orçamentos. A equipe recebe só o que precisa dela.",
  kicker: "PARA CLÍNICAS",
  title: "IA de atendimento e CRM para clínicas",
  lede:
    "A IA responde pacientes no WhatsApp, no site e no Instagram a qualquer hora, tira dúvidas sobre procedimentos, marca a consulta e acompanha quem pediu orçamento. A recepção recebe só o que precisa de uma pessoa.",
  message: CLINIC_MESSAGE,
  features: [
    {
      title: "Resposta a qualquer hora",
      text: "Perguntas sobre procedimentos, valores e preparo chegam à noite e no fim de semana. A IA responde em segundos, com as informações e as regras que a clínica cadastrou.",
    },
    {
      title: "Agendamento na conversa",
      text: "A IA entende o procedimento, oferece os horários livres e marca a consulta sem o paciente sair do WhatsApp. A agenda do seu sistema pode ser sincronizada pela Agenda Universal.",
    },
    {
      title: "Orçamento que não esfria",
      text: "Quem pediu o valor de um procedimento recebe o retorno na hora certa, com o contexto da conversa, até decidir ou pedir para falar com a equipe.",
    },
    {
      title: "Cobrança e retorno de pacientes",
      text: "Lembretes de pagamento, cobrança e contato com quem sumiu acontecem sozinhos, sem ninguém da equipe precisar lembrar.",
    },
    {
      title: "Passagem para a equipe",
      text: "Quando a conversa pede uma pessoa, a IA encaminha para a recepção ou para o profissional certo, com todo o histórico.",
    },
    {
      title: "Tudo registrado no CRM",
      text: "Cada conversa, interesse e agendamento fica no CRM. O painel mostra de onde vêm os pacientes e onde as conversas estão paradas.",
    },
  ],
  steps: [
    {
      title: "Conecte o WhatsApp oficial",
      text: "O número da clínica é conectado à API oficial da Meta, com o passo a passo do nosso tutorial.",
    },
    {
      title: "Cadastre o que a IA pode responder",
      text: "Procedimentos, valores, preparo, horários e o que deve ir para a equipe. A IA só responde dentro dessas regras.",
    },
    {
      title: "Ligue a agenda",
      text: "Use a agenda do Its Time ou sincronize a do sistema que a clínica já usa.",
    },
    {
      title: "Acompanhe pelo CRM",
      text: "A equipe vê cada conversa, agendamento e orçamento em andamento e assume quando quiser.",
    },
  ],
  links: [
    {
      href: "/tutoriais/whatsapp-oficial",
      label: "Tutorial",
      text: "Como conectar o WhatsApp oficial",
    },
    {
      href: "/dev/documentacao/agenda",
      label: "Integração",
      text: "Agenda Universal: sincronize a agenda do seu sistema",
    },
    {
      href: "/blog/follow-up-comercial-orcamento-parado-nao-e-processo",
      label: "Blog",
      text: "Follow-up comercial: orçamento parado não é processo",
    },
    {
      href: "/blog/agendamento-com-ia",
      label: "Blog",
      text: "Da intenção ao horário marcado: agendamento com IA",
    },
  ],
  faq: [
    {
      question: "A IA substitui a recepção?",
      answer:
        "Não. Ela responde o que a clínica cadastrou, marca consultas e faz o acompanhamento. O que precisa de uma pessoa vai para a equipe, com o histórico da conversa.",
    },
    {
      question: "Funciona com o sistema de agenda que eu já uso?",
      answer:
        "Sistemas parceiros podem ser ligados pela Agenda Universal, por webhooks. Na demonstração vemos como fica no seu caso.",
    },
    {
      question: "Em quais canais a IA atende?",
      answer: "WhatsApp, site, Instagram e Messenger, com todas as conversas no mesmo CRM.",
    },
    {
      question: "Quanto custa?",
      answer: "O valor depende do tamanho da operação e é apresentado na demonstração.",
    },
  ],
};
