# Guia de boas práticas no WhatsApp — 29/10/2026

Escopo: site institucional `itstime.pro`, repositório `Metizaun/Its-time_new2`, serviço Swarm `itstime-site_web`. Base: `origin/main` em `25d9288955c82741a1e11d74a9af31743246fbe2`. Branch: `codex/whatsapp-boas-praticas-20261029`; destino: `main`, por fast-forward sem force push. Segue o procedimento específico deste site em `2026-10-16-blog-production.md`.

## Conteúdo e organização

- `/tutoriais/whatsapp-boas-praticas`: oito seções, fontes oficiais verificadas em 29/10/2026, exemplos fictícios e distinção entre regras da Meta e recomendações operacionais da Its Time.
- Aproveita a navegação de Tutoriais e o padrão visual da página de conexão do WhatsApp oficial. Acesso pelo rodapé, pela barra lateral e pelo tutorial de conexão; URL incluída no sitemap, com canonical e Open Graph.
- Abrange autorização e descadastro, janela de 24 horas da API, categorias, qualidade, automação com escalonamento, dados e atividades restritas. Não promete imunidade a bloqueios nem aprovação pela Meta.
- Corrige dois erros de lint preexistentes em `CookieConsent` e `DeletionStatus`: sincronização inicial agendada após montagem, com cancelamento no cleanup. Fluxos existentes preservados.

## Verificação

- `npm ci --no-audit --no-fund`, ESLint sem erros (dois avisos preexistentes em `opengraph-image.tsx`), `tsc --noEmit` e build de produção com `SHOW_FULL_SITE=true`.
- Playwright contra o build em porta isolada: entrada pelo rodapé, indicação de página atual, links recíprocos com o tutorial de conexão, oito âncoras, fontes externas seguras, canonical, sitemap e rotas institucionais HTTP 200.
- Layout sem overflow em 320, 390, 768, 1024 e 1280 px; inspeção de screenshots desktop e celular; sem erros de JavaScript.
- Consulta de exclusão por código validada com resposta simulada, sem consultar dados de clientes. Banner validado separadamente com GA4 habilitado localmente e chamadas de analytics interceptadas.
- O site público atual não contém os scripts de GA4/Umami; manter a configuração de produção existente. A habilitação local serve apenas à verificação do banner.

## Publicação e retorno

Arquivar somente o commit de release, transferir para diretório exclusivo em `/opt/itstime-site-releases/`, construir imagem `itstime-site:<SHA>` com `SHOW_FULL_SITE=true` e rótulo OCI de revisão igual ao SHA. Testar a imagem em container temporário, exposto apenas em localhost. Após aprovação dos checks, publicar os mesmos refs em GitHub e atualizar somente a imagem de `itstime-site_web`, preservando `start-first`, rollback automático, rede e Traefik. Salvar antes uma cópia da configuração da stack.

Conferir convergência 1/1, SHA da imagem, HTTPS público, guia, rodapé, links, sitemap e tutorial. Não há mudanças no CRM, backend ou banco.

Imagem anterior: `itstime-site:25d9288955c82741a1e11d74a9af31743246fbe2`. Em caso de falha, usar `docker service rollback itstime-site_web` e restaurar a cópia da configuração da stack. Preservar a imagem anterior.
