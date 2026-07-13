import { expect, test } from "@playwright/test";

import { abrir } from "./util";

// Tab Avanzada (M12, docs/04 §6): "Ver un ejemplo" (F2), el impulso solo aplica
// fuera de Básica (docs/04 §2) y los avisos suaves de la sección (docs/07 §3).
//
// El separador entre número y "US$" en es-ES es U+00A0 (NBSP); se normaliza a
// espacio antes de comparar (trampa conocida, igual que en resultados.spec).
const norm = (s: string | null) => (s ?? "").replace(/\u00A0/g, " ");

test.describe("tab Avanzada — impulso inicial (M12)", () => {
  test("F2: 'Ver un ejemplo' precarga E1 en Avanzada y calcula 1 006 969", async ({
    page,
  }) => {
    await abrir(page, "/es/");
    await expect(page.getByTestId("estado-vacio")).toBeVisible();

    await page.getByTestId("ver-ejemplo").click();

    // Salta a Avanzada con la sección de impulso expandida y los campos de E1.
    await expect(page.getByTestId("tab-avanzada")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("seccion-impulso-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByTestId("campo-aniosImpulso")).toHaveValue("5");
    await expect(page.getByTestId("campo-aporteImpulso")).toHaveValue("1000");

    // Cifra grande = balance final de E1 (docs/02 §4).
    const cifra = page.getByTestId("cifra-grande");
    await expect
      .poll(async () => norm(await cifra.textContent()))
      .toContain("1.006.968,93 US$");

    // Métrica de ahorro (docs/06 §1 K1/K2): fijo 668,06 y ahorro 39 616,90.
    const metrica = page.getByTestId("metrica-ahorro");
    await expect(metrica).toBeVisible();
    const texto = norm(await metrica.textContent());
    expect(texto).toContain("668,06 US$");
    expect(texto).toContain("39.616,90 US$");
  });

  test("Básica ignora el impulso; los valores persisten al volver (docs/04 §2)", async ({
    page,
  }) => {
    await abrir(page, "/es/");
    await page.getByTestId("ver-ejemplo").click();
    await expect(page.getByTestId("metrica-ahorro")).toBeVisible();

    // Con los mismos valores (P=10 000, régimen 420, 300 m, 10 %), Básica no
    // aplica el impulso: balance = escenario §3 y sin métrica de ahorro.
    await page.getByTestId("tab-basica").click();
    await page.getByTestId("boton-calcular").click();
    await expect
      .poll(async () =>
        norm(await page.getByTestId("cifra-grande").textContent()),
      )
      .toContain("677.839,48 US$");
    await expect(page.getByTestId("metrica-ahorro")).toHaveCount(0);

    // Los valores del impulso siguen intactos al volver a Avanzada (docs/04 §2).
    await page.getByTestId("tab-avanzada").click();
    await expect(page.getByTestId("campo-aniosImpulso")).toHaveValue("5");
    await expect(page.getByTestId("campo-aporteImpulso")).toHaveValue("1000");
  });

  test("avisos suaves: sección incompleta y sección clampeada (docs/07 §3)", async ({
    page,
  }) => {
    await abrir(page, "/es/");
    await page.getByTestId("tab-avanzada").click();
    await page.getByTestId("seccion-impulso-toggle").click();

    const aviso = page.getByTestId("aviso-impulso");

    // Un solo campo lleno → incompleta.
    await page.getByTestId("campo-aniosImpulso").fill("5");
    await expect(aviso).toHaveText(
      "Completa ambos campos para aplicar esta sección.",
    );

    // Ambos llenos y el impulso cubre todo el período (5 años ≥ duración 3) →
    // clampeada.
    await page.getByTestId("campo-aporteImpulso").fill("500");
    await page.getByTestId("campo-duracion").fill("3");
    await expect(aviso).toHaveText("Tu impulso cubre todo el período.");
  });
});
