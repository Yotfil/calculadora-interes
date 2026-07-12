import { formatMoney } from "../i18n/formatMoney";
import type { Locale } from "../i18n/locale";

import { useContadorAnimado } from "./useContadorAnimado";

interface Props {
  /** Balance final a mostrar (docs/04 §4): el elemento tipográfico mayor. */
  valor: number;
  locale: Locale;
  /** Anima el conteo hacia arriba; false = aparición instantánea (reduced-motion). */
  animar: boolean;
}

// Cifra grande con animación firma (docs/05 §4): cuenta hacia arriba con el
// easing del interés compuesto. `tabular-nums` evita el jitter del conteo.
// El texto animado es decorativo (aria-hidden); un texto sr-only anuncia el
// valor final una sola vez al lector de pantalla.
export default function CifraGrande({ valor, locale, animar }: Props) {
  const animado = useContadorAnimado(valor, { activo: animar });
  return (
    <p
      data-testid="cifra-grande"
      className="font-display text-5xl font-bold tabular-nums text-texto md:text-6xl"
    >
      <span aria-hidden="true">{formatMoney(animado, locale)}</span>
      <span className="sr-only">{formatMoney(valor, locale)}</span>
    </p>
  );
}
