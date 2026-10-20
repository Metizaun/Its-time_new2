import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { DocumentationSidebar } from "../DocumentationSidebar";
import { CopyButton } from "../webhook-cobranca/CopyButton";

export const metadata: Metadata = {
  title: "Jornadas RB · Documentação Its Time",
  description: "Contrato v1 das Jornadas Registro Base: eventos, assinatura HMAC, pedidos, receitas oftalmológicas, consentimento e aniversários.",
  alternates: { canonical: "/dev/documentacao/jornadas-rb" },
};

const endpoint = "https://api.itstime.pro/api/integrations/rb/v1/connections/{publicConnectionId}/events";
const sections = [
  ["inicio", "Início rápido"],
  ["configuracao", "Conexão e credenciais"],
  ["autenticacao", "Autenticação HMAC"],
  ["payload", "Payload e campos"],
  ["eventos", "Tipos de evento"],
  ["exemplo", "Exemplo Node.js"],
  ["respostas", "Respostas e retentativas"],
  ["automacoes", "Automações e variáveis"],
  ["consentimento", "Cancelamento e consentimento"],
  ["aniversarios", "Aniversários e importação"],
  ["administracao", "API administrativa"],
  ["operacao", "Operação e publicação"],
  ["checklist", "Checklist de homologação"],
] as const;

const payload = `{
  "event_id": "10000000-0000-4000-8000-000000000001",
  "event_type": "venda_convertida",
  "occurred_at": "2026-10-20T12:00:00-03:00",
  "ACES_ID": "70",
  "EMP_ID": "1",
  "CLIE_ID": "99",
  "ATEN_ID": "100",
  "ATEN_NO": "A-100",
  "customer": {
    "name": "Cliente",
    "phone": "+5541999990000",
    "email": "cliente@example.com",
    "birth_date": "1990-01-02",
    "whatsapp_consent": true
  },
  "order": {
    "total_amount": "125.50",
    "issued_at": "2026-10-20T12:00:00-03:00",
    "items": [{"id":"1", "description":"Lente", "total_amount":"125.50"}],
    "recipes": [{"id":"rx-1", "issued_at":"2026-10-20", "expires_at":"2027-10-20"}]
  }
}`;

const nodeExample = `// Node.js 18+ · salve o payload acima como evento.json.
// Configure RB_WEBHOOK_URL e RB_WEBHOOK_SECRET no ambiente do servidor.
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const url = process.env.RB_WEBHOOK_URL;
const secret = process.env.RB_WEBHOOK_SECRET;
if (!url || !secret) throw new Error('Configure a URL e o segredo da conexão');

const rawBody = await readFile('evento.json');
const event = JSON.parse(rawBody.toString('utf8'));
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac('sha256', secret)
  .update(timestamp + '.')
  .update(rawBody)
  .digest('hex');

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-RB-Timestamp': timestamp,
    'X-RB-Signature': 'sha256=' + signature,
    'Idempotency-Key': event.event_id,
  },
  body: rawBody,
});
console.log(response.status, await response.text());
// Nas retentativas: mesmos bytes e event_id; novo timestamp e HMAC.
// Para corrigir o conteúdo: use um novo event_id e atualize Idempotency-Key.`;

function CodeBlock({ label, code }: { label: string; code: string }) {
  return <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--color-gray-900)] shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <span className="font-mono text-xs uppercase tracking-wider text-white/65">{label}</span><CopyButton value={code} />
    </div>
    <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-6 text-white sm:p-5"><code>{code}</code></pre>
  </div>;
}

function Table({ headers, rows }: { headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-default)]">
    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
      <thead className="bg-[var(--color-surface-2)]"><tr>{headers.map(header => <th key={header} scope="col" className="border-b border-[var(--border-default)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row[0]} className={index % 2 ? "bg-[var(--color-surface-2)]" : "bg-[var(--color-surface-1)]"}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-[var(--border-subtle)] px-4 py-3 align-top leading-6 text-[var(--color-gray-700)]">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="mt-5 rounded-xl border border-[var(--border-default)] bg-[var(--color-primary-50)] p-4"><p className="font-semibold">{title}</p><div className="mt-1 text-sm leading-6 text-[var(--color-gray-700)]">{children}</div></aside>;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const index = sections.findIndex(section => section[0] === id);
  return <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">
    <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]"><span aria-hidden="true" className="h-0.5 w-5 bg-[var(--color-primary-500)]" />{String(index + 1).padStart(2, "0")} · Jornadas RB</p>
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    <div className="mt-4 space-y-4 leading-7 text-[var(--color-gray-700)]">{children}</div>
  </section>;
}

