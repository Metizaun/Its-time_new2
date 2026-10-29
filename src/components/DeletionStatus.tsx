"use client";

import { useEffect, useState, type FormEvent } from "react";

const STATUS_API = "https://api.itstime.pro/api/meta/data-deletion/";
const CODE_PATTERN = /^[A-Z2-7]{12}$/;

const statusLabels: Record<string, string> = {
  received: "Recebido. Seu pedido está na fila e será atendido em até 15 dias.",
  in_progress: "Em andamento. Estamos excluindo os seus dados.",
  completed: "Concluído. Os seus dados foram excluídos.",
  rejected: "Não foi possível concluir. Entre em contato pelo e-mail abaixo.",
};

type Result = { kind: "ok"; text: string; date: string } | { kind: "error"; text: string } | null;

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR");
}

/** Status lookup for a Meta data deletion confirmation code (?codigo=). */
export function DeletionStatus() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(raw: string) {
    const normalized = raw.trim().toUpperCase();
    if (!CODE_PATTERN.test(normalized)) {
      setResult({ kind: "error", text: "O código tem 12 letras e números. Confira e tente de novo." });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(STATUS_API + normalized, { cache: "no-store" });
      if (response.status === 404) {
        setResult({ kind: "error", text: "Não encontramos um pedido com esse código." });
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { status?: string; requested_at?: string };
      setResult({
        kind: "ok",
        text: statusLabels[data.status ?? ""] ?? "Pedido encontrado.",
        date: data.requested_at ? formatDate(data.requested_at) : "",
      });
    } catch {
      setResult({ kind: "error", text: "Não foi possível consultar agora. Tente de novo em alguns minutos." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("codigo");
    if (fromUrl) {
      const frame = window.requestAnimationFrame(() => {
        setCode(fromUrl);
        void lookup(fromUrl);
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void lookup(code);
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-[var(--color-surface-2)] p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-[var(--color-gray-700)]" htmlFor="deletion-code">
          Código de confirmação
          <input
            id="deletion-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={12}
            autoComplete="off"
            className="rounded-lg border border-border bg-[var(--color-surface-1)] px-3 py-2 font-mono text-sm uppercase tracking-wider text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--color-primary-500)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)] focus-visible:shadow-focus disabled:opacity-60"
        >
          {loading ? "Consultando…" : "Consultar"}
        </button>
      </form>
      {result && (
        <p
          role="status"
          className={
            "mt-3 text-sm " +
            (result.kind === "ok" ? "text-[var(--color-gray-800)]" : "font-medium text-[var(--color-primary-700)]")
          }
        >
          {result.text}
          {result.kind === "ok" && result.date ? ` Pedido feito em ${result.date}.` : ""}
        </p>
      )}
    </div>
  );
}
