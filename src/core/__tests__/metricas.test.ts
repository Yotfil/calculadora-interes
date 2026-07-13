import { describe, expect, it } from "vitest";

import { calcular } from "../calcular";
import type { Escenario } from "../escenario";
import {
  ahorroEscalonado,
  bandaVarianza,
  costoProteccion,
  fijoEquivalente,
} from "../metricas";

// docs/06 §1 (métricas derivadas). Asserts monetarios: toBeCloseTo(v, 2) ⇒ ±0,01.
// Todas operan SOBRE resultados ya calculados; re-corren `calcular` con
// escenarios modificados, nunca tocan el bucle.

/** Escenario Básica de referencia (docs/02 §3): P=10 000, aporte 420, 300 m, 10 %. */
function base(parcial: Partial<Escenario> = {}): Escenario {
  return {
    capitalInicial: 10000,
    aporteRegimen: 420,
    duracionMeses: 300,
    tasaNominalAnual: 10,
    frecuencia: 12,
    ...parcial,
  };
}

/** E1 canónico (docs/02 §4): base + impulso X=1 000, N=5. */
const E1 = base({ impulso: { anios: 5, aporteMensual: 1000 } });

describe("ahorro del plan escalonado (docs/06 §1, K1–K2)", () => {
  it("K2: ahorro sobre E1 = 39 616,90", () => {
    expect(ahorroEscalonado(E1)).toBeCloseTo(39616.9, 2);
  });

  it("K1: el fijo equivalente sobre E1 = 668,06 /mes", () => {
    expect(fijoEquivalente(E1)).toBeCloseTo(668.06, 2);
  });

  it("el ahorro reconstruye F·M − Σaportes con el fijo equivalente", () => {
    // Contrato entre ambas métricas: ahorro = F·M − Σaportes (docs/06 §1).
    const F = fijoEquivalente(E1)!;
    const sigmaAportes = calcular(E1).totalAportado - E1.capitalInicial;
    expect(ahorroEscalonado(E1)).toBeCloseTo(
      F * E1.duracionMeses - sigmaAportes,
      2,
    );
  });

  it("sin impulso → null (métricas solo de Avanzada con impulso aplicado)", () => {
    expect(ahorroEscalonado(base())).toBeNull();
    expect(fijoEquivalente(base())).toBeNull();
  });
});

describe("costo de la protección (docs/06 §1 K3 = docs/02 §5 G2)", () => {
  // G1 (docs/02 §5): E1 + protección N=5 → 5 %.
  const G1 = base({
    impulso: { anios: 5, aporteMensual: 1000 },
    proteccion: { anios: 5, tasaReducida: 5 },
  });

  it("K3/G2: costo sobre G1 = 137 928,15", () => {
    expect(costoProteccion(G1)).toBeCloseTo(137928.15, 2);
  });

  it("es la diferencia balance(sin protección) − balance(con protección)", () => {
    const sinProt = calcular({ ...G1, proteccion: undefined }).balanceFinal;
    expect(costoProteccion(G1)).toBeCloseTo(
      sinProt - calcular(G1).balanceFinal,
      2,
    );
  });

  it("sin protección → null (métrica solo de Experto con protección aplicada)", () => {
    expect(costoProteccion(base())).toBeNull();
  });
});

describe("banda de varianza (docs/02 §8, V1)", () => {
  it("V1: escenario §3 con v=1 → banda = [Básica al 9 %, Básica al 11 %]", () => {
    const banda = bandaVarianza(base({ varianza: 1 }))!;
    expect(banda.inferior).toBeCloseTo(564955.36, 2);
    expect(banda.superior).toBeCloseTo(816454.87, 2);
  });

  it("±v desplaza la tasa PRINCIPAL (equivale a correr con tasa∓/±v)", () => {
    const banda = bandaVarianza(base({ varianza: 1 }))!;
    expect(banda.inferior).toBeCloseTo(
      calcular(base({ tasaNominalAnual: 9 })).balanceFinal,
      2,
    );
    expect(banda.superior).toBeCloseTo(
      calcular(base({ tasaNominalAnual: 11 })).balanceFinal,
      2,
    );
  });

  it("recorta el nominal a [0,100]: 0,5 % con v=1 → banda inferior corre al 0 %", () => {
    const banda = bandaVarianza(base({ tasaNominalAnual: 0.5, varianza: 1 }))!;
    expect(banda.inferior).toBeCloseTo(
      calcular(base({ tasaNominalAnual: 0 })).balanceFinal,
      2,
    );
  });

  it("recorta el nominal a [0,100]: 99,5 % con v=1 → banda superior corre al 100 %", () => {
    const banda = bandaVarianza(base({ tasaNominalAnual: 99.5, varianza: 1 }))!;
    expect(banda.superior).toBeCloseTo(
      calcular(base({ tasaNominalAnual: 100 })).balanceFinal,
      2,
    );
  });

  it("NO aplica a la tasa reducida del glide (solo desplaza la principal)", () => {
    const glide = base({ proteccion: { anios: 5, tasaReducida: 5 } });
    const banda = bandaVarianza({ ...glide, varianza: 1 })!;
    // La reducida (5 %) queda intacta; solo la principal sube a 11 %.
    const esperado = calcular({ ...glide, tasaNominalAnual: 11 }).balanceFinal;
    expect(banda.superior).toBeCloseTo(esperado, 2);
  });

  it("sin varianza (o v=0) → null", () => {
    expect(bandaVarianza(base())).toBeNull();
    expect(bandaVarianza(base({ varianza: 0 }))).toBeNull();
  });
});

describe("K4–K5 sobre E1 (ya en Resultado, docs/06 §1)", () => {
  it("K4 multiplicador ≈ 5,9 (1 006 968,93 / 170 800)", () => {
    expect(calcular(E1).multiplicador).toBeCloseTo(5.9, 1);
  });

  it("K5 interés total = 836 168,93", () => {
    expect(calcular(E1).interesTotal).toBeCloseTo(836168.93, 2);
  });
});
