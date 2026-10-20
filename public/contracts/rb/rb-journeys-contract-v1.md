# Jornadas RB — contrato de entrada v1

A integração recebe eventos do Registro Base na conexão RB já existente da conta. A URL de webhook usa `rb.connections.journeys_public_id`; o segredo de entrada é independente do token RB usado nas consultas de saída. Não se cria outra conexão.

## Configuração administrativa

Requer sessão autenticada de administrador da conta. Todas as respostas usam `Cache-Control: no-store`.

- `GET /api/rb/connections/:id/journeys`: `{success:true,settings:{connectionId,publicConnectionId,webhookUrl,credentialConfigured,enabled,status,lastReceivedAt,lastEventType,lastError,pendingCount,blockedCount}}`.
- `POST /api/rb/connections/:id/journeys`, corpo `{enabled:true|false}`: mesmo envelope. Ativar exige credencial configurada.
- `POST /api/rb/connections/:id/journeys/rotate-secret`: `{success:true,settings:{...},secret:"..."}`. O segredo aparece somente nesta resposta. A primeira geração mantém as jornadas desativadas até sua ativação explícita.
- `POST /api/rb/connections/:id/journeys/retry`: repõe eventos bloqueados dessa conexão na fila com tentativas zeradas e retorna `{success:true,settings:{...}}`.

Estados: `unconfigured` sem segredo; `paused` configurada/desativada; `waiting` ativada/sem eventos; `receiving` com eventos recebidos; `error` com evento bloqueado ou diagnóstico operacional. `lastError` inclui diagnósticos não resolvidos, como receita sem vencimento. `pendingCount` conta eventos pendentes/em processamento; `blockedCount`, os que dependem de intervenção antes de uma nova tentativa. `lastReceivedAt` representa o recebimento, não a data de ocorrência.

O backend usa AES-256-GCM com `RB_JOURNEYS_SECRETS_ENCRYPTION_KEY` (32 bytes em hex ou base64) e `RB_JOURNEYS_SECRETS_ENCRYPTION_KEY_VERSION` (padrão `v1`). A rotação do segredo mantém o segredo imediatamente anterior válido por 24 horas; uma segunda rotação substitui esse anterior. A versão identifica a chave de criptografia configurada; mudanças dessa chave exigem migração das credenciais cifradas, não apenas mudança da variável.

## Requisição pública

`POST /api/integrations/rb/v1/connections/:publicConnectionId/events`

`Content-Type: application/json`, corpo UTF-8 com no máximo 1 MiB, sem compressão. Cabeçalhos obrigatórios:

- `X-RB-Timestamp`: Unix timestamp em segundos, janela de ±300 segundos.
- `X-RB-Signature`: hexadecimal de HMAC-SHA256 com o segredo; aceita prefixo `sha256=`.
- `Idempotency-Key`: UUID igual a `event_id`.

Assine os bytes exatos de `timestamp + "." + rawBody`. Espaços e quebras de linha fazem parte da assinatura e do hash de idempotência. Não reserialize o JSON depois de assinar.

```js
const rawBody = JSON.stringify(event);
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac('sha256', secret)
  .update(timestamp + '.').update(rawBody, 'utf8').digest('hex');
```

Exemplo:

```json
{
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
}
```

## Campos e semântica

`event_id`, `event_type`, `occurred_at`, `ACES_ID` e `EMP_ID` são obrigatórios em todos os eventos. `CLIE_ID` é obrigatório, exceto em `pedido_cancelado`. `ATEN_ID` e `ATEN_NO` identificam o pedido e são obrigatórios, exceto em `consentimento_revogado`. IDs aceitam strings ou inteiros seguros e são normalizados como strings; envie strings para preservar zeros à esquerda. `ACES_ID` deve corresponder a `rb_aces_id` e `EMP_ID` deve constar em `rb_empresa_ids` dessa mesma conexão.

Ocorrência usa ISO 8601 com fuso; emissão do pedido aceita data `YYYY-MM-DD` ou ISO 8601 com fuso. `birth_date` aceita somente data `YYYY-MM-DD`, entre 1900 e hoje. Valores monetários não negativos usam decimal com ponto e até duas casas; são normalizados para strings com duas casas. O formato recomendado para integrações é string, evitando arredondamento binário.

