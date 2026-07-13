import { useEffect, useLayoutEffect, useRef } from "react";
import type { ChangeEvent } from "react";

import type { Locale } from "../i18n/locale";

import {
  agruparMiles,
  contarSignificativos,
  desagruparMiles,
  posSignificativo,
  separadorDecimal,
} from "./miles";

// useLayoutEffect avisa por consola en SSR (Astro renderiza la isla en el
// servidor); en Node se usa useEffect, que allí es igual de inerte.
const useEfectoCaret =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Props {
  /** Nombre del campo del esquema; da id, testid y `htmlFor` (docs/02 §6). */
  campo: string;
  label: string;
  ayuda: string;
  valor: string;
  /** Mensaje ya traducido (vía `mapearError`), o ausente si el campo es válido. */
  error?: string;
  inputMode?: "decimal" | "numeric";
  /** Muestra separador de miles del locale (campos de dinero grandes). */
  agrupaMiles?: boolean;
  /** Requerido si `agrupaMiles`: define el separador de miles/decimal. */
  locale?: Locale;
  /** Código de moneda ("USD"): adorno tipo select deshabilitado junto al input. */
  moneda?: string;
  /** Tooltip del adorno de moneda (aviso de "próximamente otras monedas"). */
  monedaTooltip?: string;
  onCambio: (valor: string) => void;
  onBlur: () => void;
}

// Fila de campo numérico: label + copy educativo (docs/04 §3) + input + error
// inline bajo el campo con `aria-describedby` (docs/05 §5). Un input por instancia.
// Con `agrupaMiles`, el input MUESTRA el valor con separador de miles del locale,
// pero el estado sigue siendo el crudo canónico que consume el esquema (miles.ts).
// Con `moneda`, un select deshabilitado con el código (USD) acompaña al input:
// comunica la moneda del cálculo y anticipa el selector real de monedas futuras.
export default function Campo({
  campo,
  label,
  ayuda,
  valor,
  error,
  inputMode = "decimal",
  agrupaMiles = false,
  locale,
  moneda,
  monedaTooltip,
  onCambio,
  onBlur,
}: Props) {
  const id = `campo-${campo}`;
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const agrupa = agrupaMiles && locale !== undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  // Nº de caracteres significativos a la izquierda del cursor tras editar; se
  // restaura tras el re-render para que el cursor no salte al reinsertar puntos.
  const caretRef = useRef<number | null>(null);
  // true cuando un Supr cayó sobre un separador de miles: el crudo no cambia y
  // el caret debe saltarlo, o la tecla quedaría "atascada" en el mismo sitio.
  const saltarSeparadorRef = useRef(false);

  useEfectoCaret(() => {
    if (!agrupa || caretRef.current === null) return;
    const el = inputRef.current;
    if (el) {
      let pos = posSignificativo(el.value, caretRef.current, locale);
      if (
        saltarSeparadorRef.current &&
        pos < el.value.length &&
        !/\d/.test(el.value[pos])
      ) {
        pos += 1;
      }
      el.setSelectionRange(pos, pos);
    }
    caretRef.current = null;
    saltarSeparadorRef.current = false;
  });

  const mostrado = agrupa ? agruparMiles(valor, locale) : valor;

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!agrupa) {
      onCambio(e.target.value);
      return;
    }
    const el = e.currentTarget;
    const cursor = el.selectionStart ?? el.value.length;
    const evento = e.nativeEvent as InputEvent;
    let texto = el.value;
    // Un separador TECLEADO ("." o ",") siempre es intención decimal: los miles
    // los pone la máscara. Sin esto, el "." del teclado numérico en es se
    // eliminaría como separador de miles y corrompería el monto (×100).
    if (evento.data === "." || evento.data === ",") {
      texto =
        texto.slice(0, cursor - 1) +
        separadorDecimal(locale) +
        texto.slice(cursor);
    }
    const crudo = desagruparMiles(texto, locale);
    caretRef.current = contarSignificativos(texto, cursor, locale);
    saltarSeparadorRef.current =
      evento.inputType === "deleteContentForward" && crudo === valor;
    onCambio(crudo);
  }

  const input = (
    <input
      ref={inputRef}
      id={id}
      data-testid={id}
      type="text"
      inputMode={inputMode}
      value={mostrado}
      aria-describedby={error ? `${idAyuda} ${idError}` : idAyuda}
      aria-invalid={error ? true : undefined}
      onChange={onChange}
      onBlur={onBlur}
      className={
        moneda
          ? "min-w-0 flex-1 rounded-l border border-borde bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-accion aria-invalid:border-error"
          : "rounded border border-borde bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-accion aria-invalid:border-error"
      }
    />
  );

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <p id={idAyuda} className="text-sm text-texto-suave">
        {ayuda}
      </p>
      {moneda ? (
        <div className="flex items-stretch">
          {input}
          {/* El hover se detecta en el span (`group`): los controles
              deshabilitados no disparan eventos, pero el :hover del padre sí. */}
          <span className="group relative flex">
            <select
              data-testid={`moneda-${campo}`}
              disabled
              aria-label={monedaTooltip}
              className="rounded-r border border-l-0 border-borde bg-fondo px-2 text-sm text-texto-suave"
            >
              <option>{moneda}</option>
            </select>
            {monedaTooltip && (
              <span
                role="tooltip"
                data-testid={`tooltip-moneda-${campo}`}
                className="pointer-events-none absolute right-0 bottom-full z-10 mb-1 hidden w-max max-w-56 rounded border border-borde bg-superficie px-2 py-1 text-xs text-texto shadow-md group-hover:block"
              >
                {monedaTooltip}
              </span>
            )}
          </span>
        </div>
      ) : (
        input
      )}
      {error && (
        <p id={idError} data-testid={`error-${campo}`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
