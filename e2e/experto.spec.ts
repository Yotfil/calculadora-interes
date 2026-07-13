import { expect, test } from "@playwright/test";

// Tab Experto (M13, docs/04 §6): las secciones "Protección final" y "Varianza"
// del Paso 4, el costo de la protección (G2) y la banda de varianza (V1) en
// resultados (docs/06 §1), que Básica las ignora (docs/04 §2) y los avisos suaves
// de la protección (docs/07 §3).
//
// El separador entre número y "US$" en es-ES es U+00A0 (NBSP); se normaliza a
// espacio antes de comparar (trampa conocida, igual que en avanzada.spec).
const norm = (s: string | null) => (s ?? "").replace(/\u00A0/g, " ");

test.describe("tab Experto — protección y varianza (M13)", () => {
  test("costo de la protección: E1 + protección 5/5 % → 137 928,15 (G2)", async ({
    page,
  }) => {
    await page.goto("/es/");
    await page.getByTestId("tab-experto").click();
    // Esperar a que Experto quede seleccionado antes de "Ver un ejemplo": así
    // cargarEjemplo lee tab="experto" y se queda ahí (no salta a Avanzada).
    await expect(page.getByTestId("tab-experto")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    // "Ver un ejemplo" en Experto carga E1 (impulso) y se queda en Experto
    // (docs/04 §4). Sin protección todavía: no hay costo.
    await page.getByTestId("ver-ejemplo").click();
    await expect(page.getByTestId("tab-experto")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("metrica-costo")).toHaveCount(0);

    // Protección final N=5 → 5 %: E1 + protección = G1 (docs/02 §5).
    await page.getByTestId("seccion-proteccion-toggle").click();
    await page.getByTestId("campo-aniosProteccion").fill("5");
    await page.getByTestId("campo-tasaReducida").fill("5");
    await page.getByTestId("boton-calcular").click();

    const costo = page.getByTestId("metrica-costo");
    await expect(costo).toBeVisible();
    expect(norm(await costo.textContent())).toContain("137.928,15 US$");
  });

  test("banda de varianza: escenario §3 con v=1 → [564 955,36 ; 816 454,87] (V1)", async ({
    page,
  }) => {
    await page.goto("/es/");
    await page.getByTestId("tab-experto").click();

    // Escenario §3 SIN impulso (P=10 000, régimen 420, 25 años, 10 %, mensual),
    // tecleado a mano para no arrastrar el impulso de "Ver un ejemplo".
    await page.getByTestId("campo-capitalInicial").fill("10000");
    await page.getByTestId("campo-aporteRegimen").fill("420");
    await page.getByTestId("campo-duracion").fill("25");
    await page.getByTestId("campo-tasaNominalAnual").fill("10");

    // Varianza v=1 → banda = [Básica al 9 %, Básica al 11 %] (docs/02 §8).
    await page.getByTestId("seccion-varianza-toggle").click();
    await page.getByTestId("campo-varianza").fill("1");
    await page.getByTestId("boton-calcular").click();

    const banda = page.getByTestId("metrica-banda");
    await expect(banda).toBeVisible();
    const texto = norm(await banda.textContent());
    expect(texto).toContain("564.955,36 US$");
    expect(texto).toContain("816.454,87 US$");
    // Los porcentajes del copy no son dinero (sin "US$"): "Con 10±1 %".
    expect(texto).toContain("Con 10±1 %");
  });

  test("Básica ignora la protección; los valores persisten al volver (docs/04 §2)", async ({
    page,
  }) => {
    await page.goto("/es/");
    await page.getByTestId("tab-experto").click();
    await expect(page.getByTestId("tab-experto")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.getByTestId("ver-ejemplo").click();

    await page.getByTestId("seccion-proteccion-toggle").click();
    await page.getByTestId("campo-aniosProteccion").fill("5");
    await page.getByTestId("campo-tasaReducida").fill("5");
    await page.getByTestId("boton-calcular").click();
    await expect(page.getByTestId("metrica-costo")).toBeVisible();

    // En Básica el mismo escenario ignora la protección: sin costo.
    await page.getByTestId("tab-basica").click();
    await page.getByTestId("boton-calcular").click();
    await expect(page.getByTestId("metrica-costo")).toHaveCount(0);

    // Los valores de protección siguen intactos al volver a Experto (docs/04 §2).
    await page.getByTestId("tab-experto").click();
    await expect(page.getByTestId("campo-aniosProteccion")).toHaveValue("5");
    await expect(page.getByTestId("campo-tasaReducida")).toHaveValue("5");
  });

  test("avisos suaves: protección incompleta y clampeada (docs/07 §3)", async ({
    page,
  }) => {
    await page.goto("/es/");
    await page.getByTestId("tab-experto").click();
    await page.getByTestId("seccion-proteccion-toggle").click();

    const aviso = page.getByTestId("aviso-proteccion");

    // Un solo campo lleno → incompleta.
    await page.getByTestId("campo-aniosProteccion").fill("5");
    await expect(aviso).toHaveText(
      "Completa ambos campos para aplicar esta sección.",
    );

    // Ambos llenos y la protección cubre todo el período (5 años ≥ duración 3) →
    // clampeada.
    await page.getByTestId("campo-tasaReducida").fill("5");
    await page.getByTestId("campo-duracion").fill("3");
    await expect(aviso).toHaveText(
      "La protección cubre todo el período: la escalera baja desde el inicio.",
    );
  });
});
