"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Check, Send } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgentBotGlyph } from "./AgentIcons";
import { useSceneClock } from "./useSceneClock";

type FieldKey = "grau" | "rosto" | "armacao" | "valor" | "agenda" | "followup";

type CrmEffect = {
  tags?: string[];
  stage?: number;
  fields?: Partial<Record<FieldKey, string>>;
  log?: { text: string; done: boolean };
};

type ChatEvent = {
  scene: number;
  at: number;
  from: "lead" | "ai" | "system";
  kind: "text" | "rx" | "photo" | "analyzing" | "product" | "tryon" | "divider";
  text?: string;
  crm?: CrmEffect;
};

const stages = ["Novo", "Atendimento", "Orçamento", "Agendado"];

const fieldLabels: Array<{ key: FieldKey; label: string }> = [
  { key: "grau", label: "Receita" },
  { key: "rosto", label: "Formato do rosto" },
  { key: "armacao", label: "Armação sugerida" },
  { key: "valor", label: "Valor do orçamento" },
  { key: "agenda", label: "Agendamento" },
  { key: "followup", label: "Acompanhamento" },
];

const scenes = [
  { key: "atende", tab: "Atende" },
  { key: "recomenda", tab: "Recomenda" },
  { key: "fecha", tab: "Fecha" },
  { key: "acompanha", tab: "Acompanha" },
] as const;

const photos = {
  before: "/assets/visagism/selfie-sem-oculos.webp",
  after: "/assets/visagism/selfie-com-oculos.webp",
  frame: "/assets/visagism/armacao-rose-gold.webp",
} as const;

