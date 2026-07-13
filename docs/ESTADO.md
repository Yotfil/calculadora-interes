# ESTADO.md — Bitácora viva

> Única fuente de la checklist. Se actualiza al cierre de CADA sesión.

## Próximo paso

**Release 1.1.1 cortado** (patch): tramo de **incidencias y mejoras de UI** fuera
de la checklist, ya en `dev` (PR #25 test de reemplazo, PR #27 incidencias que
absorbió el vínculo vía PR #26) → rama `release/1.1.1` desde `dev` con ÚNICAMENTE
el bump (`npm version patch` → 1.1.1; se eligió patch, no minor, para dejar el
**1.2.0 reservado al cierre de la Fase 3 / M18**) → PR `release/1.1.1 → dev` + PR
`dev → main`. Footer del build muestra **v1.1.1** (es y en, verificado). `main`
avanza por tercera vez. Contenido del release: tooltips de gráficos legibles en
oscuro, separador de miles en inputs, moneda USD visible (nota+badge+adorno),
fix de raíz del flake e2e (hidratación) y el vínculo por color Impulso↔Aporte.

Sigue la **Fase 3** con **M14 · motor modo meta** [TDD]: leer `docs/ESTADO.md` +
`docs/03` §1. Tabla de casos cerrada → TDD directo (tests primero, verlos fallar,
implementar), sin Plan Mode (CLAUDE.md §3). `core` no importa nada externo; la
métrica/despeje vive como función pura (patrón de M11).

**Deuda observada (NO de M13, heredada de M6): la cifra grande muestra centavos**
(`1.006.968,93 US$`), no dólar entero half-up como pide `docs/02` §7. Es herencia
de M6 (`CifraGrande` usa `formatMoney` con 2 decimales; F1/F2 e2e afianzan centavos).
Decidir con Jef si se corrige (tocaría F1/F2/CifraGrande, fuera del alcance de M13).

**NIT cosmético de M13 (documentado, no aplicado):** la sección "Varianza" es un
campo único (docs/07 §3 no le da `.titulo`, a diferencia de impulso/protección),
así que reusa `campos.varianza.label` como título del colapsable Y como label del
campo → el texto "Varianza de la tasa (opcional)" aparece dos veces. Arreglarlo
exigiría una clave de copy nueva (decisión de Jef); se deja como está.

**Gates humanos pendientes de Jef** (no bloquean a Claude): revisar en_US y las 5
respuestas FAQ antes de publicar; GA4 diferido (`PUBLIC_GA4_ID` vacío → analítica
off → sin aviso de cookies); crear el sitio en Netlify + DNS de helenguevara.com +
HTTPS + alta en Search Console + envío del sitemap. **Claude nunca mergea:** el
release 1.1.0 (merge dev→main) se corta tras M13.

## Checklist canónica de módulos

### Fase 1 — Básica completa y publicada (release 1.0.0)

- [x] **M1 · Setup**: Astro + React + Tailwind + Vitest + Playwright +
      eslint-plugin-boundaries + Prettier; estructura de `docs/01` §3;
      `.env.example`; script de versión en UI.
- [x] **M2 · Motor núcleo** [TDD]: tasas equivalentes, simulación mensual,
      resultado con filas anuales y totales (`docs/02` §1–3, §7).
- [x] **M3 · Validación y tipos** [TDD]: esquemas Zod, rangos y clampeos
      (`docs/02` §6), tipos compartidos core↔UI.
- [x] **M4 · i18n base**: rutas `/es/` `/en/`, diccionarios, `formatMoney`,
      redirección de raíz (`docs/07`).
- [x] **M5 · UI formulario Básica**: layout, tabs (Avanzada/Experto visibles pero
      con contenido de Fase 2 oculto), pasos 1–4, validación inline (`docs/04`).
- [x] **M6 · UI resultados**: cifra grande + frase, torta, barras, tabla,
      animación firma, temas claro/oscuro (`docs/04` §4, `docs/05`). Ejemplo
      precargado (E1/F2) diferido a M12 (E1 usa impulso de Avanzada).
- [x] **M7 · SEO + analítica**: metas, hreflang, schema.org, GA4 (`calcular`
      cableado; los otros 3 con su feature), sitemap + robots (`docs/06`).
- [x] **M8 · Deploy**: dominio real `helenguevara.com` (config/robots/e2e),
      `netlify.toml` versionado, release 1.0.0 cortado. Netlify/DNS/Search Console
      = trabajo humano de Jef.

### Fase 2 — Avanzada y Experto (release 1.1.0)

- [x] **M9 · Motor escalonado** [TDD] (`docs/02` §4): hook `aporte(t)` con
      `corte = min(N*12, duracionMeses)`; bucle intacto. E1–E4 verdes.
- [x] **M10 · Motor glide path gradual** [TDD] (`docs/02` §5): hook `tasa(t)` en
      `construirTasa(e)`; `N' = min(N, ceil(dur/12))`, bloques desde el final;
      bucle intacto. G1/G3/G4/G5 verdes (G2 → M11).
- [x] **M11 · Métricas derivadas** [TDD] (`docs/06` §1): `ahorroEscalonado`,
      `costoProteccion`, `bandaVarianza` en `src/core/metricas.ts`; funciones
      puras que re-corren `calcular`; `null` sin la sección. K1–K5/G2/V1 verdes.
- [x] **M12 · UI tab Avanzada**: sección "Impulso inicial" colapsable (Avanzada
      y Experto) + métrica de ahorro (`fijoEquivalente`/`ahorroEscalonado`) +
      "Ver un ejemplo" (E1) + `aEscenario` consciente del tab + GA4 real.
- [x] **M13 · UI tab Experto**: secciones colapsables "Protección final"
      (`aniosProteccion` + `tasaReducida`) y "Varianza" (`varianza`) en el Paso 4
      (solo Experto) + render de "costo de la protección" (G2) y "banda de
      varianza" (V1) en resultados + GA4 `con_proteccion` real. Cierra la Fase 2.

### Fase 3 — Meta, inflación y compartir (release 1.2.0)

- [ ] **M14 · Motor modo meta** [TDD] (`docs/03` §1).
- [ ] **M15 · Motor inflación** [TDD] (`docs/03` §2).
- [ ] **M16 · UI modo meta**: paso 5, campo régimen deshabilitado, copys de
      casos especiales.
- [ ] **M17 · UI toggle inflación**: transforma cifra/barras/tabla, leyenda de torta.
- [ ] **M18 · Compartir URL**: codificación, parseo tolerante, abre tab correcto.
      Release 1.2.0.

## Decisiones sobre la marcha

- **M1 · Versiones reales (jul 2026)**: Astro 7 (no 5; Vite 8, Node ≥22.12),
  Tailwind 4 vía `@tailwindcss/vite` (`@astrojs/tailwind` está deprecado),
  Vitest 4, ESLint 10 flat config, eslint-plugin-boundaries 7 (API nueva:
  `boundaries/dependencies` + `policies`).
- **M1 · Pines defensivos**: `react`/`react-dom` `^18.3.1` (latest es 19; la
  spec manda 18) y `typescript` `~5.9.3` (TS 7 es incompatible con
  typescript-eslint). No subir sin verificar peers.
- **M1 · Sin eslint-plugin-jsx-a11y**: solo soporta ESLint ≤9 y es peer
  OPCIONAL de eslint-plugin-astro; se omitió. Re-evaluar cuando soporte 10.
- **M1 · Doble candado para `core`**: boundaries cubre elemento→elemento, y
  `no-restricted-imports` (regex `^[^.]`) + `no-restricted-globals` (Date,
  window, document, fetch, localStorage) cubren externos y globals. Los tests
  de core solo pueden importar `vitest`.
- **M1 · `ui` puede importar `styles`** (extensión a la letra de `docs/01` §4,
  necesaria para imports de CSS); `pages` también.
- **M1 · Tokens con `@theme inline`** (Tailwind 4 CSS-first): las utilidades
  emiten `var(--sem-*)`, así el theming por redefinición de la capa semántica
  funciona sin recompilar.
- **M1 · E2E contra `astro preview`** (post-build), no dev server: se valida
  el HTML estático real que servirá Netlify.
- **M1 · Hook pre-commit (husky)** ejecuta `npm run lint` para materializar
  "lint en rojo bloquea commit" (CLAUDE.md §8).

- **M2 · `FilaAnual.aportado` sin capital inicial**: la torta de `docs/04` §4
  separa inicial/aportes/interés; así `Σ aportado + P = totalAportado`
  (`docs/06` §1).
- **M2 · `FilaAnual.meses`**: campo extra sobre el contrato de `docs/01` §5
  para marcar la fila parcial ("se marca", `docs/02` §2) y servir a la UI de M6.
- **M2 · `multiplicador = 0` si `totalAportado = 0`** (P=0 y aporte 0): evita
  NaN; determinista y seguro para la UI.
- **M2 · Hooks `tasa(t)`/`aporte(t)`** dentro de `calcular`: constantes en M2;
  M9/M10 solo cambian su construcción, no el bucle (orden literal de `docs/02` §2).
- **M2 · Barrel de `core` = firma pública de `docs/01` §5**: las funciones de
  tasas (`docs/02` §1) quedan internas; los tests las importan por ruta relativa.

- **M3 · Esquema Zod en `src/ui/esquema/`** (confirmado con Jef): `core` no
  puede importar zod (cero dependencias) y el esquema solo lo consumen
  formulario (M5) y URL (M18), ambos UI. Boundaries intactos.
- **M3 · Errores = claves i18n** `errores.<campo>.numero|.rango|.entero`
  (textos en M4, `docs/07`). Excepción: `aniosImpulso`/`aniosProteccion` solo
  emiten `.rango` (consecuencia de `z.literal([1..5])`; también cubre no-entero).
- **M3 · `frecuencia` con `.catch(12)`**: único campo cuyo fuera-de-rango es
  default sin error, tal cual la tabla de `docs/02` §6. `duracionUnidad`
  inválida también cae a `'a'` (docs/04 §5: param inválido → default).
- **M3 · Sección a medias se omite sin error**: `aniosImpulso` sin
  `aporteImpulso` (o viceversa; ídem protección) valida OK y `aEscenario`
  no arma la sección. No hay regla cross-field en `docs/02` §6; la UI de
  M5/M12/M13 gobierna cuándo los campos existen. 0 SÍ cuenta como presente.
- **M3 · `duracion` relativa a `duracionUnidad`** (`a`: 1–50, `m`: 1–600,
  máximo vía `superRefine` que acumula con los errores de otros campos);
  `aEscenario` convierte a la unidad canónica `duracionMeses`.

- **M4 · Shell compartido en `src/layouts/Base.astro`** (confirmado con Jef):
  head, header con selector, footer (descargo + versión) y montaje de la isla
  en un solo sitio, para que `/es/` y `/en/` no se desincronicen en M5–M7.
  Extensión anotada de la estructura de `docs/01` §3 (no listaba `layouts`):
  se añadió el elemento `layouts` a boundaries (espeja a `pages`, sin poder
  importar `pages`); core intacto.
- **M4 · Sin `i18n` nativo de Astro**: bajo SSG sin adapter querría gobernar `/`
  y el ruteo del locale por defecto, chocando con la redirección hecha a mano.
  Rutas explícitas (`pages/es/`, `pages/en/`) + redirector en `pages/index.astro`.
  Si M7 necesita `getRelativeLocaleUrl` para hreflang, se decide allí (o helper
  `rutas.ts` de 3 líneas).
- **M4 · Claves de error genéricas** (confirmado con Jef): el diccionario guarda
  `error.rango|.numero|.entero` con `{min}/{max}` (docs/07 §3), NO prosa por
  campo. Los rangos viven solo en el esquema (fuente única); duplicarlos como
  texto = deriva. El mapeo `errores.<campo>.<sufijo>` → `error.<sufijo>` +
  inyección de min/max es trabajo de M5 (ver "Próximo paso").
- **M4 · `formatMoney` mapea locale de app → variante regional de `Intl`**:
  `es`→`es-ES` (da `1.234.567,89 US$`), `en`→`en-US` (`$1,234,567.89`). USD es
  literal único en `formatMoney.ts`. La app ("es"/"en") gobierna rutas y
  diccionarios; la variante regional solo el formato numérico.
- **M4 · La isla recibe `{ locale, dict }` como props** (JSON-serializables) e
  importa `t`/`formatMoney` ella misma; nunca se pasan funciones por el
  `client:load`. Stub hasta M5, pero ya traduce (cero strings en JSX).
- **M4 · en_US redactado en M4, pendiente de revisión humana** antes del 1.0.0
  (docs/07 §4). Falta un README que lo liste como pendiente.
- **M4 · FAQ**: en M4 solo los 5 títulos de pregunta (`faq.p1..p5`); las
  respuestas (80–120 palabras) se redactan en M7 (docs/07 §5).

- **M5 · Botón Calcular solo valida** (confirmado con Jef): en M5 no llama a
  `calcular` ni renderiza; en éxito limpia errores, en error hace scroll+focus al
  primero. `aEscenario→calcular` + render son M6. Así el seam sigue la tabla de
  ruteo (M5 lee `04` §1–3, no §4).
- **M5 · `rangos` como fuente única** en `formulario.ts`: el esquema aplica los
  límites y `mapearError` (`ui/esquema/mapear-error.ts`) los interpola en la
  plantilla genérica `error.rango` (docs/07 §3). Cierra la deuda de M4. `duracion`
  es especial (`{a:{1,50}, m:{1,600}}`); su mensaje se recalcula con la unidad
  actual al renderizar, por eso el error se guarda como CLAVE del esquema, no como
  texto ya traducido.
- **M5 · Estado del formulario como strings crudos** en la isla: preservan lo
  tecleado; el esquema Zod los normaliza. Validación al blur por campo; Calcular
  valida todo. Arranca en defaults de docs/02 §6 (sin localStorage, docs/04 §3).
- **M5 · Tokens mínimos** (confirmado con Jef): solo los semánticos del formulario
  con primitivas provisionales de docs/05 §2 (incl. `--rojo-600` de error, que
  docs/05 no fija). Paleta completa + contraste AA + tema oscuro + fuentes → M6.
- **M5 · Un componente por archivo**: `Calculadora` (dueña del estado) orquesta
  `Tabs` (WAI-ARIA, flechas/Home/End), `Campo`, `CampoDuracion`, `CampoFrecuencia`
  (presentacionales puros). Los 3 tabs comparten los pasos 1–4; las secciones de
  Fase 2 se añaden en M12–M13 (docs/04 §2).

- **M6 · "Ver un ejemplo"/E1/F2 diferidos a M12** (confirmado con Jef): E1
  canónico (docs/02 §83) usa impulso escalonado, función de Avanzada inexistente
  en la Básica de Fase 1; F2 (1 006 969) es imposible aquí. El estado vacío solo
  muestra la invitación (`vacio.titulo`); la clave `vacio.cta` queda sembrada
  pero SIN usar hasta M12. El flujo demo de M6 es F1 (defaults → Calcular).
- **M6 · Tema = dos mapeos de los semánticos** (docs/05 §2): tema claro en
  `:root`, oscuro en `[data-theme="dark"]` + fallback `prefers-color-scheme`
  (salvo `[data-theme="light"]`). Script `is:inline` anti-FOUC en el head fija
  `data-theme` antes del paint (localStorage > sistema). Toggle en el header
  persiste en localStorage: el tema NO es estado de formulario, así que no viola
  la regla "sin localStorage" de docs/04 §3 (esa es solo para el form).
- **M6 · Contraste AA obligó a oscurecer dos hex del tema claro** respecto a la
  muestra de docs/05 §2: `aportes` amber #f59e0b→#d97706 (2,15→3,19 sobre blanco,
  WCAG 1.4.11 objeto gráfico) y `exito` verde #16a34a→#15803d (3,30→5,02). Además
  `accion` subió a teal-700 (#0b7c70) en claro: da 5,08 con label blanco y cierra
  el bajo contraste provisional del botón que dejó M5. El tema oscuro pasa todo.
- **M6 · Gráficos con Recharts 3.9** (docs/01 §17): torta + barras apiladas, cada
  serie con color + `<pattern>` SVG (daltonismo, docs/05 §5) definido una sola vez
  en `PatronesDefs`. Los SVG van `aria-hidden`; la `<table>` real es el
  equivalente accesible. Las 3 series (inicial/aportes/interes) comparten id de
  patrón en torta, barras, leyenda y tabla (`src/ui/series.ts`).
- **M6 · Fuentes variables, un woff2 por familia**: Google sirve Inter/Lexend
  como fuente variable; el subset latin es un solo archivo por familia declarado
  con `font-weight: 100 900`. Servidas desde `/public/fonts` con preload.
- **M6 · Animación firma repartida**: la cifra cuenta con `useContadorAnimado`
  (rAF + cubic-bezier(0.5,0,0.9,0.4) exacto por Newton-Raphson); las barras usan
  el preset Recharts más cercano (`ease-in`), porque Recharts no acepta bezier
  custom. `prefers-reduced-motion` → sin animación y scroll instantáneo; la cifra
  se calcula client-side, tras el click, sin riesgo de mismatch de hidratación.
- **M6 · Composición**: torta = inicial(P) + aportes(totalAportado−P) +
  interes(interesTotal) = balanceFinal; barras acumuladas P+Σaportado+Σinteres =
  balance del año (`FilaAnual.aportado` NO incluye P, decisión de M2).

- **M7 · `analytics` ya venía sembrado**: M1 dejó el elemento `analytics` en
  boundaries (ui→analytics) y `PUBLIC_GA4_ID` en `env.d.ts`; M7 solo creó
  `track.ts`. `no-restricted-globals` está acotado a `src/core/**`, así que
  `track` usa `window.gtag` sin excepción extra. No hizo falta tocar la config.
- **M7 · `track` con mapa de eventos tipado**: `track(evento, params)` sobre una
  interfaz `Eventos` (los 4 nombres de docs/06 §2). No-op por retorno temprano si
  `PUBLIC_GA4_ID` vacío, ANTES de tocar `window` (seguro en Node/tests). Solo
  `calcular` se dispara en Fase 1; `con_impulso`/`con_proteccion` van `false`
  fijos (sus secciones son M12/M13). `tab` se mapea basica/avanzada/experto→b/a/e.
- **M7 · Sitemap con `@astrojs/sitemap`** (confirmado con Jef): i18n
  `defaultLocale:'en'` (x-default→/en/), `filter` excluye la raíz `/`. El hreflang
  recíproco del `<head>` lo emite `Seo.astro` (canonical self + es/en/x-default),
  no el sitemap. `site` es PLACEHOLDER hasta M8, duplicado en config y robots.txt.
- **M7 · Snippet gtag con rest params**: dentro de `define:vars` el bootstrap usa
  `function(...args){ dataLayer.push(args) }` en vez de `arguments` (regla lint
  `prefer-rest-params`); gtag.js consume las entradas de `dataLayer` por
  índice/length, así que es equivalente. Solo se inyecta con ID presente.
- **M7 · FAQ estática fuera de la isla**: `Faq.astro` (server-only, 0 JS) al pie
  del shell. El copy educativo de campos YA se indexa porque Astro SSR-ea la isla
  `client:load` (verificado en el HTML de build). Respuestas `faq.r1..r5` (80–120
  palabras) redactadas en M7 (docs/07 §5), pendientes de revisión humana; R3 cita
  el ahorro del ejemplo ("~40.000", ≈ K2 39.616,90 de docs/06 §1).
- **M7 · Raíz `/` con `noindex`** (hallazgo de la revisión de cierre): el
  redirector fino se excluye del sitemap y además lleva `<meta robots noindex>`
  por si un crawler sin JS lo alcanza; SIN canonical para no mezclar señales.

- **M9 · Hook `aporte(t)` en `construirAporte(e)`**: función pura junto a
  `calcular` que devuelve el aporte por mes. Sin `impulso` → régimen constante
  (comportamiento idéntico a M2). Con `impulso` → `X` mientras `t ≤ corte`,
  luego régimen; `corte = min(anios*12, duracionMeses)` (el `min` ES el clampeo
  del borde 2 de `docs/02` §4). El bucle de `calcular` no cambió: solo se
  sustituyó la línea inline de `aporte` por la llamada (decisión M2 al pie de la
  letra). `t ≤ corte` (no `<`): con N=2/30m da meses 1–24 con X (borde 3).

- **M10 · Hook `tasa(t)` en `construirTasa(e)`**: función pura junto a `calcular`
  (espeja a `construirAporte`). Sin `proteccion` → `() => iMes` constante
  (idéntico a M2). Con `proteccion` → escalera de `docs/02` §5 literal:
  `bloques (N') = min(anios, ceil(dur/12))`, `inicioProt = dur − N'*12`; para
  `t > inicioProt`, `j = ceil((dur − t + 1)/12)` (bloque DESDE EL FINAL, 1 = último),
  `k = N' − j + 1`, `r_k = principal − (principal − reducida)*k/N'`, y
  `tasa(t) = tasaMensualEquivalente(r_k, frecuencia)` (conversión ÚNICA, misma
  convención §1). El bucle no cambió. `construirTasa`/`construirAporte` son
  independientes → impulso y protección conviven sin regla de conflicto (borde 5,
  G1 usa ambos). `construirTasa` queda interna (no se exporta: barrel = firma
  pública, decisión M2); la escalera se fija por balance final, que ya discrimina
  la trampa "desde el final" (G5 = 3 227,53 solo sale contando desde el final).

- **M11 · Las 3 métricas viven en `core` como funciones puras, `calcular`
  intacto** (confirmado con Jef): `ahorroEscalonado`/`costoProteccion`/
  `bandaVarianza` en `src/core/metricas.ts`, exportadas del barrel. Re-corren
  `calcular` con escenarios modificados (patrón "compara dos corridas"); no tocan
  el bucle. `calcular` NO llena `Resultado.banda` (una sola responsabilidad): la
  UI la ensambla con `bandaVarianza(e)`. El tipo `Banda` se extrajo de `Resultado`
  a un tipo nombrado y exportable.
- **M11 · Guarda `null` cuando falta la sección** (confirmado con Jef): ahorro sin
  `impulso` → `null`; costo sin `proteccion` → `null`; banda sin `varianza` o
  `v ≤ 0` → `null`. La UI decide si renderizar. `number | null` / `Banda | null`.
- **M11 · Ahorro = fijo equivalente por linealidad**: como el balance es lineal en
  los aportes bajo senda de tasa fija, `F = (balanceEscalonado − FV(solo capital))
/ FV(aporte 1/mes)` con AMBOS FV corridos SIN impulso (misma senda), y
  `ahorro = F·M − Σaportes`, `M = duracionMeses`, `Σaportes = totalAportado −
capitalInicial`. K1 F=668,06 / K2 ahorro=39 616,90.
- **M11 · La varianza desplaza SOLO la principal**: basta correr `calcular` con
  `tasaNominalAnual ∓v/±v` porque `construirTasa` deriva los bloques del glide de
  la principal sin tocar `tasaReducida` (docs/02 §8: la varianza modela
  incertidumbre, no la decisión de protección). Nominal recortado a [0,100]
  (docs/02 §6): 0,5 %−1 → 0 %; 99,5 %+1 → 100 %. Un test con glide fija que la
  reducida queda intacta (si la contaminara, el superior cambiaría).
- **M11 · G2 (costo de la protección) resuelto aquí**, no en M10: es métrica
  derivada (compara dos `Resultado`), no motor. `costoProteccion(G1) = 137 928,15
= E1 − G1`.

- **M12 · `fijoEquivalente` como métrica pura del core** (confirmado con Jef): el
  copy `metricas.ahorro` (docs/07 §4) necesita DOS cifras, `{fijo}` (F=668,06, K1) y
  `{ahorro}` (39 616,90, K2). Se extrajo F a `fijoEquivalente(e)` en
  `src/core/metricas.ts` (función pura, `null` sin impulso) y `ahorroEscalonado` la
  reusa (`F·M − Σaportes`; K2 intacto). El core es dueño del número; la UI solo
  formatea. Se descartó derivar F en la UI (acoplaría la fórmula inversa a
  presentación, contra la cultura "anclas numéricas en tests del core").
- **M12 · Impulso en Avanzada Y Experto** (confirmado con Jef): docs/04 §1 lo pone
  en ambos tabs; se renderiza cuando `tab !== "basica"`. `aEscenario(valores, tab)`
  ahora gatea las secciones por tab (docs/04 §2): impulso en Avanzada/Experto,
  protección y varianza SOLO en Experto (su UI es M13, pero el gateo ya queda
  completo). Es el candado del flujo F3: Básica ignora las secciones aunque los
  valores persistan (nunca se borran solos). Tipo `Tab` en `src/ui/tab.ts`.
- **M12 · `SeccionColapsable` reutilizable**: botón `aria-expanded`/`aria-controls`
  - `role=region`; anima la altura 150 ms (docs/05 §4.2) con el truco grid-rows
    0fr↔1fr y `motion-reduce` para reduced-motion. El contenido cerrado se marca
    `inert` vía DOM (no tipado en el JSX de React 18) para sacarlo del tab-order y del
    árbol accesible sin perder la animación. La usará M13 para sus secciones.
- **M12 · Avisos de sección** (docs/07 §3, nunca errores): "incompleta" con XOR de
  los dos campos (uno lleno, otro vacío → la sección no se aplica); "clampeada"
  cuando `anios*12 ≥ duracionMeses` (borde 2 de docs/02 §4). Excluyentes por
  construcción; se muestran dentro de la sección (solo con ella expandida).
- **M12 · GA4 `con_impulso`/`con_proteccion` reales**: leen `escenario.impulso/
proteccion !== undefined` del MISMO escenario que entra al motor (no hardcode).
  Protección sale off hasta que M13 la haga tecleable. Cerró la deuda de M7.
- **M12 · `conNegritas` extraído a `src/ui/negritas.tsx`**: lo comparten
  `FraseResumen` y la métrica de ahorro (`Resultado`). La ruta de éxito de Calcular
  se extrajo a `pintar(datos, tab)` (tab explícito, `setTab` es asíncrono) y la
  comparten el botón Calcular y "Ver un ejemplo" (`cargarEjemplo`, E1: sube
  Básica→Avanzada para que el impulso aplique; en Experto se queda).

- **M13 · Puro UI, patrón de Impulso replicado**: las dos secciones colapsables
  del Paso 4 (`SeccionColapsable id="seccion-proteccion"`/`"seccion-varianza"`,
  solo `tab === "experto"`) y sus avisos espejan a Impulso. `avisoProteccion`:
  `seccion.incompleta` (XOR de `aniosProteccion`/`tasaReducida`),
  `seccion.clampeada.proteccion` (`anios*12 ≥ duracionMeses`). Varianza es campo
  único: sin aviso. El core (métricas), el esquema (3 campos) y `aEscenario`
  (gateo a Experto) ya existían; M13 no los tocó.
- **M13 · `EJEMPLO_E1` debe llevar TODAS las claves** (`aniosProteccion`/
  `tasaReducida`/`varianza` en `""`): `setValores` reemplaza el objeto entero y
  la UI de Experto lee `valores.aniosProteccion.trim()` en `avisoProteccion`. Sin
  las claves vacías, "Ver un ejemplo" en Experto crasheaba el render (undefined.trim).
  Mismo cuidado con cualquier preset futuro (URL de M18).
- **M13 · `{tasa}`/`{v}` de la banda son porcentaje, no dinero**: se formatean con
  `Intl.NumberFormat(localeIntl(locale))` (mismo patrón que `{mult}` de
  `FraseResumen`), nunca con `formatMoney` (que lleva `US$`). `costo` e
  `inferior`/`superior` sí van por `formatMoney`. Se pasan a `Resultado` los
  escalares `aniosProteccion` (`{n}`), `tasa`, `varianza` además de `costo`/`banda`.
- **M13 · GA4 `con_proteccion` ya es real** sin cambios de cableado: `pintar` leía
  `escenario.proteccion !== undefined` desde M12; hacer los campos tecleables lo
  activó. Cerró la deuda de M7/M12.

- **Incidencias UI (2026-07-13) · Miles solo en presentación**: los inputs de
  dinero (`capitalInicial`/`aporteRegimen`/`aporteImpulso`; `meta` lo hereda en
  M16) muestran separador de miles del locale vía `src/ui/miles.ts`
  (`agruparMiles`/`desagruparMiles` + preservación de cursor en `Campo`). El
  estado del formulario y el esquema Zod siguen recibiendo el string CRUDO
  canónico (dígitos + `.` decimal): la decisión de M5 no cambió. A diferencia de
  `Intl` es-ES, se agrupa también el entero de 4 cifras (1000 → "1.000", pedido
  de Jef).
- **Incidencias UI (2026-07-13) · Moneda USD visible** (decisión de Jef: las 3
  señales a la vez): claves nuevas `moneda.codigo|nota|tooltip` (docs/07 §2–3),
  nota sobre el Paso 1, badge en el header y adorno tipo SELECT DESHABILITADO
  junto a los inputs de dinero con tooltip custom en hover ("en el futuro podrás
  elegir otras monedas", anticipa el selector real). `moneda.codigo` ("USD") es
  idéntico en es/en a propósito: quedó EXENTO en el test de paridad (como los
  endónimos `idioma.*`). El literal de FORMATEO sigue solo en `formatMoney`.
- **Incidencias UI (2026-07-13) · Flake e2e resuelto de raíz**: la isla expone
  `data-hidratada` en su primer efecto y el helper `abrir()` de `e2e/util.ts` lo
  espera tras navegar. TODO spec que interactúe con la isla (fill/click) debe
  usar `abrir`, no `page.goto` directo: una interacción pre-hidratación se
  pierde (y con miles, un re-fill del MISMO texto ni siquiera dispara `input`).
  Con esto la suite completa pasó 3 corridas consecutivas sin flakes.
- **Incidencias UI (2026-07-13) · Tooltips de Recharts con tokens**: estilos
  compartidos en `src/ui/tooltipEstilos.ts` (torta y barras); el default de
  Recharts (blanco) era ilegible en oscuro. Cualquier gráfico futuro debe
  reusar ese módulo.
- **Vínculo Impulso↔Aporte (2026-07-13) · Color = variante de texto del token
  aportes**: el `--sem-aportes` está tuneado como objeto gráfico (≥3) y NO llega
  a 4.5 como texto; se añadió `--sem-aportes-texto` (ámbar-700 #b45309 claro,
  4.54:1 ✓ / ámbar-300 oscuro). Jef propuso #ec9b52 pero da 2.03:1 sobre el
  fondo claro → descartado para texto. Reusa el color que YA significa "aportes".
- **Vínculo Impulso↔Aporte · Markup de realce `[[ ]]`**: `conRealce`
  (`src/ui/realce.tsx`, espeja a `conNegritas`) envuelve tramos en un `<span>`
  con la clase de acento. El copy de docs/07 usa `[[ ]]` para el color, `**` para
  negrita (dos markups distintos, dos renderers). `Campo` pasa SIEMPRE la ayuda
  por `conRealce` (no-op sin markup).
- **Vínculo Impulso↔Aporte · Copy dinámico gateado a "impulso aplica"**: las
  ayudas con N (`campos.*.ayudaImpulso`) solo se muestran cuando el impulso
  aplica de verdad (ambos campos + `anios*12 < duracionMeses`, mismo criterio
  que el aviso "clampeada" pero negado). Si solo están los años → copy base (lo
  cubre el aviso "incompleta"). `periodo` pluraliza por `N===1`
  (`campos.impulso.periodo.singular|plural`). `{aporte}` se interpola con el
  label de `aporteRegimen` (fuente única del literal). El label de aporteRegimen
  se tiñe con `resaltarLabel` = `tab !== "basica" && impulsoAbierto`.

- El caché global de npm (`~/.npm/_cacache`) tiene archivos propiedad de
  `root` en esta máquina y algunos installs fallan con EACCES/EEXIST.
  Arreglo permanente: `sudo chown -R $(whoami) ~/.npm`. Workaround usado en
  M1: `npm_config_cache` apuntando a un caché alternativo.

- El motor NO redondea dentro de la iteración; solo la capa de presentación
  redondea. Redondear adentro rompe las anclas de `docs/02`.
- **Deuda (herencia de M6, detectada en M12):** `docs/02` §7 pide la cifra grande
  a **dólar entero** (half-up), pero `CifraGrande` usa `formatMoney` (2 decimales)
  y F1/F2 e2e afianzan centavos (`1.006.968,93 US$`). Corregirlo tocaría
  `CifraGrande` + F1/F2; pendiente de decisión con Jef (no es de M12).
- La tasa reducida del glide usa la MISMA convención (nominal + selector) que
  la principal; no convertirla dos veces.
- `Intl.NumberFormat` difiere entre Node y navegador en espacios no separables:
  en asserts de e2e comparar con `\u00A0` normalizado.
- Los bloques del glide se cuentan DESDE EL FINAL (`docs/02` §5); contarlos
  desde el inicio de la protección da otra escalera en duraciones no múltiplo de 12.

- `Number("") === 0` en JS: NO usar `z.coerce.number()` directo para campos de
  formulario/URL — un input vacío se volvería 0 en vez de default. El esquema
  neutraliza esto con el preprocess `aNumero` ("", null y " " → ausente).
- El param URL `dur` es SIEMPRE en meses y `durU` es solo para el radio
  (`docs/04` §5): M18 no debe mapear `durU` → `duracionUnidad` al validar
  (`dur=120&durU=a` fallaría el rango 1–50). Validar `dur` con unidad `'m'`
  y usar `durU` únicamente para el estado del radio.

- En `calcular`, `interesMes = balance * tasa(t)` (para la fila) y
  `balance = balance * (1 + tasa(t)) + aporte` no son bit-idénticos en float64:
  `Σ filas.interes` puede diferir de `interesTotal` por ULPs (muy por debajo de
  ±0,01). No comparar esas dos cifras con igualdad estricta.

- `Intl` en `es-ES` NO agrupa los enteros de 4 cifras: `formatMoney(1000,"es")`
  → `"1000,00 US$"` (sin punto de miles), pero `10000` sí → `"10.000,00 US$"`.
  Es convención de es (min. grouping digits); en tests de dinero usar valores de
  ≥5 cifras si se quiere ver el separador de miles.
- El separador entre número y `US$` en `es-ES` es U+00A0 (NBSP), no espacio
  normal (confirmado en esta máquina). En asserts, normalizar `[  ]`
  → espacio (ya lo hace `formatMoney.test.ts`). Mismo cuidado en e2e de M6.
- El placeholder del copy lleva acentos (`{años}`): la interpolación de `t` usa
  `\{([^}]+)\}`, no `\w` (que excluye `ñ/á`). No volver a `\w`.
- `mapearError` interpola min/max SIN formato de miles: `capitalInicial` da
  "Ingresa un valor entre 0 y 100000000." La plantilla `error.rango` (docs/07 §3)
  es genérica y estos límites son conteos, no dinero; si M6 quisiera separadores
  habría que decidir formato (no usar `formatMoney`, que lleva `US$`).
- El hook pre-commit corre `eslint .` sobre TODO el árbol, no solo lo staged: no
  se puede commitear en un orden que deje `src/layouts/` sin su elemento de
  boundaries (daría "unknown element"). Config de boundaries primero.

- El e2e reusa un servidor ya escuchando en el puerto 4321
  (`reuseExistingServer: !CI`). Un `astro preview`/`dev` viejo sirviendo un build
  anterior produce fallos FANTASMA de hidratación (la isla no reacciona; el form
  hace submit GET nativo y recarga con `?duracionUnidad=a`). Tras cambios de
  build, `lsof -ti:4321 | xargs kill -9` antes de correr el e2e.
- Los `<input>` de `Campo` NO tienen atributo `name` (el estado vive en React):
  un submit nativo solo serializaría el radio `duracionUnidad`. Por eso, si la
  isla no hidrata, el síntoma es una navegación GET a `?duracionUnidad=a`.
- Recharts pesa: la isla quedó en ~169 KB gzip (tope 200 KB, docs/06 §3). Cada
  añadido de Fase 2 debe medirse contra ese margen. Tras M7 sigue en 165,8 KB
  (gtag.js es script externo async, no entra al bundle; el wrapper `track` pesa
  bytes).
- El dominio de producción se espeja en TRES sitios, no dos: `site` de
  `astro.config.mjs`, la línea `Sitemap:` de `public/robots.txt` Y la constante
  `SITE` de `e2e/seo.spec.ts` (canonical/hreflang son absolutos, el e2e los
  compara contra ese host, no contra `localhost:4321`). Cambiar el dominio en solo
  dos rompe 3 tests de `seo.spec.ts`.
- Netlify no tiene el Node correcto por default: Astro 7 exige ≥22.12 y el repo no
  tiene `engines`/`.nvmrc`. El pin vive en `netlify.toml` (`NODE_VERSION = "22"`);
  sin él el build de Netlify podría fallar.
- `npm version minor` desde `0.1.0` da `0.2.0`, NO `1.0.0`. Para el release de
  lanzamiento se usó `npm version 1.0.0` explícito (la regla §6 "minor = features"
  no aplica al primer salto a 1.0.0). Los futuros releases sí siguen minor/patch.

- `npm run format` (`prettier --write .`) reformatea TODO el árbol; en dev había
  archivos no prettier-clean, así que ensució el diff de M7 con reflow ajeno
  (core, esquema, tests). Se revirtieron con `git checkout dev -- <archivos>`.
  Formatear SOLO los archivos tocados (`prettier --write <ruta>`), no todo el repo.

## Historial de sesiones

- **2026-07-13 · Release 1.1.1 (patch)** ✅. Corte del tramo de incidencias +
  mejoras de UI (ver dos entradas siguientes). Merges del día: PR #25 (test de
  reemplazo → dev), PR #26 (vínculo → rama de incidencias, stack), PR #27
  (incidencias+vínculo → dev). Ramas sincronizadas. Rama `release/1.1.1` desde
  `dev` con SOLO el bump (`npm version patch` → 1.1.1; **patch** por decisión de
  Jef, para reservar 1.2.0 al cierre de Fase 3/M18). `dev` verde antes del corte
  (lint, 184 unit, build). Footer del build en **v1.1.1** (es+en) verificado.
  Entregados PRs `release/1.1.1 → dev` y `dev → main`; **Claude no mergea**.
  Netlify auto-despliega al avanzar `main` (config `netlify.toml`); conectar el
  sitio + DNS sigue siendo gate humano de Jef si no se hizo en releases previos.
- **2026-07-13 · Extra (post-1.1.0) — Vínculo Impulso ↔ Aporte mensual** ✅. Rama
  `feature/vinculo-impulso-aporte` (5 commits granulares, STACK sobre
  `feature/incidencias-ui-usd-miles` porque comparten `Campo.tsx` y el copy del
  impulso; se mergea DESPUÉS de esa). Plan Mode + 2 decisiones de Jef (color =
  variante de texto del token `aportes`, NO su #ec9b52 que da 2.03:1; copy
  dinámico solo cuando el impulso aplica de verdad). Problema: usuarios no captan
  que el impulso REEMPLAZA el aporte (no suma). Solución: color compartido (label
  de Aporte mensual + referencia en la ayuda del impulso se tiñen al expandir la
  sección) y copy dinámico que nombra los años reales (N) con el fragmento
  resaltado. Commits: (1) token `--sem-aportes-texto`; (2) `conRealce`
  (`realce.tsx`) + test; (3) `Campo` pasa la ayuda por `conRealce` + prop
  `resaltarLabel`; (4) copy (`ayudaImpulso`/`periodo` es+en) + cableado en
  `Calculadora` + docs/07; (5) e2e. 183 unit (+3 `conRealce`) + 47 e2e (+1) verdes,
  lint + build verdes. Verificación visual claro/oscuro/es/en (ámbar-700 legible
  en claro, 4.54:1; singular "el primer año"/"the first year" en N=1). Revisión de
  diff con subagente fresco (contraste verificado numéricamente; `src/core/`
  intocado): sin bloqueantes. Su único accionable se aplicó (plegado por
  `--fixup`): el copy dinámico del Aporte mensual (que vive FUERA del colapsable)
  persistía al COLAPSAR la sección → se gateó `impulsoActivo` también a
  `impulsoAbierto`, así las señales del vínculo aparecen/desaparecen juntas
  (+e2e del caso colapsar-con-valores). Sus 2 NITs (unit test de `conRealce`
  valida el mecanismo no el token — cubierto por e2e; markup desbalanceado
  degrada sin romper, igual que `conNegritas`) no requieren acción. `main` no
  avanza (esto va a dev; release 1.2.0 tras M18).
- **2026-07-13 · Extra (post-1.1.0) — Incidencias y mejoras de UI** ✅. Rama
  `feature/incidencias-ui-usd-miles` (4 commits granulares sobre `dev`). Trabajo
  NO planeado fuera de la checklist (pedido de Jef antes de M14). Commits:
  (1) tooltips de Recharts (torta+barras) con tokens vía `tooltipEstilos.ts`
  compartido — el default blanco era ilegible en oscuro; (2) fix de raíz del
  flake e2e: `data-hidratada` en la isla + helper `abrir()` (`e2e/util.ts`) que
  los specs interactivos usan en vez de `goto` — 3 corridas completas seguidas
  sin flakes (antes 1–2 fallos fantasma por corrida); (3) separador de miles en
  inputs de dinero (`src/ui/miles.ts` + máscara en `Campo` con preservación de
  cursor; crudo canónico intacto para el esquema, decisión de M5 sin cambios);
  (4) moneda USD visible: nota sobre Paso 1 + badge header + adorno
  select-deshabilitado con tooltip custom (claves `moneda.*`, docs/07
  actualizado; exención de `moneda.codigo` en el parity-test). Plan Mode +
  3 decisiones de Jef (las 3 señales de moneda a la vez; adorno como select
  deshabilitado con tooltip "próximamente otras monedas"; agrupar también los
  enteros de 4 cifras a diferencia de `Intl` es-ES). 180 unit (+11 de miles,
  +exención parity) + 46 e2e (+3: moneda/adorno/tooltip en hover, valores
  agrupados, "." tecleado). Verificación visual claro/oscuro con screenshots
  (tooltips, badge, nota, adornos; estilos computados del tooltip en oscuro).
  Revisión de diff con subagente fresco contra docs/02 §6, 05 §2 y 07 §2–3
  (fuzz de 20 000 casos de ida-vuelta en `miles.ts` contra el `aNumero` real;
  SSR de `useLayoutEffect` reproducido con React 18.3.1): sin bloqueantes; sus
  3 accionables se verificaron y aplicaron plegados por `--fixup`+autosquash
  — (a) "." TECLEADO en es se trataba como millar y corrompía el monto ×100 →
  ahora separador tecleado = decimal del locale (e2e nuevo lo fija); (b) alias
  isomórfico `useEfectoCaret` (el warning SSR de `useLayoutEffect` aparecía en
  cada render de `Campo` en dev); (c) Supr sobre un separador dejaba el caret
  "atascado" → salto de caret. Su NIT de estilos (radio 4px + sombra `shadow-md`
  en el tooltip de Recharts) también se aplicó; sus NITs de a11y (aria-label
  verboso del adorno; tooltip no alcanzable por teclado/táctil) quedan
  documentados como mitigados por la `nota-moneda` visible. `main` no avanza
  (esto va a dev; el release 1.2.0 es tras M18).
- **2026-07-12 · Sesión 13 — M13 UI tab Experto** ✅. Rama
  `feature/modulo-13-ui-experto` (3 commits granulares sobre `dev`). Tarea
  estructural multi-archivo (Plan Mode + confirmación de alcance con Jef).
  **Hallazgo confirmado en la apertura: M13 es puro UI** — core (métricas M11),
  esquema (3 campos M3), `aEscenario` (gateo a Experto M12) e i18n ya listos y
  verdes; solo faltaban los campos/secciones del formulario y el render de las
  métricas. Commits: (1) secciones colapsables "Protección final" + "Varianza" en
  el Paso 4 (solo Experto), avisos incompleta/clampeada, orden de foco + auto-apertura
  al error, `EJEMPLO_E1` con las 3 claves vacías (bug de crash descubierto por el
  e2e: `undefined.trim()` en `avisoProteccion` al "Ver un ejemplo" en Experto;
  plegado al commit 1 vía `--fixup` + autosquash); (2) render de "costo de la
  protección" y "banda de varianza" en `Resultado` (`pintar` deriva `costoProteccion`/
  `bandaVarianza` del mismo escenario; `{tasa}`/`{v}` como porcentaje vía Intl, no
  `formatMoney`) + GA4 `con_proteccion` real; (3) e2e `experto.spec.ts`. 169 unit
  (sin cambios: el core ya cubría G2/V1) + 43 e2e (+4: costo G2=137 928,15, banda
  V1=[564 955,36 ; 816 454,87], Básica ignora la protección + persistencia, avisos
  incompleta/clampeada), lint + build verdes. **Trampa e2e:** con `tab-experto` +
  `ver-ejemplo` seguidos, `cargarEjemplo` puede leer el `tab` previo (commit de
  React aún no propagado) y saltar a Avanzada → se espera `aria-selected="true"`
  de Experto antes de "Ver un ejemplo". Verificación visual claro/oscuro con
  screenshots (dos secciones expandidas + tres cajas de métrica, contraste AA).
  Revisión de diff con subagente fresco contra docs/04 §1–4/§6, 05, 06 §1–2 y 07
  §3–4: sin bloqueantes ni accionables; verificó copy canónico, tokens semánticos,
  moneda vía `formatMoney`, gateo de métricas a Experto y GA4. Su único NIT (texto
  de "Varianza" duplicado por ser campo único sin `.titulo`) es coherente con la
  spec → documentado, no aplicado (exigiría clave de copy nueva, decisión de Jef).
  **Trampa flaky confirmada de nuevo:** F4 (M5) falla en la suite completa
  (hidratación fantasma del preview), pasa aislado → no es de M13. **Release 1.1.0
  cortado** tras M13: PR #21 (feature→dev), PR #22 (`release/1.1.0 → dev`, solo el
  bump `npm version minor` → 1.1.0) y PR #23 (`dev → main`). `main` en v1.1.0
  (footer verificado). Cierra la Fase 2.
