# Blog Its Time

O blog está em `/blog`. Cada post usa `/blog/[slug]`. White mode segue os tokens existentes em `globals.css`; as regras de layout e motion ficam isoladas em `src/styles/blog.css`.

Por preferência explícita da marca, os botões principais e pequenos detalhes usam o degradê laranja → rosa (`--blog-brand-gradient`). O texto dos botões é escuro para manter contraste nas duas pontas do degradê. Fundos e superfícies continuam neutros e claros.

## Criar um post

Adicione uma entrada ao array `posts` em `src/lib/blog.ts`, usando o tipo `BlogPost`. A primeira entrada aparece em destaque. Preencha slug único, título, resumo, categoria, data ISO (`AAAA-MM-DD`), autor, arte, ideia central e blocos. Publique apenas conteúdo revisado; as três entradas iniciais são propostas editoriais para revisão. A publicação ocorre no próximo build/deploy, sem painel administrativo ou banco de dados.

Blocos disponíveis, em qualquer ordem:

| Tipo        | Uso                                         |
| ----------- | ------------------------------------------- |
| `text`      | Título e parágrafos                         |
| `steps`     | Etapas numeradas                            |
| `checklist` | Lista prática                               |
| `quote`     | Destaque editorial, sem atribuição fictícia |
| `cta`       | Chamada contextual para demonstração        |
| `faq`       | Perguntas expansíveis                       |

Blocos com `id` entram automaticamente no sumário. Use IDs únicos dentro do post, sem espaços ou acentos. As artes `conversation`, `journey` e `schedule` são composições CSS responsivas, sem dependência de imagens externas. O tempo de leitura é estimado automaticamente.

## Estrutura recomendada

Introdução → etapas práticas → destaque → CTA contextual → aprofundamento → checklist → FAQ. O template inclui uma CTA final obrigatória, autor e artigos relacionados. Mantenha o conteúdo sobre ganhos, acompanhamento e funções reais da Its Time.

## Conversão e acessibilidade

As CTAs reutilizam o WhatsApp comercial de `src/lib/whatsapp.ts`, com perguntas de qualificação e o título do post na mensagem. Nenhuma mensagem é enviada automaticamente. Não há captura de e-mail. A busca e os filtros funcionam localmente.

O movimento inclui flutuação lenta, linhas de fluxo, entrada na rolagem e progresso de leitura em navegadores compatíveis. Conteúdo permanece visível sem suporte às animações CSS. `prefers-reduced-motion` desativa o movimento. Sumário e FAQ usam links e elementos nativos; compartilhamento usa a área de transferência com retorno de sucesso ou erro.

Título, descrição, canonical, Open Graph e JSON-LD são derivados de cada post. Antes de publicar, revise o conteúdo, datas e CTAs; execute lint, TypeScript, build e `npx playwright test tests/blog.spec.ts`.

## Fotos e artigos vindos do sistema de marketing

**Capa (`cover`)** — campo opcional do `BlogPost`: `{ src, alt, caption? }`. Com `cover`, a listagem, o destaque, o topo do artigo, o `og:image` e o JSON-LD usam a foto; sem ela vale a arte em CSS (`art`). `src` é um caminho do próprio site (`/blog/<slug>/arquivo.webp`, ficando em `public/blog/<slug>/`) ou `https://`.

**Bloco `image`** — `{ type: "image", src, alt, caption? }`, em qualquer posição dos `blocks`. Não tem `id` (não entra no sumário). Na listagem e no destaque a foto é decorativa (`alt` vazio, o título já diz o assunto); no artigo vale o `alt`.

**`src/content/blog/<slug>.json`** — um arquivo por artigo, no formato do `BlogPost` (`slug`, `title`, `excerpt`, `category`, `date` AAAA-MM-DD, `author`, `art`, `takeaway`, `cover?`, `blocks`). É lido do disco por `src/lib/blog-posts.ts` (`getAllPosts`), junto com os posts editoriais de `src/lib/blog.ts`:

- o nome do arquivo precisa ser igual ao `slug`; slug repetido: o JSON vence o editorial;
- ordem: data mais recente primeiro, empate pelo slug;
- arquivo inválido (JSON quebrado, campo faltando, bloco desconhecido, `src` fora de `/` ou `https://`) é ignorado com um aviso `[blog] ignorando <arquivo>` no log — nunca derruba o build;
- `blog-posts.ts` usa `node:fs`: só pode ser importado por código de servidor. Componentes de cliente continuam importando apenas `blog.ts`.

`npx playwright test tests/blog-photos.spec.ts` cria artigos temporários nessa pasta e confere capa, foto no corpo, legenda, `og:image`, arte em CSS sem capa e a rejeição de JSON quebrado.

## Evolução editorial — 2026-10-16

O artigo `/blog/como-transformar-conversas-em-vendas` é o piloto: abertura direta, h3, diagrama próprio, etapas, tabela de responsabilidades, limites, CTA contextual, checklist, leitura relacionada, FAQ e referências. O diagrama descreve uma proposta de fluxo; não é uma captura de uma operação real. Não há métricas ou resultados inventados.

### Contrato para o produtor de conteúdo

