# ESTADO.md — Bitácora viva

> Única fuente de la checklist. Se actualiza al cierre de CADA sesión.

## Próximo paso

Módulo 5 (UI formulario Básica: layout, tabs, pasos 1–4, validación inline).
Leer `docs/04` §1–3 y `docs/05` según la tabla de ruteo de CLAUDE.md.
**Pendiente heredado de M4 (bloqueante para las validaciones):** el esquema Zod
(M3) emite claves `errores.<campo>.rango|.numero|.entero`, pero el diccionario
guarda plantillas genéricas `error.rango|.numero|.entero` con `{min}/{max}`
(docs/07 §3). M5 debe (a) exponer min/max por campo desde `formulario.ts` (hoy
literales inline en `numeroEnRango`) y (b) mapear el sufijo de la clave del
esquema a la plantilla genérica e interpolar min/max. Sin ese mapeo, los errores
renderizarían la clave cruda. Además, `resultados.*` y `pasos.*` no se sembraron
en M4 (docs/07 no da su texto literal): nacen en M5/M6 desde `docs/04`.

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
- [ ] **M5 · UI formulario Básica**: layout, tabs (Avanzada/Experto visibles pero
      con contenido de Fase 2 oculto), pasos 1–4, validación inline (`docs/04`).
- [ ] **M6 · UI resultados**: cifra grande + frase, torta, barras, tabla,
      animación firma, ejemplo precargado, temas claro/oscuro (`docs/04` §4, `docs/05`).
- [ ] **M7 · SEO + analítica**: metas, hreflang, schema.org, GA4 (4 eventos),
      sitemap (`docs/06`).
- [ ] **M8 · Deploy**: Netlify + release 1.0.0.

### Fase 2 — Avanzada y Experto (release 1.1.0)

- [ ] **M9 · Motor escalonado** [TDD] (`docs/02` §4).
- [ ] **M10 · Motor glide path gradual** [TDD] (`docs/02` §5).
- [ ] **M11 · Métricas derivadas** [TDD]: ahorro del escalonado, costo de la
      protección, banda de varianza (`docs/06` §1).
- [ ] **M12 · UI tab Avanzada**: sección "Impulso inicial" + métrica de ahorro.
- [ ] **M13 · UI tab Experto**: "Protección final" + varianza + costo de la
      protección. Release 1.1.0.

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

## Trampas conocidas

- El caché global de npm (`~/.npm/_cacache`) tiene archivos propiedad de
  `root` en esta máquina y algunos installs fallan con EACCES/EEXIST.
  Arreglo permanente: `sudo chown -R $(whoami) ~/.npm`. Workaround usado en
  M1: `npm_config_cache` apuntando a un caché alternativo.

- El motor NO redondea dentro de la iteración; solo la capa de presentación
  redondea. Redondear adentro rompe las anclas de `docs/02`.
- La tasa reducida del glide usa la MISMA convención (nominal + selector) que
  la principal; no convertirla dos veces.
- `Intl.NumberFormat` difiere entre Node y navegador en espacios no separables:
  en asserts de e2e comparar con `\u00A0` normalizado.
- Los bloques del glide se cuentan DESDE EL FINAL (`docs/02` §5); contarlos
  desde el inicio de la protección da otra escalera en duraciones no múltiplo de 12.

- `Number("") === 0` en JS: NO usar `z.coerce.number()` directo para campos de
  formulario/URL — un input vacío se volvería 0 en vez de default. El esquema
  neutraliza esto con el preprocess `aNumero` ("", null y "  " → ausente).
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
- El hook pre-commit corre `eslint .` sobre TODO el árbol, no solo lo staged: no
  se puede commitear en un orden que deje `src/layouts/` sin su elemento de
  boundaries (daría "unknown element"). Config de boundaries primero.

## Historial de sesiones

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
