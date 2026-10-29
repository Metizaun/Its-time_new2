import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { DocumentationSidebar } from "../../dev/documentacao/DocumentationSidebar";
import { MetaWindowSteps } from "./MetaWindowSteps";

export const metadata: Metadata = {
  title: "Conectar o WhatsApp oficial · Tutoriais Its Time",
  description:
    "Passo a passo para conectar o número da sua empresa ao WhatsApp oficial da Meta pelo Its Time CRM.",
  alternates: { canonical: "/tutoriais/whatsapp-oficial" },
};

const sections = [
  ["antes", "Antes de começar"],
  ["abrir", "Abra a conexão"],
  ["codigo", "Nome e código de segurança"],
  ["meta", "Finalize na janela da Meta"],
  ["pagamento", "Número conectado e pagamento"],
  ["app-business", "Já uso o app WhatsApp Business"],
  ["problemas", "Se algo der errado"],
  ["desconectar", "Como desconectar"],
] as const;

const IMAGE_DIR = "/tutoriais/whatsapp-oficial";

// Prints are captured at 2x: shown at half their pixel size so they keep the CRM's real scale.
function Screenshot({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption: string }) {
  const displayWidth = Math.round(width / 2);
  return (
    <figure className="mt-6 flex flex-col items-center">
      <div className="max-w-full overflow-hidden rounded-2xl border border-[var(--border-default)] shadow-sm">
        <Image src={`${IMAGE_DIR}/${src}`} alt={alt} width={width} height={height} sizes={`(min-width: 640px) ${displayWidth}px, 100vw`} style={{ width: displayWidth }} className="block h-auto max-w-full" />
      </div>
      <figcaption className="mt-3 text-center text-xs text-[var(--color-gray-500)]">{caption}</figcaption>
    </figure>
  );
}

