import Link from "next/link";

export function LegalLinks() {
  return (
    <nav
      aria-label="Documentos legais"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-gray-600)]"
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gray-500)]">
        Documentos legais
      </span>
      <Link
        href="/politica-de-privacidade"
        className="transition-colors hover:text-[var(--color-primary-600)] focus-visible:shadow-focus"
      >
        Privacidade
      </Link>
      <Link
        href="/termos-de-uso"
        className="transition-colors hover:text-[var(--color-primary-600)] focus-visible:shadow-focus"
      >
        Termos de uso
      </Link>
      <Link
        href="/exclusao-de-dados"
        className="transition-colors hover:text-[var(--color-primary-600)] focus-visible:shadow-focus"
      >
        Exclusão de dados
      </Link>
    </nav>
  );
}
