// Ilustração própria (sem marcas de terceiros) das telas que a janela da Meta
// mostra durante a conexão. Esquemática de propósito: a Meta muda os detalhes
// visuais com frequência, e o que importa é a ordem dos passos.
const steps = [
  { title: "Entrar", caption: "Entre com o Facebook de quem administra a empresa.", lines: ["field", "field", "button"] },
  { title: "Empresa", caption: "Escolha o portfólio da sua empresa ou crie um novo.", lines: ["option", "option", "button"] },
  { title: "Conta do WhatsApp", caption: "Crie a conta do WhatsApp Business e o nome que o cliente vai ver.", lines: ["field", "field", "button"] },
  { title: "Número", caption: "Informe o número e digite o código que chega por SMS ou ligação.", lines: ["field", "code", "button"] },
  { title: "Permissões", caption: "Confirme o acesso da Its Time e conclua.", lines: ["check", "check", "button"] },
] as const;

type Line = (typeof steps)[number]["lines"][number];

function Sketch({ line }: { line: Line }) {
  if (line === "button") return <span className="mt-1 block h-5 w-2/3 self-end rounded-md bg-[var(--color-primary-500)]" />;
  if (line === "code")
    return (
      <span className="flex gap-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="h-5 flex-1 rounded border border-[var(--border-default)] bg-[var(--color-surface-1)]" />
        ))}
      </span>
    );
  if (line === "option")
    return (
      <span className="flex items-center gap-2 rounded-md border border-[var(--border-default)] px-2 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full border border-[var(--color-gray-400)]" />
        <span className="h-1.5 flex-1 rounded bg-[var(--color-bg-muted)]" />
      </span>
    );
  if (line === "check")
    return (
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-[var(--color-primary-500)]" />
        <span className="h-1.5 flex-1 rounded bg-[var(--color-bg-muted)]" />
      </span>
    );
  return <span className="block h-5 rounded-md border border-[var(--border-default)] bg-[var(--color-surface-1)]" />;
}

export function MetaWindowSteps() {
  return (
    <figure className="mt-6">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--color-surface-1)] shadow-sm">
            <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-gray-400)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-gray-400)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-gray-400)]" />
              <span className="ml-2 h-1.5 flex-1 rounded bg-[var(--color-bg-muted)]" />
            </div>
            <div aria-hidden="true" className="flex flex-col gap-2 px-4 pb-3 pt-4">
              <span className="h-2 w-1/2 rounded bg-[var(--color-gray-400)]" />
              {step.lines.map((line, lineIndex) => (
                <Sketch key={lineIndex} line={line} />
              ))}
            </div>
            <div className="mt-auto border-t border-[var(--border-subtle)] px-4 py-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-600)]">
                Tela {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-gray-900)]">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">{step.caption}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs text-[var(--color-gray-500)]">
        Ilustração das telas da janela da Meta. A aparência real pode variar.
      </figcaption>
    </figure>
  );
}
