"use client";

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Bell,
  CalendarCheck,
  ClipboardList,
  HeartHandshake,
  MapPinned,
  ShoppingBag,
  Sprout,
  Tags,
  WalletCards,
  Workflow,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { slidePhase } from "./slidePhase";
import { AudioGlyph, CalendarGlyph, ForwardingGlyph, PrescriptionGlyph } from "./AgentIcons";
import { Count } from "./Count";

type Channel = "whatsapp" | "instagram" | "site";

type Station = {
  id: string;
  name: string;
  idle: string;
  working: string;
  done: string;
  description: string;
  icon: ReactNode;
};

type Lane = {
  id: string;
  title: string;
  sub: string;
  narration: string;
  stations: Station[];
};

const lanes: Lane[] = [
  {
    id: "vende",
    title: "Atende e vende",
    sub: "Conversa, mostra valores, agenda e cobra",
    narration:
      "A IA lê a receita, responde em áudio, mostra os valores, agenda o horário e envia o Pix, tudo na mesma conversa.",
    stations: [
      {
        id: "receita",
        name: "Leitura de receita",
        idle: "Receita em foto",
        working: "Lendo",
        done: "Receita lida ✓",
        description: "Lê a receita ou o documento enviado em foto e resume as informações para a equipe e para o cliente.",
        icon: <PrescriptionGlyph />,
      },
      {
        id: "audio",
        name: "Áudio",
        idle: "Responde por voz",
        working: "Gravando",
        done: "Áudio enviado ✓",
        description: "Responde em áudio, com voz natural, quando a conversa pede mais proximidade.",
        icon: <AudioGlyph />,
      },
      {
        id: "catalogo",
        name: "Catálogo",
        idle: "Preços e opções",
        working: "Consultando",
        done: "Orçamento ✓",
        description: "Consulta os serviços e produtos cadastrados e responde com opções e valores na hora.",
        icon: <ShoppingBag size="100%" strokeWidth={2} />,
      },
      {
        id: "agenda",
        name: "Agenda",
        idle: "Horários em tempo real",
        working: "Sincronizando",
        done: "Agendado ✓",
        description: "Agenda direto na conversa, respeitando profissional, local, serviço e horários livres.",
        icon: <CalendarGlyph />,
      },
      {
        id: "pix",
        name: "Cobrança",
        idle: "Pix em um toque",
        working: "Gerando Pix",
        done: "Pix enviado ✓",
        description: "Envia o Pix e o lembrete de pagamento no WhatsApp, sem constrangimento. A equipe só confere o comprovante.",
        icon: <WalletCards size="100%" strokeWidth={2} />,
      },
    ],
  },
  {
    id: "organiza",
    title: "Organiza e encaminha",
    sub: "Tudo registrado, na unidade e na equipe certas",
    narration:
      "A IA aplica as tags, move o lead no funil, escolhe a unidade mais próxima e entrega o resumo pronto para a equipe.",
    stations: [
      {
        id: "tags",
        name: "Tags",
        idle: "Etiquetas automáticas",
        working: "Classificando",
        done: "Interessada ✓",
        description: "Aplica as tags certas em cada lead conforme a conversa, sem ninguém precisar etiquetar.",
        icon: <Tags size="100%" strokeWidth={2} />,
      },
      {
        id: "funil",
        name: "Funil",
        idle: "Etapa do pipeline",
        working: "Movendo",
        done: "→ Orçamento ✓",
        description: "Classifica a conversa e move o lead de etapa no pipeline automaticamente.",
        icon: <Workflow size="100%" strokeWidth={2} />,
      },
      {
        id: "filiais",
        name: "Busca de filiais",
        idle: "Unidade mais próxima",
        working: "Calculando rota",
        done: "Centro · 8 min ✓",
        description: "Localiza e recomenda a unidade mais adequada pelo tempo de carro até o cliente.",
        icon: <MapPinned size="100%" strokeWidth={2} />,
      },
      {
        id: "resumo",
        name: "Resumo para a equipe",
        idle: "Nota do atendimento",
        working: "Resumindo",
        done: "Resumo pronto ✓",
        description: "Deixa uma nota com o motivo e o resumo da conversa, para ninguém precisar perguntar de novo.",
        icon: <ClipboardList size="100%" strokeWidth={2} />,
      },
      {
        id: "equipe",
        name: "Encaminhamento",
        idle: "Equipe certa",
        working: "Direcionando",
        done: "Equipe avisada ✓",
        description: "Leva o cliente para a unidade e a pessoa certas. Sem atendente disponível, avisa toda a equipe.",
        icon: <ForwardingGlyph />,
      },
    ],
  },
  {
    id: "fideliza",
    title: "Cuida e faz voltar",
    sub: "Lembra, acompanha e reativa sozinha",
    narration:
      "A IA lembra antes, acompanha depois, nutre, reativa quem esfriou e agenda o retorno, sem ninguém precisar lembrar.",
    stations: [
      {
        id: "lembrete",
        name: "Lembrete",
        idle: "Antes da consulta",
        working: "Enviando",
        done: "Confirmada ✓",
        description: "Envia o lembrete uma hora antes do horário e confirma a presença, para a agenda não ficar vazia.",
        icon: <Bell size="100%" strokeWidth={2} />,
      },
      {
        id: "pos",
        name: "Pós-atendimento",
        idle: "Depois da consulta",
        working: "Acompanhando",
        done: "Cuidado ✓",
        description: "Pergunta como foi, tira dúvidas e mantém o cliente bem cuidado depois do atendimento.",
        icon: <HeartHandshake size="100%" strokeWidth={2} />,
      },
      {
        id: "nutricao",
        name: "Nutrição",
        idle: "Conteúdo no tempo certo",
        working: "Preparando",
        done: "Enviado ✓",
        description: "Mantém o lead aquecido com mensagens no tempo certo depois que ele responde.",
        icon: <Sprout size="100%" strokeWidth={2} />,
      },
      {
        id: "reativacao",
        name: "Reativação",
        idle: "Quem esfriou ou faltou",
        working: "Retomando",
        done: "Voltou ✓",
        description: "Chama de volta quem parou de responder, não compareceu ou deixou o orçamento parado.",
        icon: <RotateCcw size="100%" strokeWidth={2} />,
      },
      {
        id: "retorno",
        name: "Retorno",
        idle: "Cliente volta",
        working: "Agendando",
        done: "Retorno ✓",
        description: "Fecha o ciclo: o cliente volta, agenda de novo e a receita continua entrando.",
        icon: <CalendarCheck size="100%" strokeWidth={2} />,
      },
    ],
  },
];

