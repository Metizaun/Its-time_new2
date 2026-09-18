import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LegalLinks } from "@/components/LegalLinks";

const releaseItems = [
  {
    category: "Novidade",
    tag: "CHAT INTERNO",
    icon: "/update-icons/feature.png",
    title: "A equipe agora conversa onde o trabalho acontece.",
    paragraphs: [
      "Administradores e vendedores podem iniciar conversas diretas, criar grupos, mencionar pessoas, compartilhar anexos e acompanhar mensagens não lidas em tempo real dentro do próprio CRM. Cada conversa respeita os limites da empresa, mantendo a comunicação interna separada do atendimento aos clientes.",
    ],
  },
  {
    category: "Novidade",
    tag: "COBRANÇA INDEPENDENTE",
    icon: "/update-icons/feature.png",
    title: "A operação financeira deixou de depender de uma única origem.",
    paragraphs: [
      "O novo módulo de Cobrança permite receber dados financeiros pela integração RB, por webhook ou pela importação de arquivos CSV e XLSX. Cada fonte pode ter suas próprias regras, empresa, configuração de Pix, WhatsApp de envio, pipeline e mensagem inicial.",
      "O sistema também organiza o processo de ativação, apresenta pendências de configuração e mantém um histórico das importações e execuções. Proteções contra duplicidade, reprocessamentos e eventos fora de ordem tornam a cobrança mais previsível e auditável.",
    ],
  },
  {
    category: "Novidade",
    tag: "SINCRONIZAÇÃO DE AGENDA",
    icon: "/update-icons/feature.png",
    title: "Agendas diferentes agora podem operar sob o mesmo contrato.",
    paragraphs: [
      "A nova infraestrutura prepara o Its Time para conectar agendas de parceiros e sincronizar pacientes, profissionais, unidades e agendamentos em duas direções.",
      "Cada conexão pode compartilhar todas as agendas ou somente unidades, locais e profissionais selecionados. O fluxo contempla controle de sequência, novas tentativas, tratamento de falhas e ressincronização, preservando os eventos até que possam ser processados corretamente.",
    ],
  },
  {
    category: "Melhoria",
    tag: "CENTRAL DE CONEXÕES",
    icon: "/update-icons/improvement.png",
    title: "Canais e integrações agora fazem parte do mesmo mapa operacional.",
    paragraphs: [
      "A área de Conexões passa a reunir canais de atendimento, fontes financeiras e parceiros de Agenda. Isso aproxima a configuração técnica da rotina administrativa e torna mais claro o que está conectado, ativo ou aguardando configuração.",
    ],
  },
  {
    category: "Melhoria",
    tag: "ATENDIMENTO",
    icon: "/update-icons/improvement.png",
    title: "A continuidade do atendimento também depende dos detalhes.",
    paragraphs: [
      "Foram adicionadas melhorias no encaminhamento de áudios, no roteamento de templates e na compatibilidade entre provedores de mensagens. O classificador também passou a distinguir contatos atendidos que ainda não possuem qualificação comercial, mantendo o pipeline mais próximo da realidade.",
    ],
  },
  {
    category: "Melhoria",
    tag: "SEGURANÇA OPERACIONAL",
    icon: "/update-icons/improvement.png",
    title: "Conectar mais sistemas exige controlar melhor os limites.",
    paragraphs: [
      "As novas funcionalidades adotam isolamento por empresa, autorização administrativa, proteção de credenciais, assinatura de eventos e trilhas de auditoria.",
      "A infraestrutura de produção também recebeu processos independentes para API, Cobrança e Agenda, além de backups verificáveis e validações automáticas do banco. A operação ganha autonomia sem perder controle ou capacidade de recuperação.",
    ],
  },
] as const;

export default function UpdatesPage() {
  return (
    <div className="release-page">
      <header className="release-topbar">
        <div className="release-topbar-inner">
          <Link className="release-back" href="/">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
            Voltar
          </Link>

          <Link className="release-brand" href="/" aria-label="Its Time — página inicial">
            <Image
              src="/assets/brand/its-time-mark-transparent-clean.png"
              alt=""
              width={48}
              height={48}
              priority
            />
            <span>Its Time</span>
          </Link>

          <span className="release-topbar-label">Release notes &amp; updates</span>
        </div>
      </header>

      <main className="release-shell">
        <div className="release-kicker">
          <span>Updates do produto</span>
          <span>Its Time CRM</span>
        </div>

        <article className="release-entry" aria-labelledby="release-title">
          <aside className="release-meta" aria-label="Informações da versão">
            <div className="release-version-row">
                <strong>v2.7.0</strong>
              <span className="release-current">Atual</span>
            </div>
              <time dateTime="2026-09-15">15 de Setembro, 2026</time>
            <span className="release-type">Minor update</span>
          </aside>

          <div className="release-content">
            <header className="release-heading">
              <h1 id="release-title">Três fluxos. Uma operação mais coordenada.</h1>
              <p>
                Quando conversa, cobrança e agenda funcionam separadamente, o time perde
                contexto antes de perder tempo. Desde 02 de setembro, o Its Time avançou em
                três frentes centrais: comunicação interna, operação financeira e integração
                de agendas — agora sustentadas por uma estrutura mais segura, organizada e
                rastreável.
              </p>
            </header>

            <div className="release-items">
              {releaseItems.map((item) => (
                <section className="release-item" key={item.tag}>
                  <Image
                    className="release-item-icon"
                    src={item.icon}
                    alt=""
                    width={64}
                    height={64}
                  />

                  <div className="release-item-content">
                    <div className="release-item-meta">
                      <span
                        className={
                          item.category === "Novidade"
                            ? "release-badge release-badge-feature"
                            : "release-badge release-badge-improvement"
                        }
                      >
                        {item.category}
                      </span>
                      <span className="release-item-tag">{item.tag}</span>
                    </div>

                    <h2>{item.title}</h2>
                    <div className="release-item-copy">
                      {item.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <section className="release-closing" aria-labelledby="release-closing-title">
              <span>Em resumo</span>
              <h2 id="release-closing-title">
                Mais recursos não precisam produzir mais complexidade.
              </h2>
              <p>
                Esta atualização organiza três fluxos essenciais em torno da mesma lógica:
                contexto para a equipe, autonomia para a cobrança e interoperabilidade para a
                agenda. A tecnologia cresce, mas a operação fica mais clara.
              </p>
            </section>
          </div>
        </article>

        <footer className="release-footer">
          <p>© 2026 Its Time CRM. Todos os direitos reservados.</p>
          <div className="release-footer-links">
            <Link href="/">
              Página inicial
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </Link>
            <LegalLinks />
          </div>
        </footer>
      </main>
    </div>
  );
}
