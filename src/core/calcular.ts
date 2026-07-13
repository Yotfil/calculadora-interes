import type { Escenario } from "./escenario";
import type { FilaAnual } from "./fila-anual";
import type { Resultado } from "./resultado";
import { tasaMensualEquivalente } from "./tasas";

/**
 * Motor núcleo (docs/02 §2): aportes al fin de mes, orden fijo
 * `balance = balance * (1 + tasa(t)) + aporte(t)`, float64 sin redondeos
 * internos. M9 (impulso) y M10 (glide) solo cambian cómo se construyen
 * `tasa(t)` y `aporte(t)`.
 */
export function calcular(e: Escenario): Resultado {
  const iMes = tasaMensualEquivalente(e.tasaNominalAnual, e.frecuencia);
  const tasa: (t: number) => number = () => iMes;
  const aporte = construirAporte(e);

  const filas: FilaAnual[] = [];
  let balance = e.capitalInicial;
  let aportadoAnio = 0;
  let interesAnio = 0;
  let mesesAnio = 0;

  for (let t = 1; t <= e.duracionMeses; t++) {
    const interesMes = balance * tasa(t);
    const aporteMes = aporte(t);
    balance = balance * (1 + tasa(t)) + aporteMes;

    aportadoAnio += aporteMes;
    interesAnio += interesMes;
    mesesAnio += 1;

    if (mesesAnio === 12 || t === e.duracionMeses) {
      filas.push({
        anio: filas.length + 1,
        aportado: aportadoAnio,
        interes: interesAnio,
        balance,
        meses: mesesAnio,
      });
      aportadoAnio = 0;
      interesAnio = 0;
      mesesAnio = 0;
    }
  }

  const totalAportado =
    e.capitalInicial + filas.reduce((suma, fila) => suma + fila.aportado, 0);
  const interesTotal = balance - totalAportado;
  const multiplicador = totalAportado === 0 ? 0 : balance / totalAportado;

  return { balanceFinal: balance, filas, totalAportado, interesTotal, multiplicador };
}

/**
 * Hook `aporte(t)` (docs/02 §4). Sin impulso: aporte de régimen constante. Con
 * impulso: durante los primeros `corte = min(N*12, duracionMeses)` meses el
 * aporte es `X` (impulso), luego vuelve al régimen. El `min` es el clampeo del
 * borde 2 (N*12 ≥ duración → todo el período usa X).
 */
function construirAporte(e: Escenario): (t: number) => number {
  if (!e.impulso) return () => e.aporteRegimen;

  const { anios, aporteMensual } = e.impulso;
  const corte = Math.min(anios * 12, e.duracionMeses);
  return (t) => (t <= corte ? aporteMensual : e.aporteRegimen);
}
