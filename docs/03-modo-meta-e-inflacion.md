# 03 — Modo meta e inflación

## 1. Modo meta (Decisión 4, Opción A)

Se despeja ÚNICAMENTE el aporte de régimen. Fundamento: el balance final es
**lineal** en cada monto de aporte, así que:

```
A = calcular(escenario con aporteRegimen = 0).balanceFinal
B = calcular(escenario con aporteRegimen = 1, capitalInicial = 0,
             impulso.aporteMensual = 0).balanceFinal      // factor del régimen
regimen = (meta − A) / B
```

Implementación: `B` puede obtenerse con una sola corrida extra usando P=0 e
impulso 0 y régimen 1 (la linealidad lo garantiza). Redondeo del resultado:
**hacia arriba al centavo** (garantiza meta alcanzada o superada).

### Casos especiales (salida tipada, la UI mapea a copy de docs/07 §4)

| Código | Condición | Semántica |
|---|---|---|
| `OK` | regimen > 0 | aporte requerido |
| `META_SUPERADA` | regimen ≤ 0 | ya se supera sin régimen; devolver `sobrante = A − meta` |
| `SIN_MESES_REGIMEN` | B = 0 (impulso clampeado cubre todo) | no hay incógnita que despejar |

La validación de `meta` (rango, vacío) es del formulario; no llega al motor.

### Casos de prueba (m=12, 10 %)

| Caso | Entradas | Salida |
|---|---|---|
| M1 canónico | meta 1 000 000; P=10 000; impulso 1 000×5; 300 m | A = 688 034,02 · B = 759,368836 · regimen exacto 410,822736 → **410,83** |
| M2 verificación | correr E1 con régimen 410,83 | **1 000 005,52** (≥ meta ✓) |
| M3 meta superada | meta 50 000; P=80 000; 120 m; sin impulso | `META_SUPERADA`, sobrante **166 563,32** |
| M4 sin régimen | meta 1 000 000; impulso N=5 clampeado (duración 60 m) | `SIN_MESES_REGIMEN` |
| M5 redondeo dirección | cualquier caso OK | `ceil` a centavo, nunca half-up |

Nota de contrato: M1 corrige la cifra ~417 mencionada durante el diseño; el
valor exacto del despeje es 410,83. La tabla manda.

## 2. Inflación — "ver en dinero de hoy" (Decisión 5)

- Campo `inflacionAnual`: default **3** (promedio histórico USA), rango 0–20,
  editable. Sin API. El default vive en config por país (hoy solo `USA: 3`).
- Fórmula de deflactación (efectiva anual, prorrateo mensual):

```
deflactar(valor, mes, i) = valor / (1 + i/100)^(mes/12)
```

### Qué transforma el toggle (activo)

1. Cifra grande → deflactada al mes final.
2. Barras apiladas → cada año deflactado a SU propio mes de cierre.
3. Tabla → columna adicional "Balance (dinero de hoy)".
4. Torta → NO cambia proporciones (mismo factor para los tres componentes);
   solo se deflactan las cifras de la leyenda.
5. Modo meta → la meta se ingresa SIEMPRE nominal; junto al resultado se
   muestra su equivalente real como dato informativo. El aporte despejado no cambia.

### Casos de prueba (inflación 3 %)

| Caso | Entradas | Salida |
|---|---|---|
| I1 canónico | deflactar(1 006 968,93, mes 300, 3) | **480 933,97** |
| I2 identidad | inflación 0 %, cualquier valor | valor idéntico |
| I3 intermedio | deflactar(X, mes 120, 3) | X / 1,03^10 |
| I4 mes 0 | deflactar(X, 0, i) | X (exponente 0) |
| I5 meta+toggle | M1 con toggle activo | regimen sigue 410,83; se muestra "≈ 477 605 de hoy" (1 000 000 / 1,03^25) |

I5 exacto: 1 000 000 / 1,03^25 = **477 605,57**.
