import type { Resultado } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import { formatMoney } from "../i18n/formatMoney";
import { type Locale, localeIntl } from "../i18n/locale";
import { t } from "../i18n/t";

import { conNegritas } from "./negritas";

interface Props {
  resultado: Resultado;
  /** Duración tal como la tecleó el usuario, para reflejarla en la frase. */
  duracion: number;
  duracionUnidad: "a" | "m";
  locale: Locale;
  dict: Diccionario;
}

// Frase resumen bajo la cifra (docs/04 §4). En Básica solo la variante `normal`
// (docs/07 §4); real/meta llegan en M16–M17. Copy citado, nunca improvisado.
export default function FraseResumen({
  resultado,
  duracion,
  duracionUnidad,
  locale,
  dict,
}: Props) {
  const mult = new Intl.NumberFormat(localeIntl(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(resultado.multiplicador);

  const unidad = t(
    dict,
    duracionUnidad === "a"
      ? "campos.duracion.unidad.anios"
      : "campos.duracion.unidad.meses",
  ).toLocaleLowerCase(localeIntl(locale));

  const frase = t(dict, "frases.normal", {
    años: `${duracion} ${unidad}`,
    balance: formatMoney(resultado.balanceFinal, locale),
    aportado: formatMoney(resultado.totalAportado, locale),
    interes: formatMoney(resultado.interesTotal, locale),
    mult,
  });

  return (
    <p data-testid="frase-resumen" className="text-lg text-texto-suave">
      {conNegritas(frase)}
    </p>
  );
}
