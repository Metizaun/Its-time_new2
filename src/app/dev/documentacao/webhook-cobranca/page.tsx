import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Braces, CheckCircle2, KeyRound, ShieldCheck, Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";

export const metadata: Metadata = {
  title: "Webhook de cobrança · Documentação Its Time",
  description: "Guia para integrar seu sistema financeiro à cobrança da Its Time por webhook.",
  alternates: { canonical: "/dev/documentacao/webhook-cobranca" },
};

const endpoint = "https://api.itstime.pro/api/integrations/collections/v1/sources/{PUBLIC_SOURCE_ID}/events";

const payload = `{
  "schemaVersion": "1.0",
  "ingestionId": "cobranca-20260910-0001",
  "mode": "incremental",
  "occurredAt": "2026-09-10T14:30:00-03:00",
  "records": [
    {
      "schemaVersion": "1.0",
      "source": {
        "externalEventId": "evento-98765",
        "sourceUpdatedAt": "2026-09-10T14:30:00-03:00"
      },
      "customer": {
        "externalId": "cliente-123",
        "name": "Maria da Silva",
        "phone": "5511999999999",
        "document": "12345678900",
        "email": "maria@exemplo.com"
      },
      "creditor": {
        "externalId": "loja-01",
        "name": "Ótica Exemplo",
        "document": "12345678000190"
      },
      "receivable": {
        "externalId": "titulo-456",
        "description": "Parcela 2 de 3",
        "originalAmount": "250.00",
        "remainingAmount": "250.00",
        "currency": "BRL",
        "dueDate": "2026-09-05",
        "status": "open"
      },
      "payment": {
        "method": "pix",
        "pixKey": "financeiro@exemplo.com",
        "paymentUrl": "https://pagamentos.exemplo.com/titulo-456",
        "expiresAt": "2026-09-15T23:59:59-03:00"
      },
      "metadata": {
        "numeroParcela": 2,
        "filial": "São Paulo"
      }
    }
  ]
}`;

const curlExample = `WEBHOOK_URL="${endpoint}"
WEBHOOK_SECRET="SEU_SEGREDO"
TIMESTAMP=$(date +%s)
IDEMPOTENCY_KEY="cobranca-$(date +%s)"

BODY='{"schemaVersion":"1.0","ingestionId":"cobranca-20260910-0001","mode":"incremental","occurredAt":"2026-09-10T14:30:00-03:00","records":[{"schemaVersion":"1.0","source":{"externalEventId":"evento-98765","sourceUpdatedAt":"2026-09-10T14:30:00-03:00"},"customer":{"externalId":"cliente-123","name":"Maria da Silva","phone":"5511999999999"},"creditor":{"externalId":"loja-01","name":"Ótica Exemplo"},"receivable":{"externalId":"titulo-456","remainingAmount":"250.00","currency":"BRL","dueDate":"2026-09-05","status":"open"}}]}'

SIGNATURE=$(printf '%s.%s' "$TIMESTAMP" "$BODY" \
  | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -hex \
  | sed 's/^.* //')

curl --request POST "$WEBHOOK_URL" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: $IDEMPOTENCY_KEY" \
  --header "X-Collection-Timestamp: $TIMESTAMP" \
  --header "X-Collection-Signature: sha256=$SIGNATURE" \
  --data-raw "$BODY"`;

const pythonExample = `import hashlib
import hmac
import json
import time
import uuid

import requests

WEBHOOK_URL = "${endpoint}"
WEBHOOK_SECRET = "SEU_SEGREDO"

payload = {
    "schemaVersion": "1.0",
    "ingestionId": f"cobranca-{uuid.uuid4()}",
    "mode": "incremental",
    "occurredAt": "2026-09-10T14:30:00-03:00",
    "records": [{
        "schemaVersion": "1.0",
        "source": {
            "externalEventId": "evento-98765",
            "sourceUpdatedAt": "2026-09-10T14:30:00-03:00"
        },
        "customer": {
            "externalId": "cliente-123",
            "name": "Maria da Silva",
            "phone": "5511999999999"
        },
        "creditor": {"externalId": "loja-01", "name": "Ótica Exemplo"},
        "receivable": {
            "externalId": "titulo-456",
            "remainingAmount": "250.00",
            "currency": "BRL",
            "dueDate": "2026-09-05",
            "status": "open"
        }
    }]
}

body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
timestamp = str(int(time.time()))
signature = hmac.new(
    WEBHOOK_SECRET.encode("utf-8"),
    timestamp.encode("utf-8") + b"." + body,
    hashlib.sha256
).hexdigest()

response = requests.post(
    WEBHOOK_URL,
    data=body,
    headers={
        "Content-Type": "application/json",
        "Idempotency-Key": payload["ingestionId"],
        "X-Collection-Timestamp": timestamp,
        "X-Collection-Signature": f"sha256={signature}"
    },
    timeout=30
)

print(response.status_code)
print(response.json())
response.raise_for_status()`;

