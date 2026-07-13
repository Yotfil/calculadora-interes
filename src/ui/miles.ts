import { type Locale, localeIntl } from "../i18n/locale";

/**
 * Separación de miles para los inputs de dinero. El estado del formulario y el
 * esquema Zod siguen usando el string CRUDO canónico (dígitos + "." decimal);
 * estas funciones solo traducen entre ese crudo y lo que se MUESTRA al usuario
 * (con separador de miles del locale). Así el core/esquema no se enteran.
 *
 * A diferencia de `Intl` en es-ES (que no agrupa enteros de 4 cifras: 1000 →
 * "1000"), aquí se agrupa SIEMPRE a partir de 4 dígitos: el usuario pidió ver
 * "1.000", no "1000". De `Intl` se toma únicamente el carácter separador.
 */

/** Separadores de miles y decimal del locale (misma fuente que `formatMoney`). */
function separadores(locale: Locale): { grupo: string; decimal: string } {
  const partes = new Intl.NumberFormat(localeIntl(locale)).formatToParts(11111.1);
  const grupo = partes.find((p) => p.type === "group")?.value ?? ",";
  const decimal = partes.find((p) => p.type === "decimal")?.value ?? ".";
  return { grupo, decimal };
}

/** El separador decimal del locale ("," en es, "." en en). */
export function separadorDecimal(locale: Locale): string {
  return separadores(locale).decimal;
}

/**
 * Crudo canónico ("1000", "1000.5", "1000." mientras se teclea) → cadena
 * agrupada para mostrar ("1.000", "1.000,5", "1.000,"). Preserva el separador
 * decimal final y los decimales tal cual, para no estorbar al teclear.
 */
export function agruparMiles(raw: string, locale: Locale): string {
  if (raw === "") return "";
  const { grupo, decimal } = separadores(locale);
  const punto = raw.indexOf(".");
  const enteros = punto === -1 ? raw : raw.slice(0, punto);
  const agrupados = enteros.replace(/\B(?=(\d{3})+(?!\d))/g, grupo);
  if (punto === -1) return agrupados;
  return `${agrupados}${decimal}${raw.slice(punto + 1)}`;
}

/**
 * Cadena mostrada (separadores del locale, o basura tecleada) → crudo canónico
 * para el estado y el esquema. Quita los separadores de miles, convierte el
 * decimal del locale a ".", descarta lo no numérico y deja un solo decimal.
 */
export function desagruparMiles(mostrado: string, locale: Locale): string {
  const { grupo, decimal } = separadores(locale);
  let s = mostrado.split(grupo).join("").split(decimal).join(".");
  s = s.replace(/[^\d.]/g, "");
  const i = s.indexOf(".");
  if (i !== -1) {
    s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
  }
  return s;
}

/** ¿El carácter es dígito o el separador decimal? (para preservar el cursor). */
function esSignificativo(c: string, decimal: string): boolean {
  return (c >= "0" && c <= "9") || c === decimal;
}

/**
 * Cuántos caracteres significativos (dígitos + decimal) hay en `texto` antes de
 * `hasta`. Los separadores de miles no cuentan: así el cursor se ancla a la
 * posición lógica y sobrevive a la reinserción de puntos al reformatear.
 */
export function contarSignificativos(
  texto: string,
  hasta: number,
  locale: Locale,
): number {
  const decimal = separadores(locale).decimal;
  let n = 0;
  for (let i = 0; i < hasta && i < texto.length; i++) {
    if (esSignificativo(texto[i], decimal)) n++;
  }
  return n;
}

/** Índice en `texto` justo tras el `n`-ésimo carácter significativo. */
export function posSignificativo(texto: string, n: number, locale: Locale): number {
  if (n <= 0) return 0;
  const decimal = separadores(locale).decimal;
  let vistos = 0;
  for (let i = 0; i < texto.length; i++) {
    if (esSignificativo(texto[i], decimal)) {
      vistos++;
      if (vistos === n) return i + 1;
    }
  }
  return texto.length;
}
