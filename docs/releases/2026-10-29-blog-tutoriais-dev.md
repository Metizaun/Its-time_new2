# Navegação do blog: Tutoriais e Área dev — 29/10/2026

Escopo: site institucional `itstime.pro`, serviço Swarm `itstime-site_web`. Base: `d494b11a57caf25b25741b79b04118046c03971a`, branch `codex/blog-tutoriais-dev-20261029`, destino `main` por fast-forward sem force push. Procedimento de publicação: `2026-10-16-blog-production.md`.

## Correção

O blog listava somente artigos editoriais e seu menu não oferecia acesso aos tutoriais e à documentação. Agora `/blog#tutoriais` reúne os dois guias de WhatsApp e `/blog#dev` reúne Agenda Universal, Webhook de leads, Webhook de cobrança e Jornadas RB. Há atalhos no menu, no início da página e no rodapé; as páginas dos guias oferecem retorno ao blog. O menu se adapta a telas pequenas sem ocultar esses acessos.

Um catálogo compartilhado em `src/lib/resources.ts` alimenta os cards, a barra lateral e o sitemap. Os textos completos continuam nas URLs originais. Os artigos e seus filtros continuam na seção Artigos; não há cópias dos guias com novas URLs de blog.

## Validação

- ESLint sem erros (dois avisos preexistentes em `opengraph-image.tsx`), TypeScript e build de produção com `SHOW_FULL_SITE=true`.
- Suíte do blog: 14 testes passaram inicialmente. O teste restante continha contagens fixas de um catálogo antigo; após usar o catálogo atual e uma busca inequívoca pelo artigo, passou em execução isolada. Total: 15 cenários validados, incluindo os dois novos testes de navegação.
- Playwright contra o build: dois tutoriais, quatro documentos, destinos HTTP 200, inclusão de todos no sitemap, retorno ao blog, entrada na Área dev a partir de um artigo e ausência de erros de JavaScript.
- Sem overflow em 320, 390, 768, 1024 e 1280 px; screenshots de menu, Tutoriais e Área dev conferidos em desktop e celular.

## Publicação

Arquivar somente o commit, construir imagem `itstime-site:<SHA>` com `SHOW_FULL_SITE=true` e rótulo OCI de revisão correspondente; validar em container temporário exposto apenas em localhost. Publicar os mesmos refs no GitHub e atualizar somente a imagem do serviço após salvar cópia da stack, preservando rede, Traefik, uma réplica, `start-first` e rollback automático. Conferir convergência 1/1, HTTPS público, navegação e sitemap. Sem mudanças no CRM, backend, banco ou configuração de analytics.

Retorno: `docker service rollback itstime-site_web`, restaurando a cópia anterior da stack. Imagem anterior: `itstime-site:d494b11a57caf25b25741b79b04118046c03971a`.
