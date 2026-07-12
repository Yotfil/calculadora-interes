import { describe, expect, it } from "vitest";

import { esquemaFormulario, type ValoresFormulario } from "../formulario";
import { aEscenario } from "../a-escenario";

// El mapper conecta los valores validados (docs/02 §6) con el contrato del
// motor (docs/01 §5): unidad canónica en meses y secciones opcionales solo
// cuando sus dos campos están presentes. meta e inflacionAnual NO son parte
// de Escenario (van a despejarRegimen/deflactar en fase 3).

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
    expect(aEscenario(validar({}))).toEqual({
      capitalInicial: 1_000,
      aporteRegimen: 100,
      duracionMeses: 120,
      tasaNominalAnual: 8,
      frecuencia: 12,
    });
  });

  it("convierte años a meses (unidad canónica de docs/01 §5)", () => {
    expect(aEscenario(validar({ duracion: 3, duracionUnidad: "a" })).duracionMeses).toBe(36);
  });

  it("en meses pasa la duración tal cual", () => {
    expect(aEscenario(validar({ duracion: 18, duracionUnidad: "m" })).duracionMeses).toBe(18);
  });

  it("arma impulso solo con anios Y aporte presentes", () => {
    const completo = aEscenario(validar({ aniosImpulso: 2, aporteImpulso: 500 }));
    expect(completo.impulso).toEqual({ anios: 2, aporteMensual: 500 });

    expect(aEscenario(validar({ aniosImpulso: 2 })).impulso).toBeUndefined();
    expect(aEscenario(validar({ aporteImpulso: 500 })).impulso).toBeUndefined();
  });

  it("arma proteccion solo con anios Y tasa presentes", () => {
    const completo = aEscenario(validar({ aniosProteccion: 3, tasaReducida: 4 }));
    expect(completo.proteccion).toEqual({ anios: 3, tasaReducida: 4 });

    expect(aEscenario(validar({ aniosProteccion: 3 })).proteccion).toBeUndefined();
    expect(aEscenario(validar({ tasaReducida: 4 })).proteccion).toBeUndefined();
  });

  it("aporteImpulso 0 y tasaReducida 0 cuentan como presentes (no son 'vacío')", () => {
    const escenario = aEscenario(
      validar({ aniosImpulso: 1, aporteImpulso: 0, aniosProteccion: 1, tasaReducida: 0 }),
    );
    expect(escenario.impulso).toEqual({ anios: 1, aporteMensual: 0 });
    expect(escenario.proteccion).toEqual({ anios: 1, tasaReducida: 0 });
  });

  it("pasa la varianza cuando está presente, incluida 0", () => {
    expect(aEscenario(validar({})).varianza).toBeUndefined();
    expect(aEscenario(validar({ varianza: 1 })).varianza).toBe(1);
    expect(aEscenario(validar({ varianza: 0 })).varianza).toBe(0);
  });

  it("meta e inflacionAnual no se cuelan en el escenario", () => {
    const escenario = aEscenario(validar({ meta: 50_000, inflacionAnual: 5 }));
    expect(Object.keys(escenario)).toEqual([
      "capitalInicial",
      "aporteRegimen",
      "duracionMeses",
      "tasaNominalAnual",
      "frecuencia",
    ]);
  });
});
