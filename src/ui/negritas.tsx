import { Fragment } from "react";
import type { ReactNode } from "react";

// Renderiza `**negrita**` (markdown mínimo de docs/07): `t` deja el texto verbatim,
// aquí se envuelven los tramos impares en <strong>. Lo comparten la frase resumen
// (docs/04 §4) y las métricas de resultados (docs/07 §4).
export function conNegritas(texto: string): ReactNode[] {
  return texto
    .split("**")
    .map((seg, i) =>
      i % 2 === 1 ? (
        <strong key={i}>{seg}</strong>
      ) : (
        <Fragment key={i}>{seg}</Fragment>
      ),
    );
}
