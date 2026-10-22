"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OPEN_COOKIE_PREFERENCES, readConsent, saveConsent } from "@/lib/analytics";

/** LGPD cookie banner: Google Analytics stays in consent-denied mode until the visitor accepts. */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES, reopen);
  }, []);

  if (!open) return null;

  function choose(value: "granted" | "denied") {
    saveConsent(value);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-[var(--color-surface-1)] p-4 shadow-lg sm:p-5"
    >
      <p className="text-sm text-[var(--color-gray-800)]">
        Usamos cookies do Google Analytics para entender como o site é usado e melhorá-lo. Você pode aceitar ou recusar;
        o site funciona igual nos dois casos. Saiba mais na{" "}
        <Link className="font-semibold text-[var(--color-primary-600)] underline underline-offset-4" href="/politica-de-privacidade#contato">
          Política de privacidade
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-[var(--color-gray-800)] transition-colors hover:bg-[var(--color-surface-2)] focus-visible:shadow-focus focus-visible:outline-none"
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-lg bg-[var(--color-primary-500)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the cookie banner. */
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES))}
      className="cursor-pointer text-left [font:inherit] [color:inherit] hover:underline"
    >
      Preferências de cookies
    </button>
  );
}
