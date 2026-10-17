import { expect, test } from "@playwright/test";

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
  await expect(page.locator(".blog-card")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Buscar artigos" })
    .fill("assunto inexistente");
  await expect(page.getByText("Nenhum artigo por aqui ainda.")).toBeVisible();
  await page.getByRole("button", { name: "Ver todos os artigos" }).click();
  await expect(page.locator(".blog-card")).toHaveCount(3);
  await page
    .getByRole("searchbox", { name: "Buscar artigos" })
    .fill("orcamento");
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
