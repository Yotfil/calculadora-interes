import type { Locale } from "./locale";

import es from "./es.json";
import en from "./en.json";

/**
 * Forma canónica del diccionario, derivada de es.json (la fuente, docs/07 §2).
 * Como `en` se asigna a este tipo abajo, si a en.json le faltara una clave que
 * es.json tiene, el build fallaría; el test de paridad cubre el sentido inverso
 * (claves de más) y que los valores no queden sin traducir.
 */
export type Diccionario = typeof es;

/** Registro locale → diccionario. La página elige el suyo y lo pasa al layout. */
export const diccionarios: Record<Locale, Diccionario> = { es, en };
