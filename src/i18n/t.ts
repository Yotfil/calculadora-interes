// Árbol de traducciones: hojas string, ramas anidadas. El tipo concreto de cada
// diccionario (derivado de es.json) es asignable a este (ver diccionario.ts).
export type ArbolDiccionario = { [clave: string]: string | ArbolDiccionario };

/**
 * Traduce una clave con notación de puntos y opcionalmente interpola
 * `{placeholder}` (docs/07 §2). Reglas deliberadas:
 * - Clave inexistente (o que no resuelve a string) → se devuelve la clave tal
 *   cual: un hueco de traducción queda visible y greppable, nunca revienta.
 * - Un placeholder sin valor en `params` se deja intacto, para que el hueco se
 *   note en desarrollo.
 * - No interpreta markdown: `**negrita**` viaja verbatim; el render es cosa de M6.
 * Los valores de `params` ya llegan formateados (dinero vía formatMoney, números
 * vía Intl); aquí solo se sustituyen como texto.
 */
export function t(
  dict: ArbolDiccionario,
  key: string,
  params?: Record<string, string | number>,
): string {
  let nodo: string | ArbolDiccionario = dict;
  for (const segmento of key.split(".")) {
    if (typeof nodo !== "object" || !(segmento in nodo)) return key;
    nodo = nodo[segmento];
  }
  if (typeof nodo !== "string") return key;
  if (!params) return nodo;
  // `[^}]+` (no solo \w) porque los placeholders de docs/07 llevan acentos: {años}.
  return nodo.replace(/\{([^}]+)\}/g, (original, nombre) =>
    nombre in params ? String(params[nombre]) : original,
  );
}
