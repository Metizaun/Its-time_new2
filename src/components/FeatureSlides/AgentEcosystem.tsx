"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ShoppingBag, WalletCards } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  AgentBotGlyph,
  CalendarGlyph,
  ForwardingGlyph,
  PrescriptionGlyph,
  VisagismGlyph,
} from "./AgentIcons";

type AgentId = "sofia" | "clara";

type Tool = {
  id: string;
  name: string;
  status: string;
  description: string;
  icon: ReactNode;
  /** Vertical center in the stage. */
  y: number;
};

type Agent = {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  icon: ReactNode;
  y: number;
  tools: Tool[];
};

// Stage coordinates (viewBox 760x600). Cards are positioned in % of the stage so
// the SVG lines and the HTML cards always stay aligned.
const STAGE = { w: 760, h: 600 };
const AGENT_X = 0;
const AGENT_W = 230;
const AGENT_H = 96;
const JUNCTION_X = 330;
const TOOL_X = 530;
const TOOL_W = 230;
const TOOL_H = 72;

const agents: Agent[] = [
  {
    id: "sofia",
    name: "Sofia",
    role: "Cobrança",
    description: "Cuida da cobrança e da agenda pelo WhatsApp, com tom humano e controle total.",
    icon: <AgentBotGlyph />,
    y: 102,
    tools: [
      {
        id: "cobranca-rb",
        name: "Cobrança RB",
        status: "Consultando",
        description: "Puxa o débito mais recente, envia o Pix e mostra o total de pendências quando o cliente pede.",
        icon: <WalletCards size="100%" strokeWidth={2} />,
        y: 56,
      },
      {
        id: "agenda",
        name: "Agenda",
        status: "Sincronizando",
        description: "Agenda direto na conversa, respeitando profissional, local, serviço e horários livres.",
        icon: <CalendarGlyph />,
        y: 148,
      },
    ],
  },
  {
    id: "clara",
    name: "Clara",
    role: "Comercial",
    description: "Consultora de ótica: entende o que o lead procura e o conduz até a loja certa.",
    icon: <AgentBotGlyph />,
    y: 408,
    tools: [
      {
        id: "receita",
        name: "Leitura de receita",
        status: "Analisando",
        description: "Lê a receita em foto, extrai grau, cilíndrico e eixo e resume para a equipe e o cliente.",
        icon: <PrescriptionGlyph />,
        y: 270,
      },
      {
        id: "visagismo",
        name: "Visagismo",
        status: "Processando",
        description: "Indica a armação ideal a partir do formato do rosto do cliente.",
        icon: <VisagismGlyph />,
        y: 362,
      },
      {
        id: "encaminhamento",
        name: "Encaminhamento",
        status: "Consultando",
        description: "Leva o cliente para a loja certa; sem atendente disponível, passa para um humano.",
        icon: <ForwardingGlyph />,
        y: 454,
      },
      {
        id: "catalogo",
        name: "Catálogo",
        status: "Consultando",
        description: "Consulta lentes, armações e serviços cadastrados, com opções e valores na hora.",
        icon: <ShoppingBag size="100%" strokeWidth={2} />,
        y: 546,
      },
    ],
  },
];

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

