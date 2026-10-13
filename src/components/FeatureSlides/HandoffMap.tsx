"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Hand, MapPin, Route, UserRound } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AgentBotGlyph } from "./AgentIcons";
import { useSceneClock } from "./useSceneClock";

const scenes = [
  { key: "inbox", tab: "Tudo no inbox" },
  { key: "handoff", tab: "Hora de passar" },
  { key: "unit", tab: "Unidade certa" },
  { key: "team", tab: "Equipe fecha" },
] as const;

// Times (ms from scene start) at which each scene reaches its next visual step.
// Scene 1 is a live feed: three conversations arrive (site, WhatsApp, Instagram); the AI types and answers each.
const stepTimes: number[][] = [
  [600, 1500, 2400, 3100, 4000, 4900, 5600, 6500, 7300],
  [900, 2700, 3900, 5300],
  [700, 1700, 3500, 4900],
  [700, 2300, 4300, 5900, 8400, 9700],
];

const EASE = [0.22, 1, 0.36, 1] as const;

// A scene lasts until its last step has played (about 0.5s of animation), plus a hold. The live feed has
// nothing to read once the last answer lands, so it hands over almost at once; the others keep time to read.
// The bar under each tab fills over exactly this duration, so it ends with the animation, not long after it.
const SETTLE_MS = 500;
const HOLDS_MS = [400, 2300, 2300, 2300];
const sceneDurations = stepTimes.map((times, index) => (times[times.length - 1] ?? 0) + SETTLE_MS + HOLDS_MS[index]);

type Channel = "whatsapp" | "instagram" | "site";

type Lead = { id: string; name: string; channel: Channel };

const leads: Lead[] = [
  { id: "carlos", name: "Carlos M.", channel: "whatsapp" },
  { id: "juliana", name: "Juliana F.", channel: "instagram" },
  { id: "renata", name: "Renata S.", channel: "site" },
  { id: "ana", name: "Ana Paula", channel: "instagram" },
];

type Tone = "ai" | "handoff" | "route" | "human" | "done" | "new" | "typing";
type RowState = { text: string; status: ReactNode; unread: number; hot: boolean };

// Stage is 760x640. Map pins are placed in stage coordinates so the routes line up.
const STAGE = { w: 760, h: 640 };
const LEAD_PIN = { x: 446, y: 340 };
const HUB = { x: 352, y: 340, edge: 31 }; // edge: outer dashed ring of the hub
const NOTE_EDGE = 300; // right edge of the panels
const units = [
  { id: "centro", name: "Unidade Centro", time: "8 min", km: "3,2 km", x: 574, y: 296 },
  { id: "norte", name: "Unidade Norte", time: "15 min", km: "7,9 km", x: 606, y: 128 },
  { id: "sul", name: "Unidade Sul", time: "22 min", km: "11 km", x: 600, y: 514 },
] as const;

const routePath = (unit: (typeof units)[number]) =>
  `M${LEAD_PIN.x} ${LEAD_PIN.y} C${LEAD_PIN.x + 50} ${LEAD_PIN.y} ${unit.x - 60} ${unit.y} ${unit.x} ${unit.y}`;

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

const channelMeta: Record<Channel, { label: string; src: string }> = {
  whatsapp: { label: "WhatsApp", src: "/assets/hero/icons/WhatsApp_icon.png" },
  instagram: { label: "Instagram", src: "/assets/hero/icons/Instagram_icon.png" },
  site: { label: "Nya, assistente do site", src: "/assets/brand/nya.webp" },
};

function ChannelBadge({ channel }: { channel: Channel }) {
  const meta = channelMeta[channel];
  return (
    <span className={`hm-channel${channel === "site" ? " hm-channel--site" : ""}`} aria-label={meta.label}>
      <Image src={meta.src} alt="" width={40} height={40} sizes="40px" />
    </span>
  );
}

/** The person who took over is the moment to look at: her name carries the brand gradient wherever it appears. */
function withGradientName(text: string): ReactNode {
  const [before, ...rest] = text.split("Rafaela");
  if (!rest.length) return text;
  return (
    <>
      {before}
      <b className="hm-grad">Rafaela</b>
      {rest.join("Rafaela")}
    </>
  );
}

