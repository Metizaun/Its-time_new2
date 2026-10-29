import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { BlogCTA } from "@/components/blog/BlogShell";
import { getAllPosts } from "@/lib/blog-posts";
import { readingMinutes } from "@/lib/blog";
import { BlogResources } from "@/components/blog/BlogResources";

export const metadata: Metadata = {
  title: "Blog Its Time — Ideias que movem negócios",
  description:
    "Artigos sobre atendimento e vendas, tutoriais do Its Time CRM e documentação para desenvolvedores em um só lugar.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Its Time — Ideias que movem negócios",
    description: "Inteligência aplicada ao crescimento do seu negócio.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogIndex
        posts={getAllPosts().map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          date: post.date,
          art: post.art,
          cover: post.cover,
          minutes: readingMinutes(post),
        }))}
      />
      <BlogResources />
      <BlogCTA />
    </>
  );
}
