import type { BlogPost } from "./blog";

/** Shared by import validation and the renderer. No raw HTML or arbitrary URL schemes. */
export function safeBlogUrl(value: string): boolean {
  if (!value || /[\s\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith("#")) return value.length > 1;
  if (value.startsWith("/") && !value.startsWith("//")) {
    try {
      return (
        new URL(value, "https://itstime.pro").origin === "https://itstime.pro"
      );
    } catch {
      return false;
    }
  }
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

/** Deliberately small inline format: [label](https://url) or [label](/blog/slug). */
export function inlineLinks(text: string) {
  return [...text.matchAll(/\[([^\]\n]+)\]\(([^)\n]+)\)/g)];
}

/** Only visible editorial text, excluding URLs, field names and image paths. */
export function editorialText(post: BlogPost): string {
  const blocks = post.blocks.map((block) => {
    switch (block.type) {
      case "text":
        return [
          block.title,
          ...block.paragraphs,
          ...(block.subsections ?? []).flatMap((s) => [
            s.title,
            ...s.paragraphs,
          ]),
        ].join(" ");
      case "steps":
        return [
          block.title,
          ...block.items.flatMap((item) => [item.title, item.text]),
        ].join(" ");
      case "checklist":
        return [block.title, ...block.items].join(" ");
      case "quote":
        return `${block.text} ${block.caption}`;
      case "cta":
        return `${block.title} ${block.text} ${block.label}`;
      case "image":
        return block.caption ?? "";
      case "faq":
        return [
          block.title,
          ...block.items.flatMap((item) => [item.question, item.answer]),
        ].join(" ");
      case "table":
        return [
          block.title,
          ...block.columns,
          ...block.rows.flat(),
          block.caption ?? "",
        ].join(" ");
      case "callout":
        return `${block.title} ${block.text}`;
      case "verdict":
        return [
          block.title,
          block.label,
          ...block.pros,
          ...block.cons,
          block.recommendation,
          block.price ?? "",
        ].join(" ");
      case "related":
        return block.title ?? "";
    }
  });
  return [post.title, post.excerpt, post.takeaway, ...blocks]
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Advice never invents evidence and never prevents an otherwise valid post from loading. */
export function editorialWarnings(post: BlogPost): string[] {
  const warnings: string[] = [];
  if (!post.authorProfile?.bio)
    warnings.push("Informe uma bio real do responsável editorial.");
  if (!post.sources?.length)
    warnings.push(
      "Revise a necessidade de fontes e referências para as afirmações do artigo.",
    );
  if (post.cover && !post.cover.credit)
    warnings.push("Revise o crédito da capa.");
  if (
    post.archetype === "guia-pratico" &&
    !post.blocks.some((b) => b.type === "steps")
  )
    warnings.push("O guia prático pode se beneficiar de etapas acionáveis.");
  const paragraphs = post.blocks.flatMap((b) =>
    b.type === "text"
      ? [...b.paragraphs, ...(b.subsections ?? []).flatMap((s) => s.paragraphs)]
      : [],
  );
  if (paragraphs.some((p) => p.split(/\s+/).length > 100))
    warnings.push("Revise parágrafos longos para facilitar a leitura.");
  if (
    /\b(no mundo atual|é importante ressaltar|em resumo|próximo nível)\b/i.test(
      editorialText(post),
    )
  )
    warnings.push(
      "Revise expressões genéricas; preserve as que forem necessárias ao sentido.",
    );
  return warnings;
}

export function relatedPosts(
  post: BlogPost,
  all: BlogPost[],
  limit = 2,
): BlogPost[] {
  const explicit = post.relatedSlugs ?? [];
  const tags = new Set(post.tags ?? []);
  const score = (candidate: BlogPost) =>
    (explicit.includes(candidate.slug)
      ? 1000 - explicit.indexOf(candidate.slug)
      : 0) +
    (candidate.category === post.category ? 5 : 0) +
    (candidate.tags ?? []).filter((tag) => tags.has(tag)).length * 10;
  return all
    .filter((candidate) => candidate.slug !== post.slug && score(candidate) > 0)
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        b.date.localeCompare(a.date) ||
        a.slug.localeCompare(b.slug),
    )
    .slice(0, limit);
}
