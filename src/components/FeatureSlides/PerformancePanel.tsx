"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Send, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Count } from "./Count";
import { slidePhase } from "./slidePhase";

type Period = "hoje" | "7d" | "30d";
type UnitId = "centro" | "norte" | "sul";
type Selection = UnitId | "all";

const periods: Array<{ id: Period; label: string; title: string }> = [
  { id: "hoje", label: "Hoje", title: "hoje" },
  { id: "7d", label: "7 dias", title: "últimos 7 dias" },
  { id: "30d", label: "30 dias", title: "últimos 30 dias" },
];

// funnel per unit and period: [novo, atendimento, orçamento, fechado].
// Totals (all units) convert at 17% today, 22% in 7 days and 31,2% in 30 days.
const funnels: Record<Period, Record<UnitId, [number, number, number, number]>> = {
  hoje: { centro: [10, 8, 6, 2], norte: [8, 6, 4, 1], sul: [6, 5, 3, 1] },
  "7d": { centro: [60, 49, 35, 14], norte: [48, 38, 27, 10], sul: [42, 33, 24, 9] },
  "30d": { centro: [200, 164, 118, 68], norte: [160, 128, 90, 47], sul: [140, 108, 76, 41] },
};

const units: Array<{ id: UnitId; name: string; ticket: number }> = [
  { id: "centro", name: "Unidade Centro", ticket: 900 },
  { id: "norte", name: "Unidade Norte", ticket: 840 },
  { id: "sul", name: "Unidade Sul", ticket: 790 },
];

const stageNames = ["Novo", "Atendimento", "Orçamento", "Fechado"];

// Change versus the previous period.
const deltas: Record<Period, { leads: number; conversion: string; revenue: number }> = {
  hoje: { leads: 8, conversion: "0,6", revenue: 11 },
  "7d": { leads: 14, conversion: "1,8", revenue: 19 },
  "30d": { leads: 22, conversion: "3,2", revenue: 27 },
};

// Demo: with no interaction the panel walks through these views on its own.
const script: Array<[Period, Selection]> = [
  ["30d", "all"],
  ["7d", "all"],
  ["7d", "centro"],
  ["30d", "norte"],
  ["hoje", "all"],
  ["30d", "sul"],
];
// Each view stays this long; the bar in the footer fills over exactly this time.
const STEP_MS = 3800;

const EASE = [0.22, 1, 0.36, 1] as const;

function derive(selection: Selection, period: Period) {
  const list = selection === "all" ? units : units.filter((unit) => unit.id === selection);
  const funnel = [0, 0, 0, 0];
  let revenue = 0;
  let stalled = 0;
  let stalledValue = 0;

  for (const unit of list) {
    const counts = funnels[period][unit.id];
    counts.forEach((value, index) => {
      funnel[index] += value;
    });
    revenue += counts[3] * unit.ticket;
    const parked = Math.round((counts[2] - counts[3]) * 0.3);
    stalled += parked;
    stalledValue += parked * unit.ticket;
  }

  return { funnel, revenue, stalled, stalledValue, conversion: funnel[0] ? (funnel[3] / funnel[0]) * 100 : 0 };
}

const brl = (value: number) =>
  value >= 10000
    ? `R$ ${(value / 1000).toFixed(1).replace(".", ",")} mil`
    : `R$ ${Math.round(value).toLocaleString("pt-BR")}`;

// "Today" is a small sample, so it reads as a whole number; longer periods keep one decimal (",0" is dropped).
const pct = (value: number, period: Period) =>
  period === "hoje" ? `${Math.round(value)}%` : `${value.toFixed(1).replace(".", ",").replace(",0", "")}%`;

