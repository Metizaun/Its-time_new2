# Publicação do blog — 2026-10-16

Escopo: site institucional `itstime.pro`, repositório `Metizaun/Its-time_new2`, serviço Docker Swarm `itstime-site_web`. O CRM, API, workers, Supabase e Vercel pertencem a outras implantações e não participam desta release.

Base: `origin/main` em `2dd89a363f1cf38576f8d30ab4e8d8b25f556899`. Fonte: branch `codex/blog-production-20261016`, criada em worktree limpo. Publicar a mesma revisão em `main` e nesta branch, sem force push. Alterações abertas de rodapé e documentação de design foram preservadas no workspace original e não entram nesta release.

Inclui blog modular, importação JSON compatível, fontes e links seguros, autoria e atualização, imagens, tabelas, destaques, vereditos, relacionados, CTAs contextuais, artigo piloto e correção do título da aba. Dependências Docker instaladas pelo lockfile. Não há migração de banco de dados.

## Validação e build

Instalar com `npm ci`; executar ESLint, TypeScript, suíte `npm run test:blog` em porta isolada e build com `SHOW_FULL_SITE=true`. O servidor de testes deve usar este worktree, sem reutilizar o servidor de desenvolvimento do workspace original.

Depois do commit, registrar `git rev-parse HEAD` como `RELEASE_SHA`. Arquivar apenas o commit com `git archive`, transferir para um diretório exclusivo em `/opt/itstime-site-releases/` e construir:

```sh
docker build --build-arg SHOW_FULL_SITE=true --build-arg RELEASE_SHA="$RELEASE_SHA" -t "itstime-site:$RELEASE_SHA" .
```

O rótulo OCI `org.opencontainers.image.revision` deve corresponder ao commit. Antes de mudar o serviço, testar a nova imagem em container temporário ligado apenas a localhost e confirmar `/`, `/blog` e o artigo piloto.

## Publicação

Salvar cópia do arquivo `/opt/itstime-site/docker-stack.itstime.yml`, alterar somente a imagem do serviço `web` para a tag imutável e atualizar `itstime-site_web`. Preservar as configurações atuais de rede, Traefik, uma réplica, atualização `start-first` e rollback automático.

Confirmar convergência `1/1`, imagem e revisão OCI. Verificar HTTPS público, título sem manutenção, link do blog na home, listagem, artigo piloto, fontes, CTAs e ausência de overflow no celular. Conferir o redirecionamento de `www.itstime.pro`.

## Retorno à versão anterior

Imagem anterior: `itstime-site:2dd89a3`. Se houver falha após atualização, usar `docker service rollback itstime-site_web`, restaurar a configuração salva e verificar a home novamente. Não remover a imagem anterior durante esta publicação. Não executar reset, limpeza ou rollback de banco.

O evento de clique de CTA precisa de consumidor de analytics para persistência. O contrato do gerador externo está em `docs/blog-editorial.md`; seus scripts externos não foram alterados.