const events: ChatEvent[] = [
  // 1 · Atende
  {
    scene: 0,
    at: 700,
    from: "lead",
    kind: "text",
    text: "Oi! Vi o anúncio de vocês. Quero fazer óculos novos 😊",
    crm: { tags: ["Lead novo"], stage: 0, log: { text: "Lead criado · WhatsApp", done: true } },
  },
  {
    scene: 0,
    at: 2900,
    from: "ai",
    kind: "text",
    text: "Oi, Ana! Que bom ter você por aqui 😊 Você já tem a receita atualizada? Pode mandar a foto.",
    crm: { stage: 1, log: { text: "Atendimento iniciado pela Clara", done: true } },
  },
  {
    scene: 0,
    at: 5100,
    from: "lead",
    kind: "rx",
    text: "Minha receita 📄",
    crm: { log: { text: "Leitura de receita…", done: false } },
  },
  {
    scene: 0,
    at: 7300,
    from: "ai",
    kind: "text",
    text: "Recebi! Grau leve de miopia com astigmatismo. Vou separar opções para você.",
    crm: {
      tags: ["Receita enviada"],
      fields: { grau: "OD −1,50 · OE −1,25" },
      log: { text: "Leitura de receita concluída", done: true },
    },
  },
  // 2 · Recomenda
  {
    scene: 1,
    at: 1500,
    from: "ai",
    kind: "text",
    text: "Quer ver como fica? Me manda uma selfie de frente e eu indico a armação ideal pelo formato do seu rosto.",
  },
  {
    scene: 1,
    at: 4000,
    from: "lead",
    kind: "photo",
    text: "Aqui está! 😊",
    crm: { log: { text: "Visagismo · analisando rosto…", done: false } },
  },
  {
    scene: 1,
    at: 5600,
    from: "ai",
    kind: "analyzing",
    text: "Analisando o formato do rosto",
  },
  {
    scene: 1,
    at: 8200,
    from: "ai",
    kind: "product",
    text: "Seu rosto é oval, combina com este modelo gatinho em rose gold:",
    crm: {
      tags: ["Rosto oval"],
      fields: { rosto: "Oval", armacao: "Metal rose gold" },
      log: { text: "Visagismo concluído", done: true },
    },
  },
  {
    scene: 1,
    at: 10500,
    from: "ai",
    kind: "tryon",
    text: "Olha como fica em você 👇",
    crm: { tags: ["Interessada"] },
  },
  // 3 · Fecha
  { scene: 2, at: 800, from: "lead", kind: "text", text: "Amei! Quanto fica com as lentes?" },
  {
    scene: 2,
    at: 3000,
    from: "ai",
    kind: "text",
    text: "Armação + lentes antirreflexo: R$ 890 (ou 6x de R$ 148). Tenho horário amanhã às 15h na Loja Centro. Posso agendar?",
    crm: {
      tags: ["Orçamento enviado"],
      stage: 2,
      fields: { valor: "R$ 890" },
      log: { text: "Valor salvo · R$ 890", done: true },
    },
  },
  { scene: 2, at: 5800, from: "lead", kind: "text", text: "Pode agendar!" },
  {
    scene: 2,
    at: 7600,
    from: "ai",
    kind: "text",
    text: "Agendado ✓ Amanhã, 15h · Loja Centro. Eu te aviso antes!",
    crm: {
      tags: ["Visita marcada"],
      stage: 3,
      fields: { agenda: "Amanhã · 15:00 · Loja Centro", followup: "Hoje · 14:00 (1h antes)" },
      log: { text: "Agendamento criado · acompanhamento programado", done: true },
    },
  },
  // 4 · Acompanha
  { scene: 3, at: 600, from: "system", kind: "divider", text: "Hoje · 14:00 · 1h antes da visita" },
  {
    scene: 3,
    at: 2400,
    from: "ai",
    kind: "text",
    text: "Oi, Ana! Passando para lembrar da sua visita hoje às 15h na Loja Centro. Confirma presença?",
    crm: { fields: { followup: "Enviado · 14:00 ✓" }, log: { text: "Acompanhamento enviado automaticamente", done: true } },
  },
  {
    scene: 3,
    at: 5000,
    from: "lead",
    kind: "text",
    text: "Confirmo! Até já 😄",
    crm: { tags: ["Confirmada"], log: { text: "Presença confirmada", done: true } },
  },
  { scene: 3, at: 6800, from: "ai", kind: "text", text: "Perfeito, te esperamos! 😊" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// The AI "types" for this long before each of its messages lands.
const TYPING_MS = 1100;
const writes = (event: ChatEvent) => event.from === "ai" && (event.kind === "text" || event.kind === "product" || event.kind === "tryon");

// A scene lasts until its last message has fully played, plus time to read it.
const HOLD_MS = 2400;
const settleMs = (event: ChatEvent) => (event.kind === "product" || event.kind === "tryon" ? 1800 : 500);
const sceneDurations = scenes.map(
  (_, index) =>
    events.filter((event) => event.scene === index).reduce((end, event) => Math.max(end, event.at + settleMs(event)), 0) +
    HOLD_MS,
);
const sceneStart = scenes.map((_, index) => events.findIndex((event) => event.scene === index));

/** What the chat shows at `elapsed` ms into `scene`: earlier scenes are history, this one plays live. */
function viewAt(scene: number, elapsed: number) {
  const first = sceneStart[scene];
  let count = first;
  let typing = false;
  for (let i = first; i < events.length && events[i].scene === scene; i += 1) {
    const event = events[i];
    if (elapsed >= event.at) count = i + 1;
    else if (writes(event) && elapsed >= event.at - TYPING_MS) typing = true;
  }
  return { count, typing };
}

type CrmState = {
  tags: string[];
  stage: number;
  fields: Partial<Record<FieldKey, string>>;
  log: Array<{ text: string; done: boolean; time: string }>;
  lastField: FieldKey | null;
};

function foldCrm(visible: number): CrmState {
  const state: CrmState = { tags: [], stage: -1, fields: {}, log: [], lastField: null };
  for (const [index, event] of events.slice(0, visible).entries()) {
    const crm = event.crm;
    if (!crm) continue;
    if (crm.tags) state.tags = [...state.tags, ...crm.tags.filter((tag) => !state.tags.includes(tag))];
    if (crm.stage !== undefined) state.stage = crm.stage;
    if (crm.fields) {
      Object.assign(state.fields, crm.fields);
      state.lastField = Object.keys(crm.fields).slice(-1)[0] as FieldKey;
    }
    if (crm.log) {
      const entry = { ...crm.log, time: eventTime(index) };
      // A "done" entry replaces the pending one it completes.
      const last = state.log[state.log.length - 1];
      if (last && !last.done && crm.log.done) state.log = [...state.log.slice(0, -1), entry];
      else state.log = [...state.log, entry];
    }
  }
  return state;
}

function eventTime(index: number) {
  const event = events[index];
  if (event.scene === 3) return `14:0${Math.max(0, index - 14)}`;
  return `10:${String(2 + index).padStart(2, "0")}`;
}

function Dots() {
  return (
    <span className="cj-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Bubble({
  event,
  index,
  reduce,
  scanning,
}: {
  event: ChatEvent;
  index: number;
  reduce: boolean;
  scanning: boolean;
}) {
  const mine = event.from === "lead";
  const common = {
    layout: "position" as const,
    initial: reduce ? false : { opacity: 0, y: 12, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: EASE, layout: { duration: 0.45, ease: EASE } },
  };

  if (event.kind === "divider") {
    return (
      <motion.div className="cj-divider" {...common}>
        <span>{event.text}</span>
      </motion.div>
    );
  }

  const time = (
    <small className="cj-time">
      {eventTime(index)}
      {mine ? " ✓✓" : ""}
    </small>
  );
  const caption = (
    <p className="cj-caption">
      {event.text}
      {time}
    </p>
  );
  const media = event.kind === "rx" || event.kind === "photo" || event.kind === "product" || event.kind === "tryon";
  let body: ReactNode;

  if (event.kind === "rx") {
    body = (
      <>
        <div className="cj-media cj-rx" aria-label="Foto da receita">
          <b>RECEITA</b>
          <span>
            <i>OD</i> −1,50 &nbsp; −0,50 &nbsp; 180°
          </span>
          <span>
            <i>OE</i> −1,25 &nbsp; −0,25 &nbsp; 170°
          </span>
          <span>
            <i>DP</i> 62 mm
          </span>
        </div>
        {caption}
      </>
    );
  } else if (event.kind === "photo") {
    body = (
      <>
        <div className="cj-media cj-photo" data-scanning={scanning}>
          <Image src={photos.before} alt="Selfie da cliente" fill sizes="190px" unoptimized />
          <span className="cj-scan" aria-hidden="true" />
        </div>
        {caption}
      </>
    );
  } else if (event.kind === "analyzing") {
    body = (
      <span className="cj-analyzing">
        {event.text}
        <Dots />
      </span>
    );
  } else if (event.kind === "product") {
    body = (
      <>
        <div className="cj-media cj-product">
          <Image src={photos.frame} alt="Armação gatinho rose gold" width={1000} height={367} sizes="220px" unoptimized />
        </div>
        {caption}
      </>
    );
  } else if (event.kind === "tryon") {
    // The same photo, now with the frame: it wipes in once so the "after" is seen, not just shown.
    body = (
      <>
        <div className="cj-media cj-tryon">
          <Image className="cj-tryon-before" src={photos.before} alt="" fill sizes="190px" unoptimized />
          <Image className="cj-tryon-after" src={photos.after} alt="Cliente com a armação" fill sizes="190px" unoptimized />
          <span className="cj-wipe" aria-hidden="true" />
        </div>
        {caption}
      </>
    );
  } else {
    body = caption;
  }

  return (
    <motion.div className="cj-row" data-mine={mine} {...common}>
      <div className="cj-bubble" data-mine={mine} data-kind={event.kind} data-media={media}>
        {body}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      className="cj-row"
      data-mine="false"
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <div className="cj-bubble cj-typing" data-mine="false" aria-label="Clara está digitando">
        <Dots />
      </div>
    </motion.div>
  );
}

export function ChatJourney() {
  const reduce = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ count: 0, typing: false, pulse: 0 });

  // The conversation is driven by the scene clock, so it only plays while the slide is on screen and settled.
  const handleTick = useCallback((scene: number, elapsed: number) => {
    const next = viewAt(scene, elapsed);
    setView((prev) => {
      if (prev.count === next.count && prev.typing === next.typing) return prev;
      const landed = next.count > prev.count && Boolean(events[next.count - 1]?.crm);
      return { ...next, pulse: landed ? prev.pulse + 1 : prev.pulse };
    });
  }, []);

  const { scene, fills, go } = useSceneClock(stageRef, sceneDurations, !reduce, handleTick);

  // Without autoplay (reduced motion) the whole conversation is simply there.
  const count = reduce ? events.length : view.count;
  const crm = useMemo(() => foldCrm(count), [count]);
  const lastEvent = events[count - 1];
  const analyzing = lastEvent?.kind === "analyzing";
  const typing = view.typing && !analyzing && !reduce;
  // The "analyzing" bubble gives way to the answer that follows it.
  const shown = events.slice(0, count).map((event, index) => ({ event, index })).filter(({ event, index }) => event.kind !== "analyzing" || index === count - 1);

  // Warm the cache so photos appear with the bubble, not after it.
  useEffect(() => {
    Object.values(photos).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="cj" data-scene={scene}>
      <div className="cj-stage" ref={stageRef}>
        <div className="cj-tabs" role="tablist" aria-label="Etapas da conversa">
          {scenes.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={scene === index}
              className="cj-tab"
              data-active={scene === index}
              key={item.key}
              onClick={() => index !== scene && go(index)}
            >
              <span className="cj-tab-label">
                <i>{index + 1}</i>
                {item.tab}
              </span>
              <span className="cj-tab-track" aria-hidden="true">
                <span
                  ref={(el) => {
                    fills.current[index] = el;
                  }}
                  style={{ transform: `scaleX(${index < scene || (reduce && index === scene) ? 1 : 0})` }}
                />
              </span>
            </button>
          ))}
        </div>

        {/* Chat */}
        <section className="cj-chat" aria-label="Conversa no WhatsApp">
          <header className="cj-chat-head">
            <span className="cj-avatar" aria-hidden="true">
              <AgentBotGlyph />
            </span>
            <span className="cj-chat-who">
              <strong>Clara</strong>
              <span className="cj-chat-status">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.small
                    key={typing || analyzing ? "typing" : "online"}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.18 }}
                  >
                    {typing || analyzing ? (
                      <>
                        {analyzing ? "analisando" : "digitando"}
                        <Dots />
                      </>
                    ) : (
                      <>
                        <span className="cj-online" aria-hidden="true" />
                        Agente comercial · online
                      </>
                    )}
                  </motion.small>
                </AnimatePresence>
              </span>
            </span>
          </header>
          <div className="cj-messages" aria-live="polite">
            <LayoutGroup>
              <div className="cj-flow">
                {shown.map(({ event, index }) => (
                  <Bubble
                    event={event}
                    index={index}
                    reduce={reduce}
                    scanning={analyzing && event.kind === "photo" && index === count - 2}
                    key={`${index}-${event.kind}`}
                  />
                ))}
                <AnimatePresence>{typing ? <TypingBubble key="typing" /> : null}</AnimatePresence>
              </div>
            </LayoutGroup>
          </div>
          <div className="cj-composer" aria-hidden="true">
            <span>Mensagem</span>
            <Send strokeWidth={2} />
          </div>
        </section>

        {/* Hub: the chat feeds the CRM through the AI; a pulse runs along the axis whenever something is saved */}
        <svg className="cj-svg" viewBox="0 0 760 660" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <line className="cj-wire" x1="338" y1="349" x2="422" y2="349" />
          <line className="cj-wire-pulse" key={view.pulse} x1="338" y1="349" x2="422" y2="349" data-run={view.pulse > 0} />
          <circle className="cj-port" cx="338" cy="349" r="2.4" />
          <circle className="cj-port" cx="422" cy="349" r="2.4" />
        </svg>
        <div className="cj-hub" data-required-element="chat-hub">
          <span className="cj-hub-core">
            <span className="cj-hub-ring" aria-hidden="true" />
            <Image
              src="/assets/brand/its-time-mark-transparent-clean.png"
              alt="Its Time CRM"
              width={48}
              height={50}
              sizes="40px"
            />
          </span>
        </div>

        {/* CRM */}
        <section className="cj-crm" aria-label="CRM ao vivo" data-required-element="chat-crm">
          <header className="cj-crm-head">
            <span>
              <b>CRM ao vivo</b>
              <small>Ana · WhatsApp</small>
            </span>
            <span className="cj-live">
              <i aria-hidden="true" />
              Sincronizado
            </span>
          </header>

          <ol className="cj-stages" aria-label="Etapa do pipeline">
            {stages.map((stage, index) => (
              <li data-state={index < crm.stage ? "done" : index === crm.stage ? "active" : "idle"} key={stage}>
                <span className="cj-stage-bar" aria-hidden="true">
                  <i />
                </span>
                <span>{stage}</span>
              </li>
            ))}
          </ol>

          <div className="cj-tags" aria-label="Tags">
            <AnimatePresence initial={false}>
              {crm.tags.map((tag) => (
                <motion.span
                  className="cj-tag"
                  key={tag}
                  layout
                  initial={reduce ? false : { opacity: 0, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <i aria-hidden="true" />
                  {tag}
                </motion.span>
              ))}
            </AnimatePresence>
            {crm.tags.length === 0 ? <span className="cj-empty">Sem tags ainda</span> : null}
          </div>

          <dl className="cj-fields">
            {fieldLabels.map(({ key, label }) => {
              const value = crm.fields[key];
              const fresh = crm.lastField === key;
              return (
                <div className="cj-field" data-filled={Boolean(value)} data-fresh={Boolean(value && fresh)} key={key}>
                  <dt>{label}</dt>
                  <dd>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={value ?? "empty"}
                        className={value ? "cj-value" : "cj-skeleton"}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {value ?? ""}
                      </motion.span>
                    </AnimatePresence>
                    {value && fresh ? (
                      <motion.em
                        key={`${key}-${value}`}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, times: [0, 0.1, 0.8, 1] }}
                      >
                        <Check aria-hidden="true" strokeWidth={2.8} />
                        Salvo
                      </motion.em>
                    ) : null}
                  </dd>
                </div>
              );
            })}
          </dl>

          <ul className="cj-log" aria-label="Atividade da IA">
            <AnimatePresence initial={false} mode="popLayout">
              {crm.log.slice(-5).map((entry) => (
                <motion.li
                  key={entry.text}
                  layout
                  data-done={entry.done}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <i aria-hidden="true" />
                  <span>{entry.text}</span>
                  <time>{entry.time}</time>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      </div>
    </div>
  );
}
