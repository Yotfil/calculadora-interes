import type { Escenario } from "../../core";

import type { ValoresFormulario } from "./formulario";

/**
 * Arma la entrada del motor (docs/01 §5) desde los valores validados del
 * formulario/URL (docs/02 §6). La unidad canónica es el mes; las secciones
 * opcionales solo existen con sus DOS campos presentes (0 sí es presente).
 * meta e inflacionAnual no viajan aquí: son entradas de despejarRegimen y
 * deflactar (docs/03), no de calcular.
 */
export function aEscenario(valores: ValoresFormulario): Escenario {
  const escenario: Escenario = {
    capitalInicial: valores.capitalInicial,
    aporteRegimen: valores.aporteRegimen,
    duracionMeses:
      valores.duracionUnidad === "a" ? valores.duracion * 12 : valores.duracion,
    tasaNominalAnual: valores.tasaNominalAnual,
    frecuencia: valores.frecuencia,
  };

  if (valores.aniosImpulso !== undefined && valores.aporteImpulso !== undefined) {
    escenario.impulso = {
      anios: valores.aniosImpulso,
      aporteMensual: valores.aporteImpulso,
    };
  }

  if (valores.aniosProteccion !== undefined && valores.tasaReducida !== undefined) {
    escenario.proteccion = {
      anios: valores.aniosProteccion,
      tasaReducida: valores.tasaReducida,
    };
  }

  if (valores.varianza !== undefined) {
    escenario.varianza = valores.varianza;
  }

  return escenario;
}
