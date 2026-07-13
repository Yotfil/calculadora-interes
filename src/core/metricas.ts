import { calcular } from "./calcular";
import type { Escenario } from "./escenario";
import type { Banda } from "./resultado";

/**
 * Métricas derivadas (docs/06 §1). Operan SOBRE resultados ya calculados:
 * re-corren `calcular` con escenarios modificados y comparan corridas. No tocan
 * el bucle del motor ni redondean (float64 crudo; el redondeo es de presentación).
 */

/**
 * Ahorro del plan escalonado (Avanzada; solo con impulso aplicado). Como el
 * balance es lineal en los aportes bajo una senda de tasa fija, el "fijo
 * equivalente" F es el aporte mensual constante que alcanza el MISMO balance:
 *   F = (balanceEscalonado − FV(solo capital)) / FV(aporte 1/mes)
 * y el ahorro = F·M − Σaportes escalonados. Sin impulso → null.
 */
export function ahorroEscalonado(e: Escenario): number | null {
  if (!e.impulso) return null;

  const escalonado = calcular(e);
  // FV de cada componente con la MISMA senda de tasa (sin impulso).
  const fvCapital = calcular({
    ...e,
    aporteRegimen: 0,
    impulso: undefined,
  }).balanceFinal;
  const fvAporteUno = calcular({
    ...e,
    capitalInicial: 0,
    aporteRegimen: 1,
    impulso: undefined,
  }).balanceFinal;

  const fijoEquivalente = (escalonado.balanceFinal - fvCapital) / fvAporteUno;
  const sumaAportes = escalonado.totalAportado - e.capitalInicial;
  return fijoEquivalente * e.duracionMeses - sumaAportes;
}

/**
 * Costo de la protección (Experto; solo con protección aplicada): cuánto balance
 * final se cede por suavizar la tasa al final. Sin protección → null.
 */
export function costoProteccion(e: Escenario): number | null {
  if (!e.proteccion) return null;
  return (
    calcular({ ...e, proteccion: undefined }).balanceFinal -
    calcular(e).balanceFinal
  );
}

/**
 * Banda de varianza (docs/02 §8). Corre el motor con la principal desplazada ∓v
 * y ±v (nominal recortado a [0,100]); la varianza NO toca la reducida del glide,
 * y como `construirTasa` deriva los bloques de `tasaNominalAnual` sin alterar
 * `tasaReducida`, basta correr con la principal desplazada. Sin varianza (o
 * v ≤ 0) → null.
 */
export function bandaVarianza(e: Escenario): Banda | null {
  if (!e.varianza || e.varianza <= 0) return null;

  const conPrincipal = (nominal: number): number =>
    calcular({ ...e, tasaNominalAnual: recortar(nominal), varianza: undefined })
      .balanceFinal;

  return {
    inferior: conPrincipal(e.tasaNominalAnual - e.varianza),
    superior: conPrincipal(e.tasaNominalAnual + e.varianza),
  };
}

/** Recorta el nominal a [0,100] (docs/02 §6): 0,5 %−1 → 0 %; 99,5 %+1 → 100 %. */
function recortar(nominal: number): number {
  return Math.max(0, Math.min(100, nominal));
}
