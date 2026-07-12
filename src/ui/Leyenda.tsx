import type { Diccionario } from "../i18n/diccionario";
import { t } from "../i18n/t";

import { SERIES } from "./series";

interface Props {
  dict: Diccionario;
}

// Leyenda compartida por torta y barras (docs/04 §4): mismo color + patrón que
// los gráficos. La muestra usa el patrón SVG (color + trama), y la etiqueta va
// en color de texto normal (no coloreada) para no depender del contraste del
// color de serie.
export default function Leyenda({ dict }: Props) {
  return (
    <ul
      data-testid="leyenda"
      className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
    >
      {SERIES.map((s) => (
        <li key={s.clave} className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            aria-hidden="true"
            className="shrink-0 rounded-sm"
          >
            <rect width="14" height="14" fill={`url(#patron-${s.clave})`} />
          </svg>
          <span className="text-texto">{t(dict, s.leyenda)}</span>
        </li>
      ))}
    </ul>
  );
}
