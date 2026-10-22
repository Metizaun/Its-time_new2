/**
 * Thin wrapper over the Umami tracker and Google Analytics 4 (both loaded in app/layout.tsx). Every event goes
 * to each configured tool; it does nothing when none is configured or loaded yet, so it never breaks the page.
 */
type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiEventData) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function track(event: string, data?: UmamiEventData) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
    window.gtag?.("event", event, data);
  } catch {
    // analytics must never throw into the page
  }
}

export const CONSENT_STORAGE_KEY = "itstime-cookie-consent";
export const OPEN_COOKIE_PREFERENCES = "itstime:open-cookie-preferences";

export function readConsent(): "granted" | "denied" | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // private mode: the choice lasts only for this page view
  }
  window.gtag?.("consent", "update", { analytics_storage: value });
}
