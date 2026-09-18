import { expect, test } from "@playwright/test";

const route = "/dev/documentacao/agenda";

test("documentação apresenta os dois sentidos da Agenda Universal", async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Agenda Universal/);
  await expect(page.getByRole("heading", { level: 1, name: "Integre a agenda por webhooks" })).toBeVisible();

  for (const heading of ["O Its Time é a autoridade da agenda", "Autenticação HMAC", "Eventos enviados para seu webhook", "Reportar o resultado do atendimento", "Swagger e contratos", "Checklist de ativação"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }

  const text = await page.locator("main").innerText();
  for (const required of ["appointment.status_reported", "appointment.created", "inboundSecret", "outboundSecret", "X-Agenda-Timestamp", "X-Agenda-Signature", "resourceVersion"]) {
    expect(text).toContain(required);
  }

  const swaggerFrame = page.frameLocator('iframe[title="Explorador Swagger da Agenda Universal"]');
  const swaggerFrameElement = page.locator('iframe[title="Explorador Swagger da Agenda Universal"]');
  await swaggerFrameElement.scrollIntoViewIfNeeded();
  await expect(swaggerFrameElement).toBeVisible();
  await expect(swaggerFrame.locator(".swagger-ui")).toBeVisible({ timeout: 15_000 });
  await expect(swaggerFrame.locator(".info .title")).toContainText("Its Time Agenda Universal");
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
});

test("contratos OpenAPI e Schema ficam disponíveis para download", async ({ page }) => {
  await page.goto(route);

  await expect(page.getByRole("link", { name: "Baixar OpenAPI YAML" })).toHaveAttribute("href", "/contracts/agenda/agenda-universal-v1.openapi.yaml");
  await expect(page.getByRole("link", { name: "Baixar JSON Schema" })).toHaveAttribute("href", "/contracts/agenda/agenda-universal-v1.schema.json");
});

test("documentação não cria overflow nos viewports principais", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
  }
});