- **2026-07-12 · Sesión 12 — M12 UI tab Avanzada** ✅. Rama
  `feature/modulo-12-ui-avanzada` (7 commits granulares sobre `dev`). Tarea
  estructural multi-archivo; confirmadas 2 decisiones con Jef antes de codear:
  (1) `{fijo}` de la métrica → nueva función pura `fijoEquivalente` en el core
  (TDD, K1=668,06), no derivada en la UI; (2) impulso en Avanzada **Y** Experto
  (no solo Avanzada). Commits: (1) core `fijoEquivalente` + `ahorroEscalonado`
  refactorizada para reusarla (K2 intacto); (2) extraer `conNegritas` a
  `src/ui/negritas.tsx`; (3) `aEscenario(valores, tab)` gatea secciones por tab
  (impulso en a/e; protección/varianza solo e) + tipo `Tab`; (4) `SeccionColapsable`
  (aria + `inert` + animación grid-rows 150 ms) + sección Impulso en el Paso 2
  (tab≠básica) con avisos incompleta/clampeada; (5) métrica `metricas.ahorro` en
  `Resultado` (solo con impulso) + GA4 `con_impulso`/`con_proteccion` reales;
  (6) "Ver un ejemplo" (`cargarEjemplo` E1, `pintar` compartido); (7) e2e
  `avanzada.spec`. 170 unit (+1: K1 `fijoEquivalente` + contrato con `ahorroEscalonado`
  - guarda null; los tests de `aEscenario` migrados a pasar `tab` + 3 casos de gateo)
  - 39 e2e (+3: F2 ejemplo→1 006 968,93 con métrica 668,06/39 616,90, Básica ignora
    impulso + persistencia, avisos incompleta/clampeada), lint + build verdes.
    Verificación visual claro/oscuro con screenshots (cifra, sección expandida, caja
    de métrica, tabla con impulso años 1–5). Revisión de diff con subagente fresco
    contra docs/04 §1–4/§6, 06 §1–2, 07 §3–4 y 02 §4: reimplementó el motor en Python
    y reprodujo K1/K2/E1/ref-Básica al centavo; sin bloqueantes ni accionables. Sus 2
    NITs (foco a campo de impulso con la sección cerrada por timing de `inert`;
    acoplamiento cosmético de `valores.aniosImpulso`) quedan como camino inalcanzable
    con degradación elegante (la sección se abre y hace scroll) → no aplicados,
    documentados. **Trampa flaky confirmada:** F4 (M5) falla intermitente SOLO en la
    suite completa (hidratación fantasma del preview recién construido, ESTADO); pasa
    aislado y en re-corridas → no es de M12. **Deuda detectada (M6, no M12):** la
    cifra grande muestra centavos, no dólar entero (docs/02 §7) — anotada arriba.
    `main` sigue sin avanzar (el release 1.1.0 es tras M13).
