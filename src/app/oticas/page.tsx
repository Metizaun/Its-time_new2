import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroLens } from "@/components/solutions/oticas/HeroLens";
import { Journey } from "@/components/solutions/oticas/Journey";
import { opticsAfterSale, opticsGuardrails, opticsSolution as page } from "@/lib/solutions/oticas";
import { JsonLd, ORGANIZATION_ID, SITE_URL, breadcrumbList } from "@/lib/structured-data";
import { whatsappLinkProps } from "@/lib/whatsapp";
import "@/styles/oticas.css";

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: page.path },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: page.path,
    type: "website",
  },
};

const service = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${page.path}#service`,
  name: page.title,
  serviceType: "Atendimento com IA e CRM para óticas",
  description: page.metaDescription,
  url: `${SITE_URL}${page.path}`,
  inLanguage: "pt-BR",
  provider: { "@id": ORGANIZATION_ID },
  areaServed: { "@type": "Country", name: "Brasil" },
  audience: { "@type": "BusinessAudience", audienceType: "Óticas" },
  availableChannel: {
    "@type": "ServiceChannel",
    name: "WhatsApp comercial",
    serviceUrl: whatsappLinkProps(page.message).href,
  },
};

const navItems = [
  { label: "Como funciona", href: "#jornada" },
  { label: "Blog", href: "/blog" },
  { label: "Login", href: "https://app.itstime.pro" },
] as const;

const cta = whatsappLinkProps(page.message);

