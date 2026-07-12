import type { Diccionario } from "../../i18n/diccionario";
import { t } from "../../i18n/t";

import { rangos } from "./formulario";

/**
 * Traduce una clave de error del esquema (`errores.<campo>.<sufijo>`, docs/02 §6)
 * al mensaje visible usando la plantilla genérica del diccionario
 * (`error.<sufijo>`, docs/07 §3). Cierra la deuda heredada de M4: el esquema es la
 * fuente única de rangos y aquí se inyectan `{min}/{max}` en `error.rango`.
 *
 * - `.numero` y `.entero` no interpolan.
 * - `.rango` interpola el `rangos` del campo. `duracion` toma su rango según la
 *   unidad actual (años 1–50 / meses 1–600); sin contexto asume años.
 * - Una clave que no calce con la forma esperada se devuelve tal cual (queda
 *   visible y greppable, nunca revienta).
 */
export function mapearError(
  dict: Diccionario,
  clave: string,
  ctx?: { duracionUnidad?: "a" | "m" },
): string {
  const partes = clave.split(".");
  if (partes[0] !== "errores" || partes.length !== 3) return clave;
  const [, campo, sufijo] = partes;

  if (sufijo === "rango") {
    const rango =
      campo === "duracion"
        ? rangos.duracion[ctx?.duracionUnidad ?? "a"]
        : (rangos as Record<string, { min: number; max: number }>)[campo];
    if (rango) return t(dict, "error.rango", { min: rango.min, max: rango.max });
  }

  return t(dict, `error.${sufijo}`);
}
