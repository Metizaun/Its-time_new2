import type { CSSProperties } from "react";

/** Reserves the stage's footprint while an interactive scene is loaded after hydration. */
export function StagePlaceholder({ ratio }: { ratio: string }) {
  return <div className="stage-placeholder" style={{ "--ratio": ratio } as CSSProperties} aria-hidden="true" />;
}
