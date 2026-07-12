// Idiomas de la app (docs/07 §1). El resto de i18n se parametriza por este tipo.
export type Locale = "es" | "en";

/**
 * Etiqueta BCP-47 para `Intl` (docs/07 §2). El idioma de la app ("es"/"en") es
 * el de las rutas y diccionarios; el formato numérico/monetario usa la variante
 * regional que reproduce el contrato de docs/07: es-ES → "1.234.567,89 US$";
 * en-US → "$1,234,567.89".
 */
export function localeIntl(locale: Locale): string {
  return locale === "es" ? "es-ES" : "en-US";
}
