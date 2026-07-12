/**
 * Las tres series de composición (docs/04 §4): mismo orden, color e id de
 * patrón en torta, barras, leyenda y tabla — el usuario aprende el código de
 * color una sola vez. `leyenda` es la clave i18n; `color` es el token semántico
 * (cambia con el tema). El id de patrón para SVG es `patron-${clave}`.
 */
export type ClaveSerie = "inicial" | "aportes" | "interes";

export interface Serie {
  clave: ClaveSerie;
  leyenda: string;
  color: string;
}

export const SERIES: Serie[] = [
  { clave: "inicial", leyenda: "leyenda.inicial", color: "var(--sem-inicial)" },
  { clave: "aportes", leyenda: "leyenda.aportes", color: "var(--sem-aportes)" },
  { clave: "interes", leyenda: "leyenda.interes", color: "var(--sem-interes)" },
];
