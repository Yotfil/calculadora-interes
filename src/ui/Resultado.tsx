import type { Resultado as ResultadoMotor } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

import BarrasApiladas from "./BarrasApiladas";
import CifraGrande from "./CifraGrande";
import FraseResumen from "./FraseResumen";
import Leyenda from "./Leyenda";
import PatronesDefs from "./PatronesDefs";
import TablaAnual from "./TablaAnual";
import Torta from "./Torta";

interface Props {
  resultado: ResultadoMotor;
  /** Capital inicial (P) del escenario: alimenta torta y barras. */
  capitalInicial: number;
  /** Duración tal como la tecleó el usuario (para la frase). */
  duracion: number;
  duracionUnidad: "a" | "m";
  locale: Locale;
  dict: Diccionario;
  /** false = aparición sin animación (prefers-reduced-motion). */
  animar: boolean;
}

// Zona de resultados de la Básica (docs/04 §4): cifra grande + frase, torta,
// barras, leyenda compartida y tabla anual. Las métricas de Avanzada/Experto
// (ahorro, costo de protección, banda) llegan en M11–M13.
export default function Resultado({
  resultado,
  capitalInicial,
  duracion,
  duracionUnidad,
  locale,
  dict,
  animar,
}: Props) {
  return (
    <section
      data-testid="resultado"
      aria-label={t(dict, "resultados.titulo")}
      className="flex flex-col gap-6"
    >
      <PatronesDefs />

      <div className="flex flex-col gap-2">
        <CifraGrande
          valor={resultado.balanceFinal}
          locale={locale}
          animar={animar}
        />
        <FraseResumen
          resultado={resultado}
          duracion={duracion}
          duracionUnidad={duracionUnidad}
          locale={locale}
          dict={dict}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Torta
          capitalInicial={capitalInicial}
          totalAportado={resultado.totalAportado}
          interesTotal={resultado.interesTotal}
          locale={locale}
          dict={dict}
          animar={animar}
        />
        <BarrasApiladas
          filas={resultado.filas}
          capitalInicial={capitalInicial}
          locale={locale}
          dict={dict}
          animar={animar}
        />
      </div>

      <Leyenda dict={dict} />

      <div className="overflow-x-auto">
        <TablaAnual filas={resultado.filas} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
