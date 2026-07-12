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
  const aporte: (t: number) => number = () => e.aporteRegimen;

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
