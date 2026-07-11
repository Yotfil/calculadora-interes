# 02 — Motor de cálculo

Contrato del corazón del producto. Las tablas de casos son EXACTAS: se escriben
primero como tests (tolerancia ±0,01 USD) y luego se implementa.

## 1. Semántica de tasa (Decisión 1, Opción B)

La tasa que ingresa el usuario es **nominal anual**. El selector de
capitalización `m ∈ {1, 2, 4, 12}` define la tasa efectiva y su equivalente mensual:

```
EA      = (1 + r/m)^m − 1                 // r en fracción (10% → 0.10)
i_mes   = (1 + r/m)^(m/12) − 1            // tasa mensual equivalente
```

Verificación (r = 10 %):

| m | Nombre | EA | i_mes |
|---|---|---|---|
| 1 | anual | 10,0000 % | 0,797414 % |
| 2 | semestral | 10,2500 % | 0,816485 % |
| 4 | trimestral | 10,3813 % | 0,826484 % |
| 12 | mensual | 10,4713 % | 0,833333 % |

## 2. Iteración mensual (contrato exacto)

Aportes al **fin de mes** (el aporte del mes t no gana interés en t). Orden de
operaciones fijo — cambiarlo cambia los centavos y rompe las anclas:

```
balance = capitalInicial
para t = 1 .. duracionMeses:
    balance = balance * (1 + tasa(t)) + aporte(t)
```

- `tasa(t)`: constante `i_mes` salvo glide path (§5).
- `aporte(t)`: régimen, salvo impulso (§4).
- Aritmética en float64 de punta a punta. **Prohibido redondear dentro del bucle**
  (§7 define el redondeo de presentación).
- Fila anual: `aportado` e `interes` son los acumulados del año calendario del
  plan (meses 12k+1..12k+12); si la duración no es múltiplo de 12, la última
  fila es parcial y se marca.

### Casos de prueba — núcleo (P=0, aporte 100, 12 meses, tasa 10 %)

| Caso | m | Balance final |
|---|---|---|
| N1 | 1 | **1 254,05** |
| N2 | 2 | **1 255,38** |
| N3 | 4 | **1 256,08** |
| N4 | 12 | **1 256,56** |
| N5: aporte 0, P=10 000, 12 m, 10 %, m=12 | 12 | 11 047,13 |
| N6: tasa 0 %, P=1 000, aporte 100, 24 m | 12 | 3 400,00 |
| N7: duración 1 mes, P=0, aporte 100, 10 % | 12 | 100,00 (el aporte del mes no gana interés) |

## 3. Escenario Básica de referencia

P = 10 000 · aporte 420 · 300 meses · 10 % · m=12 → **677 839,48**.
(Es también el resultado de Avanzada/Experto con secciones vacías.)

## 4. Impulso inicial (aportes escalonados — tab Avanzada)

Campos: `anios N ∈ {1..5}` (entero) y `aporteMensual X`. Regla:

```
corte = min(N*12, duracionMeses)          // clampeo
aporte(t) = X   si t ≤ corte
          = aporteRegimen   si t > corte
```

Bordes (cerrados, no re-abrir):
1. Sección incompleta (falta N o X) → se ignora; la UI avisa suave; Calcular nunca se bloquea.
2. N*12 ≥ duración → clampeo: todo el período usa X; la UI lo indica.
3. Duración en meses: el corte es en meses completos (N=2, 30 meses → meses 1–24 con X).
4. X < régimen y X = 0: permitidos (validación suave, el copy sugiere el uso previsto).
5. Aportes negativos: fuera de alcance. El tipo admite signo; la UI valida ≥ 0.

### Casos de prueba — impulso (m=12, 10 % salvo indicación)

| Caso | Entradas | Balance final |
|---|---|---|
| E1 canónico | P=10 000; X=1 000, N=5; régimen 420; 300 m | **1 006 968,93** |
| E2 simple | P=0; X=200, N=2; régimen 100; 36 m | **7 099,81** |
| E3 sección vacía | P=10 000; régimen 420; 300 m | = caso §3 exacto (677 839,48) |
| E4 clampeo | P=0; X=500, N=5; régimen 100; 36 m | **20 890,91** (≡ 36 m de 500) |

## 5. Protección final (glide path gradual — tab Experto)

Campos: `anios N ∈ {1..5}` y `tasaReducida` (misma convención §1: nominal anual
+ el MISMO selector m del formulario). La protección ocupa los últimos `N*12`
meses, en `N` bloques de 12 contados **desde el final**; interpolación en
escalera anual:

