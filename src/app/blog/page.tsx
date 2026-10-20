import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { BlogCTA } from "@/components/blog/BlogShell";
import { getAllPosts } from "@/lib/blog-posts";
import { readingMinutes } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Its Time — Ideias que movem negócios",
  description:
    "Estratégias de atendimento com IA, acompanhamento e organização comercial para transformar conversas em oportunidades.",
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
      <BlogCTA />
    </>
  );
}
