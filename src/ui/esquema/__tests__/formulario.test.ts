import { describe, expect, it } from "vitest";

import { esquemaFormulario } from "../formulario";

// Tabla de rangos, defaults y comportamiento fuera de rango de docs/02 §6.
// Los mensajes de error son CLAVES i18n (los textos llegan en M4, docs/07);
// aquí se verifica la clave y el campo (path) del primer issue.

/** Parsea y devuelve la clave de error del campo, o null si validó. */
function claveDeError(datos: Record<string, unknown>, campo: string): string | null {
  const resultado = esquemaFormulario.safeParse(datos);
  if (resultado.success) return null;
  const issue = resultado.error.issues.find((i) => i.path[0] === campo);
  return issue ? String(issue.message) : null;
}

/** Parsea datos válidos y devuelve el valor de un campo. */
function valorValidado(datos: Record<string, unknown>, campo: string): unknown {
  const resultado = esquemaFormulario.safeParse(datos);
  if (!resultado.success) {
    throw new Error(`se esperaba éxito: ${resultado.error.message}`);
  }
  return resultado.data[campo as keyof typeof resultado.data];
}

// Campos numéricos con rango cerrado: [min, max], default (undefined = vacío).
const RANGOS: Array<{
  campo: string;
  min: number;
  max: number;
  default: number | undefined;
}> = [
  { campo: "capitalInicial", min: 0, max: 100_000_000, default: 1_000 },
  { campo: "aporteRegimen", min: 0, max: 1_000_000, default: 100 },
  { campo: "aporteImpulso", min: 0, max: 1_000_000, default: undefined },
  { campo: "tasaNominalAnual", min: 0, max: 100, default: 8 },
  { campo: "tasaReducida", min: 0, max: 100, default: undefined },
  { campo: "varianza", min: 0, max: 20, default: undefined },
  { campo: "inflacionAnual", min: 0, max: 20, default: 3 },
  { campo: "meta", min: 1, max: 1_000_000_000, default: undefined },
];

describe("rangos y defaults de campos numéricos (docs/02 §6)", () => {
  it.each(RANGOS)("$campo: ausente toma su default", ({ campo, default: def }) => {
    expect(valorValidado({}, campo)).toBe(def);
  });

  it.each(RANGOS)("$campo: string vacío toma su default", ({ campo, default: def }) => {
    expect(valorValidado({ [campo]: "" }, campo)).toBe(def);
  });

  it.each(RANGOS)("$campo: acepta el mínimo $min", ({ campo, min }) => {
    expect(valorValidado({ [campo]: min }, campo)).toBe(min);
  });

  it.each(RANGOS)("$campo: acepta el máximo $max", ({ campo, max }) => {
    expect(valorValidado({ [campo]: max }, campo)).toBe(max);
  });

  it.each(RANGOS)("$campo: bajo el mínimo es error de rango", ({ campo, min }) => {
    expect(claveDeError({ [campo]: min - 0.5 }, campo)).toBe(`errores.${campo}.rango`);
  });

  it.each(RANGOS)("$campo: sobre el máximo es error de rango", ({ campo, max }) => {
    expect(claveDeError({ [campo]: max + 1 }, campo)).toBe(`errores.${campo}.rango`);
  });

  it.each(RANGOS)("$campo: texto no numérico es error de número", ({ campo }) => {
    expect(claveDeError({ [campo]: "abc" }, campo)).toBe(`errores.${campo}.numero`);
  });

  it.each(RANGOS)("$campo: coerciona string numérico (URL, docs/04 §5)", ({ campo, min }) => {
    expect(valorValidado({ [campo]: String(min) }, campo)).toBe(min);
  });

  it("las tasas aceptan decimales", () => {
    expect(valorValidado({ tasaNominalAnual: 7.35 }, "tasaNominalAnual")).toBe(7.35);
    expect(valorValidado({ tasaReducida: "0.5" }, "tasaReducida")).toBe(0.5);
  });
});

