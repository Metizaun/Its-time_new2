/**
 * Thin wrapper over the Umami tracker (loaded in app/layout.tsx). It does nothing when Umami is not configured
 * or has not loaded yet, so calling it never breaks the page.
 */
type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiEventData) => void };
  }
}

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;

export function track(event: string, data?: UmamiEventData) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    // analytics must never throw into the page
  }
}
