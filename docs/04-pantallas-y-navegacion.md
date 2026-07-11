# 04 — Pantallas y navegación

Una sola página por idioma. Sin rutas internas, sin menús, sin onboarding
aparte: el formulario es el onboarding.

## 1. Estructura

```
[ Básica ] [ Avanzada ] [ Experto ]          ← tabs

  Paso 1 · Capital inicial
  Paso 2 · Aportes                            ← Avanzada/Experto: sección colapsada "Impulso inicial"
  Paso 3 · Tiempo                             (radio años/meses)
  Paso 4 · Rentabilidad                       ← Experto: secciones "Protección final" y "Varianza"
  Paso 5 · Meta (opcional)                    ← solo Avanzada/Experto
  [ Calcular ]

  ── Resultados ──
  Cifra grande + frase resumen
  [toggle "ver en dinero de hoy" + campo inflación]
  Torta · Barras apiladas · Tabla anual
  Avanzada: métrica "ahorro del plan escalonado"
  Experto: banda de varianza + "costo de la protección"
  [ Compartir ]
```

Desktop (≥1024 px): formulario a la izquierda, resultados fijos (sticky) a la
derecha. Mobile: resultados debajo con scroll automático al calcular.

## 2. Reglas de tabs y estado

1. Los tres tabs comparten los mismos pasos; cada nivel AGREGA secciones
   colapsadas dentro del paso al que pertenecen. Cambiar de tab nunca reordena.
2. Cambiar de tab conserva los valores. **El tab define qué entra al motor; los
   valores nunca se borran solos** (protección configurada en Experto se ignora
   al calcular en Básica, pero sigue ahí al volver).
3. Secciones opcionales arrancan colapsadas; al expandir no se aplican hasta
   estar completas (docs/02 §4–5 borde 1).

## 3. Formulario

- Cada campo: label + línea de copy educativo (docs/07 §3) + input.
- Validación inline al perder foco, bajo el campo, nunca modal.
- **El botón Calcular nunca se deshabilita**: con errores, calcular scrollea al
  primero y lo enfoca.
- Modo meta (paso 5): al activarlo, el campo "aporte de régimen" (paso 2) se
  deshabilita visualmente con la etiqueta "lo calcularemos por ti".
- Defaults del formulario: los de docs/02 §6 (P=1 000, aporte 100, 10 años,
  8 %, mensual). Cada visita arranca en defaults: sin localStorage.

## 4. Zona de resultados

- Estado vacío (antes del primer cálculo): invitación + botón **"Ver un
  ejemplo"** que llena el formulario con el caso canónico E1 (en el tab activo,
  con sus secciones si aplican) y calcula. El usuario siente el producto sin escribir.
- Frase resumen: variante según el caso (docs/07 §4). Nunca se improvisa copy.
- Gráficos: torta (composición final: inicial/aportes/interés) + barras apiladas
  por año (mismos tres colores semánticos en torta, barras, leyenda y tabla).
- Tabla anual: Año · Aportado · Interés · Balance (+ columna real con toggle).
- Cifra grande con animación firma (docs/05 §4); frase resumen debajo.
- Métricas por tab: docs/06 §1. El "costo de la protección" solo aparece si hay
  protección aplicada; el "ahorro del escalonado" solo si hay impulso aplicado.
- Botón Compartir: copia al portapapeles la URL del escenario (§5) + toast.

## 5. URL compartible (única "persistencia")

- La URL se genera SOLO al tocar Compartir (nunca se actualiza en vivo).
- Parámetros (todos opcionales): `tab` (b|a|e) · `ini` · `ap` · `dur` (meses) ·
  `durU` (a|m, solo para el radio) · `tasa` · `cap` (1|2|4|12) · `impN` · `impX` ·
  `protN` · `protT` · `var` · `meta` · `inf` · `infOn` (1).
- Al cargar con parámetros: se validan con el MISMO esquema Zod del formulario;
  los inválidos se descartan a default con aviso suave; los presentes llenan sus
  campos; se abre el `tab` indicado con secciones expandidas; **se calcula
  automáticamente** (el receptor ve el resultado, no un formulario a medio llenar).
- Sin parámetros: defaults. URL parcial o de versión vieja: funciona con lo que traiga.
- Precedencia: URL > defaults (no hay localStorage).

## 6. Flujos e2e (Playwright — contrato de comportamiento)

| Flujo | Pasos | Verificación |
|---|---|---|
| F1 cálculo básico | defaults → Calcular | cifra y tabla visibles; frase resumen correcta |
| F2 ejemplo | "Ver un ejemplo" | formulario lleno con E1 y resultado 1 006 969 (redondeo cifra grande) |
| F3 conserva valores | configurar protección en Experto → ir a Básica → calcular → volver | Básica ignora protección; valores intactos en Experto |
| F4 error inline | tasa 150 → blur → Calcular | mensaje bajo el campo; scroll+focus; sin cálculo |
| F5 meta $0 | P=80 000, meta 50 000, 10 años | frase `META_SUPERADA` con sobrante 166 563 |
| F6 compartir | E1 → Compartir → abrir URL en contexto nuevo | tab Avanzada abierto, secciones expandidas, resultado calculado |
| F7 URL inválida | `?tasa=abc&ini=5000` | ini=5 000, tasa=default, aviso suave, página funcional |
| F8 idioma | mismo flujo F1 en `/en/` | textos en inglés, números formato en-US |
| F9 reduced-motion | emular `prefers-reduced-motion` → Calcular | resultado aparece sin animación |
| F10 inflación | E1 → toggle | cifra grande 480 934; tabla con columna real; torta proporciones intactas |
