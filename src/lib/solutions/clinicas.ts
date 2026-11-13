/**
 * Copy of /clinicas. Research and keyword choices: docs/solucoes/clinicas-pesquisa.md.
 *
 * Rules: every capability named here is one the site already shows (home demo, blog, tutorials, docs). No numbers,
 * prices of the product, client names or testimonials. Vocabulary follows the brand: "acompanhamento" (not
 * "follow-up") and "ganho/oportunidade" (never "perda"). The values inside the patient conversation are the clinic's
 * own registered answers in a sample conversation, not claims about Its Time.
 */
import { CLINIC_MESSAGE } from "@/lib/whatsapp";
import type { Solution } from "./types";

export const clinicSolution: Solution = {
  path: "/clinicas",
  segment: "clínicas",
  metaTitle: "IA para clínicas: atendimento e agendamento no WhatsApp",
  metaDescription:
    "A IA atende pacientes no WhatsApp a qualquer hora, tira dúvidas, marca a consulta, lembra o horário e retoma orçamentos. A equipe acompanha tudo no CRM.",
  kicker: "IA PARA CLÍNICAS",
  title: "IA para clínicas: a pergunta das 22h vira consulta marcada.",
  lede:
    "A Its Time atende os pacientes da sua clínica no WhatsApp, no Instagram e no site a qualquer hora: tira dúvidas com as respostas que você cadastrou, marca a consulta, lembra o horário e retoma o orçamento parado. A recepção recebe só o que precisa de uma pessoa, com o histórico.",
  message: CLINIC_MESSAGE,
  features: [
    {
      title: "Resposta a qualquer hora",
      text: "Valores, preparo, convênio, endereço e formas de pagamento: a IA responde em segundos, à noite e no fim de semana, com as informações e as regras que a clínica cadastrou.",
    },
    {
      title: "Agendamento na conversa",
      text: "A IA entende o procedimento, oferece os horários livres e marca a consulta sem o paciente sair do WhatsApp. A agenda do seu sistema pode ser sincronizada pela Agenda Universal.",
    },
    {
      title: "Lembrete e confirmação",
      text: "Antes do horário, o paciente recebe o lembrete e confirma a presença. Se não puder ir, a IA oferece outro horário na mesma conversa.",
    },
    {
      title: "Orçamento acompanhado",
      text: "Quem recebeu o plano de tratamento e não respondeu recebe o retorno na hora certa, com o contexto da consulta, até decidir ou pedir para falar com a equipe.",
    },
    {
      title: "Cobrança e retorno de pacientes",
      text: "Lembrete de pagamento com o Pix, cobrança e contato com quem sumiu acontecem sozinhos, sem ninguém da equipe precisar lembrar.",
    },
    {
      title: "Tudo no CRM",
      text: "Cada conversa, agendamento e orçamento fica no CRM. O painel mostra de onde vêm os pacientes e onde as conversas estão paradas.",
    },
  ],
  steps: [
    {
      title: "Conecte o WhatsApp oficial",
      text: "O número da clínica é conectado à API oficial da Meta. O tutorial mostra cada tela.",
    },
    {
      title: "Cadastre o que a IA pode responder",
      text: "Procedimentos, valores, preparo, convênios, horários e o que deve ir para a equipe. A IA só responde dentro dessas regras.",
    },
    {
      title: "Ligue a agenda",
      text: "Use a agenda do Its Time ou sincronize a do sistema que a clínica já usa pela Agenda Universal.",
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
      text: "Como conectar o WhatsApp oficial da clínica",
    },
    {
      href: "/dev/documentacao/agenda",
      label: "Integração",
      text: "Agenda Universal: sincronize a agenda do seu sistema",
    },
    {
      href: "/blog/follow-up-comercial-orcamento-parado-nao-e-processo",
      label: "Blog",
      text: "Orçamento parado não é processo: como acompanhar",
    },
    {
      href: "/blog/agendamento-com-ia",
      label: "Blog",
      text: "Da intenção ao horário marcado: agendamento com IA",
    },
  ],
  faq: [
    {
      question: "A IA substitui a recepção da clínica?",
      answer:
        "Não. Ela responde o que a clínica cadastrou, marca consultas, envia lembretes e faz o acompanhamento. O que precisa de uma pessoa vai para a recepção ou para o profissional, com o histórico da conversa.",
    },
    {
      question: "A IA dá orientação médica ou diagnóstico?",
      answer:
        "Ela responde só dentro das regras que a clínica cadastrou, como valores, preparo, convênios e horários. Você define o que vai para a equipe: dúvidas clínicas, sintomas, intercorrências e reclamações chegam a uma pessoa com o histórico.",
    },
    {
      question: "Funciona com o sistema de agenda que a clínica já usa?",
      answer:
        "Você pode usar a agenda do Its Time ou ligar o sistema da clínica pela Agenda Universal, que sincroniza os horários por webhooks. Na demonstração vemos como fica no seu caso.",
    },
    {
      question: "E quando o paciente precisa remarcar ou não confirma?",
      answer:
        "O lembrete pede a confirmação antes do horário. Se o paciente não puder ir, a IA oferece os horários livres na mesma conversa, e a equipe vê a mudança no CRM.",
    },
    {
      question: "O paciente pode mandar áudio?",
      answer:
        "Pode. A IA entende o áudio e também pode responder em áudio quando a conversa pede mais proximidade.",
    },
    {
      question: "Em quais canais a IA atende?",
      answer: "WhatsApp, site, Instagram e Messenger, com todas as conversas no mesmo CRM.",
    },
    {
      question: "Preciso do WhatsApp oficial?",
      answer:
        "Sim. O número da clínica é conectado à API oficial da Meta, e o nosso tutorial mostra o passo a passo. Quem já usa o app WhatsApp Business também encontra lá o que muda.",
    },
    {
      question: "Quanto custa?",
      answer:
        "O valor depende do tamanho da clínica e dos canais que você vai usar. Ele é apresentado na demonstração, junto com a configuração para o seu caso.",
    },
  ],
};