`order.recipes` representa **receitas oftalmológicas**, não títulos financeiros. Cada receita informa `id`, `issued_at` e `expires_at` (data ou `null` quando desconhecida). Não há valor financeiro obrigatório. Vencimento desconhecido é aceito no ingresso; a jornada que depende dele emite diagnóstico e aguarda um novo evento corrigido. A ItsTime não presume prazo de validade. `order.total_amount` é o total financeiro separado do pedido. Detalhes adicionais enviados nos itens e receitas são preservados, mas a integração deve enviar somente os dados necessários à jornada; não é necessário incluir medidas clínicas. Telefones devem conter entre 10 e 15 dígitos; números brasileiros sem DDI recebem `55` no processamento.

| Evento | Quando enviar | Conteúdo adicional |
| --- | --- | --- |
| `venda_convertida` | Uma vez por venda convertida | Cliente com nome, telefone, consentimento explícito `true`; pedido com total, emissão, itens e receitas |
| `mercadoria_liberada` | Em cada liberação | Mesmo conteúdo; cada liberação tem seu próprio `event_id` |
| `venda_entregue` | Somente quando 100% do pedido foi entregue | Mesmo conteúdo; incluir todas as receitas e todos os itens, inclusive entregas anteriores |
| `pedido_cancelado` | Cancelamento do pedido | IDs do pedido e ocorrência; não exige telefone, consentimento ou objeto `order` |
| `consentimento_revogado` | Revogação do consentimento do cliente | `CLIE_ID` e escopo; não exige pedido, atendimento ou telefone |

O emissor confirma a integralidade de `venda_entregue`; não envie esse evento para entrega parcial. O CRM recebe o retrato completo em vez de presumir que a última liberação contém todos os itens. Eventos de mensagens sem consentimento explícito são rejeitados; cancelamento e revogação continuam aceitos sem telefone para bloquear envios.

## Respostas e repetição

`202 {accepted:true,duplicate:false,eventId}` somente após persistir a inbox. Repetição do mesmo evento e dos mesmos bytes retorna `200` com `duplicate:true`. Mesmo ID com bytes diferentes retorna `409 RB_JOURNEYS_IDEMPOTENCY_CONFLICT`. A regra persiste após reinício e o RPC serializa eventos por conexão para evitar corridas. Corrigir conteúdo exige um novo `event_id`.

Outros códigos: `400` JSON/identificador inválido, `401` assinatura inválida/expirada, `403` escopo divergente, `404` conexão não encontrada, `409` conflito de payload/credencial ausente ao ativar, `413` corpo acima do limite, `415` tipo de conteúdo incorreto, `422` contrato inválido, `503` integração pausada ou conexão RB inativa e `429` limite persistente de 120 requisições aceitas/repetidas por minuto e conexão (`Retry-After: 60`). Falhas de persistência e pausas não recebem `202`; o emissor deve repetir com o mesmo corpo/ID e nova assinatura/timestamp.

As tabelas de credenciais/inbox e os RPCs são restritos ao serviço. O processamento assíncrono e as jornadas são definidos pela migration complementar; nenhum envio acontece dentro do HTTP de ingresso.

## Automações e dados de cada pedido

Em **Conexões → Registro Base → Editar → Jornadas RB**, gerar a credencial, copiá-la para o RB e ativar o recebimento. A aba **Conexão** continua usando o token existente para consultas e Cobrança RB. As mensagens, o remetente e os intervalos são definidos em **Automações**, na origem **Jornadas RB**.

| Gatilho da automação | Marco usado nos intervalos | Identidade da execução |
| --- | --- | --- |
| Venda convertida | `occurred_at` da conversão | Conexão, versão do acesso RB, empresa e pedido; uma entrada por automação |
| Mercadoria liberada | `occurred_at` da liberação | Mesmo escopo + `event_id`; liberações legítimas diferentes podem entrar novamente |
| Venda entregue | `occurred_at` da entrega integral | Conexão, versão do acesso RB, empresa e pedido; uma entrada por automação |
| Receita oftalmológica vencida | `expires_at` de cada receita, após receber `venda_entregue` | Mesmo escopo do pedido + receita e validade |
| Aniversário | Data anual de nascimento, em `America/Sao_Paulo` | Contato, automação e ano; correções antes do envio substituem o agendamento |

Datas sem horário usam meia-noite em São Paulo; o intervalo configurado determina o horário desejado. Nascimentos em 29/02 usam 28/02 nos anos não bissextos. Corrigir nascimento após o envio não cria outro aniversário para o mesmo ano. Aniversários antigos não são recuperados retroativamente.

