import { z } from "zod";

// Esquema Zod ÚNICO para formulario y parámetros de URL (docs/02 §6).
// Los mensajes de error son claves i18n: los textos viven en los diccionarios
// (docs/07); la UI (M5) los traduce y la capa de URL (M18) los descarta a
// default con aviso. Aquí no hay clampeo silencioso: fuera de rango = error,
// salvo `frecuencia`, cuyo "fuera de rango" es tomar el default (docs/02 §6).

/**
 * Los valores llegan como string desde inputs y desde la URL: "" y null
 * cuentan como ausentes (disparan default u opcional); el resto se convierte
 * a número (los no numéricos dan NaN, que el esquema rechaza).
 */
function aNumero(valor: unknown): unknown {
  if (valor === "" || valor === null) return undefined;
  if (typeof valor === "string") {
    const limpio = valor.trim();
    return limpio === "" ? undefined : Number(limpio);
  }
  return valor;
}

/** Número en [min, max] con claves de error `errores.<campo>.*`. */
function numeroEnRango(campo: string, min: number, max: number) {
  return z
    .number({ error: `errores.${campo}.numero` })
    .min(min, `errores.${campo}.rango`)
    .max(max, `errores.${campo}.rango`);
}

/** Años de una sección opcional (impulso/protección): entero 1–5. */
function aniosDeSeccion(campo: string) {
  return z.preprocess(
    aNumero,
    z.literal([1, 2, 3, 4, 5], `errores.${campo}.rango`).optional(),
  );
}

export const esquemaFormulario = z
  .object({
    capitalInicial: z.preprocess(
      aNumero,
      numeroEnRango("capitalInicial", 0, 100_000_000).default(1_000),
    ),
    aporteRegimen: z.preprocess(
      aNumero,
      numeroEnRango("aporteRegimen", 0, 1_000_000).default(100),
    ),
    aporteImpulso: z.preprocess(
      aNumero,
      numeroEnRango("aporteImpulso", 0, 1_000_000).optional(),
    ),
    // El rango de la duración depende de la unidad; el máximo se valida en el
    // superRefine de abajo. Default: 10 años (docs/02 §6).
    duracion: z.preprocess(
      aNumero,
      z
        .number({ error: "errores.duracion.numero" })
        .int("errores.duracion.entero")
        .min(1, "errores.duracion.rango")
        .default(10),
    ),
    duracionUnidad: z.enum(["a", "m"]).catch("a").default("a"),
    tasaNominalAnual: z.preprocess(
      aNumero,
      numeroEnRango("tasaNominalAnual", 0, 100).default(8),
    ),
    tasaReducida: z.preprocess(aNumero, numeroEnRango("tasaReducida", 0, 100).optional()),
    // Único campo cuyo fuera-de-rango NO es error: cae al default (docs/02 §6).
    frecuencia: z.preprocess(aNumero, z.literal([1, 2, 4, 12]).catch(12).default(12)),
    aniosImpulso: aniosDeSeccion("aniosImpulso"),
    aniosProteccion: aniosDeSeccion("aniosProteccion"),
    varianza: z.preprocess(aNumero, numeroEnRango("varianza", 0, 20).optional()),
    inflacionAnual: z.preprocess(aNumero, numeroEnRango("inflacionAnual", 0, 20).default(3)),
    meta: z.preprocess(aNumero, numeroEnRango("meta", 1, 1_000_000_000).optional()),
  })
  .superRefine((valores, ctx) => {
    const maximo = valores.duracionUnidad === "a" ? 50 : 600;
    if (valores.duracion > maximo) {
      ctx.addIssue({
        code: "custom",
        path: ["duracion"],
        message: "errores.duracion.rango",
      });
    }
  });

/** Valores validados del formulario; la UI y la URL comparten este tipo. */
export type ValoresFormulario = z.infer<typeof esquemaFormulario>;
