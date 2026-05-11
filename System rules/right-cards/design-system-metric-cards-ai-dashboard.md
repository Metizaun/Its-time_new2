# Design System — Metric Cards / AI Dashboard

## 1. Objetivo
Sistema visual focado em:
- dashboards premium
- automação e IA
- métricas comerciais
- aparência clean/high-end
- leitura rápida
- sensação de profundidade suave

---

# 2. Grid Base

| Item | Valor |
|---|---|
| Grid Base | 8px |
| Radius padrão | 24px |
| Gap entre cards | 24px |
| Padding interno | 32px |
| Altura mínima cards pequenos | 280px |
| Shadow blur | 40px |
| Border | 1px solid rgba(0,0,0,0.04) |

---

# 3. Estrutura do Card

```txt
┌──────────────────────┐
│ Título               │
│ Subtítulo            │
│                      │
│ Métrica principal    │
│ Badge crescimento    │
│                      │
│ Contexto             │
│                      │
│ Gráfico / Pattern    │
└──────────────────────┘
```

---

# 4. Tokens de Cor

## Base

```css
--bg-primary: #F7F4F2;
--card-bg: rgba(255,255,255,0.72);

--text-primary: #111111;
--text-secondary: #6F6F6F;

--border-soft: rgba(0,0,0,0.05);
```

## Accent Gradient

```css
--accent-1: #FF6A00;
--accent-2: #FF3D6E;
--accent-3: #1B1B1B;
```

## Positive Badge

```css
--success-bg: rgba(255,106,0,0.12);
--success-text: #FF5A1F;
```

---

# 5. Tipografia

## Font Family

```css
font-family: Inter, sans-serif;
```

## Hierarquia

### Card Title

```css
font-size: 32px;
font-weight: 600;
letter-spacing: -0.03em;
line-height: 1.1;
```

### Subtitle

```css
font-size: 20px;
font-weight: 400;
color: #6F6F6F;
```

### Big Metric

```css
font-size: 64px;
font-weight: 700;
letter-spacing: -0.06em;
line-height: 1;
```

### Context Text

```css
font-size: 18px;
font-weight: 400;
color: #7B7B7B;
```

### Badge Text

```css
font-size: 18px;
font-weight: 600;
```

---

# 6. Estilo Visual do Card

## Container

```css
background: rgba(255,255,255,0.72);
backdrop-filter: blur(20px);

border: 1px solid rgba(255,255,255,0.6);

border-radius: 24px;

box-shadow:
0 10px 30px rgba(0,0,0,0.04),
0 2px 8px rgba(0,0,0,0.02);
```

---

# 7. Badge System

## Estrutura

```css
display: inline-flex;
align-items: center;
justify-content: center;

padding: 10px 18px;

border-radius: 999px;

background: rgba(255,106,0,0.12);

color: #FF5A1F;
```

---

# 8. Motion System

## Hover

```css
transform: translateY(-4px);
transition: 300ms cubic-bezier(.2,.8,.2,1);
```

## Glow Hover

```css
box-shadow:
0 16px 40px rgba(255,106,0,0.12);
```

---

# 9. Sensação Visual Desejada

O sistema deve transmitir:
- sofisticação
- IA premium
- automação inteligente
- clareza operacional
- profundidade clean
- luxo minimalista