- **2026-07-12 · Sesión 11 — M11 Métricas derivadas** ✅. Rama
  `feature/modulo-11-metricas-derivadas` (2 commits granulares sobre `dev`: extraer
  tipo `Banda` + feat de métricas). TDD directo (tablas cerradas `docs/06` §1, sin
  Plan Mode). Decisión con Jef: las 3 métricas viven en `src/core/metricas.ts` como
  funciones puras que re-corren `calcular` con escenarios modificados, `calcular`
  INTACTO (una sola responsabilidad; la UI ensambla `banda` sobre `Resultado`);
  devuelven `null` sin la sección requerida. Anclas fijadas corriendo la
  implementación de referencia (`calcular`, ya validada por N1–G5): `ahorroEscalonado`
  K1 F=668,06 / K2 39 616,90; `costoProteccion` K3/G2 137 928,15 (E1−G1, diferido de
  M10); `bandaVarianza` V1 [564 955,36 ; 816 454,87]. Tests primero, rojo verificado
  (módulo inexistente), luego implementación. 165 unit verdes (+14: K1–K5, G2, V1,
  clips [0,100] inferior y superior, guardas null, glide-no-contamina-reducida),
  lint verde. Revisión de diff con subagente fresco contra `docs/06` §1 y `docs/02`
  §3–8: reimplementó el motor en Python y reprodujo las 11 anclas al centavo; sin
  bloqueantes. Su único accionable (falta el test del recorte SUPERIOR a 100, solo
  estaba el inferior a 0) se aplicó (`tasa 99,5 % + v=1 → 100 %`); su NIT (comentario
  de `recortar` documentaba solo el borde inferior) también. `main` sigue sin avanzar
  (el release 1.1.0 es tras M13).
