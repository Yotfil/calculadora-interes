/**
 * Fila de la tabla anual (docs/02 §2): acumulados del año calendario del plan
 * (meses 12k+1..12k+12). `aportado` NO incluye el capital inicial.
 */
export interface FilaAnual {
  anio: number;
  aportado: number;
  interes: number;
  balance: number;
  /** Meses que abarca la fila: 12, salvo la última si es parcial. */
  meses: number;
}
