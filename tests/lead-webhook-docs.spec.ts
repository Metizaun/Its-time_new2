import { expect, test } from "@playwright/test";

const route = "/dev/documentacao/webhook-leads";

test("documentação editorial apresenta a entrada de leads e a visão futura", async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Webhook de leads/);
  await expect(page.getByRole("heading", { level: 1, name: "Receba leads sem perder contexto" })).toBeVisible();

  for (const heading of [
    "O frontend configura; o parceiro envia",
    "Um evento enxuto para o CRM",
    "O que acontece depois do POST",
    "Parte 2 — atendimento do lead",
    "OpenAPI como contrato; editorial como guia",
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }

  await expect(page.getByRole("link", { name: /Webhook de leads/ })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Baixar OpenAPI YAML" })).toHaveAttribute("href", "/contracts/leads/lead-webhook-v1.openapi.yaml");
  const swaggerFrame = page.frameLocator('iframe[title="Explorador Swagger do Webhook de Leads"]');
  const swaggerFrameElement = page.locator('iframe[title="Explorador Swagger do Webhook de Leads"]');
  await swaggerFrameElement.scrollIntoViewIfNeeded();
  await expect(swaggerFrameElement).toBeVisible();
  await expect(swaggerFrame.locator(".swagger-ui")).toBeVisible({ timeout: 15_000 });
  await expect(swaggerFrame.locator(".info .title")).toContainText("Its Time Lead Webhook");

  const text = await page.locator("main").innerText();
  for (const required of ["observation", "tags", "first_touch_attribution", "ignored_tags", "imagem", "HTTPS"]) {
    expect(text).toContain(required);
  }
});

test("documentação de leads não cria overflow nos viewports principais", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
  }
});
