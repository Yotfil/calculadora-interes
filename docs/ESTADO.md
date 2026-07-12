# ESTADO.md — Bitácora viva

> Única fuente de la checklist. Se actualiza al cierre de CADA sesión.

## Próximo paso

Módulo 7 (SEO + analítica): `<title>`/meta description por idioma, hreflang
recíproco + x-default → `/en/`, canonical, HTML semántico con copy educativo y
FAQ (respuestas 80–120 palabras, docs/07 §5), schema.org (`WebApplication` +
`FAQPage` JSON-LD), sitemap.xml + robots.txt, y GA4 con EXACTAMENTE 4 eventos
detrás de `src/analytics/track` (no-op si `PUBLIC_GA4_ID` vacío). Leer
`docs/06` §2–3 según la tabla de ruteo.
**Base que deja M6 para M7:** el motor está cableado y la Básica calcula/renderiza
completa; el evento GA4 `calcular` se dispara desde la ruta de éxito de
`Calculadora.calcular` (`tab`, `con_impulso`, `con_proteccion`). `src/analytics/`
sigue vacío (solo `.gitkeep`): M7 crea `track`. Pendientes humanos heredados:
revisar el en_US antes del 1.0.0 y las respuestas de FAQ (solo títulos hoy).
El presupuesto JS de la isla ya está en ~169 KB gzip (Recharts incluido; tope
200 KB, docs/06 §3): vigilarlo al inyectar el snippet de GA4.

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
  añadido de Fase 2 debe medirse contra ese margen.

## Historial de sesiones

- **2026-07-11 · Sesión 6 — M6 UI resultados Básica** ✅. Rama
  `feature/modulo-06-ui-resultados` (9 commits granulares sobre `dev`). Tarea
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
  visual en claro/oscuro/mobile-en con screenshots. Pendientes humanos: en_US y
  respuestas de FAQ antes del 1.0.0.
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
