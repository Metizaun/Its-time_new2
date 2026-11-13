"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Check, Lock, UserRound } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { InstagramGlyph } from "./glyphs";

/** The conversation of each step. Times are the example clock of the journey; no prices are shown. */
type Item =
  | { from: "lead" | "ai"; kind: "text"; text: string; time: string }
  | { from: "lead"; kind: "rx" | "selfie"; text: string; time: string }
  | { from: "ai"; kind: "rxSummary" | "frame" | "tryon" | "quote" | "slots"; text: string; time: string }
  | { from: "system"; kind: "divider" | "handoff"; text: string };

export const photos = {
  before: "/assets/visagism/selfie-sem-oculos.webp",
  after: "/assets/visagism/selfie-com-oculos.webp",
  frame: "/assets/visagism/armacao-rose-gold.webp",
} as const;

export const conversations: Item[][] = [
  [
    { from: "system", kind: "divider", text: "A loja fechou às 19h · a IA atende" },
    { from: "lead", kind: "text", text: "Oi! Quanto custa uma lente?", time: "22:12" },
    { from: "ai", kind: "text", text: "Oi! Te ajudo agora 😊 É para óculos de grau ou de sol?", time: "22:12" },
    { from: "lead", kind: "text", text: "De grau. Tenho a receita aqui.", time: "22:13" },
    { from: "ai", kind: "text", text: "Ótimo! Me manda uma foto da receita que eu já separo as opções para você.", time: "22:13" },
  ],
  [
    { from: "lead", kind: "rx", text: "Minha receita 📄", time: "22:14" },
    { from: "ai", kind: "rxSummary", text: "Recebi! Este é o resumo da sua receita:", time: "22:14" },
    { from: "ai", kind: "text", text: "Se algo não bater com o papel, é só me avisar.", time: "22:14" },
  ],
  [
    { from: "ai", kind: "text", text: "Quer ver que armação combina com você? Me manda uma selfie de frente.", time: "22:16" },
    { from: "lead", kind: "selfie", text: "Aqui! 😊", time: "22:17" },
    { from: "ai", kind: "frame", text: "Seu rosto é oval. Este gatinho em rose gold combina:", time: "22:17" },
    { from: "ai", kind: "tryon", text: "Olha como fica em você 👇", time: "22:17" },
  ],
  [
    { from: "lead", kind: "text", text: "Amei! Quanto fica com a lente?", time: "22:19" },
    { from: "ai", kind: "quote", text: "Aqui está o seu orçamento, pela tabela da loja:", time: "22:20" },
    { from: "lead", kind: "text", text: "Tem desconto à vista?", time: "22:21" },
    {
      from: "ai",
      kind: "text",
      text: "Essa condição quem libera é o vendedor. Já deixei tudo anotado e ele te responde amanhã cedo 👍",
      time: "22:21",
    },
    { from: "system", kind: "handoff", text: "Encaminhado ao vendedor · receita e orçamento na conversa" },
  ],
  [
    { from: "ai", kind: "slots", text: "Quer provar a armação e fazer o exame na loja? Horários livres na Loja Centro:", time: "22:22" },
    { from: "lead", kind: "text", text: "Quinta às 10h30!", time: "22:23" },
    { from: "ai", kind: "text", text: "Marcado ✓ Quinta, 10h30, Loja Centro. Te lembro 1 hora antes.", time: "22:23" },
    { from: "system", kind: "divider", text: "Quinta · 9h30 · 1 h antes" },
    { from: "ai", kind: "text", text: "Bom dia, Marina! Sua visita é hoje às 10h30. Te esperamos 😊", time: "09:30" },
  ],
  [
    { from: "system", kind: "divider", text: "Quinta · 11h · depois da visita" },
    { from: "lead", kind: "text", text: "Gostei de tudo! Vou pensar e te aviso.", time: "11:02" },
    { from: "system", kind: "divider", text: "+2 h · lembrança" },
    { from: "ai", kind: "text", text: "Oi, Marina! Ficou alguma dúvida sobre a armação rose gold? Posso tirar agora.", time: "13:02" },
    { from: "system", kind: "divider", text: "+4 h · reforço" },
    {
      from: "ai",
      kind: "text",
      text: "Marina, o parcelamento que conversamos vale até sábado. Quer que eu chame o vendedor?",
      time: "17:02",
    },
    { from: "lead", kind: "text", text: "Quero sim, pode chamar!", time: "17:10" },
    { from: "system", kind: "handoff", text: "Sequência parada · o vendedor assumiu" },
  ],
];

export const EASE = [0.22, 1, 0.36, 1] as const;
const TYPING_MS = 750;

/** When each item lands, in ms after the scene starts. AI messages are preceded by a short "digitando". */
function schedule(items: Item[]) {
  let at = 350;
  return items.map((item, index) => {
    if (index > 0) {
      const previous = items[index - 1];
      const media = previous.kind !== "text" && previous.kind !== "divider" && previous.kind !== "handoff";
      at += item.from === "ai" ? 1150 + TYPING_MS * 0.4 : item.from === "system" ? 800 : 1000;
      if (media) at += 900;
    }
    return at;
  });
}

