import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { Diccionario } from "../i18n/diccionario";
import { formatMoney } from "../i18n/formatMoney";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

import { SERIES } from "./series";

interface Props {
  /** Capital inicial (P): primer segmento de la composición final. */
  capitalInicial: number;
  totalAportado: number;
  interesTotal: number;
  locale: Locale;
  dict: Diccionario;
  animar: boolean;
}

// Torta de composición final (docs/04 §4): inicial / aportes / interés, con los
// mismos color+patrón que barras, leyenda y tabla. El SVG es decorativo
// (aria-hidden): la tabla anual es el equivalente accesible (docs/05 §5).
export default function Torta({
  capitalInicial,
  totalAportado,
  interesTotal,
  locale,
  dict,
  animar,
}: Props) {
  const datos = [
    { clave: "inicial" as const, valor: capitalInicial },
    { clave: "aportes" as const, valor: totalAportado - capitalInicial },
    { clave: "interes" as const, valor: interesTotal },
  ];
  const etiqueta = (clave: string) =>
    t(dict, SERIES.find((s) => s.clave === clave)!.leyenda);

  return (
    <div data-testid="torta" aria-hidden="true">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="valor"
            nameKey="clave"
            cx="50%"
            cy="50%"
            outerRadius={90}
            isAnimationActive={animar}
            animationDuration={1200}
          >
            {datos.map((d) => (
              <Cell
                key={d.clave}
                fill={`url(#patron-${d.clave})`}
                stroke="var(--sem-superficie)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(valor: number, clave: string) => [
              formatMoney(valor, locale),
              etiqueta(clave),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
