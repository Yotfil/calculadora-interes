interface Props {
  /** Nombre del campo del esquema; da id, testid y `htmlFor` (docs/02 §6). */
  campo: string;
  label: string;
  ayuda: string;
  valor: string;
  /** Mensaje ya traducido (vía `mapearError`), o ausente si el campo es válido. */
  error?: string;
  inputMode?: "decimal" | "numeric";
  onCambio: (valor: string) => void;
  onBlur: () => void;
}

// Fila de campo numérico: label + copy educativo (docs/04 §3) + input + error
// inline bajo el campo con `aria-describedby` (docs/05 §5). Un input por instancia.
export default function Campo({
  campo,
  label,
  ayuda,
  valor,
  error,
  inputMode = "decimal",
  onCambio,
  onBlur,
}: Props) {
  const id = `campo-${campo}`;
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <p id={idAyuda} className="text-sm text-texto-suave">
        {ayuda}
      </p>
      <input
        id={id}
        data-testid={id}
        type="text"
        inputMode={inputMode}
        value={valor}
        aria-describedby={error ? `${idAyuda} ${idError}` : idAyuda}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onCambio(e.target.value)}
        onBlur={onBlur}
        className="rounded border border-borde bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-accion aria-invalid:border-error"
      />
      {error && (
        <p id={idError} data-testid={`error-${campo}`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
