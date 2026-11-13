import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-posts";
import { resourceGroups } from "@/lib/resources";

const SITE = "https://itstime.pro";

// Last content change of the pages that have no date of their own. Update the date when the page changes:
// Google only trusts lastmod while it matches real edits.
const PAGE_UPDATED = {
  home: "2026-10-20",
  updates: "2026-11-11",
  legal: "2026-10-22", // the "Última atualização" shown on the three legal pages
  solutions: "2026-11-13", // /clinicas and /oticas
} as const;

const day = (value: string) => new Date(`${value}T00:00:00-03:00`);

/** Lista de paginas para o Google. Os posts do blog entram sozinhos: basta publicar e fazer o deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postDates = posts.map((post) => post.updated ?? post.date);
  const newestPost = postDates.length ? day(postDates.sort().at(-1)!) : undefined;
  const newestIn = (dates: (string | undefined)[]) => {
    const known = dates.filter((value): value is string => Boolean(value)).sort();
    return known.length ? day(known.at(-1)!) : undefined;
  };

  return [
    { url: SITE, lastModified: day(PAGE_UPDATED.home) },
    { url: `${SITE}/clinicas`, lastModified: day(PAGE_UPDATED.solutions) },
    { url: `${SITE}/oticas`, lastModified: day(PAGE_UPDATED.solutions) },
    { url: `${SITE}/blog`, lastModified: newestPost },
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: day(post.updated ?? post.date),
    })),
    { url: `${SITE}/updates`, lastModified: day(PAGE_UPDATED.updates) },
    ...resourceGroups.flatMap((group) => [
      {
        url: `${SITE}${group.id === "dev" ? "/dev/documentacao" : `/${group.id}`}`,
        lastModified: newestIn(group.links.map((item) => item.updated)),
      },
      ...group.links.map((item) => ({
        url: `${SITE}${item.href}`,
        lastModified: item.updated ? day(item.updated) : undefined,
      })),
    ]),
    { url: `${SITE}/politica-de-privacidade`, lastModified: day(PAGE_UPDATED.legal) },
    { url: `${SITE}/termos-de-uso`, lastModified: day(PAGE_UPDATED.legal) },
    { url: `${SITE}/exclusao-de-dados`, lastModified: day(PAGE_UPDATED.legal) },
  ];
}
