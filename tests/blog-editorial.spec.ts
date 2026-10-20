import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { parsePost } from "../src/lib/blog-posts";
import { editorialWarnings, relatedPosts } from "../src/lib/blog-editorial";
import { posts, type BlogPost } from "../src/lib/blog";

const slug = "e2e-editorial-modular";
const file = path.join(process.cwd(), "src/content/blog", `${slug}.json`);
const fixture: BlogPost = {
  slug,
  title: "Validação dos blocos editoriais",
  category: "Teste editorial",
  date: "2026-10-15",
  updated: "2026-10-16",
  author: "Autor legado do teste",
  authorProfile: {
    name: "Responsável editorial do teste",
    role: "Edição de testes",
    bio: "Perfil temporário para verificar a autoria real do conteúdo.",
    kind: "Person",
  },
  art: "journey",
  takeaway: "Blocos claros e links seguros.",
  excerpt: "Fixture temporária para validar o contrato editorial.",
  archetype: "analise",
  tags: ["crm"],
  cover: {
    src: "/assets/hero/background.png",
    alt: "Capa de teste editorial",
    caption: "Legenda da capa editorial",
    credit: "Acervo de teste",
  },
  sources: [
    {
      label: "Referência de teste",
      url: "https://example.com/reference",
      note: "Referência usada apenas na fixture de teste.",
    },
  ],
  blocks: [
    {
      type: "text",
      id: "inicio",
      title: "Conteúdo com referências",
      paragraphs: [
        "Consulte a [referência externa](https://example.com/reference) e o [guia de acompanhamento](/blog/acompanhamento-de-orcamentos). <script>alert(1)</script>",
      ],
      subsections: [
        {
          title: "Um detalhe importante",
          paragraphs: ["O subtítulo mantém a hierarquia da seção."],
        },
      ],
    },
    {
      type: "image",
      src: "/blog/editorial/jornada-comercial.svg",
      alt: "Diagrama editorial de teste",
      width: 1200,
      height: 400,
      caption: "Legenda do diagrama",
      credit: "Its Time",
      sourceUrl: "/blog",
    },
    {
      type: "table",
      id: "comparacao",
      title: "Etapas e responsabilidades",
      columns: ["Etapa", "Ação", "Responsável"],
      rows: [
        ["Atendimento inicial", "Entender a necessidade", "Equipe da operação"],
        ["Encaminhamento", "Enviar contexto", "Responsável pela negociação"],
      ],
      caption: "Proposta de organização",
    },
    {
      type: "callout",
      title: "Limites da proposta",
      text: "A organização depende dos critérios do negócio.",
      tone: "attention",
    },
    {
      type: "verdict",
      id: "avaliacao",
      title: "Avaliação do fluxo",
      label: "Orientação editorial",
      pros: ["Contexto acessível à equipe"],
      cons: ["Exige critérios de encaminhamento"],
      recommendation: "Defina as responsabilidades antes de ampliar a jornada.",
    },
    { type: "related", slugs: ["acompanhamento-de-orcamentos"] },
    {
      type: "cta",
      title: "Veja o processo",
      text: "Converse sobre sua operação.",
      label: "Abrir demonstração",
    },
  ],
};

test.beforeAll(() => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file))
    throw new Error("Fixture já existe; não sobrescrever.");
  fs.writeFileSync(file, JSON.stringify(fixture));
});
test.afterAll(() => {
  fs.rmSync(file, { force: true });
});
test.beforeEach(async ({ page }) => {
  await page.route("https://app.itstime.pro/widget.js", (route) =>
    route.fulfill({ body: "" }),
  );
});

