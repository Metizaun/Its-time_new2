"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRightLeft, Bell, Check, CheckCheck, Send, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { AudioGlyph, CalendarGlyph, ForwardingGlyph } from "@/components/FeatureSlides/AgentIcons";
import { clinicJourney } from "@/lib/solutions/clinicas";

/**
 * The product, told as one patient's conversation. Everything here is a pure function of `step` (0–5), so the same
 * scene works as the sticky stage on desktop (one instance, step follows the scroll) and as a still per step on
 * phones and with reduced motion (one instance per step, `solo`).
 */

type Message = {
  step: number;
  from: "patient" | "ai" | "team" | "system" | "day";
  time?: string;
  text: string;
  kind?: "audio" | "booking";
};

const PATIENT = "Juliana";

const messages: Message[] = [
  { step: 0, from: "patient", time: "22:14", text: "Oi! Vocês fazem limpeza de pele? Quanto fica?" },
  {
    step: 0,
    from: "ai",
    time: "22:14",
    text: `Oi, ${PATIENT}! Fazemos sim 😊 A sessão é R$ 180 e começa com uma avaliação rápida da pele com a Paula, sem custo.`,
  },
  { step: 1, from: "patient", time: "22:15", kind: "audio", text: "“Precisa de algum preparo? E dá para parcelar?”" },
  {
    step: 1,
    from: "ai",
    time: "22:15",
    text: "Só vir sem maquiagem. Aceitamos Pix ou cartão em até 3x. Quer ver os horários?",
  },
  { step: 2, from: "ai", time: "22:16", text: "Tenho quinta às 9h30 ou sexta às 14h com a Paula. Qual fica melhor?" },
  { step: 2, from: "patient", time: "22:16", text: "Quinta 9h30!" },
  { step: 2, from: "system", kind: "booking", text: "Sessão marcada · Qui, 9h30 · Paula" },
  { step: 3, from: "day", text: "Quinta-feira" },
  {
    step: 3,
    from: "ai",
    time: "08:30",
    text: `Bom dia, ${PATIENT}! Sua sessão é hoje às 9h30 com a Paula. Lembra de vir sem maquiagem. Confirma a presença?`,
  },
  { step: 3, from: "patient", time: "08:31", text: "Confirmo! 👍" },
  { step: 4, from: "day", text: "Segunda-feira" },
  {
    step: 4,
    from: "ai",
    time: "10:00",
    text: `Oi, ${PATIENT}! A Paula deixou pronto o pacote de sessões que vocês conversaram. Quer reservar a próxima para esta semana?`,
  },
  { step: 4, from: "patient", time: "10:12", text: "Quero! Mas queria ver o parcelamento do pacote com alguém." },
  { step: 5, from: "system", text: "Encaminhado para a recepção, com o histórico" },
  { step: 5, from: "team", time: "10:20", text: `Oi, ${PATIENT}! Aqui é a Bianca, já vi tudo. Vamos ver o parcelamento?` },
];

const pipeline = ["Novo", "Atendimento", "Agendado", "Orçamento", "Equipe"] as const;
const pipelineByStep = [0, 1, 2, 2, 3, 4];

