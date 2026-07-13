import { describe, expect, it } from "vitest";

import { esquemaFormulario, type ValoresFormulario } from "../formulario";
import { aEscenario } from "../a-escenario";

// El mapper conecta los valores validados (docs/02 §6) con el contrato del
// motor (docs/01 §5): unidad canónica en meses y secciones opcionales solo
// cuando sus dos campos están presentes. meta e inflacionAnual NO son parte
// de Escenario (van a despejarRegimen/deflactar en fase 3). El `tab` define qué
// secciones entran al motor (docs/04 §2): impulso en Avanzada/Experto,
// protección y varianza solo en Experto.

/** Valores validados a partir de datos crudos (falla el test si no validan). */
function validar(datos: Record<string, unknown>): ValoresFormulario {
  const resultado = esquemaFormulario.safeParse(datos);
  if (!resultado.success) {
    throw new Error(`se esperaba éxito: ${resultado.error.message}`);
  }
  return resultado.data;
}

describe("aEscenario (tipos compartidos core↔UI, docs/01 §5)", () => {
  it("con defaults produce el escenario básico de 10 años", () => {
    expect(aEscenario(validar({}), "basica")).toEqual({
      capitalInicial: 1_000,
      aporteRegimen: 100,
      duracionMeses: 120,
      tasaNominalAnual: 8,
      frecuencia: 12,
    });
  });

  it("convierte años a meses (unidad canónica de docs/01 §5)", () => {
    expect(
      aEscenario(validar({ duracion: 3, duracionUnidad: "a" }), "basica")
        .duracionMeses,
    ).toBe(36);
  });

  it("en meses pasa la duración tal cual", () => {
    expect(
      aEscenario(validar({ duracion: 18, duracionUnidad: "m" }), "basica")
        .duracionMeses,
    ).toBe(18);
  });

  it("arma impulso solo con anios Y aporte presentes (en Avanzada)", () => {
    const completo = aEscenario(
      validar({ aniosImpulso: 2, aporteImpulso: 500 }),
      "avanzada",
    );
    expect(completo.impulso).toEqual({ anios: 2, aporteMensual: 500 });

    expect(
      aEscenario(validar({ aniosImpulso: 2 }), "avanzada").impulso,
    ).toBeUndefined();
    expect(
      aEscenario(validar({ aporteImpulso: 500 }), "avanzada").impulso,
    ).toBeUndefined();
  });

  it("arma proteccion solo con anios Y tasa presentes (en Experto)", () => {
    const completo = aEscenario(
      validar({ aniosProteccion: 3, tasaReducida: 4 }),
      "experto",
    );
    expect(completo.proteccion).toEqual({ anios: 3, tasaReducida: 4 });

    expect(
      aEscenario(validar({ aniosProteccion: 3 }), "experto").proteccion,
    ).toBeUndefined();
    expect(
      aEscenario(validar({ tasaReducida: 4 }), "experto").proteccion,
    ).toBeUndefined();
  });

  it("aporteImpulso 0 y tasaReducida 0 cuentan como presentes (no son 'vacío')", () => {
    const escenario = aEscenario(
      validar({
        aniosImpulso: 1,
        aporteImpulso: 0,
        aniosProteccion: 1,
        tasaReducida: 0,
      }),
      "experto",
    );
    expect(escenario.impulso).toEqual({ anios: 1, aporteMensual: 0 });
    expect(escenario.proteccion).toEqual({ anios: 1, tasaReducida: 0 });
  });

  it("pasa la varianza cuando está presente, incluida 0 (en Experto)", () => {
    expect(aEscenario(validar({}), "experto").varianza).toBeUndefined();
    expect(aEscenario(validar({ varianza: 1 }), "experto").varianza).toBe(1);
    expect(aEscenario(validar({ varianza: 0 }), "experto").varianza).toBe(0);
  });

  it("meta e inflacionAnual no se cuelan en el escenario", () => {
    const escenario = aEscenario(
      validar({ meta: 50_000, inflacionAnual: 5 }),
      "experto",
    );
    expect(Object.keys(escenario)).toEqual([
      "capitalInicial",
      "aporteRegimen",
      "duracionMeses",
      "tasaNominalAnual",
      "frecuencia",
    ]);
  });
});

describe("aEscenario respeta el tab activo (docs/04 §2)", () => {
  const conImpulso = validar({ aniosImpulso: 2, aporteImpulso: 500 });
  const conTodo = validar({
    aniosImpulso: 2,
    aporteImpulso: 500,
    aniosProteccion: 3,
    tasaReducida: 4,
    varianza: 1,
  });

  it("Básica ignora el impulso aunque los valores estén presentes", () => {
    expect(aEscenario(conImpulso, "basica").impulso).toBeUndefined();
  });

  it("Avanzada aplica el impulso pero ignora protección y varianza", () => {
    const e = aEscenario(conTodo, "avanzada");
    expect(e.impulso).toEqual({ anios: 2, aporteMensual: 500 });
    expect(e.proteccion).toBeUndefined();
    expect(e.varianza).toBeUndefined();
  });

  it("Experto aplica impulso, protección y varianza", () => {
    const e = aEscenario(conTodo, "experto");
    expect(e.impulso).toEqual({ anios: 2, aporteMensual: 500 });
    expect(e.proteccion).toEqual({ anios: 3, tasaReducida: 4 });
    expect(e.varianza).toBe(1);
  });
});
