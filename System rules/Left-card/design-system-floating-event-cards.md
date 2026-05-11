# Design System — Floating Event Cards (Mockup Left Side)

## 1. Objetivo

Sistema visual para:
- eventos em tempo real
- automações SDR
- interações omnichannel
- fluxo inteligente de leads
- sensação de IA ativa trabalhando

Esses cards devem ficar:
- flutuando à esquerda do mockup principal
- conectados visualmente ao sistema central
- transmitindo movimento e atividade contínua

---

# 2. Posicionamento no Hero

## Layout Rule

```txt
[ Floating Cards ]     [ Mockup Principal ]
        LEFT                  RIGHT
```

## Comportamento

Os cards:
- orbitam suavemente
- aparecem em profundidades diferentes
- possuem leve rotação orgânica
- simulam eventos vivos acontecendo

---

# 3. Estrutura do Card

```txt
┌──────────────────────────┐
│ Ícone      Título        │
│             Subtítulo    │
└──────────────────────────┘
```

---

# 4. Dimensões

## Card padrão

```txt
420x160
```

## Padding

```css
padding: 28px;
```

## Radius

```css
border-radius: 28px;
```

---

# 5. Glassmorphism Style

## Base

```css
background: rgba(255,255,255,0.74);

backdrop-filter: blur(24px);

border:
1px solid rgba(255,255,255,0.82);
```

## Shadow

```css
box-shadow:
0 12px 40px rgba(0,0,0,0.05),
0 4px 12px rgba(0,0,0,0.03);
```

---

# 6. Tipografia

## Título

```css
font-size: 22px;
font-weight: 700;
letter-spacing: -0.04em;

color: #111111;
```

## Subtítulo

```css
font-size: 18px;
font-weight: 400;

color: #4E4E4E;
```

---

# 7. Sistema de Ícones

## Container

```css
width: 56px;
height: 56px;

border-radius: 18px;

display: flex;
align-items: center;
justify-content: center;
```

---

# 8. Motion System

## Floating

```css
animation:
float 8s ease-in-out infinite;
```

## Hover

```css
transform:
translateY(-6px)
scale(1.02);

transition:
350ms cubic-bezier(.2,.8,.2,1);
```

---

# 9. Connection Lines

## Style

```css
stroke:
rgba(255,106,0,0.22);

stroke-width:
1.5px;
```

---

# 10. Sensação Visual

O sistema deve transmitir:
- IA operacional viva
- automações em execução
- fluxo constante de leads
- inteligência comercial
- sofisticação premium
- movimento elegante
- dashboard futurista clean
