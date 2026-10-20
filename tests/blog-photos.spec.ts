import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Artigos do blog vindos de `src/content/blog/<slug>.json` (publicados pelo sistema de marketing), com foto de
 * capa e foto no corpo. O servidor de dev le o disco a cada requisicao, entao os arquivos sao criados aqui e
 * removidos no fim - nada fica no repo.
 */
const dir = path.join(process.cwd(), "src", "content", "blog");
const slug = "e2e-fotos-no-blog";
const photo = "/assets/hero/background.png"; // qualquer imagem que ja exista em public/
const files = [`${slug}.json`, "e2e-invalido.json", "e2e-sem-capa.json"];

const base = {
  author: "Equipe Its Time",
  category: "Teste de fotos",
  excerpt: "Artigo temporario que confere capa e foto no corpo.",
  takeaway: "A foto entra no mesmo molde visual do blog.",
  art: "journey",
};

test.beforeAll(() => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${slug}.json`),
    JSON.stringify({
      ...base,
      slug,
      title: "Foto na capa e no corpo do artigo",
      date: "2099-01-02",
      cover: { src: photo, alt: "Capa de teste", caption: "legenda da capa" },
      blocks: [
        { type: "text", id: "abertura", title: "Abertura", paragraphs: ["Primeiro paragrafo."] },
        { type: "image", src: photo, alt: "Foto de teste no corpo", caption: "Legenda da foto de teste" },
        { type: "text", id: "fecho", title: "Fecho", paragraphs: ["Ultimo paragrafo."] },
        { type: "cta", title: "Vamos conversar?", text: "Chame a gente.", label: "Falar com a Its Time" },
      ],
    }),
  );
  fs.writeFileSync(
    path.join(dir, "e2e-sem-capa.json"),
    JSON.stringify({
      ...base,
      slug: "e2e-sem-capa",
      title: "Artigo sem foto de capa",
      date: "2099-01-01",
      blocks: [{ type: "text", id: "unico", title: "Unico", paragraphs: ["Sem capa."] }],
    }),
  );
  fs.writeFileSync(path.join(dir, "e2e-invalido.json"), "{ isto nao e json");
});

test.afterAll(() => {
  for (const file of files) fs.rmSync(path.join(dir, file), { force: true });
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
});

test.beforeEach(async ({ page }) => {
  await page.route("https://app.itstime.pro/widget.js", (route) => route.fulfill({ body: "" }));
});

test("listing shows the photo cover, keeps the CSS art for posts without one and skips broken files", async ({ page }) => {
  await page.goto("/blog");
  const featured = page.locator(".blog-featured");
  await expect(featured).toHaveAttribute("href", `/blog/${slug}`);
  await expect(featured.locator(".blog-cover img")).toBeVisible();
  await expect(featured.locator(".blog-art")).toHaveCount(0);
  expect(await featured.locator(".blog-cover img").getAttribute("alt")).toBe(""); // decorativa: o titulo ja diz
  const loaded = await featured
    .locator(".blog-cover img")
    .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  expect(loaded).toBe(true);

  const noCover = page.locator(".blog-card", { hasText: "Artigo sem foto de capa" });
  await expect(noCover.locator(".blog-art")).toBeVisible();
  await expect(noCover.locator(".blog-cover")).toHaveCount(0);
  await expect(page.locator(".blog-card", { hasText: "isto nao e json" })).toHaveCount(0);
  await expect(page.locator('a[href="/blog/e2e-invalido"]')).toHaveCount(0);
});

test("article shows the cover on top, the body photo with its caption and exposes the image for sharing", async ({ page }) => {
  await page.goto(`/blog/${slug}`);
  const cover = page.locator(".blog-main > .blog-cover img");
  await expect(cover).toHaveAttribute("alt", "Capa de teste");
  await expect(page.locator(".blog-main > .blog-art")).toHaveCount(0);

  const figure = page.locator(".blog-figure");
  await expect(figure).toHaveCount(1);
  await expect(figure.locator("img")).toHaveAttribute("alt", "Foto de teste no corpo");
  await expect(figure.locator("figcaption")).toHaveText("Legenda da foto de teste");
  // a foto fica entre os dois blocos de texto, na ordem do JSON
  const order = await page
    .locator(".blog-prose > *")
    .evaluateAll((nodes) => nodes.map((n) => n.className || n.tagName));
  const photoAt = order.findIndex((c) => String(c).includes("blog-figure"));
  expect(photoAt).toBeGreaterThan(order.findIndex((c) => String(c).includes("blog-content-section")));
  const bodyLoaded = await figure
    .locator("img")
    .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  expect(bodyLoaded).toBe(true);

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /assets\/hero\/background\.png$/);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd.image).toBe(`https://itstime.pro${photo}`);
  // a foto do corpo nao entra no sumario (nao tem id)
  await expect(page.locator(".blog-toc")).not.toContainText("Foto de teste no corpo");
});

test("article without a cover still renders the CSS art", async ({ page }) => {
  await page.goto("/blog/e2e-sem-capa");
  await expect(page.locator(".blog-main > .blog-art")).toBeVisible();
  await expect(page.locator(".blog-main > .blog-cover")).toHaveCount(0);
  await expect(page.locator(".blog-figure")).toHaveCount(0);
});
