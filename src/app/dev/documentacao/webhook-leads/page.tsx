import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Braces,
  CheckCircle2,
  Image as ImageIcon,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
  Tags,
  Webhook,
} from "lucide-react";
import type { ReactNode } from "react";

import { CopyButton } from "../webhook-cobranca/CopyButton";
import { DocumentationSidebar } from "../DocumentationSidebar";
import { LeadSwaggerExplorer } from "./LeadSwaggerExplorer";
import { LeadSectionTracker } from "./LeadSectionTracker";

export const metadata: Metadata = {
  title: "Webhook de leads · Documentação Its Time",
  description: "Estrutura editorial para receber leads por webhook no CRM Its Time.",
  alternates: { canonical: "/dev/documentacao/webhook-leads" },
};

const currentPath = "/dev/documentacao/webhook-leads";
const endpoint = "https://api.itstime.pro/api/integrations/leads/v1/connections/{publicConnectionId}/events";

const payload = `{
  "name": "Maria Silva",
  "phone": "5511999999999",
  "email": "maria@example.com",
  "observation": "Tem interesse em lentes multifocais.",
  "tags": ["multifocal", "campanha-maio"]
}`;

const signatureRule = `signature = HMAC-SHA256(secret, timestamp + "." + rawBody)
X-Leads-Signature: sha256=<hash_hexadecimal>`;

const futureMediaPayload = `{
  "type": "image",
  "url": "https://storage.example.com/material/guia.jpg",
  "caption": "Veja as opções que separamos para você."
}`;

const sections = [
  ["inicio", "Comece aqui"],
  ["configuracao", "Configuração"],
  ["contrato", "Contrato"],
  ["seguranca", "Segurança"],
  ["processamento", "Processamento"],
  ["rastreabilidade", "Rastreabilidade"],
  ["respostas", "Respostas"],
  ["parte-dois", "Parte 2 · visão futura"],
  ["openapi", "OpenAPI"],
  ["checklist", "Checklist"],
] as const;

function SectionTitle({ step, title }: { step: string; title: string }) {
  return (
    <>
      <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">
        <span className="h-0.5 w-5 bg-[var(--color-primary-500)]" aria-hidden="true" />
        {step}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--color-gray-900)] sm:text-3xl">{title}</h2>
    </>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-black/10 bg-[var(--color-gray-900)] shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/65">{label}</span>
        <CopyButton value={code} />
      </div>
      <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-6 text-white sm:p-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="mt-5 rounded-xl border border-[var(--color-primary-500)]/25 bg-[var(--color-primary-50)] p-4">
      <p className="font-semibold text-[var(--color-gray-900)]">{title}</p>
      <div className="mt-1 text-sm leading-6 text-[var(--color-gray-700)]">{children}</div>
    </aside>
  );
}

function DocSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">
      {children}
    </section>
  );
}

