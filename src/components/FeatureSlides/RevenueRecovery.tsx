"use client";

import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, Clock, Send, Zap } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { slidePhase } from "./slidePhase";
import { useSceneClock } from "./useSceneClock";

type ReasonId = "caro" | "pensar" | "horario" | "sumiu";

type Lead = {
  id: string;
  name: string;
  value: number;
  days: number; // days without an answer
  reason: ReasonId;
  recovered: boolean;
};

// Reason tones stay inside the brand family (orange, pink, peach) plus one neutral.
const reasons: Record<ReasonId, { label: string; short: string; count: number; rgb: string; message: string }> = {
  caro: {
    label: "Achou caro",
    short: "Preço",
    count: 5,
    rgb: "255, 90, 31",
    message: "Consegui uma condição em até 10x para o seu procedimento. Posso te explicar?",
  },
  pensar: {
    label: "Vai pensar",
    short: "Dúvida",
    count: 4,
    rgb: "255, 77, 109",
    message: "Separei as dúvidas mais comuns sobre o tratamento. Quer que eu te envie?",
  },
  horario: {
    label: "Sem horário disponível",
    short: "Agenda",
    count: 3,
    rgb: "255, 160, 120",
    message: "Abriram horários novos esta semana. Quer garantir o seu?",
  },
  sumiu: {
    label: "Sumiu após o orçamento",
    short: "Sem retorno",
    count: 2,
    rgb: "176, 168, 160",
    message: "Atualizei a sua proposta com uma condição especial de retorno. Vamos conversar?",
  },
};

const stuckLeads: Lead[] = [
  { id: "marina", name: "Marina L.", value: 3800, days: 3, reason: "caro", recovered: true },
  { id: "paulo", name: "Paulo H.", value: 2200, days: 5, reason: "pensar", recovered: false },
  { id: "aline", name: "Aline C.", value: 4500, days: 4, reason: "horario", recovered: true },
  { id: "rafael", name: "Rafael M.", value: 2900, days: 7, reason: "sumiu", recovered: true },
];

const recoveredTotal = stuckLeads.filter((lead) => lead.recovered).reduce((sum, lead) => sum + lead.value, 0);

// Healthy stages: the AI is visibly working on these, so each card cycles through what is happening.
type Note = { text: string; kind?: "typing" | "done" };
type LiveLead = { id: string; name: string; offset: number; notes: Note[] };

const livePipeline: Record<"novo" | "atendimento", LiveLead[]> = {
  novo: [
    { id: "n1", name: "Camila R.", offset: 0, notes: [{ text: "Primeiro contato" }, { text: "IA respondendo", kind: "typing" }, { text: "Respondida", kind: "done" }] },
    { id: "n2", name: "Bruno T.", offset: 1, notes: [{ text: "Dúvida sobre valores" }, { text: "IA respondendo", kind: "typing" }, { text: "Valores enviados", kind: "done" }] },
    { id: "n3", name: "Marcela D.", offset: 2, notes: [{ text: "Pediu horários" }, { text: "IA respondendo", kind: "typing" }, { text: "Horários enviados", kind: "done" }] },
    { id: "n4", name: "Renato S.", offset: 3, notes: [{ text: "Veio do Instagram" }, { text: "IA respondendo", kind: "typing" }, { text: "Respondido", kind: "done" }] },
  ],
  atendimento: [
    { id: "a1", name: "Larissa P.", offset: 1, notes: [{ text: "Agendando avaliação" }, { text: "Horário reservado", kind: "done" }] },
    { id: "a2", name: "Diego S.", offset: 0, notes: [{ text: "Retorno marcado" }, { text: "Lembrete enviado", kind: "done" }] },
    { id: "a3", name: "Otávio L.", offset: 2, notes: [{ text: "Enviou a receita" }, { text: "IA lendo a receita", kind: "typing" }, { text: "Receita lida", kind: "done" }] },
    { id: "a4", name: "Bianca F.", offset: 3, notes: [{ text: "Tirando dúvidas" }, { text: "IA respondendo", kind: "typing" }, { text: "Agendada", kind: "done" }] },
  ],
};

const closedBefore: Array<{ id: string; name: string; note: string }> = [
  { id: "f1", name: "Helena B.", note: "Fechou · R$ 3.100" },
  { id: "f2", name: "Tiago N.", note: "Fechou · R$ 2.600" },
  { id: "f3", name: "Bianca R.", note: "Fechou · R$ 1.900" },
];

