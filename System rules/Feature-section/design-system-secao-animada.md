# DESIGN SYSTEM — SEÇÃO ANIMADA (SCROLL) E AJUSTES DA HERO

Atualizado em 2026-10-15 (as mudanças foram feitas em 2026-10-13 e já estão em produção, commit `2dd89a3`).

> Este documento **substitui** `public/assets/Scroll_slide/PRD/feature-section-multiagentes-design-system.md`
> (cubo, preto profundo, glow vermelho, multiagentes). Aquela seção não existe mais.
> A fonte da verdade do código são os tokens em `src/styles/feature-section.css` (`.feature-section-wrapper`).

---

# 1. CONCEITO

A seção mostra **como o cliente ganha dinheiro** com a Its Time (clínicas, óticas, franquias, de forma genérica),
em 7 cenas interativas que rodam sozinhas:

| # | Título | Cena |
| --- | --- | --- |
| 01 | Inteligência que opera. Estratégia que escala. | Ciclo do cliente em anel (entrada → atende e vende → organiza e encaminha → cuida e faz voltar) |
| 02 | Orçamento parado vira receita. | Kanban: onde trava, por que parou, reativação, receita |
| 03 | Cada conversa caminha para a venda. | Chat da Clara + CRM ao vivo |
| 04 | Dinheiro que entra sozinho. | Esteiras de Cobrança e Acompanhamento (Sofia) |
| 05 | A IA não trabalha sozinha. Ela faz parte da sua equipe. | Inbox, nota de handoff, unidade certa, equipe fecha |
| 06 | Veja de onde vem o dinheiro. E onde ele ainda está parado. | Painel de performance |
| 07 | Enquanto você cuida dos clientes, a Its Time cuida da operação. | Um dia inteiro de operação |

Sensação: **produto refinado**, sóbrio, confiável. Nunca "painel de IA neon".

---

# 2. REGRA DE OURO DA COR

A primeira página tem **uma** cor de destaque (laranja) sobre fundo neutro. A seção animada segue a mesma lógica:

- **Fundo e superfícies: neutros** (quase sem croma).
- **Degradê da marca (laranja → rosa) só em detalhes pequenos**: linha do anel, números-chave, kicker, barras de
  progresso, anéis de destaque, ícone ativo, ponto "ao vivo", rastro das partículas.
- **Nunca** como atmosfera, fundo, glow grande ou bloco grande de cor.
- Já foi rejeitado: base ameixa com glows laranja/rosa ("parece outro site", "fundo colorido") e preto puro
  ("não atrai confiança").

## Tokens (`.feature-section-wrapper`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--feature-bg` | `#1a1816` | topo do fundo (grafite quente) |
| `--feature-bg-deep` | `#131211` | base do fundo e "fosso" ao redor dos hubs |
| `--feature-card` | `#232120` | superfície de card |
| `--feature-card-raised` | `#2a2826` | item dentro de card |
| `--feature-gradient` | `linear-gradient(90deg, #ff5a1f, #ff4d6d)` | o degradê da marca |
| `--feature-accent` / `--feature-hot` | `#ff5a1f` / `#ff4d6d` | pontas do degradê |
| `--feature-text` / `--feature-muted` / `--feature-dim` | `#f5f3ef` / `#b6b0aa` / `#77716b` | texto |
| Pêssego/rosa claros | `#ff8a5c` `#ffb08f` `#ff6b92` | ícone ou texto ativos |

## Proibido

- Preto puro (`#000`, `#050505`) como fundo da seção.
- Glow/neon: no máximo um halo de ~16 px a ≤ 14% de opacidade nos hubs. Nenhum glow no fundo.
- **Verde**: existe **uma** exceção, o ponto "online" da Clara. Sucesso, ativo e "ao vivo" usam o degradê.
- Pílulas com contorno ou preenchidas como status (ver §4).

---

# 3. FUNDO

- Base: degradê vertical `#1a1816 → #131211`, com um spotlight neutro (branco a 3–4%) atrás do palco.
- Grade de quadradinhos de 44 px em cinza quente (~4%), contínua atrás de **todas** as slides (sem caixa, sem borda),
  esmaecendo nas bordas. Uma matriz de pontos discreta no canto inferior esquerdo, como a da hero.