/** The patient's journey told by the scroll section. `time` is what the clock in the scene shows. */
export type JourneyStep = {
  id: string;
  time: string;
  /** Hour on a 24 h dial (decimal), drives the clock hand. */
  hour: number;
  label: string;
  title: string;
  text: string;
};

export const clinicJourney: JourneyStep[] = [
  {
    id: "pergunta",
    time: "22:14",
    hour: 22.23,
    label: "A pergunta",
    title: "A mensagem chega às 22h, com a recepção fechada.",
    text: "É depois do expediente que muita gente tem tempo de procurar uma clínica, e quem responde primeiro sai na frente. A IA responde em segundos, no WhatsApp, no Instagram ou no site, e a conversa já fica no CRM para a equipe ver de manhã.",
  },
  {
    id: "duvida",
    time: "22:15",
    hour: 22.25,
    label: "A dúvida",
    title: "Valor, preparo e convênio respondidos com as regras da clínica.",
    text: "A IA usa só o que a clínica cadastrou: procedimentos, valores, formas de pagamento, preparo e convênios aceitos. Se o paciente manda um áudio, ela entende. O que não está cadastrado vai para a equipe.",
  },
  {
    id: "agenda",
    time: "22:16",
    hour: 22.27,
    label: "O horário",
    title: "O horário é marcado na própria conversa.",
    text: "A IA oferece os horários livres do profissional certo, o paciente escolhe e a consulta entra na agenda. Pode ser a agenda do Its Time ou a do sistema da clínica, sincronizada pela Agenda Universal.",
  },
  {
    id: "lembrete",
    time: "Qui · 08:30",
    hour: 8.5,
    label: "O lembrete",
    title: "Antes da consulta, o lembrete pede a confirmação.",
    text: "O lembrete leva o preparo, e o paciente confirma a presença com uma resposta. Se não puder ir, a IA oferece outro horário na hora, e a vaga volta para a agenda em vez de ficar vazia.",
  },
  {
    id: "retorno",
    time: "Seg · 10:00",
    hour: 10,
    label: "O retorno",
    title: "O orçamento que ficou sem resposta é retomado.",
    text: "Depois da primeira sessão, a paciente levou a proposta do pacote para pensar. A IA volta na hora certa, com o contexto da consulta, e faz o mesmo com quem sumiu ou está com o retorno atrasado.",
  },
  {
    id: "crm",
    time: "Seg · 10:20",
    hour: 10.33,
    label: "A equipe",
    title: "A recepção vê tudo no CRM e assume quando precisa.",
    text: "Cada conversa, agendamento e orçamento fica registrado. Quando o paciente pede uma pessoa, a conversa chega à recepção com o histórico, e o painel mostra de onde vêm os pacientes e onde as conversas estão paradas.",
  },
];

/** What the AI answers by itself and what goes to a person. Shown side by side to answer "e se a IA errar?". */
export const clinicLimits = {
  ai: [
    "Valores e formas de pagamento cadastrados",
    "Preparo, duração e o que levar",
    "Convênios aceitos e o que é particular",
    "Endereço, estacionamento e horários",
    "Horários livres, agendamento e remarcação",
    "Lembrete, confirmação e cobrança com Pix",
  ],
  team: [
    "Dúvida clínica, sintoma ou resultado de exame",
    "Intercorrência depois de um procedimento",
    "Negociação fora das regras cadastradas",
    "Reclamação ou paciente insatisfeito",
    "Qualquer pedido para falar com uma pessoa",
  ],
};

/** Typical first questions per kind of clinic: the same flow, the clinic's own answers. */
export const clinicSegments = [
  { name: "Estética", question: "Quantas sessões preciso para ver resultado?" },
  { name: "Odontologia", question: "A avaliação é paga? Dá para parcelar o tratamento?" },
  { name: "Dermatologia", question: "Vocês atendem pelo meu convênio?" },
  { name: "Fisioterapia", question: "Preciso de pedido médico para começar?" },
  { name: "Psicologia", question: "A consulta pode ser online?" },
  { name: "Nutrição", question: "O retorno já está incluído no valor?" },
];

/**
 * Measured result confirmed by the owner on 13/11/2026: leads served by the AI that booked an appointment, average of
 * the client clinics over the last 30 days, steady over 90 days. Booked, not attended. Update the period when it is
 * measured again; never round it up.
 */
export const clinicResult = {
  value: "30%",
  label: "dos leads atendidos pela IA agendaram um horário",
  source:
    "Média das clínicas clientes da Its Time nos 30 dias até 13/11/2026. O resultado se mantém na janela de 90 dias. Conta o horário marcado, não o comparecimento.",
};
