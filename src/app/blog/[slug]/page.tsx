import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { getAllPosts, getPostBySlug } from "@/lib/blog-posts";
import { relatedPosts } from "@/lib/blog-editorial";
import {
  JsonLd,
  ORGANIZATION_ID,
  WEBSITE_ID,
  SITE_URL,
  breadcrumbList,
  isoDate,
} from "@/lib/structured-data";

const TITLE_SUFFIX = " | Blog Its Time";

/** Google cuts titles around 60 characters; long post titles drop the suffix instead of losing their end. */
function pageTitle(title: string) {
  return title.length + TITLE_SUFFIX.length <= 60 ? `${title}${TITLE_SUFFIX}` : title;
}

/** Excerpts double as card text and can run past the ~160 characters a result snippet shows. */
function metaDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  let kept = "";
  for (const sentence of sentences) {
    if ((kept + sentence).trim().length > max) break;
    kept += sentence;
  }
  if (kept.trim().length >= 70) return kept.trim();
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

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
    title: pageTitle(post.title),
    description: metaDescription(post.excerpt),
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
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  // An author link that only points back to the home page says nothing about the author, so it is left out.
  const authorUrl =
    post.authorProfile?.url && post.authorProfile.url !== "/"
      ? new URL(post.authorProfile.url, SITE_URL).toString()
      : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.updated ?? post.date),
    author: {
      "@type": post.authorProfile?.kind ?? "Organization",
      name: post.authorProfile?.name ?? post.author,
      ...(authorUrl && { url: authorUrl }),
      ...(post.authorProfile?.kind === "Person" && {
        ...(post.authorProfile.role && { jobTitle: post.authorProfile.role }),
        worksFor: { "@id": ORGANIZATION_ID },
      }),
    },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: postUrl,
    inLanguage: "pt-BR",
    // Older posts have drawn art instead of a cover photo; they fall back to the site's share image.
    image: post.cover
      ? new URL(post.cover.src, SITE_URL).toString()
      : `${SITE_URL}/opengraph-image`,
  };
  const breadcrumbs = breadcrumbList([
    { name: "Início", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title },
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />
      <BlogArticle
        post={post}
        allPosts={allPosts}
        related={relatedPosts(post, allPosts)}
      />
    </>
  );
}
