import Image from "next/image";
import { Check } from "lucide-react";
import { InstagramGlyph, MessengerGlyph, SiteGlyph, WhatsAppGlyph } from "./glyphs";

/**
 * The hero ornament, drawn like an optics diagram: conversations arrive loose from four channels, pass through a
 * lens (the AI) and meet at its focus (Its Time), from where they leave as straight rows in the CRM.
 * Pure SVG + CSS: no JS, no image besides the 5 KB logo; the dashes stop under prefers-reduced-motion.
 */
const channels = [
  { key: "whatsapp", label: "WhatsApp", y: 92, Icon: WhatsAppGlyph },
  { key: "site", label: "Site", y: 172, Icon: SiteGlyph },
  { key: "instagram", label: "Instagram", y: 252, Icon: InstagramGlyph },
  { key: "messenger", label: "Messenger", y: 332, Icon: MessengerGlyph },
] as const;

// Where each ray enters and leaves the lens (x 286 → 314), and the focus where they meet.
const lensIn = [150, 190, 232, 274];
const lensOut = [166, 198, 228, 258];
const FOCUS = { x: 440, y: 212 };
const rows = [
  { y: 150, text: "Receita lida" },
  { y: 212, text: "Orçamento enviado" },
  { y: 274, text: "Visita marcada" },
];

// Loose contacts on the left: grey while nobody answered, a few already warming up.
const loose = [
  [128, 70, "soft"],
  [152, 118, "ink"],
  [118, 146, "accent"],
  [176, 206, "soft"],
  [140, 236, "ink"],
  [190, 288, "accent"],
  [124, 300, "soft"],
  [168, 356, "soft"],
  [206, 134, "soft"],
  [214, 334, "ink"],
] as const;

export function HeroLens() {
  return (
    <figure className="otc-lens" aria-label="Conversas de quatro canais passam pela IA e chegam organizadas ao CRM">
      <svg className="otc-lens-svg" viewBox="0 0 640 424" aria-hidden="true">
        <defs>
          <linearGradient id="otc-ray" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ff5a1f" />
            <stop offset="1" stopColor="#ff4d6d" />
          </linearGradient>
          <linearGradient id="otc-glass" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#f1eee9" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* optical axis */}
        <line className="otc-lens-axis" x1="96" y1={FOCUS.y} x2="620" y2={FOCUS.y} />

        {loose.map(([x, y, tone], index) => (
          <rect
            className={`otc-lens-dot otc-lens-dot--${tone}`}
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={5}
            height={5}
            style={{ animationDelay: `${index * -0.9}s` }}
          />
        ))}

        {channels.map((channel, index) => {
          const d = `M 100 ${channel.y} L 286 ${lensIn[index]} L 314 ${lensOut[index]} L ${FOCUS.x} ${FOCUS.y}`;
          return (
            <g key={channel.key}>
              <path className="otc-lens-ray" d={d} />
              <path className="otc-lens-flow" d={d} style={{ animationDelay: `${index * -0.45}s` }} />
            </g>
          );
        })}

        <path className="otc-lens-glass" d="M 300 64 Q 352 212 300 360 Q 248 212 300 64 Z" />
        <path className="otc-lens-shine" d="M 292 104 Q 270 170 274 236" />

        {rows.map((row) => (
          <g key={row.y}>
            <path className="otc-lens-ray otc-lens-ray--out" d={`M ${FOCUS.x} ${FOCUS.y} L 474 ${row.y} L 500 ${row.y}`} />
            <path className="otc-lens-flow otc-lens-flow--out" d={`M ${FOCUS.x} ${FOCUS.y} L 474 ${row.y} L 500 ${row.y}`} />
            <circle className="otc-lens-port" cx="500" cy={row.y} r="2.6" />
          </g>
        ))}

        <circle className="otc-lens-focus-ring" cx={FOCUS.x} cy={FOCUS.y} r="25" />
        <circle className="otc-lens-focus" cx={FOCUS.x} cy={FOCUS.y} r="19" />
      </svg>

      {/* HTML on top of the drawing, positioned in the same 640 × 424 frame */}
      {channels.map(({ key, label, y, Icon }) => (
        <span className={`otc-lens-channel otc-lens-channel--${key}`} key={key} style={{ top: `${(y / 424) * 100}%` }}>
          <i>
            <Icon />
          </i>
          <small>{label}</small>
        </span>
      ))}
      <span className="otc-lens-hub" style={{ left: `${(FOCUS.x / 640) * 100}%`, top: `${(FOCUS.y / 424) * 100}%` }}>
        <Image src="/assets/brand/its-time-mark-96.webp" alt="" width={48} height={48} />
      </span>
      <div className="otc-lens-card">
        <b>CRM · Loja Centro</b>
        {rows.map((row) => (
          <span key={row.y} style={{ top: `${(row.y / 424) * 100}%` }}>
            <Check strokeWidth={2.8} aria-hidden="true" />
            {row.text}
          </span>
        ))}
      </div>
      <figcaption className="otc-lens-legend">
        <span>4 canais</span>
        <span>A IA atende</span>
        <span>Tudo no CRM</span>
      </figcaption>
    </figure>
  );
}
