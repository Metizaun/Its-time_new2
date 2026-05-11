# Design System — AI SDR Hero Infrastructure

# 1. Conceito

## Direção Visual

“Inteligência comercial organizada.”

A hero deve transmitir:

- automação inteligente
- precisão estratégica
- escala organizada
- IA como sistema operacional comercial

---

# 2. Sensação Visual

A composição precisa parecer:

- uma infraestrutura comercial do futuro
- sofisticada silenciosamente
- tecnológica sem exageros
- premium enterprise
- editorial minimalista

---

# 3. NÃO parecer

- app comum
- dashboard SaaS genérico
- cyberpunk neon
- interface gamer
- sci-fi exagerado

---

# 4. Referências Estéticas

Mistura de:

- Apple Keynote
- Linear
- Stripe
- OpenAI
- Notion AI
- Editorial Suíço

---

# 5. Estrutura Geral da Hero

```txt
┌──────────────────────────────────────────────┐
│                                              │
│  LEFT CONTENT       CENTER MOCKUP      RIGHT │
│  Copy + CTA         Floating Phone     Cards │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 6. Fundo

## Base

```css
background: #F5F3EF;
```

---

## Sensação

- branco infinito editorial
- profundidade minimalista
- fade suave
- iluminação limpa
- espaço negativo dominante

---

## Gradientes

```css
background:
radial-gradient(
circle at center,
rgba(255,255,255,0.9),
#F5F3EF
);
```

---

# 7. Elemento Central

## Mockup Principal

iPhone premium:

- frontal
- levemente inclinado
- centralizado
- elegante
- floating

---

## Rotação

```css
transform:
rotate(7deg);
```

---

## Shadow

```css
filter:
drop-shadow(
0 80px 60px rgba(0,0,0,0.14)
);
```

---

## Tela do iPhone

A interface deve mostrar:

- conversa SDR IA
- lead sendo qualificado
- confirmação de agendamento
- badges de conversão
- pipeline miniatura
- automação acontecendo em tempo real

---

# 8. Sistema de Projeções

## Conceito

Os elementos devem emergir do celular
como módulos inteligentes conectados.

---

## Tipos de Cards

- WhatsApp
- CRM
- IA
- Pipeline
- Conversão
- Follow-up
- Agendamento

---

# 9. Floating Cards Style

## Base

```css
background:
rgba(255,255,255,0.72);

backdrop-filter:
blur(24px);

border:
1px solid rgba(255,255,255,0.8);

border-radius:
28px;
```

---

## Shadow

```css
box-shadow:
0 10px 40px rgba(0,0,0,0.05),
0 4px 14px rgba(0,0,0,0.03);
```

---

## Estética

- floating UI
- sombras suaves
- bordas finas
- fundo off-white
- detalhes estratégicos em laranja

---

# 10. Estrutura Visual do Fluxo

## Lado Esquerdo

Representa:

- caos organizado
- inputs
- leads
- mensagens
- canais de entrada

---

## Lado Direito

Representa:

- automação
- estrutura
- agendamentos
- pipeline
- sistema operacional comercial

---

# 11. Fluxo Conceitual

```txt
CAOS → IA → ESTRUTURA
```

---

# 12. Partículas e Modularidade

## Elementos

Inspirados diretamente na referência:

- quadrados pixelados
- micro grids
- dots modulares
- pequenos módulos organizados

---

## Regras

Nunca exagerar.

As partículas devem:

- respirar
- ter baixa opacidade
- criar profundidade
- reforçar modularidade

---

# 13. Floating Particles

## Sizes

```css
4px até 14px;
```

---

## Opacity

```css
opacity:
0.08 até 0.8;
```

---

## Colors

```css
#FF5A1F
#FF4D6D
#D9D6D1
#8D8A86
```

---

# 14. Connection Lines

## Objetivo

Criar sensação de:

- fluxo de dados
- inteligência viva
- sistema neural
- infraestrutura conectada

---

## Style

```css
stroke:
rgba(255,90,31,0.22);

stroke-width:
1.5px;
```

---

# 15. Paleta de Cores

## Base

```css
#0A0A0A
#F5F3EF
#D9D6D1
#8D8A86
```

---

## Accent

```css
#FF5A1F
#FF4D6D
#FF7AA2
```

---

# 16. Tipografia Hero

## Headline

Grande.
Forte.
Editorial.

---

## Exemplo

```txt
IA não responde leads.
Direção responde.
```

---

## Style

```css
font-size:
clamp(58px, 7vw, 104px);

line-height:
0.92;

letter-spacing:
-0.07em;

font-weight:
700;
```

---

# 17. Highlight Gradient

```css
background:
linear-gradient(
90deg,
#FF5A1F,
#FF4D6D
);

-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

# 18. Subheadline

## Exemplo

```txt
Agentes de IA, SDR automatizado e funis inteligentes
operando como um sistema comercial contínuo.
```

---

## Style

```css
font-size:
24px;

line-height:
1.5;

color:
#6A6764;
```

---

# 19. CTA System

## Primary Button

```css
height:
64px;

padding:
0 32px;

background:
#0A0A0A;

color:
white;

border-radius:
16px;
```

---

## Hover

```css
transform:
translateY(-2px);

box-shadow:
0 12px 24px rgba(0,0,0,0.14);
```

---

# 20. Motion Design

Tudo deve:

- respirar
- flutuar lentamente
- mover suavemente

---

# 21. Micro Motion

## Elementos animados

- partículas
- blur modular
- cards orbitando
- linhas conectando sistemas

---

## Floating

```css
animation:
float 8s ease-in-out infinite;
```

---

# 22. Regras IMPORTANTES

## NUNCA usar

- neon cyberpunk
- azul exagerado
- holograma sci-fi
- glow excessivo
- dashboard poluído
- gradientes agressivos
- elementos gamer

---

# 23. SEMPRE usar

- espaço negativo
- modularidade
- micro detalhes
- grids organizados
- editorial tech
- composição respirando
- contraste refinado
- sofisticação silenciosa

---

# 24. Cinematic Prompt

```txt
Ultra premium futuristic SaaS hero section background, infinite soft white environment, floating iPhone mockup in center, elegant SDR AI conversation on screen, abstract modular interface projections emerging from the device, floating CRM cards, automation workflows, pipeline system, WhatsApp AI assistant UI, strategic orange and coral accents, swiss editorial design, minimal tech aesthetic, modular particles and pixel grids floating around, structured intelligence visual language, cinematic soft lighting, glass precision, extremely clean composition, Apple + Linear + OpenAI inspired, subtle depth, premium startup branding, organized data flow from chaos to intelligent system, white infinite background, elegant shadows, futuristic business automation atmosphere, ultra detailed, sophisticated motion design feeling, 16:9
```
