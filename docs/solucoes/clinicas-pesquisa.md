# /clinicas: resumo da pesquisa (13/11/2026)

Base para a página `/clinicas` (código em `src/app/clinicas`, texto em `src/lib/solutions/clinicas.ts`).
Pesquisa feita na web em pt-BR, mais a auditoria SEO do ciclo 1 (`findings/sxo.md`, `findings/content.md`,
`ESTRATEGIA.md`). Números de terceiros ficam **só aqui**, com fonte; a página não publica nenhum número.

## Público

- Dono(a) ou gestor(a) de clínica pequena ou média: estética, odontologia, dermatologia, fisioterapia, psicologia,
  nutrição. A mesma pessoa da recepção atende balcão, telefone e WhatsApp e confirma consulta à mão.
- O resultado que vende é o **horário marcado**; depois vêm lembrete/confirmação, retorno de orçamento e cobrança.
- Persona mais fraca na auditoria: o "avaliador" (sócio/TI), que quer saber limites, integrações e preço antes de
  falar com vendas. A página responde limites e integrações; preço continua "na demonstração" (não há planos).

## Como as clínicas atendem hoje (fontes de fornecedores, tratar como indicativo)

- 87% das clínicas agendam e 86% confirmam consultas pelo WhatsApp, muitas vezes manualmente (Panorama das Clínicas
  2026, Doctoralia + Feegow, 639 respondentes; conteúdo patrocinado).
- 33% dos agendamentos na Doctoralia acontecem antes das 9h ou depois das 18h, 13% no fim de semana (Perfil do
  Paciente Digital, 6ª ed., dados de 2024 da plataforma). Sustenta a cena "pergunta às 22h" sem citar número.
- 32% já usam IA e 40% pretendem adotar; 34% têm faltas acima de 11% (Panorama 2026).

## Perguntas típicas do paciente

Valor e parcelamento, sinal/pagamento antecipado, convênio, preparo (jejum, sem maquiagem), duração, endereço e
estacionamento, horários livres, remarcação/cancelamento, número de sessões e próxima sessão (estética, laser),
retorno incluído, resultado esperado e pós-procedimento. Frequência sem estudo sistemático (fontes: roteiros da
Clinicorp, Aurora Inbox, SocialHub, eGrow).

## Objeções e medos

- Paciente que some depois do orçamento; confirmação manual e faltas; "quanto custa?" sem resposta à noite.
- Medo da IA: inventar resposta, soar robótica, não deixar falar com humano, dados de saúde (LGPD: dado sensível,
  art. 5º II e art. 11) e regras dos conselhos.
- **CFM 2.454/2026** (IA na medicina, vigente desde ago/2026): IA como apoio com supervisão humana; diagnóstico,
  prognóstico e decisão terapêutica não podem ser delegados à IA. A página responde com a seção "Limites claros"
  (dúvida clínica, sintoma, intercorrência → equipe), sem citar a resolução (não verificamos o texto integral).
- **CFO**: divulgar preço em publicidade odontológica é infração ética (CFO-118/2012, art. 44, a confirmar). Por isso
  a conversa de exemplo é de **estética** (limpeza de pele), não de odontologia.
- **Meta**: desde 15/01/2026 a API Business proíbe chatbots de IA "de uso geral"; bots com escopo de negócio
  (atendimento, agendamento) seguem permitidos. Reforça o uso do WhatsApp oficial (tutorial linkado).

## O que falta nos concorrentes (Cloudia, Clint, eGrow, Aurora Inbox, SocialHub, Dr. IAgenda)

- Números grandes sem metodologia (-70% de faltas, "+1000 clínicas", 49x).
- Ninguém explica o que a IA **não** faz nem como é a passagem para a equipe (gatilho, histórico).
- Retorno de orçamento raso; nada sobre o paciente que levou a proposta para pensar.
- Páginas genéricas, traduzidas, com muitos CTAs.

**Diferença da página:** mostrar a jornada inteira de uma paciente (não uma lista de funções), deixar claros os
limites da IA e a passagem com histórico, e não publicar número nenhum sem medição própria.

## Palavras-chave escolhidas

| Uso | Termo | Por quê |
|---|---|---|
| Title, H1 | **IA para clínicas** | sugestão mais rica do autocompletar ("ia para clinica de estética / odontológica / médica") |
| Title, metadescription | **atendimento e agendamento no WhatsApp** | "ia para whatsapp clinica", "ia para agendamento de consulta" |
| Corpo | agendamento de consulta pelo WhatsApp, lembrete e confirmação de consulta, retorno de orçamento | intenção de quem já agenda à mão |
| Corpo (segmentos) | estética, odontologia, dermatologia, fisioterapia, psicologia, nutrição | variantes "ia/chatbot para clínica + especialidade" |
| Não usado no título | secretária virtual, chatbot | variantes mais fracas; "chatbot" contradiz o tom (a IA conversa e passa para a equipe) |

Volume real não medido (sem Search Console/Keyword Planner); revisar no ciclo 2.

## Fontes

- https://medicinasa.com.br/?p=173775 (Panorama 2026 Doctoralia + Feegow)
- https://medicinasa.com.br/doctoralia-panorana-2026/ (uso de IA, jornada do paciente)
- https://medicinasa.com.br/paciente-digital-25 (agendamentos fora do horário)
- https://medicinasa.com.br/consulta-whatsapp (LGPD e APIs não oficiais)
- https://portal.cfm.org.br/noticias/cfm-normatiza-uso-da-ia-na-medicina (CFM 2.454/2026)
- https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf (CFM 2.336/2023)
- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm (LGPD)
- https://olhardigital.com.br/2025/10/18/pro/whatsapp-business-vai-proibir-chatbots-de-ia-entenda/ (política da Meta)
- Concorrentes: cloudia.com.br, useclint.com, egrow.com/pt/clinics-ai-agent, aurorainbox.com (estética),
  socialhub.pro/blog/whatsapp-clinica-estetica-2026, itforum.com.br/?p=9618632
- Autocompletar do Google (pt-BR, BR), consultado em 13/11/2026

## Número publicado

- **30% dos leads atendidos pela IA agendaram um horário.** Confirmado pelo usuário em 13/11/2026: resultado medido
  da Its Time, média das clínicas clientes nos últimos 30 dias, estável na janela de 90 dias. Conta o horário
  marcado, não o comparecimento. Na página fica em `clinicResult` (`src/lib/solutions/clinicas.ts`), sempre com a
  definição logo abaixo. Atualizar o período quando o número for medido de novo.
