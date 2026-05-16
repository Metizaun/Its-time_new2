import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const slideIds = [
  "intro",
  "memory",
  "multiagents",
  "execution",
  "omnichannel",
  "commercial-intel",
  "scale",
  "result",
] as const;

const requiredMarkers = [
  "intro-grid",
  "intro-particles",
  "intro-glow",
  "historico-lead",
  "contexto-empresa",
  "ultimas-conversas",
  "comportamento-engajamento",
  "preferencias-interesses",
  "agente-sdr",
  "agente-qualificador",
  "agente-follow-up",
  "agente-nutricao",
  "agente-reativacao",
  "agente-closer",
  "lead-capturado",
  "qualificado",
  "proposta-enviada",
  "reuniao-agendada",
  "negocio-ganho",
  "whatsapp",
  "instagram",
  "telegram",
  "site",
  "conversao-pipeline",
  "origem-leads",
  "lucro-gerado",
  "heatmap-grid",
  "infraestrutura-escalavel",
  "dados-seguros",
  "governanca-logs",
  "performance-tempo-real",
  "rede-consolidada",
  "resultados",
  "cta-final",
] as const;

const requiredTexts = [
  "Inteligência que opera.",
  "Estratégia que escala.",
  "Memória contextual",
  "Histórico",
  "Contexto da",
  "Últimas",
  "Preferências",
  "Multiagentes",
  "Agente SDR",
  "Agente Qualificador",
  "Agente Follow-up",
  "Agente Nutrição",
  "Agente Reativação",
  "Agente Closer",
  "A IA não só responde.",
  "Lead",
  "Qualificado",
  "Proposta",
  "Reunião",
  "Negócio",
  "WhatsApp",
  "Instagram",
  "Telegram",
  "Site",
  "Conversas viram dados.",
  "Conversão de Pipeline",
  "Origem de Leads",
  "Lucro Gerado",
  "Crescimento sem",
  "Infraestrutura",
  "Dados seguros",
  "Governança",
  "Performance",
  "Operação organizada.",
  "Crescimento previsível.",
] as const;

async function gotoHome(page: Page) {
  await page.goto("/");
  await expect(page.locator("[data-feature-section]")).toBeAttached();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  await page.waitForTimeout(500);
}

