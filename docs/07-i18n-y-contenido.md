# 07 — i18n y contenido

## 1. Rutas e idiomas

- `/es/` y `/en/` como páginas estáticas completas (hreflang en docs/06 §3).
- Raíz `/`: redirección en cliente por `navigator.language` (es* → `/es/`,
  resto → `/en/`) con enlaces visibles a ambos idiomas como fallback sin JS.
- Selector de idioma en el header (enlaza a la otra ruta conservando query params).

## 2. Diccionarios

- `src/i18n/es.json` es la **fuente canónica**: todo texto nuevo nace aquí
  (este documento define su contenido inicial); `en.json` lo traduce clave a clave.
- Claves por área: `tabs.*`, `pasos.*`, `campos.<nombre>.{label,ayuda,error}`,
  `resultados.*`, `frases.*`, `metricas.*`, `acciones.*`, `faq.*`.
- Números y moneda SOLO vía `formatMoney(valor, locale)` y
  `Intl.NumberFormat(locale)`. USD siempre; el símbolo/formato cambia por locale
  (`$1,000.00` en en-US; `1.000,00 US$` según es-*), la moneda no.
- Cero strings en JSX (regla verificable de CLAUDE.md).

## 3. Copy canónico — formulario (es)

| Campo | Label | Línea de ayuda |
|---|---|---|
| capitalInicial | Capital inicial | El dinero con el que empiezas hoy. Puede ser 0. |
| aporteRegimen | Aporte mensual | Lo que agregas cada mes. Se abona al final de cada mes. |
| duración | Tiempo de inversión | ¿Cuántos años (o meses) dejarás crecer el dinero? |
| tasa | Rentabilidad anual estimada | Tasa nominal anual. Como referencia histórica de largo plazo, un índice de acciones de EE. UU. ha promediado cerca del 10 % nominal; no es una promesa a futuro. |
| frecuencia | Frecuencia de capitalización | Cada cuánto el interés se suma al capital y empieza a generar más interés. |
| impulso.titulo | Impulso inicial (opcional) | Aporta más durante los primeros años y deja que el tiempo haga el resto. |
| impulso.anios | Años de impulso | De 1 a 5 años, contados desde el inicio. |
| impulso.aporte | Aporte mensual durante el impulso | Reemplaza al aporte mensual solo durante esos años. |
| proteccion.titulo | Protección final (opcional) | Baja la rentabilidad esperada en los últimos años para proteger lo alcanzado, como hacen los fondos de retiro. |
| proteccion.anios | Años de protección | De 1 a 5 años, contados desde el final. |
| proteccion.tasa | Rentabilidad reducida | La tasa a la que llegarás al final. La bajada es gradual, año a año, automática. |
| varianza | Varianza de la tasa (opcional) | Puntos por encima y por debajo de tu tasa para ver un escenario prudente y uno optimista. |
| meta | Meta (opcional) | ¿Cuánto quieres tener al final? Calcularemos el aporte mensual necesario. |
| inflacion | Inflación anual | Promedio histórico de EE. UU.: 3 %. Puedes ajustarla. |

Avisos suaves: `seccion.incompleta` = "Completa ambos campos para aplicar esta
sección." · `seccion.clampeada.impulso` = "Tu impulso cubre todo el período." ·
`seccion.clampeada.proteccion` = "La protección cubre todo el período: la
escalera baja desde el inicio." · `url.invalida` = "Algunos valores del enlace
no eran válidos y usamos los predeterminados."

Errores (patrón, con mínimo/máximo interpolados): `error.rango` = "Ingresa un
valor entre {min} y {max}." · `error.numero` = "Ingresa un número." ·
`error.entero` = "Ingresa un número entero."

## 4. Copy canónico — frases de resultado (es)

| Clave | Condición | Texto |
|---|---|---|
| `frases.normal` | cálculo directo | "En {años}, tendrás **{balance}**. Aportaste {aportado} y el interés puso {interes} — tu dinero se multiplicó por {mult}." |
| `frases.meta.ok` | despeje OK | "Aportando **{regimen} al mes**{desdeAnio}, llegarás a **{meta}** en {años}." (`{desdeAnio}` = " desde el año {n}" solo si hay impulso) |
| `frases.meta.superada` | META_SUPERADA | "🎉 Ya superas tu meta sin aportes mensuales: te sobran ≈ {sobrante}." |
| `frases.meta.sinRegimen` | SIN_MESES_REGIMEN | "Tu impulso cubre todo el período y no queda tramo mensual por calcular. Ajusta la duración, la meta o el impulso." |
| `frases.real` | toggle activo (sufijo) | "En dinero de hoy: **{balanceReal}** (inflación del {inf} % anual)." |
| `metricas.ahorro` | Avanzada con impulso | "Frente a un aporte fijo de {fijo}/mes que llega al mismo resultado, tu plan escalonado ahorra **{ahorro}** en aportes." |
| `metricas.costoProteccion` | Experto con protección | "Proteger tu capital los últimos {n} años cuesta ≈ **{costo}** de resultado final. Es el precio de dormir tranquilo." |
| `metricas.banda` | varianza | "Con {tasa}±{v} %: entre **{inferior}** y **{superior}**." |
| `vacio.titulo` / `vacio.cta` | estado vacío | "Tu proyección aparecerá aquí." / "Ver un ejemplo" |
| `acciones.calcular/compartir/copiado` | — | "Calcular" / "Compartir" / "Enlace copiado" |

Reglas: los textos se copian TAL CUAL (con su negrita); los placeholders se
formatean con `formatMoney`/`Intl`. Las variantes en_US se redactan en M4 y se
revisan por humano antes del 1.0.0 (pendiente en README).

## 5. FAQ indexable (al pie, HTML estático, 5 preguntas)

1. ¿Qué es el interés compuesto? (explicación en 3 frases, con el ejemplo
   100 → interés sobre interés)
2. ¿Qué significa la frecuencia de capitalización? (y por qué mensual rinde
   más que anual a igual tasa nominal)
3. ¿Por qué conviene aportar más los primeros años? (el impulso: el dinero
   temprano compone más tiempo — con el dato del ahorro del caso ejemplo)
4. ¿Qué es la "protección final"? (glide path en lenguaje simple + que tiene
   un costo visible)
5. ¿Los resultados están garantizados? (no: proyección con tasa constante
   supuesta; los mercados varían; no es asesoría financiera)

La redacción final de las 5 respuestas (80–120 palabras cada una, original,
sin citar textos de terceros) es parte del módulo M7, siguiendo estos ángulos.

## 6. Descargo de responsabilidad (footer, ambos idiomas)

"Esta calculadora es una herramienta educativa. Los resultados son proyecciones
basadas en los supuestos que ingresas y no constituyen asesoría financiera ni
garantía de rendimientos." — visible sin scroll adicional en el footer, junto a
la versión de la app.