- **Fluxo de leads (`LeadFlow`, canvas)**: contatos entram pela esquerda soltos e cinza, alinham em fileiras (a IA
  organiza), alguns viram laranja com rastro laranja → rosa (converteram) e são absorvidos. É a história do produto
  em miniatura. O mouse alinha os pixels próximos. Roda a 30 fps, só enquanto está na tela, e **nunca** reage pausando.
- Desligado em telas ≤ 980 px e com `prefers-reduced-motion`.

---

# 4. COMPONENTES

## Superfícies

- **Painel e card elevados**: gradiente `#2b2927 → #252321`, sem borda desenhada. O contorno é um `box-shadow`:
  highlight interno `inset 0 1px 0 rgba(255,255,255,.055)` + anel `0 0 0 1px rgba(245,240,232,.07)` + sombra de contato.
- **Sempre um degrau mais claros que o fundo**, como os cards brancos sobre o creme da hero.
- **Sem caixa dentro de caixa**: cabeçalhos usam uma linha fina (`0 1px 0 rgba(245,240,232,.07)`), listas usam divisores.
- Raio: painéis 10 px, cards 8 px.

## Identidade

- **Monograma (avatar)**: quadrado arredondado (`border-radius: 34%`), `linear-gradient(145deg,#47423d,#34302d)`,
  anel interno `rgba(255,255,255,.09)`. Nunca círculo cinza genérico.
- **Hub Its Time**: pequeno (≈ 5–7 cqw), círculo claro com logo, um anel tracejado fino girando devagar e halo mínimo.
  Fica **sobre uma linha reta**, nunca solto.
- **Nya** (`/assets/brand/nya.webp`) é a agente do site. Onde o canal é "site", use a Nya (sobre uma plaquinha clara,
  porque o arquivo é transparente), nunca um globo.
- Ícones: `lucide-react` com `strokeWidth` 2.2 e os glifos reais do app (`AgentIcons.tsx`).

## Status e ações

- **Status = ícone (ou ponto) + palavra.** Nunca pílula com contorno ou preenchida. A cor da marca só aparece onde
  algo pede atenção.
- Um **botão principal** por cena, em degradê, sem brilho. Secundários são texto sublinhado.
- Campo vazio = traço fino de 2 px (não a palavra "Aguardando").
- Valor recém salvo: uma varredura de degradê da esquerda para a direita, **uma vez**.
- Contadores: números em degradê, e uma linha fina de degradê que corre a cada mudança.

## Linhas e fluxos

- Fio 1 px `rgba(245,240,232,.16)`, retas, com "portas" (círculos de 2,4 px) onde encaixam.
- Fluxo = **traços em movimento** (`stroke-dasharray: 3 7`), laranja. Sem partículas brilhantes.
- Rampa de cor para progresso: **cinza → laranja → rosa**. Cards da cena 04 mudam de cor continuamente (`@property --cc-p`)
  conforme avançam na esteira, até o rosa claro.

## Tipografia

- Rótulos: Geist Mono, caixa alta, `letter-spacing: .12em`, 9–11 px.
- Números grandes: fonte display (`--font-display`), `tabular-nums`.
- Corpo: Geist Sans. Nunca texto longo dentro das cenas.

---

# 5. MOVIMENTO

- **A cena só começa depois que o slide terminou de aparecer** (`slidePhase` = `active`). Nunca roda invisível,
  e reinicia quando o slide fica totalmente oculto. Todo `setTimeout`/relógio novo deve passar por isso
  (`useSceneClock`, `slidePhase.ts`).
- **Hover nunca pausa** nada. Ele só troca o texto do centro (cena 01).
- **A barra de progresso termina junto com a animação.** Nunca sobra tempo parado entre o fim da animação e a troca.
- Entrada em cascata (~80 ms entre blocos); números contam a partir de 0 ao chegar.
- Cena 01: uma etapa a cada **3,5 s** (2,7 s parada + 0,8 s de deslize). Ciclo completo ≈ 58 s.
- Cena 07 recomeça sozinha (descansa ~4,5 s em "Fim do dia"). Se o visitante arrasta a linha do tempo, a demonstração
  volta sozinha 6 s depois que ele solta. Não existe botão "assistir de novo".
