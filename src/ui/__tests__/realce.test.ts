import { isValidElement } from "react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { conRealce } from "../realce";

// Aplana los nodos a { texto, resaltado }: los <span> con la clase son los
// tramos resaltados; los Fragment son texto plano. Evita depender del DOM.
function tramos(nodos: ReturnType<typeof conRealce>) {
  return nodos.map((n) => {
    const el = n as ReactElement<{ className?: string; children?: string }>;
    const esSpan = isValidElement(el) && el.type === "span";
    return {
      texto: el.props.children ?? "",
      resaltado: esSpan && el.props.className === "acento",
    };
  });
}

describe("conRealce", () => {
  it("envuelve los tramos entre [[ ]] en un span con la clase dada", () => {
    const r = conRealce("Reemplaza al [[Aporte mensual]] solo durante esos años.", "acento");
    expect(tramos(r)).toEqual([
      { texto: "Reemplaza al ", resaltado: false },
      { texto: "Aporte mensual", resaltado: true },
      { texto: " solo durante esos años.", resaltado: false },
    ]);
  });

  it("soporta varios tramos resaltados", () => {
    const r = conRealce(
      "Reemplaza al [[Aporte mensual]] durante [[los primeros 3 años]].",
      "acento",
    );
    const t = tramos(r);
    expect(t.filter((x) => x.resaltado).map((x) => x.texto)).toEqual([
      "Aporte mensual",
      "los primeros 3 años",
    ]);
  });

  it("sin markup es un no-op (un solo fragmento de texto plano)", () => {
    const r = conRealce("Lo que agregas cada mes.", "acento");
    expect(r).toHaveLength(1);
    expect(tramos(r)).toEqual([{ texto: "Lo que agregas cada mes.", resaltado: false }]);
  });
});
