import { Fragment } from "react";
import type { ReactNode } from "react";

// Renderiza `[[realce]]` (markup mínimo, espeja a `conNegritas`): `t` deja el
// texto verbatim y aquí se envuelven los tramos entre `[[ ]]` en un <span> con
// la clase dada (color de acento). Sin markup es un no-op (un solo Fragment).
// Se usa para vincular por color los campos de aporte (docs/07 §3).
export function conRealce(texto: string, clase: string): ReactNode[] {
  return texto
    .split(/\[\[|\]\]/)
    .map((seg, i) =>
      i % 2 === 1 ? (
        <span key={i} className={clase}>
          {seg}
        </span>
      ) : (
        <Fragment key={i}>{seg}</Fragment>
      ),
    );
}