const javaExample = `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class ItsTimeWebhook {
  private static final String URL = "${endpoint}";
  private static final String SECRET = "SEU_SEGREDO";

  public static void main(String[] args) throws Exception {
    String id = "cobranca-" + UUID.randomUUID();
    String body = "{\"schemaVersion\":\"1.0\",\"ingestionId\":\"" + id
      + "\",\"mode\":\"incremental\",\"occurredAt\":\"2026-09-10T14:30:00-03:00\","
      + "\"records\":[{\"schemaVersion\":\"1.0\",\"source\":{"
      + "\"sourceUpdatedAt\":\"2026-09-10T14:30:00-03:00\"},\"customer\":{"
      + "\"externalId\":\"cliente-123\",\"name\":\"Maria da Silva\","
      + "\"phone\":\"5511999999999\"},\"creditor\":{\"externalId\":\"loja-01\"},"
      + "\"receivable\":{\"externalId\":\"titulo-456\",\"remainingAmount\":\"250.00\","
      + "\"currency\":\"BRL\",\"dueDate\":\"2026-09-05\",\"status\":\"open\"}}]}";

    String timestamp = Long.toString(Instant.now().getEpochSecond());
    String signature = hmacSha256(timestamp + "." + body, SECRET);

    HttpRequest request = HttpRequest.newBuilder(URI.create(URL))
      .header("Content-Type", "application/json")
      .header("Idempotency-Key", id)
      .header("X-Collection-Timestamp", timestamp)
      .header("X-Collection-Signature", "sha256=" + signature)
      .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
      .build();

    HttpResponse<String> response = HttpClient.newHttpClient()
      .send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.statusCode());
    System.out.println(response.body());
  }

  private static String hmacSha256(String content, String secret) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    byte[] digest = mac.doFinal(content.getBytes(StandardCharsets.UTF_8));
    StringBuilder hex = new StringBuilder(digest.length * 2);
    for (byte value : digest) hex.append(String.format("%02x", value & 0xff));
    return hex.toString();
  }
}`;

const postmanScript = `const CryptoJS = pm.require("npm:crypto-js@4.2.0");
const timestamp = Math.floor(Date.now() / 1000).toString();
const body = pm.request.body.raw;
const secret = pm.environment.get("webhook_secret");

if (!secret) throw new Error("Configure a variável webhook_secret.");

const hash = CryptoJS.HmacSHA256(timestamp + "." + body, secret)
  .toString(CryptoJS.enc.Hex);

pm.variables.set("collection_timestamp", timestamp);
pm.variables.set("collection_signature", "sha256=" + hash);
pm.variables.set("idempotency_key", "postman-" + Date.now());`;

const successResponse = `{
  "accepted": true,
  "duplicate": false,
  "ingestionId": "8d7c1398-ec65-4b3c-8827-b17c66371a3e",
  "status": "succeeded",
  "receivedCount": 1,
  "createdCount": 1,
  "updatedCount": 0,
  "unchangedCount": 0,
  "notPresentCount": 0,
  "affectedCasesCount": 1
}`;

const sections = [
  ["inicio", "Início rápido"], ["credenciais", "Credenciais"], ["autenticacao", "Autenticação HMAC"],
  ["payload", "Payload"], ["campos", "Referência de campos"], ["curl", "cURL"], ["python", "Python"],
  ["java", "Java"], ["postman", "Postman"], ["respostas", "Respostas"], ["erros", "Erros e retentativas"],
  ["limites", "Limites e segurança"], ["checklist", "Checklist"],
] as const;

