"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { opticsJourney } from "@/lib/solutions/oticas";
import { AgentBotGlyph } from "@/components/FeatureSlides/AgentIcons";
import { AXIS, AxisScale, axisPoint } from "./glyphs";
import { ChatScene, EASE, StoresBoard, photos } from "./JourneyScenes";

const COMPACT = "(max-width: 980px)";
const LAST = opticsJourney.length - 1;
const pipeline = ["Novo", "Atendimento", "Orçamento", "Agendado", "Venda"];
// Pipeline stage reached at each step of the journey.
const stageAt = [1, 1, 1, 2, 3, 4, 4];

function subscribe(callback: () => void) {
  const query = window.matchMedia(COMPACT);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useCompact() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COMPACT).matches,
    () => false,
  );
}

export function JourneyStage() {
  const reduce = useReducedMotion() ?? false;
  const compact = useCompact();

  // Warm the cache so the photos land together with their bubble.
  useEffect(() => {
    Object.values(photos).forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  return compact ? <CompactScenes reduce={reduce} /> : <StickyStage reduce={reduce} />;
}

/* ───────────── desktop: one sticky stage driven by the scroll ───────────── */

function StickyStage({ reduce }: { reduce: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGLineElement>(null);
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 120, damping: 24, mass: 0.6 });

  // The needle sweeps the TABO scale: 0° on the first step, 180° on the last, 30° per step.
  useMotionValueEvent(reduce ? progress : smooth, "change", (value) => {
    const tip = axisPoint(value * 180, AXIS.r - 16);
    needleRef.current?.setAttribute("x2", String(tip.x));
    needleRef.current?.setAttribute("y2", String(tip.y));
  });

  useEffect(() => {
    const journey = rootRef.current?.closest<HTMLElement>("[data-otc-journey]");
    if (!journey) return;
    const steps = Array.from(journey.querySelectorAll<HTMLElement>("[data-otc-step]"));

    let frame = 0;
    const measure = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      const centers = steps.map((step) => {
        const box = step.getBoundingClientRect();
        return box.top + box.height / 2;
      });
      const first = centers[0];
      const last = centers[centers.length - 1];
      const value = Math.min(1, Math.max(0, (middle - first) / (last - first)));
      progress.set(value);
      journey.style.setProperty("--otc-progress", value.toFixed(4));

      // The active step is the one whose center is closest to the middle of the screen.
      let nearest = 0;
      centers.forEach((center, index) => {
        if (Math.abs(center - middle) < Math.abs(centers[nearest] - middle)) nearest = index;
      });
      setActive(nearest);
      steps.forEach((step, index) => {
        step.dataset.active = String(index === nearest);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [progress]);

  // Smooth wheel scrolling on desktop, as on the home page. Off with reduced motion.
  useEffect(() => {
    if (reduce) return;
    let destroy = () => {};
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, duration: 1.1, lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, [reduce]);

  const step = opticsJourney[active];
  const startTip = axisPoint(0, AXIS.r - 16);

  return (
    <div className="otc-stage" ref={rootRef} data-step={step.id}>
      <div className="otc-stage-gauge">
        <svg className="otc-axis otc-axis--stage" viewBox="0 0 200 106" aria-hidden="true">
          <AxisScale reached={active} />
          <line ref={needleRef} className="otc-axis-needle" x1={AXIS.cx} y1={AXIS.cy} x2={startTip.x} y2={startTip.y} />
          <circle className="otc-axis-hub" cx={AXIS.cx} cy={AXIS.cy} r={4.5} />
        </svg>
        <div className="otc-stage-caption" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <b>{String(active + 1).padStart(2, "0")}</b>
              {step.label}
              <time>{step.when}</time>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="otc-stage-panels">
        <section className="otc-chat" aria-label={active === LAST ? "Painel das lojas" : "Conversa no WhatsApp"}>
          <ChatHead board={active === LAST} />
          <div className="otc-chat-body">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="otc-chat-scene"
                key={active}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {active === LAST ? <StoresBoard playing reduce={reduce} /> : <ChatScene step={active} playing reduce={reduce} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <span className="otc-wire" aria-hidden="true">
          <i key={active} />
        </span>

        <Ficha active={active} reduce={reduce} />
      </div>
    </div>
  );
}

function ChatHead({ board }: { board: boolean }) {
  return (
    <header className="otc-chat-head">
      <span className="otc-avatar" aria-hidden="true">
        <AgentBotGlyph />
      </span>
      <span>
        <b>{board ? "Its Time CRM" : "Clara"}</b>
        <small>
          {board ? (
            "Painel · 3 lojas"
          ) : (
            <>
              <i className="otc-online" aria-hidden="true" />
              Agente da ótica · online
            </>
          )}
        </small>
      </span>
    </header>
  );
}

/** The customer's record in the CRM: one field per step, filled as the journey goes. */
function Ficha({ active, reduce }: { active: number; reduce: boolean }) {
  return (
    <aside className="otc-ficha" aria-label="Ficha da cliente no CRM">
      <header className="otc-ficha-head">
        <span className="otc-mono otc-mono--lg" aria-hidden="true">
          MS
        </span>
        <span>
          <b>Marina Souza</b>
          <small>WhatsApp · Loja Centro</small>
        </span>
      </header>

      <ol className="otc-pipeline" aria-label="Etapa no funil">
        {pipeline.map((stage, index) => (
          <li data-state={index < stageAt[active] ? "done" : index === stageAt[active] ? "active" : "idle"} key={stage}>
            <i aria-hidden="true" />
            <span>{stage}</span>
          </li>
        ))}
      </ol>

      <dl className="otc-fields">
        {opticsJourney.map((step, index) => {
          const filled = index <= active;
          const fresh = index === active;
          return (
            <div className="otc-field" data-filled={filled} data-fresh={fresh && !reduce} key={step.id}>
              <dt>{step.saved.field}</dt>
              <dd>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={filled ? "value" : "empty"}
                    className={filled ? "otc-value" : "otc-skeleton"}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: fresh ? 0.5 : 0 }}
                  >
                    {filled ? step.saved.value : ""}
                  </motion.span>
                </AnimatePresence>
                {fresh && !reduce ? (
                  <motion.em
                    key={step.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.4, times: [0, 0.12, 0.8, 1], delay: 0.5 }}
                  >
                    <Check strokeWidth={2.8} aria-hidden="true" />
                    Salvo
                  </motion.em>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </aside>
  );
}

/* ───────────── ≤ 980 px: one scene inside each step ───────────── */

function CompactScenes({ reduce }: { reduce: boolean }) {
  const [slots, setSlots] = useState<HTMLElement[]>([]);

  useEffect(() => {
    // The slots are server-rendered in the steps list; the scenes are portaled into them after hydration.
    const found = Array.from(document.querySelectorAll<HTMLElement>("[data-otc-slot]"));
    const frame = requestAnimationFrame(() => setSlots(found));
    return () => cancelAnimationFrame(frame);
  }, []);

  return <>{slots.map((slot, index) => createPortal(<CompactScene index={index} reduce={reduce} />, slot, `slot-${index}`))}</>;
}

function CompactScene({ index, reduce }: { index: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const board = index === LAST;

  return (
    <div className="otc-chat otc-chat--compact" ref={ref} data-board={board}>
      <ChatHead board={board} />
      <div className="otc-chat-body">
        {board ? <StoresBoard playing={inView} reduce={reduce} /> : <ChatScene step={index} playing={inView} reduce={reduce} />}
      </div>
    </div>
  );
}