// ---------------------------------------------------------------- ring geometry
// Everything lives in a square "ring" box, so it scales the same on desktop and mobile.
const R = 40; // node radius, % of the ring box
const nodeAngle = (i: number) => 12 + 24 * i; // degrees clockwise from the top (12 o'clock)
const polar = (angle: number, radius = R) => {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + radius * Math.sin(rad), y: 50 - radius * Math.cos(rad) };
};
const arcPath = (from: number, to: number) => {
  const a = polar(from);
  const b = polar(to);
  return `M${a.x.toFixed(3)} ${a.y.toFixed(3)} A ${R} ${R} 0 0 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
};
const phaseArcs = [0, 1, 2].map((p) => arcPath(120 * p, 120 * (p + 1)));

const stations = lanes.flatMap((lane, l) => lane.stations.map((station, k) => ({ ...station, lane: l, k, idx: l * 5 + k })));
const TOTAL = stations.length;
const channels: Channel[] = ["whatsapp", "instagram", "site"];

const leadMessages: Record<Channel, string> = {
  whatsapp: "Oi! Vi o anúncio. Tem horário?",
  instagram: "Quanto custa o procedimento?",
  site: "Quero agendar uma avaliação",
};

const channelMeta: Record<Channel, { label: string; src: string }> = {
  whatsapp: { label: "WhatsApp", src: "/assets/hero/icons/WhatsApp_icon.png" },
  instagram: { label: "Instagram", src: "/assets/hero/icons/Instagram_icon.png" },
  site: { label: "Nya, assistente do site", src: "/assets/brand/nya.webp" },
};

// ---------------------------------------------------------------- timeline (ms)
// One station every STEP (3.5 s): parked for DWELL so it can be read, then the light packet glides to the next one.
const DWELL = 2700; // time a station stays still on screen
const TRAVEL = 800; // the packet's glide between two stations (nothing else changes meanwhile)
const WORK = 800; // "working" state right after the packet arrives; the result chip then holds
const STEP = DWELL + TRAVEL;
const INTRO = DWELL + TRAVEL; // the incoming message is parked for DWELL too
const reach = (i: number) => INTRO + i * STEP;
const doneAt = (i: number) => reach(i) + WORK;
const END = reach(TOTAL - 1) + STEP; // last station parks for DWELL, the closing glide runs, then the final text
const LOOP = END + 5000;
const ENTRY_MS = 1200;

type Segment = { id: string; at: number; dur: number; kind: "in" | "arc"; from: number; to: number };
const segments: Segment[] = [
  { id: "in", at: 900, dur: 800, kind: "in", from: 0, to: 0 },
  { id: "arc-start", at: INTRO - TRAVEL, dur: TRAVEL, kind: "arc", from: 0, to: nodeAngle(0) },
];
for (let i = 0; i < TOTAL - 1; i += 1) {
  segments.push({ id: `arc-${i}`, at: reach(i + 1) - TRAVEL, dur: TRAVEL, kind: "arc", from: nodeAngle(i), to: nodeAngle(i + 1) });
}
segments.push({ id: "arc-end", at: END - TRAVEL, dur: TRAVEL, kind: "arc", from: nodeAngle(TOTAL - 1), to: 360 });

type StationState = "idle" | "working" | "done";

type Snap = {
  loop: number;
  states: StationState[];
  current: number; // last reached station, -1 before the first
  phase: number; // 0 intro, 1..3 phases, 4 end
  progress: number;
  active: string[];
  revenue: number;
  bubble: boolean;
  hubPulse: boolean;
};

function snapAt(e: number, loop: number): Snap {
  const states: StationState[] = stations.map((_, i) => (e < reach(i) ? "idle" : e < doneAt(i) ? "working" : "done"));
  let current = -1;
  states.forEach((state, i) => {
    if (state !== "idle") current = i;
  });
  const phase = e >= END ? 4 : current >= 0 ? stations[current].lane + 1 : 0;
  // The ring fills together with the packet's glide, so it leads the station state by TRAVEL.
  let lead = -1;
  stations.forEach((_, i) => {
    if (e + TRAVEL >= reach(i)) lead = i;
  });
  const progress = e + TRAVEL >= END ? 1 : lead < 0 ? 0 : nodeAngle(lead) / 360;
  const active = segments.filter((segment) => e >= segment.at && e < segment.at + segment.dur).map((segment) => segment.id);
  const revenue = e >= doneAt(TOTAL - 1) ? 1530 : e >= doneAt(4) ? 890 : 0;
  return {
    loop,
    states,
    current,
    phase,
    progress,
    active,
    revenue,
    bubble: e >= 0 && e < INTRO,
    hubPulse: e >= 1700 && e < 2700,
  };
}

const FINAL_SNAP = snapAt(LOOP - 200, 0);

function useJourneyClock(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [snap, setSnap] = useState<Snap>(() => snapAt(-1, 0));
  const inView = useInView(rootRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  const elapsed = useRef(-ENTRY_MS);
  const loop = useRef(0);
  const wasVisible = useRef(true);
  const lastKey = useRef("");

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    if (!enabled) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;

      // The story rewinds when the slide is fully hidden and only runs once it has settled (not while it fades).
      const phase = slidePhase(rootRef.current);
      if (phase === "hidden") {
        wasVisible.current = false;
        return;
      }
      if (phase === "fading") return;
      if (!wasVisible.current) {
        wasVisible.current = true;
        elapsed.current = -ENTRY_MS;
        loop.current = 0;
      }
      if (!inViewRef.current || document.hidden) return;

      elapsed.current += dt;
      if (elapsed.current >= LOOP) {
        elapsed.current -= LOOP;
        loop.current += 1;
      }
      const next = snapAt(elapsed.current, loop.current);
      const key = JSON.stringify([next.loop, next.states, next.phase, next.progress, next.active, next.revenue, next.bubble, next.hubPulse]);
      if (key !== lastKey.current) {
        lastKey.current = key;
        setSnap(next);
      }
    }, 60);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return snap;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Dots() {
  return (
    <span className="jr-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/** A light packet orbiting the ring. The angle is written straight to the DOM (no re-render per frame). */
function ArcPacket({ from, to, duration }: { from: number; to: number; duration: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.4, 0, 0.3, 1],
      onUpdate: (angle) => {
        node.style.transform = `rotate(${angle}deg)`;
        const t = (angle - from) / (to - from || 1);
        node.style.opacity = String(Math.min(1, t / 0.15, (1 - t) / 0.15));
      },
    });
    return () => controls.stop();
  }, [from, to, duration]);

  return (
    <div className="jr-orbit" ref={ref} style={{ opacity: 0 }}>
      <span className="jr-dot" />
    </div>
  );
}

/** The message dropping from the channels into the Its Time hub. */
function EntryPacket({ duration }: { duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(-3, 22, {
      duration,
      ease: [0.4, 0, 0.3, 1],
      onUpdate: (top) => {
        node.style.top = `${top}%`;
        const t = (top + 3) / 25;
        node.style.opacity = String(Math.min(1, t / 0.15, (1 - t) / 0.15));
      },
    });
    return () => controls.stop();
  }, [duration]);

  return <span className="jr-dot jr-dot--entry" ref={ref} style={{ opacity: 0 }} />;
}

const chipFor = (state: StationState, station: (typeof stations)[number]) =>
  state === "done" ? station.done : state === "working" ? station.working : station.idle;

export function CustomerJourney() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const live = useJourneyClock(rootRef, !reduce);
  const [hover, setHover] = useState<number | null>(null);

  const snap = reduce ? FINAL_SNAP : live;
  const channel = channels[snap.loop % channels.length];
  const hidden = reduce ? false : "hidden";

  const shown = hover ?? (snap.current >= 0 && snap.phase !== 4 ? snap.current : null);
  const station = shown !== null ? stations[shown] : null;
  const stationState: StationState = shown !== null ? snap.states[shown] : "idle";

  const center = station
    ? {
        key: `s-${station.id}-${stationState === "idle" ? "i" : "a"}`,
        eyebrow: `${station.lane + 1} · ${lanes[station.lane].title}`,
        title: station.name,
        chip: hover !== null && stationState === "idle" ? station.idle : chipFor(stationState, station),
        working: hover === null && stationState === "working",
        text: station.description,
      }
    : snap.phase === 4
      ? {
          key: "end",
          eyebrow: "Ciclo completo",
          title: "O cliente voltou",
          chip: "Receita gerada ✓",
          working: false,
          text: "Atendido, organizado e de volta à agenda, sem ninguém precisar lembrar de fazer nada.",
        }
      : {
          key: "intro",
          eyebrow: "Its Time IA",
          title: "Nova mensagem",
          chip: channelMeta[channel].label,
          working: false,
          text: leadMessages[channel],
        };

  return (
    <div className="jr" ref={rootRef} data-reduced={reduce}>
      <motion.div
        className="jr-stage"
        initial={hidden}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseLeave={() => setHover(null)}
      >
        <div className="jr-ring" data-complete={snap.phase === 4}>
          {/* Ring: three phase arcs + the progress that closes the cycle */}
          <svg className="jr-ring-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="jr-ring-gradient" gradientUnits="userSpaceOnUse" x1="50" y1={50 - R} x2="50" y2={50 + R}>
                <stop offset="0" stopColor="#ff5a1f" />
                <stop offset="1" stopColor="#ff4d6d" />
              </linearGradient>
            </defs>
            <circle className="jr-track" cx="50" cy="50" r={R} />
            {phaseArcs.map((d, p) => (
              <path className="jr-arc" data-state={snap.phase === p + 1 ? "active" : snap.phase > p + 1 ? "done" : "idle"} d={d} key={d} />
            ))}
            {/* Two halves so each one takes the vertical gradient: orange at 12 o'clock, pink at 6 o'clock */}
            <path
              className="jr-progress"
              d={`M50 ${50 - R} A${R} ${R} 0 0 1 50 ${50 + R}`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - clamp01(snap.progress * 2)}
            />
            <path
              className="jr-progress"
              d={`M50 ${50 + R} A${R} ${R} 0 0 1 50 ${50 - R}`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - clamp01(snap.progress * 2 - 1)}
            />
          </svg>

          {/* Entry: channels -> Its Time */}
          <div className="jr-entry" aria-label="Canais">
            <motion.div
              className="jr-entry-pill"
              variants={{
                hidden: { opacity: 0, y: -8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05, ease: EASE } },
              }}
            >
              {channels.map((item) => (
                <span className="jr-channel" data-channel={item} data-active={channel === item && snap.bubble} key={item}>
                  <Image src={channelMeta[item].src} alt={channelMeta[item].label} width={64} height={64} sizes="40px" />
                </span>
              ))}
            </motion.div>
          </div>
          <motion.span
            className="jr-entry-line"
            data-active={snap.bubble}
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              show: { scaleY: 1, opacity: 1, transition: { duration: 0.45, delay: 0.25, ease: EASE } },
            }}
          />

          {/* Hub */}
          <div className="jr-hub" data-pulse={snap.hubPulse} data-required-element="journey-hub">
            <motion.div
              className="jr-hub-inner"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.15, ease: EASE } },
              }}
            >
              <span className="jr-hub-ring" aria-hidden="true" />
              <span className="jr-hub-core">
                <Image src="/assets/brand/its-time-mark-transparent-clean.png" alt="Its Time IA" width={48} height={50} sizes="48px" />
              </span>
            </motion.div>
          </div>

          {/* Center: what is happening now + what this customer has generated */}
          <div className="jr-center" aria-live="polite" data-required-element="journey-now">
            <motion.div
              className="jr-center-inner"
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.6, ease: EASE } },
              }}
            >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="jr-now"
                key={center.key}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <span className="jr-eyebrow">{center.eyebrow}</span>
                <strong className="jr-title">{center.title}</strong>
                <span className="jr-chip" data-working={center.working}>
                  {center.chip}
                  {center.working ? <Dots /> : null}
                </span>
                <p className="jr-text">{center.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="jr-revenue">
              <small>Receita deste cliente</small>
              <strong>
                <Count value={snap.revenue} format={(v) => `R$ ${Math.round(v).toLocaleString("pt-BR")}`} reduce={reduce} duration={0.9} />
              </strong>
            </div>
          </motion.div>
          </div>

          {/* Phase labels (desktop) */}
          {lanes.map((lane, l) => {
            const pos = polar(60 + 120 * l, 53);
            return (
              <span
                className="jr-phase"
                data-side={Math.abs(pos.x - 50) < 1 ? "bottom" : pos.x > 50 ? "right" : "left"}
                data-state={snap.phase === l + 1 ? "active" : snap.phase > l + 1 || snap.phase === 4 ? "done" : "idle"}
                key={lane.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.span
                  className="jr-phase-pill"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { duration: 0.5, delay: 0.5 + l * 0.1 } },
                  }}
                >
                  <span className="jr-phase-head">
                    <i>{`0${l + 1}`}</i>
                    <b>{lane.title}</b>
                  </span>
                  {/* one tick per station of the phase: fills with the brand gradient as each one finishes */}
                  <span className="jr-phase-meter" aria-hidden="true">
                    {lane.stations.map((item, k) => (
                      <em data-state={snap.states[l * 5 + k]} key={item.id} />
                    ))}
                  </span>
                </motion.span>
              </span>
            );
          })}

          {/* Nodes */}
          {stations.map((item) => {
            const state = snap.states[item.idx];
            const angle = nodeAngle(item.idx);
            const pos = polar(angle);
            // 0 at the top (orange) -> 1 at the bottom (pink): each tile takes its slice of the brand gradient
            const tone = (1 - Math.cos((angle * Math.PI) / 180)) / 2;
            return (
              <div
                className="jr-node"
                data-state={state}
                data-hover={hover === item.idx}
                key={item.id}
                tabIndex={0}
                role="img"
                aria-label={`${lanes[item.lane].title}: ${item.name}. ${item.description}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, "--jr-t": tone.toFixed(3) } as CSSProperties}
                onMouseEnter={() => setHover(item.idx)}
                onFocus={() => setHover(item.idx)}
                onBlur={() => setHover(null)}
              >
                <motion.span
                  className="jr-tile"
                  variants={{
                    hidden: { opacity: 0, scale: 0.7 },
                    show: { opacity: 1, scale: 1, transition: { duration: 0.35, delay: 0.7 + item.idx * 0.035, ease: EASE } },
                  }}
                >
                  <span className="jr-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                </motion.span>
              </div>
            );
          })}

          {/* Packets */}
          {!reduce ? (
            <>
              {snap.active.includes("in") ? <EntryPacket key={`${snap.loop}-in`} duration={0.8} /> : null}
              {segments
                .filter((segment) => segment.kind === "arc" && snap.active.includes(segment.id))
                .map((segment) => (
                  <ArcPacket key={`${snap.loop}-${segment.id}`} from={segment.from} to={segment.to} duration={segment.dur / 1000} />
                ))}
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
