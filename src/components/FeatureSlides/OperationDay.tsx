"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Moon, Send, Sun, UserRound, WalletCards } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AgentBotGlyph, CalendarGlyph } from "./AgentIcons";
import { Count } from "./Count";
import { slidePhase } from "./slidePhase";
import { DAY_MESSAGE, whatsappLinkProps } from "@/lib/whatsapp";

type ModuleId = "ia" | "cobranca" | "agenda" | "equipe" | "reativacao" | "painel";

const modules: Record<ModuleId, { label: string; icon: ReactNode }> = {
  ia: { label: "Atendimento", icon: <AgentBotGlyph /> },
  cobranca: { label: "Cobrança", icon: <WalletCards size="100%" strokeWidth={2} /> },
  agenda: { label: "Acompanhamento", icon: <CalendarGlyph /> },
  equipe: { label: "Equipe", icon: <UserRound size="100%" strokeWidth={2} /> },
  reativacao: { label: "Reativação", icon: <Send size="100%" strokeWidth={2} /> },
  painel: { label: "Painel", icon: <BarChart3 size="100%" strokeWidth={2} /> },
};

type Totals = { c: number; h: number; r: number; v: number };

type DayEvent = {
  at: number; // minutes since 00:00
  module: ModuleId;
  actor: string;
  text: string;
  team?: boolean;
  add?: Partial<Totals>;
};

const at = (hours: number, minutes = 0) => hours * 60 + minutes;

const events: DayEvent[] = [
  {
    at: at(0, 40),
    module: "ia",
    actor: "Clara",
    text: "Uma lead do Instagram pergunta o valor do procedimento. A IA responde na hora.",
    add: { c: 8 },
  },
  {
    at: at(7, 50),
    module: "cobranca",
    actor: "Sofia",
    text: "Lembretes de vencimento saem no WhatsApp para 38 clientes, antes de a equipe chegar.",
    add: { c: 38 },
  },
  {
    at: at(10, 15),
    module: "ia",
    actor: "Clara",
    text: "A IA lê a receita, indica a armação e envia o orçamento.",
    add: { c: 24, h: 3 },
  },
  {
    at: at(11, 40),
    module: "equipe",
    actor: "Rafaela",
    text: "Rafaela assume o atendimento na Unidade Centro, com o resumo pronto, e fecha a venda.",
    team: true,
  },
  {
    at: at(12, 50),
    module: "equipe",
    actor: "Diego",
    text: "Comprovante recebido. Diego confirma o pagamento.",
    team: true,
    add: { c: 3, r: 4800 },
  },
  {
    at: at(14, 0),
    module: "agenda",
    actor: "Sofia",
    text: "Lembrete uma hora antes: 12 consultas confirmadas.",
    add: { c: 12, h: 12 },
  },
  {
    at: at(15, 30),
    module: "reativacao",
    actor: "Sofia",
    text: "Orçamentos parados recebem uma proposta nova.",
    add: { c: 17, v: 12900 },
  },
  {
    at: at(17, 10),
    module: "cobranca",
    actor: "Sofia",
    text: "Parcelas em atraso: 9 Pix enviados e pagos.",
    add: { c: 9, r: 13800 },
  },
  {
    at: at(18, 30),
    module: "equipe",
    actor: "Equipe",
    text: "A equipe encerra o expediente. A IA segue atendendo.",
    team: true,
  },
  {
    at: at(20, 15),
    module: "agenda",
    actor: "Sofia",
    text: "Pós-consulta: 21 clientes cuidados e 6 retornos agendados.",
    add: { c: 21, h: 6 },
  },
  {
    at: at(22, 0),
    module: "ia",
    actor: "Clara",
    text: "Uma lead agenda sozinha, fora do horário comercial.",
    add: { c: 9, h: 4 },
  },
  {
    at: at(23, 40),
    module: "painel",
    actor: "Its Time",
    text: "O painel fecha o dia com tudo registrado.",
  },
];

const DAY = 1440;
const TEAM_START = at(8);
const TEAM_END = at(18);
const EASE = [0.22, 1, 0.36, 1] as const;

