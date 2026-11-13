# /oticas: resumo da pesquisa (13/11/2026)

Base da página de solução para óticas. Fontes: pesquisa web em PT-BR, a auditoria SEO do ciclo 1
(`findings/sxo.md`, `findings/content.md`, `ESTRATEGIA.md`) e os guias do blog
`ia-de-atendimento-para-oticas` e `black-friday-para-oticas`. O que é inferência está marcado.

## 1. Como a ótica atende no WhatsApp

- **Assuntos que se repetem**: "quanto custa a lente?", receita mandada por foto, escolha de armação por foto,
  "meus óculos estão prontos?", marcar exame ou prova, qual loja atende, convênio e horário, tipo de lente
  (multifocal, filtro de luz azul, fotossensível). Fontes: SocialHub e Chakra Chat.
- **Onde trava**: o WhatsApp fica no celular pessoal do vendedor, a recompra depende da memória da equipe, o cliente
  liga só para saber do pedido, a mensagem das 22h espera até de manhã e esfria. O Sebrae recomenda separar etapas
  (novo, orçamento, negociação, fechado) e responder rápido.
- **O que o cliente reclama** (Reclame Aqui): ninguém avisou que a lente ficou pronta, a atendente "sumiu" e ele teve de
  contar tudo de novo, ninguém ofereceu a lente certa, o prazo da multifocal não ficou claro.
  → **Na página**: histórico da conversa no CRM, a loja certa recebe a conversa, prazo e preço vêm só do que a ótica cadastrou.
- **Inferência**: a pergunta de preço sem receita é a porta de entrada mais comum. Não há dado público sobre isso.

## 2. O que o dono teme numa IA

- **Citado pela imprensa**: "trocar gente por robô" (EM, ago/2026).
- **Inferido** (nenhum concorrente trata): errar preço ou grau, prometer prazo que o laboratório não cumpre, dar
  desconto sem autorização, parecer robô, LGPD da receita.
- **LGPD**: dado de saúde é sensível (art. 5º, II e art. 11). Tratar a receita como dado de saúde é uma inferência
  razoável. → **Na página**: dizer quem vê a receita, sem prometer conformidade jurídica.
- **Exame de vista**:
  - O STF (ADI 4.268, 2025) e o STJ (AR 7.106, mai/2026) aceitam que optometrista com nível superior faça exame
    de vista.
  - CFM e CBO continuam obtendo liminares contra ótica que divulga "exame de vista".
  - → **Na página**: a IA **agenda** o exame com os profissionais e horários da agenda da ótica. Não prometer
    "exame grátis", não interpretar diagnóstico, não recomendar grau.
  - *Leitura feita em resumos e no Informativo do STF. Vale validar com advogado.*

## 3. Termos de busca

Não tenho volume (sem Search Console nem Keyword Planner). Os termos de intenção comercial, por inferência:

- "IA para ótica"
- "CRM para ótica"
- "atendimento WhatsApp ótica"
- "chatbot para ótica"
- "automação WhatsApp ótica"
- "sistema/software para ótica" (os resultados trazem sobretudo ERPs, como o ssOtica)

O que a busca mostra:

- **"IA para ótica"**: só notícias e páginas estrangeiras.
- **"CRM para ótica"**: resultados em espanhol e inglês, nenhuma página vertical em PT-BR (confirma a F-SXO-03 da auditoria).
- **"chatbot para ótica"**: guias genéricos.

→ **Title e H1** com "IA de atendimento e CRM para óticas". O corpo usa "WhatsApp", "receita", "orçamento", "várias lojas".

## 4. Concorrentes (só para achar lacunas)

| Quem | O que mostra | O que falta |
|---|---|---|
| Chakra Chat (página de óticas) | lembrete de exame e de recompra, "está pronto?", catálogo, inbox por loja, setup em passos | LGPD, integração com o sistema da loja, como passa para humano, caso de ótica real |
| SocialHub (post-landing) | receita por foto, armação, agenda, status do pedido, tabela manual × plataforma | precisão e revisão da receita, limites do bot, LGPD, integração concreta |
| ssOtica (ssAgentes) | ERP líder, agente de IA no WhatsApp vendido à parte | detalhes de funcionamento (só imprensa) |
| Clientify, Odoo, Medesk | agenda, ficha | não falam de WhatsApp com IA para o Brasil |

**Lacunas que a /oticas cobre**:

- mostrar a conversa real, passo a passo;
- dizer o que a IA **não** faz (desconto, estoque, preço fechado, grau);
- mostrar o que acontece com a receita e quem a vê;
- mostrar a retomada do orçamento com regra clara (2 h e 4 h, para quando o cliente responde);
- mostrar várias lojas num CRM só;
- mostrar a integração com o sistema da loja (Jornadas RB).

## 5. Fatos do produto usados (todos já publicados no site)

- Atendimento em WhatsApp, site, Instagram e Messenger, a qualquer hora.
- Pergunta "grau ou sol?".
- Leitura da receita (esférico, cilíndrico, eixo) com resumo para a equipe e para o cliente.
- Visagismo: formato do rosto, armação indicada, prova com a foto.
- A recomendação de lente segue os parâmetros da loja.
- Agenda conferindo disponibilidade, com lembrete 1 h antes pelo WhatsApp.
- Retomada do orçamento: lembrança 2 h depois e reforço 4 h depois, com o nome do cliente. Para quando ele responde.
- Encaminhamento para o vendedor com contexto. A conversa vai para a unidade certa e cada loja vê só o que é dela.
- Jornadas RB: pedidos, receitas oftalmológicas e consentimento.
- Regras fixas: nunca dá desconto não autorizado, nunca confirma estoque sem fonte válida, preço fechado e pagamento ficam com o vendedor.

**Não usar**:

- aniversário (o design system da seção animada proíbe);
- "follow-up" (usar "acompanhamento" ou "retomada");
- "perda";
- preço, números de clientes, depoimentos.

## Fontes

- chakrahq.com/pt/product/chakra-chat/industry/optical-eyewear-stores
- socialhub.pro/blog/whatsapp-business-oticas-automacao-vendas/
- em.com.br (ago/2026): "Inteligência artificial chega ao balcão das óticas"
- baguete.com.br: Óticas Max + Tecla Zap (números da matéria, sem verificação)
- Sebrae, e-book "Como vender pelo WhatsApp sem perder cliente"
- Reclame Aqui (duas reclamações de óticas: prazo e opção de lente)
- STF, Informativo 1183 (ADI 4.268); Migalhas (STJ, AR 7.106); Tribuna de Minas (TJMG, 2025); portal do CFM
- Serpro: dados sensíveis na LGPD