Posts antigos continuam válidos. Novos campos são opcionais:

| Campo           | Formato                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `authorProfile` | `{ name, role?, bio?, url?, kind?: "Person" ou "Organization" }`; substitui a apresentação de `author` na página e nos metadados |
| `updated`       | Data real `AAAA-MM-DD`, igual ou posterior a `date`; exibida como atualização quando diferente da publicação                     |
| `archetype`     | `noticia`, `explicador`, `analise`, `guia-ofertas` ou `guia-pratico`                                                             |
| `tags`          | Lista de assuntos usada para selecionar relacionados                                                                             |
| `relatedSlugs`  | Ordem editorial preferida dos relacionados; referências inexistentes não geram links                                             |
| `sources`       | Lista de `{ label, url, note? }` exibida ao final                                                                                |
| `editorialNote` | Explicação real do escopo ou método editorial; nunca inventar teste, especialista ou revisão                                     |
| `finalCta`      | `{ title, text, label }` para contextualizar a CTA final obrigatória                                                             |

`author` como string permanece obrigatório para compatibilidade com o produtor existente. A identidade efetiva vem de `authorProfile`, quando informado. `updated` altera também `dateModified` e o Open Graph; não é atualizado automaticamente a cada build.

Novos blocos:

| Tipo      | Campos                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `table`   | `id`, `title`, `columns: string[]`, `rows: string[][]`, `caption?`; cada linha deve ter o mesmo número de células do cabeçalho |
| `callout` | `title`, `text`, `tone?: "note" ou "attention"`                                                                                |
| `verdict` | `id`, `title`, `label`, `pros: string[]`, `cons: string[]`, `recommendation`, `price?`; sem nota ou preço obrigatório          |
| `related` | `slugs: string[]`, `title?`; mostra até dois artigos existentes e exclui o próprio artigo                                      |

`text` aceita `subsections?: { title, paragraphs: string[] }[]`, renderizadas como h3 dentro da seção h2. Não inclui esses subtítulos no sumário principal.

Texto editorial suporta somente links `[rótulo](https://fonte)` e `[rótulo](/blog/slug)` e âncoras. Não há HTML, scripts ou interpretação de Markdown completo. Links externos usam `noopener noreferrer`; URLs inseguras são rejeitadas no importador e não são transformadas em links pelo renderizador. Títulos e botões continuam texto simples.

`cover` e `image` aceitam `credit?`, `sourceUrl?`, `width?`, `height?`, `fit?: "contain" ou "cover"`. Informe as duas dimensões juntas para reservar a proporção correta. Imagens no corpo usam `contain` por padrão: não cortar telas, diagramas ou números. A capa tem legenda e crédito no artigo, omitidos nos cards. Fotos decorativas podem usar `cover` explicitamente.

O template de notícia omite a barra lateral, e artigos com apenas uma seção usam a coluna de leitura centralizada. Tabelas têm rolagem própria no celular. Os relacionados finais usam curadoria explícita, tags e categoria; não são preenchidos com artigos sem ligação temática. A listagem envia ao navegador apenas resumos e metadados de capa, sem o corpo inteiro dos posts.

O produtor externo deve exportar exatamente esses campos. Os arquivos `tools/generation/editorial_voice.py` e `tools/generation/blog_quality.py` citados na proposta não pertencem a este repositório; sua implementação não foi alterada. O contrato do site e os testes de importação são a referência para essa integração.

### Erros objetivos e sugestões editoriais

O importador rejeita estrutura inválida, datas impossíveis, atualização anterior à publicação, URLs inseguras, IDs duplicados, blocos desconhecidos e tabelas inconsistentes. Mantém o comportamento anterior: ignora o JSON inválido com aviso, sem derrubar o site.

`editorialWarnings(post)` em `src/lib/blog-editorial.ts` sugere revisar bio, fontes, créditos, parágrafos longos e algumas expressões genéricas. Não bloqueia conteúdo, não conta nomes ou números como prova e não verifica a verdade de afirmações. Para mostrar os avisos no build, use a variável opcional `BLOG_EDITORIAL_WARNINGS=true`. A revisão humana precisa confirmar fontes, utilidade, limites e direitos de uso das imagens.

### Conversão

Ao clicar numa CTA do blog, a página emite `window` CustomEvent `its-time:blog-cta` com `{ event: "blog_cta_click", article, position, path }`. `position` identifica cabeçalho, bloco intermediário ou final. Não há dados pessoais, persistência ou envio a terceiros. Um consumidor de analytics ainda precisa ser conectado para armazenar e consultar os eventos. O evento mede clique, não venda concluída.

Execute `npm run test:blog` para validar formato, links, autoria, datas, blocos, compatibilidade, CTAs e responsividade. Revisão editorial não exige inserir número, preço, imagem ou CTA intermediária em toda seção: escolha os elementos que ajudam a responder à dúvida do leitor.

Os testes usam a porta 3000 por padrão. `PLAYWRIGHT_BASE_URL` permite validar um servidor local existente em outra porta, sem interrompê-lo. As imagens do corpo podem ser abertas em tamanho original pelo leitor.
