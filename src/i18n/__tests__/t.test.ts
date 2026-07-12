import { describe, expect, it } from "vitest";

import { diccionarios } from "../diccionario";
import { t } from "../t";

const dict = {
  a: { b: "hola" },
  frase: "En {años}, **{x}** y {x}.",
  soloBold: "queda **negrita** intacta",
};

describe("t", () => {
  it("resuelve claves anidadas por notación de puntos", () => {
    expect(t(dict, "a.b")).toBe("hola");
  });

  it("interpola cada {placeholder}, incluso repetido", () => {
    expect(t(dict, "frase", { años: "10", x: "$5" })).toBe("En 10, **$5** y $5.");
  });

  it("clave inexistente → devuelve la clave", () => {
    expect(t(dict, "no.existe")).toBe("no.existe");
  });

  it("clave que no resuelve a string (rama) → devuelve la clave", () => {
    expect(t(dict, "a")).toBe("a");
  });

  it("placeholder sin valor en params → se deja intacto", () => {
    expect(t(dict, "frase", { años: "10" })).toBe("En 10, **{x}** y {x}.");
  });

  it("no interpreta markdown: ** viaja verbatim", () => {
    expect(t(dict, "soloBold")).toBe("queda **negrita** intacta");
  });

  it("sobre el diccionario real preserva ** e interpola", () => {
    const s = t(diccionarios.es, "frases.normal", {
      años: "10 años",
      balance: "1.000,00 US$",
      aportado: "500,00 US$",
      interes: "500,00 US$",
      mult: "2,0",
    });
    expect(s).toContain("**1.000,00 US$**");
    expect(s).not.toContain("{");
  });
});
