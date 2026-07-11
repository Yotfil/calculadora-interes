import { describe, expect, it } from "vitest";

// Ancla la decisión de datos de CLAUDE.md §8: dinero en float64 durante el
// cálculo, redondeo solo al presentar, asserts monetarios con ±0,01 USD.
// M2 lo reemplaza con las tablas de casos de docs/02.
describe("entorno del motor (float64, sin redondeo interno)", () => {
  it("los asserts monetarios usan tolerancia absoluta de ±0,01", () => {
    const acumulado = 0.1 + 0.2; // 0.30000000000000004 en float64
    expect(acumulado).not.toBe(0.3);
    expect(Math.abs(acumulado - 0.3)).toBeLessThan(0.01);
  });
});