function SectionTitle({ step, title }: { step: string; title: string }) {
  return <><p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]"><span className="h-0.5 w-5 bg-[var(--color-primary-500)]" aria-hidden="true" />{step}</p><h2 className="text-2xl font-bold tracking-tight text-[var(--color-gray-900)] sm:text-3xl">{title}</h2></>;
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return <div className="mt-5 overflow-hidden rounded-xl border border-black/10 bg-[var(--color-gray-900)] shadow-sm"><div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5"><span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/65">{label}</span><CopyButton value={code} /></div><pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-6 text-white sm:p-5"><code>{code}</code></pre></div>;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-default)]"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-[var(--color-surface-2)]"><tr>{headers.map((header) => <th key={header} className="border-b border-[var(--border-default)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.join("-")} className={index % 2 ? "bg-[var(--color-surface-2)]/50" : "bg-white"}>{row.map((cell) => <td key={cell} className="border-b border-[var(--border-subtle)] px-4 py-3 align-top text-[var(--color-gray-700)] last:border-b-0"><code className="font-mono text-[13px] text-[var(--color-gray-900)]">{cell}</code></td>)}</tr>)}</tbody></table></div>;
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="mt-5 rounded-xl border border-[var(--color-primary-500)]/25 bg-[var(--color-primary-50)] p-4"><p className="font-semibold text-[var(--color-gray-900)]">{title}</p><div className="mt-1 text-sm leading-6 text-[var(--color-gray-700)]">{children}</div></aside>;
}

