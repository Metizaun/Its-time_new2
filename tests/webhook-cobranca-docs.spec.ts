import { expect, test } from "@playwright/test";

const route = "/dev/documentacao/webhook-cobranca";

test("documentação apresenta o contrato e todos os exemplos", async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Webhook de cobrança/);
  await expect(page.getByRole("heading", { level: 1, name: "Integração de cobrança via webhook" })).toBeVisible();

  for (const heading of ["Início rápido", "Autenticação HMAC", "Payload completo", "cURL e Bash", "Python", "Java 11+", "Postman", "Erros e retentativas", "Checklist da integração"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }

  const text = await page.locator("main").innerText();
  for (const required of ["https://api.itstime.pro", "Idempotency-Key", "X-Collection-Timestamp", "X-Collection-Signature", "HMAC-SHA256", "120 requisições", "500 registros"]) {
    expect(text).toContain(required);
  }
});

test("índice navega e copiar funciona", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3000" });
  await page.goto(route);
  await page.getByRole("navigation", { name: "Nesta página" }).getByRole("link", { name: /Autenticação HMAC/ }).click();
  await expect(page.locator("#autenticacao")).toBeInViewport();

  const code = page.locator("#autenticacao pre code").first();
  const expected = await code.innerText();
  await page.locator("#autenticacao").getByRole("button", { name: "Copiar código" }).click();
  await expect(page.locator("#autenticacao").getByRole("button", { name: "Código copiado" })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.replace(/\r\n/g, "\n")).toBe(expected.replace(/\r\n/g, "\n"));
});

test("documentação não cria overflow nos viewports principais", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
    await expect(page.getByRole("navigation", { name: "Nesta página" })).toBeVisible();
  }
});

test("conteúdo permanece acessível com movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.getByRole("heading", { name: "Checklist da integração" })).toBeAttached();
});
