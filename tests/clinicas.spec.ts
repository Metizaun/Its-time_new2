import { expect, test } from "@playwright/test";

test.describe("/clinicas", () => {
  test("responde 200 com um H1, canonical, JSON-LD e CTA de WhatsApp", async ({ page }) => {
    const response = await page.goto("/clinicas");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/IA para clínicas/);
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(50);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("IA para clínicas");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(/\/clinicas$/);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((block) => JSON.parse(block)["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("Service");
    const service = blocks.map((block) => JSON.parse(block)).find((data) => data["@type"] === "Service");
    expect(service.provider["@id"]).toBe("https://itstime.pro/#organization");

    const cta = page.locator('a[href^="https://wa.me/"]').first();
    await expect(cta).toBeVisible();
    expect(await cta.getAttribute("href")).toContain(encodeURIComponent("página de clínicas"));

    for (const href of [
      "/tutoriais/whatsapp-oficial",
      "/dev/documentacao/agenda",
      "/blog/follow-up-comercial-orcamento-parado-nao-e-processo",
      "/blog/agendamento-com-ia",
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
    }
  });

  test("o texto da jornada vem do servidor", async ({ request }) => {
    const html = await (await request.get("/clinicas")).text();
    expect(html).toContain("A mensagem chega às 22h");
    expect(html).toContain("A recepção vê tudo no CRM");
  });

  test("o número publicado vem com a definição e o período", async ({ page }) => {
    await page.goto("/clinicas");
    const result = page.locator(".cl-result figure");
    await expect(result.locator("h2")).toHaveText("30%");
    await expect(result).toContainText("leads atendidos pela IA agendaram");
    await expect(result.locator("figcaption")).toContainText("Média das clínicas clientes");
    await expect(result.locator("figcaption")).toContainText("30 dias");
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`sem rolagem horizontal em 390 px (${reducedMotion})`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion });
      const page = await context.newPage();
      await page.goto("/clinicas");
      // Walk the journey so every still of the scene is mounted before measuring.
      for (const step of await page.locator("[data-journey-step]").all()) {
        await step.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
      }
      await expect(page.locator(".cl-scene--solo")).toHaveCount(6);
      const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
      await context.close();
    });
  }

  test("no desktop a cena acompanha a rolagem", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto("/clinicas");
    const steps = page.locator("[data-journey-step]");
    await steps.nth(2).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect(page.locator(".cl-stage-sticky .cl-scene")).toHaveAttribute("data-step", "2");
    await steps.nth(5).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect(page.locator(".cl-stage-sticky .cl-scene")).toHaveAttribute("data-step", "5");
    await context.close();
  });
});
