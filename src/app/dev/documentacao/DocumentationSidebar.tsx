import Link from "next/link";

type DocumentationSidebarProps = {
  currentPath: string;
  sections: readonly (readonly [string, string])[];
};

const documentationLinks = [
  { href: "/dev/documentacao/agenda", label: "Agenda Universal", meta: "Sincronização" },
  { href: "/dev/documentacao/webhook-leads", label: "Webhook de leads", meta: "Entrada CRM" },
  { href: "/dev/documentacao/webhook-cobranca", label: "Webhook de cobrança", meta: "Coleções" },
] as const;

export function DocumentationSidebar({ currentPath, sections }: DocumentationSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <nav
        aria-label="Documentação"
        className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4 shadow-sm"
      >
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">
          Documentação
        </p>
        <ul className="grid gap-1">
          {documentationLinks.map((item) => {
            const isCurrent = item.href === currentPath;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex min-h-11 items-center justify-between gap-3 border-l-2 px-3 py-2 text-sm transition-colors focus-visible:shadow-focus focus-visible:outline-none ${
                    isCurrent
                      ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)] font-semibold text-[var(--color-primary-700)]"
                      : "border-transparent text-[var(--color-gray-600)] hover:border-[var(--border-default)] hover:bg-white hover:text-[var(--color-gray-900)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isCurrent ? (
                    <span className="rounded-full bg-[var(--color-primary-100)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-700)]">
                      Atual
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-gray-400)]">
                      {item.meta}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label="Nesta página"
        className="rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-2)] p-4 shadow-sm"
      >
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">
          Nesta página
        </p>
        <ol className="grid gap-1">
          {sections.map(([id, title], index) => (
            <li key={id}>
              <a
                href={`#${id}`}
                data-doc-section-id={id}
                className="flex min-h-10 items-center rounded-lg px-2 py-2 text-sm text-[var(--color-gray-600)] transition-colors hover:bg-white hover:text-[var(--color-primary-600)] focus-visible:shadow-focus focus-visible:outline-none"
              >
                <span className="mr-2 font-mono text-xs text-[var(--color-gray-400)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