const scenes = [
  { key: "stall", tab: "Onde trava", animMs: 1300 },
  { key: "why", tab: "Por que parou", animMs: 1900 },
  { key: "reach", tab: "Reativação", animMs: 1700 },
  { key: "revenue", tab: "Receita", animMs: 2700 },
] as const;

// Each scene lasts until its animation has finished, plus time to read what is on screen.
const HOLD_MS = 2800;

const sceneDurations = scenes.map((item) => item.animMs + HOLD_MS);

const EASE = [0.22, 1, 0.36, 1] as const;

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Counts up from 0 once when it mounts (the panel is re-keyed per scene). */
function Ticker({
  to,
  format,
  run,
  delay = 0.25,
  duration = 1.1,
}: {
  to: number;
  format: (value: number) => string;
  run: boolean;
  delay?: number;
  duration?: number;
}) {
  const [shown, setShown] = useState(run ? 0 : to);

  useEffect(() => {
    if (!run) return;
    const controls = animate(0, to, { duration, ease: EASE, delay, onUpdate: setShown });
    return () => controls.stop();
  }, [to, run, delay, duration]);

  return <>{format(run ? shown : to)}</>;
}

/** Ticks only while the slide has settled, is on screen and the tab is visible (the mouse never pauses it). */
function useLiveTick(stageRef: RefObject<HTMLDivElement | null>, period: number, enabled: boolean) {
  const [tick, setTick] = useState(0);
  const inView = useInView(stageRef, { amount: 0.3 });
  const inViewRef = useRef(inView);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      if (slidePhase(stageRef.current) !== "active" || !inViewRef.current || document.hidden) return;
      setTick((value) => value + 1);
    }, period);
    return () => window.clearInterval(id);
  }, [stageRef, period, enabled]);

  return tick;
}

function Typing() {
  return (
    <span className="rr-typing" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="rr-avatar" data-tone={name.charCodeAt(0) % 4} aria-hidden="true">
      {name[0]}
    </span>
  );
}

function Status({ lead, scene }: { lead: Lead; scene: number }) {
  const reason = reasons[lead.reason];

  if (scene === 3 && lead.recovered) {
    return (
      <span className="rr-status" data-kind="won">
        <Check aria-hidden="true" strokeWidth={2.6} />
        Fechou
      </span>
    );
  }
  if (scene === 3) {
    return (
      <span className="rr-status" data-kind="open">
        Em conversa
        <Typing />
      </span>
    );
  }
  if (scene === 2) {
    return (
      <span className="rr-status" data-kind="sent">
        <Send aria-hidden="true" strokeWidth={2.2} />
        Mensagem enviada
      </span>
    );
  }
  if (scene === 1) {
    return (
      <span className="rr-status" data-kind="reason" style={{ "--rr-rgb": reason.rgb } as CSSProperties}>
        <i aria-hidden="true" />
        {reason.short}
      </span>
    );
  }
  return (
    <span className="rr-status" data-kind="stuck">
      <Clock aria-hidden="true" strokeWidth={2.2} />
      {lead.days} dias sem resposta
    </span>
  );
}

function LeadCard({
  lead,
  scene,
  cycle,
  enterDelay,
  show,
}: {
  lead: Lead;
  scene: number;
  cycle: number;
  enterDelay: number;
  show: boolean;
}) {
  const closed = scene === 3 && lead.recovered;
  // Only the cards born in the first scene fade in; the ones that travel to "Fechado" keep their own motion.
  const enter = scene === 0;

  return (
    <motion.div
      className="rr-card rr-card--lead"
      layout
      layoutId={`lead-${cycle}-${lead.id}`}
      initial={enter ? { opacity: 0, y: 10 } : false}
      animate={show || !enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: EASE, delay: enter ? enterDelay : 0 }}
      data-closed={closed}
    >
      <Avatar name={lead.name} />
      <span className="rr-card-main">
        <span className="rr-card-row">
          <strong>{lead.name}</strong>
          <small>{brl(lead.value)}</small>
        </span>
        <span className="rr-card-status">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${scene}-${closed}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Status lead={lead} scene={scene} />
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      {/* how long it has been waiting: fills once, only while the lead is still stuck */}
      <span className="rr-age" aria-hidden="true">
        <i style={{ "--age": lead.days / 7, "--d": `${enterDelay + 0.45}s` } as CSSProperties} />
      </span>
    </motion.div>
  );
}