- **2026-07-12 · Sesión 10 — M10 Motor glide path gradual (protección final)** ✅.
  Rama `feature/modulo-10-motor-glide` (1 commit sobre `dev`). TDD directo (tabla
  cerrada §5, sin Plan Mode): tests G1/G3/G4/G5 primero, rojo verificado (los 4
  fallan; la protección se ignoraba), luego implementación. G2 (costo de la
  protección) diferido a M11 por acuerdo con Jef (es métrica derivada, no motor).
  El glide se implementó como `construirTasa(e)` (función pura junto a `calcular`,
  espeja a `construirAporte`): arma el hook `tasa(t)` con la escalera de §5
  (bloques DESDE EL FINAL, `N' = min(anios, ceil(dur/12))`, reducida convertida
  una sola vez con la misma convención §1). El bucle de `calcular` NO cambió (solo
  la línea inline de `tasa` → llamada; decisión M2). 151 unit verdes (+4: G1
  869 040,78 con impulso+protección convivientes / G3 43 579,79 / G4 clampeo
  16 136,34 / G5 no múltiplo 3 227,53), lint verde. Diff mínimo aditivo. Revisión
  de diff con subagente fresco contra `docs/02` §5: reimplementó el motor en
  Python y reprodujo los 4 números al centavo; sin bloqueantes ni accionables
  críticos. Su único accionable era OPCIONAL (test que fije la partición de
  bloques) → no aplicado: exigiría exportar `construirTasa` (rompe barrel = firma
  pública) o asserts frágiles, y el balance final ya discrimina la trampa "desde
  el final". `main` sigue sin avanzar (el release 1.1.0 es tras M13).