- A barra lateral de slides acompanha a timeline fixada (atual em degradê, já vistas tingidas).
- `prefers-reduced-motion`: mostra o estado final, sem canvas, sem pin. Telas ≤ 980 px: slides empilhados,
  `overflow-x: clip` em cada slide (nenhum elemento animado pode gerar rolagem horizontal).

---

# 6. CONTEÚDO

- Foco em **ganhar dinheiro**; **benefícios, não funções**; nada que o produto não faça.
- Funções reais do app que podem ser citadas: leitura de receita, áudio, catálogo, agenda, cobrança, encaminhamento,
  busca de unidades, visagismo, jornadas por evento/status/tempo na etapa/última mensagem. **Sem aniversário.**
- Vocabulário: **"acompanhamento"** (não "follow-up"); **nunca falar de "perda"** (use "ganho" ou "oportunidade");
  sem "dados fictícios" nem "exemplo ilustrativo".
- **CTA**: todo "Agendar demonstração" abre o WhatsApp comercial (Cristiano, +55 41 9608-1781) com mensagem pronta
  que qualifica o lead (nome, negócio, o que quer resolver, horários). Número e textos em `src/lib/whatsapp.ts`.
  A slide 07 usa uma abertura própria (`DAY_MESSAGE`).
- Fotos (`public/assets/visagism/`) vêm dos originais em alta resolução, servidas sem recompressão.

---

# 7. HERO — O QUE MUDOU

A hero continua creme com o sistema descrito em `System rules/Hero/`. Mudanças:

- **Menu**: `Soluções` (rola até a seção animada, `#como-funciona`), `Login` (`https://app.itstime.pro`) e
  `Agendar Demo`. **Saíram** Recursos e Preços (não existe página de preços).
- **Cards de entrada** (esquerda do celular): Novo lead (ícone da **Nya**), Mensagem recebida (WhatsApp),
  Interação (Instagram) e **Horário agendado (Agenda)**. **Não há card de e-mail**: não trabalhamos com e-mail.
- **Faixa de confiança**: "EMPRESAS QUE ESCALAM CONTAM COM A ITS TIME." Os logos de clientes estão ocultos pela flag
  `showClientLogos` em `FullSite.tsx` (código e estilos mantidos).
- **Fundo animado**: o mesmo `LeadFlow`, com perfil claro (`variant="hero"`): atravessa a página inteira, discreto atrás
  do título e mais presente perto do celular e do dashboard.
- **Ícone de brilho** (canto do dashboard) em degradê laranja → rosa.
- **Ícone da aba (favicon)**: usar o `favicon.ico` do app (`chat-query/public/favicon.ico`, visor creme). Nunca o
  logo PNG transparente: o visor do relógio fica vazado.
- **Tablet e celular (≤ 820 px)**: o sistema vira uma coluna que se dimensiona sozinha (entradas, celular, dashboard,
  faixa). Nada pode ficar sobreposto; no celular usa a largura real da tela.
- "Agente Follow-up" no card "Automações Ativas" da hero foi **mantido** de propósito (nome do agente).

---

# 8. CHECKLIST PARA QUALQUER ALTERAÇÃO NA SEÇÃO

- [ ] O fundo e as superfícies continuam neutros? O degradê aparece só em detalhe?
- [ ] Sem glow forte, sem verde (exceto o "online"), sem pílulas como status?
- [ ] Os cards estão um degrau mais claros que o fundo?
- [ ] A cena só inicia depois que o slide terminou de aparecer, e a barra termina com a animação?
- [ ] Hover não pausa nada? `prefers-reduced-motion` mostra o estado final?
- [ ] Sem overflow horizontal em 1672, 1440, 820 e 390 px?
- [ ] O texto fala de ganho e de acompanhamento (nunca de perda ou follow-up), sem prometer o que o app não faz?
- [ ] `npx tsc --noEmit`, `npx eslint src` e `tests/feature-section.spec.ts` passam?
