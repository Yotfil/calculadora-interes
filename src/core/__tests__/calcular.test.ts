import { describe, expect, it } from "vitest";

import { calcular } from "../calcular";
import type { Escenario, FrecuenciaCap } from "../escenario";

// Tablas de docs/02 §2–3. Asserts monetarios: toBeCloseTo(v, 2) ⇒ ±0,01 USD.

function escenario(parcial: Partial<Escenario>): Escenario {
  return {
    capitalInicial: 0,
    aporteRegimen: 100,
    duracionMeses: 12,
    tasaNominalAnual: 10,
    frecuencia: 12,
    ...parcial,
  };
}

describe("núcleo (docs/02 §2, P=0, aporte 100, 12 meses, tasa 10 %)", () => {
  const NUCLEO: Array<{ caso: string; m: FrecuenciaCap; balanceFinal: number }> = [
    { caso: "N1", m: 1, balanceFinal: 1254.05 },
    { caso: "N2", m: 2, balanceFinal: 1255.38 },
    { caso: "N3", m: 4, balanceFinal: 1256.08 },
    { caso: "N4", m: 12, balanceFinal: 1256.56 },
  ];

  it.each(NUCLEO)("$caso: m=$m → $balanceFinal", ({ m, balanceFinal }) => {
    expect(calcular(escenario({ frecuencia: m })).balanceFinal).toBeCloseTo(balanceFinal, 2);
  });

  it("N5: aporte 0, P=10 000, 12 m, 10 %, m=12 → 11 047,13", () => {
    const r = calcular(escenario({ capitalInicial: 10_000, aporteRegimen: 0 }));
    expect(r.balanceFinal).toBeCloseTo(11_047.13, 2);
  });

  it("N6: tasa 0 %, P=1 000, aporte 100, 24 m → 3 400,00", () => {
    const r = calcular(escenario({ capitalInicial: 1_000, tasaNominalAnual: 0, duracionMeses: 24 }));
    expect(r.balanceFinal).toBeCloseTo(3_400.0, 2);
  });

  it("N7: duración 1 mes, P=0, aporte 100, 10 % → 100,00 (el aporte del mes no gana interés)", () => {
    expect(calcular(escenario({ duracionMeses: 1 })).balanceFinal).toBeCloseTo(100.0, 2);
  });
});

describe("escenario Básica de referencia (docs/02 §3)", () => {
  const basica = escenario({ capitalInicial: 10_000, aporteRegimen: 420, duracionMeses: 300 });

  it("P=10 000, aporte 420, 300 m, 10 %, m=12 → 677 839,48", () => {
    expect(calcular(basica).balanceFinal).toBeCloseTo(677_839.48, 2);
  });

  it("totales: aportado 136 000, interés 541 839,48, multiplicador ≈ 4,984", () => {
    const r = calcular(basica);
    expect(r.totalAportado).toBeCloseTo(136_000, 2);
    expect(r.interesTotal).toBeCloseTo(541_839.48, 2);
    expect(r.multiplicador).toBeCloseTo(4.9841, 3);
  });
});

describe("filas anuales (docs/02 §2)", () => {
  it("12 meses → 1 fila completa que cierra en el balance final", () => {
    const r = calcular(escenario({}));
    expect(r.filas).toHaveLength(1);
    expect(r.filas[0]).toMatchObject({ anio: 1, meses: 12 });
    expect(r.filas[0].balance).toBeCloseTo(r.balanceFinal, 2);
  });

  it("30 meses → 3 filas y la última es parcial (6 meses)", () => {
    const r = calcular(escenario({ duracionMeses: 30 }));
    expect(r.filas.map((f) => f.anio)).toEqual([1, 2, 3]);
    expect(r.filas.map((f) => f.meses)).toEqual([12, 12, 6]);
    expect(r.filas[2].balance).toBeCloseTo(r.balanceFinal, 2);
  });

  it("los acumulados anuales cuadran con los totales (docs/06 §1)", () => {
    const r = calcular(escenario({ capitalInicial: 10_000, aporteRegimen: 420, duracionMeses: 30 }));
    const aportadoFilas = r.filas.reduce((s, f) => s + f.aportado, 0);
    const interesFilas = r.filas.reduce((s, f) => s + f.interes, 0);
    expect(aportadoFilas + 10_000).toBeCloseTo(r.totalAportado, 2);
    expect(interesFilas).toBeCloseTo(r.interesTotal, 2);
  });

  it("N6 (tasa 0) fila 1: aportado 1 200, interés 0, balance 2 200", () => {
    const r = calcular(escenario({ capitalInicial: 1_000, tasaNominalAnual: 0, duracionMeses: 24 }));
    expect(r.filas[0].aportado).toBeCloseTo(1_200, 2);
    expect(r.filas[0].interes).toBeCloseTo(0, 2);
    expect(r.filas[0].balance).toBeCloseTo(2_200, 2);
  });
});

describe("bordes del resultado", () => {
  it("multiplicador es 0 (no NaN) cuando no se aporta nada", () => {
    const r = calcular(escenario({ capitalInicial: 0, aporteRegimen: 0 }));
    expect(r.totalAportado).toBe(0);
    expect(r.multiplicador).toBe(0);
  });
});
