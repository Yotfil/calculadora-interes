import { describe, expect, it } from "vitest";

import es from "../../../i18n/es.json";
import { mapearError } from "../mapear-error";

// El diccionario canónico es el contrato de textos (docs/07 §3). Las plantillas
// genéricas `error.*` viven ahí; este test fija el mapeo clave-de-esquema → texto.
describe("mapearError", () => {
  it("interpola min/max de un campo plano en error.rango", () => {
    expect(mapearError(es, "errores.tasaNominalAnual.rango")).toBe(
      "Ingresa un valor entre 0 y 100.",
    );
    expect(mapearError(es, "errores.capitalInicial.rango")).toBe(
      "Ingresa un valor entre 0 y 100000000.",
    );
  });

  it("usa el rango de la unidad para duracion.rango", () => {
    expect(
      mapearError(es, "errores.duracion.rango", { duracionUnidad: "a" }),
    ).toBe("Ingresa un valor entre 1 y 50.");
    expect(
      mapearError(es, "errores.duracion.rango", { duracionUnidad: "m" }),
    ).toBe("Ingresa un valor entre 1 y 600.");
  });

  it("sin contexto, duracion.rango asume años", () => {
    expect(mapearError(es, "errores.duracion.rango")).toBe(
      "Ingresa un valor entre 1 y 50.",
    );
  });

  it("no interpola en .numero y .entero", () => {
    expect(mapearError(es, "errores.tasaNominalAnual.numero")).toBe(
      "Ingresa un número.",
    );
    expect(mapearError(es, "errores.duracion.entero")).toBe(
      "Ingresa un número entero.",
    );
  });

  it("devuelve la clave tal cual si no calza con la forma esperada", () => {
    expect(mapearError(es, "algo.raro")).toBe("algo.raro");
  });
});
