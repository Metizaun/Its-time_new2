/** Catálogo compartilhado entre o blog, a navegação dos guias e o sitemap. */
export type ContentResource = {
  href: string;
  label: string;
  title: string;
  description: string;
  meta: string;
  updated?: string;
};

export const resourceGroups: {
  id: string;
  title: string;
  sidebarLabel: string;
  description: string;
  action: string;
  links: ContentResource[];
}[] = [
  {
    id: "tutoriais",
    title: "Tutoriais",
    sidebarLabel: "Tutoriais",
    description: "Guias práticos para configurar e usar o Its Time na rotina da sua equipe.",
    action: "Abrir tutorial",
    links: [
      {
        href: "/tutoriais/whatsapp-oficial",
        label: "WhatsApp oficial",
        title: "Conectar o WhatsApp oficial",
        description: "Prepare seu número, conclua a conexão com a Meta e configure o canal no CRM.",
        meta: "Conexão",
      },
      {
        href: "/tutoriais/whatsapp-boas-praticas",
        label: "Boas práticas no WhatsApp",
        title: "Boas práticas no WhatsApp",
        description: "Oriente sua equipe sobre autorização, descadastro, templates e qualidade do atendimento.",
        meta: "Guia",
        updated: "2026-10-29",
      },
    ],
  },
  {
    id: "dev",
    title: "Área dev",
    sidebarLabel: "Documentação",
    description: "Documentação técnica para conectar seus sistemas ao Its Time.",
    action: "Ver documentação",
    links: [
      {
        href: "/dev/documentacao/agenda",
        label: "Agenda Universal",
        title: "Agenda Universal",
        description: "Integre agendas de sistemas parceiros por webhooks e acompanhe a sincronização.",
        meta: "Sincronização",
      },
      {
        href: "/dev/documentacao/webhook-leads",
        label: "Webhook de leads",
        title: "Webhook de leads",
        description: "Envie novos contatos do seu sistema para a operação comercial no CRM.",
        meta: "Entrada CRM",
      },
      {
        href: "/dev/documentacao/webhook-cobranca",
        label: "Webhook de cobrança",
        title: "Webhook de cobrança",
        description: "Consulte o contrato de integração para enviar títulos financeiros ao Its Time.",
        meta: "Coleções",
      },
      {
        href: "/dev/documentacao/jornadas-rb",
        label: "Jornadas RB",
        title: "Jornadas RB",
        description: "Entenda os eventos e as regras das jornadas conectadas à integração RB.",
        meta: "Automações",
      },
    ],
  },
];
