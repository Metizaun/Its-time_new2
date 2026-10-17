"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, Link2 } from "lucide-react";

const subscribe = () => () => {};

export function ArticleNavigation({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -45% 0px" },
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <div className="blog-toc">
      <span className="blog-kicker">NESTE ARTIGO</span>
      <nav aria-label="Sumário do artigo">
        {sections.map(({ id, title }, index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {title}
          </a>
        ))}
      </nav>
      <button
        type="button"
        disabled={!ready}
        onClick={copy}
        className="blog-share"
        aria-label={copied ? "Link copiado" : "Copiar link do artigo"}
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
        <span role="status">
          {copied ? "Link copiado" : "Copiar link do artigo"}
        </span>
      </button>
      {error && (
        <p role="alert">Copie o endereço do artigo na barra do navegador.</p>
      )}
    </div>
  );
}
