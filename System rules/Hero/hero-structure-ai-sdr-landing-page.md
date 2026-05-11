# Hero Structure — AI SDR Landing Page

# 1. Objetivo da Estrutura

A hero section deve transmitir imediatamente:

- IA operacional
- automação comercial premium
- sensação de escala
- sofisticação visual
- movimento inteligente
- pipeline vivo
- autoridade tecnológica

A composição inteira deve parecer:

- um ecossistema conectado
- um centro operacional de IA
- um dashboard comercial vivo

---

# 2. Estrutura Geral do Layout

## Grid Principal

```txt
┌──────────────────────────────────────────────┐
│                                              │
│  LEFT CONTENT        CENTER MOCKUP      RIGHT│
│  Copy + CTA          iPhone             Metrics│
│                      Floating           Dashboard│
│                      Event Cards        Cards│
│                                              │
└──────────────────────────────────────────────┘
```

---

# 3. Distribuição Horizontal

| Área | Width |
| --- | --- |
| Left Content | 32% |
| Center Mockup | 36% |
| Right Metrics | 32% |

---

# 4. Estrutura da Left Section

## Objetivo

A esquerda deve:

- comunicar proposta de valor
- gerar impacto imediato
- preparar o CTA
- equilibrar o peso visual do mockup

---

# 5. Left Section Hierarquia

## Eyebrow

### Estrutura

```txt
[ Orange Line ] AUTOMAÇÃO DE SDR COM IA
```

---

## Style

```css
font-size: 12px;
font-weight: 700;
letter-spacing: 0.22em;
text-transform: uppercase;
```

---

## Linha Decorativa

```css
width: 18px;
height: 2px;
background: #FF6A00;
```

---

# 6. Headline Principal

## Estrutura

```txt
IA não
responde leads.

Direção responde.
```

---

## Typography

```css
font-size: clamp(56px, 6vw, 92px);
line-height: 0.92;
letter-spacing: -0.06em;
font-weight: 700;
```

---

## Highlight Gradient

```css
background:
linear-gradient(
90deg,
#FF6A00,
#FF3D6E
);

-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

# 7. Supporting Copy

## Estrutura

```txt
Agentes de IA, funis inteligentes e automações
que constroem pipeline, geram reuniões
e multiplicam resultados.
```

---

## Style

```css
max-width: 520px;

font-size: 24px;
line-height: 1.5;
color: #5E5E5E;
font-weight: 400;
```

---

# 8. CTA Section

## Estrutura

```txt
[ PRIMARY BUTTON ]   [ Secondary Link ]
```

---

# 9. Primary CTA

## Style

```css
height: 64px;
padding: 0 28px;

background: #111111;
color: white;

border-radius: 16px;
```

---

## Hover

```css
transform: translateY(-2px);

box-shadow:
0 10px 24px rgba(0,0,0,0.18);
```

---

# 10. Secondary CTA

## Estrutura

```txt
▶ Ver como funciona
```

---

## Style

```css
font-size: 18px;
color: #222222;
```

---

# 11. Bottom Metrics

## Estrutura

```txt
+2.8M     +380K     +97%
Conversas Reuniões Pipeline
```

---

## Layout

```css
display: flex;
gap: 48px;
```

---

## Número

```css
font-size: 42px;
font-weight: 700;
```

---

## Label

```css
font-size: 15px;
color: #777777;
```

---

# 12. Center Section — iPhone Mockup

## Objetivo

O mockup é:

- o núcleo visual
- ponto focal da hero
- centro do ecossistema

---

# 13. Posicionamento do iPhone

## Rules

```css
position: relative;
z-index: 20;
```

---

## Rotação

```css
transform:
rotate(8deg);
```

---

## Tamanho

```css
height: 880px;
```

---

## Shadow

```css
filter:
drop-shadow(
0 80px 60px rgba(0,0,0,0.18)
);
```

---

# 14. Floating Event Cards (Left do Mockup)

## Objetivo

Representam:

- eventos entrando
- canais ativos
- automação omnichannel

---

# 15. Posicionamento

## Layout

```txt
[ Lead ]
[ WhatsApp ]
[ Instagram ]
[ Email ]
```

---

## Rules

```css
position: absolute;
left: -180px;
```

---

## Distribuição Vertical

| Card | Offset Y |
| --- | --- |
| Lead | -180px |
| WhatsApp | -40px |
| Instagram | 120px |
| Email | 280px |

---

# 16. Motion

## Floating

```css
animation:
float 8s ease-in-out infinite;
```

---

## Rotation

```css
rotate:
-3deg até 2deg;
```

---

# 17. Connection Lines

## Style

```css
stroke:
rgba(255,106,0,0.22);

stroke-width:
1.5px;
```

---

# 18. Right Section — Dashboard Cards

## Objetivo

Mostrar:

- performance
- escala
- métricas reais
- inteligência operacional

---

# 19. Layout Dashboard Cards

## Estrutura

```txt
┌────────────┬────────────┐
│ Card 1     │ Card 2     │
├────────────┼────────────┤
│ Card 3     │ Card 4     │
├─────────────────────────┤
│ Large Agent Card        │
└─────────────────────────┘
```

---

# 20. Posicionamento

```css
position: absolute;
right: -120px;
top: 40px;
```

---

# 21. Hierarquia

## Top Cards

- Funil Inteligente
- Reuniões Agendadas

---

## Middle Cards

- Pipeline Gerado
- Taxa Conversão

---

## Bottom Large Card

- Agentes ativos
- status operacional
- visual técnico

---

# 22. Dashboard Motion

## Hover

```css
transform:
translateY(-6px);
```

---

## Floating Delay

Cada card:

- delay diferente
- velocidade diferente
- profundidade diferente

---

# 23. Background System

## Base

```css
background:
radial-gradient(
circle at center,
#FFFFFF,
#F6F3F1
);
```

---

# 24. Floating Particles

## Objetivo

Criar:

- profundidade
- computação
- sensação de IA

---

## Dots

```css
opacity:
0.08 até 0.7;
```

---

## Squares

```css
size:
4px até 14px;
```

---

## Colors

```css
#FF6A00
#FF3D6E
#111111
#D8D8D8
```

---

# 25. Profundidade Visual

## Layering

| Layer | Z-index |
| --- | --- |
| Background particles | 1 |
| Connection lines | 5 |
| Floating cards | 10 |
| Dashboard cards | 15 |
| iPhone | 20 |
| Left content | 30 |

---

# 26. Responsividade

## Tablet

- mockup reduz 18%
- cards aproximam
- métricas diminuem

---

## Mobile

```txt
TEXT
CTA
IPHONE
EVENT CARDS
METRICS
```

---

# 27. Sensação Final

A hero precisa parecer:

- um sistema vivo
- IA trabalhando em tempo real
- automação sofisticada
- produto enterprise premium
- Stripe + Linear + Apple + OpenAI aesthetic
- clean futurista
- tecnológico sem exagero cyberpunk