function Table({ headers, rows }: { headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-default)]">
    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
      <thead className="bg-[var(--color-surface-2)]"><tr>{headers.map(header => <th key={header} scope="col" className="border-b border-[var(--border-default)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row[0]} className={index % 2 ? "bg-[var(--color-surface-2)]" : "bg-[var(--color-surface-1)]"}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-[var(--border-subtle)] px-4 py-3 align-top leading-6 text-[var(--color-gray-700)]">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="mt-5 rounded-xl border border-[var(--border-default)] bg-[var(--color-primary-50)] p-4"><p className="font-semibold">{title}</p><div className="mt-1 text-sm leading-6 text-[var(--color-gray-700)]">{children}</div></aside>;
}

function Checklist({ items }: { items: readonly ReactNode[] }) {
  return <ul className="space-y-3">{items.map((item, index) => <li key={index} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" /><span>{item}</span></li>)}</ul>;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const index = sections.findIndex(section => section[0] === id);
  return <section id={id} className="scroll-mt-24 border-b border-[var(--border-subtle)] py-10 first:pt-0 last:border-b-0 last:pb-0">
    <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-600)]"><span aria-hidden="true" className="h-0.5 w-5 bg-[var(--color-primary-500)]" />{String(index + 1).padStart(2, "0")} · WhatsApp oficial</p>
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    <div className="mt-4 space-y-4 leading-7 text-[var(--color-gray-700)]">{children}</div>
  </section>;
}

export default function OfficialWhatsAppTutorialPage() {
  return <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-gray-900)] selection:bg-[var(--color-primary-50)]">
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--color-surface-overlay)] backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus-visible:shadow-focus focus-visible:outline-none"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao site</Link>
        <span className="font-mono text-sm font-bold tracking-wider">ITS TIME <span className="text-[var(--color-primary-600)]">/ TUTORIAIS</span></span>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] p-6 shadow-sm sm:p-10 lg:p-14">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary-500)]" aria-hidden="true" />
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">Tutorial · Conexões</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Conectar o WhatsApp oficial</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-gray-600)] sm:text-lg">Ligue o número da sua empresa ao WhatsApp oficial da Meta direto pelo Its Time CRM. Leva poucos minutos e é feito uma única vez.</p>
        <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-gray-600)]">{["Cerca de 10 minutos", "Feito por um administrador", "Computador"].map(label => <span key={label} className="rounded-full border border-[var(--border-default)] bg-[var(--color-surface-2)] px-3 py-2">{label}</span>)}</div>
      </section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <DocumentationSidebar currentPath="/tutoriais/whatsapp-oficial" sections={sections} />
        <article className="min-w-0 rounded-3xl border border-[var(--border-default)] bg-[var(--color-surface-1)] px-5 py-8 shadow-sm sm:px-10 lg:px-12">
          <Section id="antes" title="Antes de começar">
            <p>Separe estes itens. Com eles em mãos, a conexão é feita de uma vez só.</p>
            <Checklist items={[
              <>Acesso de <strong>administrador</strong> no Its Time CRM.</>,
              <>Um <strong>Facebook</strong> de quem administra a empresa na Meta. Se a empresa ainda não tem um portfólio empresarial, ele é criado durante o processo.</>,
              <>O <strong>número</strong> que será conectado, recebendo SMS ou ligação na hora.</>,
              <>Um <strong>cartão de crédito</strong> da empresa para cadastrar na Meta no final.</>,
              <>Um <strong>computador</strong> com janelas pop-up liberadas para app.itstime.pro.</>,
            ]} />
            <Note title="O número já está no WhatsApp?">Se ele está no <strong>app WhatsApp Business</strong>, você pode continuar usando o app: veja a seção <a href="#app-business" className="font-semibold text-[var(--color-primary-600)] underline underline-offset-4">Já uso o app WhatsApp Business</a>. Se ele está no <strong>WhatsApp comum</strong>, apague a conta do WhatsApp nesse número antes de começar.</Note>
          </Section>

          <Section id="abrir" title="Abra a conexão">
            <p>No CRM, vá em <strong>Conexões</strong> e, no card <strong>WhatsApp Oficial</strong>, clique em <strong>Criar conexão</strong>. Se já existe um número oficial, clique em <strong>Gerenciar</strong> e depois em <strong>Conectar número</strong>.</p>
            <Screenshot src="01b-card-oficial.png" alt="Card WhatsApp Oficial na tela de Conexões, com o botão Criar conexão" width={496} height={614} caption="Tela Conexões · card WhatsApp Oficial." />
          </Section>

          <Section id="codigo" title="Nome e código de segurança">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Confira o <strong>nome da conexão</strong>. Ele aparece só para a sua equipe, no CRM.</li>
              <li>Crie um <strong>código de segurança</strong> de seis números. Ele protege o número contra uso por terceiros.</li>
              <li>Clique em <strong>Continuar com a Meta</strong>.</li>
            </ol>
            <Screenshot src="02-preparar.png" alt="Janela WhatsApp oficial com nome da conexão e código de segurança de seis dígitos" width={1008} height={1040} caption="Primeiro passo · nome e código de segurança." />
            <Note title="Guarde o código de segurança">A Meta pede esse código se o número for registrado de novo no futuro. Anote em um lugar seguro da empresa.</Note>
          </Section>

          <Section id="meta" title="Finalize na janela da Meta">
            <p>Uma janela da Meta se abre por cima do CRM. Deixe a tela do CRM aberta e siga as telas até o fim. Elas aparecem nesta ordem:</p>
            <MetaWindowSteps />
            <Screenshot src="04-janela-meta.png" alt="CRM aguardando a conclusão na janela da Meta" width={1008} height={588} caption="Enquanto isso, o CRM espera a janela da Meta terminar." />
            <Note title="O nome de exibição passa por análise">O nome que o cliente vê no WhatsApp precisa ter relação com a sua empresa. A Meta analisa esse nome e pode pedir ajustes.</Note>
          </Section>

          <Section id="pagamento" title="Número conectado e pagamento">
            <Note title="Antes de começar os envios">Confira o guia de <Link href="/tutoriais/whatsapp-boas-praticas" className="font-semibold text-[var(--color-primary-700)] underline underline-offset-4">boas práticas no WhatsApp</Link> para orientar sua equipe sobre autorização, templates e qualidade do atendimento.</Note>
            <p>Quando a janela da Meta fecha, o CRM conclui a conexão sozinho e mostra <strong>Número conectado</strong>. As mensagens dos clientes já passam a chegar no CRM.</p>
            <Screenshot src="05-conectado.png" alt="Confirmação Número conectado com o botão Abrir pagamento" width={1008} height={656} caption="Último passo · número conectado." />
            <p>Clique em <strong>Abrir pagamento</strong> e cadastre o cartão da empresa na Meta. A Meta cobra as conversas direto no seu cartão: o valor não passa pela Its Time.</p>
            <Note title="Sem cartão, você não inicia conversas">Até o cartão ser cadastrado, a Meta bloqueia as mensagens que a empresa inicia, como os modelos de mensagem das automações.</Note>
          </Section>

          <Section id="app-business" title="Já uso o app WhatsApp Business">
            <p>Você pode conectar o número sem largar o app. Ligue a opção <strong>Já uso este número no app WhatsApp Business</strong> antes de continuar. Nesse caso, o código de segurança não é pedido.</p>
            <Screenshot src="03-coexistencia.png" alt="Opção Já uso este número no app WhatsApp Business ligada" width={1008} height={800} caption="Opção para quem já usa o app WhatsApp Business." />
            <p>Na janela da Meta, ela pede para confirmar pelo app WhatsApp Business no celular. Depois disso, as conversas aparecem no app e no CRM.</p>
          </Section>

          <Section id="problemas" title="Se algo der errado">
            <p>O CRM mostra uma frase curta quando algo não dá certo. Veja o que fazer em cada caso:</p>
            <Table headers={["Mensagem no CRM", "O que fazer"]} rows={[
              ["A janela da Meta não abriu", "Libere as janelas pop-up para app.itstime.pro no navegador e clique de novo em Continuar com a Meta."],
              ["A autorização expirou. Tente novamente.", "Comece de novo e conclua a janela da Meta sem pausas longas."],
              ["Autorize todas as permissões pedidas pela Meta.", "Comece de novo e mantenha todas as permissões marcadas na última tela."],
              ["A Meta não confirmou o número. Tente novamente.", "Vá até o fim da janela da Meta, incluindo o código que chega por SMS ou ligação."],
              ["Confira o código de segurança do número.", "O número já tem outro código de segurança. Use o mesmo código ou redefina-o na Meta."],
              ["Esse nome já está em uso. Escolha outro.", "Troque o nome da conexão no primeiro passo."],
              ["Só administradores podem conectar números.", "Peça a um administrador do CRM para fazer a conexão."],
            ]} />
            <p>Fechou a janela da Meta sem querer? Nada é salvo pela metade: o CRM volta ao primeiro passo e você começa de novo.</p>
          </Section>

          <Section id="desconectar" title="Como desconectar">
            <p>No CRM, abra <strong>Conexões → WhatsApp Oficial → Gerenciar</strong> e exclua a conexão. O CRM pergunta o que fazer com os leads dessa conexão antes de concluir.</p>
            <p>Você também pode remover o acesso da Its Time nas configurações do portfólio empresarial na Meta. Para pedir a exclusão dos seus dados, veja <Link href="/exclusao-de-dados" className="font-semibold text-[var(--color-primary-600)] underline underline-offset-4">Exclusão de dados</Link>.</p>
          </Section>
        </article>
      </div>
    </main>
  </div>;
}
