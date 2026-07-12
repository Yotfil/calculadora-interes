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

/**
 * Rango [min, max] por campo numérico. Fuente ÚNICA: el esquema los aplica y la
 * UI (`mapearError`) los interpola en la plantilla genérica `error.rango`
 * (docs/07 §3). Duplicar los límites como texto sería deriva (ESTADO, M4).
 * `duracion` es especial: su máximo depende de la unidad (docs/02 §6).
 */
export const rangos = {
  capitalInicial: { min: 0, max: 100_000_000 },
  aporteRegimen: { min: 0, max: 1_000_000 },
  aporteImpulso: { min: 0, max: 1_000_000 },
  tasaNominalAnual: { min: 0, max: 100 },
  tasaReducida: { min: 0, max: 100 },
  varianza: { min: 0, max: 20 },
  inflacionAnual: { min: 0, max: 20 },
  meta: { min: 1, max: 1_000_000_000 },
  aniosImpulso: { min: 1, max: 5 },
  aniosProteccion: { min: 1, max: 5 },
  duracion: { a: { min: 1, max: 50 }, m: { min: 1, max: 600 } },
} as const;

/** Campos con un rango plano `{min,max}` (todos menos `duracion`). */
type CampoRango = Exclude<keyof typeof rangos, "duracion">;

/** Número en el rango de `rangos[campo]` con claves de error `errores.<campo>.*`. */
function numeroEnRango(campo: CampoRango) {
  const { min, max } = rangos[campo];
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
      numeroEnRango("capitalInicial").default(1_000),
    ),
    aporteRegimen: z.preprocess(aNumero, numeroEnRango("aporteRegimen").default(100)),
    aporteImpulso: z.preprocess(aNumero, numeroEnRango("aporteImpulso").optional()),
    // El rango de la duración depende de la unidad; el máximo se valida en el
    // superRefine de abajo. Default: 10 años (docs/02 §6).
    duracion: z.preprocess(
      aNumero,
      z
        .number({ error: "errores.duracion.numero" })
        .int("errores.duracion.entero")
        .min(rangos.duracion.a.min, "errores.duracion.rango")
        .default(10),
    ),
    duracionUnidad: z.enum(["a", "m"]).catch("a").default("a"),
    tasaNominalAnual: z.preprocess(
      aNumero,
      numeroEnRango("tasaNominalAnual").default(8),
    ),
    tasaReducida: z.preprocess(aNumero, numeroEnRango("tasaReducida").optional()),
    // Único campo cuyo fuera-de-rango NO es error: cae al default (docs/02 §6).
    frecuencia: z.preprocess(aNumero, z.literal([1, 2, 4, 12]).catch(12).default(12)),
    aniosImpulso: aniosDeSeccion("aniosImpulso"),
    aniosProteccion: aniosDeSeccion("aniosProteccion"),
    varianza: z.preprocess(aNumero, numeroEnRango("varianza").optional()),
    inflacionAnual: z.preprocess(aNumero, numeroEnRango("inflacionAnual").default(3)),
    meta: z.preprocess(aNumero, numeroEnRango("meta").optional()),
  })
  .superRefine((valores, ctx) => {
    const maximo = rangos.duracion[valores.duracionUnidad].max;
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
