import type { CSSProperties } from "react";

/**
 * Estilos compartidos del `<Tooltip>` de Recharts (torta y barras). El default
 * de Recharts es un recuadro blanco con texto tenue: ilegible en tema oscuro.
 * Se fija sobre tokens semánticos para que resuelvan según el tema (docs/05).
 */
export const TOOLTIP_CONTENT: CSSProperties = {
  backgroundColor: "var(--sem-superficie)",
  border: "1px solid var(--sem-borde)",
  // Alineados con el resto de la app: `rounded` (4px) y `shadow-md` de Tailwind.
  borderRadius: 4,
  boxShadow:
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

export const TOOLTIP_LABEL: CSSProperties = {
  color: "var(--sem-texto)",
  fontWeight: 600,
  marginBottom: 4,
};

export const TOOLTIP_ITEM: CSSProperties = {
  color: "var(--sem-texto)",
};