export function PerformancePanel() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  const [period, setPeriod] = useState<Period>("30d");
  const [selection, setSelection] = useState<Selection>("all");
  const [manual, setManual] = useState(false);
  const [sent, setSent] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const manualRef = useRef(false);
  const stepRef = useRef(0);
  const wasVisible = useRef(false);
  const lastTick = useRef(0);
  const fills = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  const startDemo = () => {
    manualRef.current = false;
    setManual(false);
    stepRef.current = 0;
    setStepIdx(0);
    fills.current.forEach((fill) => {
      if (fill) fill.style.transform = "scaleX(0)";
    });
    lastTick.current = performance.now();
    setPeriod(script[0][0]);
    setSelection(script[0][1]);
  };

  // Autoplay: starts only once the slide has settled in front of the visitor and runs while it is on screen;
  // a click hands control to the visitor. Everything that animates on entrance waits for `revealed`.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const phase = slidePhase(rootRef.current);

      if (phase === "hidden") {
        wasVisible.current = false;
        setRevealed(false);
        return;
      }
      if (phase === "fading" || !inViewRef.current || document.hidden) {
        lastTick.current = performance.now();
        return;
      }
      if (!wasVisible.current) {
        wasVisible.current = true;
        startDemo();
        setRevealed(true);
        return;
      }

      const now = performance.now();
      const fill = fills.current[stepRef.current];
      if (manualRef.current) {
        lastTick.current = now;
        if (fill) fill.style.transform = "scaleX(0)";
        return;
      }
      if (fill) fill.style.transform = `scaleX(${Math.min(1, (now - lastTick.current) / STEP_MS)})`;
      if (now - lastTick.current < STEP_MS) return;

      lastTick.current = now;
      stepRef.current = (stepRef.current + 1) % script.length;
      if (stepRef.current === 0) {
        fills.current.forEach((item) => {
          if (item) item.style.transform = "scaleX(0)";
        });
      }
      setStepIdx(stepRef.current);
      setPeriod(script[stepRef.current][0]);
      setSelection(script[stepRef.current][1]);
    }, 250);
    return () => window.clearInterval(id);
  }, [reduce]);

  const takeControl = () => {
    manualRef.current = true;
    setManual(true);
  };

  const shown = reduce || revealed;
  // Before the slide has settled the numbers sit at zero, so they count up in front of the visitor.
  const show = (value: number) => (shown ? value : 0);

  const current = derive(selection, period);
  const perUnit = units.map((unit) => ({ unit, data: derive(unit.id, period) }));
  const maxRevenue = Math.max(...perUnit.map((item) => item.data.revenue), 1);
  const periodTitle = periods.find((item) => item.id === period)?.title ?? "";
  const delta = deltas[period];

  // The stage where the funnel narrows the most is where the biggest gain is.
  const retention = current.funnel.map((value, index) => (index === 0 ? 1 : current.funnel[index - 1] ? value / current.funnel[index - 1] : 0));
  const worst = retention.reduce((best, value, index) => (index > 0 && value < retention[best] ? index : best), 1);

  const selectedUnit = units.find((unit) => unit.id === selection);

  const enter = (index: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.5, ease: EASE, delay: shown ? index * 0.08 : 0 },
  });

  return (
    <div className="pf" ref={rootRef} data-reduced={reduce} data-shown={shown}>
      <div className="pf-stage">
        {/* Header + period control */}
        <header className="pf-head">
          <div className="pf-brand">
            <span className="pf-logo" aria-hidden="true">
              <Image src="/assets/brand/its-time-mark-transparent-clean.png" alt="" width={48} height={50} sizes="36px" />
            </span>
            <span className="pf-brand-copy">
              <strong>Painel</strong>
              <small>
                {selectedUnit ? selectedUnit.name : "Todas as unidades"} · {periodTitle}
              </small>
            </span>
          </div>
          <div className="pf-periods" role="group" aria-label="Período">
            {periods.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={period === item.id}
                data-active={period === item.id}
                onClick={() => {
                  takeControl();
                  setPeriod(item.id);
                }}
              >
                {period === item.id ? (
                  <motion.span
                    className="pf-thumb"
                    layoutId="pf-period-thumb"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
                <span className="pf-period-label">{item.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* KPIs */}
        <div className="pf-kpis" data-required-element="perf-kpis">
          {[
            {
              label: "Leads no período",
              value: <Count value={show(current.funnel[0])} format={(v) => Math.round(v).toLocaleString("pt-BR")} reduce={reduce} />,
              delta: `${delta.leads}%`,
            },
            {
              label: "Taxa de conversão",
              value: <Count value={show(current.conversion)} format={(v) => pct(v, period)} reduce={reduce} />,
              delta: `${delta.conversion} p.p.`,
            },
            {
              label: "Receita registrada",
              value: <Count value={show(current.revenue)} format={brl} reduce={reduce} />,
              delta: `${delta.revenue}%`,
              wide: true,
            },
          ].map((kpi, index) => (
            <motion.div className="pf-kpi" data-wide={kpi.wide ?? false} key={kpi.label} {...enter(index)}>
              <small>{kpi.label}</small>
              <strong>{kpi.value}</strong>
              <span className="pf-delta">
                <TrendingUp aria-hidden="true" strokeWidth={2.4} />
                {kpi.delta} vs. anterior
              </span>
            </motion.div>
          ))}
        </div>

        {/* Funnel */}
        <motion.section className="pf-funnel" aria-label="Funil" data-required-element="perf-funnel" {...enter(3)}>
          <header className="pf-card-head">
            <b>Funil</b>
            <small>da entrada ao fechamento</small>
          </header>
          <ol className="pf-rows">
            {stageNames.map((name, index) => {
              const value = current.funnel[index];
              const width = shown && current.funnel[0] ? (value / current.funnel[0]) * 100 : 0;
              const isWorst = index === worst;
              return (
                <li className="pf-row" data-worst={isWorst} data-stage={index} key={name}>
                  <span className="pf-row-name">{name}</span>
                  <span className="pf-track">
                    <motion.i
                      initial={false}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: shown ? 0.3 + index * 0.08 : 0 }}
                    />
                  </span>
                  <span className="pf-row-count">
                    <Count value={show(value)} format={(v) => Math.round(v).toLocaleString("pt-BR")} reduce={reduce} />
                  </span>
                  <span className="pf-row-ret">
                    {index === 0 ? null : isWorst ? (
                      <>
                        <TrendingUp aria-hidden="true" strokeWidth={2.4} />
                        {Math.round(retention[index] * 100)}% · maior ganho
                      </>
                    ) : (
                      `${Math.round(retention[index] * 100)}%`
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.section>

        {/* Units */}
        <motion.section className="pf-units" aria-label="Unidades" data-required-element="perf-units" {...enter(4)}>
          <header className="pf-card-head">
            <b>Receita por unidade</b>
            <button
              type="button"
              className="pf-all"
              data-active={selection === "all"}
              onClick={() => {
                takeControl();
                setSelection("all");
              }}
            >
              Todas
            </button>
          </header>
          <ul className="pf-rows">
            {perUnit.map(({ unit, data }) => {
              const active = selection === unit.id;
              const dim = selection !== "all" && !active;
              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    className="pf-unit"
                    data-active={active}
                    data-dim={dim}
                    aria-pressed={active}
                    onClick={() => {
                      takeControl();
                      setSelection(active ? "all" : unit.id);
                    }}
                  >
                    <span className="pf-unit-top">
                      <span className="pf-unit-name">{unit.name}</span>
                      <span className="pf-unit-value">
                        <Count value={show(data.revenue)} format={brl} reduce={reduce} />
                      </span>
                    </span>
                    <span className="pf-track">
                      <motion.i
                        initial={false}
                        animate={{ width: `${shown ? (data.revenue / maxRevenue) * 100 : 0}%` }}
                        transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: shown ? 0.4 : 0 }}
                      />
                    </span>
                    <small>
                      <Count value={show(data.conversion)} format={(v) => pct(v, period)} reduce={reduce} /> de conversão
                    </small>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* Opportunity */}
        <motion.section
          className="pf-opportunity"
          aria-label="Oportunidade"
          data-required-element="perf-opportunity"
          {...enter(5)}
        >
          <span className="pf-pulse" aria-hidden="true" />
          <span className="pf-opp-copy">
            <small>
              <Count value={show(current.stalled)} format={(v) => String(Math.round(v))} reduce={reduce} /> orçamentos sem resposta há mais de 3 dias
            </small>
            <strong>
              <Count value={show(current.stalledValue)} format={brl} reduce={reduce} /> <em>parados</em>
            </strong>
          </span>
          <button
            type="button"
            className="pf-cta"
            data-sent={sent}
            onClick={() => {
              takeControl();
              setSent(true);
              window.setTimeout(() => setSent(false), 2600);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sent ? "sent" : "idle"}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {sent ? (
                  <>
                    <Check size={14} strokeWidth={2.8} aria-hidden="true" /> Jornada criada
                  </>
                ) : (
                  <>
                    <Send size={14} aria-hidden="true" /> Reativar
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.section>

        <footer className="pf-foot">
          <span className="pf-hint" aria-live="polite">
            <i data-manual={manual} aria-hidden="true" />
            {manual ? (
              <>
                Você está no controle ·{" "}
                <button type="button" onClick={startDemo}>
                  retomar demonstração
                </button>
              </>
            ) : (
              "Demonstração automática · clique para explorar"
            )}
          </span>
          {/* One segment per view; the current one fills over exactly STEP_MS, so the bar ends when the view changes */}
          <span className="pf-steps" data-manual={manual} aria-hidden="true">
            {script.map((_, index) => (
              <i data-state={index < stepIdx ? "done" : index === stepIdx ? "now" : "idle"} key={index}>
                <b
                  ref={(el) => {
                    fills.current[index] = el;
                  }}
                />
              </i>
            ))}
          </span>
        </footer>
      </div>
    </div>
  );
}
