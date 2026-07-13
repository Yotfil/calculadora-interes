import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { track } from "../analytics/track";
import { calcular as calcularMotor } from "../core";
import type { Resultado as ResultadoMotor } from "../core";
import type { Diccionario } from "../i18n/diccionario";
import type { Locale } from "../i18n/locale";
import { t } from "../i18n/t";

import Campo from "./Campo";
import CampoDuracion from "./CampoDuracion";
import CampoFrecuencia from "./CampoFrecuencia";
import EstadoVacio from "./EstadoVacio";
import Resultado from "./Resultado";
import SeccionColapsable from "./SeccionColapsable";
import Tabs from "./Tabs";
import type { Tab } from "./tab";
import { aEscenario } from "./esquema/a-escenario";
import { esquemaFormulario } from "./esquema/formulario";
import { mapearError } from "./esquema/mapear-error";

// Lo que la ruta de éxito de Calcular necesita para pintar la zona de resultados.
interface Salida {
  resultado: ResultadoMotor;
  capitalInicial: number;
  duracion: number;
  duracionUnidad: "a" | "m";
  animar: boolean;
}

// prefers-reduced-motion (docs/05 §4): sin animación firma ni scroll suave.
function prefiereReducir(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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
  // Secciones opcionales arrancan vacías (docs/02 §6): "" cuenta como ausente.
  aniosImpulso: "",
  aporteImpulso: "",
};

// El evento GA4 `calcular` reporta el nivel con `tab` (b/a/e, docs/06 §2).
const TAB_EVENTO: Record<Tab, "b" | "a" | "e"> = {
  basica: "b",
  avanzada: "a",
  experto: "e",
};

// Orden de foco al primer error (docs/04 §3), en el orden visual de los pasos.
// El impulso vive en el Paso 2 (docs/04 §1). Unidad y frecuencia no producen error.
const ORDEN_CAMPOS = [
  "capitalInicial",
  "aporteRegimen",
  "aniosImpulso",
  "aporteImpulso",
  "duracion",
  "tasaNominalAnual",
] as const;

const CAMPOS_IMPULSO = ["aniosImpulso", "aporteImpulso"];

