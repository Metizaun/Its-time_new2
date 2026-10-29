import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { DocumentationSidebar } from "../../dev/documentacao/DocumentationSidebar";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Boas práticas no WhatsApp · Tutoriais Its Time",
  description: "Guia para clientes Its Time: autorização, descadastro, janela de 24 horas, templates e atendimento responsável, com fontes oficiais da Meta.",
  alternates: { canonical: "/tutoriais/whatsapp-boas-praticas" },
  openGraph: {
    title: "Boas práticas no WhatsApp · Its Time",
    description: "Oriente sua equipe para uma comunicação útil e responsável no WhatsApp Business.",
    url: "/tutoriais/whatsapp-boas-praticas",
    type: "article",
  },
};

const sections = [
  ["autorizacao", "Autorização e descadastro"],
  ["janela", "Janela de 24 horas"],
  ["templates", "Categorias de mensagem"],
  ["qualidade", "Frequência e qualidade"],
  ["ia", "IA e atendimento humano"],
  ["dados", "Dados e atividades restritas"],
  ["revisao", "Antes de ativar uma jornada"],
  ["fontes", "Fontes oficiais"],
] as const;

const sources = {
  policy: "https://business.whatsapp.com/policy",
  pricing: "https://business.whatsapp.com/products/platform-pricing",
  marketing: "https://whatsappbusiness.com/products/conversation-categories/marketing/",
  utility: "https://whatsappbusiness.com/products/conversation-categories/utility/",
  quality: "https://whatsappbusiness.com/wp-content/uploads/2026/04/Best-Practices-for-Marketing-Messages-on-WhatsApp-.pdf",
  guidelines: "https://www.whatsapp.com/legal/messaging-guidelines",
};

const linkClass = "rounded-sm font-semibold text-[var(--color-primary-700)] underline underline-offset-4 hover:text-[var(--color-gray-900)] focus-visible:shadow-focus";

function Source({ href, children }: { href: string; children: ReactNode }) {
  return <p className="text-sm"><a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{children}<ArrowUpRight aria-hidden="true" className="ml-1 inline h-3.5 w-3.5" /></a></p>;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">
    <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-700)]"><span aria-hidden="true" className="h-0.5 w-5 bg-[var(--color-primary-500)]" />{String(sections.findIndex(section => section[0] === id) + 1).padStart(2, "0")} · Boas práticas</p>
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    <div className="mt-4 space-y-4 leading-7 text-[var(--color-gray-700)]">{children}</div>
  </section>;
}