- **2026-07-12 · Sesión 9 — M9 Motor escalonado (impulso inicial)** ✅. Rama
  `feature/modulo-09-motor-escalonado` (1 commit sobre `dev`). Arranca la Fase 2.
  TDD directo (tabla de casos cerrada, sin Plan Mode): tests E1–E4 primero, rojo
  verificado (E1/E2/E4 fallan, E3 pasa por no usar impulso), luego implementación.
  El impulso se implementó como `construirAporte(e)` (función pura junto a
  `calcular`) que arma el hook `aporte(t)`: `corte = min(anios*12, duracionMeses)`,
  `aporte = X si t ≤ corte, régimen si no`. El bucle de `calcular` NO cambió (solo
  la línea inline de `aporte` → llamada; decisión M2). 147 unit verdes (+5: E1–E4
  de `docs/02` §4 con números exactos 1 006 968,93 / 7 099,81 / 677 839,48 /
  20 890,91, más un borde 4 con X=0), lint verde. Diff mínimo aditivo: se evitó
  `prettier --write` sobre los archivos (reflujo ajeno de bloques preexistentes,
  trampa de M7) → los archivos no quedan prettier-clean pero el candado real es
  eslint. Revisión de diff con subagente fresco contra `docs/02` §4: sin
  bloqueantes; reimplementó el motor desde la spec y confirmó los 4 números
  exactos, el corte sin off-by-one (`t ≤ corte`) y el bucle/boundaries intactos.
  Sus 2 NITs se aplicaron (comentario de cabecera §2–3 → §2–4; test dedicado del
  borde 4 con X=0). `main` sigue sin avanzar (el release 1.1.0 es tras M13).
