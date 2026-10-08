import type { ReactNode } from "react";

// Glyphs copied from the app (chat-query AgentCapabilityFlow) so the site shows the
// same icons users see in the product. Stroke uses currentColor to follow the site palette.
function Glyph({ children, strokeWidth = 2 }: { children: ReactNode; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function AgentBotGlyph() {
  return (
    <Glyph strokeWidth={2.1}>
      <path d="M12 7V4H8.5" />
      <rect x="5" y="7" width="14" height="12" rx="3" />
      <path d="M5 11H3.5v4H5M19 11h1.5v4H19" />
      <path d="M9 11.5v3M15 11.5v3" />
    </Glyph>
  );
}

export function CalendarGlyph() {
  return (
    <Glyph>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01M16 17.5h.01" strokeWidth="2.5" />
    </Glyph>
  );
}

export function ForwardingGlyph() {
  return (
    <Glyph>
      <circle cx="5.5" cy="12" r="2.75" />
      <path d="M8.25 12h2.5c3 0 3-4 6-4H21" />
      <path d="m18.5 5.5 2.5 2.5-2.5 2.5" />
      <path d="M10.75 12c3 0 3 4 6 4H21" />
      <path d="m18.5 13.5 2.5 2.5-2.5 2.5" />
    </Glyph>
  );
}

export function VisagismGlyph() {
  return (
    <Glyph>
      <circle cx="7.5" cy="12" r="4" />
      <circle cx="16.5" cy="12" r="4" />
      <path d="M11.5 12h1M3.5 10.5 2 9.75M20.5 10.5 22 9.75" />
    </Glyph>
  );
}

export function PrescriptionGlyph() {
  return (
    <Glyph>
      <path d="M7 2.75h7l4 4V21.25H7a2 2 0 0 1-2-2V4.75a2 2 0 0 1 2-2Z" />
      <path d="M14 2.75v4h4" />
      <path d="M8.5 11v6" />
      <path d="M8.5 11h2a1.75 1.75 0 0 1 0 3.5h-2" />
      <path d="m11 14.5 2.25 2.5" />
      <path d="m14.25 12.5 3 4.5" />
      <path d="m17.25 12.5-3 4.5" />
    </Glyph>
  );
}