O processamento identifica o contato pelo vínculo RB existente; sem vínculo, procura um telefone único na mesma conta. Nunca escolhe arbitrariamente entre contatos ambíguos. Para criar um contato novo, é preciso haver uma única instância entre as Automações RB ativas da conexão. Se não houver destino ou existirem vários, o evento fica bloqueado com `RB_INSTANCE_UNDEFINED_OR_AMBIGUOUS`; ajustar as automações e usar **Tentar novamente**. Contatos já identificados usam a própria instância. Um agente principal ativo deve estar associado ao remetente.

Cada execução guarda os dados do seu evento, sem substituir os metadados utilizados pela cobrança. Dados disponíveis em mensagens fixas, variáveis de templates e instruções de IA: `rb.order_number`, `rb.order_total`, `rb.order_issued_at`, `rb.event_type`, `rb.company_id`, `rb.recipe_date`, `rb.recipe_expiry` e `rb.items`. A IA trata o conteúdo recebido como dados, sem executar instruções contidas nele.

## Cancelamento, consentimento e ordem de chegada

Cancelamento é definitivo nesta versão: atinge somente ações pendentes do pedido, empresa e acesso RB informados, incluindo ações já preparadas pelo worker. Não altera a Cobrança RB nem os aniversários sem pedido. Um evento antigo recebido depois não reativa o pedido cancelado. A chamada ao provedor já iniciada não pode ser desfeita.

O RB só envia eventos de mensagens para clientes autorizados e informa `customer.whatsapp_consent:true`. Revogação é registrada antes de confirmar o recebimento, interrompe as novas jornadas pendentes do contato e é revalidada imediatamente antes do disparo. Prevalece a observação de consentimento mais recente; em empate, a revogação. Eventos atrasados não restauram permissão ou nascimento anterior. Um novo consentimento explícito, posterior à revogação, pode autorizar jornadas futuras.

Não há erro genérico para evento fora de ordem: cada evento é persistido e avaliado segundo essas regras. O recebimento não representa envio ou entrega no WhatsApp. Estornos, trocas, devoluções e reabertura permanecem fora da v1.

## Importação de aniversariantes

O modelo CSV mantém `nome` e `telefone` obrigatórios e adiciona `data_nascimento` (`AAAA-MM-DD` ou `DD/MM/AAAA`) e `consentimento_whatsapp` (`S`/`N`). A importação atualiza o perfil de contatos existentes, com a autorização de edição da conta; campos omitidos preservam os valores atuais. Não presume autorização quando a coluna estiver vazia. O cadastro recebido em uma conversão também atualiza nascimento e consentimento.

## Operação e publicação

1. Aplicar, nessa ordem, `20261020135424_rb_journeys_ingress.sql` e `20261020135625_rb_journeys_automations.sql` no ambiente de destino. Elas dependem das migrations anteriores de RB, consultas de clientes e Automações. O preflight verifica as novas tabelas/colunas.
2. Configurar `RB_JOURNEYS_SECRETS_ENCRYPTION_KEY` e a URL pública do backend (`CRM_BACKEND_PUBLIC_URL`). Guardar a chave junto dos backups; nunca entregá-la ao RB. O RB recebe apenas o segredo específico da conexão.
3. Publicar backend/frontend e a função `import-leads-csv`, incluindo `_shared/lead-import-profile.ts`, seu `deno.json` e lockfile. O backend recebe/processa os eventos; o worker de Automações existente efetua os disparos.
4. O worker de ingresso usa `RB_JOURNEYS_WORKER_ENABLED=true` e `RB_JOURNEYS_WORKER_POLL_MS=30000`. Tentativas têm espera crescente; após oito falhas de processamento, o evento fica visível como bloqueado, sem ser descartado, e pode ser retomado pelo administrador. Processamentos interrompidos são recuperados após cinco minutos, com um novo identificador de tentativa que invalida o anterior.
5. Pausar Jornadas RB retorna `503` para novos eventos e posterga os eventos e disparos pendentes, preservando a fila. Retomar permite continuar o processamento. Trocar o acesso/base do RB invalida execuções da identidade anterior; eventos já aceitos não são transferidos para a nova identidade.
6. Homologar com o RB cada evento, duplicidade, conflito, indisponibilidade, cancelamento, revogação e aniversário por evento/importação. Credenciais e dados da fixture local não servem em produção.

Diagnóstico de receita sem validade exige correção do conteúdo pelo RB com novo `event_id`; repetir o mesmo corpo não fornece a informação ausente. Quando chega a validade para a mesma receita/pedido, o diagnóstico correspondente é resolvido. A opção **Tentar novamente** trata falhas de processamento, preservando o evento original.