- **2026-07-12 · Sesión 8 — M8 Deploy + release 1.0.0** ✅. Rama
  `feature/modulo-08-deploy` (2 commits) + `release/1.0.0` (1 commit), ambas sobre
  `dev`. Plan Mode. Tarea de infra + release, sin lógica de producto. Dominio real
  decidido con Jef: `https://helenguevara.com` (normalizado a https sin barra
  final: Netlify fuerza HTTPS y ese es el canonical correcto; Jef tecleó http://).
  Placeholder `calculadora-interes.example` reemplazado en los TRES sitios que lo
  espejan (config, robots, e2e `seo.spec.ts` — este último era el tercero, no
  contemplado en el plan; su omisión rompía 3 tests de SEO). `netlify.toml`
  versionado (confirmado con Jef): `command="astro build"`, `publish="dist"`,
  `NODE_VERSION="22"` (Astro 7 exige ≥22.12; sin engines/.nvmrc el default de
  Netlify podría romper el build). Sin GA4 en 1.0.0 (confirmado): `PUBLIC_GA4_ID`
  vacío → analítica off → sin aviso de cookies necesario. Release: rama
  `release/1.0.0` desde dev con SOLO el bump (§6). `npm version minor` daría 0.2.0,
  así que se usó `npm version 1.0.0` explícito (el objetivo 1.0.0 es inequívoco:
  nombre de rama + checklist Fase 1). Footer del build muestra `v1.0.0`. 142 unit +
  36 e2e verdes, lint + build verdes, `grep` del `dist/` sin placeholder
  (canonical/hreflang/sitemap/robots en el dominio real, x-default→/en/). Revisión
  de diff con subagente fresco: diffs correctos y limpios; su BLOQUEANTE es de
  ORDEN de merge (las dos ramas salen del mismo commit de dev, así que ambas deben
  entrar a dev ANTES de dev→main o producción saldría con placeholder — ya anotado
  en el plan y en la entrega de PRs, no es defecto de contenido); su ACCIONABLE
  (README con lenguaje de placeholder) se aplicó. **Claude no mergea**: entregados
  los 3 links de PR (feature→dev, release→dev, dev→main). Trabajo humano de Jef:
  Netlify + DNS + Search Console. `main` avanza por primera vez con este release.
- **2026-07-12 · Extra (post-M7) — Ajustes de UI (Snowball, anchos, FAQ colapsable)** ✅.
  Rama `feature/ui-header-footer-faq` (base `dev`). Tarea de UI NO planeada (pedido de Jef
  antes del deploy). App renombrada a "Snowball: …" (clave `titulo` es+en; se propaga a
  `<title>`, header, JSON-LD, aria-label e `index.astro`). Header y footer: barra full-width
  con el contenido acotado a `max-w-6xl` (el ancho del contenido, `Calculadora.tsx`) para
  alinear; footer reordenado con `descargo` primero (`text-sm`) y versión/copyright sutiles
  (`text-xs font-light`) al final, conservando `data-testid="version"` y el enlace a
  yotfil.dev. FAQ reescrita: caja de tono diferenciado (`bg-fondo` + borde + rounded) con
  cada pregunta en `<details>` colapsable nativo (chevron `group-open:rotate-180`, marcador
  nativo oculto), colapsados por defecto → ocupa menos espacio; sigue indexable y el JSON-LD
  FAQPage no cambia. Tests de FAQ migrados a `summary`/`details > p` + test de colapso.
  142 unit + 36 e2e. Verificación visual claro/oscuro a 1600px. Revisión de diff con
  subagente fresco: sin bloqueantes. Mergeado a `dev` (PR #12). "Snowball" es
  provisional ("por ahora"): el nombre definitivo se cambia solo en `titulo` (es+en).
- **2026-07-12 · Extra (post-M7) — Branding de header/footer** ✅. Rama
  `feature/header-footer-branding` (base `dev`). Tarea de UI NO planeada (pedido de
  Jef sobre la marcha, fuera de la checklist). Header diferenciado con `bg-fondo` +
  `border-b border-borde` y el favicon junto al título; footer con línea de build
  (`versión · fecha · hash corto`, inyectados en `astro.config` vía git con fallback
  a `COMMIT_REF`/Node y filtrado de segmentos vacíos), la nota `descargo`, y
  copyright + "Creado por Yotfil" enlazando a https://www.yotfil.dev/ (`target=_blank`,
  `rel=noopener noreferrer`). Constantes `__COMMIT_HASH__`/`__COMMIT_DATE__`/
  `__BUILD_YEAR__` declaradas en `env.d.ts` y `eslint.config.js`. Claves i18n
  `footer.creadoPor`/`footer.derechos` (es+en, paridad intacta). 142 unit + 34 e2e
  (+4 branding). Verificación visual claro/oscuro con screenshots. Revisión de diff
  con subagente fresco: sin bloqueantes; su NIT (línea "· ·" sin git) se blindó.
  Mergeado a `dev` (PR #11). `main` sigue sin avanzar (el primer release es M8).
- **2026-07-12 · Sesión 7 — M7 SEO + analítica** ✅. Rama
  `feature/modulo-07-seo-analitica` (8 commits granulares sobre `dev`). Tarea
  estructural multi-archivo (Plan Mode + confirmación de 3 decisiones con Jef:
  `site` placeholder hasta M8, `@astrojs/sitemap`, redactar respuestas FAQ es+en).
  Se creó el wrapper `src/analytics/track.ts` (no-op sin `PUBLIC_GA4_ID`, tipado
  por evento) + 2 tests, y se cableó el evento `calcular` en la ruta de éxito de
  `Calculadora.calcular` (la nota de M6 que lo daba por hecho era inexacta: no
  existía). Head SEO en `Seo.astro` (description por idioma, canonical self,
  hreflang recíproco es/en + x-default→/en/, JSON-LD `WebApplication`+`FAQPage`)
  montado en `Base.astro`, snippet gtag condicional al ID, y `Faq.astro` (0 JS)
  al pie. `@astrojs/sitemap` 3.7.3 (i18n x-default, raíz excluida) + `robots.txt`;
  raíz con `noindex`. Claves i18n nuevas es+en (`seo.description`, `faq.titulo`,
  `faq.r1..r5`, 80–120 palabras), paridad intacta. 142 tests unit (+2 track) +
  28 e2e (+14: `e2e/seo.spec.ts`). Bundle isla 165,8 KB gzip < 200. Revisión de
  diff con subagente fresco contra docs/06 §2–3 y docs/07 §5: sin bloqueantes;
  verificó params del evento, no-op de `track`, hreflang recíproco, JSON-LD,
  conteo de palabras FAQ y R3 con el dato de ahorro. Su único accionable (raíz
  sin `noindex`) se aplicó + test e2e. Trampa nueva: `prettier --write .` ensució
  el diff con reflow ajeno (revertido). Pendientes humanos: en_US, respuestas FAQ
  y aviso de cookies antes del 1.0.0. `favicon.svg` (aportado por Jef) se referenció
  en el `<head>` de `Base.astro`. Mergeado a `dev` en dos PRs por dos pushes: #8
  (M7 completo) y #9 (favicon). `main` sigue sin avanzar: el primer release (1.0.0)
  es M8. 30 e2e finales (los 2 tests de favicon se sumaron a los 28 de M7).
- **2026-07-11 · Sesión 6 — M6 UI resultados Básica** ✅. Rama
  `feature/modulo-06-ui-resultados` (10 commits granulares sobre `dev`). Tarea
  estructural multi-archivo. Se cableó `aEscenario→calcular→Resultado` en la ruta
  de éxito del botón (con errores sigue el scroll+focus de M5, sin calcular) y se
  reorganizó la isla a layout de dos columnas (form / resultados fijos en desktop;
  apilado con scroll suave al calcular en mobile, respetando reduced-motion).
  Componentes nuevos (uno por archivo): `Resultado`, `CifraGrande` (+ hook
  `useContadorAnimado`), `FraseResumen`, `Torta`, `BarrasApiladas`, `TablaAnual`,
  `Leyenda`, `EstadoVacio`, `PatronesDefs`, `series.ts`. Tokens definitivos +
  tema oscuro con contraste AA verificado por script (amber/verde/accion del tema
  claro ajustados). Fuentes self-hosted Inter/Lexend (subset latin, variable) con
  preload. Toggle de tema + anti-FOUC en `Base.astro`. Recharts 3.9. Claves i18n
  nuevas es+en (`tabla.*`, `tema.*`, `leyenda.*`, `resultados.titulo`), paridad
  intacta. 140 tests unit (sin nuevos; el motor y el esquema ya cubrían la
  lógica) + 14 e2e (+2: F1 cálculo básico con frase exacta 20.514,24 y tabla de
  10 filas; F9 reduced-motion). Bundle isla ~169 KB gzip < 200. Revisión de diff
  con subagente fresco contra docs/04 §4, 05 y 06 §1: sin bloqueantes; verificó la
  aritmética de composición ejecutando el motor (cuadra a 0/ruido float). Sus 2
  NITs accionables se aplicaron (campo `color` muerto en `series.ts`;
  `aria-label` del landmark de resultados con clave propia `resultados.titulo`);
  el 3.º (`vacio.cta` huérfana) es intencional (diferido a M12). Verificación
  visual en claro/oscuro/mobile-en con screenshots. PR #6 mergeado a `dev`.
  Pendientes humanos: en_US y respuestas de FAQ antes del 1.0.0.
- **2026-07-11 · Sesión 5 — M5 UI formulario Básica** ✅. Rama
  `feature/modulo-05-ui-formulario` (6 commits granulares sobre `dev`). Tarea
  estructural multi-archivo (no TDD de motor). Se expuso `rangos` como fuente única
  en `formulario.ts` (refactor sin cambio de comportamiento: 98 tests de esquema
  intactos) y se creó `mapearError` (+5 tests) que cierra la deuda de M4: claves
  `errores.<campo>.<sufijo>` → plantilla `error.<sufijo>` con min/max, `duracion`
  por unidad. Tokens del formulario en `tokens.css` (semánticos + `@theme inline`;
  primitivas provisionales). Claves i18n nuevas en es+en (`pasos.*`,
  `campos.duracion.unidad.*`, `campos.frecuencia.opciones.*`, `tabs.aria`). Isla
  `Calculadora` reescrita: estado en strings, validación al blur, Calcular solo
  valida (scroll+focus al primero); subcomponentes `Tabs` (WAI-ARIA), `Campo`,
  `CampoDuracion`, `CampoFrecuencia`. 140 tests verdes (+5) + 12 e2e (+4:
  defaults, tabs conservan valores, F4 error inline, F8 idioma). Revisión de diff
  con subagente fresco contra docs/04 §1–3 y docs/05: sin bloqueantes; su única
  nota (redacción de comentario) se verificó como ya correcta, no se tocó. Pendiente
  humano: revisar en_US antes del 1.0.0 (heredado de M4).
- **2026-07-11 · Sesión 4 — M4 i18n base** ✅. Rama
  `feature/modulo-04-i18n-base` sobre `dev`. Rutas estáticas `/es/` `/en/` con
  shell compartido `Base.astro`; raíz `pages/index.astro` redirige por
  `navigator.language` (`is:inline`, conserva query+hash, fallback sin JS).
  Diccionarios `es.json` (canónico) + `en.json` con el copy literal de docs/07
  §3/§4/§6 + títulos FAQ (§5); errores genéricos con `{min}/{max}`. Helpers
  `locale`/`formatMoney`/`t` (una interfaz por archivo). Isla `Calculadora`
  recibe `{ locale, dict }`. Elemento boundaries `layouts`. 135 tests verdes (14
  nuevos: formatMoney por locale con NBSP normalizado, `t` con interpolación y
  clave-como-fallback, paridad es↔en de claves Y de placeholders) + 8 e2e
  (redirección por idioma, query preservada, fallback sin JS, ambos locales,
  versión desktop/mobile, selector). Revisión de diff con subagente fresco:
  faithful a docs/07; su único "bloqueante" (mismatch de claves de error
  `errores.<campo>.*` del esquema vs `error.*` del diccionario) se verificó como
  la decisión ya acordada — el mapeo es trabajo de M5, anotado en "Próximo paso".
  Su nota accionable (la paridad no cubría placeholders) se aplicó: test extra.
  PR #4 mergeado a `dev`. Pendiente humano: revisar el en_US antes del 1.0.0.
- **2026-07-11 · Sesión 3 — M3 Validación y tipos** ✅. Rama
  `feature/modulo-03-validacion-tipos` (5 commits granulares sobre `dev`).
  TDD estricto en dos ciclos (esquema y mapper): tests primero, rojo
  verificado, luego implementación. 121 tests verdes (98 nuevos: tabla §6
  parametrizada por campo + duración por unidad + frecuencia-default +
  `aEscenario`). zod 4.4.3. Revisión de diff con subagente fresco (probó 22
  bordes de coerción URL con node): sin bloqueantes ni accionables; sus 3
  notas se verificaron contra el código y quedaron como decisiones/trampas.
  PR #3 mergeado a `dev`.
- **2026-07-11 · Sesión 2 — M2 Motor núcleo** ✅. Rama
  `feature/modulo-02-motor-nucleo` (4 commits granulares sobre `dev`). TDD
  estricto: tests de tablas primero (rojo verificado), luego implementación.
  23 tests verdes: tabla de tasas §1 (8 anclas), N1–N7, escenario §3
  (677 839,48), filas anuales (parcial marcada, cuadre con totales), bordes.
  Revisión de diff con subagente fresco: sin bloqueantes; su nota accionable
  (superficie pública extra en el barrel) se aplicó; las otras dos quedaron
  anotadas como decisión/trampa. PR #2 mergeado a `dev`.
- **2026-07-11 · Sesión 1 — M1 Setup** ✅. Rama `feature/modulo-01-setup`
  (12 commits granulares sobre `dev`). Scaffold manual (no `npm create astro`:
  pisaba README.md). Build + Vitest (1/1) + Playwright e2e (2/2, chromium,
  home carga y footer muestra `v0.1.0` también en mobile) + lint verdes.
  Candados de límites verificados empíricamente con violaciones temporales
  (core→react, core→Date, core→ui, ui→pages: todas bloqueadas). Revisión de
  diff con subagente fresco: sin bloqueantes; sus 2 hallazgos accionables
  (falta de hook pre-commit, ui→styles fuera de la letra de la spec) se
  resolvieron con husky y decisión anotada. Pendiente humano: nada nuevo.
