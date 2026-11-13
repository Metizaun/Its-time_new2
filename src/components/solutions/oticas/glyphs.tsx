import type { ReactNode } from "react";

/** Small line glyphs for the channels, drawn here so the page does not ship the 50 KB brand PNGs. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function WhatsAppGlyph() {
  return (
    <Glyph>
      <path d="M4.2 19.8l1.1-3.7A8 8 0 1 1 8 18.7z" />
      <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.5l.9 2-.6.8a5.6 5.6 0 0 0 2.4 2.4l.8-.6 2 .9v.5c0 .3-.1.6-.5.8-.6.4-1.5.5-2.6 0a8 8 0 0 1-3.8-3.8c-.5-1.1-.4-2 .1-2.5z" />
    </Glyph>
  );
}

export function InstagramGlyph() {
  return (
    <Glyph>
      <rect x="4" y="4" width="16" height="16" rx="4.6" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.6 7.4h.01" strokeWidth={2.6} />
    </Glyph>
  );
}

export function MessengerGlyph() {
  return (
    <Glyph>
      <path d="M12 3.6c-4.8 0-8.4 3.4-8.4 7.9 0 2.4 1 4.5 2.8 5.9v3l2.7-1.5c.9.3 1.9.4 2.9.4 4.8 0 8.4-3.4 8.4-7.8S16.8 3.6 12 3.6z" />
      <path d="M7.6 13.6l3-3.2 2 1.7 3.6-1.9-3 3.2-2-1.7z" />
    </Glyph>
  );
}

export function SiteGlyph() {
  return (
    <Glyph>
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" />
      <path d="M3.5 9h17M7 7h.01M9.5 7h.01" />
    </Glyph>
  );
}

/** TABO axis scale, the half-protractor printed on every prescription to write the cylinder axis (0° to 180°). */
export const AXIS = { cx: 100, cy: 92, r: 78 } as const;

export function axisPoint(degrees: number, radius: number = AXIS.r) {
  const rad = (degrees * Math.PI) / 180;
  return { x: AXIS.cx + radius * Math.cos(rad), y: AXIS.cy - radius * Math.sin(rad) };
}

/** The scale itself: the arc, a tick every 10°, a port every 30° (one per step of the journey). */
export function AxisScale({ reached = -1 }: { reached?: number }) {
  const ticks = Array.from({ length: 19 }, (_, index) => index * 10);
  return (
    <>
      <path
        className="otc-axis-arc"
        d={`M ${AXIS.cx - AXIS.r} ${AXIS.cy} A ${AXIS.r} ${AXIS.r} 0 0 1 ${AXIS.cx + AXIS.r} ${AXIS.cy}`}
      />
      {ticks.map((degrees) => {
        const major = degrees % 30 === 0;
        const outer = axisPoint(degrees, AXIS.r - 3);
        const inner = axisPoint(degrees, AXIS.r - (major ? 12 : 8));
        return (
          <line
            className={major ? "otc-axis-tick otc-axis-tick--major" : "otc-axis-tick"}
            key={degrees}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
          />
        );
      })}
      {ticks
        .filter((degrees) => degrees % 30 === 0)
        .map((degrees, index) => {
          const port = axisPoint(degrees, AXIS.r + 7);
          return (
            <circle
              className="otc-axis-port"
              data-reached={index <= reached}
              key={`port-${degrees}`}
              cx={port.x}
              cy={port.y}
              r={2.6}
            />
          );
        })}
      <text className="otc-axis-label" x={AXIS.cx + AXIS.r + 2} y={AXIS.cy + 13} textAnchor="middle">
        0°
      </text>
      <text className="otc-axis-label" x={AXIS.cx} y={AXIS.cy - AXIS.r + 26} textAnchor="middle">
        90°
      </text>
      <text className="otc-axis-label" x={AXIS.cx - AXIS.r - 2} y={AXIS.cy + 13} textAnchor="middle">
        180°
      </text>
    </>
  );
}

/** Static needle for the server-rendered badges: one step of the journey is 30° on the scale. */
export function AxisBadge({ step }: { step: number }) {
  const degrees = step * 30;
  const tip = axisPoint(degrees, AXIS.r - 16);
  return (
    <svg className="otc-axis otc-axis--badge" viewBox="0 0 200 106" aria-hidden="true">
      <AxisScale reached={step} />
      <line className="otc-axis-needle" x1={AXIS.cx} y1={AXIS.cy} x2={tip.x} y2={tip.y} />
      <circle className="otc-axis-hub" cx={AXIS.cx} cy={AXIS.cy} r={4.5} />
    </svg>
  );
}
