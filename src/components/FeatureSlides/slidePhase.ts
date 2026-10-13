export type SlidePhase = "hidden" | "fading" | "active";

/**
 * Where a pinned slide is in its crossfade. A story should only start once the slide has settled
 * ("active"); while it is still fading in or out the scene holds, and it only rewinds once the slide is
 * fully hidden. Without this, a scene keeps playing while it is invisible and arrives half-told.
 */
export function slidePhase(element: Element | null | undefined): SlidePhase {
  const slide = element?.closest("[data-feature-slide]");
  if (!slide) return "active";
  const style = getComputedStyle(slide);
  if (style.visibility === "hidden") return "hidden";
  return Number.parseFloat(style.opacity) >= 0.92 ? "active" : "fading";
}
