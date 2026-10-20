import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Info } from "lucide-react";
import { BlogCTA, BlogVisual } from "./BlogShell";
import { ArticleNavigation } from "./ArticleNavigation";
import { InlineText } from "./InlineText";
import {
  postDate,
  readingMinutes,
  type BlogPost,
  type BlogBlock,
} from "@/lib/blog";

function ContentBlock({
  block,
  post,
  allPosts,
  index,
}: {
  block: BlogBlock;
  post: BlogPost;
  allPosts: BlogPost[];
  index: number;
}) {
  const paragraphs = (values: string[]) =>
    values.map((text, i) => (
      <p key={i}>
        <InlineText text={text} />
      </p>
    ));
  switch (block.type) {
    case "text":
      return (
        <section id={block.id} className="blog-content-section">
          <h2>{block.title}</h2>
          {paragraphs(block.paragraphs)}
          {block.subsections?.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              {paragraphs(section.paragraphs)}
            </div>
          ))}
        </section>
      );
    case "steps":
      return (
        <section id={block.id} className="blog-content-section">
          <h2>{block.title}</h2>
          <ol className="blog-steps">
            {block.items.map((item, i) => (
              <li key={item.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    <InlineText text={item.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    case "checklist":
      return (
        <section id={block.id} className="blog-content-section blog-checklist">
          <span className="blog-kicker">PARA COLOCAR EM PRÁTICA</span>
          <h2>{block.title}</h2>
          <ul>
            {block.items.map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden="true" />
                <span>
                  <InlineText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "quote":
      return (
        <figure className="blog-quote">
          <blockquote>
            <InlineText text={block.text} />
          </blockquote>
          <figcaption>
            <InlineText text={block.caption} />
          </figcaption>
        </figure>
      );
    case "cta":
      return (
        <BlogCTA
          compact
          source={post.title}
          position={`inline-${index}`}
          title={block.title}
          text={block.text}
          label={block.label}
        />
      );
    case "image":
      return (
        <figure className="blog-figure">
          <a
            href={block.src}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-figure-link"
            aria-label={`Ampliar imagem: ${block.alt}`}
          >
            <div
              className="blog-figure-frame"
              style={{
                aspectRatio: `${block.width ?? 3} / ${block.height ?? 2}`,
              }}
            >
              <Image
                src={block.src}
                alt={block.alt}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                unoptimized
                style={{ objectFit: block.fit ?? "contain" }}
              />
            </div>
          </a>
          {(block.caption || block.credit) && (
            <figcaption>
              <span>
                {block.caption && <InlineText text={block.caption} />}
                {block.credit && (
                  <small>
                    Crédito:{" "}
                    {block.sourceUrl ? (
                      <a
                        href={block.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {block.credit}
                      </a>
                    ) : (
                      block.credit
                    )}
                  </small>
                )}
              </span>
            </figcaption>
          )}
        </figure>
      );
    case "table":
      return (
        <section id={block.id} className="blog-content-section">
          <h2>{block.title}</h2>
          <div
            className="blog-table-scroll"
            tabIndex={0}
            role="region"
            aria-label={block.title}
          >
            <table className="blog-table">
              {block.caption && (
                <caption>
                  <InlineText text={block.caption} />
                </caption>
              )}
              <thead>
                <tr>
                  {block.columns.map((column, i) => (
                    <th scope="col" key={i}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) =>
                      j === 0 ? (
                        <th scope="row" key={j}>
                          <InlineText text={cell} />
                        </th>
                      ) : (
                        <td key={j}>
                          <InlineText text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case "callout":
      return (
        <aside
          className={`blog-callout blog-callout--${block.tone ?? "note"}`}
          aria-label={block.title}
        >
          <Info size={18} aria-hidden="true" />
          <div>
            <h3>{block.title}</h3>
            <p>
              <InlineText text={block.text} />
            </p>
          </div>
        </aside>
      );
    case "verdict":
      return (
        <section id={block.id} className="blog-content-section blog-verdict">
          <span className="blog-kicker">{block.label}</span>
          <h2>{block.title}</h2>
          {block.price && <p className="blog-verdict-price">{block.price}</p>}
          <div className="blog-verdict-columns">
            <div>
              <h3>Pontos favoráveis</h3>
              <ul>
                {block.pros.map((item) => (
                  <li key={item}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Limites e cuidados</h3>
              <ul>
                {block.cons.map((item) => (
                  <li key={item}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p>
            <strong>Recomendação: </strong>
            <InlineText text={block.recommendation} />
          </p>
        </section>
      );
    case "related": {
      const articles = block.slugs
        .flatMap((slug) => {
          const item = allPosts.find(
            (candidate) =>
              candidate.slug === slug && candidate.slug !== post.slug,
          );
          return item ? [item] : [];
        })
        .slice(0, 2);
      return articles.length ? (
        <aside
          className="blog-inline-related"
          aria-label={block.title ?? "Leia também"}
        >
          <span className="blog-kicker">{block.title ?? "Leia também"}</span>
          {articles.map((item) => (
            <Link href={`/blog/${item.slug}`} key={item.slug}>
              {item.title}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </aside>
      ) : null;
    }
    case "faq":
      return (
        <section id={block.id} className="blog-content-section blog-faq">
          <h2>{block.title}</h2>
          {block.items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>
                <InlineText text={item.answer} />
              </p>
            </details>
          ))}
        </section>
      );
  }
}

export function BlogArticle({
  post,
  related,
  allPosts,
}: {
  post: BlogPost;
  related: BlogPost[];
  allPosts: BlogPost[];
}) {
  const sections = post.blocks.flatMap((block) =>
    "id" in block ? [{ id: block.id, title: block.title }] : [],
  );
  const author = post.authorProfile ?? { name: post.author };
  const showToc = sections.length > 1 && post.archetype !== "noticia";
  return (
    <>
      <div className="blog-reading-progress" aria-hidden="true" />
      <header className="blog-article-header">
        <Link href="/blog" className="blog-back">
          <ArrowLeft size={16} />
          Todos os artigos
        </Link>
        <span className="blog-kicker">{post.category}</span>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="blog-author">
          <span className="blog-author-avatar" aria-hidden="true">
            {author.name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
          <div>
            <strong>
              {author.url ? (
                <a href={author.url}>{author.name}</a>
              ) : (
                author.name
              )}
            </strong>
            {author.role && <small>{author.role}</small>}
            <span>
              <time dateTime={post.date}>{postDate(post.date)}</time>
              <span> · </span>
              <Clock3 size={13} /> {readingMinutes(post)} min de leitura
            </span>
            {post.updated && post.updated !== post.date && (
              <span>
                Atualizado em{" "}
                <time dateTime={post.updated}>{postDate(post.updated)}</time>
              </span>
            )}
          </div>
        </div>
      </header>
      <BlogVisual post={post} large priority />
      <div
        className={`blog-article-grid ${showToc ? "" : "blog-article-grid--single"}`}
      >
        {showToc && (
          <aside>
            <ArticleNavigation sections={sections} />
            {post.editorialNote && (
              <p className="blog-editorial-note">{post.editorialNote}</p>
            )}
          </aside>
        )}
        <article className="blog-prose" aria-label={post.title}>
          <div className="blog-takeaway">
            <span className="blog-kicker">A IDEIA CENTRAL</span>
            <p>
              <InlineText text={post.takeaway} />
            </p>
          </div>
          {post.blocks.map((block, index) => (
            <ContentBlock
              block={block}
              post={post}
              allPosts={allPosts}
              index={index}
              key={"id" in block ? block.id : `${block.type}-${index}`}
            />
          ))}
          {post.sources && post.sources.length > 0 && (
            <section className="blog-sources" aria-label="Fontes e referências">
              <h2>Fontes e referências</h2>
              <ul>
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target={
                        source.url.startsWith("https://") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                    >
                      {source.label}
                      <ArrowUpRight size={14} />
                    </a>
                    {source.note && <p>{source.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <footer className="blog-article-signoff">
            <strong>{author.name}</strong>
            {author.role && <span>{author.role}</span>}
            {author.bio && <p>{author.bio}</p>}
            {!showToc && post.editorialNote && <p>{post.editorialNote}</p>}
          </footer>
        </article>
      </div>
      <BlogCTA source={post.title} position="article-end" {...post.finalCta} />
      {related.length > 0 && (
        <section className="blog-related">
          <span className="blog-kicker">A CONVERSA CONTINUA</span>
          <h2>Continue neste assunto.</h2>
          <div>
            {related.map((item) => (
              <Link href={`/blog/${item.slug}`} key={item.slug}>
                <span className="blog-kicker">{item.category}</span>
                <h3>{item.title}</h3>
                <span className="blog-text-link">
                  Ler artigo <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