/** Plays a list of items one by one while `playing`; with reduced motion everything is simply there. */
export function useSequence(items: Item[], playing: boolean, reduce: boolean) {
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduce || !playing) return;
    const times = schedule(items);
    const timers: number[] = [];
    times.forEach((at, index) => {
      if (items[index].from === "ai") {
        timers.push(window.setTimeout(() => setTyping(true), Math.max(0, at - TYPING_MS)));
      }
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setCount(index + 1);
        }, at),
      );
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [items, playing, reduce]);

  return reduce ? { count: items.length, typing: false } : { count, typing };
}

function Dots() {
  return (
    <span className="otc-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Media({ item, reduce }: { item: Item; reduce: boolean }) {
  switch (item.kind) {
    case "rx":
      return (
        <div className="otc-rx" aria-label="Foto da receita">
          <b>Receita · lentes de grau</b>
          <span className="otc-rx-head">
            <i />
            <i>Esf.</i>
            <i>Cil.</i>
            <i>Eixo</i>
          </span>
          <span>
            <i>OD</i>
            <i>−1,50</i>
            <i>−0,50</i>
            <i>180°</i>
          </span>
          <span>
            <i>OE</i>
            <i>−1,25</i>
            <i>−0,25</i>
            <i>170°</i>
          </span>
          <em className="otc-rx-sign" aria-hidden="true" />
          {reduce ? null : <span className="otc-rx-scan" aria-hidden="true" />}
        </div>
      );
    case "rxSummary":
      return (
        <dl className="otc-rx-summary">
          {[
            ["Olho direito", "−1,50", "−0,50", "180°"],
            ["Olho esquerdo", "−1,25", "−0,25", "170°"],
          ].map(([eye, sph, cyl, axis], index) => (
            <div key={eye} style={{ animationDelay: `${index * 180}ms` }}>
              <dt>{eye}</dt>
              <dd>
                <span>
                  <small>esf.</small>
                  {sph}
                </span>
                <span>
                  <small>cil.</small>
                  {cyl}
                </span>
                <span>
                  <small>eixo</small>
                  {axis}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      );
    case "selfie":
      return (
        <div className="otc-photo otc-photo--selfie">
          <Image src={photos.before} alt="Selfie da cliente" fill sizes="170px" />
          <svg className="otc-face" viewBox="0 0 100 120" aria-hidden="true">
            <ellipse cx="58" cy="47" rx="19" ry="26" pathLength={1} />
          </svg>
          <span className="otc-face-label">Oval</span>
        </div>
      );
    case "frame":
      return (
        <div className="otc-frame">
          <Image src={photos.frame} alt="Armação gatinho em metal rose gold" width={1000} height={367} sizes="200px" />
        </div>
      );
    case "tryon":
      return (
        <div className="otc-photo otc-photo--tryon">
          <Image className="otc-tryon-before" src={photos.before} alt="" fill sizes="170px" />
          <Image className="otc-tryon-after" src={photos.after} alt="Cliente com a armação indicada" fill sizes="170px" />
          {reduce ? null : <span className="otc-wipe" aria-hidden="true" />}
        </div>
      );
    case "quote":
      return (
        <div className="otc-quote">
          <header>
            <b>Orçamento · Marina</b>
            <small>Loja Centro</small>
          </header>
          {[
            ["Armação gatinho rose gold", "catálogo"],
            ["Lente visão simples", "pelo seu grau"],
            ["Antirreflexo", "tratamento cadastrado"],
            ["Parcelamento", "como a loja definiu"],
          ].map(([line, source], index) => (
            <span className="otc-quote-line" key={line} style={{ animationDelay: `${180 + index * 160}ms` }}>
              <Check strokeWidth={2.6} aria-hidden="true" />
              <span>{line}</span>
              <small>{source}</small>
            </span>
          ))}
          <footer>
            <span>Valores da tabela da sua ótica</span>
            <span className="otc-quote-lock">
              <Lock strokeWidth={2.2} aria-hidden="true" />
              Desconto extra só com o vendedor
            </span>
          </footer>
        </div>
      );
    case "slots":
      return (
        <div className="otc-slots" role="group" aria-label="Horários livres">
          {["Qui · 10h30", "Qui · 15h00", "Sex · 9h00"].map((slot, index) => (
            <span className="otc-slot" data-picked={index === 0} key={slot}>
              <CalendarCheck strokeWidth={2.1} aria-hidden="true" />
              {slot}
            </span>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function Bubble({ item, reduce }: { item: Item; reduce: boolean }) {
  const motionProps = {
    layout: "position" as const,
    initial: reduce ? false : { opacity: 0, y: 12, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.42, ease: EASE, layout: { duration: 0.45, ease: EASE } },
  };

  if (item.from === "system") {
    return (
      <motion.div className={`otc-sys otc-sys--${item.kind}`} {...motionProps}>
        <span>
          {item.kind === "handoff" ? <UserRound strokeWidth={2.2} aria-hidden="true" /> : null}
          {item.text}
        </span>
      </motion.div>
    );
  }

  const mine = item.from === "lead";
  const media = item.kind !== "text";
  return (
    <motion.div className="otc-row" data-mine={mine} {...motionProps}>
      <div className="otc-bubble" data-mine={mine} data-kind={item.kind} data-media={media}>
        {media && mine ? <Media item={item} reduce={reduce} /> : null}
        <p>
          {item.text}
          <small>
            {item.time}
            {mine ? " ✓✓" : ""}
          </small>
        </p>
        {media && !mine ? <Media item={item} reduce={reduce} /> : null}
      </div>
    </motion.div>
  );
}

/** One step's conversation, playing message by message. */
export function ChatScene({ step, playing, reduce }: { step: number; playing: boolean; reduce: boolean }) {
  const items = conversations[step];
  const { count, typing } = useSequence(items, playing, reduce);

  return (
    <div className="otc-flow" aria-live="polite">
      <LayoutGroup>
        {items.slice(0, count).map((item, index) => (
          <Bubble item={item} reduce={reduce} key={`${step}-${index}`} />
        ))}
        <AnimatePresence>
          {typing ? (
            <motion.div
              className="otc-row"
              data-mine="false"
              key="typing"
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <div className="otc-bubble otc-bubble--typing" data-mine="false" aria-label="A IA está digitando">
                <Dots />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

type Lead = { id: string; name: string; status: string; hot?: boolean };

const board: Array<{ store: string; leads: Lead[] }> = [
  {
    store: "Loja Centro",
    leads: [
      { id: "marina", name: "Marina S.", status: "Venda · com vendedor", hot: true },
      { id: "carlos", name: "Carlos M.", status: "Orçamento" },
    ],
  },
  { store: "Loja Shopping", leads: [{ id: "julia", name: "Júlia R.", status: "Visita marcada" }] },
  { store: "Loja Bairro", leads: [{ id: "ana", name: "Ana P.", status: "Atendimento" }] },
];

function LeadCard({ lead, children }: { lead: Lead; children?: ReactNode }) {
  return (
    <motion.div className="otc-lead" data-hot={Boolean(lead.hot)} layoutId={`lead-${lead.id}`} transition={{ duration: 0.7, ease: EASE }}>
      <span className="otc-mono">{lead.name.slice(0, 1)}</span>
      <span>
        <b>{lead.name}</b>
        <small>{lead.status}</small>
      </span>
      {children}
    </motion.div>
  );
}

/** Step 7: a message from Instagram reaches the wrong door and is routed to the store that should answer it. */
export function StoresBoard({ playing, reduce }: { playing: boolean; reduce: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduce || !playing) return;
    const timers = [window.setTimeout(() => setPhase(1), 900), window.setTimeout(() => setPhase(2), 2600)];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [playing, reduce]);

  const routed = reduce || phase >= 2;
  const arrived = reduce || phase >= 1;
  const pedro: Lead = { id: "pedro", name: "Pedro L.", status: routed ? "Atendimento · Instagram" : "“Vocês têm loja no shopping?”" };

  return (
    <div className="otc-board">
      <header className="otc-board-head">
        <span>
          <b>Todas as lojas</b>
          <small>Visão do dono</small>
        </span>
        <span className="otc-board-note">
          <Lock strokeWidth={2.2} aria-hidden="true" />
          Cada equipe vê só a sua loja
        </span>
      </header>
      <LayoutGroup>
        <div className="otc-board-inbox">
          <span className="otc-board-label">Entrada · 4 canais</span>
          <AnimatePresence>
            {arrived && !routed ? (
              <LeadCard lead={pedro}>
                <i className="otc-lead-channel" aria-hidden="true">
                  <InstagramGlyph />
                </i>
              </LeadCard>
            ) : null}
          </AnimatePresence>
          {routed ? (
            <motion.span
              className="otc-board-route"
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ArrowRight strokeWidth={2.4} aria-hidden="true" />
              Pedro foi para a Loja Shopping, a unidade certa
            </motion.span>
          ) : null}
        </div>
        <div className="otc-board-columns">
          {board.map((column) => (
            <section className="otc-board-col" key={column.store} data-target={column.store === "Loja Shopping" && arrived && !routed}>
              <h4>{column.store}</h4>
              {column.store === "Loja Shopping" && routed ? (
                <LeadCard lead={pedro}>
                  <i className="otc-lead-channel" aria-hidden="true">
                    <InstagramGlyph />
                  </i>
                </LeadCard>
              ) : null}
              {column.leads.map((lead) => (
                <LeadCard lead={lead} key={lead.id} />
              ))}
            </section>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