// Autoplay: the clock "jumps" from event to event, then rests on each one long enough to read it.
const START_HOLD_MS = 1000;
const MOVE_MS = 850;
const HOLD_MS = 1900;
const END_MS = 900;
// The day rests on "Fim do dia" for a moment and then starts again on its own. If the visitor explores
// the timeline, the demo takes over again once they have stopped touching it for IDLE_MS.
const REST_MS = 4500;
const IDLE_MS = 6000;

type Segment = { from: number; to: number; start: number; moveEnd: number; end: number };

const segments: Segment[] = (() => {
  const list: Segment[] = [];
  let clock = START_HOLD_MS;
  let previous = 0;
  for (const event of events) {
    list.push({ from: previous, to: event.at, start: clock, moveEnd: clock + MOVE_MS, end: clock + MOVE_MS + HOLD_MS });
    clock += MOVE_MS + HOLD_MS;
    previous = event.at;
  }
  list.push({ from: previous, to: DAY, start: clock, moveEnd: clock + END_MS, end: clock + END_MS });
  return list;
})();

const AUTOPLAY_MS = segments[segments.length - 1].end;

function minutesAt(elapsed: number) {
  if (elapsed < START_HOLD_MS) return 0;
  for (const segment of segments) {
    if (elapsed < segment.moveEnd) {
      const progress = (elapsed - segment.start) / (segment.moveEnd - segment.start);
      const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);
      return segment.from + (segment.to - segment.from) * eased;
    }
    if (elapsed < segment.end) return segment.to;
  }
  return DAY;
}

const pad = (value: number) => String(value).padStart(2, "0");
const clockText = (minutes: number) =>
  minutes >= DAY - 0.5 ? "24:00" : `${pad(Math.floor(minutes / 60))}:${pad(Math.floor(minutes % 60))}`;
const eventTime = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

