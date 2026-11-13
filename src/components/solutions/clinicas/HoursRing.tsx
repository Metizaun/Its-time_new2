import { CalendarGlyph } from "@/components/FeatureSlides/AgentIcons";

/**
 * Hero ornament with a meaning: the clinic's day as a 24 h ring. The grey arc is when the front desk works
 * (8h–18h); the brand gradient covers the hours the AI answers alone. The dot at 22:14 is where the patient's
 * question lands, and the card shows what it became. Pure SVG/CSS, rendered on the server (no JS, no image).
 */
const C = 200;
const R = 150;

function point(hour: number, radius = R) {
  const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const;
}

function arc(from: number, to: number, radius = R) {
  const span = (to - from + 24) % 24;
  const [x1, y1] = point(from, radius);
  const [x2, y2] = point(to, radius);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${span > 12 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const NOW = 22 + 14 / 60;

export function HoursRing() {
  const [nx, ny] = point(NOW);
  return (
    <div className="cl-ring">
      <svg viewBox="0 0 400 400" className="cl-ring-svg" role="img" aria-labelledby="cl-ring-title">
        <title id="cl-ring-title">
          O dia da clínica em 24 horas: a recepção atende das 8h às 18h e a IA responde nas outras horas.
        </title>
        <defs>
          <linearGradient id="cl-ring-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ff5a1f" />
            <stop offset="1" stopColor="#ff4d6d" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r={R + 26} className="cl-ring-outer" />
        {Array.from({ length: 24 }, (_, hour) => {
          const [x1, y1] = point(hour, R + 12);
          const [x2, y2] = point(hour, R + (hour % 6 === 0 ? 20 : 16));
          return <line key={hour} x1={x1} y1={y1} x2={x2} y2={y2} className="cl-ring-tick" />;
        })}
        {[0, 6, 12, 18].map((hour) => {
          const [x, y] = point(hour, R - 26);
          return (
            <text key={hour} x={x} y={y + 4} textAnchor="middle" className="cl-ring-hour">
              {String(hour).padStart(2, "0")}h
            </text>
          );
        })}
        <path d={arc(8, 18)} className="cl-ring-desk" />
        <path d={arc(18, 8)} className="cl-ring-ai" pathLength={1} />
        <circle cx={nx} cy={ny} r="13" className="cl-ring-now-halo" />
        <circle cx={nx} cy={ny} r="6.5" className="cl-ring-now" />
        <text x={C} y={C - 8} textAnchor="middle" className="cl-ring-center">
          24h
        </text>
        <text x={C} y={C + 16} textAnchor="middle" className="cl-ring-center-caption">
          de atendimento
        </text>
      </svg>

      <p className="cl-ring-legends" aria-hidden="true">
        <span className="cl-ring-legend cl-ring-legend--ai">
          <i />
          IA · fora do expediente
        </span>
        <span className="cl-ring-legend">
          <i />
          Recepção · 8h às 18h
        </span>
      </p>

      <div className="cl-ring-card cl-ring-card--message" aria-hidden="true">
        <span className="cl-ring-card-meta">WhatsApp · 22:14</span>
        <p>Oi! Vocês têm horário esta semana?</p>
      </div>
      <div className="cl-ring-card cl-ring-card--booked" aria-hidden="true">
        <span className="cl-ring-card-icon">
          <CalendarGlyph />
        </span>
        <span>
          <strong>Horário marcado</strong>
          <span className="cl-ring-card-meta">Qui, 9h30 · respondido às 22:14</span>
        </span>
      </div>
    </div>
  );
}