describe("duración: entero, 1–600 meses o 1–50 años según unidad (docs/02 §6)", () => {
  it("ausente toma el default de 10 años", () => {
    expect(valorValidado({}, "duracion")).toBe(10);
    expect(valorValidado({}, "duracionUnidad")).toBe("a");
  });

  it("acepta los bordes en años: 1 y 50", () => {
    expect(valorValidado({ duracion: 1, duracionUnidad: "a" }, "duracion")).toBe(1);
    expect(valorValidado({ duracion: 50, duracionUnidad: "a" }, "duracion")).toBe(50);
  });

  it("acepta los bordes en meses: 1 y 600", () => {
    expect(valorValidado({ duracion: 1, duracionUnidad: "m" }, "duracion")).toBe(1);
    expect(valorValidado({ duracion: 600, duracionUnidad: "m" }, "duracion")).toBe(600);
  });

  it("51 años es error de rango", () => {
    expect(claveDeError({ duracion: 51, duracionUnidad: "a" }, "duracion")).toBe(
      "errores.duracion.rango",
    );
  });

  it("601 meses es error de rango", () => {
    expect(claveDeError({ duracion: 601, duracionUnidad: "m" }, "duracion")).toBe(
      "errores.duracion.rango",
    );
  });

  it("0 es error de rango en ambas unidades", () => {
    expect(claveDeError({ duracion: 0, duracionUnidad: "a" }, "duracion")).toBe(
      "errores.duracion.rango",
    );
    expect(claveDeError({ duracion: 0, duracionUnidad: "m" }, "duracion")).toBe(
      "errores.duracion.rango",
    );
  });

  it("no entero es error de entero", () => {
    expect(claveDeError({ duracion: 10.5 }, "duracion")).toBe("errores.duracion.entero");
  });

  it("unidad inválida cae al default 'a'", () => {
    expect(valorValidado({ duracionUnidad: "x" }, "duracionUnidad")).toBe("a");
  });
});

describe("frecuencia: enum {1, 2, 4, 12}, fuera de rango toma default (docs/02 §6)", () => {
  it.each([1, 2, 4, 12])("acepta %i", (frecuencia) => {
    expect(valorValidado({ frecuencia }, "frecuencia")).toBe(frecuencia);
  });

  it("coerciona string numérico (URL, docs/04 §5)", () => {
    expect(valorValidado({ frecuencia: "4" }, "frecuencia")).toBe(4);
  });

  it("valor fuera del enum NO es error: toma el default 12", () => {
    expect(valorValidado({ frecuencia: 3 }, "frecuencia")).toBe(12);
    expect(valorValidado({ frecuencia: "abc" }, "frecuencia")).toBe(12);
  });

  it("ausente toma el default 12", () => {
    expect(valorValidado({}, "frecuencia")).toBe(12);
  });
});

describe("anios de impulso y protección: entero 1–5, vacío por default (docs/02 §6)", () => {
  it.each(["aniosImpulso", "aniosProteccion"])("%s: ausente queda vacío", (campo) => {
    expect(valorValidado({}, campo)).toBeUndefined();
  });

  it.each(["aniosImpulso", "aniosProteccion"])("%s: acepta 1 y 5", (campo) => {
    expect(valorValidado({ [campo]: 1 }, campo)).toBe(1);
    expect(valorValidado({ [campo]: "5" }, campo)).toBe(5);
  });

  it.each(["aniosImpulso", "aniosProteccion"])("%s: 0 y 6 son error de rango", (campo) => {
    expect(claveDeError({ [campo]: 0 }, campo)).toBe(`errores.${campo}.rango`);
    expect(claveDeError({ [campo]: 6 }, campo)).toBe(`errores.${campo}.rango`);
  });

  it.each(["aniosImpulso", "aniosProteccion"])("%s: no entero es error de rango", (campo) => {
    expect(claveDeError({ [campo]: 2.5 }, campo)).toBe(`errores.${campo}.rango`);
  });
});

describe("objeto completo", () => {
  it("sin datos produce todos los defaults de docs/02 §6", () => {
    const resultado = esquemaFormulario.safeParse({});
    expect(resultado.success).toBe(true);
    if (!resultado.success) return;
    expect(resultado.data).toEqual({
      capitalInicial: 1_000,
      aporteRegimen: 100,
      duracion: 10,
      duracionUnidad: "a",
      tasaNominalAnual: 8,
      frecuencia: 12,
      inflacionAnual: 3,
    });
  });

  it("acumula errores de varios campos a la vez (para el scroll al primero, M5)", () => {
    const resultado = esquemaFormulario.safeParse({
      capitalInicial: -1,
      tasaNominalAnual: 101,
    });
    expect(resultado.success).toBe(false);
    if (resultado.success) return;
    const campos = resultado.error.issues.map((i) => i.path[0]);
    expect(campos).toContain("capitalInicial");
    expect(campos).toContain("tasaNominalAnual");
  });
});