```
N' = min(N, ceil(duracionMeses / 12))                  // clampeo en bloques
inicioProt = duracionMeses − N'*12                     // meses 1..inicioProt: tasa principal
para un mes t > inicioProt:
    j = ceil((duracionMeses − t + 1) / 12)             // bloque desde el final (1 = último)
    k = N' − j + 1                                     // 1..N'
    r_k = principal − (principal − reducida) * k / N'  // tasa nominal del bloque
    tasa(t) = i_mes(r_k, m)
```

Con 10 %→5 %, N=5: bloques a 9, 8, 7, 6, 5 %. Con 10 %→4 %, N=2: 7, 4 %.

Bordes (cerrados):
1. Sección incompleta → se ignora (idéntico a impulso).
2. Clampeo (N ≥ duración en años): la escalera cubre todo el período; el primer
   bloque ya arranca un escalón abajo y el último termina en la reducida.
3. Reducida ≥ principal: permitido; la escalera sube.
4. Reducida = 0 %: válido.
5. Convivencia con impulso: independientes; cada sección se clampea por separado;
   un mismo mes puede tener aporte X y tasa reducida (sin regla de conflicto).

### Casos de prueba — glide (m=12)

| Caso | Entradas | Balance final |
|---|---|---|
| G1 canónico protegido | E1 + protección N=5 → 5 % | **869 040,78** |
| G2 costo de la protección | E1 − G1 | **137 928,15** |
| G3 escalera corta | P=10 000; aporte 100; 120 m; 10 %→4 %, N=2 | **43 579,79** (años 1–8 al 10 %, año 9 al 7 %, año 10 al 4 %) |
| G4 clampeo | P=10 000; aporte 100; 36 m; 10 %→5 %, N=5→3 bloques (8,33/6,67/5 %) | **16 136,34** |
| G5 duración no múltiplo | P=0; aporte 100; 30 m; 10 %→5 %, N=2 (meses 1–6 al 10 %, 7–18 al 7,5 %, 19–30 al 5 %) | **3 227,53** |

## 6. Rangos válidos y clampeo (esquema Zod único — formulario y URL)

| Campo | Tipo | Rango | Default | Fuera de rango |
|---|---|---|---|---|
| capitalInicial | número ≥ 0 | 0 – 100 000 000 | 1 000 | error inline |
| aporteRegimen / aporteImpulso | número ≥ 0 | 0 – 1 000 000 | 100 / vacío | error inline |
| duración | entero | 1 – 600 meses (radio años: 1 – 50) | 10 años | error inline |
| tasaNominalAnual / tasaReducida | número | 0 – 100 (decimales OK) | 8 / vacío | error inline |
| frecuencia | enum | {1, 2, 4, 12} | 12 (mensual) | default |
| anios (impulso/protección) | entero | 1 – 5 | vacío | error inline |
| varianza | número | 0 – 20 puntos | vacío | error inline |
| inflacionAnual | número | 0 – 20 | 3 | error inline |
| meta | número > 0 | 1 – 1 000 000 000 | vacío | error inline |

En URL (docs/04 §5): parámetro inválido → se descarta y toma default, con aviso;
nunca rompe la página. La varianza se evalúa recortando la tasa resultante a
[0, 100] (tasa 0,5 % con varianza 1 → banda inferior a 0 %).

## 7. Redondeo y presentación

- Motor: float64 sin redondeos intermedios; expone números crudos.
- Presentación: tabla y leyendas a centavos (half-up); cifra grande a dólar
  entero (half-up); multiplicador a 1 decimal.
- Modo meta: única excepción con dirección fija — hacia ARRIBA al centavo (docs/03 §1).
- Asserts de tests: `toBeCloseTo(valor, 2)` ⇒ ±0,01.

## 8. Varianza (tab Experto)

Si `varianza = v` (> 0): el motor corre 3 veces — tasa, tasa−v, tasa+v — y llena
`banda`. La varianza NO aplica a la tasa reducida del glide (la protección
modela una decisión, no una incertidumbre); sí desplaza la tasa principal en
los bloques: `r_k` se recalcula con `principal±v`.

Caso V1: escenario §3 con varianza 1 → banda = [Básica al 9 %, Básica al 11 %];
los valores exactos se fijan en el test del módulo M11 con la implementación de
referencia ya validada por N1–G5.
