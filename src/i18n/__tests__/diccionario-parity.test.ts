import { describe, expect, it } from "vitest";

import en from "../en.json";
import es from "../es.json";

/** Aplana un diccionario a pares [ruta con puntos, valor] de sus hojas string. */
function hojas(
  obj: Record<string, unknown>,
  prefijo = "",
): Array<[string, string]> {
  return Object.entries(obj).flatMap(([k, v]) => {
    const ruta = prefijo ? `${prefijo}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      return hojas(v as Record<string, unknown>, ruta);
    }
    return typeof v === "string" ? [[ruta, v] as [string, string]] : [];
  });
}

const paresEs = hojas(es);
const paresEn = hojas(en);
const mapaEn = new Map(paresEn);

describe("paridad de diccionarios es ↔ en", () => {
  it("en.json tiene exactamente las mismas claves que es.json (canónico)", () => {
    const clavesEs = paresEs.map(([k]) => k).sort();
    const clavesEn = paresEn.map(([k]) => k).sort();
    expect(clavesEs.filter((k) => !mapaEn.has(k))).toEqual([]);
    expect(clavesEn.filter((k) => !new Map(paresEs).has(k))).toEqual([]);
    expect(clavesEn).toEqual(clavesEs);
  });

  it("ningún texto quedó sin traducir (salvo endónimos idioma.*)", () => {
    const sinTraducir = paresEs
      .filter(([k, v]) => !k.startsWith("idioma.") && mapaEn.get(k) === v)
      .map(([k]) => k);
    expect(sinTraducir).toEqual([]);
  });

  it("cada texto conserva los mismos {placeholder} en ambos idiomas", () => {
    // Una traducción que renombre un placeholder rompería la interpolación de
    // `t` en silencio; la paridad de claves no lo detecta. Este test sí.
    const placeholders = (s: string) =>
      [...s.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]).sort();
    const discrepan = paresEs
      .filter(
        ([k, v]) =>
          JSON.stringify(placeholders(v)) !==
          JSON.stringify(placeholders(mapaEn.get(k) ?? "")),
      )
      .map(([k]) => k);
    expect(discrepan).toEqual([]);
  });
});
