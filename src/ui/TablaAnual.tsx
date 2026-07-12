import type { FilaAnual } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import { formatMoney } from "../i18n/formatMoney";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

interface Props {
  filas: FilaAnual[];
  locale: Locale;
  dict: Diccionario;
}

// Tabla anual (docs/04 §4): <table> real con <th scope> (docs/05 §5).
// Columnas Año · Aportado · Interés · Saldo. La última fila puede ser parcial
// (duración no múltiplo de 12): se marca con la etiqueta `tabla.parcial`.
export default function TablaAnual({ filas, locale, dict }: Props) {
  return (
    <table
      data-testid="tabla-anual"
      className="w-full border-collapse text-right text-sm tabular-nums"
    >
      <caption className="mb-2 text-left font-medium text-texto">
        {t(dict, "tabla.titulo")}
      </caption>
      <thead>
        <tr className="border-b border-borde text-texto-suave">
          <th scope="col" className="py-1 text-left font-medium">
            {t(dict, "tabla.anio")}
          </th>
          <th scope="col" className="py-1 font-medium">
            {t(dict, "tabla.aportado")}
          </th>
          <th scope="col" className="py-1 font-medium">
            {t(dict, "tabla.interes")}
          </th>
          <th scope="col" className="py-1 font-medium">
            {t(dict, "tabla.balance")}
          </th>
        </tr>
      </thead>
      <tbody>
        {filas.map((f) => (
          <tr key={f.anio} className="border-b border-borde/60">
            <th scope="row" className="py-1 text-left font-normal">
              {f.anio}
              {f.meses < 12 && (
                <span className="ml-1 text-xs text-texto-suave">
                  ({t(dict, "tabla.parcial")})
                </span>
              )}
            </th>
            <td className="py-1">{formatMoney(f.aportado, locale)}</td>
            <td className="py-1">{formatMoney(f.interes, locale)}</td>
            <td className="py-1 font-medium text-texto">
              {formatMoney(f.balance, locale)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