function Example({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="rounded-xl border border-[var(--border-default)] bg-[var(--color-primary-50)] p-5">
    <h3 className="font-semibold text-[var(--color-gray-900)]">{title}</h3>
    <p className="mt-2 text-sm leading-6">{children}</p>
  </aside>;
}

export default function WhatsAppBestPracticesPage() {
  return <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--color-surface-overlay)] backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao site</Link>
        <span className="font-mono text-xs font-bold tracking-wider sm:text-sm">ITS TIME <span className="text-[var(--color-primary-700)]">/ TUTORIAIS</span></span>
      </div>
    </header>
    <main id="conteudo" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14" aria-labelledby="guide-title">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" />
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-700)]">Guia · WhatsApp Business</p>
        <h1 id="guide-title" className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Boas práticas no WhatsApp</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">Oriente sua equipe para enviar mensagens esperadas, respeitar escolhas e cuidar de cada conversa.</p>
        <p className="mt-6 text-sm leading-6 text-[var(--color-gray-600)]">Guia educativo da Its Time, baseado em fontes oficiais da Meta. As recomendações operacionais e os exemplos são nossos; as políticas oficiais prevalecem.</p>
        <p className="mt-4 font-mono text-xs text-[var(--color-gray-600)]">Revisado em <time dateTime="2026-10-29">29/10/2026</time> · Regras de templates e janela aplicáveis à WhatsApp Business Platform (API oficial).</p>
      </section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <DocumentationSidebar currentPath="/tutoriais/whatsapp-boas-praticas" sections={sections} />
        <article aria-label="Guia de boas práticas" className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
          <Section id="autorizacao" title="Comece pela autorização. Respeite a saída.">
            <p>A Meta exige que a pessoa forneça seu contato e autorize mensagens ou chamadas posteriores. Atenda pedidos de descadastro recebidos dentro ou fora do WhatsApp.</p>
            <p><strong>Recomendação Its Time:</strong> registre data, origem e finalidade da autorização. Separe preferências de ofertas e atualizações de pedidos. Ter um telefone no cadastro não comprova essa escolha.</p>
            <Example title="Exemplo de convite para ofertas">“Quero receber ofertas da Ótica Exemplo pelo WhatsApp. Posso cancelar quando quiser, respondendo SAIR.” Use uma escolha opcional e adapte o texto à finalidade.</Example>
            <p>Ao receber “SAIR” ou outro pedido equivalente, retire o contato das campanhas e automações correspondentes. Não exija uma palavra exata para respeitar a decisão.</p>
            <Source href={sources.policy}>Política de mensagens e boas práticas de opt-in</Source>
          </Section>
          <Section id="janela" title="Entenda a janela de 24 horas.">
            <p>Na API oficial, cada mensagem do cliente abre ou renova uma janela de atendimento de 24 horas. Nesse período, você pode responder com mensagens livres. Fora dele, use somente templates aprovados pela Meta.</p>
            <Example title="Exemplo de horário">Se o cliente escreveu na segunda-feira às 14h, a janela vai até terça-feira às 14h. Uma nova mensagem dele reinicia a contagem; uma mensagem da empresa não.</Example>
            <p>A aprovação de um template não substitui a autorização do cliente. Confira o status do modelo antes de usá-lo.</p>
            <Source href={sources.policy}>Regras da WhatsApp Business Platform</Source>
            <Source href={sources.pricing}>Janela de atendimento e preços oficiais</Source>
          </Section>
          <Section id="templates" title="Escolha a categoria pelo conteúdo.">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Marketing", "Ofertas, recomendações e retomadas comerciais para despertar interesse. Exemplo: apresentar uma nova coleção a quem autorizou ofertas."],
                ["Utilidade", "Atualizações específicas de uma solicitação ou transação, sem promoção. Exemplo: informar o andamento de um pedido existente."],
                ["Autenticação", "Códigos de uso único para verificar identidade. Exemplo: código de acesso solicitado pelo próprio usuário."],
                ["Serviço", "Respostas ao atendimento iniciado pelo cliente, dentro da janela de 24 horas. Serviço não é uma categoria de template."],
              ].map(([title, text]) => <div key={title} className="rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5"><dt className="font-semibold text-[var(--color-gray-900)]">{title}</dt><dd className="mt-2 text-sm leading-6">{text}</dd></div>)}
            </dl>
            <p>Uma oferta não se torna utilidade por mencionar um pedido. Revise a finalidade e acompanhe a classificação atribuída pela Meta. Consulte as tarifas atuais antes de planejar uma campanha.</p>
            <Source href={sources.marketing}>Mensagens de marketing</Source>
            <Source href={sources.utility}>Mensagens de utilidade</Source>
            <Source href={sources.pricing}>Categorias, autenticação e tarifas</Source>
          </Section>
          <Section id="qualidade" title="Envie com contexto e acompanhe a qualidade.">
            <p>Priorize relevância, segmente o público e ajuste a frequência às expectativas do cliente. Observe respostas, pedidos de saída, bloqueios e os indicadores disponíveis no WhatsApp Manager. Templates de baixa qualidade podem ser pausados ou desativados.</p>
            <p><strong>Recomendação Its Time:</strong> defina um responsável pela campanha, revise o público e teste a mensagem antes de ampliar o envio. Se houver rejeição ou queda de qualidade, pause a jornada e investigue a origem.</p>
            <Source href={sources.quality}>Manual oficial de boas práticas de marketing (PDF)</Source>
            <p>Evite listas compradas, contatos extraídos e insistência sem interesse. Não tente contornar restrições trocando números ou recorrendo a ferramentas não oficiais. Nenhum intervalo de envio garante proteção contra bloqueios.</p>
            <Source href={sources.guidelines}>Diretrizes de mensagens e medidas contra abuso</Source>
          </Section>
          <Section id="ia" title="Dê à automação um caminho para a equipe.">
            <p>A Meta exige caminhos claros e diretos de escalonamento quando há automação, como transferência para uma pessoa, telefone ou suporte.</p>
            <p><strong>Recomendação Its Time:</strong> apresente a IA como assistente virtual da empresa. Defina quem assume dúvidas, reclamações e exceções; revise preços, prazos e promessas antes de automatizá-los.</p>
            <Example title="Exemplo de apresentação">“Olá! Sou o assistente virtual da Ótica Exemplo. Posso ajudar com informações e pedidos. Se preferir falar com nossa equipe, é só pedir.”</Example>
            <Source href={sources.policy}>Automação e caminhos de atendimento</Source>
          </Section>
          <Section id="dados" title="Cuide dos dados e confira as restrições.">
            <p>Mantenha uma política de privacidade publicada. Não solicite números completos de cartões, contas financeiras ou documentos pessoais sensíveis. Há restrições para produtos e atividades, inclusive saúde, crédito e cobrança de dívidas; consulte as regras e exceções antes de configurar esses fluxos.</p>
            <p><strong>Recomendação Its Time:</strong> limite acessos da equipe, peça apenas informações necessárias e use canais apropriados para dados sensíveis. Confira a elegibilidade de cada atividade, produto e país.</p>
            <Source href={sources.policy}>Proteção de dados e atividades restritas</Source>
            <p>Consulte também nossa <Link href="/politica-de-privacidade" className={linkClass}>Política de privacidade</Link> e as orientações de <Link href="/exclusao-de-dados" className={linkClass}>Exclusão de dados</Link>.</p>
          </Section>
          <Section id="revisao" title="Antes de ativar uma jornada.">
            <p>Roteiro de revisão recomendado pela Its Time:</p>
            <ul className="space-y-3">
              {[
                "Escolha uma finalidade e um responsável pelo acompanhamento.",
                "Revise a origem do público e as preferências registradas.",
                "Simule o envio com janela aberta e com janela encerrada.",
                "Teste um pedido de saída em todas as automações envolvidas.",
                "Faça um atendimento de teste até a passagem para a equipe.",
                "Registre o resultado e ajuste a jornada antes de ampliá-la.",
              ].map(item => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary-700)]" /><span>{item}</span></li>)}
            </ul>
            <p>Ainda precisa conectar o número? Siga o tutorial <Link href="/tutoriais/whatsapp-oficial" className={linkClass}>Conectar o WhatsApp oficial</Link>.</p>
          </Section>
          <Section id="fontes" title="Consulte as fontes oficiais.">
            <p>As políticas, classificações e tarifas podem mudar. Confira os documentos vigentes ao revisar sua operação. Este material é um guia da Its Time, sem vínculo de autoria ou aprovação pela Meta.</p>
            <ul className="space-y-3">
              {[
                [sources.policy, "Política de Mensagens do WhatsApp Business"],
                [sources.guidelines, "Diretrizes de Mensagens do WhatsApp"],
                [sources.quality, "Boas práticas de marketing no WhatsApp (PDF)"],
                [sources.pricing, "Categorias e preços da WhatsApp Business Platform"],
              ].map(([href, label]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}<ArrowUpRight aria-hidden="true" className="ml-1 inline h-3.5 w-3.5" /></a></li>)}
            </ul>
          </Section>
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
