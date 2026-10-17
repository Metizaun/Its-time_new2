import { BlogHeader, BlogFooter } from "@/components/blog/BlogShell";
import "@/styles/blog.css";
import { BlogConversion } from "@/components/blog/BlogConversion";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-shell">
      <a className="blog-skip" href="#blog-main">
        Ir para o conteúdo
      </a>
      <BlogHeader />
      <BlogConversion />
      <main id="blog-main" className="blog-main">
        {children}
      </main>
      <BlogFooter />
    </div>
  );
}
