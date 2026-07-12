/** Frecuencia de capitalización: anual, semestral, trimestral o mensual. */
export type FrecuenciaCap = 1 | 2 | 4 | 12;

/** Años de una sección opcional (impulso o protección). */
export type AniosSeccion = 1 | 2 | 3 | 4 | 5;

/** Entradas del motor (docs/01 §5). Unidad canónica de duración: meses. */
export interface Escenario {
  capitalInicial: number;
  aporteRegimen: number;
  duracionMeses: number;
  /** Nominal anual en %, ej. 10 (docs/02 §1). */
  tasaNominalAnual: number;
  frecuencia: FrecuenciaCap;
  /** Aportes escalonados, tab Avanzada (docs/02 §4). Se aplica en M9. */
  impulso?: { anios: AniosSeccion; aporteMensual: number };
  /** Glide path gradual, tab Experto (docs/02 §5). Se aplica en M10. */
  proteccion?: { anios: AniosSeccion; tasaReducida: number };
  /** En puntos de %, ej. 1 (docs/02 §8). Se aplica en M11. */
  varianza?: number;
}
