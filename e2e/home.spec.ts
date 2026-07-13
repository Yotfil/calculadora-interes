import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

test.describe("raíz: redirección por idioma (docs/07 §1)", () => {
  test("navegador en español → /es/", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "es-ES" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/es\/$/);
    await ctx.close();
  });

  test("navegador en inglés → /en/", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    await ctx.close();
  });

  test("conserva los query params al redirigir (contrato de M18)", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/?ini=5000&tasa=10");
    await expect(page).toHaveURL(/\/en\/\?ini=5000&tasa=10$/);
    await ctx.close();
  });

  test("sin JS: enlaces visibles a ambos idiomas (fallback)", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('a[href="/es/"]')).toBeVisible();
    await expect(page.locator('a[href="/en/"]')).toBeVisible();
    await ctx.close();
  });
});

test.describe("páginas localizadas", () => {
  for (const locale of ["es", "en"] as const) {
    test(`/${locale}/ monta la isla y muestra la versión en el footer`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByTestId("calculadora")).toBeAttached();
      await expect(page.getByTestId("version")).toContainText(`v${version}`);
    });
  }

  test("el footer con versión es visible en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/es/");
    await expect(page.getByTestId("version")).toBeVisible();
  });

  test("el selector enlaza al otro idioma conservando query", async ({
    page,
  }) => {
    await page.goto("/es/?ini=5000");
    await expect(page.getByTestId("selector-idioma")).toHaveAttribute(
      "href",
      "/en/?ini=5000",
    );

    await page.goto("/en/");
    await expect(page.getByTestId("selector-idioma")).toHaveAttribute(
      "href",
      "/es/",
    );
  });
});

test.describe("header y footer (branding)", () => {
  test("el header muestra el favicon junto al título", async ({ page }) => {
    await page.goto("/es/");
    await expect(page.locator('header img[src="/favicon.svg"]')).toBeVisible();
  });

  test("el header muestra el badge de moneda (USD) con su tooltip", async ({
    page,
  }) => {
    await page.goto("/es/");
    const badge = page.getByTestId("badge-moneda");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("USD");
    await expect(badge).toHaveAttribute("title", /USD/);
  });

  test("el footer muestra los metadatos de build (versión · fecha · commit)", async ({
    page,
  }) => {
    await page.goto("/es/");
    // Versión de package.json + separadores → confirma que hay fecha y hash extra.
    await expect(page.getByTestId("version")).toContainText(`v${version}`);
    await expect(page.getByTestId("version")).toContainText("·");
  });

  test("el footer conserva la nota (descargo)", async ({ page }) => {
    await page.goto("/es/");
    await expect(page.locator("footer")).toContainText("herramienta educativa");
  });

  test("el footer enlaza a yotfil.dev en pestaña nueva", async ({ page }) => {
    await page.goto("/es/");
    const enlace = page.locator('footer a[href="https://www.yotfil.dev/"]');
    await expect(enlace).toBeVisible();
    await expect(enlace).toContainText("Yotfil");
    await expect(enlace).toHaveAttribute("target", "_blank");
    await expect(enlace).toHaveAttribute("rel", /noopener/);
  });
});
