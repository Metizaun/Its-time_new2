import Link from "next/link";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogShell";
import "@/styles/blog.css";

// Next's built-in 404 adds its own <title> next to the layout's, so the page ended up with two. This one adds none.
export default function NotFound() {
  return (
    <div className="blog-shell">
      <BlogHeader />
      <main id="blog-main" className="blog-main">
        <section className="blog-intro">
          <span className="blog-kicker">ERRO 404</span>
          <h1>Página não encontrada.</h1>
          <div className="blog-intro-bottom">
            <p>
              O endereço pode ter mudado ou não existir mais.{" "}
              <Link href="/">Voltar ao início</Link> ou <Link href="/blog">ver o blog</Link>.
            </p>
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
