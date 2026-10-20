# Analytics (Umami)

O site usa Umami (sem cookies, sem banner de consentimento). O painel roda na VPS em `https://stats.itstime.pro`.

## Ligar o rastreamento no build

As duas variáveis são públicas e entram no bundle na hora do build. Sem elas, o site vai sem rastreamento.

```bash
docker build --build-arg SHOW_FULL_SITE=true \
  --build-arg NEXT_PUBLIC_UMAMI_SRC=https://stats.itstime.pro/script.js \
  --build-arg NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id do site no painel> \
  -t itstime-site:<sha> .
```

Para testar local, ponha as mesmas variáveis em `.env.local`. O script só envia dados de `itstime.pro` (`data-domains`), então o localhost não suja as métricas.

## O que é medido

Automático do Umami: visitas, páginas mais acessadas, origem, país, dispositivo, navegador.

Eventos de `src/components/AnalyticsTracker.tsx`:

| Evento | Dados | Responde |
|---|---|---|
| `section_view` | `section` | Quantos chegaram a cada parte da página |
| `section_time` | `section`, `seconds` | Onde passam mais tempo (a seção animada é dividida por slide: `como-funciona/<slide>`) |
| `scroll_depth` | `percent` (25/50/75/100) | Até onde rolam |
| `exit` | `section`, `scroll` | Onde a pessoa fecha a página |
| `cta_whatsapp` | `section`, `label` | Qual botão de demo converte e de onde |
| `cta_email`, `link_external`, `click` | `section`, `label`/`host` | Demais cliques |

Nomes de seção ficam em `ZONES` no tracker. Ao criar uma seção nova, acrescente o seletor lá.

## Mapa de calor e gravação de sessão

O Umami não faz isso. Se quiser ver o mapa de cliques desenhado em cima da página e gravações, a opção grátis é o Microsoft Clarity (um script extra).
