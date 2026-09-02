"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, Image, Route, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import {
  CURRENT_RELEASE_PUBLISH_AT,
  CURRENT_RELEASE_VERSION,
} from "@/lib/releaseSchedule";

const ANNOUNCEMENT_ID = `${CURRENT_RELEASE_VERSION}:editorial-2`;
const DISMISS_KEY = `its-time:update-announcement:${ANNOUNCEMENT_ID}`;

const PAGES = [
  {
    eyebrow: "Instagram + Its Time CRM",
    title: "Conversas que chegam mais perto.",
    description:
      "O Instagram agora faz parte da operação do Its Time. Conecte sua conta profissional, receba mensagens no histórico do lead e responda com texto, imagem ou áudio pelo CRM.",
    items: [
      { icon: Send, text: "Instagram profissional conectado ao fluxo comercial." },
      { icon: Image, text: "Mensagens de texto, imagem e áudio no canal oficial." },
      { icon: ShieldCheck, text: "Histórico de conversas e mídias com conexão segura." },
    ],
  },
  {
    eyebrow: "Operação mais organizada",
    title: "Tudo no contexto certo.",
    description:
      "Também reforçamos a operação diária: cada conversa chega à empresa e à instância corretas, enquanto agenda, handoff e recursos do chat ficam mais consistentes.",
    items: [
      { icon: Route, text: "Roteamento por empresa e instância, sem misturar operações." },
      { icon: CalendarCheck, text: "Agenda e encaminhamento humano preservam o contexto do lead." },
      { icon: Sparkles, text: "Melhorias em mídias, botões, localizador e tempo real." },
    ],
  },
] as const;

function hasDismissedAnnouncement() {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "dismissed";
  } catch {
    return false;
  }
}

export function UpdateAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const currentPage = PAGES[page];

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
        setPage(0);
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
        if (page === 1) closeAnnouncement();
        else event.preventDefault();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
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
  }, [closeAnnouncement, isOpen, page]);

  if (!isOpen) return null;

  const Icon = currentPage.items[0].icon;

  return (
    <div
      className="update-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (page === 1 && event.target === event.currentTarget) closeAnnouncement();
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
          {page === 1 ? (
            <button
              type="button"
              className="update-modal-close"
              onClick={closeAnnouncement}
              aria-label="Fechar aviso de atualização"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="update-modal-body">
          <div className="update-modal-icon" aria-hidden="true">
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <p className="update-modal-eyebrow">{currentPage.eyebrow}</p>
          <h2 id="update-modal-title">{currentPage.title}</h2>
          <p id="update-modal-description" className="update-modal-description">
            {currentPage.description}
          </p>

          <ul className="update-modal-list">
            {currentPage.items.map((item) => (
              <li key={item.text}>
                <item.icon size={15} strokeWidth={2.4} aria-hidden="true" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="update-modal-footer">
          <div className="update-modal-progress" aria-label={`Página ${page + 1} de 2`}>
            <span className={page === 0 ? "is-active" : ""} />
            <span className={page === 1 ? "is-active" : ""} />
          </div>

          {page === 0 ? (
            <button type="button" className="update-modal-primary" onClick={() => setPage(1)}>
              Continuar
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
          ) : (
            <div className="update-modal-actions">
              <button type="button" className="update-modal-secondary" onClick={closeAnnouncement}>
                Agora não
              </button>
              <Link href="/updates" className="update-modal-primary" onClick={closeAnnouncement}>
                Ver atualizações
                <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
