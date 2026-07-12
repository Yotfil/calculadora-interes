interface Props {
  label: string;
  ayuda: string;
  /** Etiquetas de las 4 frecuencias (docs/07 §3). */
  opciones: {
    anual: string;
    semestral: string;
    trimestral: string;
    mensual: string;
  };
  /** Valor como string del `<select>`: "1" | "2" | "4" | "12" (docs/02 §6). */
  valor: string;
  onCambio: (valor: string) => void;
}

// Paso 4 (docs/04 §1): frecuencia de capitalización. Select cerrado: sus valores
// son el conjunto {1,2,4,12}, así que nunca produce error de validación.
export default function CampoFrecuencia({
  label,
  ayuda,
  opciones,
  valor,
  onCambio,
}: Props) {
  const idAyuda = "campo-frecuencia-ayuda";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="campo-frecuencia" className="font-medium">
        {label}
      </label>
      <p id={idAyuda} className="text-sm text-texto-suave">
        {ayuda}
      </p>
      <select
        id="campo-frecuencia"
        data-testid="campo-frecuencia"
        value={valor}
        aria-describedby={idAyuda}
        onChange={(e) => onCambio(e.target.value)}
        className="rounded border border-borde bg-superficie px-3 py-2 focus-visible:outline-2 focus-visible:outline-accion"
      >
        <option value="12">{opciones.mensual}</option>
        <option value="4">{opciones.trimestral}</option>
        <option value="2">{opciones.semestral}</option>
        <option value="1">{opciones.anual}</option>
      </select>
    </div>
  );
}
