/**
 * Las tres series de composición (docs/04 §4): mismo orden e id de patrón en
 * torta, barras, leyenda y tabla — el usuario aprende el código de color una
 * sola vez. `leyenda` es la clave i18n; el color lo aporta el patrón SVG
 * (`url(#patron-${clave})`), que resuelve el token semántico según el tema.
 */
export type ClaveSerie = "inicial" | "aportes" | "interes";

export interface Serie {
  clave: ClaveSerie;
  leyenda: string;
}

export const SERIES: Serie[] = [
  { clave: "inicial", leyenda: "leyenda.inicial" },
  { clave: "aportes", leyenda: "leyenda.aportes" },
  { clave: "interes", leyenda: "leyenda.interes" },
];
