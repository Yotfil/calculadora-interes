import { expect, test } from "@playwright/test";

import { abrir } from "./util";

// Contrato de comportamiento del formulario Básica (docs/04 §6). En M5 solo se
// cubren los flujos que no dependen de resultados (F1/F2/F6/F10 llegan en M6):
// render con defaults, conservación de valores al cambiar de tab, error inline
// con scroll+focus (F4) y paridad de idioma (F8).

test.describe("formulario Básica (M5)", () => {
  test("arranca con los defaults de docs/02 §6", async ({ page }) => {
    await page.goto("/es/");
    // Los campos de dinero muestran separador de miles del locale (es: 1.000).
    await expect(page.getByTestId("campo-capitalInicial")).toHaveValue("1.000");
    await expect(page.getByTestId("campo-aporteRegimen")).toHaveValue("100");
    await expect(page.getByTestId("campo-duracion")).toHaveValue("10");
    await expect(page.getByTestId("campo-tasaNominalAnual")).toHaveValue("8");
    await expect(page.getByTestId("campo-frecuencia")).toHaveValue("12");
    await expect(page.getByTestId("unidad-anios")).toBeChecked();
  });

  test("la moneda (USD) es visible: nota sobre el Paso 1 y adorno en los campos de dinero", async ({
    page,
  }) => {
    await page.goto("/es/");
    await expect(page.getByTestId("nota-moneda")).toHaveText(
      "Todos los montos están en dólares estadounidenses (USD).",
    );
    // Adorno tipo select deshabilitado junto a cada campo de dinero.
    for (const campo of ["capitalInicial", "aporteRegimen"]) {
      const adorno = page.getByTestId(`moneda-${campo}`);
      await expect(adorno).toBeVisible();
      await expect(adorno).toBeDisabled();
      await expect(adorno.locator("option")).toHaveText("USD");
    }
    // Los campos que no son de dinero no llevan adorno.
    await expect(page.getByTestId("moneda-tasaNominalAnual")).toHaveCount(0);

    // Al hacer hover sobre el adorno aparece el tooltip de "otras monedas".
    const tooltip = page.getByTestId("tooltip-moneda-capitalInicial");
    await expect(tooltip).toBeHidden();
    await page.getByTestId("moneda-capitalInicial").hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText(
      "Por ahora, los cálculos son solo en dólares (USD). En el futuro podrás elegir otras monedas.",
    );
  });

  test("cambiar de tab conserva los valores (docs/04 §2)", async ({ page }) => {
    await abrir(page, "/es/");
    // El estado crudo es 50000; se muestra 50.000 (separador de miles de es).
    await page.getByTestId("campo-capitalInicial").fill("50000");
    await expect(page.getByTestId("campo-capitalInicial")).toHaveValue("50.000");

    await page.getByTestId("tab-experto").click();
    await expect(page.getByTestId("tab-experto")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("tab-basica")).toHaveAttribute(
      "aria-selected",
      "false",
    );
    // El valor tecleado sigue ahí tras cambiar de nivel.
    await expect(page.getByTestId("campo-capitalInicial")).toHaveValue("50.000");
  });

  test("teclear '.' en es cuenta como decimal, no como separador de miles", async ({
    page,
  }) => {
    await abrir(page, "/es/");
    const campo = page.getByTestId("campo-capitalInicial");
    await campo.fill("");
    // El "." del teclado numérico es intención decimal: 1000.5 → 1.000,5
    // (sin el fix, el "." se eliminaría como millar y daría 10.005).
    await campo.pressSequentially("1000.5");
    await expect(campo).toHaveValue("1.000,5");
  });

  test("F4: tasa fuera de rango → error inline + scroll/focus, sin cálculo", async ({
    page,
  }) => {
    await abrir(page, "/es/");
    const tasa = page.getByTestId("campo-tasaNominalAnual");
    await tasa.fill("150");
    await tasa.blur();

    // Mensaje bajo el campo, con los límites del esquema interpolados.
    await expect(page.getByTestId("error-tasaNominalAnual")).toHaveText(
      "Ingresa un valor entre 0 y 100.",
    );

    // Calcular enfoca el primer (único) campo inválido y no revela resultados.
    await page.getByTestId("boton-calcular").click();
    await expect(tasa).toBeFocused();
  });

  test("F8: la misma pantalla en /en/ está en inglés", async ({ page }) => {
    await abrir(page, "/en/");
    await expect(page.getByTestId("boton-calcular")).toHaveText("Calculate");
    await expect(page.getByTestId("tab-basica")).toHaveText("Basic");
    await expect(page.getByTestId("campo-tasaNominalAnual")).toHaveValue("8");

    const tasa = page.getByTestId("campo-tasaNominalAnual");
    await tasa.fill("150");
    await tasa.blur();
    await expect(page.getByTestId("error-tasaNominalAnual")).toHaveText(
      "Enter a value between 0 and 100.",
    );
  });
});
