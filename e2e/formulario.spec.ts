import { expect, test } from "@playwright/test";

import { abrir } from "./util";

// Contrato de comportamiento del formulario Básica (docs/04 §6). En M5 solo se
// cubren los flujos que no dependen de resultados (F1/F2/F6/F10 llegan en M6):
// render con defaults, conservación de valores al cambiar de tab, error inline
// con scroll+focus (F4) y paridad de idioma (F8).

test.describe("formulario Básica (M5)", () => {
  test("arranca con los defaults de docs/02 §6", async ({ page }) => {
    await page.goto("/es/");
    await expect(page.getByTestId("campo-capitalInicial")).toHaveValue("1000");
    await expect(page.getByTestId("campo-aporteRegimen")).toHaveValue("100");
    await expect(page.getByTestId("campo-duracion")).toHaveValue("10");
    await expect(page.getByTestId("campo-tasaNominalAnual")).toHaveValue("8");
    await expect(page.getByTestId("campo-frecuencia")).toHaveValue("12");
    await expect(page.getByTestId("unidad-anios")).toBeChecked();
  });

  test("cambiar de tab conserva los valores (docs/04 §2)", async ({ page }) => {
    await abrir(page, "/es/");
    await page.getByTestId("campo-capitalInicial").fill("50000");

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
    await expect(page.getByTestId("campo-capitalInicial")).toHaveValue("50000");
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
