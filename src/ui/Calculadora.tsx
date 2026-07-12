import type { Diccionario } from "../i18n/diccionario";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

interface Props {
  locale: Locale;
  dict: Diccionario;
}

// Isla React autocontenida (docs/01 §2). Stub hasta M5: ya recibe locale +
// diccionario (docs/07) y traduce vía `t`; sin strings literales en JSX. La UI
// real del formulario llega en M5.
export default function Calculadora({ locale, dict }: Props) {
  return (
    <section
      data-testid="calculadora"
      lang={locale}
      aria-label={t(dict, "titulo")}
    />
  );
}
