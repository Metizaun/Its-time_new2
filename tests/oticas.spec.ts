import { expect, test } from "@playwright/test";

const route = "/oticas";

test("/oticas responde com H1 único, canonical, JSON-LD e CTA para o WhatsApp", async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/IA de atendimento\s*e CRM para óticas/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://itstime.pro/oticas");

  const title = await page.title();
  expect(title.length).toBeLessThanOrEqual(60);
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description?.length ?? 0).toBeGreaterThan(50);
  expect(description!.length).toBeLessThanOrEqual(160);

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map((block) => JSON.parse(block));
  const service = data.find((item) => item["@type"] === "Service");
  expect(service?.provider?.["@id"]).toBe("https://itstime.pro/#organization");
  const breadcrumb = data.find((item) => item["@type"] === "BreadcrumbList");
  expect(breadcrumb?.itemListElement).toHaveLength(2);

  const cta = page.getByRole("link", { name: /Ver a IA atendendo a minha ótica/ });
  await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=.*p%C3%A1gina%20de%20%C3%B3ticas/);
  await expect(cta).toHaveAttribute("target", "_blank");

  // Internal links the SEO plan asked for.
  for (const href of [
    "/blog/ia-de-atendimento-para-oticas",
    "/blog/black-friday-para-oticas",
    "/tutoriais/whatsapp-oficial",
    "/dev/documentacao/jornadas-rb",
  ]) {
    await expect(page.locator(`main a[href="${href}"]`).first()).toBeAttached();
  }
});

test("a jornada está no HTML do servidor", async ({ request }) => {
  const html = await (await request.get(route)).text();
  for (const text of ["A receita é lida, não digitada", "Várias lojas, um só CRM", "O orçamento segue a sua tabela"]) {
    expect(html).toContain(text);
  }
});

test("sem rolagem horizontal em 390 px, com as cenas montadas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await expect(page.locator(".otc-chat--compact").first()).toBeVisible();
  // Walk the page so every scene plays and the photos load.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(3000);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("desktop: o palco acompanha o scroll e preenche a ficha", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  const stage = page.locator(".otc-stage");
  await expect(stage).toBeVisible();
  await page.locator('[data-otc-step="1"]').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const step = document.querySelector('[data-otc-step="1"]')!;
    const box = step.getBoundingClientRect();
    window.scrollBy(0, box.top + box.height / 2 - window.innerHeight / 2);
  });
  await expect(stage).toHaveAttribute("data-step", "receita");
  await expect(page.locator('.otc-field[data-filled="true"]')).toHaveCount(2);
});

test("com reduced motion as cenas aparecem completas", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.locator(".otc-stage")).toBeVisible();
  // The first conversation is all there at once: 1 divider + 4 messages.
  await expect(page.locator(".otc-chat-scene .otc-row")).toHaveCount(4);
  await context.close();
});
