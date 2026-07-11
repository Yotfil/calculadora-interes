import type { FrecuenciaCap } from "./escenario";

/**
 * Tasa efectiva anual como fracción (docs/02 §1): EA = (1 + r/m)^m − 1.
 * `tasaNominalAnualPct` en %, como llega en `Escenario` (10 % → 10).
 */
export function tasaEfectivaAnual(tasaNominalAnualPct: number, m: FrecuenciaCap): number {
  const r = tasaNominalAnualPct / 100;
  return (1 + r / m) ** m - 1;
}

/**
 * Tasa mensual equivalente como fracción (docs/02 §1):
 * i_mes = (1 + r/m)^(m/12) − 1.
 */
export function tasaMensualEquivalente(tasaNominalAnualPct: number, m: FrecuenciaCap): number {
  const r = tasaNominalAnualPct / 100;
  return (1 + r / m) ** (m / 12) - 1;
}
