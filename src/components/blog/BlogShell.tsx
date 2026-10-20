import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  MessageSquare,
  Workflow,
  CalendarDays,
  Check,
} from "lucide-react";
import { whatsappLinkProps, DEMO_MESSAGE } from "@/lib/whatsapp";
import type { BlogCover, BlogPost } from "@/lib/blog";

export function BlogHeader() {
  return (
    <header className="blog-header">
      <Link className="brand" href="/" aria-label="Its Time — início">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="brand-word">Its Time</span>
      </Link>
      <nav aria-label="Navegação principal">
        <Link href="/#como-funciona">Soluções</Link>
        <Link href="/blog" aria-current="page">
          Blog
        </Link>
        <a
          className="blog-button"
          {...whatsappLinkProps()}
          data-blog-cta="header"
          data-article="blog"
        >
          Agendar Demo <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  );
}

export function BlogCTA({
  title = "Sua próxima estratégia começa com uma conversa.",
  text = "Veja como conectar atendimento, acompanhamento e vendas na rotina do seu negócio.",
  label = "Agendar demonstração",
  source,
  compact = false,
  position = "page-end",
}: {
  title?: string;
  text?: string;
  label?: string;
  source?: string;
  compact?: boolean;
  position?: string;
}) {
  const message = source
    ? `${DEMO_MESSAGE}\n\nArtigo que me trouxe aqui: ${source}`
    : undefined;
  return (
    <section
      className={`blog-cta ${compact ? "blog-cta--compact" : ""}`}
      aria-label="Conheça a Its Time"
    >
      <span className="blog-kicker">DA IDEIA À OPERAÇÃO</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <a
        className="blog-button"
        {...whatsappLinkProps(message)}
        data-blog-cta={position}
        data-article={source ?? "blog"}
      >
        {label}
        <ArrowUpRight size={18} />
      </a>
      <small>Uma conversa sobre o seu negócio. Direto no WhatsApp.</small>
    </section>
  );
}

/**
 * Foto de capa no mesmo molde da `BlogArt` (mesmo tamanho, listagem e destaque iguais). `unoptimized`: as
 * fotos ja chegam em WebP leve, com nome versionado (cache longo) e podem ser /caminho do site ou https.
 * `decorative` (cards/destaque): o titulo ao lado ja diz o assunto, entao a imagem nao repete o alt.
 */
export function BlogCoverImage({
  cover,
  large = false,
  decorative = false,
  priority = false,
}: {
  cover: BlogCover;
  large?: boolean;
  decorative?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className={`blog-cover ${large ? "blog-cover--large" : ""}`}>
      <div className="blog-cover-image">
        <Image
          src={cover.src}
          alt={decorative ? "" : cover.alt}
          fill
          sizes={
            large
              ? "(max-width: 1024px) 100vw, 1200px"
              : "(max-width: 768px) 100vw, 380px"
          }
          preload={priority}
          unoptimized
          style={{ objectFit: !decorative ? (cover.fit ?? "cover") : "cover" }}
        />
      </div>
      {!decorative && (cover.caption || cover.credit) && (
        <figcaption className="blog-cover-caption">
          <span>{cover.caption}</span>
          {cover.credit && (
            <span>
              Crédito:{" "}
              {cover.sourceUrl ? (
                <a
                  href={cover.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cover.credit}
                </a>
              ) : (
                cover.credit
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** A foto de capa do artigo quando existe; senao a arte em CSS do blog (o padrao de antes). */
export function BlogVisual({
  post,
  large = false,
  decorative = false,
  priority = false,
}: {
  post: Pick<BlogPost, "art" | "cover">;
  large?: boolean;
  decorative?: boolean;
  priority?: boolean;
}) {
  return post.cover ? (
    <BlogCoverImage
      cover={post.cover}
      large={large}
      decorative={decorative}
      priority={priority}
    />
  ) : (
    <BlogArt variant={post.art} large={large} />
  );
}

export function BlogArt({
  variant,
  large = false,
}: {
  variant: BlogPost["art"];
  large?: boolean;
}) {
  const Icon =
    variant === "schedule"
      ? CalendarDays
      : variant === "journey"
        ? Workflow
        : MessageSquare;
  const words =
    variant === "schedule"
      ? ["Interesse recebido", "Agenda conectada", "Horário confirmado"]
      : variant === "journey"
        ? ["Orçamento enviado", "Acompanhamento", "Próximo passo"]
        : ["Conversa iniciada", "Contexto organizado", "Equipe conectada"];
  return (
    <div
      className={`blog-art blog-art--${variant} ${large ? "blog-art--large" : ""}`}
      aria-hidden="true"
    >
      <div className="blog-art-grid" />
      <span className="blog-art-caption">
        ITS TIME / INTELIGÊNCIA EM MOVIMENTO
      </span>
      <div className="blog-art-flow">
        <div className="blog-art-node">
          <Icon size={22} />
          <span>{words[0]}</span>
        </div>
        <span className="blog-art-connector" />
        <div className="blog-art-hub">
          <Workflow size={28} />
        </div>
        <span className="blog-art-connector" />
        <div className="blog-art-node">
          <Check size={20} />
          <span>{words[2]}</span>
        </div>
      </div>
      <div className="blog-art-note">
        <span />
        {words[1]}
        <ArrowRight size={14} />
      </div>
      <span className="blog-art-index">
        {variant === "conversation"
          ? "01"
          : variant === "journey"
            ? "02"
            : "03"}{" "}
        / CONECTAR. ORGANIZAR. CRESCER.
      </span>
    </div>
  );
}

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <Link href="/" className="brand-word">
        Its Time
      </Link>
      <span>Inteligência que opera. Estratégia que escala.</span>
      <nav aria-label="Links institucionais">
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/termos">Termos de uso</Link>
      </nav>
    </footer>
  );
}
