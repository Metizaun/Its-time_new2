import { expect, test } from "@playwright/test";

const routes = ["agenda", "webhook-leads", "webhook-cobranca", "jornadas-rb"];
const route = "/dev/documentacao/jornadas-rb";

test("todas as documentações compartilham navegação e indicam a página atual", async ({ page }) => {
  for (const slug of routes) {
    await page.goto(`/dev/documentacao/${slug}`);
    const nav = page.getByRole("navigation", { name: "Documentação", exact: true });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.locator('[aria-current="page"]')).toHaveAttribute("href", `/dev/documentacao/${slug}`);
    await nav.getByRole("link", { name: /Jornadas RB/ }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { level: 1, name: "Jornadas RB" })).toBeVisible();
  }
});

test("contrato RB, exemplos copiáveis e navegação por seção", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL! });
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Jornadas RB/);
  await page.getByRole("navigation", { name: "Nesta página" }).getByRole("link", { name: /Autenticação HMAC/ }).click();
  await expect(page.locator("#autenticacao")).toBeInViewport();
  const section = page.locator("#autenticacao");
  const code = await section.locator("pre code").innerText();
  await section.getByRole("button", { name: "Copiar código" }).click();
  await expect(section.getByRole("button", { name: "Código copiado" })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.replace(/\r\n/g, "\n")).toBe(code.replace(/\r\n/g, "\n"));

  const download = await page.request.get("/contracts/rb/rb-journeys-contract-v1.md");
  expect(download.status()).toBe(200);
  expect(await download.text()).toContain("Jornadas RB — contrato de entrada v1");
  const text = await page.locator("main").innerText();
  for (const value of ["X-RB-Timestamp", "X-RB-Signature", "Idempotency-Key", "venda_convertida", "mercadoria_liberada", "venda_entregue", "pedido_cancelado", "consentimento_revogado", "RB_JOURNEYS_IDEMPOTENCY_CONFLICT", "RB_INSTANCE_UNDEFINED_OR_AMBIGUOUS", "rb.recipe_expiry", "120 requisições", "29/02", "1 MiB"]) {
    expect(text).toContain(value);
  }
});

test("Jornadas RB mantém navegação e conteúdo sem overflow em telas menores", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `largura ${width}`).toBeLessThanOrEqual(1);
    await expect(page.getByRole("navigation", { name: "Documentação", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Nesta página" })).toBeVisible();
    if (width === 1280 || width === 390) {
      await page.screenshot({ path: test.info().outputPath(`jornadas-rb-${width}.png`) });
      await page.locator("#payload").scrollIntoViewIfNeeded();
      await page.screenshot({ path: test.info().outputPath(`jornadas-rb-payload-${width}.png`) });
    }
  }
});
