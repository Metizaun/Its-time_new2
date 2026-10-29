import { expect, test } from "@playwright/test";
import { getAllPosts } from "../src/lib/blog-posts";

test.beforeEach(async ({ page }) => {
  // Isolate the site's own blog from the external chat service.
  await page.route("https://app.itstime.pro/widget.js", (route) =>
    route.fulfill({ body: "" }),
  );
});

test("reader finds an article and reaches a qualified commercial CTA", async ({
  page,
}) => {
  await page.goto("/blog");
  await expect(page).toHaveTitle(/Blog Its Time/);
  await page
    .getByRole("button", { name: "Acompanhamento", exact: true })
    .click();
  await expect(page.locator(".blog-card")).toHaveCount(getAllPosts().filter(post => post.category === "Acompanhamento").length);
  await page
    .getByRole("searchbox", { name: "Buscar artigos" })
    .fill("assunto inexistente");
  await expect(page.getByText("Nenhum artigo por aqui ainda.")).toBeVisible();
  await page.getByRole("button", { name: "Ver todos os artigos" }).click();
  await expect(page.locator(".blog-card")).toHaveCount(getAllPosts().length);
  await page
    .getByRole("searchbox", { name: "Buscar artigos" })
    .fill("Orçamento enviado. Conversa em movimento.");
  await expect(page.locator(".blog-card")).toHaveCount(1);
  await page.locator(".blog-card").click();
  await expect(page).toHaveURL(/acompanhamento-de-orcamentos/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Orçamento enviado. Conversa em movimento.",
  );
  const cta = page.locator(".blog-cta--compact .blog-button");
  const url = new URL((await cta.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/554196081781");
  expect(url.searchParams.get("text")).toContain("Meu negócio");
  expect(url.searchParams.get("text")).toContain(
    "Orçamento enviado. Conversa em movimento.",
  );
  await page
    .getByRole("navigation", { name: "Sumário do artigo" })
    .getByRole("link")
    .nth(1)
    .click();
  await expect(page).toHaveURL(/#organizar$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://itstime.pro/blog/acompanhamento-de-orcamentos",
  );
});

test("blog exposes both tutorials and the developer library with a return path", async ({ page }) => {
  await page.goto("/blog");
  const header = page.getByRole("navigation", { name: "Navegação principal", exact: true });
  await header.getByRole("link", { name: "Tutoriais", exact: true }).click();
  await expect(page).toHaveURL(/\/blog#tutoriais$/);
  await expect(page.locator("#tutoriais h2")).toBeInViewport();
  await expect(page.locator("#tutoriais .blog-resource-card")).toHaveCount(2);
  await expect(page.locator("#dev .blog-resource-card")).toHaveCount(4);

  const paths = await page.locator(".blog-resource-card").evaluateAll(links => links.map(link => link.getAttribute("href")!));
  expect(new Set(paths).size).toBe(6);
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('a[aria-current="page"]')).toHaveAttribute("href", path);
    await page.getByRole("link", { name: "Voltar ao blog e conteúdos" }).click();
    await expect(page).toHaveURL(/\/blog$/);
  }

  await page.goto("/blog/acompanhamento-de-orcamentos");
  await header.getByRole("link", { name: "Área dev", exact: true }).click();
  await expect(page).toHaveURL(/\/blog#dev$/);
  await expect(page.locator("#dev h2")).toBeInViewport();
});

test("content navigation remains visible and fits a small phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/blog");
  const navigation = page.getByRole("navigation", { name: "Navegação principal", exact: true });
  await expect(navigation.getByRole("link", { name: "Tutoriais", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Área dev", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Explorar conteúdos" }).getByRole("link", { name: /Área dev/ }).click();
  await expect(page.locator("#dev h2")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("article FAQ, share and related reading work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/blog/como-transformar-conversas-em-vendas");
  await page
    .getByText("Preciso automatizar todo o atendimento de uma vez?")
    .click();
  await expect(
    page.getByText("Você pode começar por uma jornada específica.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Copiar link do artigo" }).click();
  await expect(
    page.getByRole("button", { name: "Link copiado" }),
  ).toBeVisible();
  await page.locator(".blog-related a").first().click();
  await expect(page).toHaveURL(/acompanhamento-de-orcamentos/);
  await page.goto("/blog/artigo-inexistente");
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
});

for (const width of [1440, 1024, 768, 390]) {
  test(`white mode stays within viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/blog",
      "/blog/como-transformar-conversas-em-vendas",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator(".blog-shell")).toHaveCSS(
        "background-color",
        "rgb(247, 246, 244)",
      );
      await expect(page.locator(".blog-header .blog-button")).toHaveCSS(
        "background-image",
        /linear-gradient/,
      );
    }
  });
}

test("reduced motion preserves readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/blog/como-transformar-conversas-em-vendas");
  await expect(page.locator(".blog-art-node").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".blog-reading-progress")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
