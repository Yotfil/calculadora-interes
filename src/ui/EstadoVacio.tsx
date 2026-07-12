import type { Diccionario } from "../i18n/diccionario";
import { t } from "../i18n/t";

interface Props {
  dict: Diccionario;
}

// Estado de la zona de resultados antes del primer cálculo (docs/04 §4):
// invitación. El botón "Ver un ejemplo" (E1) se difiere a M12 porque E1 usa el
// impulso escalonado de Avanzada, que no existe en la Básica de Fase 1.
export default function EstadoVacio({ dict }: Props) {
  return (
    <div
      data-testid="estado-vacio"
      className="flex min-h-40 items-center justify-center rounded border border-dashed border-borde p-6 text-center text-texto-suave"
    >
      <p>{t(dict, "vacio.titulo")}</p>
    </div>
  );
}
