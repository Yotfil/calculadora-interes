# ESTADO.md — Bitácora viva

> Única fuente de la checklist. Se actualiza al cierre de CADA sesión.

## Próximo paso

Módulo 2 (motor núcleo, TDD desde las tablas de `docs/02` §1–3, §7).
Leer `docs/02` §1–3 y §7 según la tabla de ruteo de CLAUDE.md.

## Checklist canónica de módulos

### Fase 1 — Básica completa y publicada (release 1.0.0)

- [x] **M1 · Setup**: Astro + React + Tailwind + Vitest + Playwright +
      eslint-plugin-boundaries + Prettier; estructura de `docs/01` §3;
      `.env.example`; script de versión en UI.
- [ ] **M2 · Motor núcleo** [TDD]: tasas equivalentes, simulación mensual,
      resultado con filas anuales y totales (`docs/02` §1–3, §7).
- [ ] **M3 · Validación y tipos** [TDD]: esquemas Zod, rangos y clampeos
      (`docs/02` §6), tipos compartidos core↔UI.
- [ ] **M4 · i18n base**: rutas `/es/` `/en/`, diccionarios, `formatMoney`,
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

## Historial de sesiones

- **2026-07-11 · Sesión 1 — M1 Setup** ✅. Rama `feature/modulo-01-setup`
  (12 commits granulares sobre `dev`). Scaffold manual (no `npm create astro`:
  pisaba README.md). Build + Vitest (1/1) + Playwright e2e (2/2, chromium,
  home carga y footer muestra `v0.1.0` también en mobile) + lint verdes.
  Candados de límites verificados empíricamente con violaciones temporales
  (core→react, core→Date, core→ui, ui→pages: todas bloqueadas). Revisión de
  diff con subagente fresco: sin bloqueantes; sus 2 hallazgos accionables
  (falta de hook pre-commit, ui→styles fuera de la letra de la spec) se
  resolvieron con husky y decisión anotada. Pendiente humano: nada nuevo.
