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
  const tasa = construirTasa(e);
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
 * Hook `tasa(t)` (docs/02 §5, glide path). Sin protección: tasa mensual
 * equivalente constante (idéntico a M2). Con protección: los últimos `N'*12`
 * meses bajan en escalera anual desde la principal hacia la reducida, en
 * bloques de 12 contados DESDE EL FINAL. `N' = min(N, ceil(duracion/12))` es el
 * clampeo del borde 2. La reducida usa la MISMA convención §1 (nominal + el
 * selector `m` del formulario): se convierte una sola vez con
 * `tasaMensualEquivalente(r_k, e.frecuencia)`, no dos.
 */
function construirTasa(e: Escenario): (t: number) => number {
  const iMes = tasaMensualEquivalente(e.tasaNominalAnual, e.frecuencia);
  if (!e.proteccion) return () => iMes;

  const { anios, tasaReducida } = e.proteccion;
  const principal = e.tasaNominalAnual;
  const bloques = Math.min(anios, Math.ceil(e.duracionMeses / 12)); // N'
  const inicioProt = e.duracionMeses - bloques * 12;

  return (t) => {
    if (t <= inicioProt) return iMes;
    const j = Math.ceil((e.duracionMeses - t + 1) / 12); // bloque desde el final (1 = último)
    const k = bloques - j + 1; // 1..N'
    const rk = principal - ((principal - tasaReducida) * k) / bloques; // nominal del bloque
    return tasaMensualEquivalente(rk, e.frecuencia);
  };
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
