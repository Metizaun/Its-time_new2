import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Braces, CheckCircle2, ExternalLink, KeyRound, RefreshCw, Webhook } from "lucide-react";
import type { ReactNode } from "react";

import { CopyButton } from "../webhook-cobranca/CopyButton";
import { AgendaSectionNumberTracker } from "./AgendaSectionNumberTracker";
import { SwaggerExplorer } from "./SwaggerExplorer";

export const metadata: Metadata = {
  title: "Agenda Universal · Documentação Its Time",
  description: "Guia técnico para integrar sistemas parceiros à Agenda Universal do Its Time por webhooks.",
  alternates: { canonical: "/dev/documentacao/agenda" },
};

const inboundEndpoint = "https://api.itstime.pro/api/integrations/agenda/v1/connections/{publicConnectionId}/events";

const inboundPayload = `{
  "schemaVersion": "1.0",
  "eventId": "4b1d2d8a-5bd2-4f4c-9a9e-26a9a0e2d001",
  "eventType": "appointment.status_reported",
  "occurredAt": "2026-09-15T18:00:00Z",
  "resource": {
    "appointmentId": "6f0f3d0f-9db5-4f35-a6e8-0a0c4d0e1001",
    "status": "done",
    "reason": null,
    "reportedAt": "2026-09-15T18:00:00Z",
    "baseResourceVersion": 7,
    "metadata": { "source": "reception" }
  }
}`;

const outboundPayload = `{
  "schemaVersion": "1.0",
  "eventId": "9c0c3d11-1e3e-4a18-8c19-02ab7c4d2001",
  "eventType": "appointment.created",
  "occurredAt": "2026-09-15T15:00:00Z",
  "resourceVersion": 1,
  "resource": {
    "id": "6f0f3d0f-9db5-4f35-a6e8-0a0c4d0e1001",
    "status": "scheduled",
    "startTime": "2026-09-20T14:00:00Z",
    "endTime": "2026-09-20T14:30:00Z",
    "timezone": "America/Sao_Paulo",
    "durationMinutes": 30,
    "unitId": "7de2e00c-0b1e-4f3a-9c2b-01c8b6d30001",
    "professionalId": "8de2e00c-0b1e-4f3a-9c2b-01c8b6d30001",
    "assignmentId": "9de2e00c-0b1e-4f3a-9c2b-01c8b6d30001",
    "patientId": "0de2e00c-0b1e-4f3a-9c2b-01c8b6d30001",
    "service": {
      "id": "1de2e00c-0b1e-4f3a-9c2b-01c8b6d30001",
      "name": "Consulta",
      "durationMinutes": 30,
      "price": "123.45",
      "currency": "BRL"
    },
    "origin": "api",
    "notes": null,
    "cancelReason": null,
    "metadata": {},
    "updatedAt": "2026-09-15T15:00:00Z"
  }
}`;

const curlExample = `URL="${inboundEndpoint}"
SECRET="SEU_INBOUND_SECRET"
TIMESTAMP=$(date +%s)
EVENT_ID="4b1d2d8a-5bd2-4f4c-9a9e-26a9a0e2d001"
BODY='{"schemaVersion":"1.0","eventId":"4b1d2d8a-5bd2-4f4c-9a9e-26a9a0e2d001","eventType":"appointment.status_reported","occurredAt":"2026-09-15T18:00:00Z","resource":{"appointmentId":"6f0f3d0f-9db5-4f35-a6e8-0a0c4d0e1001","status":"done","reason":null,"reportedAt":"2026-09-15T18:00:00Z","baseResourceVersion":7,"metadata":{"source":"reception"}}}'
SIGNATURE=$(printf '%s.%s' "$TIMESTAMP" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.* //')

curl --request POST "$URL" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: $EVENT_ID" \
  --header "X-Agenda-Timestamp: $TIMESTAMP" \
  --header "X-Agenda-Signature: sha256=$SIGNATURE" \
  --data-raw "$BODY"`;