function LiveCard({
  lead,
  tick,
  reduce,
  enterDelay,
  show,
}: {
  lead: LiveLead;
  tick: number;
  reduce: boolean;
  enterDelay: number;
  show: boolean;
}) {
  const note = lead.notes[reduce ? 0 : Math.floor((tick + lead.offset) / 2) % lead.notes.length];

  return (
    <motion.div
      className="rr-card"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: EASE, delay: enterDelay }}
    >
      <Avatar name={lead.name} />
      <span className="rr-card-main">
        <span className="rr-card-row">
          <strong>{lead.name}</strong>
        </span>
        <span className="rr-card-status">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              className="rr-note"
              data-kind={note.kind}
              key={note.text}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {note.kind === "done" ? <Check aria-hidden="true" strokeWidth={2.6} /> : null}
              {note.text}
              {note.kind === "typing" ? <Typing /> : null}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </motion.div>
  );
}

function ClosedCard({
  name,
  note,
  enterDelay,
  reduce,
  show,
}: {
  name: string;
  note: string;
  enterDelay: number;
  reduce: boolean;
  show: boolean;
}) {
  return (
    <motion.div
      className="rr-card"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: EASE, delay: enterDelay }}
    >
      <Avatar name={name} />
      <span className="rr-card-main">
        <span className="rr-card-row">
          <strong>{name}</strong>
        </span>
        <span className="rr-card-status">
          <span className="rr-note">{note}</span>
        </span>
      </span>
    </motion.div>
  );
}

function Column({
  title,
  count,
  tone,
  peek,
  children,
}: {
  title: string;
  count: string;
  tone?: "stuck" | "won";
  peek?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rr-column" data-tone={tone}>
      <div className="rr-column-head">
        <span>{title}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b
            key={count}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
          >
            {count}
          </motion.b>
        </AnimatePresence>
      </div>
      {/* "peek": the list is longer than the column, so the last card fades out instead of being cut */}
      <div className="rr-column-body" data-peek={peek ?? false}>
        {children}
      </div>
    </div>
  );
}

