import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FilaAnual } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import { formatMoney } from "../i18n/formatMoney";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

import { SERIES } from "./series";
import { TOOLTIP_CONTENT, TOOLTIP_ITEM, TOOLTIP_LABEL } from "./tooltipEstilos";

interface Props {
  filas: FilaAnual[];
  capitalInicial: number;
  locale: Locale;
  dict: Diccionario;
  animar: boolean;
}

// Barras apiladas por año (docs/04 §4): tres series acumuladas que suman el
// balance de cada año (P + Σaportado + Σinterés = balance). Mismos color+patrón
// que torta/leyenda/tabla. La animación firma (docs/05 §4) crece las barras con
// easing acelerado; con reduced-motion aparecen sin animar. SVG decorativo.
export default function BarrasApiladas({
  filas,
  capitalInicial,
  locale,
  dict,
  animar,
}: Props) {
  let aportadoAcum = 0;
  let interesAcum = 0;
  const datos = filas.map((f) => {
    aportadoAcum += f.aportado;
    interesAcum += f.interes;
    return {
      anio: f.anio,
      inicial: capitalInicial,
      aportes: aportadoAcum,
      interes: interesAcum,
    };
  });

  return (
    <div data-testid="barras" aria-hidden="true">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={datos}
          margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--sem-borde)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="anio"
            tick={{ fill: "var(--sem-texto-suave)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--sem-borde)" }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT}
            labelStyle={TOOLTIP_LABEL}
            itemStyle={TOOLTIP_ITEM}
            cursor={{ fill: "var(--sem-borde)", fillOpacity: 0.3 }}
            formatter={(valor: number, clave: string) => [
              formatMoney(valor, locale),
              t(dict, SERIES.find((s) => s.clave === clave)!.leyenda),
            ]}
            labelFormatter={(anio) => `${t(dict, "tabla.anio")} ${anio}`}
          />
          {SERIES.map((s) => (
            <Bar
              key={s.clave}
              dataKey={s.clave}
              stackId="composicion"
              fill={`url(#patron-${s.clave})`}
              isAnimationActive={animar}
              animationDuration={1500}
              animationEasing="ease-in"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
