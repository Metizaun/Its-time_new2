# SECTION 02 — FEATURE SLIDES IMPLEMENTATION GUIDE
## Projeto: Síntese
## Contexto
Esta seção NÃO deve parecer uma landing page SaaS tradicional.

Ela deve parecer:
- uma infraestrutura operacional viva
- um sistema comercial inteligente
- uma arquitetura modular de IA
- uma inteligência estratégica sendo revelada conforme o usuário scrolla

A seção deve transmitir:
- sofisticação
- autoridade
- inteligência operacional
- escala
- automação premium
- previsibilidade

---

# OBJETIVO DA SEÇÃO

Criar uma experiência cinematográfica de scroll.

NÃO criar:
- carousel
- slider comum
- seção de cards genéricos
- dashboard tradicional

A sensação deve ser:
> "uma inteligência operacional sendo construída em tempo real"

---

# ARQUITETURA DA EXPERIÊNCIA

## Estrutura da página

```txt
Hero
↓
Logos
↓
Intro Sticky Section
↓
7 Feature Slides
↓
Resultados
↓
CTA Final
```

---

# IMPLEMENTAÇÃO TÉCNICA

## Stack recomendada

### Motion
```bash
gsap
ScrollTrigger
```

### Smooth Scroll
```bash
lenis
```

### Motion auxiliar
```bash
framer-motion
```

---

# ESTRUTURA DA SECTION

## Wrapper principal

```css
.feature-section-wrapper {
  height: 800vh;
  position: relative;
}
```

---

## Sticky Container

```css
.feature-sticky-container {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

---

## Slides

```css
.feature-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(0.98);
}
```

---

# ESTRUTURA DE PASTAS

```txt
/components
  /FeatureSlides
    Intro.tsx
    Slide01.tsx
    Slide02.tsx
    Slide03.tsx
    Slide04.tsx
    Slide05.tsx
    Slide06.tsx
    Slide07.tsx

/hooks
  useFeatureScroll.ts

/styles
  feature-section.css
