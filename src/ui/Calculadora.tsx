import { useState } from "react";
import type { FormEvent } from "react";

import type { Diccionario } from "../i18n/diccionario";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

import Campo from "./Campo";
import CampoDuracion from "./CampoDuracion";
import CampoFrecuencia from "./CampoFrecuencia";
import Tabs from "./Tabs";
import { esquemaFormulario } from "./esquema/formulario";
import { mapearError } from "./esquema/mapear-error";

interface Props {
  locale: Locale;
  dict: Diccionario;
}

// Valores iniciales = defaults de docs/02 §6 (docs/04 §3: cada visita arranca en
// defaults, sin localStorage). Se guardan como strings crudos: preservan lo tecleado
// y el esquema Zod los normaliza al validar.
const DEFAULTS: Record<string, string> = {
  capitalInicial: "1000",
  aporteRegimen: "100",
  duracion: "10",
  duracionUnidad: "a",
  tasaNominalAnual: "8",
  frecuencia: "12",
};

// Orden de foco al primer error (docs/04 §3). Unidad y frecuencia no producen error.
const ORDEN_CAMPOS = [
  "capitalInicial",
  "aporteRegimen",
  "duracion",
  "tasaNominalAnual",
] as const;

// Isla React del formulario Básica (docs/04 §1–3). M5: pasos 1–4 + validación inline.
// El botón Calcular solo valida; el cálculo y el render de resultados llegan en M6.
export default function Calculadora({ locale, dict }: Props) {
  const [valores, setValores] = useState<Record<string, string>>(DEFAULTS);
  const [tab, setTab] = useState("basica");
  // Clave de error del esquema por campo (`errores.<campo>.<sufijo>`), no el texto:
  // así el mensaje de `duracion` se recalcula con la unidad actual al renderizar.
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Corre el esquema completo y devuelve la primera clave de error por campo.
  function erroresDe(vals: Record<string, string>): Record<string, string> {
    const res = esquemaFormulario.safeParse(vals);
    if (res.success) return {};
    const acc: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const campo = String(issue.path[0]);
      if (!(campo in acc)) acc[campo] = issue.message;
    }
    return acc;
  }

  // Texto de error traducido de un campo, o undefined si es válido.
  function mensaje(campo: string): string | undefined {
    const clave = errores[campo];
    return clave
      ? mapearError(dict, clave, {
          duracionUnidad: valores.duracionUnidad as "a" | "m",
        })
      : undefined;
  }

  function cambiar(campo: string, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  // Validación inline al blur: solo toca el error del campo enfocado (docs/04 §3).
  function validarCampo(campo: string) {
    const todos = erroresDe(valores);
    setErrores((e) => {
      const copia = { ...e };
      if (todos[campo]) copia[campo] = todos[campo];
      else delete copia[campo];
      return copia;
    });
  }

  // La unidad cambia el rango de la duración; se revalida ese campo al elegirla.
  function cambiarUnidad(unidad: "a" | "m") {
    const vals = { ...valores, duracionUnidad: unidad };
    setValores(vals);
    setErrores((e) => {
      const copia = { ...e };
      const todos = erroresDe(vals);
      if (todos.duracion) copia.duracion = todos.duracion;
      else delete copia.duracion;
      return copia;
    });
  }

  // Calcular nunca se deshabilita (CLAUDE.md §8): con errores hace scroll+focus al
  // primero; sin errores solo limpia. El cálculo/render es M6.
  function calcular(e: FormEvent) {
    e.preventDefault();
    const todos = erroresDe(valores);
    setErrores(todos);
    const primero = ORDEN_CAMPOS.find((c) => todos[c]);
    if (primero) {
      const el = document.getElementById(`campo-${primero}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }
  }

  const tabs = [
    { id: "basica", label: t(dict, "tabs.basica") },
    { id: "avanzada", label: t(dict, "tabs.avanzada") },
    { id: "experto", label: t(dict, "tabs.experto") },
  ];

  return (
    <section
      data-testid="calculadora"
      lang={locale}
      aria-label={t(dict, "titulo")}
      className="mx-auto flex max-w-xl flex-col gap-6 p-4"
    >
      <Tabs
        tabs={tabs}
        activo={tab}
        etiqueta={t(dict, "tabs.aria")}
        idPanel="panel-formulario"
        onCambio={setTab}
      />

      <div role="tabpanel" id="panel-formulario" aria-labelledby={`tab-${tab}`}>
        {/* En M5 los tres tabs comparten los pasos 1–4; las secciones de Fase 2
            (impulso/protección/varianza/meta) llegan en M12–M13 (docs/04 §2). */}
        <form onSubmit={calcular} noValidate className="flex flex-col gap-6">
          <section aria-labelledby="paso-1" className="flex flex-col gap-4">
            <h2 id="paso-1" className="text-lg font-semibold">
              {t(dict, "pasos.paso1")}
            </h2>
            <Campo
              campo="capitalInicial"
              label={t(dict, "campos.capitalInicial.label")}
              ayuda={t(dict, "campos.capitalInicial.ayuda")}
              valor={valores.capitalInicial}
              error={mensaje("capitalInicial")}
              onCambio={(v) => cambiar("capitalInicial", v)}
              onBlur={() => validarCampo("capitalInicial")}
            />
          </section>

          <section aria-labelledby="paso-2" className="flex flex-col gap-4">
            <h2 id="paso-2" className="text-lg font-semibold">
              {t(dict, "pasos.paso2")}
            </h2>
            <Campo
              campo="aporteRegimen"
              label={t(dict, "campos.aporteRegimen.label")}
              ayuda={t(dict, "campos.aporteRegimen.ayuda")}
              valor={valores.aporteRegimen}
              error={mensaje("aporteRegimen")}
              onCambio={(v) => cambiar("aporteRegimen", v)}
              onBlur={() => validarCampo("aporteRegimen")}
            />
          </section>

          <section aria-labelledby="paso-3" className="flex flex-col gap-4">
            <h2 id="paso-3" className="text-lg font-semibold">
              {t(dict, "pasos.paso3")}
            </h2>
            <CampoDuracion
              label={t(dict, "campos.duracion.label")}
              ayuda={t(dict, "campos.duracion.ayuda")}
              unidadLabels={{
                anios: t(dict, "campos.duracion.unidad.anios"),
                meses: t(dict, "campos.duracion.unidad.meses"),
              }}
              valor={valores.duracion}
              unidad={valores.duracionUnidad as "a" | "m"}
              error={mensaje("duracion")}
              onCambio={(v) => cambiar("duracion", v)}
              onUnidad={cambiarUnidad}
              onBlur={() => validarCampo("duracion")}
            />
          </section>

          <section aria-labelledby="paso-4" className="flex flex-col gap-4">
            <h2 id="paso-4" className="text-lg font-semibold">
              {t(dict, "pasos.paso4")}
            </h2>
            <Campo
              campo="tasaNominalAnual"
              label={t(dict, "campos.tasa.label")}
              ayuda={t(dict, "campos.tasa.ayuda")}
              valor={valores.tasaNominalAnual}
              error={mensaje("tasaNominalAnual")}
              onCambio={(v) => cambiar("tasaNominalAnual", v)}
              onBlur={() => validarCampo("tasaNominalAnual")}
            />
            <CampoFrecuencia
              label={t(dict, "campos.frecuencia.label")}
              ayuda={t(dict, "campos.frecuencia.ayuda")}
              opciones={{
                anual: t(dict, "campos.frecuencia.opciones.anual"),
                semestral: t(dict, "campos.frecuencia.opciones.semestral"),
                trimestral: t(dict, "campos.frecuencia.opciones.trimestral"),
                mensual: t(dict, "campos.frecuencia.opciones.mensual"),
              }}
              valor={valores.frecuencia}
              onCambio={(v) => cambiar("frecuencia", v)}
            />
          </section>

          <button
            type="submit"
            data-testid="boton-calcular"
            className="rounded bg-accion px-4 py-2 font-semibold text-superficie focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accion"
          >
            {t(dict, "acciones.calcular")}
          </button>
        </form>
      </div>
    </section>
  );
}
