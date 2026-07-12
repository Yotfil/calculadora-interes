import { describe, expect, it } from "vitest";

import { formatMoney } from "../formatMoney";

// Intl separa número y símbolo con espacios no separables (U+00A0/U+202F) que
// difieren entre Node y navegador (trampa conocida en ESTADO): se normalizan a
// espacio normal antes de comparar.
const norm = (s: string) => s.replace(/[\u00A0\u202F]/g, " ");

describe("formatMoney", () => {
  it("en-US: símbolo delante, coma de miles, punto decimal", () => {
    expect(norm(formatMoney(1234567.89, "en"))).toBe("$1,234,567.89");
    expect(norm(formatMoney(0, "en"))).toBe("$0.00");
  });

  it("es-ES: US$ al final, punto de miles, coma decimal (docs/07 §2)", () => {
    expect(norm(formatMoney(1234567.89, "es"))).toBe("1.234.567,89 US$");
    expect(norm(formatMoney(0, "es"))).toBe("0,00 US$");
  });

  it("la moneda es SIEMPRE USD, cambie o no el locale", () => {
    expect(formatMoney(1000, "en")).toContain("$");
    expect(norm(formatMoney(1000, "es"))).toContain("US$");
  });

  it("redondea a dos decimales al presentar", () => {
    expect(norm(formatMoney(0.005, "en"))).toBe("$0.01");
    expect(norm(formatMoney(-42.5, "en"))).toBe("-$42.50");
  });
});
