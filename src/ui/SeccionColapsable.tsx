import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface Props {
  /** Base para los ids del botón y la región (`aria-controls`/`aria-labelledby`). */
  id: string;
  titulo: string;
  abierto: boolean;
  onToggle: () => void;
  children: ReactNode;
}

// Sección opcional colapsable (docs/04 §2): arranca cerrada y se expande dentro
// del paso al que pertenece. Anima la altura 150 ms (docs/05 §4.2) con el truco
// grid-rows 0fr↔1fr; `motion-reduce` la deja instantánea. El contenido cerrado
// se marca `inert` (vía DOM, no tipado en JSX de React 18) para sacarlo del orden
// de tabulación y del árbol accesible (docs/05 §5), sin perder la animación.
export default function SeccionColapsable({
  id,
  titulo,
  abierto,
  onToggle,
  children,
}: Props) {
  const contenidoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contenidoRef.current) contenidoRef.current.inert = !abierto;
  }, [abierto]);

  const idRegion = `${id}-region`;
  const idToggle = `${id}-toggle`;

  return (
    <div className="rounded border border-borde">
      <button
        type="button"
        id={idToggle}
        data-testid={idToggle}
        aria-expanded={abierto}
        aria-controls={idRegion}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-medium focus-visible:outline-2 focus-visible:outline-accion"
      >
        <span>{titulo}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-5 w-5 shrink-0 transition-transform duration-150 motion-reduce:transition-none ${
            abierto ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={idRegion}
        role="region"
        aria-labelledby={idToggle}
        className={`grid transition-[grid-template-rows] duration-150 ease-out motion-reduce:transition-none ${
          abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div ref={contenidoRef} className="overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-borde p-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