function Panel({ scene, reduce }: { scene: number; reduce: boolean }) {
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.08 * i, ease: EASE },
  });

  if (scene === 0) {
    const kpis = [
      { label: "Leads no mês", to: 48, bar: 1, format: (v: number) => String(Math.round(v)) },
      { label: "Chegaram ao orçamento", to: 14, bar: 14 / 48, format: (v: number) => String(Math.round(v)) },
      { label: "Fecharam", to: 9, bar: 9 / 48, format: (v: number) => String(Math.round(v)) },
      {
        label: "Parado em orçamento",
        to: 37.8,
        bar: 1,
        format: (v: number) => `R$ ${v.toFixed(1).replace(".", ",")} mil`,
        hot: true,
      },
    ];
    return (
      <div className="rr-kpis-wrap">
        <div className="rr-kpis">
          {kpis.map((kpi, i) => (
            <motion.div className="rr-kpi" data-hot={kpi.hot ?? false} key={kpi.label} {...item(i)}>
              <small>{kpi.label}</small>
              <strong>
                <Ticker to={kpi.to} format={kpi.format} run={!reduce} delay={0.2 + i * 0.08} />
              </strong>
              {/* the funnel narrowing, drawn to scale: 48 leads -> 14 quotes -> 9 closed */}
              <span className="rr-kpi-bar" aria-hidden="true">
                <motion.i
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: kpi.bar }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: EASE }}
                />
              </span>
            </motion.div>
          ))}
        </div>
        <motion.p className="rr-note-line" {...item(4)}>
          <span className="rr-live" aria-hidden="true" />
          Orçamentos sem resposta há mais de 3 dias
        </motion.p>
      </div>
    );
  }

  if (scene === 1) {
    const max = 5;
    return (
      <div className="rr-reasons">
        <motion.p className="rr-panel-title" {...item(0)}>
          A IA lê as conversas e agrupa o motivo
        </motion.p>
        {(Object.keys(reasons) as ReasonId[]).map((key, i) => (
          <motion.div
            className="rr-reason"
            key={key}
            style={{ "--rr-rgb": reasons[key].rgb } as CSSProperties}
            {...item(i + 1)}
          >
            <span className="rr-reason-label">
              <i aria-hidden="true" />
              {reasons[key].label}
            </span>
            <span className="rr-reason-bar">
              <motion.i
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: reasons[key].count / max }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.1, ease: EASE }}
              />
            </span>
            <b>{reasons[key].count}</b>
          </motion.div>
        ))}
      </div>
    );
  }

  if (scene === 2) {
    return (
      <div className="rr-journey">
        <motion.div className="rr-rule" {...item(0)}>
          <span className="rr-rule-tag">
            <Zap aria-hidden="true" strokeWidth={2.4} />
            Jornada · Reativação de orçamento
          </span>
          <span className="rr-cond">Etapa: Orçamento</span>
          <span className="rr-cond">há pelo menos 3 dias</span>
          <span className="rr-cond">lead não respondeu</span>
        </motion.div>
        <div className="rr-msgs">
          {(["caro", "horario", "sumiu"] as ReasonId[]).map((key, i) => {
            const start = 0.45 + i * 0.22; // dots first, then the message writes itself
            return (
              <motion.div
                className="rr-msg"
                key={key}
                style={{ "--rr-rgb": reasons[key].rgb } as CSSProperties}
                {...item(i + 1)}
              >
                <span className="rr-msg-head">
                  <i aria-hidden="true" />
                  {reasons[key].label}
                </span>
                <p className="rr-msg-text">
                  {reduce ? null : (
                    <motion.span
                      className="rr-msg-dots"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: start }}
                      aria-hidden="true"
                    >
                      <Typing />
                    </motion.span>
                  )}
                  {reasons[key].message.split(" ").map((word, w) => (
                    <motion.span
                      key={w}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.18, delay: start + w * 0.035 }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            );
          })}
        </div>
        <motion.p className="rr-note-line" {...item(4)}>
          Mensagem gerada pela IA · uma abordagem por motivo
        </motion.p>
      </div>
    );
  }

  return (
    <div className="rr-revenue">
      <motion.div className="rr-money" {...item(0)}>
        <small>Recuperado em 7 dias</small>
        <strong>
          <Ticker to={recoveredTotal} format={(v) => brl(Math.round(v))} run={!reduce} delay={0.5} duration={1.5} />
        </strong>
        <span className="rr-money-bar" aria-hidden="true">
          <i />
        </span>
      </motion.div>
      <div className="rr-stats">
        {[
          { label: "Mensagens enviadas", value: "14" },
          { label: "Respostas", value: "9" },
          { label: "Voltaram a avançar", value: "3" },
        ].map((stat, i) => (
          <motion.div className="rr-stat" key={stat.label} {...item(i + 1)}>
            <strong>{stat.value}</strong>
            <small>{stat.label}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Everything hangs from one vertical axis: the "Orçamento" column -> the AI -> the panel.
// Coordinates match the 760x660 stage (pipeline: 10% -> 49.5% of the height, panel from 68%).
const AXIS = 477; // centre of the stuck column
const FINISH = 671; // centre of the "Fechado" column
const COL_BOTTOM = 327;
const PANEL_TOP = 449;
const HUB_Y = 388;
const HUB_EDGE = 31; // outer dashed ring of the hub
const paths = {
  toStuck: `M${AXIS} ${HUB_Y - HUB_EDGE} V${COL_BOTTOM + 3}`,
  fromStuck: `M${AXIS} ${COL_BOTTOM + 3} V${HUB_Y - HUB_EDGE}`,
  stuckToWon: `M${AXIS} ${COL_BOTTOM + 3} V335 Q${AXIS} 343 ${AXIS + 8} 343 H${FINISH - 8} Q${FINISH} 343 ${FINISH} 335 V${COL_BOTTOM + 3}`,
  toPanel: `M${AXIS} ${HUB_Y + HUB_EDGE} V${PANEL_TOP - 3}`,
};

function Wire({ d, active, rgb, reverse }: { d: string; active: boolean; rgb: string; reverse?: boolean }) {
  return (
    <g style={{ "--rr-rgb": rgb } as CSSProperties}>
      <path className="rr-wire" d={d} />
      <path className="rr-wire-flow" d={d} data-active={active} data-reverse={reverse ?? false} />
    </g>
  );
}

export function RevenueRecovery() {
  const reduce = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);
  const { scene, fills, go, active } = useSceneClock(stageRef, sceneDurations, !reduce);
  const tick = useLiveTick(stageRef, 1700, !reduce && active);
  const won = scene === 3;
  const stuck = won ? stuckLeads.filter((lead) => !lead.recovered) : stuckLeads;
  const closedLeads = won ? stuckLeads.filter((lead) => lead.recovered) : [];
  const orcamentoCount = won ? "11" : "14";

  // A new loop starts whenever the story returns to scene 0: the board is rebuilt so it plays its entrance again.
  const [cycle, setCycle] = useState(0);
  const [lastScene, setLastScene] = useState(scene);
  if (scene !== lastScene) {
    setLastScene(scene);
    if (scene === 0) setCycle((value) => value + 1);
  }

  const stagger = (column: number, index: number) => (reduce ? 0 : 0.3 + column * 0.1 + index * 0.07);

  return (
    <div className="rr" data-scene={scene} data-reduced={reduce}>
      <div className="rr-stage" ref={stageRef}>
        <div className="rr-tabs" role="tablist" aria-label="Etapas da estratégia">
          {scenes.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={scene === index}
              className="rr-tab"
              data-active={scene === index}
              key={item.key}
              onClick={() => index !== scene && go(index)}
            >
              <span className="rr-tab-label">
                <i>{index + 1}</i>
                {item.tab}
              </span>
              <span className="rr-tab-track" aria-hidden="true">
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

        <svg className="rr-svg" viewBox="0 0 760 660" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <Wire d={paths.toPanel} active rgb="255, 120, 80" />
          <Wire d={paths.toStuck} active={scene === 0 || scene === 2} rgb={scene === 2 ? "255, 120, 80" : "255, 77, 109"} />
          <Wire d={paths.fromStuck} active={scene === 1} rgb="255, 122, 162" reverse />
          <Wire d={paths.stuckToWon} active={scene === 3} rgb="255, 120, 80" />
          {/* arrow where the recovered money lands */}
          <path className="rr-arrow" data-visible={scene === 3} d={`M${FINISH - 3.5} ${COL_BOTTOM + 8} L${FINISH} ${COL_BOTTOM + 3} L${FINISH + 3.5} ${COL_BOTTOM + 8}`} />
          {[AXIS, FINISH].map((x) => (
            <circle className={x === FINISH ? "rr-port rr-port--finish" : "rr-port"} cx={x} cy={COL_BOTTOM + 3} r="2.4" key={x} />
          ))}
          <circle className="rr-port" cx={AXIS} cy={PANEL_TOP - 3} r="2.4" />
        </svg>

        <LayoutGroup>
          <div className="rr-pipeline" data-required-element="recovery-pipeline" key={cycle}>
            <Column title="Novo" count="48" peek>
              {livePipeline.novo.map((lead, i) => (
                <LiveCard key={lead.id} lead={lead} tick={tick} reduce={reduce} enterDelay={stagger(0, i)} show={active} />
              ))}
            </Column>
            <Column title="Atendimento" count="27" peek>
              {livePipeline.atendimento.map((lead, i) => (
                <LiveCard key={lead.id} lead={lead} tick={tick} reduce={reduce} enterDelay={stagger(1, i)} show={active} />
              ))}
            </Column>
            <Column title="Orçamento" count={orcamentoCount} tone={won ? undefined : "stuck"}>
              {stuck.map((lead, i) => (
                <LeadCard key={lead.id} lead={lead} scene={scene} cycle={cycle} enterDelay={stagger(2, i)} show={active} />
              ))}
            </Column>
            <Column title="Fechado" count={won ? "12" : "9"} tone="won" peek={!won}>
              {closedLeads.map((lead, i) => (
                <LeadCard key={lead.id} lead={lead} scene={scene} cycle={cycle} enterDelay={stagger(3, i)} show={active} />
              ))}
              {closedBefore.slice(0, won ? 1 : 3).map((lead, i) => (
                <ClosedCard key={lead.id} name={lead.name} note={lead.note} enterDelay={stagger(3, i)} reduce={reduce} show={active} />
              ))}
            </Column>
          </div>
        </LayoutGroup>

        <div
          className="rr-hub"
          data-required-element="recovery-hub"
          style={{ left: `${(AXIS / 760) * 100}%`, top: `${(HUB_Y / 660) * 100}%` }}
        >
          <span className="rr-hub-ring" aria-hidden="true" />
          <Image
            src="/assets/brand/its-time-mark-transparent-clean.png"
            alt="Its Time CRM"
            width={48}
            height={50}
            sizes="40px"
          />
        </div>

        <div className="rr-panel" data-required-element="recovery-panel" aria-live="polite">
          {active ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="rr-panel-inner"
                key={scene}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: 0.25 }}
              >
                <Panel scene={scene} reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    </div>
  );
}