function FieldTable({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-default)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-[var(--color-surface-2)]">
          <tr>
            {['Campo', 'Obrigatório', 'Uso editorial'].map((header) => (
              <th key={header} className="border-b border-[var(--border-default)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([field, required, usage], index) => (
            <tr key={field} className={index % 2 ? "bg-[var(--color-surface-2)]/50" : "bg-white"}>
              <td className="border-b border-[var(--border-subtle)] px-4 py-3 align-top last:border-b-0"><code className="font-mono text-[13px] text-[var(--color-gray-900)]">{field}</code></td>
              <td className="border-b border-[var(--border-subtle)] px-4 py-3 align-top text-[var(--color-gray-700)]">{required}</td>
              <td className="border-b border-[var(--border-subtle)] px-4 py-3 align-top text-[var(--color-gray-700)]">{usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowCard({ icon: Icon, title, text }: { icon: typeof Webhook; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5">
      <Icon className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
      <h3 className="mt-3 font-semibold text-[var(--color-gray-900)]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">{text}</p>
    </div>
  );
}

export default function LeadWebhookDocumentationPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[color:rgba(247,246,244,0.92)] backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Voltar ao site
          </Link>
          <span className="font-mono text-sm font-bold tracking-wider">ITS TIME <span className="text-[var(--color-primary-600)]">/ DEV</span></span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <LeadSectionTracker sectionIds={sections.map(([id]) => id)} />

        <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14">
          <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" />
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">Documentação · Leads CRM v1</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">Receba leads sem perder contexto</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">O backend parceiro envia nome, telefone e observação. O Its Time organiza o lead no CRM, aplica a origem, as tags e o agente de IA responsável pelo próximo passo.</p>
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">
              {['POST', 'JSON', 'HMAC-SHA256', 'PARTE 1'].map((tag) => <span key={tag} className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">{tag}</span>)}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
          <DocumentationSidebar currentPath={currentPath} sections={sections} />

          <article className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
            <DocSection id="inicio">
              <SectionTitle step="01 · Comece aqui" title="Uma entrada, um contexto, uma próxima ação" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">Esta página documenta somente a Parte 1: receber o lead e deixá-lo pronto no CRM. A origem é a conexão, o agente é resolvido no servidor e o payload nasce no backend do parceiro.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <FlowCard icon={Webhook} title="Backend parceiro" text="Envia o evento assinado para a URL pública da conexão." />
                <FlowCard icon={Bot} title="Agente de destino" text="A conexão aponta para um agente primary ativo com instância válida." />
                <FlowCard icon={MessageSquareText} title="CRM preparado" text="Lead, observação, origem, tags e atribuição ficam disponíveis para a etapa futura." />
              </div>
              <Note title="Fronteira da entrega">Nenhum agente é chamado, nenhuma mensagem é gerada e nenhum provedor de WhatsApp é acionado nesta versão.</Note>
            </DocSection>

            <DocSection id="configuracao">
              <SectionTitle step="02 · Configuração" title="O frontend configura; o parceiro envia" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">A área administrativa cadastra a conexão e fornece credenciais. Nome, telefone, observação e tags não são campos para o usuário preencher nesta tela: eles pertencem ao contrato enviado pelo backend parceiro.</p>
              <FieldTable rows={[
                ['name', 'Sim', 'Nome exibido no CRM.'],
                ['phone', 'Sim', 'Telefone normalizado antes da busca do lead.'],
                ['email', 'Não', 'Contato complementar, quando disponível.'],
                ['observation', 'Não', 'Texto acrescentado ao histórico de notas.'],
                ['tags', 'Não', 'Nomes de tags existentes no catálogo da empresa.'],
              ]} />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5">
                  <KeyRound className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold">Configuração da conexão</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">Nome, agente primary ativo, etapa padrão, status ativo/pausado, URL pública e segredo.</p>
                </div>
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5">
                  <Bot className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold">Instância derivada</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">A instância não é escolhida no formulário; ela vem de <code className="font-mono">agent.instance_name</code>.</p>
                </div>
              </div>
            </DocSection>

            <DocSection id="contrato">
              <SectionTitle step="03 · Contrato" title="Um evento enxuto para o CRM" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">O parceiro envia apenas os dados do lead. Empresa, agente, instância, etapa, vendedor e status são resolvidos pela conexão e nunca vêm no payload.</p>
              <CodeBlock label="POST endpoint" code={`POST ${endpoint}`} />
              <CodeBlock label="application/json" code={payload} />
              <Note title="A origem vem da conexão">Para leads criados por este fluxo, <code className="font-mono">Crm.leads.&quot;Fonte&quot;</code> recebe o nome da conexão. Uma origem já existente não é sobrescrita em atualizações.</Note>
            </DocSection>

            <DocSection id="seguranca">
              <SectionTitle step="04 · Segurança" title="Assinar o corpo exato" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">O segredo fica no backend parceiro. Cada requisição deve usar timestamp, chave de idempotência e HMAC calculado sobre o corpo bruto.</p>
              <CodeBlock label="Regra da assinatura" code={signatureRule} />
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" />
                <p className="text-sm leading-6 text-[var(--color-gray-700)]">Use <code className="font-mono">Idempotency-Key</code>, <code className="font-mono">X-Leads-Timestamp</code> e <code className="font-mono">X-Leads-Signature</code>. A janela de timestamp evita replays; a chave evita duplicar o lead e a nota.</p>
              </div>
            </DocSection>

            <DocSection id="processamento">
              <SectionTitle step="05 · Processamento" title="O que acontece depois do POST" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Localizar a conexão e confirmar que está ativa.',
                  'Validar assinatura, timestamp, idempotência e agente.',
                  'Derivar a instância e normalizar o telefone.',
                  'Criar ou atualizar o lead dentro da mesma empresa.',
                  'Aplicar etapa e instância padrão somente na criação.',
                  'Acrescentar nota, vincular tags existentes e registrar o agente.',
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4">
                    <span className="font-mono text-xs font-bold text-[var(--color-primary-600)]">{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-sm leading-6 text-[var(--color-gray-700)]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4">
                <Tags className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" />
                <p className="text-sm leading-6 text-[var(--color-gray-700)]">Tags inexistentes são ignoradas e retornadas em <code className="font-mono">ignored_tags</code>. Tags existentes são acumuladas; nenhuma tag antiga é removida.</p>
              </div>
            </DocSection>

            <DocSection id="rastreabilidade">
              <SectionTitle step="06 · Rastreabilidade" title="O lead já nasce com memória do agente" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">Como o lead ainda não possui uma relação direta com o agente, o recebimento registra a atribuição inicial em <code className="font-mono">first_touch_attribution</code>.</p>
              <CodeBlock label="first_touch_attribution" code={'{\n  "sourceType": "lead_webhook",\n  "connectionName": "Campanha Maio",\n  "agentId": "uuid-do-agente",\n  "agentName": "Bento",\n  "instanceName": "Loja Centro"\n}'} />
              <Note title="Por que registrar agora?">Se a conexão for editada depois, a Parte 2 ainda conseguirá saber qual agente foi responsável pelo primeiro recebimento.</Note>
            </DocSection>

            <DocSection id="respostas">
              <SectionTitle step="07 · Operação" title="Respostas previsíveis e retentativas seguras" />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <FlowCard icon={CheckCircle2} title="202 Accepted" text="Evento aceito ou reconhecido como duplicado idempotente." />
                <FlowCard icon={ShieldCheck} title="401 / 409" text="Credencial inválida, conflito de idempotência ou conexão inconsistente." />
                <FlowCard icon={Webhook} title="429 / 503" text="Falha temporária: repetir com backoff e a mesma chave." />
              </div>
              <p className="mt-5 leading-7 text-[var(--color-gray-700)]">O mesmo evento reenviado com a mesma chave não duplica lead, observação ou vínculo de tags. Para falhas temporárias, o parceiro pode repetir mantendo a chave e gerando timestamp e assinatura novos.</p>
            </DocSection>

            <DocSection id="parte-dois">
              <SectionTitle step="08 · Visão futura" title="Parte 2 — atendimento do lead" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">Esta rodada não gera mensagem nem executa IA. A estrutura editorial, porém, já reserva o próximo passo: o agente analisa o contexto recebido e decide o primeiro contato.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5">
                  <MessageSquareText className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold">Mensagem de texto</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">Usar a observação, tags e atribuição como contexto para gerar uma abordagem coerente.</p>
                </div>
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5">
                  <ImageIcon className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold">Disparo de imagem</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">A mensagem poderá apontar para uma imagem hospedada no storage do usuário, desde que o link seja público, direto, HTTPS e acessível pelo provedor.</p>
                </div>
              </div>
              <CodeBlock label="Contrato futuro · não implementado nesta rodada" code={futureMediaPayload} />
              <Note title="Critério de preparação">A Parte 1 preserva o contexto e o agente correto. A Parte 2 poderá adicionar texto, imagem e legenda sem alterar o contrato de entrada do lead.</Note>
            </DocSection>

            <DocSection id="openapi">
              <SectionTitle step="09 · Referência" title="OpenAPI como contrato; editorial como guia" />
              <p className="mt-4 leading-7 text-[var(--color-gray-700)]">Swagger/OpenAPI se aplica à parte técnica: descreve endpoint, headers, payloads e respostas para quem vai programar. A explicação de contexto, decisões e limites continua nesta página editorial.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/contracts/leads/lead-webhook-v1.openapi.yaml" download className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--color-surface-2)] px-4 py-2 text-sm font-semibold text-[var(--color-gray-700)] hover:bg-white focus-visible:shadow-focus focus-visible:outline-none">
                  <Braces className="h-4 w-4" aria-hidden="true" />
                  Baixar OpenAPI YAML
                </a>
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white">
                <LeadSwaggerExplorer />
              </div>
              <Note title="Decisão editorial">O explorador é somente leitura: o botão de execução real permanece desabilitado. Como o endpoint é por conexão e usa segredo HMAC, o parceiro pode baixar o contrato e implementá-lo com segurança.</Note>
            </DocSection>

            <DocSection id="checklist">
              <SectionTitle step="10 · Finalização" title="Checklist da integração" />
              <ul className="mt-6 grid gap-3">
                {[
                  'Conexão vinculada a agente primary ativo e com instance_name válido.',
                  'Etapa padrão pertence à mesma empresa.',
                  'URL e segredo guardados somente no backend parceiro.',
                  'Payload contém nome e telefone, sem dados de roteamento.',
                  'HMAC calculado sobre o corpo bruto.',
                  'Idempotency-Key preservada nas retentativas.',
                  'Fonte, instância, etapa, observação e tags aparecem no Kanban.',
                  'Nenhum agente ou provedor de mensagens é executado na Parte 1.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[var(--color-gray-700)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </DocSection>
          </article>
        </div>
      </main>

      <footer className="mt-12 border-t border-[var(--border-default)] bg-[var(--color-surface-2)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-[var(--color-gray-600)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Its Time CRM · Documentação para desenvolvedores</p>
          <a className="rounded-md font-medium hover:text-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none" href="mailto:matheus@itstime.pro">Precisa de ajuda?</a>
        </div>
      </footer>
    </div>
  );
}