export default function RbJourneysDocumentationPage() {
  return <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--color-surface-overlay)] backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao site</Link>
        <span className="font-mono text-sm font-bold tracking-wider">ITS TIME <span className="text-[var(--color-primary-600)]">/ DEV</span></span>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" />
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">Documentação · Registro Base v1</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Jornadas RB</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">Conecte vendas, liberações e entregas do Registro Base às automações do CRM. Um guia para implementar os eventos, proteger o consentimento e homologar cada jornada.</p>
        <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{["POST · JSON", "HMAC-SHA256", "Contrato v1 · 20/10/2026"].map(label => <span key={label} className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">{label}</span>)}</div>
      </section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <DocumentationSidebar currentPath="/dev/documentacao/jornadas-rb" sections={sections} />
        <article className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
          <Section id="inicio" title="Uma conexão, jornadas por pedido">
            <p>A integração recebe eventos na conexão Registro Base já existente da conta. Não crie outra conexão: a URL usa <code>rb.connections.journeys_public_id</code>. O segredo de entrada é independente do token RB usado para consultas e Cobrança RB.</p>
            <ol className="list-decimal space-y-2 pl-5"><li>Obtenha a URL e gere o segredo em <strong>Conexões → Registro Base → Editar → Jornadas RB</strong>.</li><li>Configure remetente, gatilho e intervalos em <strong>Automações → Jornadas RB</strong> e ative o recebimento na conexão.</li><li>Monte o evento, assine os bytes exatos e envie. O HTTP confirma o ingresso; o processamento e o envio ocorrem depois.</li></ol>
            <CodeBlock label="Endpoint público" code={`POST ${endpoint}`} />
            <Note title="Disponibilidade depende da publicação">Os documentos de origem registram uma entrega local. A disponibilidade pública e o primeiro 202 real dependem da publicação e da homologação no ambiente de destino. Use a URL exibida pela conexão.</Note>
            <a href="/contracts/rb/rb-journeys-contract-v1.md" download className="inline-flex min-h-11 items-center rounded-lg font-semibold text-[var(--color-primary-600)] underline underline-offset-4 focus-visible:shadow-focus focus-visible:outline-none">Baixar contrato v1 (Markdown)</a>
          </Section>
          <Section id="configuracao" title="Conexão e credenciais">
            <p>Na aba <strong>Jornadas RB</strong>, gere a credencial, copie o segredo para o servidor RB e ative o recebimento. O segredo é exibido somente na resposta de geração/rotação. A primeira geração mantém a integração desativada até a ativação explícita. A aba <strong>Conexão</strong> preserva o token de consultas existente.</p>
            <p>A rotação mantém o segredo imediatamente anterior válido por 24 horas; uma segunda rotação substitui esse anterior. Guarde o segredo fora de navegador, código público e logs.</p>
            <Table headers={["Estado", "Significado"]} rows={[["unconfigured", "Sem segredo configurado."], ["paused", "Configurada e desativada."], ["waiting", "Ativada, ainda sem eventos."], ["receiving", "Com eventos recebidos."], ["error", "Evento bloqueado ou diagnóstico operacional não resolvido."]]} />
          </Section>
          <Section id="autenticacao" title="Autenticação HMAC">
            <p>Envie JSON UTF-8, sem compressão, com no máximo <strong>1 MiB</strong>. A assinatura é o hexadecimal de HMAC-SHA256 com o segredo da conexão.</p>
            <Table headers={["Cabeçalho", "Valor"]} rows={[["Content-Type", "application/json"], ["X-RB-Timestamp", "Unix timestamp em segundos; janela de ±300 segundos."], ["X-RB-Signature", "Hash hexadecimal; aceita prefixo sha256=."], ["Idempotency-Key", "UUID igual ao event_id do corpo."]]} />
            <CodeBlock label="Regra da assinatura" code={'signature = HMAC-SHA256(secret, timestamp + "." + rawBody)\nX-RB-Signature: sha256=<hash_hexadecimal>'} />
            <Note title="Assine o mesmo corpo que será enviado">Espaços e quebras de linha fazem parte da assinatura e do hash de idempotência. Não reserialize o JSON após assinar. Uma retentativa usa novo timestamp e assinatura, preservando os bytes do corpo.</Note>
          </Section>
          <Section id="payload" title="Payload e campos">
            <CodeBlock label="Venda convertida · JSON" code={payload} />
            <Table headers={["Campo", "Obrigatoriedade e formato"]} rows={[
              ["event_id / event_type / occurred_at", "Sempre obrigatórios. ID UUID; tipo listado neste guia; ocorrência ISO 8601 com fuso."],
              ["ACES_ID / EMP_ID", "Sempre obrigatórios. ACES_ID corresponde a rb_aces_id; EMP_ID pertence a rb_empresa_ids da mesma conexão."],
              ["CLIE_ID", "Obrigatório, exceto em pedido_cancelado."],
              ["ATEN_ID / ATEN_NO", "Obrigatórios, exceto em consentimento_revogado. Identificam o pedido."],
              ["customer", "Para eventos de mensagens: name, phone e whatsapp_consent:true explícito. email e birth_date enriquecem o cadastro."],
              ["customer.phone", "10 a 15 dígitos; números brasileiros sem DDI recebem 55 no processamento."],
              ["customer.birth_date", "Somente YYYY-MM-DD, entre 1900 e hoje."],
              ["order", "Nos eventos de mensagens: total_amount, issued_at, items e recipes."],
              ["order.total_amount", "Decimal não negativo, ponto e até duas casas. Prefira string; normalizado para duas casas."],
              ["order.issued_at", "Data YYYY-MM-DD ou ISO 8601 com fuso."],
              ["order.recipes[]", "Receitas oftalmológicas com id, issued_at e expires_at (data ou null quando desconhecida)."],
            ]} />
            <p>IDs aceitam strings ou inteiros seguros e são normalizados como strings. Envie strings para preservar zeros à esquerda. Detalhes adicionais em itens e receitas são preservados; envie somente os dados necessários à jornada, sem necessidade de medidas clínicas.</p>
            <Note title="Receita oftalmológica não é título financeiro">O total financeiro pertence a <code>order.total_amount</code>. Validade desconhecida é aceita no ingresso, mas a jornada dependente dela emite diagnóstico e aguarda novo evento corrigido. A Its Time não presume prazo de validade.</Note>
          </Section>
          <Section id="eventos" title="Quando enviar cada evento">
            <Table headers={["Evento", "Quando enviar", "Conteúdo adicional"]} rows={[
              ["venda_convertida", "Uma vez por venda convertida.", "Cliente com nome, telefone e consentimento true; pedido com total, emissão, itens e receitas."],
              ["mercadoria_liberada", "Em cada liberação; event_id próprio por liberação.", "Mesmo conteúdo completo de cliente e pedido."],
              ["venda_entregue", "Somente quando 100% do pedido foi entregue.", "Todos os itens e todas as receitas, inclusive de entregas anteriores."],
              ["pedido_cancelado", "Ao cancelar o pedido.", "IDs do pedido, escopo e ocorrência. Dispensa telefone, consentimento e order; CLIE_ID opcional."],
              ["consentimento_revogado", "Ao revogar o consentimento do cliente.", "CLIE_ID, escopo e ocorrência. Dispensa pedido, atendimento e telefone."],
            ]} />
            <Note title="Entrega parcial não encerra a venda">O emissor confirma a integralidade de venda_entregue. O CRM recebe o retrato completo do pedido; não presume que a última liberação contém tudo.</Note>
            <CodeBlock label="Cancelamento · exemplo mínimo" code={'{\n  "event_id": "10000000-0000-4000-8000-000000000002",\n  "event_type": "pedido_cancelado",\n  "occurred_at": "2026-10-20T13:00:00-03:00",\n  "ACES_ID": "70", "EMP_ID": "1",\n  "ATEN_ID": "100", "ATEN_NO": "A-100"\n}'} />
            <CodeBlock label="Revogação · exemplo mínimo" code={'{\n  "event_id": "10000000-0000-4000-8000-000000000003",\n  "event_type": "consentimento_revogado",\n  "occurred_at": "2026-10-20T14:00:00-03:00",\n  "ACES_ID": "70", "EMP_ID": "1", "CLIE_ID": "99"\n}'} />
          </Section>
          <Section id="exemplo" title="Assinar e enviar com Node.js">
            <p>Salve como <code>enviar.mjs</code> e execute com <code>node enviar.mjs</code>. Use a URL real copiada da conexão e o segredo de entrada. Cada evento novo precisa de seu próprio UUID.</p>
            <CodeBlock label="Node.js · HMAC e POST" code={nodeExample} />
          </Section>
          <Section id="respostas" title="Respostas e retentativas">
            <CodeBlock label="Evento persistido · 202" code={'{"accepted":true,"duplicate":false,"eventId":"10000000-0000-4000-8000-000000000001"}'} />
            <p>O <strong>202</strong> só é retornado após persistir a inbox. A repetição do mesmo evento com os mesmos bytes retorna <strong>200</strong> com <code>duplicate:true</code>. Mesmo ID com bytes diferentes retorna <strong>409 RB_JOURNEYS_IDEMPOTENCY_CONFLICT</strong>. A regra persiste após reinício e serializa eventos por conexão para evitar corridas. Para corrigir conteúdo, gere novo <code>event_id</code>.</p>
            <Table headers={["HTTP", "Significado / ação"]} rows={[
              ["400", "JSON ou identificador inválido. Corrija a requisição."], ["401", "Assinatura inválida ou expirada. Confira segredo, relógio e bytes."],
              ["403", "Escopo divergente: confira acesso e empresa."], ["404", "Conexão não encontrada. Confira a URL pública."],
              ["409", "Conflito de payload; na API administrativa, também credencial ausente ao ativar."], ["413 / 415 / 422", "Corpo acima de 1 MiB / tipo de conteúdo incorreto / contrato inválido."],
              ["429", "Limite persistente de 120 requisições aceitas/repetidas por minuto e conexão. Retry-After: 60."],
              ["503", "Jornadas pausadas ou conexão RB inativa. Retome antes de reenviar."],
            ]} />
            <p>Em falha de persistência, indisponibilidade ou pausa, não há 202. Repita com o mesmo corpo e ID, gerando novo timestamp/HMAC. Respeite o <code>Retry-After</code> e aplique espera crescente nas falhas transitórias. Receber o evento não confirma envio ou entrega no WhatsApp.</p>
          </Section>
          <Section id="automacoes" title="Automações e dados de cada pedido">
            <p>Mensagens, remetente e intervalos são definidos em <strong>Automações</strong>, origem <strong>Jornadas RB</strong>. Cada execução guarda o retrato do seu evento sem substituir metadados da cobrança.</p>
            <Table headers={["Gatilho", "Marco dos intervalos", "Identidade da execução"]} rows={[
              ["Venda convertida", "occurred_at da conversão", "Conexão, versão do acesso RB, empresa e pedido; uma entrada por automação."],
              ["Mercadoria liberada", "occurred_at da liberação", "Mesmo escopo + event_id. Liberações diferentes podem entrar novamente."],
              ["Venda entregue", "occurred_at da entrega integral", "Conexão, versão do acesso RB, empresa e pedido; uma entrada por automação."],
              ["Receita oftalmológica vencida", "expires_at de cada receita, após venda_entregue", "Mesmo escopo do pedido + receita e validade."],
              ["Aniversário", "Data anual de nascimento em America/Sao_Paulo", "Contato, automação e ano. Correção antes do envio substitui o agendamento."],
            ]} />
            <p>Datas sem horário usam meia-noite em São Paulo; o intervalo da automação determina o horário desejado.</p>
            <CodeBlock label="Variáveis em textos, templates e instruções de IA" code={'rb.order_number\nrb.order_total\nrb.order_issued_at\nrb.event_type\nrb.company_id\nrb.recipe_date\nrb.recipe_expiry\nrb.items'} />
            <p>A IA trata o conteúdo recebido como dados e não executa instruções contidas nele. O contato é identificado pelo vínculo RB existente ou por telefone único na mesma conta; contatos ambíguos não são escolhidos arbitrariamente.</p>
            <Note title="Destino de novos contatos">Para criar um contato, deve existir uma única instância entre as Automações RB ativas da conexão. Sem destino ou com vários, o evento fica bloqueado com <code className="break-all">RB_INSTANCE_UNDEFINED_OR_AMBIGUOUS</code>. Ajuste as automações e use <strong>Tentar novamente</strong>. Contatos identificados usam sua própria instância. O remetente precisa de agente principal ativo associado.</Note>
          </Section>
          <Section id="consentimento" title="Cancelamento, consentimento e ordem de chegada">
            <p>Cancelamento é definitivo na v1. Interrompe ações pendentes do pedido, empresa e acesso RB informados, inclusive ações preparadas pelo worker. Não altera Cobrança RB nem aniversários sem pedido. Evento antigo não reativa pedido cancelado. Uma chamada ao provedor já iniciada não pode ser desfeita.</p>
            <p>Eventos de mensagens exigem <code>customer.whatsapp_consent:true</code> explícito. Cancelamento e revogação continuam aceitos sem telefone. A revogação é registrada antes de confirmar o ingresso, interrompe novas jornadas pendentes do contato e é revalidada imediatamente antes do disparo.</p>
            <p>Prevalece a observação de consentimento mais recente; em empate, a revogação. Eventos atrasados não restauram permissão nem nascimento anterior. Novo consentimento explícito posterior à revogação pode autorizar jornadas futuras.</p>
            <p>Não há erro genérico por evento fora de ordem: cada evento é persistido e avaliado por essas regras. Estornos, trocas, devoluções e reabertura estão fora da v1.</p>
          </Section>
          <Section id="aniversarios" title="Aniversários e importação">
            <p>O aniversário usa a base estruturada: o RB não precisa enviar evento a cada aniversário. Nascimento recebido em conversão ou importação atualiza o perfil. A agenda anual usa <code>America/Sao_Paulo</code>; 29/02 vira 28/02 em anos não bissextos.</p>
            <p>Correção de nascimento antes do envio substitui o agendamento. Após o envio, não cria outro aniversário no mesmo ano. Aniversários antigos não são recuperados retroativamente.</p>
            <CodeBlock label="CSV · exemplo" code={'nome,telefone,data_nascimento,consentimento_whatsapp\nCliente,5541999990000,1990-01-02,S'} />
            <p><code>nome</code> e <code>telefone</code> continuam obrigatórios. <code>data_nascimento</code> aceita AAAA-MM-DD ou DD/MM/AAAA; <code>consentimento_whatsapp</code> aceita S/N. A importação atualiza contatos existentes com autorização de edição da conta. Campos omitidos preservam os valores atuais; coluna de consentimento vazia não presume autorização.</p>
          </Section>
          <Section id="administracao" title="API administrativa da conexão">
            <p>Requer sessão autenticada de administrador da conta. Todas as respostas usam <code>Cache-Control: no-store</code>. O <code>:id</code> identifica a conexão administrativa; o webhook utiliza seu identificador público.</p>
            <Table headers={["Método e rota", "Corpo / resultado"]} rows={[
              ["GET /api/rb/connections/:id/journeys", "Consulta settings no envelope {success:true,settings:{...}}."],
              ["POST /api/rb/connections/:id/journeys", "{enabled:true|false}; retorna o mesmo envelope. Ativação exige credencial."],
              ["POST /api/rb/connections/:id/journeys/rotate-secret", "Retorna {success:true,settings:{...},secret:\"...\"}. Única exibição do segredo."],
              ["POST /api/rb/connections/:id/journeys/retry", "Repõe eventos bloqueados na fila com tentativas zeradas; retorna o envelope de settings."],
            ]} />
            <CodeBlock label="Campos de settings" code={'connectionId, publicConnectionId, webhookUrl, credentialConfigured,\nenabled, status, lastReceivedAt, lastEventType, lastError,\npendingCount, blockedCount'} />
            <p><code>lastReceivedAt</code> é a data de recebimento, não a ocorrência. <code>pendingCount</code> conta pendentes/em processamento; <code>blockedCount</code>, os que exigem intervenção. <code>lastError</code> inclui diagnósticos não resolvidos, como receita sem vencimento.</p>
          </Section>
          <Section id="operacao" title="Operação e publicação">
            <ol className="list-decimal space-y-3 pl-5">
              <li>Aplique, nessa ordem, <code className="break-all">20261020135424_rb_journeys_ingress.sql</code> e <code className="break-all">20261020135625_rb_journeys_automations.sql</code>. Dependem das migrations anteriores de RB, consultas de clientes e Automações. Execute o preflight de tabelas e colunas do repositório.</li>
              <li>Configure a chave de criptografia e a URL pública do backend. Guarde a chave junto dos backups; o RB recebe somente o segredo da sua conexão.</li>
              <li>Publique backend, frontend e a função <code>import-leads-csv</code>, incluindo <code>_shared/lead-import-profile.ts</code>, <code>deno.json</code> e lockfile. O worker de Automações existente efetua os disparos.</li>
              <li>Ative o worker de ingresso e homologue os eventos. Tentativas usam espera crescente; após oito falhas, o evento fica bloqueado e pode ser retomado pelo administrador. Processamento interrompido é recuperado após cinco minutos com novo identificador de tentativa, invalidando o anterior.</li>
            </ol>
            <CodeBlock label="Variáveis do backend" code={'RB_JOURNEYS_SECRETS_ENCRYPTION_KEY=<32 bytes em hex ou base64>\nRB_JOURNEYS_SECRETS_ENCRYPTION_KEY_VERSION=v1\nCRM_BACKEND_PUBLIC_URL=<URL pública do backend>\nRB_JOURNEYS_WORKER_ENABLED=true\nRB_JOURNEYS_WORKER_POLL_MS=30000'} />
            <p>As credenciais são cifradas com AES-256-GCM. A versão identifica a chave configurada; trocar a chave exige migrar as credenciais cifradas, além de alterar a variável. Credenciais/inbox e RPCs são restritos ao serviço; nenhum disparo ocorre no HTTP de ingresso.</p>
            <p>Pausar Jornadas RB retorna 503 para novos eventos e posterga processamento e disparos pendentes, preservando a fila. Retomar continua o trabalho. Trocar o acesso/base RB invalida execuções da identidade anterior; eventos aceitos não são transferidos à nova identidade.</p>
            <Note title="Corrigir dados é diferente de tentar novamente">Receita sem validade exige novo evento com novo event_id e o vencimento da mesma receita/pedido; o diagnóstico correspondente é resolvido ao receber a correção. <strong>Tentar novamente</strong> preserva o evento original e trata falhas de processamento.</Note>
          </Section>
          <Section id="checklist" title="Checklist de homologação">
            <ul className="space-y-3">{[
              "Validar a publicação, migrations, chave, worker e conexão ativa no ambiente de destino.",
              "Homologar os cinco tipos de evento; só enviar venda_entregue após a entrega integral.",
              "Validar 202 persistido, repetição 200 e conflito 409 para o mesmo ID com bytes diferentes.",
              "Rejeitar assinatura expirada/inválida e acesso ou empresa fora do escopo da conexão.",
              "Simular indisponibilidade, pausa/retomada e bloqueio por instância ambígua; recuperar sem duplicar ações.",
              "Validar execuções independentes de pedidos e liberações; conferir as oito variáveis RB.",
              "Testar cancelamento e revogação antes do disparo, eventos atrasados e novo consentimento posterior.",
              "Homologar receita sem validade e correção com novo evento, sem prazo presumido.",
              "Validar aniversário por evento/importação, correção de nascimento e política de 29/02.",
              "Testar rotação do segredo e alinhar o uso da credencial atual com o responsável RB.",
            ].map(item => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" /><span>{item}</span></li>)}</ul>
          </Section>
        </article>
      </div>
    </main>
  </div>;
}
