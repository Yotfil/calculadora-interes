interface Props {
  label: string;
  ayuda: string;
  /** Etiquetas del radio de unidad (años/meses, docs/04 §1). */
  unidadLabels: { anios: string; meses: string };
  valor: string;
  unidad: "a" | "m";
  error?: string;
  onCambio: (valor: string) => void;
  onUnidad: (unidad: "a" | "m") => void;
  onBlur: () => void;
}

// Paso 3 (docs/04 §1): número de duración + radio años/meses. La unidad cambia el
// rango válido (1–50 años / 1–600 meses, docs/02 §6); por eso re-valida al elegirla.
export default function CampoDuracion({
  label,
  ayuda,
  unidadLabels,
  valor,
  unidad,
  error,
  onCambio,
  onUnidad,
  onBlur,
}: Props) {
  const idAyuda = "campo-duracion-ayuda";
  const idError = "campo-duracion-error";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="campo-duracion" className="font-medium">
        {label}
      </label>
      <p id={idAyuda} className="text-sm text-texto-suave">
        {ayuda}
      </p>
      <div className="flex items-center gap-3">
        <input
          id="campo-duracion"
          data-testid="campo-duracion"
          type="text"
          inputMode="numeric"
          value={valor}
          aria-describedby={error ? `${idAyuda} ${idError}` : idAyuda}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onCambio(e.target.value)}
          onBlur={onBlur}
          className="w-24 rounded border border-borde bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-accion aria-invalid:border-error"
        />
        <div role="radiogroup" aria-label={label} className="flex gap-3">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="duracionUnidad"
              value="a"
              data-testid="unidad-anios"
              checked={unidad === "a"}
              onChange={() => onUnidad("a")}
              className="accent-accion"
            />
            <span>{unidadLabels.anios}</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="duracionUnidad"
              value="m"
              data-testid="unidad-meses"
              checked={unidad === "m"}
              onChange={() => onUnidad("m")}
              className="accent-accion"
            />
            <span>{unidadLabels.meses}</span>
          </label>
        </div>
      </div>
      {error && (
        <p id={idError} data-testid="error-duracion" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
