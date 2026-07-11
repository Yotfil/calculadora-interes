import { describe, expect, it } from "vitest";

import type { FrecuenciaCap } from "../escenario";
import { tasaEfectivaAnual, tasaMensualEquivalente } from "../tasas";

// Tabla de verificación de docs/02 §1 (r = 10 %). EA con 4 decimales de %,
// i_mes con 6 decimales de %.
const TABLA: Array<{ m: FrecuenciaCap; nombre: string; eaPct: number; iMesPct: number }> = [
  { m: 1, nombre: "anual", eaPct: 10.0, iMesPct: 0.797414 },
  { m: 2, nombre: "semestral", eaPct: 10.25, iMesPct: 0.816485 },
  { m: 4, nombre: "trimestral", eaPct: 10.3813, iMesPct: 0.826484 },
  { m: 12, nombre: "mensual", eaPct: 10.4713, iMesPct: 0.833333 },
];

describe("tasas equivalentes (docs/02 §1, r = 10 %)", () => {
  it.each(TABLA)("EA con m=$m ($nombre) es $eaPct %", ({ m, eaPct }) => {
    expect(tasaEfectivaAnual(10, m) * 100).toBeCloseTo(eaPct, 4);
  });

  it.each(TABLA)("i_mes con m=$m ($nombre) es $iMesPct %", ({ m, iMesPct }) => {
    expect(tasaMensualEquivalente(10, m) * 100).toBeCloseTo(iMesPct, 6);
  });

  it("tasa 0 % da EA e i_mes 0 en toda frecuencia", () => {
    for (const { m } of TABLA) {
      expect(tasaEfectivaAnual(0, m)).toBe(0);
      expect(tasaMensualEquivalente(0, m)).toBe(0);
    }
  });
});