async function scrollToSlide(page: Page, index: number) {
  const sectionBox = await page.locator("[data-feature-section]").evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return {
      height: element.scrollHeight,
      top: rect.top + window.scrollY,
    };
  });
  const viewport = page.viewportSize() ?? { height: 900, width: 1440 };
  const travel = Math.max(0, sectionBox.height - viewport.height);
  const segment = travel / Math.max(1, slideIds.length - 1);

  await page.evaluate(
    ({ top, y }) => {
      window.scrollTo(0, top + y);
    },
    {
      top: sectionBox.top,
      y: Math.min(travel, segment * index + 8),
    },
  );
  await page.waitForTimeout(650);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function scrollToCrescer(page: Page) {
  await page.locator("[data-crescer-section]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

test("feature section exposes the corrected slide order and all required PRD elements", async ({ page }) => {
  await gotoHome(page);

  const section = page.locator("[data-feature-section]");
  await expect(section.locator("[data-feature-slide]")).toHaveCount(8);

  const ids = await section.locator("[data-feature-slide]").evaluateAll((slides) =>
    slides.map((slide) => slide.getAttribute("data-slide-id")),
  );
  expect(ids).toEqual([...slideIds]);

  for (const marker of requiredMarkers) {
    await expect(section.locator(`[data-required-element="${marker}"]`), marker).toHaveCount(1);
  }

  for (const text of requiredTexts) {
    const count = await section.getByText(text, { exact: false }).count();
    expect(count, text).toBeGreaterThan(0);
  }
});

test("crescer section appears after features with background, copy, and CTA", async ({ page }) => {
  for (const viewport of [
    { width: 1672, height: 941 },
    { width: 1440, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await gotoHome(page);
    await scrollToCrescer(page);
    await expectNoHorizontalOverflow(page);

    const section = page.locator("[data-crescer-section]");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: /crescer errado pode custar caro/i })).toBeVisible();
    await expect(section.getByText("Processos frágeis não quebram de repente.", { exact: false })).toBeVisible();
    await expect(section.getByRole("link", { name: /agendar demonstração/i })).toBeVisible();
    await expect(section.getByRole("heading", { name: "CAOS" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "ATRITO" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "SISTEMA" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "ESCALA" })).toBeVisible();

    const featureComesBefore = await page.evaluate(() => {
      const feature = document.querySelector("[data-feature-section]");
      const crescer = document.querySelector("[data-crescer-section]");

      return Boolean(
        feature &&
          crescer &&
          feature.compareDocumentPosition(crescer) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(featureComesBefore).toBe(true);

    const brokenImages = await section.locator("img").evaluateAll((images) =>
      (images as HTMLImageElement[])
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    );
    expect(brokenImages).toEqual([]);

    const headlineLines = await page.locator("[data-crescer-headline]").evaluate((headline) => {
      const range = document.createRange();
      range.selectNodeContents(headline);
      const lineTops = new Set(
        Array.from(range.getClientRects()).map((rect) => Math.round(rect.top)),
      );
      range.detach();

      return lineTops.size;
    });
    expect(headlineLines).toBeLessThanOrEqual(3);
  }
});

test("trusted logos carousel stays clipped and compact on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 470, height: 980 });
  await gotoHome(page);
  await expectNoHorizontalOverflow(page);

  const carouselState = await page.locator(".trusted-strip .company-row").evaluate((row) => {
    const rowRect = row.getBoundingClientRect();
    const track = row.querySelector(".company-track");
    const slots = Array.from(row.querySelectorAll(".company-logo-slot"));

    return {
      rowHeight: rowRect.height,
      rowWidth: rowRect.width,
      overflow: getComputedStyle(row).overflow,
      trackDisplay: track ? getComputedStyle(track).display : "",
      slotHeights: slots.map((slot) => slot.getBoundingClientRect().height),
      slotWidths: slots.map((slot) => slot.getBoundingClientRect().width),
    };
  });

  expect(carouselState.rowHeight).toBeLessThanOrEqual(60);
  expect(carouselState.rowWidth).toBeLessThanOrEqual(430);
  expect(carouselState.overflow).toBe("clip");
  expect(carouselState.trackDisplay).toBe("flex");
  expect(carouselState.slotHeights.every((height) => height <= 60)).toBe(true);
  expect(carouselState.slotWidths.every((width) => width <= 120)).toBe(true);
});

test("sticky scroll keeps one operational slide active across the full section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoHome(page);

  for (let index = 0; index < slideIds.length; index += 1) {
    await scrollToSlide(page, index);

    const activeSlides = await page.locator("[data-feature-slide]").evaluateAll((slides) =>
      slides.filter((slide) => {
        const styles = getComputedStyle(slide);

        return Number.parseFloat(styles.opacity) > 0.24 && styles.visibility !== "hidden";
      }).length,
    );

    expect(activeSlides).toBeGreaterThanOrEqual(1);
    expect(activeSlides).toBeLessThanOrEqual(2);
    await expectNoHorizontalOverflow(page);
  }
});

test("desktop visual composition remains non-overlapping and screenshotable @visual", async ({
  page,
}, testInfo) => {
  const checkpoints = [
    { index: 0, name: "intro" },
    { index: 2, name: "multiagents" },
    { index: 5, name: "analytics" },
    { index: 7, name: "result" },
  ] as const;

  for (const viewport of [
    { width: 1672, height: 941 },
    { width: 1440, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await gotoHome(page);

    for (const checkpoint of checkpoints) {
      await scrollToSlide(page, checkpoint.index);
      await expectNoHorizontalOverflow(page);

      await page.screenshot({
        path: testInfo.outputPath(
          `feature-${checkpoint.name}-${viewport.width}x${viewport.height}.png`,
        ),
        fullPage: false,
      });
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoHome(page);

  for (const id of slideIds) {
    await scrollToSlide(page, slideIds.indexOf(id));
    const intersects = await page.locator(`[data-slide-id="${id}"]`).evaluate((slide) => {
      const copy = slide.querySelector(".feature-copy")?.getBoundingClientRect();
      const visual = slide.querySelector(".feature-visual")?.getBoundingClientRect();

      if (!copy || !visual) {
        return false;
      }

      return !(
        copy.right <= visual.left ||
        visual.right <= copy.left ||
        copy.bottom <= visual.top ||
        visual.bottom <= copy.top
      );
    });

    expect(intersects, `copy and visual should not overlap on ${id}`).toBe(false);
  }
});

test("assets, DOM budget, animation properties, and scroll long tasks stay healthy @perf", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as unknown as { __featureLongTasks: number[] }).__featureLongTasks = [];

    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const bucket = (window as unknown as { __featureLongTasks: number[] }).__featureLongTasks;

        for (const entry of list.getEntries()) {
          bucket.push(entry.duration);
        }
      });

      try {
        observer.observe({ entryTypes: ["longtask"] });
      } catch {
        // Some browser builds disable longtask; the test still validates other budgets.
      }
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoHome(page);

  const nodeCount = await page.locator("[data-feature-section] *").count();
  expect(nodeCount).toBeLessThan(1_600);

  const motionStyles = await page.locator("[data-feature-slide]").evaluateAll((slides) =>
    slides.map((slide) => {
      const styles = getComputedStyle(slide);

      return {
        transform: styles.transform,
        willChange: styles.willChange,
      };
    }),
  );

  expect(motionStyles.every((styles) => styles.willChange.includes("transform"))).toBe(true);

  for (let index = 0; index < slideIds.length; index += 1) {
    await scrollToSlide(page, index);
  }

  const brokenImages = await page.locator("[data-feature-section] img").evaluateAll((images) =>
    (images as HTMLImageElement[])
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );
  expect(brokenImages).toEqual([]);

  const longTasks = await page.evaluate(
    () => (window as unknown as { __featureLongTasks?: number[] }).__featureLongTasks ?? [],
  );
  const maxLongTask = Math.max(0, ...longTasks);
  expect(maxLongTask).toBeLessThan(300);
});

test("reduced motion keeps all content accessible without Lenis or GSAP pinning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 820, height: 1180 });
  await gotoHome(page);

  const wrapperState = await page.locator("[data-feature-section]").evaluate((section) => {
    const styles = getComputedStyle(section);

    return {
      height: styles.height,
      lenisActive: Boolean((window as unknown as { lenis?: unknown }).lenis),
    };
  });

  expect(wrapperState.height).not.toBe("9440px");
  expect(wrapperState.lenisActive).toBe(false);

  const slideStates = await page.locator("[data-feature-slide]").evaluateAll((slides) =>
    slides.map((slide) => {
      const styles = getComputedStyle(slide);

      return {
        opacity: styles.opacity,
        position: styles.position,
        transform: styles.transform,
        visibility: styles.visibility,
      };
    }),
  );

  expect(slideStates.every((state) => state.position === "relative")).toBe(true);
  expect(slideStates.every((state) => state.opacity === "1")).toBe(true);
  expect(slideStates.every((state) => state.transform === "none")).toBe(true);
  expect(slideStates.every((state) => state.visibility === "visible")).toBe(true);
});