function toolPath(agent: Agent, tool: Tool) {
  const startX = AGENT_X + AGENT_W;
  if (tool.y === agent.y) {
    return `M${startX} ${agent.y} H${TOOL_X}`;
  }
  const mid = (JUNCTION_X + TOOL_X) / 2;
  return `M${startX} ${agent.y} H${JUNCTION_X} C${mid + 10} ${agent.y} ${mid - 10} ${tool.y} ${TOOL_X} ${tool.y}`;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Entrance choreography (whole thing stays around 1.2s):
// agents -> lines -> tools -> particles.
const delays = {
  agent: (i: number) => 0.05 + i * 0.1,
  line: 0.35,
  tool: (i: number) => 0.5 + i * 0.07,
  particles: 1.15,
};

function Dots() {
  return (
    <span className="eco-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function AgentEcosystem() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ agent: AgentId; tool?: string } | null>(null);
  const [scrollAgent, setScrollAgent] = useState<AgentId | null>(null);
  const [compact, setCompact] = useState(false);
  const live = useInView(stageRef, { amount: 0.1 });

  const active = hover?.agent ?? scrollAgent;
  const activeAgent = agents.find((agent) => agent.id === hover?.agent);
  const activeTool = activeAgent?.tools.find((tool) => tool.id === hover?.tool);

  // Pause SMIL particles while the stage is off screen.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (live) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [live]);

  // Touch / compact layout: highlight the ecosystem that is crossing the viewport center.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!compact || !stage) {
      setScrollAgent(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setScrollAgent((entry.target as HTMLElement).dataset.owner as AgentId);
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );

    stage.querySelectorAll<HTMLElement>("[data-owner]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [compact]);

  const hidden = reduceMotion ? false : "hidden";

  return (
    <div
      className="eco"
      data-active={active ?? "none"}
      data-live={live ? "true" : "false"}
      data-reduced={reduceMotion ? "true" : "false"}
    >
      <motion.div
        className="eco-stage"
        ref={stageRef}
        initial={hidden}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          className="eco-svg"
          ref={svgRef}
          viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {agents.map((agent) => (
            <g
              className="eco-lines"
              data-owner={agent.id}
              key={agent.id}
              style={{ "--eco-rgb": agent.id === "sofia" ? "255, 90, 31" : "255, 77, 109" } as CSSProperties}
            >
              {agent.tools.map((tool, index) => {
                const path = toolPath(agent, tool);
                const dur = 2.6 + ((index * 5 + (agent.id === "clara" ? 3 : 0)) % 4) * 0.35;
                const begin = 1.3 + index * 0.7 + (agent.id === "clara" ? 0.35 : 0);
                const lit = hover?.tool === tool.id;

                return (
                  <g className="eco-route" data-lit={lit} key={tool.id}>
                    <motion.path
                      className="eco-line"
                      d={path}
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        show: {
                          pathLength: 1,
                          opacity: 1,
                          transition: { duration: 0.6, delay: delays.line + index * 0.06, ease: EASE },
                        },
                      }}
                    />
                    <circle
                      className="eco-node eco-node--end"
                      cx={TOOL_X}
                      cy={tool.y}
                      r="4"
                      style={{ "--dur": `${dur}s`, "--begin": `${begin}s` } as CSSProperties}
                    />
                    {reduceMotion ? null : (
                      <motion.g
                        className="eco-particle"
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { delay: delays.particles, duration: 0.4 } },
                        }}
                      >
                        <g opacity="0">
                          <circle r="7" className="eco-particle-halo" />
                          <circle r="2.6" className="eco-particle-core" />
                          <animateMotion
                            dur={`${dur}s`}
                            begin={`${begin}s`}
                            repeatCount="indefinite"
                            path={path}
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.12;0.86;1"
                            dur={`${dur}s`}
                            begin={`${begin}s`}
                            repeatCount="indefinite"
                          />
                        </g>
                      </motion.g>
                    )}
                  </g>
                );
              })}
              <circle
                className="eco-node eco-node--junction"
                cx={JUNCTION_X}
                cy={agent.y}
                r="4.5"
                style={{ "--dur": "2.2s", "--begin": "0s" } as CSSProperties}
              />
            </g>
          ))}
        </svg>

        {agents.map((agent, agentIndex) => (
          <div className="eco-owner" key={agent.id} style={{ display: "contents" }}>
            <div
              className="eco-item eco-item--agent"
              data-owner={agent.id}
              style={
                {
                  left: pct(AGENT_X, STAGE.w),
                  top: pct(agent.y - AGENT_H / 2, STAGE.h),
                  width: pct(AGENT_W, STAGE.w),
                  height: pct(AGENT_H, STAGE.h),
                  "--eco-rgb": agent.id === "sofia" ? "255, 90, 31" : "255, 77, 109",
                } as CSSProperties
              }
              tabIndex={0}
              onMouseEnter={() => setHover({ agent: agent.id })}
              onFocus={() => setHover({ agent: agent.id })}
              onBlur={() => setHover(null)}
            >
              <motion.article
                className="eco-card"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: delays.agent(agentIndex), ease: EASE } },
                }}
              >
                <span className="eco-icon" aria-hidden="true">
                  {agent.icon}
                </span>
                <span className="eco-copy">
                  <strong>{agent.name}</strong>
                  <small>
                    <span className="eco-online" aria-hidden="true" />
                    {agent.role}
                  </small>
                  <p className="eco-desc">{agent.description}</p>
                </span>
              </motion.article>
            </div>

            {agent.tools.map((tool, toolIndex) => (
              <div
                className="eco-item eco-item--tool"
                data-owner={agent.id}
                data-lit={hover?.tool === tool.id}
                key={tool.id}
                style={
                  {
                    left: pct(TOOL_X, STAGE.w),
                    top: pct(tool.y - TOOL_H / 2, STAGE.h),
                    width: pct(TOOL_W, STAGE.w),
                    height: pct(TOOL_H, STAGE.h),
                    "--eco-rgb": agent.id === "sofia" ? "255, 90, 31" : "255, 77, 109",
                  } as CSSProperties
                }
                tabIndex={0}
                onMouseEnter={() => setHover({ agent: agent.id, tool: tool.id })}
                onFocus={() => setHover({ agent: agent.id, tool: tool.id })}
                onBlur={() => setHover(null)}
              >
                <motion.article
                  className="eco-card"
                  variants={{
                    hidden: { opacity: 0, x: 12 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.4,
                        delay: delays.tool(toolIndex + (agent.id === "clara" ? 2 : 0)),
                        ease: EASE,
                      },
                    },
                  }}
                >
                  <span className="eco-icon" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <span className="eco-copy">
                    <strong>{tool.name}</strong>
                    <small className="eco-status">
                      {tool.status}
                      <Dots />
                    </small>
                    <p className="eco-desc">{tool.description}</p>
                  </span>
                </motion.article>
              </div>
            ))}
          </div>
        ))}

        <div className="eco-readout" data-required-element="intro-particles" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {activeAgent ? (
              <motion.div
                className="eco-readout-body"
                key={`${activeAgent.id}-${activeTool?.id ?? "agent"}`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE }}
                style={
                  { "--eco-rgb": activeAgent.id === "sofia" ? "255, 90, 31" : "255, 77, 109" } as CSSProperties
                }
              >
                <span className="eco-readout-kicker">
                  {activeAgent.name}
                  {activeTool ? ` · ${activeTool.name}` : " · Agente"}
                </span>
                <p>{activeTool ? activeTool.description : activeAgent.description}</p>
                {activeTool ? (
                  <span className="eco-readout-status">
                    {activeTool.status}
                    <Dots />
                  </span>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                className="eco-readout-idle"
                key="idle"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Funcionalidades que transformam sua operação
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
