import { describe, expect, it } from "vitest";

import {
  agruparMiles,
  contarSignificativos,
  desagruparMiles,
  posSignificativo,
  separadorDecimal,
} from "../miles";

describe("agruparMiles", () => {
  it("agrupa a partir de 4 dígitos en es (1000 → 1.000)", () => {
    expect(agruparMiles("1000", "es")).toBe("1.000");
    expect(agruparMiles("50000", "es")).toBe("50.000");
    expect(agruparMiles("1000000", "es")).toBe("1.000.000");
  });

  it("agrupa con coma en en (1000 → 1,000)", () => {
    expect(agruparMiles("1000", "en")).toBe("1,000");
    expect(agruparMiles("1000000", "en")).toBe("1,000,000");
  });

  it("no agrupa por debajo de 4 dígitos", () => {
    expect(agruparMiles("100", "es")).toBe("100");
    expect(agruparMiles("0", "es")).toBe("0");
    expect(agruparMiles("", "es")).toBe("");
  });

  it("preserva decimales y el separador decimal final que se teclea", () => {
    expect(agruparMiles("1000.5", "es")).toBe("1.000,5");
    expect(agruparMiles("1000.", "es")).toBe("1.000,");
    expect(agruparMiles("1000.50", "es")).toBe("1.000,50");
    expect(agruparMiles("1000.5", "en")).toBe("1,000.5");
  });
});

describe("desagruparMiles", () => {
  it("quita los miles y convierte el decimal del locale a punto (es)", () => {
    expect(desagruparMiles("1.000", "es")).toBe("1000");
    expect(desagruparMiles("50.000", "es")).toBe("50000");
    expect(desagruparMiles("1.000,5", "es")).toBe("1000.5");
    expect(desagruparMiles("1.000,", "es")).toBe("1000.");
  });

  it("quita los miles y conserva el punto decimal (en)", () => {
    expect(desagruparMiles("1,000", "en")).toBe("1000");
    expect(desagruparMiles("1,000.50", "en")).toBe("1000.50");
  });

  it("descarta caracteres no numéricos y colapsa a un solo decimal", () => {
    expect(desagruparMiles("1a2b3", "es")).toBe("123");
    // comas = decimales en es → todas a "." y se colapsa al primero.
    expect(desagruparMiles("1,2,3", "es")).toBe("1.23");
    expect(desagruparMiles("", "es")).toBe("");
  });

  it("es inversa de agrupar para enteros y decimales típicos", () => {
    for (const raw of ["1000", "50000", "1000000", "1000.5", "0", ""]) {
      expect(desagruparMiles(agruparMiles(raw, "es"), "es")).toBe(raw);
      expect(desagruparMiles(agruparMiles(raw, "en"), "en")).toBe(raw);
    }
  });
});

describe("separadorDecimal", () => {
  it("es coma en es y punto en en", () => {
    expect(separadorDecimal("es")).toBe(",");
    expect(separadorDecimal("en")).toBe(".");
  });
});

describe("cursor: caracteres significativos", () => {
  it("cuenta dígitos y decimal, ignora separadores de miles", () => {
    // "1.234,5" con el cursor tras "1.234" (índice 5) → 4 dígitos.
    expect(contarSignificativos("1.234,5", 5, "es")).toBe(4);
    // cursor al final → 5 dígitos + 1 decimal = 6 significativos.
    expect(contarSignificativos("1.234,5", 7, "es")).toBe(6);
    expect(contarSignificativos("1.000", 0, "es")).toBe(0);
  });

  it("posSignificativo ubica el índice tras el n-ésimo significativo", () => {
    // 4 significativos en "1.234.567" → tras "1.234" = índice 5.
    expect(posSignificativo("1.234.567", 4, "es")).toBe(5);
    expect(posSignificativo("1.000", 0, "es")).toBe(0);
    expect(posSignificativo("1.000", 99, "es")).toBe("1.000".length);
  });
});
