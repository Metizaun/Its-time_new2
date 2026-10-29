"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, ArrowRight } from "lucide-react";
import { BlogVisual } from "./BlogShell";
import { BlogContentNavigation } from "./BlogResources";
import { postDate, type BlogPost } from "@/lib/blog";

export type BlogSummary = Pick<
  BlogPost,
  "slug" | "title" | "excerpt" | "category" | "date" | "art" | "cover"
> & { minutes: number };

const subscribe = () => () => {};

export function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const featured = posts[0];
  const normalized = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = posts.filter(
    (post) =>
      (category === "Todos" || post.category === category) &&
      normalized(`${post.title} ${post.excerpt} ${post.category}`).includes(
        normalized(search),
      ),
  );
  return (
    <>
      <section className="blog-intro">
        <span className="blog-kicker">IDEIAS QUE MOVEM NEGÓCIOS</span>
        <h1>
          Mais direção.
          <br />
          <span>Novas possibilidades.</span>
        </h1>
        <div className="blog-intro-bottom">
          <p>
            Estratégias, conversas e inteligência aplicada.
            <br />
            Para transformar conhecimento em próximo passo.
          </p>
          <span className="blog-editorial-label">
            O BLOG DA ITS TIME <ArrowRight size={16} />
          </span>
        </div>
        <BlogContentNavigation />
      </section>
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="blog-featured">
          <BlogVisual post={featured} large decorative priority />
          <div className="blog-featured-copy">
            <span className="blog-kicker">
              EM DESTAQUE / {featured.category}
            </span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className="blog-meta">
              {postDate(featured.date)} · {featured.minutes} min de leitura
            </span>
            <span className="blog-text-link">
              Explorar o artigo <ArrowUpRight size={20} />
            </span>
          </div>
        </Link>
      )}
      <section id="artigos" className="blog-library" aria-labelledby="library-title">
        <div className="blog-library-heading">
          <div>
            <span className="blog-kicker">CONTINUE EXPLORANDO</span>
            <h2 id="library-title">Conhecimento que vira ação.</h2>
          </div>
          <label className="blog-search">
            <Search size={17} />
            <span className="sr-only">Buscar artigos</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar um assunto"
              type="search"
              disabled={!ready}
            />
          </label>
        </div>
        <div className="blog-filters" aria-label="Filtrar por assunto">
          {["Todos", ...new Set(posts.map((post) => post.category))].map(
            (item) => (
              <button
                type="button"
                disabled={!ready}
                key={item}
                aria-pressed={item === category}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <p className="sr-only" role="status">
          {filtered.length} artigos encontrados
        </p>
        <div className="blog-card-grid">
          {filtered.map((post) => (
            <Link
              className="blog-card"
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <BlogVisual post={post} decorative />
              <div className="blog-card-copy">
                <span className="blog-kicker">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-card-bottom">
                  <span className="blog-meta">
                    {post.minutes} min de leitura
                  </span>
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="blog-empty">
            <h3>Nenhum artigo por aqui ainda.</h3>
            <p>Tente outro termo ou explore todos os assuntos.</p>
            <button
              type="button"
              className="blog-text-link"
              onClick={() => {
                setCategory("Todos");
                setSearch("");
              }}
            >
              Ver todos os artigos <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
