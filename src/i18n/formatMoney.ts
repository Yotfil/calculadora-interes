import { type Locale, localeIntl } from "./locale";

// La moneda es SIEMPRE USD (docs/07 §2): lo único que cambia por locale es el
// símbolo/formato ("$1,000.00" en en-US; "1.000,00 US$" en es-ES). Único lugar
// donde vive el literal "USD"; el resto de la app formatea dinero solo por aquí.
const MONEDA = "USD";

/** Formatea un monto en USD según el locale (docs/07 §2). */
export function formatMoney(valor: number, locale: Locale): string {
  return new Intl.NumberFormat(localeIntl(locale), {
    style: "currency",
    currency: MONEDA,
  }).format(valor);
}
