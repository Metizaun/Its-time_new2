import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-posts";

const SITE = "https://itstime.pro";

/** Lista de paginas para o Google. Os posts do blog entram sozinhos: basta publicar e fazer o deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newest = posts[0] ? new Date(posts[0].updated ?? posts[0].date) : undefined;

  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/blog`, lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE}/updates`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/termos-de-uso`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/exclusao-de-dados`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