function DocSection({ id, children }: { id: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">{children}</section>;
}

export default function WebhookCobrancaPage() {
  return <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[color:rgba(247,246,244,0.92)] backdrop-blur-md"><div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"><Link href="/" className="group inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />Voltar ao site</Link><span className="font-mono text-sm font-bold tracking-wider">ITS TIME <span className="text-[var(--color-primary-600)]">/ DEV</span></span></div></header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14"><div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" /><div className="max-w-4xl"><p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">Documentação · API v1</p><h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">Integração de cobrança via webhook</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">Envie títulos financeiros do seu sistema para a Its Time. Este guia mostra o processo completo, da assinatura à primeira resposta.</p><div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]"><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">POST</span><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">JSON</span><span className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">HMAC-SHA256</span></div></div></section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24"><nav aria-label="Nesta página" className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4 shadow-sm"><p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">Nesta página</p><ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">{sections.map(([id, title], index) => <li key={id}><a href={`#${id}`} className="flex min-h-10 items-center rounded-lg px-2 py-2 text-sm text-[var(--color-gray-600)] hover:bg-white hover:text-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none"><span className="mr-2 font-mono text-xs text-[var(--color-gray-400)]">{String(index + 1).padStart(2, "0")}</span>{title}</a></li>)}</ol></nav></aside>
        <article className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
          <DocSection id="inicio"><SectionTitle step="01 · Comece aqui" title="Início rápido" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Para enviar uma cobrança, monte o JSON, gere a assinatura com seu segredo e faça um POST para a URL da fonte.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[[KeyRound,"1. Obtenha a URL","Copie o endereço e o segredo no módulo Cobrança."],[Braces,"2. Monte o JSON","Use o schema 1.0 e comece com o modo incremental."],[Terminal,"3. Assine e envie","Calcule o HMAC sobre os mesmos bytes enviados."]].map(([Icon,title,text]) => { const CardIcon = Icon as typeof KeyRound; return <div key={String(title)} className="rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4"><CardIcon className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" /><h3 className="mt-3 font-semibold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">{String(text)}</p></div>; })}</div><CodeBlock label="Endpoint" code={`POST ${endpoint}`} /></DocSection>
          <DocSection id="credenciais"><SectionTitle step="02 · Preparação" title="Credenciais" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">No módulo <strong>Cobrança</strong>, crie uma fonte do tipo <strong>Webhook genérico</strong>. Nos detalhes técnicos você encontrará o identificador usado na URL. O segredo aparece uma única vez ao criar ou rotacionar a credencial.</p><Note title="Trate o segredo como uma senha">Armazene-o no servidor ou em um gerenciador de segredos. Nunca o exponha no navegador, aplicativo mobile, repositório ou logs.</Note></DocSection>
          <DocSection id="autenticacao"><SectionTitle step="03 · Segurança" title="Autenticação HMAC" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">A assinatura prova que o corpo veio do seu sistema. Primeiro gere o timestamp Unix atual. Depois concatene o timestamp, um ponto e o corpo JSON bruto.</p><CodeBlock label="Regra da assinatura" code={'assinatura = HMAC-SHA256(SEU_SEGREDO, timestamp + "." + corpo_json_bruto)\n\nX-Collection-Signature: sha256=HASH_HEXADECIMAL'} /><Table headers={["Cabeçalho","Valor"]} rows={[["Content-Type","application/json"],["Idempotency-Key","Identificador único, até 255 caracteres"],["X-Collection-Timestamp","Unix timestamp em segundos ou milissegundos"],["X-Collection-Signature","sha256= seguido do hash hexadecimal"]]} /><Note title="O corpo deve permanecer idêntico">Não reformate o JSON depois de assinar. Espaços, quebras de linha e ordem dos campos mudam os bytes e invalidam a assinatura. A janela aceita é de 5 minutos.</Note></DocSection>
          <DocSection id="payload"><SectionTitle step="04 · Dados" title="Payload completo" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Use este exemplo como ponto de partida. A conexão é identificada pela URL; não envie IDs internos da Its Time.</p><CodeBlock label="JSON" code={payload} /></DocSection>
          <DocSection id="campos"><SectionTitle step="05 · Referência" title="Campos e formatos" /><h3 className="mt-6 text-lg font-bold">Envelope</h3><Table headers={["Campo","Obrigatório","Formato"]} rows={[["schemaVersion","Sim","Sempre 1.0"],["ingestionId","Sim","ID único do evento ou lote"],["mode","Sim","incremental ou snapshot"],["occurredAt","Sim","ISO 8601 com fuso horário"],["scope","Não","Escopo de um snapshot"],["records","Sim","Lista de até 500 cobranças"]]} /><h3 className="mt-8 text-lg font-bold">Registro de cobrança</h3><Table headers={["Grupo","Obrigatórios","Opcionais"]} rows={[["source","sourceUpdatedAt","externalEventId"],["customer","externalId, name, phone","document, email"],["creditor","externalId","name, document"],["receivable","externalId, remainingAmount, currency, dueDate, status","description, originalAmount"],["payment","Nenhum","method, pixKey, paymentUrl, expiresAt"],["metadata","Nenhum","Objeto livre dentro dos limites"]]} /><h3 className="mt-8 text-lg font-bold">Valores aceitos</h3><Table headers={["Campo","Valores"]} rows={[["status","open, settled, cancelled, suspended, unknown"],["payment.method","pix, boleto, card, cash, bank_transfer, store_credit, other"],["currency","ISO 4217, por exemplo BRL"],["dueDate","YYYY-MM-DD"],["valores","String decimal não negativa, por exemplo 250.00"]]} /><Note title="Incremental é o modo recomendado">Ele cria ou atualiza somente os títulos enviados. Use snapshot apenas se o lote representar a visão completa de uma carteira; registros ausentes dentro do escopo podem ser marcados como não presentes.</Note></DocSection>
          <DocSection id="curl"><SectionTitle step="06 · Exemplo" title="cURL e Bash" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Requer Bash e OpenSSL. Troque o identificador da fonte e o segredo antes de executar.</p><CodeBlock label="Bash" code={curlExample} /></DocSection>
          <DocSection id="python"><SectionTitle step="07 · Exemplo" title="Python" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Instale <code className="font-mono">requests</code> com <code className="font-mono">pip install requests</code>. A serialização acontece uma vez e os mesmos bytes são assinados e enviados.</p><CodeBlock label="Python" code={pythonExample} /></DocSection>
          <DocSection id="java"><SectionTitle step="08 · Exemplo" title="Java 11+" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">O exemplo usa somente APIs incluídas no Java 11. Em produção, prefira uma biblioteca JSON para montar o corpo.</p><CodeBlock label="Java" code={javaExample} /></DocSection>
          <DocSection id="postman"><SectionTitle step="09 · Exemplo" title="Postman" /><ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-[var(--color-gray-700)]"><li>Crie as variáveis de ambiente <code className="font-mono">webhook_url</code> e <code className="font-mono">webhook_secret</code>.</li><li>Crie um POST para <code className="font-mono">{'{{webhook_url}}'}</code> e cole o payload em Body → raw → JSON.</li><li>Adicione o script abaixo em Pre-request Script.</li><li>Cadastre os quatro cabeçalhos da tabela.</li></ol><CodeBlock label="Pre-request Script" code={postmanScript} /><Table headers={["Cabeçalho","Valor no Postman"]} rows={[["Content-Type","application/json"],["Idempotency-Key","{{idempotency_key}}"],["X-Collection-Timestamp","{{collection_timestamp}}"],["X-Collection-Signature","{{collection_signature}}"]]} /></DocSection>
          <DocSection id="respostas"><SectionTitle step="10 · Resultado" title="Resposta de sucesso" /><p className="mt-4 leading-7 text-[var(--color-gray-700)]">Uma requisição aceita retorna HTTP <code className="font-mono">202</code>. O processamento já foi aplicado quando o status for <code className="font-mono">succeeded</code>.</p><CodeBlock label="202 Accepted" code={successResponse} /><p className="mt-5 leading-7 text-[var(--color-gray-700)]">Se <code className="font-mono">duplicate</code> for <code className="font-mono">true</code>, o mesmo lote já havia sido recebido e não foi aplicado novamente.</p></DocSection>
          <DocSection id="erros"><SectionTitle step="11 · Operação" title="Erros e retentativas" /><Table headers={["HTTP","O que significa","O que fazer"]} rows={[["400","JSON inválido ou Idempotency-Key ausente","Corrija a requisição"],["401","Fonte, timestamp ou assinatura inválidos","Revise URL, relógio, segredo e corpo"],["409","A chave idempotente foi usada com outro corpo","Use uma nova chave ou restaure o corpo original"],["413","Corpo acima de 1 MB","Divida o lote"],["422","Campo ausente ou formato inválido","Corrija os campos informados"],["429","Limite de requisições excedido","Aguarde o Retry-After"],["503","Fonte pausada ou indisponível","Tente novamente mais tarde"]]} /><h3 className="mt-8 text-lg font-bold">Quando repetir</h3><p className="mt-3 leading-7 text-[var(--color-gray-700)]">Se não receber uma resposta, repita com a mesma <code className="font-mono">Idempotency-Key</code> e o mesmo corpo. Gere apenas um novo timestamp e uma nova assinatura. Para falhas temporárias, use espera progressiva. Não repita erros 400, 401, 409 ou 422 sem corrigir a causa.</p></DocSection>
          <DocSection id="limites"><SectionTitle step="12 · Produção" title="Limites e segurança" /><ul className="mt-5 grid gap-3 sm:grid-cols-2">{["500 registros por requisição","1 MB por corpo JSON","120 requisições por minuto por fonte e IP","Timestamp dentro de 5 minutos","Idempotency-Key de até 255 caracteres","Metadata de até 16 KiB por registro","Links de pagamento somente HTTPS","Segredo anterior válido por 24 horas após rotação"].map((item) => <li key={item} className="flex gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4 text-sm leading-6 text-[var(--color-gray-700)]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" />{item}</li>)}</ul></DocSection>
          <DocSection id="checklist"><SectionTitle step="13 · Finalização" title="Checklist da integração" /><ul className="mt-6 space-y-3">{["Fonte Webhook genérico criada no módulo Cobrança.","URL e segredo guardados no servidor.","Timestamp gerado no momento do envio.","Corpo assinado antes da requisição.","Chave idempotente única definida.","Datas e valores enviados no formato correto.","Respostas 202 e duplicate tratadas.","Retentativas habilitadas apenas para falhas temporárias.","Pagamento informado como settled com saldo 0.00."].map((item) => <li key={item} className="flex gap-3 text-[var(--color-gray-700)]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden="true" /><span>{item}</span></li>)}</ul></DocSection>
        </article>
      </div>
    </main>
    <footer className="mt-12 border-t border-[var(--border-default)] bg-[var(--color-surface-2)]"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-[var(--color-gray-600)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>Its Time CRM · Documentação para desenvolvedores</p><a className="rounded-md font-medium hover:text-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none" href="mailto:matheus@itstime.pro">Precisa de ajuda?</a></div></footer>
  </div>;
}