const nodeExample = `import { createHmac, randomUUID } from "node:crypto";

const url = "${inboundEndpoint}";
const secret = process.env.AGENDA_INBOUND_SECRET;
const eventId = randomUUID();
const timestamp = Math.floor(Date.now() / 1000).toString();
const payload = {
  schemaVersion: "1.0",
  eventId,
  eventType: "appointment.status_reported",
  occurredAt: new Date().toISOString(),
  resource: {
    appointmentId: "6f0f3d0f-9db5-4f35-a6e8-0a0c4d0e1001",
    status: "no_show",
    reason: "Paciente não compareceu",
    reportedAt: new Date().toISOString(),
    baseResourceVersion: 7,
    metadata: { source: "reception" }
  }
};
const rawBody = JSON.stringify(payload);
const signature = createHmac("sha256", secret)
  .update(\`${"${timestamp}"}.\${rawBody}\`)
  .digest("hex");

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Idempotency-Key": eventId,
    "X-Agenda-Timestamp": timestamp,
    "X-Agenda-Signature": \`sha256=\${signature}\`
  },
  body: rawBody
});

console.log(response.status, await response.text());`;

const pythonExample = `import hashlib
import hmac
import json
import os
import time
import uuid
import requests

event_id = str(uuid.uuid4())
timestamp = str(int(time.time()))
payload = {
    "schemaVersion": "1.0",
    "eventId": event_id,
    "eventType": "appointment.status_reported",
    "occurredAt": "2026-09-15T18:00:00Z",
    "resource": {
        "appointmentId": "6f0f3d0f-9db5-4f35-a6e8-0a0c4d0e1001",
        "status": "done",
        "reason": None,
        "reportedAt": "2026-09-15T18:00:00Z",
        "baseResourceVersion": 7,
        "metadata": {"source": "reception"},
    },
}
raw_body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
digest = hmac.new(
    os.environ["AGENDA_INBOUND_SECRET"].encode("utf-8"),
    timestamp.encode("ascii") + b"." + raw_body,
    hashlib.sha256,
).hexdigest()

response = requests.post(
    "${inboundEndpoint}",
    data=raw_body,
    headers={
        "Content-Type": "application/json",
        "Idempotency-Key": event_id,
        "X-Agenda-Timestamp": timestamp,
        "X-Agenda-Signature": f"sha256={digest}",
    },
    timeout=10,
)
print(response.status_code, response.text)`;