// Isla React del formulario Básica (docs/04 §1–3). M5: pasos 1–4 + validación inline.
// El botón Calcular solo valida; el cálculo y el render de resultados llegan en M6.
export default function Calculadora({ locale, dict }: Props) {
  const [valores, setValores] = useState<Record<string, string>>(DEFAULTS);
  const [tab, setTab] = useState<Tab>("basica");
  // Clave de error del esquema por campo (`errores.<campo>.<sufijo>`), no el texto:
  // así el mensaje de `duracion` se recalcula con la unidad actual al renderizar.
  const [errores, setErrores] = useState<Record<string, string>>({});
  // null hasta el primer cálculo válido (estado vacío, docs/04 §4).
  const [salida, setSalida] = useState<Salida | null>(null);
  // La sección Impulso (Avanzada/Experto) arranca colapsada (docs/04 §2.3).
  const [impulsoAbierto, setImpulsoAbierto] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  // Al calcular, scroll al resultado (docs/04 §1, docs/05 §4.3): suave, o salto
  // instantáneo con reduced-motion. En desktop ya está a la vista (columna fija).
  useEffect(() => {
    if (!salida) return;
    resultadoRef.current?.scrollIntoView({
      behavior: salida.animar ? "smooth" : "auto",
      block: "start",
    });
  }, [salida]);

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
  // primero, sin calcular; en éxito arma el escenario, corre el motor y pinta.
  function calcular(e: FormEvent) {
    e.preventDefault();
    const parsed = esquemaFormulario.safeParse(valores);
    if (!parsed.success) {
      const acc: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const campo = String(issue.path[0]);
        if (!(campo in acc)) acc[campo] = issue.message;
      }
      setErrores(acc);
      const primero = ORDEN_CAMPOS.find((c) => acc[c]);
      if (primero) {
        // Un error en el impulso solo es alcanzable con la sección abierta; si
        // estuviera cerrada, la abrimos para que el campo enfocado sea visible.
        if (CAMPOS_IMPULSO.includes(primero)) setImpulsoAbierto(true);
        const el = document.getElementById(`campo-${primero}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }
    setErrores({});
    const datos = parsed.data;
    // El tab define qué entra al motor (docs/04 §2): en Básica solo pasos 1–4;
    // las secciones de Avanzada/Experto llegan en M12–M13.
    const resultado = calcularMotor(aEscenario(datos, tab));
    setSalida({
      resultado,
      capitalInicial: datos.capitalInicial,
      duracion: datos.duracion,
      duracionUnidad: datos.duracionUnidad,
      animar: !prefiereReducir(),
    });
    // Telemetría (docs/06 §2). En Fase 1 solo existe la Básica: impulso y
    // protección son features de M12/M13, así que van en false fijos.
    track("calcular", {
      tab: TAB_EVENTO[tab] ?? "b",
      con_impulso: false,
      con_proteccion: false,
    });
  }

  const tabs = [
    { id: "basica", label: t(dict, "tabs.basica") },
    { id: "avanzada", label: t(dict, "tabs.avanzada") },
    { id: "experto", label: t(dict, "tabs.experto") },
  ];

  // Aviso suave de la sección Impulso (docs/07 §3, nunca es un error):
  // - incompleta: un solo campo lleno (XOR); la sección no se aplica.
  // - clampeada: ambos completos y el impulso cubre todo el período (N*12 ≥ M).
  // Son excluyentes (clampeada exige los dos campos, incompleta exige uno solo).
  const avisoImpulso = ((): string | undefined => {
    if (tab === "basica") return undefined;
    const conAnios = valores.aniosImpulso.trim() !== "";
    const conAporte = valores.aporteImpulso.trim() !== "";
    if (conAnios !== conAporte) return t(dict, "seccion.incompleta");
    const parsed = esquemaFormulario.safeParse(valores);
    if (parsed.success) {
      const esc = aEscenario(parsed.data, tab);
      if (esc.impulso && esc.impulso.anios * 12 >= esc.duracionMeses) {
        return t(dict, "seccion.clampeada.impulso");
      }
    }
    return undefined;
  })();

  return (
    <section
      data-testid="calculadora"
      lang={locale}
      aria-label={t(dict, "titulo")}
      className="mx-auto grid max-w-6xl gap-8 p-4 lg:grid-cols-2"
    >
      {/* Desktop (≥1024): formulario izquierda, resultados fijos a la derecha
          (docs/04 §1). Mobile: resultados debajo con scroll al calcular. */}
      <div className="flex flex-col gap-6">
        <Tabs
          tabs={tabs}
          activo={tab}
          etiqueta={t(dict, "tabs.aria")}
          idPanel="panel-formulario"
          onCambio={(id) => setTab(id as Tab)}
        />

        <div
          role="tabpanel"
          id="panel-formulario"
          aria-labelledby={`tab-${tab}`}
        >
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

              {/* Impulso inicial (docs/04 §1): sección colapsada del Paso 2,
                  presente en Avanzada y Experto (no en Básica). */}
              {tab !== "basica" && (
                <SeccionColapsable
                  id="seccion-impulso"
                  titulo={t(dict, "campos.impulso.titulo")}
                  abierto={impulsoAbierto}
                  onToggle={() => setImpulsoAbierto((abierto) => !abierto)}
                >
                  <p className="text-sm text-texto-suave">
                    {t(dict, "campos.impulso.ayuda")}
                  </p>
                  <Campo
                    campo="aniosImpulso"
                    label={t(dict, "campos.impulso.anios.label")}
                    ayuda={t(dict, "campos.impulso.anios.ayuda")}
                    valor={valores.aniosImpulso}
                    error={mensaje("aniosImpulso")}
                    inputMode="numeric"
                    onCambio={(v) => cambiar("aniosImpulso", v)}
                    onBlur={() => validarCampo("aniosImpulso")}
                  />
                  <Campo
                    campo="aporteImpulso"
                    label={t(dict, "campos.impulso.aporte.label")}
                    ayuda={t(dict, "campos.impulso.aporte.ayuda")}
                    valor={valores.aporteImpulso}
                    error={mensaje("aporteImpulso")}
                    onCambio={(v) => cambiar("aporteImpulso", v)}
                    onBlur={() => validarCampo("aporteImpulso")}
                  />
                  {avisoImpulso && (
                    <p
                      data-testid="aviso-impulso"
                      className="text-sm text-texto-suave"
                    >
                      {avisoImpulso}
                    </p>
                  )}
                </SeccionColapsable>
              )}
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
      </div>

      <div
        ref={resultadoRef}
        data-testid="zona-resultados"
        className="lg:sticky lg:top-4 lg:self-start"
      >
        {salida ? (
          <Resultado
            resultado={salida.resultado}
            capitalInicial={salida.capitalInicial}
            duracion={salida.duracion}
            duracionUnidad={salida.duracionUnidad}
            locale={locale}
            dict={dict}
            animar={salida.animar}
          />
        ) : (
          <EstadoVacio dict={dict} />
        )}
      </div>
    </section>
  );
}
