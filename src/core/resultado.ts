import type { FilaAnual } from "./fila-anual";

/**
 * Salida del motor (docs/01 §5). Números crudos en float64: el redondeo es
 * responsabilidad exclusiva de la capa de presentación (docs/02 §7).
 */
export interface Resultado {
  balanceFinal: number;
  /** La última fila puede ser parcial (duración no múltiplo de 12). */
  filas: FilaAnual[];
  /** capitalInicial + Σ aportes (docs/06 §1). */
  totalAportado: number;
  interesTotal: number;
  /** balanceFinal / totalAportado; 0 si totalAportado es 0. */
  multiplicador: number;
  /** Banda de varianza (docs/02 §8). Se llena en M11. */
  banda?: { inferior: number; superior: number };
}