const sections = [
  ["inicio", "Comece aqui"],
  ["modelo", "Modelo"],
  ["credenciais", "Credenciais"],
  ["autenticacao", "HMAC"],
  ["eventos", "Eventos"],
  ["retorno", "Reportar status"],
  ["exemplos", "Exemplos"],
  ["respostas", "Respostas"],
  ["swagger", "Swagger"],
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
      <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-6 text-white sm:p-5"><code>{code}</code></pre>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-default)]">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead className="bg-[var(--color-surface-2)]">
          <tr>{headers.map((header) => <th key={header} className="border-b border-[var(--border-default)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`} className={index % 2 ? "bg-[var(--color-surface-2)]/50" : "bg-white"}>
              {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="border-b border-[var(--border-subtle)] px-4 py-3 align-top text-[var(--color-gray-700)] last:border-b-0"><code className="font-mono text-[13px] text-[var(--color-gray-900)]">{cell}</code></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="mt-5 rounded-xl border border-[var(--color-primary-500)]/25 bg-[var(--color-primary-50)] p-4"><p className="font-semibold text-[var(--color-gray-900)]">{title}</p><div className="mt-1 text-sm leading-6 text-[var(--color-gray-700)]">{children}</div></aside>;
}

function DocSection({ id, children }: { id: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">{children}</section>;
}

export default function AgendaDocumentationPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[color:rgba(247,246,244,0.92)] backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />Voltar ao site</Link>
          <span className="font-mono text-sm font-bold tracking-wider">ITS TIME <span className="text-[var(--color-primary-600)]">/ DEV</span></span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <AgendaSectionNumberTracker sectionIds={sections.map(([id]) => id)} />
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14">
          <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" />
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">Documentação · Agenda Universal v1</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">Integre a agenda por webhooks</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">Receba o espelho dos agendamentos no seu sistema e devolva ao Its Time apenas o resultado do atendimento.</p>
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]"><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">WEBHOOKS BIDIRECIONAIS</span><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">JSON</span><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">HMAC-SHA256</span></div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24"><nav aria-label="Nesta página" className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4 shadow-sm"><p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">Nesta página</p><ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">{sections.map(([id, title], index) => <li key={id}><a href={`#${id}`} className="flex min-h-10 items-center rounded-lg px-2 py-2 text-sm text-[var(--color-gray-600)] hover:bg-white hover:text-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none"><span className="mr-2 font-mono text-xs text-[var(--color-gray-400)]">{String(index + 1).padStart(2, "0")}</span>{title}</a></li>)}</ol></nav></aside>

          <article className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
            <DocSection id="inicio"><SectionTitle step="01 · Comece aqui" title="Início rápido" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">A integração tem duas URLs e muitos tipos de evento. O Its Time envia a agenda para o webhook do parceiro; o parceiro envia de volta somente o resultado do atendimento.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[[KeyRound, "1. Crie a conexão", "O administrador cadastra a URL do webhook e recebe os segredos."], [Webhook, "2. Receba eventos", "Valide a assinatura e persista os eventos de forma idempotente."], [RefreshCw, "3. Reporte o resultado", "Envie done ou no_show referenciando o appointmentId do Its Time."]].map(([Icon, title, text]) => { const CardIcon = Icon as typeof KeyRound; return <div key={String(title)} className="rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4"><CardIcon className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" /><h3 className="mt-3 font-semibold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">{String(text)}</p></div>; })}</div><CodeBlock label="Endpoint de retorno" code={`POST ${inboundEndpoint}`} /></DocSection>

            <DocSection id="modelo"><SectionTitle step="02 · Modelo" title="O Its Time é a autoridade da agenda" /><div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5"><p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">Its Time → parceiro</p><h3 className="mt-3 text-lg font-bold">Webhook de sincronização</h3><p className="mt-2 text-sm leading-6 text-[var(--color-gray-700)]">Envia unidades, profissionais, disponibilidade, pacientes e alterações de agendamento para a URL cadastrada na conexão.</p></div><div className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-5"><p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">Parceiro → Its Time</p><h3 className="mt-3 text-lg font-bold">Webhook de resultado</h3><p className="mt-2 text-sm leading-6 text-[var(--color-gray-700)]">Recebe somente <code className="font-mono">appointment.status_reported</code>, com status <code className="font-mono">done</code> ou <code className="font-mono">no_show</code>.</p></div></div><Note title="Não é uma API CRUD de agendamentos">Na v1, o parceiro não cria, altera horário, cancela nem configura agendamentos. Todos os IDs do contrato são UUIDs do Its Time; mantenha a correspondência com os IDs internos do seu sistema.</Note></DocSection>

            <DocSection id="credenciais"><SectionTitle step="03 · Preparação" title="Credenciais e ativação" /><ol className="mt-5 grid gap-3 text-[var(--color-gray-700)]"><li className="flex gap-3"><span className="font-mono text-[var(--color-primary-600)]">01</span><span>O administrador cria a conexão em <strong>Conexões → Integrações → Agenda Universal</strong>.</span></li><li className="flex gap-3"><span className="font-mono text-[var(--color-primary-600)]">02</span><span>O administrador informa a URL HTTPS pública que receberá os eventos.</span></li><li className="flex gap-3"><span className="font-mono text-[var(--color-primary-600)]">03</span><span>O Its Time gera <code className="font-mono">publicConnectionId</code>, <code className="font-mono">inboundSecret</code> e <code className="font-mono">outboundSecret</code>.</span></li><li className="flex gap-3"><span className="font-mono text-[var(--color-primary-600)]">04</span><span>O administrador executa o teste e ativa a conexão; a ativação inicia a ressincronização inicial.</span></li></ol><Table headers={["Segredo", "Usado por", "Finalidade"]} rows={[["inboundSecret", "Parceiro", "Assinar eventos enviados ao Its Time."], ["outboundSecret", "Its Time", "Assinar webhooks enviados ao parceiro."]]}/><Note title="Trate os segredos como senhas">Guarde-os no servidor ou em um gerenciador de segredos. Nunca os exponha no navegador, aplicativo mobile, repositório ou log.</Note></DocSection>

            <DocSection id="autenticacao"><SectionTitle step="04 · Segurança" title="Autenticação HMAC" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Todas as requisições usam JSON e os mesmos cabeçalhos de segurança. A assinatura deve ser calculada sobre os bytes exatos que serão enviados.</p><CodeBlock label="Regra da assinatura" code={'signature = HMAC-SHA256(secret, timestamp + "." + rawBody)\nX-Agenda-Signature: sha256=<hash_hexadecimal>'}/><Table headers={["Cabeçalho", "Regra"]} rows={[["Content-Type", "application/json"], ["Idempotency-Key", "UUID idêntico, byte a byte, ao eventId"], ["X-Agenda-Timestamp", "Unix timestamp em segundos ou milissegundos"], ["X-Agenda-Signature", "sha256= seguido do HMAC-SHA256 hexadecimal"]]}/><Note title="Janela de cinco minutos">Não reformate o JSON depois de assinar. Espaços, quebras de linha e ordem das propriedades alteram os bytes e invalidam a assinatura.</Note></DocSection>

            <DocSection id="eventos"><SectionTitle step="05 · Its Time → parceiro" title="Eventos enviados para seu webhook" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Todos os eventos usam a mesma URL. O tipo fica no campo <code className="font-mono">eventType</code>.</p><Table headers={["eventType", "Uso"]} rows={[["integration.test", "Teste de conexão."], ["unit.upserted", "Unidade criada ou atualizada."], ["professional.upserted", "Profissional criado ou atualizado."], ["availability.upserted", "Grade ou exceção de disponibilidade atualizada."], ["patient.upserted", "Paciente criado ou atualizado."], ["appointment.created", "Novo agendamento."], ["appointment.rescheduled", "Horário alterado."], ["appointment.cancelled", "Agendamento cancelado."], ["appointment.status_changed", "Status alterado no Its Time."]]}/><CodeBlock label="Envelope outbound" code={outboundPayload}/><Note title="Compatibilidade futura">Ignore <code className="font-mono">eventType</code> e campos desconhecidos que você não suporta, respondendo com qualquer status <code className="font-mono">2xx</code>. Isso permite evoluir o contrato sem quebrar integrações antigas.</Note></DocSection>

            <DocSection id="retorno"><SectionTitle step="06 · Parceiro → Its Time" title="Reportar o resultado do atendimento" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Envie o evento somente quando o atendimento tiver um resultado final. O <code className="font-mono">baseResourceVersion</code> deve ser a última versão do agendamento que o parceiro conhece.</p><CodeBlock label="Endpoint" code={`POST ${inboundEndpoint}`}/><CodeBlock label="Payload" code={inboundPayload}/><Table headers={["Campo", "Valores"]} rows={[["eventType", "appointment.status_reported"], ["resource.status", "done ou no_show"], ["resource.appointmentId", "UUID do agendamento recebido do Its Time"], ["resource.baseResourceVersion", "Última resourceVersion conhecida pelo parceiro"]]}/><Note title="Conflito de versão">Se a versão estiver obsoleta, o Its Time responde <code className="font-mono">409 stale_resource_version</code>. Atualize o espelho antes de decidir se o resultado ainda deve ser reenviado.</Note></DocSection>

            <DocSection id="exemplos"><SectionTitle step="07 · Implementação" title="Exemplos de envio" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Os exemplos abaixo usam o <code className="font-mono">inboundSecret</code> e enviam o mesmo corpo que foi assinado.</p><CodeBlock label="cURL / Bash" code={curlExample}/><CodeBlock label="Node.js 18+" code={nodeExample}/><CodeBlock label="Python 3.10+" code={pythonExample}/></DocSection>

            <DocSection id="respostas"><SectionTitle step="08 · Operação" title="Respostas, erros e retentativas" /><CodeBlock label="202 Accepted" code={'{\n  "accepted": true,\n  "duplicate": false,\n  "eventId": "4b1d2d8a-5bd2-4f4c-9a9e-26a9a0e2d001",\n  "resourceVersion": 8\n}'}/><Table headers={["HTTP", "Significado", "Ação"]} rows={[["200", "Evento desconhecido ou recibo já concluído.", "Não repetir sem necessidade."], ["202", "Evento aceito ou duplicado idempotente.", "Marcar como entregue."], ["400", "JSON, cabeçalho ou Idempotency-Key inválido.", "Corrigir antes de repetir."], ["401", "Conexão, timestamp ou assinatura inválidos.", "Revisar segredo, relógio e corpo bruto."], ["404", "Agendamento não encontrado na conexão.", "Não adivinhar por telefone/data."], ["409", "Idempotência em conflito ou resourceVersion obsoleta.", "Reconciliar o espelho."], ["422", "Transição de status inválida.", "Corrigir o estado enviado."], ["429", "Limite excedido.", "Respeitar Retry-After."], ["503", "Conexão pausada ou indisponível.", "Repetir com backoff."]]}/><p className="mt-5 leading-7 text-[var(--color-gray-700)]">Para o webhook do parceiro, o Its Time repete respostas <code className="font-mono">408</code>, <code className="font-mono">425</code>, <code className="font-mono">429</code> e <code className="font-mono">5xx</code>, além de falhas de rede. Use o mesmo <code className="font-mono">eventId</code> e o mesmo corpo ao repetir; gere apenas novo timestamp e assinatura.</p></DocSection>

            <DocSection id="swagger"><SectionTitle step="09 · Referência" title="Swagger e contratos" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Explore os dois sentidos da integração abaixo. O botão de execução está desativado para evitar chamadas reais com credenciais de produção.</p><div className="mt-5 flex flex-wrap gap-3"><a href="/contracts/agenda/agenda-universal-v1.openapi.yaml" download className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--color-surface-2)] px-4 py-2 text-sm font-semibold text-[var(--color-gray-700)] hover:bg-white focus-visible:shadow-focus focus-visible:outline-none"><Braces className="h-4 w-4" aria-hidden="true" />Baixar OpenAPI YAML</a><a href="/contracts/agenda/agenda-universal-v1.schema.json" download className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--color-surface-2)] px-4 py-2 text-sm font-semibold text-[var(--color-gray-700)] hover:bg-white focus-visible:shadow-focus focus-visible:outline-none"><ExternalLink className="h-4 w-4" aria-hidden="true" />Baixar JSON Schema</a></div><div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white"><SwaggerExplorer/></div></DocSection>

            <DocSection id="checklist"><SectionTitle step="10 · Finalização" title="Checklist de ativação" /><ul className="mt-6 grid gap-3">{["URL pública usando HTTPS.", "Segredos guardados em gerenciador seguro.", "HMAC calculado sobre o corpo bruto.", "eventId persistido para idempotência.", "Eventos e campos desconhecidos ignorados.", "resourceVersion controlada.", "Idempotency-Key igual ao eventId no retorno.", "done e no_show enviados somente após o atendimento.", "Backoff configurado para falhas temporárias.", "Teste concluído antes da ativação."].map((item) => <li key={item} className="flex gap-3 text-[var(--color-gray-700)]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" /><span>{item}</span></li>)}</ul><Note title="Contrato oficial">Os arquivos oficiais são <code className="font-mono">agenda-universal-v1.openapi.yaml</code> e <code className="font-mono">agenda-universal-v1.schema.json</code>.</Note></DocSection>
          </article>
        </div>
      </main>
    </div>
  );
}
