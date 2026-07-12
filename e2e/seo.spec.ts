import { expect, test } from "@playwright/test";

// Espeja `site` de astro.config.mjs (PLACEHOLDER hasta M8). canonical/hreflang
// son absolutos contra este host, no contra el de preview (localhost:4321).
const SITE = "https://calculadora-interes.example";

test.describe("SEO por idioma (docs/06 §3)", () => {
  for (const locale of ["es", "en"] as const) {
    const otro = locale === "es" ? "en" : "es";

    test(`/${locale}/: canonical, hreflang recíproco + x-default→/en/`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE}/${locale}/`,
      );
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${locale}"]`),
      ).toHaveAttribute("href", `${SITE}/${locale}/`);
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${otro}"]`),
      ).toHaveAttribute("href", `${SITE}/${otro}/`);
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute("href", `${SITE}/en/`);
    });

    test(`/${locale}/: meta description presente`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(desc && desc.length).toBeGreaterThan(50);
    });

    test(`/${locale}/: JSON-LD con WebApplication + FAQPage (5 preguntas)`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      const raw = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      const data = JSON.parse(raw ?? "");
      const tipos = data["@graph"].map((n: { "@type": string }) => n["@type"]);
      expect(tipos).toContain("WebApplication");
      expect(tipos).toContain("FAQPage");
      const faq = data["@graph"].find(
        (n: { "@type": string }) => n["@type"] === "FAQPage",
      );
      expect(faq.mainEntity).toHaveLength(5);
    });

    test(`/${locale}/: sección FAQ renderizada en HTML estático`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator("#faq-titulo")).toBeVisible();
      await expect(
        page.locator("section[aria-labelledby='faq-titulo'] dt"),
      ).toHaveCount(5);
      await expect(
        page.locator("section[aria-labelledby='faq-titulo'] dd"),
      ).toHaveCount(5);
      const fragmento =
        locale === "es" ? "interés sobre interés" : "interest on interest";
      await expect(
        page.locator("section[aria-labelledby='faq-titulo']"),
      ).toContainText(fragmento);
    });

    test(`/${locale}/: sin snippet de GA4 cuando PUBLIC_GA4_ID está vacío`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(
        0,
      );
    });
  }

  test("la description difiere entre es y en", async ({ page }) => {
    await page.goto("/es/");
    const es = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    await page.goto("/en/");
    const en = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(es).not.toEqual(en);
  });
});

test.describe("sitemap y robots (docs/06 §3)", () => {
  test("robots.txt se sirve y apunta al sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("Sitemap:");
  });

  test("la raíz redirectora lleva noindex (no se indexa)", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('name="robots" content="noindex"');
  });

  test("sitemap lista /es/ y /en/, no la raíz", async ({ request }) => {
    const index = await request.get("/sitemap-index.xml");
    expect(index.status()).toBe(200);

    const res = await request.get("/sitemap-0.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain(`${SITE}/es/`);
    expect(xml).toContain(`${SITE}/en/`);
    // La raíz solo redirige; no debe indexarse (docs/07 §1).
    expect(xml).not.toContain(`<loc>${SITE}/</loc>`);
  });
});
