"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Send, X } from "lucide-react";
import {
  CURRENT_RELEASE_PUBLISH_AT,
  CURRENT_RELEASE_VERSION,
} from "@/lib/releaseSchedule";

const DISMISS_KEY = `its-time:update-announcement:${CURRENT_RELEASE_VERSION}`;

function hasDismissedAnnouncement() {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "dismissed";
  } catch {
    return false;
  }
}

export function UpdateAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeAnnouncement = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "dismissed");
    } catch {
      // A private browsing policy must not prevent closing the dialog.
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    const syncAnnouncement = () => {
      if (Date.now() >= CURRENT_RELEASE_PUBLISH_AT && !hasDismissedAnnouncement()) {
        setIsOpen(true);
        return;
      }

      const remaining = Math.max(1_000, CURRENT_RELEASE_PUBLISH_AT - Date.now());
      timer = window.setTimeout(syncAnnouncement, Math.min(remaining, 60_000));
    };

    syncAnnouncement();
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAnnouncement();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "button, a[href]",
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [closeAnnouncement, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="update-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAnnouncement();
      }}
    >
      <div
        ref={dialogRef}
        className="update-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
        tabIndex={-1}
      >
        <div className="update-modal-header">
          <div className="update-modal-kicker">
            <span className="update-modal-kicker-line" aria-hidden="true" />
            Nova atualização
          </div>
          <button
            type="button"
            className="update-modal-close"
            onClick={closeAnnouncement}
            aria-label="Fechar aviso de atualização"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="update-modal-body">
          <div className="update-modal-icon" aria-hidden="true">
            <Send size={22} strokeWidth={1.8} />
          </div>
          <p className="update-modal-eyebrow">Instagram + Its Time CRM</p>
          <h2 id="update-modal-title">Conversas que chegam mais perto.</h2>
          <p id="update-modal-description" className="update-modal-description">
            O Instagram agora faz parte da operação do Its Time. Conecte sua
            conta profissional, receba mensagens no histórico do lead e
            responda com texto, imagem ou áudio pelo CRM.
          </p>

          <ul className="update-modal-list">
            <li>Conexão segura com sua conta profissional.</li>
            <li>Histórico de conversas e mídias em um só lugar.</li>
            <li>Roteamento por empresa e instância, sem misturar operações.</li>
          </ul>
        </div>

        <div className="update-modal-footer">
          <button type="button" className="update-modal-secondary" onClick={closeAnnouncement}>
            Agora não
          </button>
          <Link href="/updates" className="update-modal-primary" onClick={closeAnnouncement}>
            Ver atualizações
            <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