const statusByStep = [
  "Fora do horário · IA",
  "Fora do horário · IA",
  "Fora do horário · IA",
  "IA atendendo",
  "IA atendendo",
  "Bianca na conversa",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function JourneyScene({ step, solo = false }: { step: number; solo?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const current = clinicJourney[step];
  const visible = messages.filter((message) => (solo ? message.step === step : message.step <= step));
  const animate = !reduce;

  return (
    <div className={`cl-scene${solo ? " cl-scene--solo" : ""}`} data-step={step}>
      <LayoutGroup id={solo ? `cl-scene-${step}` : "cl-scene"}>
        <div className="cl-chat" role="img" aria-label={`Conversa de exemplo: ${current.title}`}>
          <div className="cl-chat-head">
            <span className="cl-monogram" aria-hidden="true">
              CA
            </span>
            <span className="cl-chat-id">
              <strong>Clínica Alma</strong>
              <span>
                <i aria-hidden="true" className={step === 5 ? "is-team" : ""} />
                {statusByStep[step]}
              </span>
            </span>
            <Dial hour={current.hour} time={current.time} animate={animate} />
          </div>

          <div className="cl-chat-body">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((message) => (
                <motion.div
                  key={`${message.step}-${message.text}`}
                  layout={animate ? "position" : false}
                  initial={animate ? { opacity: 0, y: 14, scale: 0.98 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={animate ? { opacity: 0, y: 10, transition: { duration: 0.18 } } : undefined}
                  transition={{ duration: 0.42, ease, delay: animate ? delayFor(message, visible) : 0 }}
                  className={`cl-msg cl-msg--${message.from}${message.kind ? ` cl-msg--${message.kind}` : ""}`}
                >
                  <MessageBody message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cl-chat-input" aria-hidden="true">
            <span>Mensagem</span>
            <Send size={15} strokeWidth={2.2} />
          </div>
        </div>

        <div className="cl-rail">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className="cl-rail-card"
              initial={animate ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={animate ? { opacity: 0, y: -10, transition: { duration: 0.18 } } : undefined}
              transition={{ duration: 0.45, ease }}
            >
              <RailCard step={step} animate={animate} />
            </motion.div>
          </AnimatePresence>
        </div>

        <Pipeline active={pipelineByStep[step]} animate={animate} />
      </LayoutGroup>
    </div>
  );
}

/** New messages arrive one after another, as in a real chat; older ones are already there. */
function delayFor(message: Message, visible: Message[]) {
  const latest = Math.max(...visible.map((item) => item.step));
  if (message.step !== latest) return 0;
  const sameStep = visible.filter((item) => item.step === latest);
  return 0.12 + sameStep.indexOf(message) * 0.38;
}

function MessageBody({ message }: { message: Message }) {
  if (message.from === "day") return <span>{message.text}</span>;
  if (message.from === "system") {
    return (
      <>
        <span className="cl-msg-icon" aria-hidden="true">
          {message.kind === "booking" ? <CalendarGlyph /> : <ForwardingGlyph />}
        </span>
        <span>{message.text}</span>
      </>
    );
  }
  return (
    <>
      {message.from === "team" ? <span className="cl-msg-author">Bianca · Recepção</span> : null}
      {message.kind === "audio" ? (
        <span className="cl-audio" aria-hidden="true">
          <span className="cl-audio-glyph">
            <AudioGlyph />
          </span>
          <span className="cl-audio-wave" />
          <span>0:09</span>
        </span>
      ) : null}
      <span className={message.kind === "audio" ? "cl-audio-text" : undefined}>{message.text}</span>
      {message.time ? (
        <span className="cl-msg-time">
          {message.time}
          {message.from === "patient" ? null : <CheckCheck size={12} strokeWidth={2.4} aria-hidden="true" />}
        </span>
      ) : null}
    </>
  );
}

/** A 12 h dial: the brand is a clock, and the scene is about time (the 22h message, the reminder, the return). */
function Dial({ hour, time, animate }: { hour: number; time: string; animate: boolean }) {
  const hourAngle = (hour % 12) * 30;
  const minuteAngle = (hour % 1) * 360;
  return (
    <span className="cl-dial">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" />
        {Array.from({ length: 12 }, (_, index) => (
          <line key={index} x1="16" y1="3.6" x2="16" y2={index % 3 === 0 ? 6.4 : 5} transform={`rotate(${index * 30} 16 16)`} />
        ))}
        <motion.line
          className="cl-dial-hour"
          x1="16"
          y1="16"
          x2="16"
          y2="9.5"
          style={{ originX: "16px", originY: "16px" }}
          initial={false}
          animate={{ rotate: hourAngle }}
          transition={animate ? { duration: 0.9, ease } : { duration: 0 }}
        />
        <motion.line
          className="cl-dial-minute"
          x1="16"
          y1="16"
          x2="16"
          y2="6.5"
          style={{ originX: "16px", originY: "16px" }}
          initial={false}
          animate={{ rotate: minuteAngle }}
          transition={animate ? { duration: 0.9, ease } : { duration: 0 }}
        />
        <circle className="cl-dial-pin" cx="16" cy="16" r="1.6" />
      </svg>
      <span className="cl-dial-time">{time}</span>
    </span>
  );
}

function RailHead({ icon, label, children }: { icon: ReactNode; label: string; children?: ReactNode }) {
  return (
    <div className="cl-rail-head">
      <span className="cl-rail-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="cl-rail-label">{label}</span>
      {children}
    </div>
  );
}

function Tick({ index, animate, children, pending = false }: { index: number; animate: boolean; children: ReactNode; pending?: boolean }) {
  return (
    <motion.li
      className={pending ? "is-pending" : undefined}
      initial={animate ? { opacity: 0, x: -8 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: animate ? 0.25 + index * 0.22 : 0, ease }}
    >
      <span className="cl-tick" aria-hidden="true">
        {pending ? null : <Check size={11} strokeWidth={3} />}
      </span>
      {children}
    </motion.li>
  );
}

function RailCard({ step, animate }: { step: number; animate: boolean }) {
  switch (step) {
    case 0:
      return (
        <>
          <RailHead icon={<Bell size={15} strokeWidth={2.2} />} label="Fora do horário" />
          <HoursMini animate={animate} />
          <p className="cl-rail-note">A recepção atende das 8h às 18h. No resto do dia, a IA responde e guarda tudo para a equipe.</p>
        </>
      );
    case 1:
      return (
        <>
          <RailHead icon={<CheckCheck size={15} strokeWidth={2.2} />} label="Respostas da clínica" />
          <ul className="cl-checks">
            {["Valor do procedimento", "Formas de pagamento", "Preparo", "Profissionais e horários"].map((item, index) => (
              <Tick key={item} index={index} animate={animate}>
                {item}
              </Tick>
            ))}
            <Tick index={4} animate={animate} pending>
              Dúvida clínica → equipe
            </Tick>
          </ul>
          <p className="cl-rail-note">A IA só usa o que está cadastrado. O resto vai para uma pessoa.</p>
        </>
      );
    case 2:
      return (
        <>
          <RailHead icon={<CalendarGlyph />} label="Agenda · Paula" />
          <AgendaMini animate={animate} />
          <p className="cl-rail-note">Agenda do Its Time ou a do seu sistema, pela Agenda Universal.</p>
        </>
      );
    case 3:
      return (
        <>
          <RailHead icon={<Bell size={15} strokeWidth={2.2} />} label="Lembrete" />
          <p className="cl-rail-title">Limpeza de pele · Qui, 9h30</p>
          <ul className="cl-checks">
            <Tick index={0} animate={animate}>
              Lembrete enviado
            </Tick>
            <Tick index={1} animate={animate}>
              Presença confirmada
            </Tick>
          </ul>
          <p className="cl-rail-note">
            <ArrowRightLeft size={13} strokeWidth={2.2} aria-hidden="true" /> Se não puder ir, a IA oferece outro horário.
          </p>
        </>
      );
    case 4:
      return (
        <>
          <RailHead icon={<Send size={15} strokeWidth={2.2} />} label="Acompanhamento" />
          <p className="cl-rail-title">Pacote de sessões</p>
          <ol className="cl-ramp">
            {["Proposto na sessão", "Sem resposta há 4 dias", "Retomado pela IA", "Paciente respondeu"].map((item, index) => (
              <motion.li
                key={item}
                style={{ ["--i" as string]: index }}
                initial={animate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: animate ? 0.2 + index * 0.28 : 0 }}
              >
                {item}
              </motion.li>
            ))}
          </ol>
        </>
      );
    default:
      return (
        <>
          <RailHead icon={<UserRound size={15} strokeWidth={2.2} />} label={`CRM · ${PATIENT}`} />
          <ol className="cl-history">
            {[
              ["22:14", "Primeira mensagem · WhatsApp"],
              ["22:16", "Sessão marcada"],
              ["Qui", "Presença confirmada"],
              ["Seg", "Orçamento retomado"],
              ["10:20", "Recepção assumiu"],
            ].map(([time, text], index) => (
              <motion.li
                key={text}
                initial={animate ? { opacity: 0, x: -6 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: animate ? 0.15 + index * 0.16 : 0, ease }}
              >
                <time>{time}</time>
                <span>{text}</span>
              </motion.li>
            ))}
          </ol>
        </>
      );
  }
}

/** The clinic's day on a 24 h ring: grey where the front desk works, brand gradient where the AI covers. */
function HoursMini({ animate }: { animate: boolean }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const desk = (10 / 24) * c; // 8h–18h
  const angle = (22.23 / 24) * 360;
  return (
    <svg className="cl-hours-mini" viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id="cl-hours-mini-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#ff4d6d" />
        </linearGradient>
      </defs>
      <g transform="rotate(-90 40 40)">
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          className="cl-hours-ai"
          stroke="url(#cl-hours-mini-g)"
          strokeDasharray={`${c - desk} ${c}`}
          strokeDashoffset={-((18 / 24) * c)}
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
        />
        <circle cx="40" cy="40" r={r} className="cl-hours-desk" strokeDasharray={`${desk} ${c}`} strokeDashoffset={-((8 / 24) * c)} />
      </g>
      <g transform={`rotate(${angle} 40 40)`}>
        <circle cx="40" cy={40 - r} r="3.4" className="cl-hours-now" />
      </g>
      <text x="40" y="38" textAnchor="middle" className="cl-hours-time">
        22:14
      </text>
      <text x="40" y="49" textAnchor="middle" className="cl-hours-caption">
        IA
      </text>
    </svg>
  );
}

function AgendaMini({ animate }: { animate: boolean }) {
  const days = ["Qua", "Qui", "Sex"];
  const slots = ["8h30", "9h30", "14h"];
  const busy = new Set(["Qua-8h30", "Qua-9h30", "Qui-8h30", "Sex-9h30", "Qua-14h"]);
  return (
    <div className="cl-agenda" role="presentation">
      <span />
      {days.map((day) => (
        <span key={day} className="cl-agenda-day">
          {day}
        </span>
      ))}
      {slots.map((slot) => (
        <AgendaRow key={slot} slot={slot} days={days} busy={busy} animate={animate} />
      ))}
    </div>
  );
}

function AgendaRow({ slot, days, busy, animate }: { slot: string; days: string[]; busy: Set<string>; animate: boolean }) {
  return (
    <>
      <span className="cl-agenda-slot">{slot}</span>
      {days.map((day) => {
        const key = `${day}-${slot}`;
        if (key === "Qui-9h30") {
          return (
            <motion.span
              key={key}
              className="cl-agenda-cell is-booked"
              initial={animate ? { ["--fill" as string]: "0%" } : false}
              animate={{ ["--fill" as string]: "100%" }}
              transition={{ duration: 0.7, delay: animate ? 0.9 : 0, ease }}
            >
              {PATIENT}
            </motion.span>
          );
        }
        if (key === "Sex-14h") return <span key={key} className="cl-agenda-cell is-offered">livre</span>;
        return <span key={key} className={`cl-agenda-cell${busy.has(key) ? " is-busy" : ""}`} />;
      })}
    </>
  );
}

/** The patient's card moving through the CRM funnel: the same journey, seen by the team. */
function Pipeline({ active, animate }: { active: number; animate: boolean }) {
  return (
    <div className="cl-pipeline" aria-hidden="true">
      {pipeline.map((stage, index) => (
        <div key={stage} className={`cl-stage${index === active ? " is-active" : ""}${index < active ? " is-done" : ""}`}>
          <span className="cl-stage-name">{stage}</span>
          <span className="cl-stage-lane">
            {index === active ? (
              <motion.span
                layoutId="cl-patient-card"
                className="cl-patient-chip"
                transition={animate ? { type: "spring", stiffness: 260, damping: 30 } : { duration: 0 }}
              >
                <span className="cl-patient-avatar">J</span>
                {PATIENT}
              </motion.span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}
