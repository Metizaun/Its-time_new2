"use client";

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Bell, CalendarCheck, Check, Clock, HeartHandshake, Hourglass, QrCode, RotateCcw, Send } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { slidePhase } from "./slidePhase";

// One full trip across the track. Every card is offset by an equal slice so the lane
// always looks "in production" and the counters can be driven by the same clock.
const LOOP_S = 26;
const COUNT = 4;

type Item = { name: string; detail: string; amount?: number };
type Face = { label: string; icon: ReactNode };

type Lane = {
  id: "cobranca" | "agenda";
  title: string;
  benefits: string[];
  stations: Array<{ label: string; sub: string }>;
  faces: Face[];
  items: Item[];
  phase: number;
};

// Each station says what the AI does (title) and what the client gains (sub, prefixed with "+" in CSS).
const lanes: Lane[] = [
  {
    id: "cobranca",
    title: "Cobrança",
    benefits: ["Menos inadimplência", "Pix em um toque", "Equipe só valida"],
    stations: [
      { label: "Vigia os vencimentos", sub: "Ninguém esquecido" },
      { label: "Lembra no WhatsApp", sub: "Sem constrangimento" },
      { label: "Envia o Pix", sub: "Pagar em um toque" },
      { label: "Recebe o comprovante", sub: "Você só confere" },
      { label: "Equipe confirma", sub: "Dinheiro no caixa" },
    ],
    faces: [
      { label: "A vencer", icon: <Clock aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Lembrete enviado", icon: <Send aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Pix enviado", icon: <QrCode aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Em validação", icon: <Hourglass aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Confirmado", icon: <Check aria-hidden="true" strokeWidth={2.8} /> },
    ],
    items: [
      { name: "Marcos R.", detail: "Mensalidade", amount: 480 },
      { name: "Camila S.", detail: "Parcela 3/6", amount: 1250 },
      { name: "Pedro L.", detail: "Consulta", amount: 320 },
      { name: "Juliana A.", detail: "Tratamento", amount: 890 },
    ],
    phase: 0,
  },
  {
    id: "agenda",
    title: "Acompanhamento",
    benefits: ["Mais retornos", "Clientes bem cuidados", "Zero acompanhamento manual"],
    stations: [
      { label: "Vigia a agenda", sub: "Nada se perde" },
      { label: "Lembra e confirma", sub: "Cliente chega preparado" },
      { label: "Cuida no pós-consulta", sub: "Cliente se sente cuidado" },
      { label: "Chama quem sumiu", sub: "Reativação sem esforço" },
      { label: "Agenda o retorno", sub: "Agenda cheia e em dia" },
    ],
    faces: [
      { label: "Consulta marcada", icon: <CalendarCheck aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Lembrete enviado", icon: <Bell aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Pós-consulta", icon: <HeartHandshake aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Reativação enviada", icon: <RotateCcw aria-hidden="true" strokeWidth={2.2} /> },
      { label: "Retorno agendado", icon: <Check aria-hidden="true" strokeWidth={2.8} /> },
    ],
    items: [
      { name: "Beatriz M.", detail: "Qui 15:00 · Dra. Paula" },
      { name: "Henrique D.", detail: "Sex 09:30 · Dr. André" },
      { name: "Fernanda K.", detail: "Seg 14:00 · Dra. Paula" },
      { name: "Lucas V.", detail: "Ter 16:30 · Dr. André" },
    ],
    phase: 0.125,
  },
];

const sofiaSays = [
  { tag: "Lembrete", text: "Oi, Marcos! Sua mensalidade de R$ 480 vence amanhã. Segue o Pix para facilitar 👇" },
  { tag: "Pós-consulta", text: "Oi, Henrique! Como foi a sua consulta ontem? Qualquer dúvida, estou por aqui 😊" },
  { tag: "Comprovante", text: "Recebi o comprovante! Já enviei para a equipe validar e te aviso em seguida." },
  { tag: "Reativação", text: "Oi, Beatriz! Faz um tempo desde a sua última visita. Que tal agendar o retorno? Tenho quinta às 15h." },
  { tag: "Confirmação", text: "A equipe confirmou o seu pagamento ✓ Obrigada, Camila! Qualquer coisa é só chamar." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Counter({ value, prefix }: { value: number; prefix?: "brl" }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (latest) => setShown(Math.round(latest)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value]);

  return <>{prefix === "brl" ? brl(shown) : shown}</>;
}

function SofiaLine({ tag, text, reduce }: { tag: string; text: string; reduce: boolean }) {
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <b>{tag}</b>
      {/* she "types" for a beat, then the message writes itself */}
      {reduce ? null : (
        <span className="cc-say-dots" aria-hidden="true">
          <span className="cc-dots">
            <i />
            <i />
            <i />
          </span>
        </span>
      )}
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, delay: 0.55 + index * 0.03 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function CashFlow() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25 });
  const [slideVisible, setSlideVisible] = useState(true);
  const [received, setReceived] = useState(12400);
  const [rescheduled, setRescheduled] = useState(8);
  const [said, setSaid] = useState(0);

  const live = inView && slideVisible && !reduce;

  useEffect(() => {
    const check = () => {
      setSlideVisible(slidePhase(rootRef.current) === "active");
    };
    check();
    const id = window.setInterval(check, 300);
    return () => window.clearInterval(id);
  }, []);

  // Counters follow the exact same clock as the CSS cards (both pause together).
  const clock = useRef(0);
  const liveRef = useRef(live);
  useEffect(() => {
    liveRef.current = live;
  }, [live]);

  useEffect(() => {
    if (reduce) return;
    const tick = 100;
    const arrivalsA: number[] = [];
    const arrivalsB: number[] = [];
    // A card turns "Recebido" at 87.5% of its trip. Lane A's first lands at .125 loops
    // (every quarter loop after that); lane B starts half a step later and has one on screen at t=0.
    for (let k = 0; k < 400; k += 1) arrivalsA.push((0.125 + k * 0.25) * LOOP_S * 1000);
    for (let k = 1; k < 400; k += 1) arrivalsB.push(k * 0.25 * LOOP_S * 1000);
    let a = 0;
    let b = 0;

    const id = window.setInterval(() => {
      if (!liveRef.current) return;
      clock.current += tick;

      while (clock.current >= arrivalsA[a]) {
        const items = lanes[0].items;
        const card = (((COUNT - 1 - a) % COUNT) + COUNT) % COUNT;
        setReceived((value) => value + (items[card].amount ?? 0));
        setSaid((value) => (value + 1) % sofiaSays.length);
        a += 1;
      }
      while (clock.current >= arrivalsB[b]) {
        setRescheduled((value) => value + 1);
        b += 1;
      }
    }, tick);

    return () => window.clearInterval(id);
  }, [reduce]);

  const message = sofiaSays[said];

  return (
    <div
      className="cc"
      ref={rootRef}
      data-live={live ? "true" : "false"}
      data-reduced={reduce}
      data-required-element="cc-lanes"
      style={{ "--D": `${LOOP_S}s` } as CSSProperties}
    >
      <div className="cc-stage">
        {/* Live counters + what Sofia is saying right now */}
        <div className="cc-top">
          <div className="cc-kpi">
            <small>Recebido hoje</small>
            <strong>
              <Counter value={received} prefix="brl" />
            </strong>
            {/* lights up each time the number moves */}
            <span className="cc-kpi-bar" aria-hidden="true">
              <i key={received} />
            </span>
          </div>

          <div className="cc-say" aria-live="polite">
            <span className="cc-say-who">
              <b>Sofia</b>
              <i aria-hidden="true">·</i>
              <em>agora</em>
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <SofiaLine key={message.tag} tag={message.tag} text={message.text} reduce={reduce} />
            </AnimatePresence>
          </div>

          <div className="cc-kpi cc-kpi--right">
            <small>Retornos agendados</small>
            <strong>
              <Counter value={rescheduled} />
            </strong>
            <span className="cc-kpi-bar" aria-hidden="true">
              <i key={rescheduled} />
            </span>
          </div>
        </div>

        {/* Lanes: the Its Time gate sits between them, on the line every card leaves from */}
        <div className="cc-lanes">
          {lanes.map((lane) => (
            <section className="cc-lane" data-lane={lane.id} key={lane.id} aria-label={`Esteira de ${lane.title}`}>
              <header className="cc-lane-head">
                <div className="cc-rail">
                  <h3>{lane.title}</h3>
                </div>
                <ol className="cc-stations">
                  {lane.stations.map((station, index) => (
                    <li key={station.label} style={{ "--k": index / 4 } as CSSProperties}>
                      <i>{`0${index + 1}`}</i>
                      <strong>{station.label}</strong>
                      <small>{station.sub}</small>
                    </li>
                  ))}
                </ol>
              </header>

              <div className="cc-body">
                <div className="cc-sources" aria-label="Benefícios">
                  <small>Você ganha</small>
                  <ul>
                    {lane.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="cc-track">
                  <span className="cc-line" aria-hidden="true" />
                  {lane.items.map((item, index) => {
                    const staticP = [0.06, 0.36, 0.64, 0.94][index];
                    const face = [0.125, 0.375, 0.625, 0.875].filter((edge) => staticP > edge).length;
                    return (
                      <article
                        className="cc-item"
                        key={item.name}
                        data-face={face}
                        style={
                          {
                            "--delay": `calc(var(--D) * ${-(index / COUNT + lane.phase)})`,
                            "--static": staticP,
                          } as CSSProperties
                        }
                      >
                        <span className="cc-avatar" aria-hidden="true">
                          {item.name[0]}
                        </span>
                        <span className="cc-main">
                          <strong>{item.name}</strong>
                          <small>
                            {item.detail}
                            {item.amount ? ` · ${brl(item.amount)}` : ""}
                          </small>
                        </span>
                        <span className="cc-faces" aria-hidden="true">
                          {lane.faces.map((face) => (
                            <i key={face.label}>
                              {face.icon}
                              {face.label}
                            </i>
                          ))}
                        </span>
                        <span className="cc-progress" aria-hidden="true" />
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          <span className="cc-bus" aria-hidden="true" />
          <div className="cc-hub" data-required-element="cc-hub">
            <span className="cc-hub-ring" aria-hidden="true" />
            <span className="cc-hub-core">
              <Image
                src="/assets/brand/its-time-mark-transparent-clean.png"
                alt="Its Time IA"
                width={48}
                height={50}
                sizes="40px"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
