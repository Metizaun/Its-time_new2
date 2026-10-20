import fs from "node:fs";
import path from "node:path";
import {
  posts as editorialPosts,
  BLOG_ARCHETYPES,
  type BlogCover,
  type BlogPost,
} from "./blog";
import { editorialWarnings, inlineLinks, safeBlogUrl } from "./blog-editorial";

/**
 * Fonte dos posts do blog para o SERVIDOR (paginas /blog e /blog/[slug], no build ou no dev).
 *
 * Junta o conteudo editorial local (`posts` em blog.ts) com os artigos publicados pelo sistema de marketing,
 * que chegam como um `<slug>.json` por artigo em `src/content/blog/` (as fotos ficam em `public/blog/<slug>/`).
 *
 * Fica separado de `blog.ts` de proposito: usa `node:fs`, e `blog.ts` tambem e importado por componentes
 * de cliente (tipos, `postDate`, `readingMinutes`).
 *
 * Regras:
 * - le do disco a cada chamada (sem cache entre builds: o arquivo pode ser reescrito quando o artigo e atualizado);
 * - JSON invalido NUNCA derruba o site: e ignorado com um aviso no log do build;
 * - slug repetido: o JSON vence o conteudo editorial local;
 * - ordem: data mais recente primeiro; empate pelo slug.
 */
export const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ART = new Set(["conversation", "journey", "schedule"]);

const text = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";
const list = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length > 0;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
/** Caminho do proprio site ("/blog/...") ou https; nunca "//host" nem "javascript:". */
const safeSrc = (value: unknown): value is string =>
  text(value) && !value.startsWith("#") && safeBlogUrl(value);
const optionalText = (value: unknown) => value === undefined || text(value);
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(text);
const dateIsValid = (value: unknown): value is string =>
  typeof value === "string" &&
  DATE.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;

function validCover(value: unknown): value is BlogCover {
  return (
    record(value) &&
    safeSrc(value.src) &&
    text(value.alt) &&
    (value.caption === undefined || typeof value.caption === "string") &&
    optionalText(value.credit) &&
    (value.sourceUrl === undefined ||
      (text(value.sourceUrl) && safeBlogUrl(value.sourceUrl))) &&
    (value.fit === undefined ||
      value.fit === "contain" ||
      value.fit === "cover") &&
    ((value.width === undefined && value.height === undefined) ||
      (Number.isInteger(value.width) &&
        Number.isInteger(value.height) &&
        Number(value.width) > 0 &&
        Number(value.height) > 0))
  );
}

/** Mensagem do problema do bloco, ou null se o bloco esta no formato do site. */
function blockProblem(block: unknown): string | null {
  if (!record(block)) return "bloco nao e um objeto";
  const items = block.items;
  switch (block.type) {
    case "text":
      return text(block.id) &&
        text(block.title) &&
        list(block.paragraphs) &&
        block.paragraphs.every(text) &&
        (block.subsections === undefined ||
          (list(block.subsections) &&
            block.subsections.every(
              (s) =>
                record(s) &&
                text(s.title) &&
                list(s.paragraphs) &&
                s.paragraphs.every(text),
            )))
        ? null
        : "bloco text precisa de id, title e paragraphs";
    case "checklist":
      return text(block.id) &&
        text(block.title) &&
        list(items) &&
        items.every(text)
        ? null
        : "bloco checklist precisa de id, title e items";
    case "steps":
      return text(block.id) &&
        text(block.title) &&
        list(items) &&
        items.every((i) => record(i) && text(i.title) && text(i.text))
        ? null
        : "bloco steps precisa de id, title e items {title, text}";
    case "quote":
      return text(block.text) && text(block.caption)
        ? null
        : "bloco quote precisa de text e caption";
    case "cta":
      return text(block.title) && text(block.text) && text(block.label)
        ? null
        : "bloco cta precisa de title, text e label";
    case "faq":
      return text(block.id) &&
        text(block.title) &&
        list(items) &&
        items.every((i) => record(i) && text(i.question) && text(i.answer))
        ? null
        : "bloco faq precisa de id, title e items {question, answer}";
    case "image":
      return validCover(block)
        ? null
        : "bloco image precisa de src (/caminho ou https), alt e, opcional, caption";
    case "table":
      return text(block.id) &&
        text(block.title) &&
        list(block.columns) &&
        block.columns.every(text) &&
        list(block.rows) &&
        block.rows.every(
          (row) =>
            strings(row) && row.length === (block.columns as unknown[]).length,
        ) &&
        optionalText(block.caption)
        ? null
        : "table precisa de id, title, columns e rows com o mesmo numero de colunas";
    case "callout":
      return text(block.title) &&
        text(block.text) &&
        (block.tone === undefined ||
          block.tone === "note" ||
          block.tone === "attention")
        ? null
        : "callout precisa de title, text e tone note ou attention";
    case "verdict":
      return text(block.id) &&
        text(block.title) &&
        text(block.label) &&
        text(block.recommendation) &&
        strings(block.pros) &&
        strings(block.cons) &&
        optionalText(block.price)
        ? null
        : "verdict precisa de id, title, label, pros, cons e recommendation";
    case "related":
      return list(block.slugs) &&
        block.slugs.every((slug) => text(slug) && SLUG.test(slug)) &&
        optionalText(block.title)
        ? null
        : "related precisa de slugs validos";
    default:
      return `tipo de bloco desconhecido: ${String(block.type)}`;
  }
}

