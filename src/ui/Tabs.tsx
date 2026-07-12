import type { KeyboardEvent } from "react";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activo: string;
  /** Nombre accesible del tablist (docs/05 §5). */
  etiqueta: string;
  /** id del panel que los tabs controlan (`aria-controls`). */
  idPanel: string;
  onCambio: (id: string) => void;
}

// Tabs con patrón WAI-ARIA (docs/05 §5): flechas mueven la selección, Home/End
// van a los extremos, y solo el tab activo entra en el orden de tabulación.
export default function Tabs({ tabs, activo, etiqueta, idPanel, onCambio }: Props) {
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = tabs.findIndex((t) => t.id === activo);
    let j: number;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = tabs.length - 1;
    else return;
    e.preventDefault();
    const destino = tabs[j].id;
    onCambio(destino);
    document.getElementById(`tab-${destino}`)?.focus();
  }

  return (
    <div role="tablist" aria-label={etiqueta} className="flex gap-2 border-b border-borde">
      {tabs.map((tab) => {
        const seleccionado = tab.id === activo;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            data-testid={`tab-${tab.id}`}
            aria-selected={seleccionado}
            aria-controls={idPanel}
            tabIndex={seleccionado ? 0 : -1}
            onClick={() => onCambio(tab.id)}
            onKeyDown={onKeyDown}
            className={`-mb-px border-b-2 px-4 py-2 focus-visible:outline-2 focus-visible:outline-accion ${
              seleccionado
                ? "border-accion font-semibold text-accion"
                : "border-transparent text-texto-suave"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