const brl = (value: number) =>
  value >= 10000
    ? `R$ ${(value / 1000).toFixed(1).replace(".", ",")} mil`
    : `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
const integer = (value: number) => Math.round(value).toLocaleString("pt-BR");

const periodOf = (minutes: number) => (minutes < 360 ? "Madrugada" : minutes < 720 ? "Manhã" : minutes < 1080 ? "Tarde" : "Noite");

const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

type Mode = "auto" | "manual" | "done";

export function OperationDay() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  const [minutes, setMinutes] = useState(reduce ? DAY : 0);
  const modeRef = useRef<Mode>(reduce ? "manual" : "auto");
  const elapsed = useRef(0);
  const wasVisible = useRef(false);
  const restAt = useRef(0); // when the current "rest" (end of day or end of a manual exploration) began
  const holding = useRef(false); // the visitor has the timeline pressed
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  const changeMode = (next: Mode) => {
    modeRef.current = next;
    restAt.current = performance.now();
  };

  const restart = () => {
    elapsed.current = 0;
    setMinutes(0);
    changeMode("auto");
  };

  // Autoplay starts once the slide has settled in front of the visitor and runs only while it is on screen.
  // It rests on the final state. Everything that animates on entrance waits for `revealed`.
  useEffect(() => {
    if (reduce) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;

      const phase = slidePhase(rootRef.current);

      if (phase === "hidden") {
        wasVisible.current = false;
        setRevealed(false);
        return;
      }
      if (phase === "fading") return;
      if (!wasVisible.current) {
        if (!inViewRef.current) return;
        wasVisible.current = true;
        restart();
        setRevealed(true);
        return;
      }
      if (!inViewRef.current || document.hidden) {
        // off screen: the rest timer waits too, so the day never restarts where nobody sees it
        restAt.current += dt;
        return;
      }

      // After the day ends, or once the visitor lets go of the timeline, the demo starts over by itself.
      if (modeRef.current === "done" && performance.now() - restAt.current >= REST_MS) {
        restart();
        return;
      }
      if (modeRef.current === "manual") {
        if (holding.current) restAt.current = performance.now();
        else if (performance.now() - restAt.current >= IDLE_MS) restart();
        return;
      }
      if (modeRef.current !== "auto") return;

      elapsed.current += dt;
      setMinutes(minutesAt(elapsed.current));
      if (elapsed.current >= AUTOPLAY_MS) changeMode("done");
    }, 40);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const reached = events.filter((event) => event.at <= minutes + 0.5);
  const current = reached[reached.length - 1];
  const before = reached.slice(-3, -1).reverse();
  const totals = reached.reduce<Totals>(
    (sum, event) => ({
      c: sum.c + (event.add?.c ?? 0),
      h: sum.h + (event.add?.h ?? 0),
      r: sum.r + (event.add?.r ?? 0),
      v: sum.v + (event.add?.v ?? 0),
    }),
    { c: 0, h: 0, r: 0, v: 0 },
  );

  const teamOnline = minutes >= TEAM_START && minutes < TEAM_END;
  const night = minutes < 360 || minutes >= 1140;
  const finished = minutes >= DAY - 0.5;
  const pct = (minutes / DAY) * 100;
  const teamFill = Math.max(0, Math.min(minutes, TEAM_END) - TEAM_START);

  const shown = reduce || revealed;
  const enter = (index: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.5, ease: EASE, delay: shown ? index * 0.08 : 0 },
  });

  return (
    <div className="od" ref={rootRef} data-reduced={reduce}>
      <div className="od-stage">
        {/* Clock */}
        <motion.header className="od-head" data-required-element="operation-clock" {...enter(0)}>
          <div className="od-clock">
            <span className="od-sun" data-night={night} aria-hidden="true">
              {night ? <Moon size="100%" strokeWidth={1.8} /> : <Sun size="100%" strokeWidth={1.8} />}
            </span>
            <div>
              <strong className="od-time">{clockText(minutes)}</strong>
              <small>
                {periodOf(minutes)} · um dia na sua operação
              </small>
            </div>
          </div>
          <div className="od-chips">
            <span className="od-state" data-on="true">
              <i aria-hidden="true" />
              IA ativa
            </span>
            <span className="od-state" data-on={teamOnline}>
              <i aria-hidden="true" />
              {teamOnline ? "Equipe disponível" : "Equipe fora do expediente"}
            </span>
          </div>
        </motion.header>

        {/* Now + counters */}
        <div className="od-mid">
          <motion.section
            className="od-now"
            aria-live="polite"
            aria-label="Agora"
            data-required-element="operation-now"
            {...enter(1)}
          >
            <header>
              <span className="od-live">
                <i aria-hidden="true" />
                Agora
              </span>
              {current ? <span className="od-now-time">{finished ? "24:00" : eventTime(current.at)}</span> : null}
            </header>

            <div className="od-now-body">
              <AnimatePresence mode="wait" initial={false}>
                {finished ? (
                  <motion.div
                    className="od-event od-event--end"
                    key="end"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <strong>Fim do dia.</strong>
                    <p>E amanhã, tudo de novo. A IA já está de plantão.</p>
                  </motion.div>
                ) : current ? (
                  <motion.div
                    className="od-event"
                    key={current.at}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span className="od-event-head">
                      <span className="od-icon" data-team={current.team ?? false} aria-hidden="true">
                        {modules[current.module].icon}
                      </span>
                      <span>
                        <strong>{current.actor}</strong>
                        <small>{modules[current.module].label}</small>
                      </span>
                    </span>
                    <p>{current.text}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="od-event"
                    key="idle"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="od-event-head">
                      <span className="od-icon" aria-hidden="true">
                        <AgentBotGlyph />
                      </span>
                      <span>
                        <strong>Its Time</strong>
                        <small>Meia-noite</small>
                      </span>
                    </span>
                    <p>A IA já está atendendo. A equipe só chega às 08h.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ul className="od-before" aria-label="Antes">
              {before.map((event) => (
                <li key={event.at}>
                  <time>{eventTime(event.at)}</time>
                  <span>{event.text}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <div className="od-counters" data-required-element="operation-counters">
            {[
              { label: "Conversas atendidas", raw: totals.c, value: <Count value={totals.c} format={integer} reduce={reduce} duration={0.7} /> },
              { label: "Horários confirmados", raw: totals.h, value: <Count value={totals.h} format={integer} reduce={reduce} duration={0.7} /> },
              { label: "Recebido em cobranças", raw: totals.r, value: <Count value={totals.r} format={brl} reduce={reduce} duration={0.7} /> },
              { label: "Orçamentos reativados", raw: totals.v, value: <Count value={totals.v} format={brl} reduce={reduce} duration={0.7} /> },
            ].map((counter, index) => (
              <motion.div className="od-counter" key={counter.label} {...enter(index + 2)}>
                <small>{counter.label}</small>
                <strong>{counter.value}</strong>
                {/* lights up each time the number moves */}
                <span className="od-counter-bar" aria-hidden="true">
                  <i key={counter.raw} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <motion.div className="od-timeline" data-required-element="operation-timeline" {...enter(6)}>
          <div className="od-labels" aria-hidden="true">
            <span>
              IA <em>24 h</em>
            </span>
            <span>
              Equipe <em>08h–18h</em>
            </span>
          </div>

          <div className="od-track">
            <div className="od-bar od-bar--ia">
              {/* the bar is one grey-to-pink ramp for the whole day, revealed up to the playhead */}
              <i className="od-fill od-fill--ia" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
              {events
                .filter((event) => !event.team)
                .map((event) => (
                  <span
                    className="od-marker"
                    data-reached={event.at <= minutes + 0.5}
                    data-active={current?.at === event.at}
                    key={event.at}
                    style={{ left: `${(event.at / DAY) * 100}%` }}
                  />
                ))}
            </div>
            <div className="od-bar od-bar--team">
              <i
                className="od-window"
                style={{ left: `${(TEAM_START / DAY) * 100}%`, width: `${((TEAM_END - TEAM_START) / DAY) * 100}%` }}
              />
              <i
                className="od-fill od-fill--team"
                style={{ left: `${(TEAM_START / DAY) * 100}%`, width: `${(teamFill / DAY) * 100}%` }}
              />
              {events
                .filter((event) => event.team)
                .map((event) => (
                  <span
                    className="od-marker"
                    data-reached={event.at <= minutes + 0.5}
                    data-active={current?.at === event.at}
                    key={event.at}
                    style={{ left: `${(event.at / DAY) * 100}%` }}
                  />
                ))}
            </div>

            <ol className="od-ticks" aria-hidden="true">
              {ticks.map((hour) => (
                <li key={hour} style={{ left: `${(hour / 24) * 100}%` } as CSSProperties}>
                  {pad(hour % 24 === 0 && hour > 0 ? 24 : hour)}h
                </li>
              ))}
            </ol>

            <div className="od-playhead" style={{ left: `${pct}%` }} aria-hidden="true">
              <span className="od-hub">
                <Image src="/assets/brand/its-time-mark-transparent-clean.png" alt="" width={48} height={50} sizes="40px" />
              </span>
            </div>

            <input
              className="od-scrub"
              type="range"
              min={0}
              max={DAY}
              step={5}
              value={Math.round(minutes)}
              aria-label="Hora do dia"
              aria-valuetext={`${clockText(minutes)}, ${periodOf(minutes)}`}
              onChange={(event) => {
                changeMode("manual");
                setMinutes(Number(event.target.value));
              }}
              onPointerDown={() => {
                holding.current = true;
              }}
              onPointerUp={() => {
                holding.current = false;
                restAt.current = performance.now();
              }}
              onPointerCancel={() => {
                holding.current = false;
              }}
              onBlur={() => {
                holding.current = false;
              }}
            />
          </div>
        </motion.div>

        <footer className="od-foot">
          <span className="od-hint">
            Cada ponto é um atendimento, uma cobrança ou um retorno resolvido. <em>Arraste a linha do tempo e veja o seu dia.</em>
          </span>
          {/* the day ends on a question; the answer is a chat with the commercial team, message already written */}
          <a className="od-cta" data-finished={finished} {...whatsappLinkProps(DAY_MESSAGE)}>
            Quer isso na sua operação? <b>Agendar demonstração</b>
            <ArrowRight aria-hidden="true" strokeWidth={2.4} />
          </a>
        </footer>
      </div>
    </div>
  );
}