/** O `BlogPost` validado, ou o motivo de o arquivo nao servir. */
export function parsePost(
  raw: unknown,
  expectedSlug?: string,
): { post: BlogPost } | { error: string } {
  if (!record(raw)) return { error: "nao e um objeto JSON" };
  for (const field of [
    "slug",
    "title",
    "excerpt",
    "category",
    "author",
    "takeaway",
  ] as const) {
    if (!text(raw[field])) return { error: `falta o campo ${field}` };
  }
  const slug = raw.slug as string;
  if (!SLUG.test(slug)) return { error: `slug invalido: ${slug}` };
  if (expectedSlug !== undefined && slug !== expectedSlug)
    return { error: `slug (${slug}) diferente do nome do arquivo` };
  if (!dateIsValid(raw.date)) return { error: "date precisa ser AAAA-MM-DD" };
  if (
    raw.updated !== undefined &&
    (!dateIsValid(raw.updated) || raw.updated < raw.date)
  )
    return {
      error: "updated deve ser uma data real igual ou posterior a date",
    };
  if (raw.authorProfile !== undefined) {
    const profile = raw.authorProfile;
    if (
      !record(profile) ||
      !text(profile.name) ||
      !optionalText(profile.role) ||
      !optionalText(profile.bio) ||
      (profile.kind !== undefined &&
        profile.kind !== "Person" &&
        profile.kind !== "Organization") ||
      (profile.url !== undefined &&
        (!text(profile.url) || !safeBlogUrl(profile.url)))
    )
      return { error: "authorProfile invalido" };
  }
  if (
    raw.archetype !== undefined &&
    !(BLOG_ARCHETYPES as readonly unknown[]).includes(raw.archetype)
  )
    return { error: "archetype desconhecido" };
  if (raw.tags !== undefined && !strings(raw.tags))
    return { error: "tags deve ser uma lista de textos" };
  if (
    raw.relatedSlugs !== undefined &&
    (!strings(raw.relatedSlugs) ||
      !raw.relatedSlugs.every((slug) => SLUG.test(slug)))
  )
    return { error: "relatedSlugs invalido" };
  if (
    raw.sources !== undefined &&
    (!Array.isArray(raw.sources) ||
      !raw.sources.every(
        (s) =>
          record(s) &&
          text(s.label) &&
          text(s.url) &&
          safeBlogUrl(s.url) &&
          optionalText(s.note),
      ))
  )
    return { error: "sources precisa de label e url segura" };
  if (!optionalText(raw.editorialNote))
    return { error: "editorialNote invalido" };
  if (
    raw.finalCta !== undefined &&
    (!record(raw.finalCta) ||
      !text(raw.finalCta.title) ||
      !text(raw.finalCta.text) ||
      !text(raw.finalCta.label))
  )
    return { error: "finalCta precisa de title, text e label" };
  if (typeof raw.art !== "string" || !ART.has(raw.art))
    return { error: "art precisa ser conversation, journey ou schedule" };
  if (!list(raw.blocks)) return { error: "o artigo nao tem blocos" };
  const ids = new Set<string>();
  for (const [index, block] of raw.blocks.entries()) {
    const problem = blockProblem(block);
    if (problem) return { error: `bloco ${index + 1}: ${problem}` };
    if (record(block) && block.id !== undefined) {
      if (!text(block.id) || !SLUG.test(block.id) || ids.has(block.id))
        return { error: `bloco ${index + 1}: id invalido ou duplicado` };
      ids.add(block.id);
    }
  }
  if (raw.cover !== undefined && !validCover(raw.cover))
    return { error: "cover precisa de src (/caminho ou https) e alt" };
  function hasUnsafeLink(value: unknown): boolean {
    if (typeof value === "string")
      return inlineLinks(value).some((match) => !safeBlogUrl(match[2]));
    if (Array.isArray(value)) return value.some(hasUnsafeLink);
    if (record(value)) return Object.values(value).some(hasUnsafeLink);
    return false;
  }
  if (hasUnsafeLink(raw))
    return {
      error: "link editorial inseguro: use https, caminho local ou ancora",
    };
  return { post: raw as unknown as BlogPost };
}

export function loadContentPosts(dir: string = CONTENT_DIR): BlogPost[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
  } catch {
    return []; // pasta ainda nao existe: nenhum artigo do sistema
  }
  const loaded: BlogPost[] = [];
  for (const file of files.sort()) {
    try {
      const raw: unknown = JSON.parse(
        fs.readFileSync(path.join(dir, file), "utf-8"),
      );
      const parsed = parsePost(raw, file.slice(0, -".json".length));
      if ("error" in parsed) {
        console.warn(`[blog] ignorando ${file}: ${parsed.error}`);
      } else {
        if (process.env.BLOG_EDITORIAL_WARNINGS === "true") {
          for (const warning of editorialWarnings(parsed.post))
            console.warn(`[blog] revisao ${file}: ${warning}`);
        }
        loaded.push(parsed.post);
      }
    } catch (error) {
      console.warn(
        `[blog] ignorando ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return loaded;
}

/** Todos os posts publicaveis: editorial local + artigos do sistema (o JSON vence em slug repetido). */
export function getAllPosts(dir: string = CONTENT_DIR): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();
  for (const post of editorialPosts) bySlug.set(post.slug, post);
  for (const post of loadContentPosts(dir)) bySlug.set(post.slug, post);
  return [...bySlug.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

export function getPostBySlug(
  slug: string,
  dir: string = CONTENT_DIR,
): BlogPost | undefined {
  return getAllPosts(dir).find((post) => post.slug === slug);
}
