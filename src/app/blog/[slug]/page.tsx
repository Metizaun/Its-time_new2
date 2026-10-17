import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { getAllPosts, getPostBySlug } from "@/lib/blog-posts";
import { relatedPosts } from "@/lib/blog-editorial";

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  return {
    title: `${post.title} | Blog Its Time`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.authorProfile?.name ?? post.author],
      ...(post.updated && { modifiedTime: post.updated }),
      ...(post.cover && {
        images: [{ url: post.cover.src, alt: post.cover.alt }],
      }),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPosts = getAllPosts();
  const post = allPosts.find((candidate) => candidate.slug === slug);
  if (!post) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": post.authorProfile?.kind ?? "Organization",
      name: post.authorProfile?.name ?? post.author,
      ...(post.authorProfile?.url && {
        url: new URL(post.authorProfile.url, "https://itstime.pro").toString(),
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "Its Time",
      url: "https://itstime.pro",
    },
    mainEntityOfPage: `https://itstime.pro/blog/${post.slug}`,
    inLanguage: "pt-BR",
    ...(post.cover && {
      image: new URL(post.cover.src, "https://itstime.pro").toString(),
    }),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogArticle
        post={post}
        allPosts={allPosts}
        related={relatedPosts(post, allPosts)}
      />
    </>
  );
}