export default function OpticsPage() {
  return (
    <>
      <JsonLd data={service} />
      <JsonLd data={breadcrumbList([{ name: "Início", path: "/" }, { name: "Óticas" }])} />

      <main className="otc">
        <section className="otc-hero" aria-labelledby="otc-title">
          <div className="otc-hero-wash" aria-hidden="true" />
          <header className="site-header otc-header">
            <Link className="brand" href="/" aria-label="Its Time — início">
              <span className="brand-mark" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="brand-word">Its Time</span>
            </Link>
            <div className="brand-divider" aria-hidden="true" />
            <p className="brand-tagline">IA QUE ORGANIZA. ESTRATÉGIA QUE MULTIPLICA.</p>
            <nav className="main-nav" aria-label="Navegação principal">
              {navItems.map((item) => (
                <a href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
              <a className="demo-button demo-button-header" {...cta}>
                <span className="demo-label-full">Agendar Demo</span>
                <span className="demo-label-short" aria-hidden="true">
                  Demo
                </span>
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </a>
            </nav>
            <details className="mobile-nav">
              <summary aria-label="Abrir menu">
                <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
              </summary>
              <nav className="mobile-nav-panel" aria-label="Menu">
                {navItems.map((item) => (
                  <a href={item.href} key={item.label}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </details>
          </header>

          <div className="otc-hero-grid">
            <div className="otc-hero-copy">
              <nav className="otc-crumbs" aria-label="Você está em">
                <Link href="/">Início</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Óticas</span>
              </nav>
              <div className="eyebrow">
                <span />
                {page.kicker}
              </div>
              <h1 id="otc-title">
                IA de atendimento <span>e CRM para óticas</span>
              </h1>
              <p className="otc-hero-sub">Do “quanto custa a lente?” ao óculos no rosto do cliente.</p>
              <p className="otc-hero-lede">{page.lede}</p>
              <div className="otc-hero-actions">
                <a className="otc-cta" {...cta}>
                  Ver a IA atendendo a minha ótica
                  <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
                </a>
                <a className="otc-link" href="#jornada">
                  <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" />
                  Ver a jornada do cliente
                </a>
              </div>
            </div>
            <HeroLens />
          </div>

          <ul className="otc-hero-facts" aria-label="O que a IA faz">
            {[
              ["Responde", "a qualquer hora, em 4 canais"],
              ["Lê", "a foto da receita"],
              ["Indica", "a armação pelo rosto"],
              ["Retoma", "o orçamento parado"],
            ].map(([verb, rest]) => (
              <li key={verb}>
                <i aria-hidden="true" />
                <b>{verb}</b> {rest}
              </li>
            ))}
          </ul>
        </section>

        <Journey />

        <section className="otc-section otc-guard" aria-labelledby="otc-guard-title">
          <div className="otc-section-head">
            <span className="otc-kicker otc-kicker--ink">O que a IA não faz sozinha</span>
            <h2 id="otc-guard-title">A margem e a receita continuam com a ótica.</h2>
            <p>
              O medo de toda ótica é a IA prometer o que a loja não pode cumprir. Por isso as regras são fixas e valem
              para todo atendimento, em qualquer canal e em qualquer loja.
            </p>
          </div>
          <ul className="otc-guard-list">
            {opticsGuardrails.map((rule, index) => (
              <li className="otc-card" key={rule.title}>
                <span className="otc-card-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{rule.title}</h3>
                <p>{rule.text}</p>
              </li>
            ))}
          </ul>
          <aside className="otc-privacy">
            <ShieldCheck size={22} strokeWidth={2} aria-hidden="true" />
            <p>
              <b>Quem vê a receita?</b> A foto e o resumo ficam na conversa: a equipe que atende aquela loja e o próprio
              cliente. O administrador define quais vendedores veem quais lojas.
            </p>
          </aside>
        </section>

        <section className="otc-after" aria-labelledby="otc-after-title">
          <div className="otc-section-head otc-section-head--dark">
            <span className="otc-kicker">Depois da venda</span>
            <h2 id="otc-after-title">O sistema da loja avisa, a conversa continua.</h2>
            <p>
              Com as{" "}
              <Link href="/dev/documentacao/jornadas-rb">Jornadas RB</Link>, cada evento do pedido no sistema da ótica
              entra no CRM e dispara a mensagem certa, com o texto e o intervalo que você definir.
            </p>
          </div>
          <ol className="otc-after-line">
            {opticsAfterSale.map((item, index) => (
              <li key={item.event} style={{ animationDelay: `${index * 140}ms` }}>
                <span className="otc-after-port" aria-hidden="true" />
                <b>{item.event}</b>
                <p>{item.message}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="otc-section" aria-labelledby="otc-start-title">
          <div className="otc-section-head">
            <span className="otc-kicker otc-kicker--ink">Como começa</span>
            <h2 id="otc-start-title">Quatro passos até a primeira conversa.</h2>
          </div>
          <ol className="otc-start">
            {page.steps.map((step, index) => (
              <li key={step.title}>
                <span className="otc-start-mark" aria-hidden="true" />
                <small>Passo {index + 1}</small>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="otc-section otc-reading" aria-labelledby="otc-reading-title">
          <div className="otc-section-head">
            <span className="otc-kicker otc-kicker--ink">Para ler antes da demonstração</span>
            <h2 id="otc-reading-title">Guias, tutorial e integração.</h2>
          </div>
          <ul className="otc-links">
            {page.links.map((link) => (
              <li key={link.href}>
                <Link className="otc-card otc-link-card" href={link.href}>
                  <small>{link.label}</small>
                  <span>{link.text}</span>
                  <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="otc-section otc-faq" aria-labelledby="otc-faq-title">
          <div className="otc-section-head">
            <span className="otc-kicker otc-kicker--ink">Perguntas frequentes</span>
            <h2 id="otc-faq-title">O que os donos de ótica perguntam.</h2>
          </div>
          <div className="otc-faq-list">
            {page.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="otc-final" aria-labelledby="otc-final-title">
          <span className="otc-kicker">Demonstração pelo WhatsApp</span>
          <h2 id="otc-final-title">
            Veja a IA atendendo <span>a sua ótica.</span>
          </h2>
          <p>Conte quantas lojas você tem e o que quer resolver primeiro. A conversa já começa com a mensagem escrita.</p>
          <a className="otc-cta otc-cta--light" {...cta}>
            Agendar demonstração
            <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
