import type { Diccionario } from "../i18n/diccionario";
import { t } from "../i18n/t";

interface Props {
  dict: Diccionario;
  /** Precarga el caso canónico E1 y calcula (docs/04 §4). */
  onEjemplo: () => void;
}

// Estado de la zona de resultados antes del primer cálculo (docs/04 §4):
// invitación + "Ver un ejemplo", que llena E1 (usa el impulso de Avanzada) y
// calcula, para que el usuario sienta el producto sin escribir nada.
export default function EstadoVacio({ dict, onEjemplo }: Props) {
  return (
    <div
      data-testid="estado-vacio"
      className="flex min-h-40 flex-col items-center justify-center gap-4 rounded border border-dashed border-borde p-6 text-center text-texto-suave"
    >
      <p>{t(dict, "vacio.titulo")}</p>
      <button
        type="button"
        data-testid="ver-ejemplo"
        onClick={onEjemplo}
        className="rounded bg-accion px-4 py-2 font-semibold text-superficie focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accion"
      >
        {t(dict, "vacio.cta")}
      </button>
    </div>
  );
}