```

---

# DIREÇÃO VISUAL

## A seção NÃO pode repetir a Hero

A Hero já utiliza:
- mockup central
- floating UI
- dashboards
- composição SaaS

A seção de features deve:
- abandonar o mockup central
- abandonar a estrutura hero-like
- revelar mecanismos internos
- mostrar sistemas invisíveis

---

# DIREÇÃO ESTÉTICA

## Referências visuais

Mistura de:
- Apple
- Linear
- Stripe
- OpenAI
- Swiss Editorial
- Notion AI

---

# ESTILO VISUAL

## Sempre usar

- grids modulares
- quadrados pixelados
- partículas organizadas
- linhas finas
- módulos conectados
- espaço negativo
- glow extremamente suave
- profundidade minimalista
- tipografia editorial
- composição respirando

---

## Nunca usar

- neon cyberpunk
- azul exagerado
- dashboards poluídos
- glow gamer
- hologramas sci-fi
- excesso de blur
- animações agressivas
- elementos futuristas genéricos

---

# PALETA

## Background

```txt
#050505
#0A0A0A
#111111
```

## Accent

```txt
#FF5A1F
#FF4D6D
#FF7AA2
```

## Neutral

```txt
#D9D6D1
#8D8A86
#F5F3EF
```

---

# MOTION DESIGN

## O movimento deve parecer:

- lento
- preciso
- inteligente
- silencioso
- sofisticado

---

# O QUE ANIMAR

## Sim

- partículas convergindo
- grids reorganizando
- linhas conectando módulos
- cards surgindo lentamente
- estruturas expandindo
- fluxos organizando caos
- nodes se conectando

---

## Não

- bounce
- overshoot exagerado
- zoom agressivo
- rotação aleatória
- animação frenética
- partículas explosivas

---

# PERFORMANCE

## SEMPRE usar

```css
transform
opacity
filter
will-change
```

---

## EVITAR

```css
top
left
width
height
```

---

# TRANSIÇÕES

## Regra principal

Cada slide deve EVOLUIR o anterior.

Nunca:
- resetar visualmente
- trocar brutalmente
- parecer outro sistema

O usuário deve sentir:
> continuidade operacional

---

# INTRO SLIDE

## Objetivo

Transição entre:
- Hero
- Sistema operacional

---

## Visual

- partículas surgindo
- grids aparecendo
- linhas estruturando caos
- glow modular suave

---

## Headline

```txt
Inteligência que opera.
Estratégia que escala.
```

---

# SLIDE 01 — MULTIAGENTES

## Conceito

Agentes especializados operando como um sistema único.

---

## Visual

- núcleo central
- nodes orbitando
- conexões finas
- partículas estruturadas

---

## Motion

- linhas crescendo
- conexões sendo criadas
- agents fade-in
- órbitas suaves

---

## Headline

```txt
Agentes diferentes.
Operando como um sistema único.
```

---

# SLIDE 02 — MEMÓRIA CONTEXTUAL

## Conceito

A IA entende histórico, comportamento e intenção.

---

## Visual

- fragmentos de contexto
- cards reorganizando
- timeline modular
- memória convergindo

---

## Motion

- cards dispersos → organizados
- informações convergindo
- reconstrução de contexto

---

## Headline

```txt
A conversa continua.
Mesmo dias depois.
```

---

# SLIDE 03 — EXECUÇÃO OPERACIONAL

## Conceito

A IA move a operação.

---

## Visual

- pipeline vivo
- etapas operacionais
- ações automáticas
- estrutura modular

---

## Motion

- pipeline avançando
- etapas acendendo
- tarefas concluídas
- cards sincronizando

---

## Headline

```txt
A IA não só responde.
Ela movimenta a operação.
```

---

# SLIDE 04 — OMNICHANNEL

## Conceito

Todos os canais operando como um único sistema.

---

## Visual

- WhatsApp
- Instagram
- Telegram
- Site

Convergindo para:
- núcleo central

---

## Motion

- inputs entrando no core
- partículas convergindo
- canais sincronizando

---

## Headline

```txt
WhatsApp.
Instagram.
Site.
Tudo conectado.
```

---

# SLIDE 05 — INTELIGÊNCIA COMERCIAL

## Conceito

Conversas viram direção estratégica.

---

## Visual

- heatmaps
- analytics editoriais
- grids inteligentes
- matrizes operacionais

---

## Motion

- dados atualizando lentamente
- números convergindo
- gráficos estabilizando

---

## Headline

```txt
Conversas viram dados.
Dados viram direção.
```

---

# SLIDE 06 — ESCALA ESTRUTURADA

## Conceito

Escalar sem caos operacional.

---

## Visual

- blocos modulares crescendo
- arquitetura expandindo
- estrutura estabilizando

---

## Motion

- grids expandindo
- módulos crescendo
- estrutura se consolidando

---

## Headline

```txt
Crescimento sem caos operacional.
```

---

# SLIDE 07 — RESULTADO

## Conceito

A infraestrutura inteira estabilizada.

---

## Visual

- sistema completo
- estrutura organizada
- rede operacional consolidada

---

## Motion

- partículas estabilizam
- linhas desaceleram
- glow reduz suavemente

---

## Headline

```txt
Operação organizada.
Crescimento previsível.
```

---

# DIREÇÃO TIPOGRÁFICA

## Headlines

- grandes
- fortes
- editoriais
- geométricas
- muito contraste

---

## Estrutura

Exemplo:

```txt
Inteligência que opera.
Estratégia que escala.
```

---

# REGRA DE OURO

A seção NÃO deve parecer:
- um conjunto de slides
- uma apresentação
- um SaaS comum

Ela deve parecer:
> uma inteligência operacional invisível sendo revelada conforme o usuário desce.

---

# ASSINATURA VISUAL

## Conceito principal

```txt
Caos operacional → inteligência estruturada
```

---

# EXPERIÊNCIA FINAL

O usuário deve sentir:

- precisão
- autoridade
- sofisticação
- inteligência invisível
- infraestrutura premium
- operação organizada
- escalabilidade real
