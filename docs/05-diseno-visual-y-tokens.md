# 05 — Diseño visual y tokens

## 1. Identidad

- **Sujeto**: la curva exponencial — el momento en que el interés despega.
  Toda la identidad gira alrededor de eso; nada decorativo que no lo sirva.
- **Elemento firma (ÚNICO)**: la revelación del resultado (§4). Todo lo demás
  es sobrio y quieto.
- Referencias asumidas: paleta seria tipo Investor.gov, estructura de tabs tipo
  Fical, narrativa de gráficos tipo JaviLinares. No copiar estéticas: destilar.

## 2. Tokens en dos capas — `src/styles/tokens.css` (única fuente)

Primitivos (muestra; la lista completa se fija en M6 verificando contraste):

```css
:root {
  --navy-950: #0a1826;
  --navy-900: #102a43;
  --navy-700: #243b53;
  --slate-100: #f0f4f8;
  --slate-300: #bcccdc;
  --slate-600: #486581;
  --teal-600: #0e9888;
  --teal-500: #14b8a6;
  --teal-300: #7edcd2;
  --indigo-500: #6366f1;
  --sky-500: #38bdf8;
  --amber-500: #f59e0b;
}
```

Semánticos (los componentes SOLO usan estos):

```css
:root {
  --color-fondo; --color-superficie; --color-borde;
  --color-texto; --color-texto-suave;
  --color-accion;              /* teal: CTAs y foco de resultados */
  --color-inicial;             /* componente torta/barras: capital inicial */
  --color-aportes;             /* componente: aportes */
  --color-interes;             /* componente: interés (= familia del teal) */
  --color-error; --color-exito;
}
```

- Los tres colores de componente (`inicial`/`aportes`/`interes`) son idénticos
  en torta, barras, leyendas y tabla: el usuario aprende el código de color una vez.
- Temas claro y oscuro = dos mapeos de los MISMOS semánticos
  (`[data-theme="dark"]`). Respetar `prefers-color-scheme` + toggle manual.
- Tailwind consume los semánticos (colores extendidos en config → var()).
  Prohibido `#hex` o color de Tailwind directo en componentes.

## 3. Tipografía

- Display/cifras: **Lexend** (diseñada para legibilidad; encaja con la misión
  educativa) con `font-variant-numeric: tabular-nums` en toda cifra (evita
  jitter en el conteo animado y alinea la tabla).
- Cuerpo/UI: **Inter**.
- Escala contenida: una sola jerarquía de títulos (título de página, título de
  paso, label); la cifra grande es el elemento tipográfico mayor de la página
  — mayor que el propio título (la respuesta es la protagonista, no el encabezado).
- Fuentes self-hosted (woff2, subset latin) — sin requests a Google Fonts (SEO/CWV).

## 4. Movimiento (escaso y orquestado)

Exactamente TRES animaciones en toda la app:

1. **Firma — revelación del resultado**: al calcular, las barras crecen año a
   año de izquierda a derecha (~1,5 s total, easing acelerado tipo
   `cubic-bezier(0.5, 0, 0.9, 0.4)` — lento al inicio, veloz al final, como el
   interés compuesto) y la cifra grande cuenta hacia arriba sincronizada
   (mismo easing, llega junto con la última barra).
2. Colapso/expansión de secciones opcionales (150 ms).
3. Scroll suave al resultado en mobile.

Con `prefers-reduced-motion`: 1 y 3 se sustituyen por aparición/salto
instantáneos; 2 se mantiene sin transición.

## 5. Accesibilidad (piso, no aspiración)

- Contraste AA en AMBOS temas (verificar cada semántico al definir hex finales).
- Foco visible en todo elemento interactivo (outline con `--color-accion`).
- Labels reales (`<label for>`) en todos los campos; errores con
  `aria-describedby`; el toast de Compartir con `aria-live="polite"`.
- Torta con patrones además de color (daltonismo): Recharts admite `<pattern>`
  en defs; cada componente lleva color + patrón.
- Navegable 100 % por teclado; los tabs con patrón WAI-ARIA Tabs.
- La tabla anual es una `<table>` real con `<th scope>`.

## 6. Copy es diseño

Cada texto visible se especifica en docs/07 y vive en `es.json` (canónico).
Los principios de escritura (voz activa, verbos planos, errores que dicen qué
pasó y cómo seguir, estados vacíos como invitación) están aplicados ahí; los
componentes no escriben, citan.
