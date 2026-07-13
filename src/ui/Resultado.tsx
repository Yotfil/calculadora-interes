import type { Banda, Resultado as ResultadoMotor } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import { formatMoney } from "../i18n/formatMoney";
import { type Locale, localeIntl } from "../i18n/locale";
import { t } from "../i18n/t";

import BarrasApiladas from "./BarrasApiladas";
import CifraGrande from "./CifraGrande";
import FraseResumen from "./FraseResumen";
import Leyenda from "./Leyenda";
import { conNegritas } from "./negritas";
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
  /** Ahorro del plan escalonado y su fijo equivalente (docs/06 §1); null sin impulso. */
  ahorro: number | null;
  fijo: number | null;
  /** Costo de la protección (docs/06 §1); null sin protección aplicada. */
  costo: number | null;
  /** Años de protección, para el {n} del copy; null sin protección. */
  aniosProteccion: number | null;
  /** Banda de varianza (docs/06 §1); null sin varianza aplicada. */
  banda: Banda | null;
  /** Tasa nominal y varianza en %, para el {tasa}/{v} del copy de la banda. */
  tasa: number;
  varianza: number | null;
  locale: Locale;
  dict: Diccionario;
  /** false = aparición sin animación (prefers-reduced-motion). */
  animar: boolean;
}

// Zona de resultados (docs/04 §4): cifra grande + frase, torta, barras, leyenda
// compartida y tabla anual. Cierran la sección las métricas por tab (docs/06 §1):
// ahorro (Avanzada, con impulso), costo de la protección y banda (Experto).
export default function Resultado({
  resultado,
  capitalInicial,
  duracion,
  duracionUnidad,
  ahorro,
  fijo,
  costo,
  aniosProteccion,
  banda,
  tasa,
  varianza,
  locale,
  dict,
  animar,
}: Props) {
  // {tasa}/{v} de la banda son porcentajes, no dinero: se formatean con Intl del
  // locale (mismo patrón que {mult} en FraseResumen), nunca con formatMoney.
  const pct = (n: number) =>
    new Intl.NumberFormat(localeIntl(locale)).format(n);

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

      {/* Ahorro del plan escalonado (docs/04 §4, docs/06 §1): solo si hay impulso
          aplicado (Avanzada/Experto); sin impulso las métricas son null. */}
      {ahorro !== null && fijo !== null && (
        <p
          data-testid="metrica-ahorro"
          className="rounded border border-borde bg-fondo p-4 text-texto"
        >
          {conNegritas(
            t(dict, "metricas.ahorro", {
              fijo: formatMoney(fijo, locale),
              ahorro: formatMoney(ahorro, locale),
            }),
          )}
        </p>
      )}

      {/* Costo de la protección (docs/06 §1): solo con protección aplicada
          (Experto); sin protección es null. */}
      {costo !== null && aniosProteccion !== null && (
        <p
          data-testid="metrica-costo"
          className="rounded border border-borde bg-fondo p-4 text-texto"
        >
          {conNegritas(
            t(dict, "metricas.costoProteccion", {
              n: String(aniosProteccion),
              costo: formatMoney(costo, locale),
            }),
          )}
        </p>
      )}

      {/* Banda de varianza (docs/06 §1): solo con varianza aplicada (Experto);
          sin varianza (o v=0) es null. */}
      {banda !== null && varianza !== null && (
        <p
          data-testid="metrica-banda"
          className="rounded border border-borde bg-fondo p-4 text-texto"
        >
          {conNegritas(
            t(dict, "metricas.banda", {
              tasa: pct(tasa),
              v: pct(varianza),
              inferior: formatMoney(banda.inferior, locale),
              superior: formatMoney(banda.superior, locale),
            }),
          )}
        </p>
      )}
    </section>
  );
}
