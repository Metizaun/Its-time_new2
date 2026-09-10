"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10 focus-visible:shadow-focus focus-visible:outline-none"
      aria-label={copied ? "Código copiado" : "Copiar código"}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
