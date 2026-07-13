import { expect, test } from "@playwright/test";

import { abrir } from "./util";

// Zona de resultados de la Básica (docs/04 §6). M6 cubre F1 (cálculo básico) y
// F9 (reduced-motion). F2 (ejemplo E1) se difiere a M12: E1 usa el impulso
// escalonado de Avanzada, inexistente en la Básica de Fase 1.
//
// El separador entre número y "US$" en es-ES es U+00A0 (NBSP); se normaliza a
// espacio antes de comparar (trampa conocida, igual que en formatMoney.test).
const norm = (s: string | null) => (s ?? "").replace(/\u00A0/g, " ");

test.describe("resultados Básica (M6)", () => {
  test("F1: defaults → Calcular muestra cifra, frase y tabla", async ({ page }) => {
    await abrir(page, "/es/");

    // Antes de calcular: estado vacío, sin resultado.
    await expect(page.getByTestId("estado-vacio")).toBeVisible();

    await page.getByTestId("boton-calcular").click();

    // Cifra grande: al asentarse el conteo, muestra el balance final.
    const cifra = page.getByTestId("cifra-grande");
    await expect(cifra).toBeVisible();
    await expect
      .poll(async () => norm(await cifra.textContent()))
      .toContain("20.514,24 US$");

    // Frase resumen exacta (docs/07 §4, variante normal).
    const frase = page.getByTestId("frase-resumen");
    await expect
      .poll(async () => norm(await frase.textContent()))
      .toBe(
        "En 10 años, tendrás 20.514,24 US$. Aportaste 13.000,00 US$ y el interés puso 7514,24 US$ — tu dinero se multiplicó por 1,6.",
      );

    // Tabla anual: 10 filas de datos (10 años completos, sin fila parcial).
    const tabla = page.getByTestId("tabla-anual");
    await expect(tabla).toBeVisible();
    await expect(tabla.locator("tbody tr")).toHaveCount(10);

    // El estado vacío desaparece una vez hay resultado.
    await expect(page.getByTestId("estado-vacio")).toHaveCount(0);
  });

  test("F9: con prefers-reduced-motion el resultado aparece sin animar", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await abrir(page, "/es/");
    await page.getByTestId("boton-calcular").click();

    // Sin animación, la cifra muestra el valor final directamente (no cuenta
    // desde 0): el resultado y la tabla están visibles.
    await expect(page.getByTestId("resultado")).toBeVisible();
    await expect
      .poll(async () => norm(await page.getByTestId("cifra-grande").textContent()))
      .toContain("20.514,24 US$");
    await expect(page.getByTestId("tabla-anual")).toBeVisible();
  });
});