/** What the AI (or the team) is doing on a conversation: an icon and a word, no outlined pill. */
function Status({ tone, children }: { tone: Tone; children: ReactNode }) {
  const icon =
    tone === "handoff" ? (
      <Hand aria-hidden="true" strokeWidth={2.2} />
    ) : tone === "route" ? (
      <Route aria-hidden="true" strokeWidth={2.2} />
    ) : tone === "human" ? (
      <UserRound aria-hidden="true" strokeWidth={2.2} />
    ) : tone === "done" ? (
      <Check aria-hidden="true" strokeWidth={2.6} />
    ) : null;

  return (
    <motion.span
      className="hm-status"
      data-tone={tone}
      key={tone}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {icon}
      {children}
    </motion.span>
  );
}

export function HandoffMap() {
  const reduce = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);
  const { scene, fills, go, active } = useSceneClock(stageRef, sceneDurations, !reduce);
  const [progress, setProgress] = useState({ scene: 0, step: 0 });

  useEffect(() => {
    const timers: number[] = [];
    const frame = window.requestAnimationFrame(() => {
      if (reduce || !active) return;
      setProgress({ scene, step: 0 });
      stepTimes[scene].forEach((at, index) => {
        timers.push(window.setTimeout(() => setProgress({ scene, step: index + 1 }), at));
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [scene, reduce, active]);

  // Progress only counts for the scene it was recorded in; reduced motion shows every step.
  const step = reduce ? stepTimes[scene].length : progress.scene === scene ? progress.step : 0;

  // A step is "reached" once the story is past it, in this scene or any earlier one.
  const reached = (sceneIndex: number, stepIndex: number) =>
    scene > sceneIndex || (scene === sceneIndex && step > stepIndex);

  const newMessage = reached(1, 0);
  const handoff = reached(1, 1);
  const motive = reached(1, 2);
  const summary = reached(1, 3);
  const pinDropped = reached(2, 0);
  const routesDrawn = reached(2, 1);
  const timesShown = reached(2, 2);
  const chosen = reached(2, 3);
  const queueShown = reached(3, 0);
  const inQueue = reached(3, 1);
  const accepted = reached(3, 2);
  const humanOnLead = reached(3, 3);
  const finalizePressed = reached(3, 4);
  const aiBack = reached(3, 5);

  // Scene 1 is a live feed: `feed` is how many arrivals/replies have happened so far.
  const feed = scene > 0 ? stepTimes[0].length : scene === 0 ? step : 0;

  let anaStatus: ReactNode = <Status tone="ai">IA atendendo</Status>;
  if (aiBack) anaStatus = <Status tone="done">Atendimento finalizado</Status>;
  else if (humanOnLead)
    anaStatus = (
      <Status tone="human">
        <b className="hm-grad">Rafaela</b> · IA em pausa
      </Status>
    );
  else if (chosen) anaStatus = <Status tone="route">Unidade Centro</Status>;
  else if (handoff) anaStatus = <Status tone="handoff">Handoff</Status>;

  const aiIdle = <Status tone="ai">IA atendendo</Status>;
  const newStatus = <Status tone="new">Nova mensagem</Status>;
  const typingStatus = (
    <Status tone="typing">
      IA digitando
      <span className="hm-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </Status>
  );

  // feed steps: 1 renata new, 2 typing, 3 replied | 4 carlos new, 5 typing, 6 replied | 7 ana new, 8 typing, 9 replied
  const rows: Record<string, RowState> = {
    renata: {
      text: feed >= 3 ? "IA · Tenho amanhã às 10h ✓" : feed >= 1 ? "Vocês têm horário amanhã?" : "Obrigada! Até mais 🙂",
      status: feed === 1 ? newStatus : feed === 2 ? typingStatus : aiIdle,
      unread: feed === 1 || feed === 2 ? 1 : 0,
      hot: feed >= 1 && feed <= 2,
    },
    carlos: {
      text: feed >= 6 ? "IA · Combinado, te aviso! 😊" : feed >= 4 ? "Obrigado, vou aguardar 👍" : "Beleza, fico no aguardo",
      status: feed === 4 ? newStatus : feed === 5 ? typingStatus : aiIdle,
      unread: feed === 4 || feed === 5 ? 1 : 0,
      hot: feed >= 4 && feed <= 5,
    },
    juliana: { text: "Posso trocar o meu horário?", status: aiIdle, unread: 0, hot: false },
    ana: {
      text: newMessage
        ? "Quero fechar! Pode fazer o orçamento final?"
        : feed >= 9
          ? "IA · Já te passo os valores 😊"
          : feed >= 7
            ? "Adorei! Quanto fica?"
            : "Oi! Vi o anúncio de vocês 😊",
      status: scene > 0 ? anaStatus : feed === 7 ? newStatus : feed === 8 ? typingStatus : aiIdle,
      unread: scene === 0 && (feed === 7 || feed === 8) ? 1 : 0,
      hot: (scene === 0 && (feed === 7 || feed === 8)) || scene > 0,
    },
  };

  // The newest conversation jumps to the top, like a real inbox.
  let order = ["carlos", "juliana", "renata", "ana"];
  if (feed >= 7) order = ["ana", "carlos", "juliana", "renata"];
  else if (feed >= 4) order = ["carlos", "renata", "juliana", "ana"];
  else if (feed >= 1) order = ["renata", "carlos", "juliana", "ana"];

  const arriving = feed === 1 ? "site" : feed === 4 ? "whatsapp" : feed === 7 ? "instagram" : null;
  const messagesToday = 128 + (feed >= 1 ? 1 : 0) + (feed >= 4 ? 1 : 0) + (feed >= 7 ? 1 : 0);

  const noteFields = [
    { key: "motive", label: "Motivo", value: motive ? "Pedido de orçamento fechado" : null },
    {
      key: "summary",
      label: "Resumo",
      value: summary ? "Quer armação rose gold com lentes antirreflexo (R$ 890). Prefere sexta à tarde. Já enviou a receita." : null,
    },
    { key: "destination", label: "Encaminhada para", value: chosen ? "Unidade Centro · a 8 min de carro" : null },
    {
      key: "agent",
      label: "Atendente",
      value: aiBack ? "Atendimento concluído pela Rafaela" : accepted ? "Rafaela assumiu, já com o resumo acima" : null,
    },
  ];
  const lastFilled = noteFields.filter((field) => field.value).slice(-1)[0]?.key;

  return (
    <div className="hm" data-scene={scene} data-required-element="handoff-map">
      <div className="hm-stage" ref={stageRef}>
        {/* Procedural city map backdrop (replaces the old raster background) */}
        <svg className="hm-city" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="hm-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill="rgba(245,243,239,0.14)" />
            </pattern>
            <radialGradient id="hm-fade" cx="72%" cy="52%" r="46%">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="hm-mask">
              <rect width={STAGE.w} height={STAGE.h} fill="url(#hm-fade)" />
            </mask>
          </defs>
          <g mask="url(#hm-mask)">
            <rect x="0" y="0" width="760" height="640" fill="url(#hm-dots)" />
          </g>
        </svg>

        {/* Wires: panels -> AI -> lead's location, then the routes to each unit */}
        <svg className="hm-routes" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} preserveAspectRatio="none" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="hm-route-grad" gradientUnits="userSpaceOnUse" x1={LEAD_PIN.x} y1="0" x2="600" y2="0">
              <stop offset="0" stopColor="#ff6a2b" />
              <stop offset="1" stopColor="#ff6b92" />
            </linearGradient>
          </defs>

          <path className="hm-wire" d={`M${NOTE_EDGE + 3} ${HUB.y} H${HUB.x - HUB.edge}`} />
          <path className="hm-wire-flow" d={`M${NOTE_EDGE + 3} ${HUB.y} H${HUB.x - HUB.edge}`} data-on={handoff && !chosen} />
          <circle className="hm-port" cx={NOTE_EDGE + 3} cy={HUB.y} r="2.4" />

          <path className="hm-wire" d={`M${HUB.x + HUB.edge} ${HUB.y} H${LEAD_PIN.x}`} data-on={pinDropped} />
          <path className="hm-wire-flow" d={`M${HUB.x + HUB.edge} ${HUB.y} H${LEAD_PIN.x}`} data-on={pinDropped && !routesDrawn} />

          {units.map((unit) => {
            const isChosen = unit.id === "centro";
            const dim = chosen && !isChosen;
            return (
              <g key={unit.id} data-dim={dim} data-chosen={chosen && isChosen}>
                <motion.path
                  className="hm-route"
                  d={routePath(unit)}
                  initial={false}
                  animate={{ pathLength: routesDrawn ? 1 : 0, opacity: routesDrawn ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                />
                {/* data moving along the route: dashes, no glow */}
                <path
                  className="hm-route-flow"
                  d={routePath(unit)}
                  data-on={routesDrawn && !reduce && (!chosen || isChosen)}
                  data-chosen={chosen && isChosen}
                />
              </g>
            );
          })}
        </svg>

        {/* Inbox */}
        <section className="hm-inbox" aria-label="Inbox unificado" data-required-element="handoff-inbox">
          <header className="hm-card-head">
            <b>
              Inbox
              <span className="hm-live" aria-live="polite">
                <i aria-hidden="true" />
                Ao vivo
                <em>·</em>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={messagesToday}
                    className="hm-live-count"
                    initial={reduce ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {messagesToday}
                  </motion.span>
                </AnimatePresence>
                hoje
              </span>
            </b>
            <span className="hm-channels" aria-label="Canais conectados">
              {(["whatsapp", "instagram", "site"] as const).map((channel) => (
                <span
                  className="hm-channel-wrap"
                  data-arriving={arriving === channel}
                  key={`${channel}-${arriving === channel ? feed : "idle"}`}
                >
                  <ChannelBadge channel={channel} />
                </span>
              ))}
            </span>
          </header>
          <ul className="hm-leads">
            {order.map((id, position) => {
              const lead = leads.find((item) => item.id === id) as Lead;
              const row = rows[id];
              const ana = id === "ana";
              return (
                <motion.li
                  key={lead.id}
                  layout="position"
                  className="hm-lead"
                  data-active={row.hot}
                  data-new={row.unread > 0}
                  data-flag={ana && handoff}
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                  transition={{
                    opacity: { duration: 0.4, delay: active ? position * 0.08 : 0 },
                    x: { duration: 0.4, ease: EASE, delay: active ? position * 0.08 : 0 },
                    layout: { type: "spring", stiffness: 260, damping: 30 },
                  }}
                >
                  <span className="hm-avatar" data-tone={lead.name.charCodeAt(0) % 4} aria-hidden="true">
                    {lead.name[0]}
                    <AnimatePresence>
                      {row.unread > 0 ? (
                        <motion.i
                          className="hm-unread"
                          initial={reduce ? false : { scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 18 }}
                        >
                          {row.unread}
                        </motion.i>
                      ) : null}
                    </AnimatePresence>
                  </span>
                  <span className="hm-lead-main">
                    <strong>
                      {lead.name}
                      <ChannelBadge channel={lead.channel} />
                    </strong>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.small
                        key={row.text}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {row.text}
                      </motion.small>
                    </AnimatePresence>
                  </span>
                  {row.status}
                </motion.li>
              );
            })}
          </ul>
        </section>

        {/* Note + AI control */}
        <section className="hm-note" aria-label="Nota interna do handoff" data-visible={motive}>
          <header className="hm-card-head">
            <b>
              <span className="hm-bot" aria-hidden="true">
                <AgentBotGlyph />
              </span>
              Nota interna · Handoff IA
            </b>
          </header>
          <dl className="hm-note-body">
            {noteFields.map((field) => (
              <div
                className="hm-field"
                data-filled={Boolean(field.value)}
                data-fresh={field.key === lastFilled}
                key={field.key}
              >
                <dt>{field.label}</dt>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.dd
                    key={field.value ?? "empty"}
                    className={field.value ? undefined : "hm-skeleton"}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {field.value ? withGradientName(field.value) : ""}
                  </motion.dd>
                </AnimatePresence>
              </div>
            ))}
          </dl>
          <footer className="hm-control" data-on={aiBack}>
            <span>IA neste lead</span>
            <span className="hm-switch" data-on={aiBack || !handoff} aria-hidden="true">
              <i />
            </span>
            <span className="hm-control-state">{aiBack ? "Ativa" : handoff ? "Pausada" : "Ativa"}</span>
            <button type="button" className="hm-finalize" data-pressed={finalizePressed} tabIndex={-1} aria-hidden="true">
              Finalizar atendimento
            </button>
          </footer>
        </section>

        {/* Hub */}
        <div
          className="hm-hub"
          data-required-element="handoff-hub"
          data-pulse={handoff && !chosen}
          style={{ left: pct(HUB.x, STAGE.w), top: pct(HUB.y, STAGE.h) }}
        >
          <span className="hm-hub-ring" aria-hidden="true" />
          <span className="hm-hub-core">
            <Image
              src="/assets/brand/its-time-mark-transparent-clean.png"
              alt="Its Time IA"
              width={48}
              height={50}
              sizes="40px"
            />
          </span>
        </div>

        {/* Lead location pin */}
        <div className="hm-pin-layer">
          <AnimatePresence>
            {pinDropped ? (
              <motion.div
                className="hm-pin"
                style={{ left: pct(LEAD_PIN.x, STAGE.w), top: pct(LEAD_PIN.y, STAGE.h) }}
                initial={reduce ? false : { opacity: 0, y: -18, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="hm-pin-dot" aria-hidden="true" />
                <span className="hm-pin-label">Localização da Ana</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Units */}
        <div className="hm-units" aria-label="Unidades" data-required-element="handoff-units">
          {units.map((unit) => {
            const isChosen = unit.id === "centro";
            const dim = chosen && !isChosen;
            return (
              <div
                className="hm-unit"
                key={unit.id}
                data-chosen={chosen && isChosen}
                data-dim={dim}
                style={{ left: pct(unit.x, STAGE.w), top: pct(unit.y, STAGE.h) } as CSSProperties}
              >
                <span className="hm-unit-pin" aria-hidden="true">
                  <MapPin size="100%" strokeWidth={2} />
                </span>
                <span className="hm-unit-copy">
                  <strong>{unit.name}</strong>
                  <small>
                    <AnimatePresence initial={false}>
                      {timesShown ? (
                        <motion.span
                          key="time"
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          {unit.time} de carro · {unit.km}
                        </motion.span>
                      ) : (
                        <span key="idle">Franquia</span>
                      )}
                    </AnimatePresence>
                  </small>
                </span>
                {isChosen ? (
                  <AnimatePresence>
                    {queueShown ? (
                      <motion.div
                        className="hm-queue"
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <b>Equipe · Unidade Centro</b>
                        <ul>
                          <li data-active={accepted && !aiBack}>
                            <span className="hm-avatar" data-tone="1" aria-hidden="true">
                              R
                            </span>
                            {accepted && !aiBack ? <b className="hm-grad">Rafaela</b> : "Rafaela"}
                            <em data-state={accepted && !aiBack ? "busy" : "free"}>
                              {accepted && !aiBack ? "assumiu" : "disponível"}
                            </em>
                          </li>
                          <li>
                            <span className="hm-avatar" data-tone="2" aria-hidden="true">
                              D
                            </span>
                            Diego
                            <em data-state="free">disponível</em>
                          </li>
                        </ul>
                        <AnimatePresence>
                          {inQueue ? (
                            <motion.div
                              className="hm-queue-lead"
                              data-state={aiBack ? "done" : accepted ? "busy" : "waiting"}
                              initial={reduce ? false : { opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, ease: EASE }}
                            >
                              <span className="hm-avatar hm-avatar--lead" aria-hidden="true">
                                A
                              </span>
                              Ana Paula
                              <em>{aiBack ? "concluído" : accepted ? "em atendimento" : "aguardando"}</em>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Step timeline: each bar fills over exactly the scene's duration */}
        <div className="hm-steps" role="tablist" aria-label="Etapas do atendimento">
          {scenes.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={scene === index}
              className="hm-step"
              data-active={scene === index}
              key={item.key}
              onClick={() => index !== scene && go(index)}
            >
              <span className="hm-step-track" aria-hidden="true">
                <span
                  ref={(el) => {
                    fills.current[index] = el;
                  }}
                  style={{ transform: `scaleX(${index < scene || (reduce && index === scene) ? 1 : 0})` }}
                />
              </span>
              <span className="hm-step-label">
                <i>{index + 1}</i>
                {item.tab}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