test("import rejects unsafe or inconsistent posts while style suggestions stay advisory", () => {
  expect(parsePost(fixture)).toHaveProperty("post");
  expect(parsePost({ ...fixture, updated: "2026-02-31" })).toHaveProperty(
    "error",
  );
  expect(parsePost({ ...fixture, updated: "2020-01-01" })).toHaveProperty(
    "error",
  );
  expect(
    parsePost({ ...fixture, blocks: [fixture.blocks[0], fixture.blocks[0]] }),
  ).toHaveProperty("error");
  expect(
    parsePost({
      ...fixture,
      blocks: [
        {
          type: "table",
          id: "bad",
          title: "Bad",
          columns: ["A", "B"],
          rows: [["Only one"]],
        },
      ],
    }),
  ).toHaveProperty("error");
  for (const href of [
    "javascript:alert",
    "data:text/html,test",
    "//example.com",
    "/\\example.com",
  ]) {
    expect(
      parsePost({
        ...fixture,
        blocks: [
          {
            type: "text",
            id: "bad",
            title: "Bad",
            paragraphs: [`[Link](${href})`],
          },
        ],
      }),
    ).toHaveProperty("error");
  }
  const advisory = {
    ...fixture,
    authorProfile: undefined,
    sources: undefined,
    blocks: [
      {
        type: "text" as const,
        id: "valido",
        title: "Uma explicação",
        paragraphs: ["No mundo atual, uma escolha pode depender de contexto."],
      },
    ],
  };
  expect(parsePost(advisory)).toHaveProperty("post");
  expect(editorialWarnings(advisory).length).toBeGreaterThan(0);
  expect(relatedPosts(posts[0], posts).map((post) => post.slug)).toEqual([
    "acompanhamento-de-orcamentos",
    "agendamento-com-ia",
  ]);
});

test("reader sees references, authorship, update date and all editorial modules", async ({
  page,
}) => {
  await page.goto(`/blog/${slug}`);
  await expect(page.locator(".blog-author strong")).toHaveText(
    "Responsável editorial do teste",
  );
  await expect(page.locator(".blog-author")).toContainText(
    "Atualizado em 16 de outubro de 2026",
  );
  await expect(page.locator(".blog-article-signoff")).not.toContainText(
    "Equipe Its Time",
  );
  await expect(
    page.getByRole("heading", { level: 3, name: "Um detalhe importante" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "referência externa", exact: true }),
  ).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator(".blog-prose script")).toHaveCount(0);
  await expect(page.locator(".blog-cover-caption")).toContainText(
    "Acervo de teste",
  );
  await expect(page.locator(".blog-figure figcaption")).toContainText(
    "Crédito: Its Time",
  );
  await expect(page.locator(".blog-figure img")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await expect(page.getByRole("table")).toContainText(
    "Responsável pela negociação",
  );
  await expect(page.locator(".blog-callout")).toContainText(
    "Limites da proposta",
  );
  await expect(page.locator(".blog-verdict")).toContainText("Exige critérios");
  await expect(page.locator(".blog-inline-related a")).toHaveAttribute(
    "href",
    "/blog/acompanhamento-de-orcamentos",
  );
  const jsonLd = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  );
  expect(jsonLd.dateModified).toBe("2026-10-16");
  expect(jsonLd.author["@type"]).toBe("Person");
  await expect(
    page.getByRole("button", { name: "Copiar link do artigo" }),
  ).toBeEnabled();
  await page.evaluate(() => {
    window.addEventListener("its-time:blog-cta", (event) => {
      (window as unknown as { captured: unknown }).captured = (
        event as CustomEvent
      ).detail;
    });
    document
      .querySelector<HTMLAnchorElement>(".blog-cta--compact a")!
      .addEventListener("click", (event) => event.preventDefault());
  });
  await page.getByRole("link", { name: "Abrir demonstração" }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { captured: unknown }).captured,
    ),
  ).toMatchObject({
    event: "blog_cta_click",
    article: fixture.title,
    position: "inline-6",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("pilot article has a complete practical structure", async ({ page }) => {
  await page.goto("/blog/como-transformar-conversas-em-vendas");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Como conduzir uma conversa",
  );
  await expect(page.locator(".blog-figure img")).toHaveAttribute(
    "src",
    "/blog/editorial/jornada-comercial.svg",
  );
  await expect(page.locator(".blog-sources a")).toHaveAttribute(
    "href",
    "/#como-funciona",
  );
  await expect(page.locator(".blog-main > .blog-cta a")).toHaveText(
    "Ver o fluxo em uma demonstração",
  );
});
